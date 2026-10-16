import { db } from '../config/db.js';
export async function getWallet(userId = 'cust-demo') {
    const customer = await db.execute({
        sql: `SELECT wallet_balance FROM customers WHERE user_id = ?;`,
        args: [userId],
    });
    const balance = customer.rows.length > 0 ? Number(customer.rows[0].wallet_balance) : 350.0;
    const transactionsResult = await db.execute({
        sql: `SELECT * FROM wallet_transactions WHERE customer_id = ? ORDER BY timestamp DESC;`,
        args: [userId],
    });
    const transactions = transactionsResult.rows.map((r) => ({
        id: r.id,
        title: r.title,
        amount: Number(r.amount),
        type: r.type,
        timestamp: r.timestamp,
    }));
    return { balance, transactions };
}
export async function topUpWallet(userId = 'cust-demo', amount) {
    await db.execute({
        sql: `UPDATE customers SET wallet_balance = wallet_balance + ? WHERE user_id = ?;`,
        args: [amount, userId],
    });
    const txId = `tx-${Date.now()}`;
    await db.execute({
        sql: `INSERT INTO wallet_transactions (id, customer_id, title, amount, type) VALUES (?, ?, ?, ?, 'credit');`,
        args: [txId, userId, `Wallet Recharge (UPI Ref: ${Date.now()})`, amount],
    });
    return getWallet(userId);
}
export async function deductWallet(userId = 'cust-demo', amount, orderId) {
    const current = await getWallet(userId);
    if (current.balance < amount) {
        throw new Error('Insufficient wallet balance');
    }
    await db.execute({
        sql: `UPDATE customers SET wallet_balance = wallet_balance - ? WHERE user_id = ?;`,
        args: [amount, userId],
    });
    const txId = `tx-${Date.now()}`;
    await db.execute({
        sql: `INSERT INTO wallet_transactions (id, customer_id, order_id, title, amount, type) VALUES (?, ?, ?, ?, 'debit');`,
        args: [txId, userId, orderId || null, orderId ? `Order Payment #${orderId}` : 'Wallet Deduction', -amount],
    });
    return getWallet(userId);
}
//# sourceMappingURL=walletService.js.map