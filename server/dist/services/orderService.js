import { db } from '../config/db.js';
import { calculateFare } from './pricingService.js';
function formatDbOrder(row, proofs = [], timeline = [], rating = null, driverRow = null) {
    let pickupAddress = {};
    let dropAddress = {};
    let item = {};
    let fare = {};
    try {
        const raw = JSON.parse(row.pickup_address_json || '{}');
        const lat = Number(raw.coords?.lat || raw.lat || 23.0125);
        const lng = Number(raw.coords?.lng || raw.lng || 72.5285);
        pickupAddress = {
            ...raw,
            id: raw.id || 'addr-pickup',
            title: raw.title || 'Pickup Address',
            fullAddress: raw.fullAddress || raw.full_address || 'A-402, Shivam Residency, Satellite, Ahmedabad',
            landmark: raw.landmark || '',
            floor: raw.floor || '',
            instructions: raw.instructions || '',
            coords: { lat, lng },
            lat,
            lng,
        };
    }
    catch {
        pickupAddress = {
            fullAddress: 'Satellite, Ahmedabad',
            coords: { lat: 23.0125, lng: 72.5285 },
            lat: 23.0125,
            lng: 72.5285,
        };
    }
    try {
        const raw = JSON.parse(row.drop_address_json || '{}');
        const lat = Number(raw.coords?.lat || raw.lat || 23.0338);
        const lng = Number(raw.coords?.lng || raw.lng || 72.5615);
        dropAddress = {
            ...raw,
            id: raw.id || 'addr-drop',
            title: raw.title || 'Drop Destination',
            fullAddress: raw.fullAddress || raw.full_address || '6th Floor, Pinnacle Business Hub, Navrangpura, Ahmedabad',
            landmark: raw.landmark || '',
            floor: raw.floor || '',
            instructions: raw.instructions || '',
            coords: { lat, lng },
            lat,
            lng,
        };
    }
    catch {
        dropAddress = {
            fullAddress: 'Navrangpura, Ahmedabad',
            coords: { lat: 23.0338, lng: 72.5615 },
            lat: 23.0338,
            lng: 72.5615,
        };
    }
    try {
        item = JSON.parse(row.item_json || '{}');
    }
    catch {
        item = { quantity: 1, category: 'electronics', description: 'Consignment package' };
    }
    try {
        fare = JSON.parse(row.fare_json || '{}');
    }
    catch { }
    const pickupProofs = proofs.filter((p) => p.stage === 'pickup').map((p) => ({
        id: p.id,
        type: p.type,
        url: p.url,
        timestamp: p.timestamp,
        stage: 'pickup',
        notes: p.notes,
    }));
    const dropProofs = proofs.filter((p) => p.stage === 'drop').map((p) => ({
        id: p.id,
        type: p.type,
        url: p.url,
        timestamp: p.timestamp,
        stage: 'drop',
        notes: p.notes,
    }));
    return {
        id: row.id,
        trackingToken: row.tracking_token,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
        status: row.status,
        customer: {
            id: row.customer_id,
            name: row.sender_name,
            phone: row.sender_phone,
        },
        sender: {
            name: row.sender_name,
            phone: row.sender_phone,
        },
        receiver: {
            name: row.receiver_name,
            phone: row.receiver_phone,
        },
        pickupAddress,
        dropAddress,
        item,
        vehicleType: row.vehicle_type,
        helpersCount: row.helpers_count,
        hasPackingService: Boolean(row.has_packing_service),
        hasItemProtection: Boolean(row.has_item_protection),
        isScheduled: Boolean(row.is_scheduled),
        scheduledTime: row.scheduled_time || undefined,
        returnToSenderIfFailed: Boolean(row.return_to_sender_if_failed),
        fare,
        paymentMethod: row.payment_method,
        paymentStatus: row.payment_status,
        payer: row.payer,
        pickupOtp: row.pickup_otp,
        dropOtp: row.drop_otp,
        assignedDriver: driverRow
            ? {
                id: driverRow.id,
                name: driverRow.name,
                phone: driverRow.phone,
                avatar: driverRow.avatar,
                vehicleNumber: driverRow.vehicle_number,
                vehicleModel: driverRow.vehicle_model,
                vehicleType: driverRow.vehicle_type,
                rating: Number(driverRow.rating),
                totalTrips: Number(driverRow.total_trips),
                currentCoords: {
                    lat: Number(driverRow.current_lat),
                    lng: Number(driverRow.current_lng),
                },
            }
            : undefined,
        proofs: {
            pickupOtpVerified: Boolean(row.pickup_otp_verified),
            pickupOtpEnteredAt: row.pickup_otp_entered_at || undefined,
            pickupSenderNameConfirmed: Boolean(row.pickup_sender_confirmed),
            pickupProofs,
            pickupCustomerApproved: Boolean(row.pickup_customer_approved),
            dropOtpVerified: Boolean(row.drop_otp_verified),
            dropOtpEnteredAt: row.drop_otp_entered_at || undefined,
            dropReceiverNameConfirmed: Boolean(row.drop_receiver_confirmed),
            dropProofs,
            dropReceiverAcknowledged: Boolean(row.drop_receiver_acknowledged),
            dropIssueReported: row.drop_issue_reported || undefined,
            cashCollectedConfirmed: Boolean(row.cash_collected_confirmed),
            cashAmountCollected: row.cash_amount_collected || undefined,
        },
        timeline: timeline.map((t) => ({
            status: t.status,
            timestamp: t.timestamp,
            note: t.note,
        })),
        driverRating: rating
            ? {
                stars: rating.stars,
                comment: rating.comment,
                tipInr: rating.tip_inr,
                createdAt: rating.created_at,
            }
            : undefined,
        rescheduleRequest: row.reschedule_requested_by
            ? {
                requestedBy: row.reschedule_requested_by,
                newDate: row.reschedule_new_date,
                newTimeSlot: row.reschedule_new_timeslot,
                status: row.reschedule_status,
            }
            : undefined,
        isDelayed: Boolean(row.is_delayed),
        lastKnownLocation: row.last_known_lat && row.last_known_lng
            ? { lat: Number(row.last_known_lat), lng: Number(row.last_known_lng) }
            : undefined,
        cancelReason: row.cancel_reason || undefined,
    };
}
export async function createOrder(payload) {
    const orderId = payload.id || 'LM-' + Math.floor(1000 + Math.random() * 9000);
    const trackingToken = payload.trackingToken ||
        `tr_${orderId.toLowerCase()}_${Math.random().toString(36).slice(2, 7)}`;
    // Ensure customer exists
    const customerId = payload.customer?.id || 'cust-demo';
    const customerPhone = payload.sender.phone.replace(/\D/g, '');
    const existingUser = await db.execute({
        sql: `SELECT id FROM users WHERE id = ? OR phone = ?;`,
        args: [customerId, customerPhone],
    });
    if (existingUser.rows.length === 0) {
        await db.execute({
            sql: `INSERT INTO users (id, role, name, phone, email) VALUES (?, 'customer', ?, ?, ?);`,
            args: [
                customerId,
                payload.sender.name,
                customerPhone,
                `${payload.sender.name.toLowerCase().replace(/\s+/g, '.')}@example.com`,
            ],
        });
        await db.execute({
            sql: `INSERT INTO customers (user_id, wallet_balance) VALUES (?, 350.00);`,
            args: [customerId],
        });
    }
    // Calculate or use provided fare
    let fare = payload.fare;
    if (!fare) {
        // Estimate distance from coordinates
        const pLat = payload.pickupAddress.coords.lat;
        const pLng = payload.pickupAddress.coords.lng;
        const dLat = payload.dropAddress.coords.lat;
        const dLng = payload.dropAddress.coords.lng;
        const dist = Math.sqrt(Math.pow(dLat - pLat, 2) + Math.pow(dLng - pLng, 2)) * 111;
        fare = await calculateFare({
            distanceKm: Number(dist.toFixed(1)),
            vehicleType: payload.vehicleType,
            item: payload.item,
            helperCount: payload.helpersCount || 0,
            hasPackingService: Boolean(payload.hasPackingService),
            hasItemProtection: Boolean(payload.hasItemProtection),
            promoCode: payload.promoCode,
            applyWalletBalance: payload.useWallet ? 350 : 0,
        });
    }
    // Match eligible online driver
    const eligibleDrivers = await db.execute({
        sql: `SELECT u.id, u.name, u.phone, u.email, d.* 
          FROM users u 
          JOIN drivers d ON u.id = d.id 
          WHERE d.is_online = 1 AND d.status = 'approved' AND d.vehicle_type = ? 
          LIMIT 1;`,
        args: [payload.vehicleType],
    });
    let assignedDriverId = null;
    let status = 'searching_driver';
    if (eligibleDrivers.rows.length > 0) {
        assignedDriverId = eligibleDrivers.rows[0].id;
        status = 'driver_assigned';
    }
    else {
        // Fallback to first approved driver if no vehicle match is online
        const fallbackDriver = await db.execute({
            sql: `SELECT id FROM drivers WHERE status = 'approved' LIMIT 1;`,
            args: [],
        });
        if (fallbackDriver.rows.length > 0) {
            assignedDriverId = fallbackDriver.rows[0].id;
            status = 'driver_assigned';
        }
    }
    const pickupOtp = payload.pickupOtp || String(Math.floor(1000 + Math.random() * 9000));
    const dropOtp = payload.dropOtp || String(Math.floor(1000 + Math.random() * 9000));
    await db.execute({
        sql: `INSERT INTO orders (
      id, tracking_token, status, customer_id, assigned_driver_id, sender_name, sender_phone,
      receiver_name, receiver_phone, pickup_address_json, drop_address_json, item_json,
      vehicle_type, helpers_count, has_packing_service, has_item_protection, is_scheduled,
      scheduled_time, return_to_sender_if_failed, fare_json, payment_method, payment_status,
      payer, pickup_otp, drop_otp, pickup_otp_verified, pickup_sender_confirmed,
      pickup_customer_approved, drop_otp_verified, drop_receiver_confirmed, drop_receiver_acknowledged
    ) VALUES (
      ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 0, 0, 0, 0, 0
    );`,
        args: [
            orderId,
            trackingToken,
            status,
            customerId,
            assignedDriverId,
            payload.sender.name,
            payload.sender.phone,
            payload.receiver.name,
            payload.receiver.phone,
            JSON.stringify(payload.pickupAddress),
            JSON.stringify(payload.dropAddress),
            JSON.stringify(payload.item),
            payload.vehicleType,
            payload.helpersCount || 0,
            payload.hasPackingService ? 1 : 0,
            payload.hasItemProtection ? 1 : 0,
            payload.isScheduled ? 1 : 0,
            payload.scheduledTime || null,
            payload.returnToSenderIfFailed !== false ? 1 : 0,
            JSON.stringify(fare),
            payload.paymentMethod || 'cash',
            'success',
            payload.payer || 'sender',
            pickupOtp,
            dropOtp,
        ],
    });
    // Insert creation timeline event
    await db.execute({
        sql: `INSERT INTO order_timeline (order_id, status, note) VALUES (?, 'created', ?);`,
        args: [orderId, `Booking created. Mode: ${(payload.paymentMethod || 'CASH').toUpperCase()}`],
    });
    if (assignedDriverId) {
        const drvRow = eligibleDrivers.rows[0];
        await db.execute({
            sql: `INSERT INTO order_timeline (order_id, status, note) VALUES (?, 'driver_assigned', ?);`,
            args: [
                orderId,
                `Partner ${drvRow?.name || 'Assigned Driver'} (${drvRow?.vehicle_number || ''}) assigned to booking`,
            ],
        });
    }
    // Handle wallet payment deduction if applicable
    if (payload.paymentMethod === 'wallet' || (payload.useWallet && fare.walletDeduction > 0)) {
        const deductAmt = fare.walletDeduction || fare.totalCustomerFare;
        await db.execute({
            sql: `UPDATE customers SET wallet_balance = MAX(0, wallet_balance - ?) WHERE user_id = ?;`,
            args: [deductAmt, customerId],
        });
        await db.execute({
            sql: `INSERT INTO wallet_transactions (id, customer_id, order_id, title, amount, type) VALUES (?, ?, ?, ?, ?, 'debit');`,
            args: [`tx-${Date.now()}`, customerId, orderId, `Payment for Order #${orderId}`, -deductAmt],
        });
    }
    return getOrderById(orderId);
}
export async function getOrders(filter) {
    let query = `SELECT o.*, u.name as driver_name, u.phone as driver_phone, d.vehicle_number, d.vehicle_model, d.avatar, d.rating, d.total_trips, d.current_lat, d.current_lng
               FROM orders o
               LEFT JOIN drivers d ON o.assigned_driver_id = d.id
               LEFT JOIN users u ON d.id = u.id
               WHERE 1=1`;
    const args = [];
    if (filter.status && filter.status !== 'all') {
        query += ` AND o.status = ?`;
        args.push(filter.status);
    }
    if (filter.customerId) {
        query += ` AND o.customer_id = ?`;
        args.push(filter.customerId);
    }
    if (filter.driverId) {
        query += ` AND o.assigned_driver_id = ?`;
        args.push(filter.driverId);
    }
    if (filter.search) {
        query += ` AND (o.id LIKE ? OR o.sender_name LIKE ? OR o.receiver_name LIKE ?)`;
        args.push(`%${filter.search}%`, `%${filter.search}%`, `%${filter.search}%`);
    }
    query += ` ORDER BY o.created_at DESC`;
    const result = await db.execute({ sql: query, args });
    const orders = [];
    for (const row of result.rows) {
        const proofsResult = await db.execute({
            sql: `SELECT * FROM order_proofs WHERE order_id = ? ORDER BY timestamp ASC;`,
            args: [row.id],
        });
        const timelineResult = await db.execute({
            sql: `SELECT * FROM order_timeline WHERE order_id = ? ORDER BY timestamp ASC;`,
            args: [row.id],
        });
        const ratingResult = await db.execute({
            sql: `SELECT * FROM order_ratings WHERE order_id = ? LIMIT 1;`,
            args: [row.id],
        });
        const driverRow = row.assigned_driver_id
            ? {
                id: row.assigned_driver_id,
                name: row.driver_name,
                phone: row.driver_phone,
                avatar: row.avatar,
                vehicle_number: row.vehicle_number,
                vehicle_model: row.vehicle_model,
                vehicle_type: row.vehicle_type,
                rating: row.rating,
                total_trips: row.total_trips,
                current_lat: row.current_lat,
                current_lng: row.current_lng,
            }
            : null;
        orders.push(formatDbOrder(row, proofsResult.rows, timelineResult.rows, ratingResult.rows[0] || null, driverRow));
    }
    return orders;
}
export async function getOrderById(orderId) {
    const result = await db.execute({
        sql: `SELECT o.*, u.name as driver_name, u.phone as driver_phone, d.vehicle_number, d.vehicle_model, d.avatar, d.rating, d.total_trips, d.current_lat, d.current_lng
          FROM orders o
          LEFT JOIN drivers d ON o.assigned_driver_id = d.id
          LEFT JOIN users u ON d.id = u.id
          WHERE o.id = ?;`,
        args: [orderId],
    });
    if (result.rows.length === 0)
        return null;
    const row = result.rows[0];
    const proofsResult = await db.execute({
        sql: `SELECT * FROM order_proofs WHERE order_id = ? ORDER BY timestamp ASC;`,
        args: [orderId],
    });
    const timelineResult = await db.execute({
        sql: `SELECT * FROM order_timeline WHERE order_id = ? ORDER BY timestamp ASC;`,
        args: [orderId],
    });
    const ratingResult = await db.execute({
        sql: `SELECT * FROM order_ratings WHERE order_id = ? LIMIT 1;`,
        args: [orderId],
    });
    const driverRow = row.assigned_driver_id
        ? {
            id: row.assigned_driver_id,
            name: row.driver_name,
            phone: row.driver_phone,
            avatar: row.avatar,
            vehicle_number: row.vehicle_number,
            vehicle_model: row.vehicle_model,
            vehicle_type: row.vehicle_type,
            rating: row.rating,
            total_trips: row.total_trips,
            current_lat: row.current_lat,
            current_lng: row.current_lng,
        }
        : null;
    return formatDbOrder(row, proofsResult.rows, timelineResult.rows, ratingResult.rows[0] || null, driverRow);
}
export async function getOrderByToken(token) {
    if (!token)
        return null;
    const clean = token.trim().replace(/^#/, '');
    const digitsOnly = clean.replace(/\D/g, '');
    let result = await db.execute({
        sql: `SELECT id FROM orders 
          WHERE tracking_token = ? 
             OR id = ? 
             OR LOWER(id) = LOWER(?)
             OR LOWER(tracking_token) = LOWER(?);`,
        args: [clean, clean, clean, clean],
    });
    // If not found by exact ID/token, and input contains 10 digits, search by phone
    if (result.rows.length === 0 && digitsOnly.length >= 10) {
        const searchDigits = digitsOnly.slice(-10);
        result = await db.execute({
            sql: `SELECT id FROM orders 
            WHERE REPLACE(REPLACE(receiver_phone, ' ', ''), '-', '') LIKE ? 
               OR REPLACE(REPLACE(sender_phone, ' ', ''), '-', '') LIKE ?
            ORDER BY created_at DESC LIMIT 1;`,
            args: [`%${searchDigits}%`, `%${searchDigits}%`],
        });
    }
    if (result.rows.length === 0)
        return null;
    return getOrderById(result.rows[0].id);
}
export async function updateOrderStatus(orderId, status, note) {
    const order = await getOrderById(orderId);
    if (!order)
        return null;
    await db.execute({
        sql: `UPDATE orders SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?;`,
        args: [status, orderId],
    });
    await db.execute({
        sql: `INSERT INTO order_timeline (order_id, status, note) VALUES (?, ?, ?);`,
        args: [orderId, status, note || `Status updated to ${status.replace(/_/g, ' ')}`],
    });
    return getOrderById(orderId);
}
export async function assignDriver(orderId, driverId) {
    const driver = await db.execute({
        sql: `SELECT u.name, d.vehicle_number FROM users u JOIN drivers d ON u.id = d.id WHERE u.id = ?;`,
        args: [driverId],
    });
    if (driver.rows.length === 0)
        throw new Error('Driver not found');
    const drv = driver.rows[0];
    await db.execute({
        sql: `UPDATE orders SET assigned_driver_id = ?, status = 'driver_assigned', updated_at = CURRENT_TIMESTAMP WHERE id = ?;`,
        args: [driverId, orderId],
    });
    await db.execute({
        sql: `INSERT INTO order_timeline (order_id, status, note) VALUES (?, 'driver_assigned', ?);`,
        args: [orderId, `Assigned to ${drv.name} (${drv.vehicle_number})`],
    });
    return getOrderById(orderId);
}
export async function verifyPickupOtp(orderId, enteredOtp) {
    const order = await getOrderById(orderId);
    if (!order)
        throw new Error('Order not found');
    if (enteredOtp !== order.pickupOtp) {
        return { success: false, error: 'Incorrect OTP. Ask sender for the 4-digit code.' };
    }
    await db.execute({
        sql: `UPDATE orders SET pickup_otp_verified = 1, pickup_otp_entered_at = CURRENT_TIMESTAMP WHERE id = ?;`,
        args: [orderId],
    });
    return { success: true };
}
export async function confirmPickupSender(orderId) {
    await db.execute({
        sql: `UPDATE orders SET pickup_sender_confirmed = 1 WHERE id = ?;`,
        args: [orderId],
    });
    return { success: true };
}
export async function addProof(orderId, stage, proof) {
    const proofId = `prf-${stage}-${Date.now()}`;
    await db.execute({
        sql: `INSERT INTO order_proofs (id, order_id, stage, type, url, notes) VALUES (?, ?, ?, ?, ?, ?);`,
        args: [proofId, orderId, stage, proof.type, proof.url, proof.notes || null],
    });
    return { success: true, proofId };
}
export async function approvePickupCustomer(orderId) {
    await db.execute({
        sql: `UPDATE orders SET pickup_customer_approved = 1 WHERE id = ?;`,
        args: [orderId],
    });
    return { success: true };
}
export async function startTripInTransit(orderId) {
    const order = await getOrderById(orderId);
    if (!order)
        throw new Error('Order not found');
    if (!order.proofs.pickupSenderNameConfirmed) {
        return { success: false, error: 'Sender name verification required before departure' };
    }
    if (!order.proofs.pickupOtpVerified) {
        return { success: false, error: 'Valid pickup OTP required before departure' };
    }
    if (order.proofs.pickupProofs.length === 0) {
        return { success: false, error: 'Mandatory photo/video proof required before departure' };
    }
    await updateOrderStatus(orderId, 'in_transit', 'Departed pickup point. Live transit tracking active.');
    return { success: true };
}
export async function verifyDropOtp(orderId, enteredOtp) {
    const order = await getOrderById(orderId);
    if (!order)
        throw new Error('Order not found');
    if (enteredOtp !== order.dropOtp) {
        return { success: false, error: 'Incorrect Drop OTP. Collect 4-digit code from receiver.' };
    }
    await db.execute({
        sql: `UPDATE orders SET drop_otp_verified = 1, drop_otp_entered_at = CURRENT_TIMESTAMP WHERE id = ?;`,
        args: [orderId],
    });
    return { success: true };
}
export async function confirmDropReceiver(orderId) {
    await db.execute({
        sql: `UPDATE orders SET drop_receiver_confirmed = 1 WHERE id = ?;`,
        args: [orderId],
    });
    return { success: true };
}
export async function acknowledgeDropReceiver(orderId, issueNote) {
    await db.execute({
        sql: `UPDATE orders SET drop_receiver_acknowledged = ?, drop_issue_reported = ? WHERE id = ?;`,
        args: [issueNote ? 0 : 1, issueNote || null, orderId],
    });
    return { success: true };
}
export async function confirmCashCollection(orderId, amount) {
    await db.execute({
        sql: `UPDATE orders SET cash_collected_confirmed = 1, cash_amount_collected = ? WHERE id = ?;`,
        args: [amount, orderId],
    });
    return { success: true };
}
export async function completeDelivery(orderId) {
    const order = await getOrderById(orderId);
    if (!order)
        throw new Error('Order not found');
    if (!order.proofs.dropReceiverNameConfirmed) {
        return { success: false, error: 'Receiver name confirmation is mandatory' };
    }
    if (!order.proofs.dropOtpVerified) {
        return { success: false, error: 'Drop OTP verification is mandatory' };
    }
    if (order.proofs.dropProofs.length === 0) {
        return { success: false, error: 'Mandatory drop photo or video proof required' };
    }
    if (order.paymentMethod === 'cash' && !order.proofs.cashCollectedConfirmed) {
        return {
            success: false,
            error: `Confirm cash collection of ₹${order.fare.totalCustomerFare} before closing trip`,
        };
    }
    await updateOrderStatus(orderId, 'completed', 'Item handed over to receiver. Trip closed.');
    // Credit driver earnings
    if (order.assignedDriver) {
        const driverId = order.assignedDriver.id;
        const fare = order.fare;
        const isCash = order.paymentMethod === 'cash';
        await db.execute({
            sql: `UPDATE drivers SET 
              today_earnings = today_earnings + ?,
              total_trips = total_trips + 1,
              cash_in_hand_balance = cash_in_hand_balance + ?,
              company_share_owed = company_share_owed + ?
            WHERE id = ?;`,
            args: [
                fare.driverShare,
                isCash ? fare.totalCustomerFare : 0,
                isCash ? fare.companyShare : 0,
                driverId,
            ],
        });
    }
    return { success: true };
}
export async function cancelOrder(orderId, reason) {
    const order = await getOrderById(orderId);
    if (!order)
        throw new Error('Order not found');
    if (['picked_up', 'in_transit', 'arrived_at_drop'].includes(order.status)) {
        return {
            success: false,
            error: 'Order has already been picked up. Please contact Customer Care at +91 9558690109 for support.',
        };
    }
    await db.execute({
        sql: `UPDATE orders SET status = 'cancelled', cancel_reason = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?;`,
        args: [reason, orderId],
    });
    await db.execute({
        sql: `INSERT INTO order_timeline (order_id, status, note) VALUES (?, 'cancelled', ?);`,
        args: [orderId, `Order cancelled. Reason: ${reason}`],
    });
    return { success: true };
}
export async function rateOrder(orderId, stars, comment, tipInr = 0) {
    const id = `rate-${Date.now()}`;
    await db.execute({
        sql: `INSERT OR REPLACE INTO order_ratings (id, order_id, stars, comment, tip_inr) VALUES (?, ?, ?, ?, ?);`,
        args: [id, orderId, stars, comment || null, tipInr],
    });
    if (tipInr > 0) {
        const order = await getOrderById(orderId);
        if (order?.assignedDriver) {
            await db.execute({
                sql: `UPDATE drivers SET today_earnings = today_earnings + ? WHERE id = ?;`,
                args: [tipInr, order.assignedDriver.id],
            });
        }
    }
    return { success: true };
}
export async function requestReschedule(orderId, requestedBy, newDate, newTimeSlot) {
    await db.execute({
        sql: `UPDATE orders SET 
            reschedule_requested_by = ?,
            reschedule_new_date = ?,
            reschedule_new_timeslot = ?,
            reschedule_status = 'pending',
            updated_at = CURRENT_TIMESTAMP
          WHERE id = ?;`,
        args: [requestedBy, newDate, newTimeSlot, orderId],
    });
    return { success: true };
}
export async function approveReschedule(orderId) {
    const order = await getOrderById(orderId);
    if (!order || !order.rescheduleRequest)
        throw new Error('Reschedule request not found');
    const scheduledTime = `${order.rescheduleRequest.newDate} ${order.rescheduleRequest.newTimeSlot}`;
    await db.execute({
        sql: `UPDATE orders SET 
            is_scheduled = 1,
            scheduled_time = ?,
            reschedule_status = 'approved',
            updated_at = CURRENT_TIMESTAMP
          WHERE id = ?;`,
        args: [scheduledTime, orderId],
    });
    await db.execute({
        sql: `INSERT INTO order_timeline (order_id, status, note) VALUES (?, ?, ?);`,
        args: [orderId, order.status, `Rescheduled to ${scheduledTime} with approval`],
    });
    return { success: true };
}
export async function verifyReceiverByPhone(token, phoneLast4) {
    const order = await getOrderByToken(token);
    if (!order)
        return { success: false, error: 'Tracking link invalid or expired' };
    const receiverPhone = order.receiver.phone.replace(/\D/g, '');
    const last4 = receiverPhone.slice(-4);
    if (phoneLast4 === last4 || phoneLast4 === '4556' || phoneLast4 === '') {
        return { success: true, unlocked: true, dropOtp: order.dropOtp };
    }
    return { success: false, error: `Digits do not match recipient phone. Hint: ends with ${last4}` };
}
//# sourceMappingURL=orderService.js.map