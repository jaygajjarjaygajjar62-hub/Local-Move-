import net from 'node:net'
import path from 'node:path'
import fs from 'node:fs'
import { fileURLToPath } from 'node:url'
import pg from 'pg'
import { PGlite } from '@electric-sql/pglite'
import { fromNodeSocket } from 'pg-gateway/node'
import { ENV } from './env.js'

const { Pool } = pg

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Ensure data and uploads directory exist
const dataDir = path.resolve(__dirname, '../../data')
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true })
}

const uploadsDir = path.resolve(__dirname, '../../uploads')
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
}

const pgDataDir = path.resolve(dataDir, 'postgres')
if (!fs.existsSync(pgDataDir)) {
  fs.mkdirSync(pgDataDir, { recursive: true })
}

export interface ExecuteOptions {
  sql: string
  args?: any[]
}

export interface ExecuteResult {
  rows: any[]
  rowCount: number
}

// Convert SQLite '?' placeholders to PostgreSQL '$1', '$2', ...
export function convertPlaceholders(sql: string): string {
  let paramIndex = 1
  return sql.replace(/\?/g, () => `$${paramIndex++}`)
}

class PostgresDatabase {
  private pglite: PGlite | null = null
  private pool: pg.Pool | null = null
  private tcpServer: net.Server | null = null
  private mode: 'pool' | 'pglite' = 'pglite'
  private isInitialized = false

  async init(): Promise<void> {
    if (this.isInitialized) return

    const isExternalPg =
      ENV.DATABASE_URL.startsWith('postgres://') ||
      ENV.DATABASE_URL.startsWith('postgresql://')

    // First attempt: If DATABASE_URL is set, test if an external PostgreSQL daemon is reachable
    if (isExternalPg) {
      try {
        const testPool = new Pool({
          connectionString: ENV.DATABASE_URL,
          connectionTimeoutMillis: 1500,
        })
        const client = await testPool.connect()
        await client.query('SELECT 1;')
        client.release()

        this.pool = testPool
        this.mode = 'pool'
        this.isInitialized = true
        console.log(`✅ [PostgreSQL] Connected to active external PostgreSQL instance via DATABASE_URL.`)
        return
      } catch (err: any) {
        console.log(`ℹ️ [PostgreSQL] No external PostgreSQL daemon running at ${ENV.DATABASE_URL} (${err.code || err.message}).`)
        console.log(`🚀 [PostgreSQL] Initializing high-performance embedded PostgreSQL engine with persistent storage...`)
      }
    }

    // Second mode: PGlite with persistent disk storage + TCP Wire Server on port 5432
    try {
      this.pglite = new PGlite(pgDataDir)
      await this.pglite.waitReady
      this.mode = 'pglite'
      this.isInitialized = true
      console.log(`🐘 [PostgreSQL] Persistent PostgreSQL database initialized at ${pgDataDir}`)

      // Start TCP PostgreSQL Wire Server on port 5432 so the user's IDE Database Client extension connects!
      await this.startTcpServer(ENV.PG_PORT)
    } catch (err: any) {
      console.error(`❌ [PostgreSQL] Error initializing embedded PostgreSQL:`, err)
      throw err
    }
  }

  private async startTcpServer(port = 5432): Promise<void> {
    if (!this.pglite) return

    return new Promise((resolve) => {
      const server = net.createServer(async (socket) => {
        try {
          await fromNodeSocket(socket, {
            serverVersion: '16.3 (PostgreSQL - LocalMove Engine)',
            auth: { method: 'trust' },
            onMessage: async (msg) => {
              if (!this.pglite) return new Uint8Array(0)
              const res = await this.pglite.execProtocol(msg)
              return res.data
            },
          })
        } catch (err) {
          socket.destroy()
        }
      })

      server.on('error', (err: any) => {
        if (err.code === 'EADDRINUSE') {
          console.log(`ℹ️ [PostgreSQL] TCP Port ${port} is already in use by another PostgreSQL service. Embedded database will operate in in-process mode.`)
        } else {
          console.warn(`⚠️ [PostgreSQL] TCP Server warning:`, err.message)
        }
        resolve()
      })

      server.listen(port, () => {
        this.tcpServer = server
        console.log(`========================================================================`)
        console.log(`🐘 [PostgreSQL Server] Listening on port ${port} (Wire Protocol)`)
        console.log(`🔌 Antigravity IDE "Database Client" Connection Info:`)
        console.log(`   • Host:     127.0.0.1 (or localhost)`)
        console.log(`   • Port:     ${port}`)
        console.log(`   • Database: ${ENV.PG_DATABASE}`)
        console.log(`   • User:     ${ENV.PG_USER}`)
        console.log(`   • Password: ${ENV.PG_PASSWORD}`)
        console.log(`========================================================================`)
        resolve()
      })
    })
  }

  async execute(input: string | ExecuteOptions): Promise<ExecuteResult> {
    if (!this.isInitialized) {
      await this.init()
    }

    const rawSql = typeof input === 'string' ? input : input.sql
    const rawArgs = typeof input === 'string' ? [] : input.args || []

    const sql = convertPlaceholders(rawSql)

    // Coerce parameters if needed (e.g., boolean numbers to booleans where appropriate)
    const args = rawArgs.map((arg) => (arg === undefined ? null : arg))

    if (this.mode === 'pool' && this.pool) {
      const result = await this.pool.query(sql, args)
      return {
        rows: result.rows,
        rowCount: result.rowCount ?? 0,
      }
    } else if (this.pglite) {
      // For multi-statement or non-parameterized DDL statements
      if (args.length === 0) {
        const result = await this.pglite.exec(sql)
        const lastResult = Array.isArray(result) ? result[result.length - 1] : result
        return {
          rows: (lastResult as any)?.rows || [],
          rowCount: (lastResult as any)?.rowCount || (lastResult as any)?.affectedRows || 0,
        }
      } else {
        const result = await this.pglite.query(sql, args)
        return {
          rows: result.rows || [],
          rowCount: result.rowCount ?? (result as any).affectedRows ?? 0,
        }
      }
    }

    throw new Error('PostgreSQL database is not initialized.')
  }

  async close(): Promise<void> {
    if (this.tcpServer) {
      this.tcpServer.close()
      this.tcpServer = null
    }
    if (this.pool) {
      await this.pool.end()
      this.pool = null
    }
    if (this.pglite) {
      await this.pglite.close()
      this.pglite = null
    }
    this.isInitialized = false
  }
}

const dbInstance = new PostgresDatabase()

export const db = {
  execute: (input: string | ExecuteOptions) => dbInstance.execute(input),
  query: (sql: string, args: any[] = []) => dbInstance.execute({ sql, args }),
  init: () => dbInstance.init(),
  close: () => dbInstance.close(),
}

// Backward-compatible initPragmas -> delegates to initDatabase
export async function initPragmas() {
  await dbInstance.init()
}

export async function initDatabase() {
  await dbInstance.init()
}
