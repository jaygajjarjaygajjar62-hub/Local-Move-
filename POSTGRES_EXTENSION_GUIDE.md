# 🐘 Local Move - PostgreSQL Database & IDE Extension Setup Guide

The Local Move database has been migrated and built with **PostgreSQL**, with full support for your installed **Database Client** IDE extension (`cweijan.vscode-mysql-client2`).

---

## 🚀 Quick Summary of What Was Built

1. **Full PostgreSQL Schema (18 Tables)**:
   - `users` (Roles: customer, driver, admin, receiver)
   - `customers` (Wallet balance, profile link)
   - `drivers` (Vehicle specs, online status, ratings, earnings, real-time GPS coordinates)
   - `driver_documents` (Licence, Aadhaar, RC, Selfie verification)
   - `addresses` (Saved places with lat/lng in Ahmedabad)
   - `orders` (Full lifecycle, OTPs, pricing breakdown, tracking tokens)
   - `order_proofs` (Pickup & drop photos, inspection records)
   - `order_timeline` (Event log with serial sequence)
   - `order_ratings` (Star reviews, comments, tips)
   - `wallet_transactions` (Credits, debits, UPI top-ups)
   - `damage_claims` (Transit damage protection claims, investigation notes)
   - `support_tickets` (Customer and driver support queries)
   - `ticket_messages` (Two-way support chat history)
   - `pricing_config` (Dynamic per-vehicle tariff engine for Ahmedabad)
   - `prohibited_items` (Safety compliance & fines)
   - `faqs` (Knowledge base)
   - `notifications` (Push alerts & OTP notifications)
   - `audit_logs` (Security & operations log)

2. **Built-in PostgreSQL Wire Protocol Server**:
   - Runs on standard PostgreSQL port **`5432`**.
   - Speaks standard PostgreSQL network wire protocol.
   - Allows your **Antigravity IDE Database Client extension**, `psql`, TablePlus, or DBeaver to connect directly to `localhost:5432`.
   - Stores data persistently on disk in `./server/data/postgres/`.

3. **External PostgreSQL Compatibility**:
   - If you ever want to point Local Move to an external PostgreSQL database (Supabase, Neon, AWS RDS, GCP Cloud SQL, or native Postgres), just edit `DATABASE_URL` in `server/.env`.

4. **Master SQL File**:
   - [`database.sql`](file:///c:/Users/jay/Desktop/Localmove/database.sql): complete DDL and seed scripts for direct execution.

---

## 🔌 Connecting to PostgreSQL in Your IDE Extension

Your Antigravity IDE already has the **Database Client** extension installed (`cweijan.vscode-mysql-client2`). Follow these 4 simple steps to browse your database visually:

### Step 1: Open Database Client in the IDE
Click on the **Database** icon in the IDE's left Activity Bar (the cylinder / database stack icon).

### Step 2: Add a New Connection
Click the **`+` (Add Connection)** button or select **Create Connection**.

### Step 3: Choose PostgreSQL & Enter Details
Select **PostgreSQL** from the database types list, and enter the following settings:

| Field | Value |
| :--- | :--- |
| **Host** | `127.0.0.1` *(or `localhost`)* |
| **Port** | `5432` |
| **User** | `postgres` |
| **Password** | `postgres` |
| **Database** | `localmove` |
| **SSL** | `false` / Off |

### Step 4: Click "Save" or "Connect"
You will immediately see the **`localmove`** database appear in the sidebar with all **18 tables**!
- Double-click any table (e.g. `orders`, `drivers`, `users`) to view live records.
- Right-click to query, insert, or filter data.
- Open [`database.sql`](file:///c:/Users/jay/Desktop/Localmove/database.sql) and execute queries directly in the editor.

---

## 🛠️ Handy CLI Commands

From the project root:

```bash
# Start frontend and backend (PostgreSQL server automatically starts on port 5432)
npm run dev

# Re-initialize and seed the PostgreSQL database
npm --prefix server run db:init

# Verify table record counts
npm --prefix server run db:verify
```

---

## 📊 Verified PostgreSQL Table Record Counts

| Table | Records | Purpose |
| :--- | :---: | :--- |
| `users` | **6** | Admin, Drivers, Customers in Ahmedabad |
| `customers` | **1** | Customer profile with ₹350 wallet balance |
| `drivers` | **4** | Bike, Cargo Auto, Mini Truck, 14ft Truck |
| `driver_documents` | **4** | Driving licence, Aadhaar, RC, Selfie |
| `addresses` | **5** | Satellite, Navrangpura, Changodar, Bodakdev, Maninagar |
| `orders` | **2** | In-transit live order & disputed claim order |
| `order_proofs` | **1** | Doorstep photo proof verification |
| `order_timeline` | **5** | Step-by-step order journey milestones |
| `wallet_transactions` | **3** | Claim settlement, promo credit, order debit |
| `damage_claims` | **1** | Transit protection claim for 4K Studio Monitor |
| `support_tickets` | **1** | High-priority transit tracking ticket |
| `ticket_messages` | **2** | Customer & live agent chat messages |
| `pricing_config` | **1** | Active vehicle tariff rates for Ahmedabad |
| `prohibited_items` | **6** | Hazardous, chemical, and legal safety rules |
| `faqs` | **3** | Customer, driver, and safety FAQs |
| `notifications` | **3** | Real-time OTP & delivery notifications |
| `audit_logs` | **1** | SuperAdmin pricing update record |
