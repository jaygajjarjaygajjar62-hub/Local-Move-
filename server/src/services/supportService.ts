import { db } from '../config/db.js'

export async function getSupportTickets(filter?: { userId?: string; status?: string }) {
  let query = `SELECT * FROM support_tickets WHERE 1=1`
  const args: any[] = []

  if (filter?.userId) {
    query += ` AND user_id = ?`
    args.push(filter.userId)
  }

  if (filter?.status) {
    query += ` AND status = ?`
    args.push(filter.status)
  }

  query += ` ORDER BY updated_at DESC`

  const result = await db.execute({ sql: query, args })

  const tickets: any[] = []
  for (const row of result.rows) {
    const messagesResult = await db.execute({
      sql: `SELECT * FROM ticket_messages WHERE ticket_id = ? ORDER BY timestamp ASC;`,
      args: [row.id],
    })

    tickets.push({
      id: row.id as string,
      orderId: (row.order_id as string) || undefined,
      userId: row.user_id as string,
      userRole: row.user_role as any,
      userName: row.user_name as string,
      userPhone: row.user_phone as string,
      subject: row.subject as string,
      category: row.category as any,
      status: row.status as any,
      priority: row.priority as any,
      createdAt: row.created_at as string,
      updatedAt: row.updated_at as string,
      messages: messagesResult.rows.map((m) => ({
        id: m.id as string,
        sender: m.sender as 'user' | 'agent',
        senderName: m.sender_name as string,
        text: m.text as string,
        timestamp: m.timestamp as string,
      })),
    })
  }

  return tickets
}

export async function getTicketById(ticketId: string) {
  const tickets = await getSupportTickets()
  return tickets.find((t) => t.id === ticketId) || null
}

export async function createSupportTicket(payload: {
  orderId?: string
  userId: string
  userRole: string
  userName: string
  userPhone: string
  subject: string
  category: string
  priority?: string
  message: string
}) {
  const ticketId = 'TCK-' + (200 + Math.floor(Math.random() * 800))

  await db.execute({
    sql: `INSERT INTO support_tickets (
      id, order_id, user_id, user_role, user_name, user_phone, subject, category, status, priority
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'open', ?);`,
    args: [
      ticketId,
      payload.orderId || null,
      payload.userId,
      payload.userRole,
      payload.userName,
      payload.userPhone,
      payload.subject,
      payload.category,
      payload.priority || 'medium',
    ],
  })

  // Insert initial message
  await db.execute({
    sql: `INSERT INTO ticket_messages (id, ticket_id, sender, sender_name, text) VALUES (?, ?, 'user', ?, ?);`,
    args: [`msg-${Date.now()}`, ticketId, payload.userName, payload.message],
  })

  return getTicketById(ticketId)
}

export async function addTicketMessage(ticketId: string, text: string, sender: 'user' | 'agent', senderName: string) {
  const msgId = `msg-${Date.now()}`
  await db.execute({
    sql: `INSERT INTO ticket_messages (id, ticket_id, sender, sender_name, text) VALUES (?, ?, ?, ?, ?);`,
    args: [msgId, ticketId, sender, senderName, text],
  })

  await db.execute({
    sql: `UPDATE support_tickets SET updated_at = CURRENT_TIMESTAMP WHERE id = ?;`,
    args: [ticketId],
  })

  return getTicketById(ticketId)
}

export async function updateTicketStatus(ticketId: string, status: string) {
  await db.execute({
    sql: `UPDATE support_tickets SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?;`,
    args: [status, ticketId],
  })
  return getTicketById(ticketId)
}
