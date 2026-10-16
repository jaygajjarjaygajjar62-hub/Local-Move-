import { db } from '../config/db.js';
export async function getSupportTickets(filter) {
    let query = `SELECT * FROM support_tickets WHERE 1=1`;
    const args = [];
    if (filter?.userId) {
        query += ` AND user_id = ?`;
        args.push(filter.userId);
    }
    if (filter?.status) {
        query += ` AND status = ?`;
        args.push(filter.status);
    }
    query += ` ORDER BY updated_at DESC`;
    const result = await db.execute({ sql: query, args });
    const tickets = [];
    for (const row of result.rows) {
        const messagesResult = await db.execute({
            sql: `SELECT * FROM ticket_messages WHERE ticket_id = ? ORDER BY timestamp ASC;`,
            args: [row.id],
        });
        tickets.push({
            id: row.id,
            orderId: row.order_id || undefined,
            userId: row.user_id,
            userRole: row.user_role,
            userName: row.user_name,
            userPhone: row.user_phone,
            subject: row.subject,
            category: row.category,
            status: row.status,
            priority: row.priority,
            createdAt: row.created_at,
            updatedAt: row.updated_at,
            messages: messagesResult.rows.map((m) => ({
                id: m.id,
                sender: m.sender,
                senderName: m.sender_name,
                text: m.text,
                timestamp: m.timestamp,
            })),
        });
    }
    return tickets;
}
export async function getTicketById(ticketId) {
    const tickets = await getSupportTickets();
    return tickets.find((t) => t.id === ticketId) || null;
}
export async function createSupportTicket(payload) {
    const ticketId = 'TCK-' + (200 + Math.floor(Math.random() * 800));
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
    });
    // Insert initial message
    await db.execute({
        sql: `INSERT INTO ticket_messages (id, ticket_id, sender, sender_name, text) VALUES (?, ?, 'user', ?, ?);`,
        args: [`msg-${Date.now()}`, ticketId, payload.userName, payload.message],
    });
    return getTicketById(ticketId);
}
export async function addTicketMessage(ticketId, text, sender, senderName) {
    const msgId = `msg-${Date.now()}`;
    await db.execute({
        sql: `INSERT INTO ticket_messages (id, ticket_id, sender, sender_name, text) VALUES (?, ?, ?, ?, ?);`,
        args: [msgId, ticketId, sender, senderName, text],
    });
    await db.execute({
        sql: `UPDATE support_tickets SET updated_at = CURRENT_TIMESTAMP WHERE id = ?;`,
        args: [ticketId],
    });
    return getTicketById(ticketId);
}
export async function updateTicketStatus(ticketId, status) {
    await db.execute({
        sql: `UPDATE support_tickets SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?;`,
        args: [status, ticketId],
    });
    return getTicketById(ticketId);
}
//# sourceMappingURL=supportService.js.map