import { db } from '../config/db.js';
export const DDL_STATEMENTS = [
    // 1. Users table
    `CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(64) PRIMARY KEY,
    role VARCHAR(20) NOT NULL CHECK (role IN ('customer', 'driver', 'admin', 'receiver')),
    admin_sub_role VARCHAR(20) NULL CHECK (admin_sub_role IN ('super_admin', 'operations', 'support', 'finance')),
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(30) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL,
    language VARCHAR(10) NOT NULL DEFAULT 'en',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
  );`,
    // 2. Customers
    `CREATE TABLE IF NOT EXISTS customers (
    user_id VARCHAR(64) PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    wallet_balance NUMERIC(10, 2) NOT NULL DEFAULT 350.00,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
  );`,
    // 3. Drivers
    `CREATE TABLE IF NOT EXISTS drivers (
    id VARCHAR(64) PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    vehicle_type VARCHAR(50) NOT NULL,
    vehicle_number VARCHAR(50) NOT NULL,
    vehicle_model VARCHAR(100) NOT NULL,
    avatar TEXT NOT NULL,
    is_online BOOLEAN NOT NULL DEFAULT TRUE,
    status VARCHAR(20) NOT NULL DEFAULT 'approved' CHECK (status IN ('pending', 'approved', 'rejected', 'suspended')),
    rating NUMERIC(3, 2) NOT NULL DEFAULT 4.85,
    total_trips INTEGER NOT NULL DEFAULT 0,
    acceptance_rate INTEGER NOT NULL DEFAULT 95,
    completion_rate INTEGER NOT NULL DEFAULT 98,
    cash_in_hand_balance NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    company_share_owed NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    today_earnings NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    active_delivery_minutes INTEGER NOT NULL DEFAULT 0,
    online_minutes INTEGER NOT NULL DEFAULT 0,
    waiting_minutes INTEGER NOT NULL DEFAULT 0,
    current_lat NUMERIC(10, 6) NOT NULL DEFAULT 23.0225,
    current_lng NUMERIC(10, 6) NOT NULL DEFAULT 72.5714,
    active_order_id VARCHAR(64) NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
  );`,
    // 4. Driver Documents
    `CREATE TABLE IF NOT EXISTS driver_documents (
    id VARCHAR(64) PRIMARY KEY,
    driver_id VARCHAR(64) NOT NULL REFERENCES drivers(id) ON DELETE CASCADE,
    doc_type VARCHAR(20) NOT NULL CHECK (doc_type IN ('licence', 'aadhaar', 'rc', 'selfie')),
    status VARCHAR(20) NOT NULL DEFAULT 'approved' CHECK (status IN ('pending', 'approved', 'rejected', 'expired')),
    number VARCHAR(100) NULL,
    masked_number VARCHAR(100) NULL,
    expiry_date VARCHAR(50) NULL,
    front_url TEXT NULL,
    back_url TEXT NULL,
    rejection_reason TEXT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(driver_id, doc_type)
  );`,
    // 5. Saved Addresses
    `CREATE TABLE IF NOT EXISTS addresses (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(100) NOT NULL,
    full_address TEXT NOT NULL,
    landmark VARCHAR(255) NULL,
    floor VARCHAR(50) NULL,
    instructions TEXT NULL,
    city VARCHAR(100) NOT NULL DEFAULT 'Ahmedabad',
    lat NUMERIC(10, 6) NOT NULL,
    lng NUMERIC(10, 6) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
  );`,
    // 6. Orders
    `CREATE TABLE IF NOT EXISTS orders (
    id VARCHAR(64) PRIMARY KEY,
    tracking_token VARCHAR(64) NOT NULL UNIQUE,
    status VARCHAR(50) NOT NULL,
    customer_id VARCHAR(64) NOT NULL REFERENCES users(id),
    assigned_driver_id VARCHAR(64) NULL REFERENCES drivers(id),
    sender_name VARCHAR(255) NOT NULL,
    sender_phone VARCHAR(30) NOT NULL,
    receiver_name VARCHAR(255) NOT NULL,
    receiver_phone VARCHAR(30) NOT NULL,
    pickup_address_json TEXT NOT NULL,
    drop_address_json TEXT NOT NULL,
    item_json TEXT NOT NULL,
    vehicle_type VARCHAR(50) NOT NULL,
    helpers_count INTEGER NOT NULL DEFAULT 0,
    has_packing_service BOOLEAN NOT NULL DEFAULT FALSE,
    has_item_protection BOOLEAN NOT NULL DEFAULT FALSE,
    is_scheduled BOOLEAN NOT NULL DEFAULT FALSE,
    scheduled_time VARCHAR(100) NULL,
    return_to_sender_if_failed BOOLEAN NOT NULL DEFAULT TRUE,
    fare_json TEXT NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    payment_status VARCHAR(50) NOT NULL,
    payer VARCHAR(50) NOT NULL,
    pickup_otp VARCHAR(10) NOT NULL,
    drop_otp VARCHAR(10) NOT NULL,
    pickup_otp_verified BOOLEAN NOT NULL DEFAULT FALSE,
    pickup_otp_entered_at TIMESTAMPTZ NULL,
    pickup_sender_confirmed BOOLEAN NOT NULL DEFAULT FALSE,
    pickup_customer_approved BOOLEAN NOT NULL DEFAULT FALSE,
    drop_otp_verified BOOLEAN NOT NULL DEFAULT FALSE,
    drop_otp_entered_at TIMESTAMPTZ NULL,
    drop_receiver_confirmed BOOLEAN NOT NULL DEFAULT FALSE,
    drop_receiver_acknowledged BOOLEAN NOT NULL DEFAULT FALSE,
    drop_issue_reported TEXT NULL,
    cash_collected_confirmed BOOLEAN NOT NULL DEFAULT FALSE,
    cash_amount_collected NUMERIC(10, 2) NULL,
    cancel_reason TEXT NULL,
    is_delayed BOOLEAN NOT NULL DEFAULT FALSE,
    last_known_lat NUMERIC(10, 6) NULL,
    last_known_lng NUMERIC(10, 6) NULL,
    reschedule_requested_by VARCHAR(50) NULL,
    reschedule_new_date VARCHAR(50) NULL,
    reschedule_new_timeslot VARCHAR(50) NULL,
    reschedule_status VARCHAR(50) NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
  );`,
    // 7. Order Proofs
    `CREATE TABLE IF NOT EXISTS order_proofs (
    id VARCHAR(64) PRIMARY KEY,
    order_id VARCHAR(64) NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    stage VARCHAR(20) NOT NULL CHECK (stage IN ('pickup', 'drop')),
    type VARCHAR(20) NOT NULL CHECK (type IN ('photo', 'video')),
    url TEXT NOT NULL,
    notes TEXT NULL,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
  );`,
    // 8. Order Timeline
    `CREATE TABLE IF NOT EXISTS order_timeline (
    id SERIAL PRIMARY KEY,
    order_id VARCHAR(64) NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    status VARCHAR(50) NOT NULL,
    note TEXT NOT NULL,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
  );`,
    // 9. Order Ratings
    `CREATE TABLE IF NOT EXISTS order_ratings (
    id VARCHAR(64) PRIMARY KEY,
    order_id VARCHAR(64) NOT NULL UNIQUE REFERENCES orders(id) ON DELETE CASCADE,
    stars INTEGER NOT NULL CHECK (stars BETWEEN 1 AND 5),
    comment TEXT NULL,
    tip_inr NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
  );`,
    // 10. Wallet Transactions
    `CREATE TABLE IF NOT EXISTS wallet_transactions (
    id VARCHAR(64) PRIMARY KEY,
    customer_id VARCHAR(64) NOT NULL REFERENCES customers(user_id),
    order_id VARCHAR(64) NULL REFERENCES orders(id),
    title VARCHAR(255) NOT NULL,
    amount NUMERIC(10, 2) NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('credit', 'debit')),
    timestamp TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
  );`,
    // 11. Damage Claims
    `CREATE TABLE IF NOT EXISTS damage_claims (
    id VARCHAR(64) PRIMARY KEY,
    order_id VARCHAR(64) NOT NULL REFERENCES orders(id),
    customer_id VARCHAR(64) NOT NULL REFERENCES users(id),
    customer_name VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(30) NOT NULL,
    driver_name VARCHAR(255) NOT NULL,
    item_description TEXT NOT NULL,
    declared_value_inr NUMERIC(10, 2) NOT NULL,
    claimed_amount_inr NUMERIC(10, 2) NOT NULL,
    approved_compensation_inr NUMERIC(10, 2) NULL,
    pickup_photos_json TEXT NOT NULL,
    drop_photos_json TEXT NOT NULL,
    description TEXT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'under_review' CHECK (status IN ('open', 'under_review', 'approved', 'rejected')),
    assigned_investigator VARCHAR(255) NULL,
    resolution_notes TEXT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
  );`,
    // 12. Support Tickets
    `CREATE TABLE IF NOT EXISTS support_tickets (
    id VARCHAR(64) PRIMARY KEY,
    order_id VARCHAR(64) NULL REFERENCES orders(id),
    user_id VARCHAR(64) NOT NULL REFERENCES users(id),
    user_role VARCHAR(50) NOT NULL,
    user_name VARCHAR(255) NOT NULL,
    user_phone VARCHAR(30) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
    priority VARCHAR(20) NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
  );`,
    // 13. Ticket Messages
    `CREATE TABLE IF NOT EXISTS ticket_messages (
    id VARCHAR(64) PRIMARY KEY,
    ticket_id VARCHAR(64) NOT NULL REFERENCES support_tickets(id) ON DELETE CASCADE,
    sender VARCHAR(20) NOT NULL CHECK (sender IN ('user', 'agent')),
    sender_name VARCHAR(255) NOT NULL,
    text TEXT NOT NULL,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
  );`,
    // 14. Pricing Configuration
    `CREATE TABLE IF NOT EXISTS pricing_config (
    id VARCHAR(64) PRIMARY KEY,
    city VARCHAR(100) NOT NULL UNIQUE,
    config_json TEXT NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
  );`,
    // 15. Prohibited Items
    `CREATE TABLE IF NOT EXISTS prohibited_items (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    fine_amount NUMERIC(10, 2) NOT NULL,
    risk_level VARCHAR(20) NOT NULL CHECK (risk_level IN ('critical', 'high', 'medium')),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
  );`,
    // 16. FAQs
    `CREATE TABLE IF NOT EXISTS faqs (
    id VARCHAR(64) PRIMARY KEY,
    category VARCHAR(20) NOT NULL CHECK (category IN ('customer', 'driver', 'safety')),
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
  );`,
    // 17. Notifications
    `CREATE TABLE IF NOT EXISTS notifications (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    order_id VARCHAR(64) NULL,
    action_url TEXT NULL,
    action_label VARCHAR(100) NULL,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
  );`,
    // 18. Audit Logs
    `CREATE TABLE IF NOT EXISTS audit_logs (
    id VARCHAR(64) PRIMARY KEY,
    action VARCHAR(100) NOT NULL,
    operator VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    target VARCHAR(255) NOT NULL,
    details TEXT NOT NULL,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ip VARCHAR(45) NOT NULL DEFAULT '127.0.0.1'
  );`,
    // High-performance Indexes
    `CREATE INDEX IF NOT EXISTS idx_orders_customer ON orders(customer_id);`,
    `CREATE INDEX IF NOT EXISTS idx_orders_driver ON orders(assigned_driver_id);`,
    `CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);`,
    `CREATE INDEX IF NOT EXISTS idx_orders_token ON orders(tracking_token);`,
    `CREATE INDEX IF NOT EXISTS idx_drivers_online ON drivers(is_online, status);`,
    `CREATE INDEX IF NOT EXISTS idx_claims_status ON damage_claims(status);`,
    `CREATE INDEX IF NOT EXISTS idx_tickets_user ON support_tickets(user_id);`,
    `CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id, is_read);`,
    `CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);`,
    `CREATE INDEX IF NOT EXISTS idx_addresses_user ON addresses(user_id);`,
];
export async function createSchema() {
    await db.init();
    for (const stmt of DDL_STATEMENTS) {
        await db.execute(stmt);
    }
}
//# sourceMappingURL=schema.js.map