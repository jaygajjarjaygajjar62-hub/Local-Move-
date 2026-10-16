import jwt from 'jsonwebtoken'
import { db } from '../config/db.js'
import { ENV } from '../config/env.js'

export async function loginCustomer(phone: string, name = 'Kunal Shah') {
  const cleanPhone = phone.replace(/\D/g, '')

  // Look up existing user
  let userResult = await db.execute({
    sql: `SELECT * FROM users WHERE phone = ?;`,
    args: [cleanPhone],
  })

  let user: any

  if (userResult.rows.length === 0) {
    const userId = 'cust-' + Math.random().toString(36).slice(2, 8)
    const email = `${name.toLowerCase().replace(/\s+/g, '.')}@example.com`

    await db.execute({
      sql: `INSERT INTO users (id, role, name, phone, email, language) VALUES (?, 'customer', ?, ?, ?, 'en');`,
      args: [userId, name, cleanPhone, email],
    })

    await db.execute({
      sql: `INSERT INTO customers (user_id, wallet_balance) VALUES (?, 350.00);`,
      args: [userId],
    })

    user = {
      id: userId,
      role: 'customer',
      name,
      phone: cleanPhone,
      email,
      isLoggedIn: true,
    }
  } else {
    const row = userResult.rows[0]
    user = {
      id: row.id,
      role: row.role,
      name: row.name,
      phone: row.phone,
      email: row.email,
      isLoggedIn: true,
    }
  }

  const token = jwt.sign(
    {
      id: user.id,
      role: 'customer',
      name: user.name,
      phone: user.phone,
    },
    ENV.JWT_SECRET,
    { expiresIn: '30d' },
  )

  return { user, token }
}

export async function loginDriver(phone: string) {
  const cleanPhone = phone.replace(/\D/g, '')

  const driverResult = await db.execute({
    sql: `SELECT u.id, u.name, u.phone, u.email, d.* 
          FROM users u 
          JOIN drivers d ON u.id = d.id 
          WHERE u.phone = ?;`,
    args: [cleanPhone],
  })

  let driver: any

  if (driverResult.rows.length === 0) {
    // If not existing, sign in default demo driver drv-1
    const defaultDrv = await db.execute({
      sql: `SELECT u.id, u.name, u.phone, u.email, d.* 
            FROM users u 
            JOIN drivers d ON u.id = d.id 
            WHERE u.id = 'drv-1';`,
      args: [],
    })
    driver = defaultDrv.rows[0]
  } else {
    driver = driverResult.rows[0]
  }

  const token = jwt.sign(
    {
      id: driver.id,
      role: 'driver',
      name: driver.name,
      phone: driver.phone,
    },
    ENV.JWT_SECRET,
    { expiresIn: '30d' },
  )

  return {
    driver: {
      id: driver.id,
      name: driver.name,
      phone: driver.phone,
      vehicleType: driver.vehicle_type,
      vehicleNumber: driver.vehicle_number,
      vehicleModel: driver.vehicle_model,
      status: driver.status,
      isLoggedIn: true,
    },
    token,
  }
}

export async function getUserById(userId: string) {
  const result = await db.execute({
    sql: `SELECT id, role, admin_sub_role, name, phone, email, language FROM users WHERE id = ?;`,
    args: [userId],
  })

  if (result.rows.length === 0) return null
  return result.rows[0]
}
