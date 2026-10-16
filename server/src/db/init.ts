import { db } from '../config/db.js'
import { createSchema } from './schema.js'
import { seedDatabase } from './seed.js'

async function init() {
  console.log('🐘 Initializing PostgreSQL database for Local Move...')
  await createSchema()
  console.log('✅ PostgreSQL Schema created successfully!')

  console.log('🌱 Seeding initial datasets...')
  await seedDatabase()
  console.log('🎉 PostgreSQL Database initialization & seed complete!')

  await db.close()
}

init().catch((err) => {
  console.error('❌ Failed to initialize database:', err)
  process.exit(1)
})
