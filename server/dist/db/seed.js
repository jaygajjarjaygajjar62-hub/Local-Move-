import { db } from '../config/db.js';
import { createSchema } from './schema.js';
export async function seedDatabase() {
    console.log('Creating database schema...');
    await createSchema();
    console.log('Seeding initial data...');
    // Clear existing data in case of re-seed
    await db.execute('DELETE FROM order_timeline;');
    await db.execute('DELETE FROM order_proofs;');
    await db.execute('DELETE FROM order_ratings;');
    await db.execute('DELETE FROM damage_claims;');
    await db.execute('DELETE FROM ticket_messages;');
    await db.execute('DELETE FROM support_tickets;');
    await db.execute('DELETE FROM wallet_transactions;');
    await db.execute('DELETE FROM orders;');
    await db.execute('DELETE FROM addresses;');
    await db.execute('DELETE FROM driver_documents;');
    await db.execute('DELETE FROM drivers;');
    await db.execute('DELETE FROM customers;');
    await db.execute('DELETE FROM prohibited_items;');
    await db.execute('DELETE FROM faqs;');
    await db.execute('DELETE FROM pricing_config;');
    await db.execute('DELETE FROM notifications;');
    await db.execute('DELETE FROM audit_logs;');
    await db.execute('DELETE FROM users;');
    // 1. Users
    const users = [
        { id: 'cust-demo', role: 'customer', admin_sub_role: null, name: 'Kunal Shah', phone: '9879011223', email: 'kunal.shah@example.com', language: 'en' },
        { id: 'drv-1', role: 'driver', admin_sub_role: null, name: 'Vikram Patel', phone: '9825012345', email: 'vikram.patel.driver@gmail.com', language: 'gu' },
        { id: 'drv-2', role: 'driver', admin_sub_role: null, name: 'Rajesh Makwana', phone: '9898011234', email: 'rajesh.makwana@gmail.com', language: 'hi' },
        { id: 'drv-3', role: 'driver', admin_sub_role: null, name: 'Imran Khan', phone: '9727055443', email: 'imran.khan.tempo@gmail.com', language: 'en' },
        { id: 'drv-4', role: 'driver', admin_sub_role: null, name: 'Mahendra Vaghela', phone: '9426089123', email: 'mahendra.eicher@gmail.com', language: 'gu' },
        { id: 'admin-1', role: 'admin', admin_sub_role: 'super_admin', name: 'Jay Patel (Operations Lead)', phone: '9558690109', email: 'admin@localmove.in', language: 'en' },
    ];
    for (const u of users) {
        await db.execute({
            sql: `INSERT INTO users (id, role, admin_sub_role, name, phone, email, language) VALUES (?, ?, ?, ?, ?, ?, ?);`,
            args: [u.id, u.role, u.admin_sub_role, u.name, u.phone, u.email, u.language],
        });
    }
    // 2. Customer
    await db.execute({
        sql: `INSERT INTO customers (user_id, wallet_balance) VALUES (?, ?);`,
        args: ['cust-demo', 350.00],
    });
    // 3. Drivers
    const drivers = [
        {
            id: 'drv-1',
            vehicle_type: 'bike',
            vehicle_number: 'GJ-01-BK-8924',
            vehicle_model: 'Hero Splendor Plus (Black)',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
            is_online: true,
            status: 'approved',
            rating: 4.88,
            total_trips: 412,
            acceptance_rate: 94,
            completion_rate: 98,
            cash_in_hand_balance: 420.0,
            company_share_owed: 140.0,
            today_earnings: 840.0,
            active_delivery_minutes: 165,
            online_minutes: 280,
            waiting_minutes: 25,
            current_lat: 23.0315,
            current_lng: 72.562,
        },
        {
            id: 'drv-2',
            vehicle_type: 'cargo_auto',
            vehicle_number: 'GJ-01-AT-4819',
            vehicle_model: 'Bajaj Maxima C (CNG)',
            avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
            is_online: true,
            status: 'approved',
            rating: 4.82,
            total_trips: 289,
            acceptance_rate: 91,
            completion_rate: 97,
            cash_in_hand_balance: 890.0,
            company_share_owed: 240.0,
            today_earnings: 1250.0,
            active_delivery_minutes: 195,
            online_minutes: 310,
            waiting_minutes: 30,
            current_lat: 23.018,
            current_lng: 72.512,
        },
        {
            id: 'drv-3',
            vehicle_type: 'mini_truck',
            vehicle_number: 'GJ-01-MT-5520',
            vehicle_model: 'Tata Ace Gold (Diesel)',
            avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=150&q=80',
            is_online: true,
            status: 'approved',
            rating: 4.79,
            total_trips: 340,
            acceptance_rate: 88,
            completion_rate: 95,
            cash_in_hand_balance: 350.0,
            company_share_owed: 110.0,
            today_earnings: 1680.0,
            active_delivery_minutes: 240,
            online_minutes: 360,
            waiting_minutes: 45,
            current_lat: 23.002,
            current_lng: 72.585,
        },
        {
            id: 'drv-4',
            vehicle_type: 'truck_eicher',
            vehicle_number: 'GJ-01-TC-9182',
            vehicle_model: 'Eicher Pro 2049 (14ft)',
            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
            is_online: false,
            status: 'pending',
            rating: 4.65,
            total_trips: 140,
            acceptance_rate: 85,
            completion_rate: 92,
            cash_in_hand_balance: 0.0,
            company_share_owed: 0.0,
            today_earnings: 0.0,
            active_delivery_minutes: 0,
            online_minutes: 0,
            waiting_minutes: 0,
            current_lat: 22.95,
            current_lng: 72.48,
        },
    ];
    for (const d of drivers) {
        await db.execute({
            sql: `INSERT INTO drivers (
        id, vehicle_type, vehicle_number, vehicle_model, avatar, is_online, status, rating,
        total_trips, acceptance_rate, completion_rate, cash_in_hand_balance, company_share_owed,
        today_earnings, active_delivery_minutes, online_minutes, waiting_minutes, current_lat, current_lng
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
            args: [
                d.id, d.vehicle_type, d.vehicle_number, d.vehicle_model, d.avatar, d.is_online, d.status, d.rating,
                d.total_trips, d.acceptance_rate, d.completion_rate, d.cash_in_hand_balance, d.company_share_owed,
                d.today_earnings, d.active_delivery_minutes, d.online_minutes, d.waiting_minutes, d.current_lat, d.current_lng,
            ],
        });
    }
    // 4. Driver Documents for drv-1
    const docTypes = ['licence', 'aadhaar', 'rc', 'selfie'];
    for (const docType of docTypes) {
        await db.execute({
            sql: `INSERT INTO driver_documents (id, driver_id, doc_type, status, number, masked_number, expiry_date, front_url, back_url)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`,
            args: [
                `doc-drv-1-${docType}`,
                'drv-1',
                docType,
                'approved',
                docType === 'licence' ? 'GJ01 20180041289' : docType === 'rc' ? 'GJ-01-BK-8924' : null,
                docType === 'aadhaar' ? 'XXXX-XXXX-4129' : null,
                docType === 'licence' ? '2034-08-15' : docType === 'rc' ? '2033-04-10' : null,
                'https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?auto=format&fit=crop&w=400&q=80',
                'https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?auto=format&fit=crop&w=400&q=80',
            ],
        });
    }
    // 5. Addresses
    const addresses = [
        {
            id: 'addr-1',
            user_id: 'cust-demo',
            title: 'Home (Satellite)',
            full_address: 'A-402, Shivam Residency, Behind Shyamal Cross Road, Satellite, Ahmedabad',
            landmark: 'Opposite Shell Petrol Pump',
            floor: '4th Floor, Lift available',
            instructions: 'Ring bell twice, gate security asks for flat number',
            city: 'Ahmedabad',
            lat: 23.0125,
            lng: 72.5285,
        },
        {
            id: 'addr-2',
            user_id: 'cust-demo',
            title: 'Office (Navrangpura)',
            full_address: '6th Floor, Pinnacle Business Hub, Near Mithakhali Six Roads, Navrangpura, Ahmedabad',
            landmark: 'Next to Central Bank of India',
            floor: '6th Floor, Reception Desk',
            instructions: 'Collect visitor pass from ground floor reception',
            city: 'Ahmedabad',
            lat: 23.0338,
            lng: 72.5615,
        },
        {
            id: 'addr-3',
            user_id: 'cust-demo',
            title: 'Warehouse (Changodar)',
            full_address: 'Shed 12, Gujarat Industrial Estate, Sarkhej-Bavla Road, Changodar, Ahmedabad',
            landmark: 'Near Changodar Bridge',
            floor: 'Ground Floor Loading Bay 3',
            instructions: 'Heavy vehicles park near Gate 2',
            city: 'Ahmedabad',
            lat: 22.921,
            lng: 72.441,
        },
        {
            id: 'addr-4',
            user_id: 'cust-demo',
            title: 'Parents (Bodakdev)',
            full_address: 'B-12, Vraj Vihar Bungalows, Judges Bungalow Road, Bodakdev, Ahmedabad',
            landmark: 'Behind Pakwan Dining Hall',
            floor: 'Ground floor bungalow',
            instructions: 'Call receiver before arrival, street entry from north gate',
            city: 'Ahmedabad',
            lat: 23.0392,
            lng: 72.518,
        },
        {
            id: 'addr-5',
            user_id: 'cust-demo',
            title: 'Shop (Maninagar)',
            full_address: 'Shop 18, Radhe Shopping Center, Near Kankaria Gate 3, Maninagar, Ahmedabad',
            landmark: 'Near Balvatika Circle',
            floor: 'Ground floor',
            instructions: 'Active commercial market lane; bike or tempo can park outside shop',
            city: 'Ahmedabad',
            lat: 22.9975,
            lng: 72.6025,
        },
    ];
    for (const a of addresses) {
        await db.execute({
            sql: `INSERT INTO addresses (id, user_id, title, full_address, landmark, floor, instructions, city, lat, lng)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
            args: [a.id, a.user_id, a.title, a.full_address, a.landmark, a.floor, a.instructions, a.city, a.lat, a.lng],
        });
    }
    // 6. Pricing Config
    const pricingConfig = {
        city: 'Gujarat Logistics Corridor (Anand • Ahmedabad • Vadodara)',
        vehicles: {
            bike: { baseFare: 45, perKmRate: 10, minDistanceKm: 2 },
            cargo_auto: { baseFare: 140, perKmRate: 16, minDistanceKm: 2 },
            mini_truck: { baseFare: 280, perKmRate: 22, minDistanceKm: 3 },
            large_tempo: { baseFare: 520, perKmRate: 28, minDistanceKm: 4 },
            truck_eicher: { baseFare: 1150, perKmRate: 38, minDistanceKm: 5 },
        },
        handlingFee: 25,
        helperRatePerHelper: 180,
        packingBaseRate: 250,
        itemProtectionRatePercent: 1.5,
        nightSurgeMultiplier: 1.25,
        isSurgeActive: false,
        gstTaxRatePercent: 5,
        driverSharePercent: 80,
        maxDriverCashLimit: 1500,
        freeWaitMinutes: 10,
        waitChargePerMinute: 3,
    };
    await db.execute({
        sql: `INSERT INTO pricing_config (id, city, config_json, is_active) VALUES (?, ?, ?, TRUE);`,
        args: ['cfg-ahmedabad', 'Ahmedabad', JSON.stringify(pricingConfig)],
    });
    // 7. Seed Orders
    const order1 = {
        id: 'LM-9281',
        tracking_token: 'tr_live_9281_aera',
        status: 'in_transit',
        customer_id: 'cust-demo',
        assigned_driver_id: 'drv-1',
        sender_name: 'Kunal Shah',
        sender_phone: '9879011223',
        receiver_name: 'Advocate J. M. Mehta',
        receiver_phone: '9825123990',
        pickup_address_json: JSON.stringify(addresses[0]),
        drop_address_json: JSON.stringify(addresses[1]),
        item_json: JSON.stringify({
            category: 'electronics',
            description: 'MacBook Pro 16-inch M3 Max in padded sleeve',
            quantity: 1,
            size: 'small',
            approxWeightKg: 2.4,
            declaredValueInr: 245000,
            handlingTags: ['fragile', 'keep_upright'],
            customerPhotos: [
                'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=500&q=80',
            ],
        }),
        vehicle_type: 'bike',
        helpers_count: 0,
        has_packing_service: false,
        has_item_protection: true,
        is_scheduled: false,
        scheduled_time: null,
        return_to_sender_if_failed: true,
        fare_json: JSON.stringify({
            baseFare: 40,
            distanceKm: 6.8,
            distanceCharge: 61.2,
            handlingFee: 15,
            helperCount: 0,
            helperCharge: 0,
            packingCharge: 0,
            itemProtectionFee: 120,
            nightSurgeAdjustment: 0,
            subtotal: 236.2,
            taxesGst: 11.81,
            discount: 0,
            walletDeduction: 0,
            totalCustomerFare: 248,
            driverShare: 189,
            companyShare: 59,
            isEstimate: false,
        }),
        payment_method: 'upi',
        payment_status: 'success',
        payer: 'sender',
        pickup_otp: '4821',
        drop_otp: '7392',
        pickup_otp_verified: true,
        pickup_otp_entered_at: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
        pickup_sender_confirmed: true,
        pickup_customer_approved: true,
        drop_otp_verified: false,
        drop_otp_entered_at: null,
        drop_receiver_confirmed: false,
        drop_receiver_acknowledged: false,
        drop_issue_reported: null,
        cash_collected_confirmed: false,
        cash_amount_collected: null,
        cancel_reason: null,
        is_delayed: false,
        last_known_lat: 23.0275,
        last_known_lng: 72.549,
        reschedule_requested_by: null,
        reschedule_new_date: null,
        reschedule_new_timeslot: null,
        reschedule_status: null,
    };
    await db.execute({
        sql: `INSERT INTO orders (
      id, tracking_token, status, customer_id, assigned_driver_id, sender_name, sender_phone,
      receiver_name, receiver_phone, pickup_address_json, drop_address_json, item_json,
      vehicle_type, helpers_count, has_packing_service, has_item_protection, is_scheduled,
      scheduled_time, return_to_sender_if_failed, fare_json, payment_method, payment_status,
      payer, pickup_otp, drop_otp, pickup_otp_verified, pickup_otp_entered_at,
      pickup_sender_confirmed, pickup_customer_approved, drop_otp_verified, drop_otp_entered_at,
      drop_receiver_confirmed, drop_receiver_acknowledged, drop_issue_reported,
      cash_collected_confirmed, cash_amount_collected, cancel_reason, is_delayed,
      last_known_lat, last_known_lng
    ) VALUES (
      ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
    );`,
        args: [
            order1.id, order1.tracking_token, order1.status, order1.customer_id, order1.assigned_driver_id,
            order1.sender_name, order1.sender_phone, order1.receiver_name, order1.receiver_phone,
            order1.pickup_address_json, order1.drop_address_json, order1.item_json, order1.vehicle_type,
            order1.helpers_count, order1.has_packing_service, order1.has_item_protection, order1.is_scheduled,
            order1.scheduled_time, order1.return_to_sender_if_failed, order1.fare_json, order1.payment_method,
            order1.payment_status, order1.payer, order1.pickup_otp, order1.drop_otp, order1.pickup_otp_verified,
            order1.pickup_otp_entered_at, order1.pickup_sender_confirmed, order1.pickup_customer_approved,
            order1.drop_otp_verified, order1.drop_otp_entered_at, order1.drop_receiver_confirmed,
            order1.drop_receiver_acknowledged, order1.drop_issue_reported, order1.cash_collected_confirmed,
            order1.cash_amount_collected, order1.cancel_reason, order1.is_delayed, order1.last_known_lat,
            order1.last_known_lng,
        ],
    });
    // Order 1 proofs & timeline
    await db.execute({
        sql: `INSERT INTO order_proofs (id, order_id, stage, type, url, notes) VALUES (?, ?, ?, ?, ?, ?);`,
        args: [
            'prf-pickup-1',
            'LM-9281',
            'pickup',
            'photo',
            'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=500&q=80',
            'Original sleeve intact, screen unbroken at doorstep handover',
        ],
    });
    const timelineEvents1 = [
        { status: 'created', note: 'Booking confirmed via UPI' },
        { status: 'driver_assigned', note: 'Assigned to Vikram Patel (Hero Splendor Plus)' },
        { status: 'arrived_at_pickup', note: 'Partner arrived at Satellite doorstep' },
        { status: 'picked_up', note: 'Sender identity & OTP verified. Item inspected.' },
        { status: 'in_transit', note: 'In transit to Navrangpura office' },
    ];
    for (const t of timelineEvents1) {
        await db.execute({
            sql: `INSERT INTO order_timeline (order_id, status, note) VALUES (?, ?, ?);`,
            args: ['LM-9281', t.status, t.note],
        });
    }
    // Order 2 (Disputed order LM-7190)
    const order2 = {
        id: 'LM-7190',
        tracking_token: 'tr_hist_7190_aera',
        status: 'under_dispute',
        customer_id: 'cust-demo',
        assigned_driver_id: 'drv-3',
        sender_name: 'Kunal Shah',
        sender_phone: '9879011223',
        receiver_name: 'TechSol Graphics Lab',
        receiver_phone: '9825991823',
        pickup_address_json: JSON.stringify(addresses[0]),
        drop_address_json: JSON.stringify(addresses[2]),
        item_json: JSON.stringify({
            category: 'electronics',
            description: 'LG 27-inch 4K Studio Monitor in retail box',
            quantity: 1,
            size: 'medium',
            approxWeightKg: 8.5,
            declaredValueInr: 28000,
            handlingTags: ['fragile'],
            customerPhotos: [],
        }),
        vehicle_type: 'mini_truck',
        helpers_count: 1,
        has_packing_service: false,
        has_item_protection: true,
        is_scheduled: false,
        scheduled_time: null,
        return_to_sender_if_failed: true,
        fare_json: JSON.stringify({
            baseFare: 250,
            distanceKm: 14.2,
            distanceCharge: 284,
            handlingFee: 15,
            helperCount: 1,
            helperCharge: 180,
            packingCharge: 0,
            itemProtectionFee: 140,
            nightSurgeAdjustment: 0,
            subtotal: 869,
            taxesGst: 43.45,
            discount: 0,
            walletDeduction: 0,
            totalCustomerFare: 912,
            driverShare: 695,
            companyShare: 217,
            isEstimate: false,
        }),
        payment_method: 'card',
        payment_status: 'success',
        payer: 'sender',
        pickup_otp: '3190',
        drop_otp: '8821',
        pickup_otp_verified: true,
        pickup_otp_entered_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        pickup_sender_confirmed: true,
        pickup_customer_approved: true,
        drop_otp_verified: true,
        drop_otp_entered_at: new Date(Date.now() - 21 * 60 * 60 * 1000).toISOString(),
        drop_receiver_confirmed: true,
        drop_receiver_acknowledged: false,
        drop_issue_reported: 'Outer carton dented, lower bezel crushed during unloading',
        cash_collected_confirmed: false,
        cash_amount_collected: null,
        cancel_reason: null,
        is_delayed: false,
        last_known_lat: null,
        last_known_lng: null,
    };
    await db.execute({
        sql: `INSERT INTO orders (
      id, tracking_token, status, customer_id, assigned_driver_id, sender_name, sender_phone,
      receiver_name, receiver_phone, pickup_address_json, drop_address_json, item_json,
      vehicle_type, helpers_count, has_packing_service, has_item_protection, is_scheduled,
      scheduled_time, return_to_sender_if_failed, fare_json, payment_method, payment_status,
      payer, pickup_otp, drop_otp, pickup_otp_verified, pickup_otp_entered_at,
      pickup_sender_confirmed, pickup_customer_approved, drop_otp_verified, drop_otp_entered_at,
      drop_receiver_confirmed, drop_receiver_acknowledged, drop_issue_reported,
      cash_collected_confirmed, cash_amount_collected, cancel_reason, is_delayed,
      last_known_lat, last_known_lng
    ) VALUES (
      ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
    );`,
        args: [
            order2.id, order2.tracking_token, order2.status, order2.customer_id, order2.assigned_driver_id,
            order2.sender_name, order2.sender_phone, order2.receiver_name, order2.receiver_phone,
            order2.pickup_address_json, order2.drop_address_json, order2.item_json, order2.vehicle_type,
            order2.helpers_count, order2.has_packing_service, order2.has_item_protection, order2.is_scheduled,
            order2.scheduled_time, order2.return_to_sender_if_failed, order2.fare_json, order2.payment_method,
            order2.payment_status, order2.payer, order2.pickup_otp, order2.drop_otp, order2.pickup_otp_verified,
            order2.pickup_otp_entered_at, order2.pickup_sender_confirmed, order2.pickup_customer_approved,
            order2.drop_otp_verified, order2.drop_otp_entered_at, order2.drop_receiver_confirmed,
            order2.drop_receiver_acknowledged, order2.drop_issue_reported, order2.cash_collected_confirmed,
            order2.cash_amount_collected, order2.cancel_reason, order2.is_delayed, order2.last_known_lat,
            order2.last_known_lng,
        ],
    });
    // 8. Damage Claim for LM-7190
    await db.execute({
        sql: `INSERT INTO damage_claims (
      id, order_id, customer_id, customer_name, customer_phone, driver_name,
      item_description, declared_value_inr, claimed_amount_inr, approved_compensation_inr,
      pickup_photos_json, drop_photos_json, description, status, assigned_investigator, resolution_notes
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
        args: [
            'CLM-101',
            'LM-7190',
            'cust-demo',
            'Kunal Shah',
            '9879011223',
            'Imran Khan',
            'LG 27-inch 4K Studio Monitor in original retail box',
            28000,
            3500,
            2500,
            JSON.stringify(['https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=500&q=80']),
            JSON.stringify(['https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=500&q=80']),
            'The outer carton was dropped during transit resulting in crushed lower bezel frame. Customer purchased item protection during booking.',
            'under_review',
            'Paras M. Mecwan (Operations Lead)',
            'Provisional partial compensation recommended under transit protection policy.',
        ],
    });
    // 9. Support Tickets
    await db.execute({
        sql: `INSERT INTO support_tickets (id, order_id, user_id, user_role, user_name, user_phone, subject, category, status, priority)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
        args: [
            'TCK-201',
            'LM-9281',
            'cust-demo',
            'customer',
            'Kunal Shah',
            '9879011223',
            'Live transit query for high-value MacBook Pro',
            'delivery_delay',
            'open',
            'medium',
        ],
    });
    await db.execute({
        sql: `INSERT INTO ticket_messages (id, ticket_id, sender, sender_name, text) VALUES (?, ?, ?, ?, ?);`,
        args: [
            'msg-1',
            'TCK-201',
            'user',
            'Kunal Shah',
            'Hello, the item contains a sealed MacBook Pro. Please confirm the driver will use a direct route without stops.',
        ],
    });
    await db.execute({
        sql: `INSERT INTO ticket_messages (id, ticket_id, sender, sender_name, text) VALUES (?, ?, ?, ?, ?);`,
        args: [
            'msg-2',
            'TCK-201',
            'agent',
            'Aera Live Support',
            'Hi Kunal, partner Vikram Patel is on a dedicated direct route along Mithakhali Six Roads. ETA is ~12 minutes.',
        ],
    });
    // 10. Wallet Transactions
    const walletTxs = [
        { id: 'tx-1', customer_id: 'cust-demo', order_id: 'LM-7190', title: 'Claim Settlement Approved (LM-7190)', amount: 2500, type: 'credit' },
        { id: 'tx-2', customer_id: 'cust-demo', order_id: null, title: 'Order Payment (LM-6301)', amount: -106, type: 'debit' },
        { id: 'tx-3', customer_id: 'cust-demo', order_id: null, title: 'Promo Cashback Reward', amount: 50, type: 'credit' },
    ];
    for (const tx of walletTxs) {
        await db.execute({
            sql: `INSERT INTO wallet_transactions (id, customer_id, order_id, title, amount, type) VALUES (?, ?, ?, ?, ?, ?);`,
            args: [tx.id, tx.customer_id, tx.order_id, tx.title, tx.amount, tx.type],
        });
    }
    // 11. Prohibited Items
    const prohibitedItems = [
        { id: 'p-1', name: 'Explosives, Fireworks & Gunpowder', category: 'Hazardous', fine_amount: 10000, risk_level: 'critical' },
        { id: 'p-2', name: 'Loose Flammable Solvents & Fuel', category: 'Flammable', fine_amount: 5000, risk_level: 'critical' },
        { id: 'p-3', name: 'Physical Cash Currency (> ₹50,000)', category: 'Financial', fine_amount: 2000, risk_level: 'high' },
        { id: 'p-4', name: 'Illegal Narcotics & Contraband', category: 'Legal', fine_amount: 15000, risk_level: 'critical' },
        { id: 'p-5', name: 'Live Animals or Livestock', category: 'Biological', fine_amount: 2500, risk_level: 'medium' },
        { id: 'p-6', name: 'Unpackaged Corrosive Acids', category: 'Chemical', fine_amount: 7500, risk_level: 'critical' },
    ];
    for (const p of prohibitedItems) {
        await db.execute({
            sql: `INSERT INTO prohibited_items (id, name, category, fine_amount, risk_level, is_active) VALUES (?, ?, ?, ?, ?, TRUE);`,
            args: [p.id, p.name, p.category, p.fine_amount, p.risk_level],
        });
    }
    // 12. FAQs
    const faqs = [
        {
            id: 'faq-1',
            category: 'customer',
            question: 'How do I know my goods are safe with Local Move?',
            answer: 'Every trip requires photo verification before loading and at drop-off. Delivery partners are background-checked with verified Aadhaar and driving license. Live GPS tracking is provided throughout the trip.',
        },
        {
            id: 'faq-2',
            category: 'safety',
            question: 'What items are strictly prohibited?',
            answer: 'Explosives, hazardous chemicals, livestock, and unmanifested cash are strictly prohibited under Section 14 of Indian Logistics Safety Guidelines.',
        },
        {
            id: 'faq-3',
            category: 'driver',
            question: 'How do partner payouts work?',
            answer: 'Partners receive 80% base fare share plus 100% of customer tips directly into their registered bank account or UPI address daily.',
        },
    ];
    for (const f of faqs) {
        await db.execute({
            sql: `INSERT INTO faqs (id, category, question, answer, is_active) VALUES (?, ?, ?, ?, TRUE);`,
            args: [f.id, f.category, f.question, f.answer],
        });
    }
    // 13. Notifications
    const notifications = [
        {
            id: 'notif-1',
            user_id: 'cust-demo',
            title: 'Driver En Route to Pickup (Vikram Patel)',
            description: 'Your delivery partner is arriving at Satellite doorstep in a Hero Splendor Plus (GJ-01-BK-8924).',
            category: 'delivery',
            is_read: false,
            order_id: 'LM-9281',
            action_url: '/customer/orders/LM-9281',
            action_label: 'Track Live',
        },
        {
            id: 'notif-2',
            user_id: 'cust-demo',
            title: 'Confidential Pickup OTP Generated',
            description: 'Your pickup verification OTP is 4821. Disclose only after inspecting partner identity.',
            category: 'security',
            is_read: false,
            order_id: 'LM-9281',
            action_url: '/customer/orders/LM-9281',
            action_label: 'View OTP',
        },
        {
            id: 'notif-3',
            user_id: 'cust-demo',
            title: 'Wallet Balance Top-up Successful',
            description: '₹500 added via UPI. Instant cashback credited to your Local Move balance.',
            category: 'account',
            is_read: true,
            order_id: null,
            action_url: '/customer/wallet',
            action_label: 'Check Wallet',
        },
    ];
    for (const n of notifications) {
        await db.execute({
            sql: `INSERT INTO notifications (id, user_id, title, description, category, is_read, order_id, action_url, action_label)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`,
            args: [n.id, n.user_id, n.title, n.description, n.category, n.is_read, n.order_id, n.action_url, n.action_label],
        });
    }
    // 14. Audit logs
    await db.execute({
        sql: `INSERT INTO audit_logs (id, action, operator, role, target, details) VALUES (?, ?, ?, ?, ?, ?);`,
        args: [
            'log-1',
            'PRICE_UPDATE',
            'SuperAdmin (Jay Patel)',
            'super_admin',
            'Tariff Engine',
            'Updated base rate parameters for Ahmedabad metropolitan delivery zone.',
        ],
    });
    console.log('Database seeded successfully!');
}
// Allow direct CLI execution
if (process.argv[1]?.endsWith('seed.ts') || process.argv[1]?.endsWith('seed.js')) {
    seedDatabase()
        .then(() => process.exit(0))
        .catch((err) => {
        console.error('Seed failed:', err);
        process.exit(1);
    });
}
//# sourceMappingURL=seed.js.map