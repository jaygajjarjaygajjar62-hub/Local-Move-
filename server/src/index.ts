import { createApp } from './app.js'
import { ENV } from './config/env.js'
import { db } from './config/db.js'
import { createSchema } from './db/schema.js'
import { seedDatabase } from './db/seed.js'

async function bootstrap() {
  await db.init()

  // Ensure tables and demo data exist
  try {
    const check = await db.execute(`SELECT to_regclass('public.users') AS tbl_exists;`)
    if (!check.rows[0]?.tbl_exists) {
      console.log('📦 Initializing PostgreSQL schema & demo datasets for Local Move...')
      await createSchema()
      await seedDatabase()
    }
  } catch (err) {
    console.log('📦 Ensuring PostgreSQL schema & demo datasets are present...')
    await createSchema()
    await seedDatabase()
  }

  const app = createApp()
  const port = ENV.PORT

  app.listen(port, () => {
    console.log(`=======================================================`)
    console.log(`🚀 Local Move Backend API is running on port ${port}`)
    console.log(`📡 Base URL: http://localhost:${port}/api/v1`)
    console.log(`💚 Health Check: http://localhost:${port}/api/v1/health`)
    console.log(`🐘 PostgreSQL Port: ${ENV.PG_PORT} (Wire Protocol Active)`)
    console.log(`=======================================================`)
  })
}

bootstrap().catch((err) => {
  console.error('Fatal backend bootstrap error:', err)
  process.exit(1)
})
