# Local Move (by Aera) — 24×7 Person-to-Person Logistics & Relocation Platform

> **Venture:** Aera  
> **Founder:** Paras M. Mecwan  
> **Customer Care Helpline:** `+91 9558690109` (24×7 Dispatch & Safety Desk)  
> **Primary Metro Hub:** Ahmedabad, Gujarat, India  

**Local Move** is a production-grade, full-stack intra-city logistics and household relocation platform. Built with a **React 19 + TypeScript + Vite + Tailwind CSS** frontend and an **Express 4 + TypeScript + @libsql/client (SQLite)** backend under the `/api/v1` base route.

---

## 🏛️ System Architecture

The application is structured into a clean decoupled architecture:

```
Localmove/
├── src/                          # React 19 Frontend
│   ├── components/               # Maps, Modals, UI primitives, ProofComparator
│   ├── context/                  # AuthContext, OrderContext, DemoContext, ToastContext
│   ├── features/                 # customer, driver, receiver, admin, landing portals
│   ├── services/                 # api.ts (typed API client), storage.ts, pricingEngine.ts
│   └── types/                    # Domain models for Orders, Drivers, Claims, Roles
├── server/                       # Express + TypeScript Backend
│   ├── src/
│   │   ├── config/               # Database connection (@libsql/client) & env loader
│   │   ├── controllers/          # Request handlers for orders, auth, drivers, etc.
│   │   ├── db/                   # schema.ts (18 relational tables), seed.ts, init.ts
│   │   ├── middlewares/          # auth.ts (JWT), validate.ts (Zod), errorHandler.ts
│   │   ├── routes/               # Modular Express routers aggregated under /api/v1
│   │   ├── services/             # Core business logic (orderService, driverService, etc.)
│   │   ├── validations/          # Zod request validation schemas
│   │   ├── app.ts                # Express app setup (Helmet, CORS, Rate Limiting)
│   │   └── index.ts              # Server bootstrap listening on port 5000
│   ├── data/                     # localmove.db (SQLite database with WAL mode)
│   ├── uploads/                  # Multipart uploaded handover proofs & documents
│   └── package.json              # Server dependencies & scripts
├── package.json                  # Root scripts for concurrently running frontend & backend
├── vite.config.ts                # Vite config with reverse-proxy forwarding /api & /uploads to :5000
└── implementation_plan.md        # Complete architectural blueprint
```

---

## 💾 Database Schema (18 Relational Tables)

The backend utilizes `@libsql/client` with local SQLite storage (`server/data/localmove.db`) in Write-Ahead Logging (`WAL`) mode, featuring foreign keys and indexes:

1. **`users`** — Identity table (id, role, name, phone, email, password_hash, created_at, updated_at).
2. **`customers`** — Customer profiles with wallet balance and default address.
3. **`drivers`** — Driver profiles with vehicle type, number, plate, status, rating, live coordinates, earnings.
4. **`driver_documents`** — Verification documents (driving licence, Aadhaar, RC, selfie) with verification statuses.
5. **`orders`** — Master order records with statuses, OTPs, addresses, vehicle type, item details, fare.
6. **`order_proofs`** — Handover visual evidence (pickup photo/video, drop photo/video, timestamps).
7. **`order_timeline`** — Immutable audit trail of status transitions and operational notes.
8. **`order_ratings`** — Customer feedback, star ratings, comments, and driver tips.
9. **`damage_claims`** — Cargo dispute records with claim amount, approved compensation, photos.
10. **`support_tickets`** — Customer/driver assistance tickets with priorities and statuses.
11. **`ticket_messages`** — Two-way thread between users and operations agents.
12. **`saved_addresses`** — Frequent customer locations with coordinates and landmarks.
13. **`wallet_transactions`** — Ledger of credits, debits, UPI top-ups, and driver commission deductions.
14. **`driver_earnings`** — Detailed daily earnings breakdowns and cash-in-hand logs.
15. **`admin_audit_logs`** — Administrative actions audit log for regulatory compliance.
16. **`pricing_configs`** — City-specific base fares, per-km rates, helper charges, and surge multipliers.
17. **`prohibited_items`** — Regulatory restricted cargo manifests with descriptions and penalties.
18. **`notifications`** — In-app alerts, milestone notifications, and OTP reminders.

---

## 🔌 API Endpoints Catalog (`/api/v1`)

All endpoints are prefixed with `/api/v1` and return JSON formatted as `{ "success": true, "data": ... }` or `{ "success": false, "error": { "code": "...", "message": "..." } }`.

### 1. Health & Status
- `GET /api/v1/health` — Service health check and uptime.

### 2. Authentication (`/api/v1/auth`)
- `POST /api/v1/auth/customer/login` — Customer login via phone & OTP.
- `POST /api/v1/auth/driver/login` — Driver login via phone & OTP.
- `GET /api/v1/auth/me` — Authenticated profile lookup using Bearer JWT.
- `POST /api/v1/auth/logout` — Revoke session token.

