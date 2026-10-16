import { db } from '../config/db.js';
export async function getProhibitedItems() {
    const result = await db.execute(`SELECT * FROM prohibited_items WHERE is_active = 1 ORDER BY fine_amount DESC;`);
    return result.rows.map((r) => ({
        id: r.id,
        name: r.name,
        category: r.category,
        fineAmount: Number(r.fine_amount),
        riskLevel: r.risk_level,
    }));
}
export async function addProhibitedItem(item) {
    const id = `p-${Date.now()}`;
    await db.execute({
        sql: `INSERT INTO prohibited_items (id, name, category, fine_amount, risk_level) VALUES (?, ?, ?, ?, ?);`,
        args: [id, item.name, item.category, item.fineAmount, item.riskLevel],
    });
    return { id, ...item };
}
export async function deleteProhibitedItem(id) {
    await db.execute({
        sql: `DELETE FROM prohibited_items WHERE id = ?;`,
        args: [id],
    });
    return { success: true };
}
export async function getFAQs(category) {
    let query = `SELECT * FROM faqs WHERE is_active = 1`;
    const args = [];
    if (category) {
        query += ` AND category = ?`;
        args.push(category);
    }
    const result = await db.execute({ sql: query, args });
    return result.rows.map((r) => ({
        id: r.id,
        category: r.category,
        question: r.question,
        answer: r.answer,
    }));
}
export async function addFAQ(faq) {
    const id = `faq-${Date.now()}`;
    await db.execute({
        sql: `INSERT INTO faqs (id, category, question, answer) VALUES (?, ?, ?, ?);`,
        args: [id, faq.category, faq.question, faq.answer],
    });
    return { id, ...faq };
}
//# sourceMappingURL=contentService.js.map