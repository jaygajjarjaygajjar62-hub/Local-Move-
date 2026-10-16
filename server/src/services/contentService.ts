import { db } from '../config/db.js'

export async function getProhibitedItems() {
  const result = await db.execute(`SELECT * FROM prohibited_items WHERE is_active = 1 ORDER BY fine_amount DESC;`)
  return result.rows.map((r) => ({
    id: r.id as string,
    name: r.name as string,
    category: r.category as string,
    fineAmount: Number(r.fine_amount),
    riskLevel: r.risk_level as 'critical' | 'high' | 'medium',
  }))
}

export async function addProhibitedItem(item: { name: string; category: string; fineAmount: number; riskLevel: string }) {
  const id = `p-${Date.now()}`
  await db.execute({
    sql: `INSERT INTO prohibited_items (id, name, category, fine_amount, risk_level) VALUES (?, ?, ?, ?, ?);`,
    args: [id, item.name, item.category, item.fineAmount, item.riskLevel],
  })
  return { id, ...item }
}

export async function deleteProhibitedItem(id: string) {
  await db.execute({
    sql: `DELETE FROM prohibited_items WHERE id = ?;`,
    args: [id],
  })
  return { success: true }
}

export async function getFAQs(category?: string) {
  let query = `SELECT * FROM faqs WHERE is_active = 1`
  const args: any[] = []
  if (category) {
    query += ` AND category = ?`
    args.push(category)
  }
  const result = await db.execute({ sql: query, args })
  return result.rows.map((r) => ({
    id: r.id as string,
    category: r.category as 'customer' | 'driver' | 'safety',
    question: r.question as string,
    answer: r.answer as string,
  }))
}

export async function addFAQ(faq: { category: string; question: string; answer: string }) {
  const id = `faq-${Date.now()}`
  await db.execute({
    sql: `INSERT INTO faqs (id, category, question, answer) VALUES (?, ?, ?, ?);`,
    args: [id, faq.category, faq.question, faq.answer],
  })
  return { id, ...faq }
}
