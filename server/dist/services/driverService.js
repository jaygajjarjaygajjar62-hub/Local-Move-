import { db } from '../config/db.js';
export async function getDrivers(filter) {
    let query = `SELECT u.name, u.phone, u.email, d.* FROM drivers d JOIN users u ON d.id = u.id WHERE 1=1`;
    const args = [];
    if (filter?.status) {
        query += ` AND d.status = ?`;
        args.push(filter.status);
    }
    if (filter?.isOnline !== undefined) {
        query += ` AND d.is_online = ?`;
        args.push(filter.isOnline ? 1 : 0);
    }
    if (filter?.vehicleType) {
        query += ` AND d.vehicle_type = ?`;
        args.push(filter.vehicleType);
    }
    const result = await db.execute({ sql: query, args });
    const drivers = [];
    for (const row of result.rows) {
        const docsResult = await db.execute({
            sql: `SELECT * FROM driver_documents WHERE driver_id = ?;`,
            args: [row.id],
        });
        const documents = {
            licence: { status: 'pending' },
            aadhaar: { status: 'pending', maskedNumber: 'XXXX-XXXX-4129' },
            rc: { status: 'pending' },
            selfie: { status: 'pending' },
        };
        for (const doc of docsResult.rows) {
            documents[doc.doc_type] = {
                status: doc.status,
                number: doc.number || undefined,
                maskedNumber: doc.masked_number || undefined,
                expiryDate: doc.expiry_date || undefined,
                frontUrl: doc.front_url || undefined,
                backUrl: doc.back_url || undefined,
                rejectionReason: doc.rejection_reason || undefined,
            };
        }
        drivers.push({
            id: row.id,
            name: row.name,
            phone: row.phone,
            email: row.email,
            avatar: row.avatar,
            isOnline: Boolean(row.is_online),
            status: row.status,
            vehicleType: row.vehicle_type,
            vehicleNumber: row.vehicle_number,
            vehicleModel: row.vehicle_model,
            rating: Number(row.rating),
            totalTrips: Number(row.total_trips),
            acceptanceRate: Number(row.acceptance_rate),
            completionRate: Number(row.completion_rate),
            cashInHandBalance: Number(row.cash_in_hand_balance),
            companyShareOwed: Number(row.company_share_owed),
            todayEarnings: Number(row.today_earnings),
            activeDeliveryMinutes: Number(row.active_delivery_minutes),
            onlineMinutes: Number(row.online_minutes),
            waitingMinutes: Number(row.waiting_minutes),
            currentCoords: {
                lat: Number(row.current_lat),
                lng: Number(row.current_lng),
            },
            documents,
        });
    }
    return drivers;
}
export async function getDriverById(driverId) {
    const drivers = await getDrivers();
    return drivers.find((d) => d.id === driverId) || null;
}
export async function updateDriverOnline(driverId, isOnline) {
    await db.execute({
        sql: `UPDATE drivers SET is_online = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?;`,
        args: [isOnline ? 1 : 0, driverId],
    });
    return getDriverById(driverId);
}
export async function updateDriverLocation(driverId, coords) {
    await db.execute({
        sql: `UPDATE drivers SET current_lat = ?, current_lng = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?;`,
        args: [coords.lat, coords.lng, driverId],
    });
    return { success: true };
}
export async function updateDriverVerification(driverId, status, docType, reason) {
    await db.execute({
        sql: `UPDATE drivers SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?;`,
        args: [status, driverId],
    });
    if (docType) {
        const docStatus = status === 'approved' ? 'approved' : status === 'rejected' ? 'rejected' : 'expired';
        await db.execute({
            sql: `UPDATE driver_documents SET status = ?, rejection_reason = ?, updated_at = CURRENT_TIMESTAMP WHERE driver_id = ? AND doc_type = ?;`,
            args: [docStatus, reason || null, driverId, docType],
        });
    }
    return getDriverById(driverId);
}
export async function submitDriverOnboarding(payload) {
    const cleanPhone = payload.phone.replace(/\D/g, '');
    const driverId = 'drv-' + Math.random().toString(36).slice(2, 7);
    await db.execute({
        sql: `INSERT INTO users (id, role, name, phone, email, language) VALUES (?, 'driver', ?, ?, ?, 'en');`,
        args: [driverId, payload.name, cleanPhone, payload.email],
    });
    await db.execute({
        sql: `INSERT INTO drivers (
      id, vehicle_type, vehicle_number, vehicle_model, avatar, is_online, status, rating, total_trips
    ) VALUES (?, ?, ?, ?, ?, 0, 'pending', 5.0, 0);`,
        args: [
            driverId,
            payload.vehicleType,
            payload.vehicleNumber,
            payload.vehicleModel || `${payload.vehicleType.toUpperCase()} Carrier`,
            'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
        ],
    });
    const docs = payload.documents || {};
    const docList = [
        { type: 'licence', number: docs.dlNumber, front: docs.dlFront, back: docs.dlBack, expiry: docs.dlExpiry },
        { type: 'aadhaar', masked: docs.aadhaarLast4 ? `XXXX-XXXX-${docs.aadhaarLast4}` : 'XXXX-XXXX-8921', front: docs.aadhaarFront },
        { type: 'rc', number: docs.rcNumber || payload.vehicleNumber, front: docs.rcFront },
        { type: 'selfie', front: docs.selfie },
    ];
    for (const doc of docList) {
        await db.execute({
            sql: `INSERT INTO driver_documents (id, driver_id, doc_type, status, number, masked_number, expiry_date, front_url, back_url)
            VALUES (?, ?, ?, 'pending', ?, ?, ?, ?, ?);`,
            args: [
                `doc-${driverId}-${doc.type}`,
                driverId,
                doc.type,
                doc.number || null,
                doc.masked || null,
                doc.expiry || null,
                doc.front || null,
                doc.back || null,
            ],
        });
    }
    return getDriverById(driverId);
}
export async function getDriverEarnings(driverId, period = 'today') {
    const driver = await getDriverById(driverId);
    if (!driver)
        throw new Error('Driver not found');
    const tripsResult = await db.execute({
        sql: `SELECT id, created_at, status, fare_json, payment_method, sender_name, receiver_name
          FROM orders WHERE assigned_driver_id = ? AND status = 'completed'
          ORDER BY created_at DESC;`,
        args: [driverId],
    });
    const trips = tripsResult.rows.map((r) => {
        let fare = {};
        try {
            fare = JSON.parse(r.fare_json);
        }
        catch { }
        return {
            id: r.id,
            timestamp: r.created_at,
            status: r.status,
            customerFare: fare.totalCustomerFare || 0,
            driverShare: fare.driverShare || 0,
            paymentMethod: r.payment_method,
            sender: r.sender_name,
            receiver: r.receiver_name,
        };
    });
    return {
        profile: driver,
        period,
        todayEarnings: driver.todayEarnings,
        cashInHandBalance: driver.cashInHandBalance,
        companyShareOwed: driver.companyShareOwed,
        totalTrips: driver.totalTrips,
        completedTrips: trips,
    };
}
//# sourceMappingURL=driverService.js.map