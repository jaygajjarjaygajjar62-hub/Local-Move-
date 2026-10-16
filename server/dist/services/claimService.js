import { db } from '../config/db.js';
import { topUpWallet } from './walletService.js';
import { updateOrderStatus } from './orderService.js';
export async function getClaims() {
    const result = await db.execute(`SELECT * FROM damage_claims ORDER BY created_at DESC;`);
    return result.rows.map((r) => {
        let pickupPhotos = [];
        let dropPhotos = [];
        try {
            pickupPhotos = JSON.parse(r.pickup_photos_json || '[]');
        }
        catch { }
        try {
            dropPhotos = JSON.parse(r.drop_photos_json || '[]');
        }
        catch { }
        return {
            id: r.id,
            orderId: r.order_id,
            customerId: r.customer_id,
            customerName: r.customer_name,
            customerPhone: r.customer_phone,
            driverName: r.driver_name,
            itemDescription: r.item_description,
            declaredValueInr: Number(r.declared_value_inr),
            claimedAmountInr: Number(r.claimed_amount_inr),
            approvedCompensationInr: r.approved_compensation_inr ? Number(r.approved_compensation_inr) : undefined,
            pickupPhotos,
            dropPhotos,
            description: r.description,
            status: r.status,
            assignedInvestigator: r.assigned_investigator || undefined,
            resolutionNotes: r.resolution_notes || undefined,
            createdAt: r.created_at,
        };
    });
}
export async function raiseClaim(payload) {
    const claimId = 'CLM-' + (100 + Math.floor(Math.random() * 900));
    await db.execute({
        sql: `INSERT INTO damage_claims (
      id, order_id, customer_id, customer_name, customer_phone, driver_name,
      item_description, declared_value_inr, claimed_amount_inr,
      pickup_photos_json, drop_photos_json, description, status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'under_review');`,
        args: [
            claimId,
            payload.orderId,
            payload.customerId || 'cust-demo',
            payload.customerName,
            payload.customerPhone,
            payload.driverName,
            payload.itemDescription,
            payload.declaredValueInr,
            payload.claimedAmountInr,
            JSON.stringify(payload.pickupPhotos || []),
            JSON.stringify(payload.dropPhotos || []),
            payload.description,
        ],
    });
    // Set order to under dispute
    await updateOrderStatus(payload.orderId, 'under_dispute', `Claim filed: ${payload.description}`);
    return { success: true, claimId };
}
export async function resolveClaim(claimId, approvedAmount, note) {
    const newStatus = approvedAmount > 0 ? 'approved' : 'rejected';
    await db.execute({
        sql: `UPDATE damage_claims SET 
            approved_compensation_inr = ?,
            resolution_notes = ?,
            status = ?,
            updated_at = CURRENT_TIMESTAMP
          WHERE id = ?;`,
        args: [approvedAmount, note, newStatus, claimId],
    });
    // Credit customer wallet if approved
    if (approvedAmount > 0) {
        const claim = await db.execute({
            sql: `SELECT customer_id FROM damage_claims WHERE id = ?;`,
            args: [claimId],
        });
        if (claim.rows.length > 0) {
            const custId = claim.rows[0].customer_id;
            await topUpWallet(custId, approvedAmount);
        }
    }
    const allClaims = await getClaims();
    return allClaims.find((c) => c.id === claimId);
}
//# sourceMappingURL=claimService.js.map