### 3. Orders & Deliveries (`/api/v1/orders`)
- `POST /api/v1/orders` — Create new delivery booking with automated driver dispatch.
- `GET /api/v1/orders` — List orders with filters (`status`, `customerId`, `driverId`, `search`).
- `GET /api/v1/orders/:id` — Full order details with timeline, proofs, and driver info.
- `PATCH /api/v1/orders/:id/status` — Advance or override order status.
- `POST /api/v1/orders/:id/assign-driver` — Reassign order to a specific partner.
- `POST /api/v1/orders/:id/cancel` — Cancel order prior to departure.
- `POST /api/v1/orders/:id/rate` — Submit driver rating, feedback comment, and tip.
- `POST /api/v1/orders/:id/reschedule-request` — Request new delivery slot (customer or receiver).
- `POST /api/v1/orders/:id/reschedule-approve` — Confirm rescheduled delivery slot.

### 4. Gated Handover Gates (`/api/v1/orders/:id`)
- `POST /api/v1/orders/:id/pickup/confirm-sender` — Gate 1: Driver confirms sender identity.
- `POST /api/v1/orders/:id/pickup/verify-otp` — Gate 2: Verify confidential 4-digit pickup OTP.
- `POST /api/v1/orders/:id/pickup/proof` — Gate 3: Record mandatory pickup photo/video evidence.
- `POST /api/v1/orders/:id/pickup/approve` — Gate 4: Customer packaging approval.
- `POST /api/v1/orders/:id/pickup/start-trip` — Gate 5: Depart pickup location and start transit.
- `POST /api/v1/orders/:id/drop/confirm-receiver` — Gate 6: Confirm receiver identity at destination.
- `POST /api/v1/orders/:id/drop/verify-otp` — Gate 7: Verify confidential 4-digit drop OTP.
- `POST /api/v1/orders/:id/drop/proof` — Gate 8: Record mandatory drop photo/video evidence.
- `POST /api/v1/orders/:id/drop/acknowledge` — Receiver condition acknowledgement or defect note.
- `POST /api/v1/orders/:id/drop/collect-cash` — Gate 9: Confirm cash-on-delivery collection.
- `POST /api/v1/orders/:id/drop/complete` — Gate 10: Final closure and credit driver earnings.

### 5. Receiver Tracking (`/api/v1/orders/track`)
- `GET /api/v1/orders/track/:token` — Public tracking portal details (masked drop OTP).
- `POST /api/v1/orders/track/:token/verify` — Verify last 4 digits of phone number to unlock drop OTP.

### 6. Pricing Engine (`/api/v1/pricing`)
- `POST /api/v1/pricing/calculate-fare` — Compute itemized fare breakdown (base, distance, helpers, packing, GST).
- `GET /api/v1/pricing/config` — Retrieve active rate card and surge multipliers.
- `PUT /api/v1/pricing/config` — Admin update for city rate card and tax percentages.

### 7. Driver Fleet (`/api/v1/drivers`)
- `GET /api/v1/drivers` — List drivers filtered by status, vehicle type, and online status.
- `GET /api/v1/drivers/:id` — Driver profile with ratings, trips, cash balances, and KYC documents.
- `PATCH /api/v1/drivers/:id/online` — Toggle driver online/offline duty status.
- `PATCH /api/v1/drivers/:id/location` — Live GPS coordinates update.
- `PATCH /api/v1/drivers/:id/verification` — Admin KYC document verification approval/rejection.
- `POST /api/v1/drivers/onboarding` — Register new driver partner with vehicle & document numbers.
- `GET /api/v1/drivers/:id/earnings` — Earnings summary (today, weekly, monthly).

### 8. Customer Wallet (`/api/v1/wallet`)
- `GET /api/v1/wallet` — Current wallet balance and transaction ledger.
- `POST /api/v1/wallet/top-up` — Recharge wallet with instant credit.
- `POST /api/v1/wallet/deduct` — Deduct fare balance for booking payments.

### 9. Saved Addresses (`/api/v1/addresses`)
- `GET /api/v1/addresses` — Customer's saved address book.
- `POST /api/v1/addresses` — Save new address with coordinates and landmark.
- `DELETE /api/v1/addresses/:id` — Remove saved address.

### 10. Damage Claims (`/api/v1/claims`)
- `GET /api/v1/claims` — List claims with status filters.
- `POST /api/v1/claims` — File new cargo damage claim with photos.
- `PATCH /api/v1/claims/:id/resolve` — Approve compensation or reject claim with resolution notes.

### 11. Support Tickets (`/api/v1/support`)
- `GET /api/v1/support/tickets` — List support tickets.
- `GET /api/v1/support/tickets/:id` — Ticket message thread.
- `POST /api/v1/support/tickets` — Open new ticket.
- `POST /api/v1/support/tickets/:id/messages` — Post user or agent message.
- `PATCH /api/v1/support/tickets/:id/status` — Update ticket status.

