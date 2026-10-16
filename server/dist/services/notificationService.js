import { db } from '../config/db.js';
export async function getNotifications(userId = 'cust-demo', filter = 'all') {
    let query = `SELECT * FROM notifications WHERE (user_id = ? OR user_id IS NULL)`;
    const args = [userId];
    if (filter !== 'all') {
        query += ` AND category = ?`;
        args.push(filter);
    }
    query += ` ORDER BY timestamp DESC;`;
    const result = await db.execute({ sql: query, args });
    return result.rows.map((r) => ({
        id: r.id,
        title: r.title,
        description: r.description,
        category: r.category,
        isRead: Boolean(r.is_read),
        orderId: r.order_id || undefined,
        actionUrl: r.action_url || undefined,
        actionLabel: r.action_label || undefined,
        timestamp: r.timestamp,
    }));
}
export async function markNotificationsRead(userId = 'cust-demo', notifId) {
    if (notifId) {
        await db.execute({
            sql: `UPDATE notifications SET is_read = 1 WHERE id = ? AND (user_id = ? OR user_id IS NULL);`,
            args: [notifId, userId],
        });
    }
    else {
        await db.execute({
            sql: `UPDATE notifications SET is_read = 1 WHERE user_id = ? OR user_id IS NULL;`,
            args: [userId],
        });
    }
    return { success: true };
}
//# sourceMappingURL=notificationService.js.map