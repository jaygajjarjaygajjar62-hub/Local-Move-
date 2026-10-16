import { db } from '../config/db.js'

async function verify() {
  console.log('🔍 Connecting to PostgreSQL database for verification...')
  await db.init()

  const tables = [
    'users',
    'customers',
    'drivers',
    'driver_documents',
    'addresses',
    'orders',
    'order_proofs',
    'order_timeline',
    'order_ratings',
    'wallet_transactions',
    'damage_claims',
    'support_tickets',
    'ticket_messages',
    'pricing_config',
    'prohibited_items',
    'faqs',
    'notifications',
    'audit_logs',
  ]

  console.log('\n================== POSTGRESQL TABLES VERIFICATION ==================')
  for (const t of tables) {
    const res = await db.execute(`SELECT COUNT(*) AS total FROM ${t};`)
    console.log(`   • ${t.padEnd(22)} : ${res.rows[0].total} records`)
  }
  console.log('====================================================================\n')

  await db.close()
}

verify().catch((err) => {
  console.error('Verification failed:', err)
  process.exit(1)
})