### 12. Admin Operations Deck (`/api/v1/admin`)
- `GET /api/v1/admin/overview` — High-level KPI deck (GMV, active deliveries, SLA).
- `GET /api/v1/admin/live-ops` — Live dispatch radar with active drivers and unassigned orders.
- `GET /api/v1/admin/commissions` — 20% platform commission ledger and driver cash limits.
- `GET /api/v1/admin/reports` — Operations summary report.
- `GET /api/v1/admin/helpers` — Dedicated helper staff roster.
- `GET /api/v1/admin/audit-logs` — Immutable administrative audit trail.

### 13. Content & Notifications (`/api/v1/content`, `/api/v1/notifications`)
- `GET /api/v1/content/prohibited` — List prohibited cargo items.
- `GET /api/v1/content/faqs` — Customer support FAQs.
- `GET /api/v1/notifications` — In-app activity feed and OTP notifications.
- `PATCH /api/v1/notifications/mark-read` — Mark notifications as read.
- `POST /api/v1/upload` — Multipart/form-data image/video upload handler.

---

## ⚙️ Environment Variables

The backend configuration is managed via `server/.env` (mirrored from `server/.env.example`):

```ini
PORT=5000
NODE_ENV=development
DATABASE_URL=file:./data/localmove.db
JWT_SECRET=localmove_super_secret_jwt_key_2026_secure
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:5173
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=1000
UPLOAD_DIR=./uploads
MAX_FILE_SIZE_BYTES=10485760
DEFAULT_CITY=Ahmedabad
```

---

## 🚀 Running the Application Locally

### Prerequisites
- Node.js `v20.0.0` or higher
- npm `v10.0.0` or higher

### Option 1: Unified Concurrent Runner (One Command)
Run both the frontend and backend together in a single terminal with colored logs:
```bash
npm run dev
```
- **Frontend**: [http://localhost:5173/](http://localhost:5173/) (with auto reverse-proxy to `/api/*` and `/uploads/*`)
- **Backend API**: [http://localhost:5000/api/v1](http://localhost:5000/api/v1)
- **Receiver Tracking Portal**: [http://localhost:5173/receiver/tr_live_9281_aera](http://localhost:5173/receiver/tr_live_9281_aera)

### Option 2: Unified Production Server (Single Port 5000)
Build the entire stack and run everything (Frontend, Backend API, and Receiver Tracking) on a single port:
```bash
# 1. Build frontend and backend together
npm run build:all

# 2. Start the unified production server
npm start
```
- Open [http://localhost:5000/](http://localhost:5000/) for the full application.
- Open [http://localhost:5000/receiver/tr_live_9281_aera](http://localhost:5000/receiver/tr_live_9281_aera) for receiver tracking.
- All API routes are hosted under [http://localhost:5000/api/v1](http://localhost:5000/api/v1).

### Option 3: Separate Terminal Setup
1. **Terminal 1 — Backend API:**
   ```bash
   npm run server
   ```
2. **Terminal 2 — Frontend Dev Server:**
   ```bash
   npm run dev:frontend
   ```

### Database Seeding & Reset
To re-seed the SQLite database with fresh initial records:
```bash
npm run server:seed
```

---

## 🧪 Verification & Testing

Automated PowerShell verification scripts test all endpoints and workflows:

- **Full Order Lifecycle Test:**
  ```powershell
  powershell -ExecutionPolicy Bypass -File server/scripts/test_e2e.ps1
  ```
  *Tests creation, driver assignment, pickup verification, GPS transit, receiver token unlock, drop proof, cash collection, closure, and driver rating.*

- **Claims, Support, Address & Wallet Test:**
  ```powershell
  powershell -ExecutionPolicy Bypass -File server/scripts/test_claims_and_support.ps1
  ```

- **Driver Onboarding & Admin Deck Test:**
  ```powershell
  powershell -ExecutionPolicy Bypass -File server/scripts/test_driver_and_admin.ps1
  ```

---

## 🛡️ Trust & Safety Architecture

- **Two-Way Gated OTP:** Delivery partners cannot mark items as loaded or delivered without entering the customer's pickup OTP and recipient's drop OTP.
- **Visual Evidence Chain:** Both pickup and drop handovers require timestamped photographic evidence, permanently linked to the order receipt in the database.
- **Masked Phone Communications:** Customers and drivers communicate using virtual relay dialing, preventing phone number leakage.
- **Accidental Data Loss Prevention:** In-progress customer bookings are continuously cached in `localStorage`; page reloads or accidental navigation automatically restore addresses, item details, and vehicle selections.
- **Proof Comparator:** Admin claims investigators review original pickup condition photos alongside drop incident photos to objectively resolve damage claims within 24 hours.

---

## 📞 Support & Operations Contact

- **Operating Venture:** Aera
- **Founder:** Paras M. Mecwan
- **Customer Care & Emergency Helpline:** `+91 9558690109` (Available 24×7)
- **Headquarters:** Ahmedabad Operations Hub, Gujarat, India
