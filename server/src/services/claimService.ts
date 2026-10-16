import { db } from '../config/db.js'
import { topUpWallet } from './walletService.js'
import { updateOrderStatus } from './orderService.js'

export async function getClaims() {
  const result = await db.execute(`SELECT * FROM damage_claims ORDER BY created_at DESC;`)

  return result.rows.map((r) => {
    let pickupPhotos: string[] = []
    let dropPhotos: string[] = []
    try {
      pickupPhotos = JSON.parse(r.pickup_photos_json as string || '[]')
    } catch {}
    try {
      dropPhotos = JSON.parse(r.drop_photos_json as string || '[]')
    } catch {}

    return {
      id: r.id as string,
      orderId: r.order_id as string,
      customerId: r.customer_id as string,
      customerName: r.customer_name as string,
      customerPhone: r.customer_phone as string,
      driverName: r.driver_name as string,
      itemDescription: r.item_description as string,
      declaredValueInr: Number(r.declared_value_inr),
      claimedAmountInr: Number(r.claimed_amount_inr),
      approvedCompensationInr: r.approved_compensation_inr ? Number(r.approved_compensation_inr) : undefined,
      pickupPhotos,
      dropPhotos,
      description: r.description as string,
      status: r.status as 'open' | 'under_review' | 'approved' | 'rejected',
      assignedInvestigator: (r.assigned_investigator as string) || undefined,
      resolutionNotes: (r.resolution_notes as string) || undefined,
      createdAt: r.created_at as string,
    }
  })
}

export async function raiseClaim(payload: {
  orderId: string
  customerId?: string
  customerName: string
  customerPhone: string
  driverName: string
  itemDescription: string
  declaredValueInr: number
  claimedAmountInr: number
  pickupPhotos: string[]
  dropPhotos: string[]
  description: string
}) {
  const claimId = 'CLM-' + (100 + Math.floor(Math.random() * 900))

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
  })

  // Set order to under dispute
  await updateOrderStatus(payload.orderId, 'under_dispute', `Claim filed: ${payload.description}`)

  return { success: true, claimId }
}

export async function resolveClaim(claimId: string, approvedAmount: number, note: string) {
  const newStatus = approvedAmount > 0 ? 'approved' : 'rejected'

  await db.execute({
    sql: `UPDATE damage_claims SET 
            approved_compensation_inr = ?,
            resolution_notes = ?,
            status = ?,
            updated_at = CURRENT_TIMESTAMP
          WHERE id = ?;`,
    args: [approvedAmount, note, newStatus, claimId],
  })

  // Credit customer wallet if approved
  if (approvedAmount > 0) {
    const claim = await db.execute({
      sql: `SELECT customer_id FROM damage_claims WHERE id = ?;`,
      args: [claimId],
    })
    if (claim.rows.length > 0) {
      const custId = claim.rows[0].customer_id as string
      await topUpWallet(custId, approvedAmount)
    }
  }

  const allClaims = await getClaims()
  return allClaims.find((c) => c.id === claimId)
}
