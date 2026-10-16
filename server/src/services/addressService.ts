import { db } from '../config/db.js'

export async function getAddresses(userId = 'cust-demo') {
  const result = await db.execute({
    sql: `SELECT * FROM addresses WHERE user_id = ? ORDER BY created_at DESC;`,
    args: [userId],
  })

  return result.rows.map((row) => ({
    id: row.id as string,
    title: row.title as string,
    fullAddress: row.full_address as string,
    landmark: (row.landmark as string) || undefined,
    floor: (row.floor as string) || undefined,
    instructions: (row.instructions as string) || undefined,
    city: row.city as string,
    coords: {
      lat: Number(row.lat),
      lng: Number(row.lng),
    },
  }))
}

export async function addAddress(userId = 'cust-demo', addr: any) {
  const id = addr.id || 'addr-' + Date.now()
  await db.execute({
    sql: `INSERT INTO addresses (id, user_id, title, full_address, landmark, floor, instructions, city, lat, lng)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
    args: [
      id,
      userId,
      addr.title || 'Saved Place',
      addr.fullAddress,
      addr.landmark || null,
      addr.floor || null,
      addr.instructions || null,
      addr.city || 'Ahmedabad',
      addr.coords?.lat || 23.025,
      addr.coords?.lng || 72.535,
    ],
  })

  return {
    id,
    title: addr.title || 'Saved Place',
    fullAddress: addr.fullAddress,
    landmark: addr.landmark,
    floor: addr.floor,
    instructions: addr.instructions,
    city: addr.city || 'Ahmedabad',
    coords: addr.coords || { lat: 23.025, lng: 72.535 },
  }
}

export async function deleteAddress(addressId: string) {
  await db.execute({
    sql: `DELETE FROM addresses WHERE id = ?;`,
    args: [addressId],
  })
  return { success: true }
}
