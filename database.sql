-- ============================================================================
-- Local Move - Complete PostgreSQL Database Schema & Initial Datasets
-- Platform: Hyperlocal Intra-City Logistics & Delivery Architecture (Ahmedabad)
-- Compatible with: PostgreSQL 14+, 15+, 16+, Neon, Supabase, Cloud SQL, AWS RDS
-- ============================================================================

-- ============================================================================
-- 1. EXTENSIONS & FUNCTIONS
-- ============================================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Auto-update updated_at timestamp function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- 2. CORE USER & ACCOUNT TABLES
-- ============================================================================

-- 1. Users
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(64) PRIMARY KEY,
  role VARCHAR(20) NOT NULL CHECK (role IN ('customer', 'driver', 'admin', 'receiver')),
  admin_sub_role VARCHAR(20) NULL CHECK (admin_sub_role IN ('super_admin', 'operations', 'support', 'finance')),
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(30) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL,
  language VARCHAR(10) NOT NULL DEFAULT 'en',
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 2. Customers
CREATE TABLE IF NOT EXISTS customers (
  user_id VARCHAR(64) PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  wallet_balance NUMERIC(10, 2) NOT NULL DEFAULT 350.00,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 3. Drivers
CREATE TABLE IF NOT EXISTS drivers (
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
);

-- 4. Driver Documents
CREATE TABLE IF NOT EXISTS driver_documents (
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
);

-- 5. Saved Addresses
CREATE TABLE IF NOT EXISTS addresses (
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
);

-- ============================================================================
-- 3. ORDERS & LOGISTICS TABLES
-- ============================================================================

-- 6. Orders
CREATE TABLE IF NOT EXISTS orders (
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
);

-- 7. Order Proofs
CREATE TABLE IF NOT EXISTS order_proofs (
  id VARCHAR(64) PRIMARY KEY,
  order_id VARCHAR(64) NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  stage VARCHAR(20) NOT NULL CHECK (stage IN ('pickup', 'drop')),
  type VARCHAR(20) NOT NULL CHECK (type IN ('photo', 'video')),
  url TEXT NOT NULL,
  notes TEXT NULL,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 8. Order Timeline
CREATE TABLE IF NOT EXISTS order_timeline (
  id SERIAL PRIMARY KEY,
  order_id VARCHAR(64) NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  status VARCHAR(50) NOT NULL,
  note TEXT NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 9. Order Ratings
CREATE TABLE IF NOT EXISTS order_ratings (
  id VARCHAR(64) PRIMARY KEY,
  order_id VARCHAR(64) NOT NULL UNIQUE REFERENCES orders(id) ON DELETE CASCADE,
  stars INTEGER NOT NULL CHECK (stars BETWEEN 1 AND 5),
  comment TEXT NULL,
  tip_inr NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- 4. FINANCIAL & CUSTOMER SUPPORT TABLES
-- ============================================================================

-- 10. Wallet Transactions
CREATE TABLE IF NOT EXISTS wallet_transactions (
  id VARCHAR(64) PRIMARY KEY,
  customer_id VARCHAR(64) NOT NULL REFERENCES customers(user_id),
  order_id VARCHAR(64) NULL REFERENCES orders(id),
  title VARCHAR(255) NOT NULL,
  amount NUMERIC(10, 2) NOT NULL,
  type VARCHAR(20) NOT NULL CHECK (type IN ('credit', 'debit')),
  timestamp TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 11. Damage Claims
CREATE TABLE IF NOT EXISTS damage_claims (
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
);

-- 12. Support Tickets
CREATE TABLE IF NOT EXISTS support_tickets (
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
);

-- 13. Ticket Messages
CREATE TABLE IF NOT EXISTS ticket_messages (
  id VARCHAR(64) PRIMARY KEY,
  ticket_id VARCHAR(64) NOT NULL REFERENCES support_tickets(id) ON DELETE CASCADE,
  sender VARCHAR(20) NOT NULL CHECK (sender IN ('user', 'agent')),
  sender_name VARCHAR(255) NOT NULL,
  text TEXT NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- 5. CONFIGURATION, CONTENT & AUDIT TABLES
-- ============================================================================

-- 14. Pricing Configuration
CREATE TABLE IF NOT EXISTS pricing_config (
  id VARCHAR(64) PRIMARY KEY,
  city VARCHAR(100) NOT NULL UNIQUE,
  config_json TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 15. Prohibited Items
CREATE TABLE IF NOT EXISTS prohibited_items (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  fine_amount NUMERIC(10, 2) NOT NULL,
  risk_level VARCHAR(20) NOT NULL CHECK (risk_level IN ('critical', 'high', 'medium')),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 16. FAQs
CREATE TABLE IF NOT EXISTS faqs (
  id VARCHAR(64) PRIMARY KEY,
  category VARCHAR(20) NOT NULL CHECK (category IN ('customer', 'driver', 'safety')),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 17. Notifications
CREATE TABLE IF NOT EXISTS notifications (
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
);

-- 18. Audit Logs
CREATE TABLE IF NOT EXISTS audit_logs (
  id VARCHAR(64) PRIMARY KEY,
  action VARCHAR(100) NOT NULL,
  operator VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL,
  target VARCHAR(255) NOT NULL,
  details TEXT NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ip VARCHAR(45) NOT NULL DEFAULT '127.0.0.1'
);

-- ============================================================================
-- 6. HIGH PERFORMANCE INDEXES
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_orders_customer ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_driver ON orders(assigned_driver_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_token ON orders(tracking_token);
CREATE INDEX IF NOT EXISTS idx_drivers_online ON drivers(is_online, status);
CREATE INDEX IF NOT EXISTS idx_claims_status ON damage_claims(status);
CREATE INDEX IF NOT EXISTS idx_tickets_user ON support_tickets(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);
CREATE INDEX IF NOT EXISTS idx_addresses_user ON addresses(user_id);

-- ============================================================================
-- 7. INITIAL SEED DATA
-- ============================================================================

-- Users
INSERT INTO users (id, role, admin_sub_role, name, phone, email, language) VALUES
  ('cust-demo', 'customer', NULL, 'Kunal Shah', '9879011223', 'kunal.shah@example.com', 'en'),
  ('drv-1', 'driver', NULL, 'Vikram Patel', '9825012345', 'vikram.patel.driver@gmail.com', 'gu'),
  ('drv-2', 'driver', NULL, 'Rajesh Makwana', '9898011234', 'rajesh.makwana@gmail.com', 'hi'),
  ('drv-3', 'driver', NULL, 'Imran Khan', '9727055443', 'imran.khan.tempo@gmail.com', 'en'),
  ('drv-4', 'driver', NULL, 'Mahendra Vaghela', '9426089123', 'mahendra.eicher@gmail.com', 'gu'),
  ('admin-1', 'admin', 'super_admin', 'Jay Patel (Operations Lead)', '9558690109', 'admin@localmove.in', 'en')
ON CONFLICT (id) DO NOTHING;

-- Customers
INSERT INTO customers (user_id, wallet_balance) VALUES
  ('cust-demo', 350.00)
ON CONFLICT (user_id) DO NOTHING;

-- Drivers
INSERT INTO drivers (
  id, vehicle_type, vehicle_number, vehicle_model, avatar, is_online, status, rating,
  total_trips, acceptance_rate, completion_rate, cash_in_hand_balance, company_share_owed,
  today_earnings, active_delivery_minutes, online_minutes, waiting_minutes, current_lat, current_lng
) VALUES
  ('drv-1', 'bike', 'GJ-01-BK-8924', 'Hero Splendor Plus (Black)', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80', TRUE, 'approved', 4.88, 412, 94, 98, 420.0, 140.0, 840.0, 165, 280, 25, 23.0315, 72.5620),
  ('drv-2', 'cargo_auto', 'GJ-01-AT-4819', 'Bajaj Maxima C (CNG)', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80', TRUE, 'approved', 4.82, 289, 91, 97, 890.0, 240.0, 1250.0, 195, 310, 30, 23.0180, 72.5120),
  ('drv-3', 'mini_truck', 'GJ-01-MT-5520', 'Tata Ace Gold (Diesel)', 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=150&q=80', TRUE, 'approved', 4.79, 340, 88, 95, 350.0, 110.0, 1680.0, 240, 360, 45, 23.0020, 72.5850),
  ('drv-4', 'truck_eicher', 'GJ-01-TC-9182', 'Eicher Pro 2049 (14ft)', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80', FALSE, 'pending', 4.65, 140, 85, 92, 0.0, 0.0, 0.0, 0, 0, 0, 22.9500, 72.4800)
ON CONFLICT (id) DO NOTHING;

-- Driver Documents
INSERT INTO driver_documents (id, driver_id, doc_type, status, number, masked_number, expiry_date, front_url, back_url) VALUES
  ('doc-drv-1-licence', 'drv-1', 'licence', 'approved', 'GJ01 20180041289', NULL, '2034-08-15', 'https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?auto=format&fit=crop&w=400&q=80', 'https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?auto=format&fit=crop&w=400&q=80'),
  ('doc-drv-1-aadhaar', 'drv-1', 'aadhaar', 'approved', NULL, 'XXXX-XXXX-4129', NULL, 'https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?auto=format&fit=crop&w=400&q=80', 'https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?auto=format&fit=crop&w=400&q=80'),
  ('doc-drv-1-rc', 'drv-1', 'rc', 'approved', 'GJ-01-BK-8924', NULL, '2033-04-10', 'https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?auto=format&fit=crop&w=400&q=80', 'https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?auto=format&fit=crop&w=400&q=80'),
  ('doc-drv-1-selfie', 'drv-1', 'selfie', 'approved', NULL, NULL, NULL, 'https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?auto=format&fit=crop&w=400&q=80', NULL)
ON CONFLICT (driver_id, doc_type) DO NOTHING;

-- Saved Addresses
INSERT INTO addresses (id, user_id, title, full_address, landmark, floor, instructions, city, lat, lng) VALUES
  ('addr-1', 'cust-demo', 'Home (Satellite)', 'A-402, Shivam Residency, Behind Shyamal Cross Road, Satellite, Ahmedabad', 'Opposite Shell Petrol Pump', '4th Floor, Lift available', 'Ring bell twice, gate security asks for flat number', 'Ahmedabad', 23.0125, 72.5285),
  ('addr-2', 'cust-demo', 'Office (Navrangpura)', '6th Floor, Pinnacle Business Hub, Near Mithakhali Six Roads, Navrangpura, Ahmedabad', 'Next to Central Bank of India', '6th Floor, Reception Desk', 'Collect visitor pass from ground floor reception', 'Ahmedabad', 23.0338, 72.5615),
  ('addr-3', 'cust-demo', 'Warehouse (Changodar)', 'Shed 12, Gujarat Industrial Estate, Sarkhej-Bavla Road, Changodar, Ahmedabad', 'Near Changodar Bridge', 'Ground Floor Loading Bay 3', 'Heavy vehicles park near Gate 2', 'Ahmedabad', 22.9210, 72.4410),
  ('addr-4', 'cust-demo', 'Parents (Bodakdev)', 'B-12, Vraj Vihar Bungalows, Judges Bungalow Road, Bodakdev, Ahmedabad', 'Behind Pakwan Dining Hall', 'Ground floor bungalow', 'Call receiver before arrival, street entry from north gate', 'Ahmedabad', 23.0392, 72.5180),
  ('addr-5', 'cust-demo', 'Shop (Maninagar)', 'Shop 18, Radhe Shopping Center, Near Kankaria Gate 3, Maninagar, Ahmedabad', 'Near Balvatika Circle', 'Ground floor', 'Active commercial market lane; bike or tempo can park outside shop', 'Ahmedabad', 22.9975, 72.6025)
ON CONFLICT (id) DO NOTHING;

-- Pricing Configuration
INSERT INTO pricing_config (id, city, config_json, is_active) VALUES
  ('cfg-ahmedabad', 'Ahmedabad', '{"city":"Gujarat Logistics Corridor (Anand • Ahmedabad • Vadodara)","vehicles":{"bike":{"baseFare":45,"perKmRate":10,"minDistanceKm":2},"cargo_auto":{"baseFare":140,"perKmRate":16,"minDistanceKm":2},"mini_truck":{"baseFare":280,"perKmRate":22,"minDistanceKm":3},"large_tempo":{"baseFare":520,"perKmRate":28,"minDistanceKm":4},"truck_eicher":{"baseFare":1150,"perKmRate":38,"minDistanceKm":5}},"handlingFee":25,"helperRatePerHelper":180,"packingBaseRate":250,"itemProtectionRatePercent":1.5,"nightSurgeMultiplier":1.25,"isSurgeActive":false,"gstTaxRatePercent":5,"driverSharePercent":80,"maxDriverCashLimit":1500,"freeWaitMinutes":10,"waitChargePerMinute":3}', TRUE)
ON CONFLICT (id) DO NOTHING;

-- Prohibited Items
INSERT INTO prohibited_items (id, name, category, fine_amount, risk_level, is_active) VALUES
  ('p-1', 'Explosives, Fireworks & Gunpowder', 'Hazardous', 10000.00, 'critical', TRUE),
  ('p-2', 'Loose Flammable Solvents & Fuel', 'Flammable', 5000.00, 'critical', TRUE),
  ('p-3', 'Physical Cash Currency (> ₹50,000)', 'Financial', 2000.00, 'high', TRUE),
  ('p-4', 'Illegal Narcotics & Contraband', 'Legal', 15000.00, 'critical', TRUE),
  ('p-5', 'Live Animals or Livestock', 'Biological', 2500.00, 'medium', TRUE),
  ('p-6', 'Unpackaged Corrosive Acids', 'Chemical', 7500.00, 'critical', TRUE)
ON CONFLICT (id) DO NOTHING;

-- FAQs
INSERT INTO faqs (id, category, question, answer, is_active) VALUES
  ('faq-1', 'customer', 'How do I know my goods are safe with Local Move?', 'Every trip requires photo verification before loading and at drop-off. Delivery partners are background-checked with verified Aadhaar and driving license. Live GPS tracking is provided throughout the trip.', TRUE),
  ('faq-2', 'safety', 'What items are strictly prohibited?', 'Explosives, hazardous chemicals, livestock, and unmanifested cash are strictly prohibited under Section 14 of Indian Logistics Safety Guidelines.', TRUE),
  ('faq-3', 'driver', 'How do partner payouts work?', 'Partners receive 80% base fare share plus 100% of customer tips directly into their registered bank account or UPI address daily.', TRUE)
ON CONFLICT (id) DO NOTHING;

-- Notifications
INSERT INTO notifications (id, user_id, title, description, category, is_read, order_id, action_url, action_label) VALUES
  ('notif-1', 'cust-demo', 'Driver En Route to Pickup (Vikram Patel)', 'Your delivery partner is arriving at Satellite doorstep in a Hero Splendor Plus (GJ-01-BK-8924).', 'delivery', FALSE, 'LM-9281', '/customer/orders/LM-9281', 'Track Live'),
  ('notif-2', 'cust-demo', 'Confidential Pickup OTP Generated', 'Your pickup verification OTP is 4821. Disclose only after inspecting partner identity.', 'security', FALSE, 'LM-9281', '/customer/orders/LM-9281', 'View OTP'),
  ('notif-3', 'cust-demo', 'Wallet Balance Top-up Successful', '₹500 added via UPI. Instant cashback credited to your Local Move balance.', 'account', TRUE, NULL, '/customer/wallet', 'Check Wallet')
ON CONFLICT (id) DO NOTHING;

-- Audit Logs
INSERT INTO audit_logs (id, action, operator, role, target, details) VALUES
  ('log-1', 'PRICE_UPDATE', 'SuperAdmin (Jay Patel)', 'super_admin', 'Tariff Engine', 'Updated base rate parameters for Ahmedabad metropolitan delivery zone.')
ON CONFLICT (id) DO NOTHING;
