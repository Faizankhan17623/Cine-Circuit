<div align="center">

# Cine Circuit

**A full-stack movie ticket booking platform built for scale**

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![Node.js](https://img.shields.io/badge/Node.js-20-339933?logo=node.js&logoColor=white)](https://nodejs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-6-47A248?logo=mongodb&logoColor=white)](https://mongodb.com)
[![Express](https://img.shields.io/badge/Express-4-000000?logo=express&logoColor=white)](https://expressjs.com)
[![Redux](https://img.shields.io/badge/Redux_Toolkit-2-764ABC?logo=redux&logoColor=white)](https://redux-toolkit.js.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)

[Live Demo](https://mw-mocha.vercel.app) · [API Docs](https://mw-9z0s.onrender.com/api/docs) · [Report Bug](#)

</div>

---

## What is Cine Circuit?

Cine Circuit is a production-grade, multi-role movie ticket booking platform — similar in scope to BookMyShow or Fandango. It supports four distinct user roles (Viewer, Organizer, Theatre Owner, Admin), integrates real payment processing via Razorpay, generates downloadable/emailed PDF tickets with QR check-in codes, supports real-time chat between roles, sends transactional emails, manages media on Cloudinary, and exposes a fully documented REST API with 79+ endpoints.

Built as a solo full-stack project, it demonstrates end-to-end ownership of a complex system: database schema design, API development, state management, payment flows, background jobs, and admin tooling.

---

## Core Features

### For Viewers
- Browse movies by category — Top Rated, Most Liked, Recently Released
- Search & filter by genre, language, cast
- Book & purchase tickets with real Razorpay payment gateway
- Manage wishlist, view booking history, download tickets as PDF (with QR code) or receive them by email
- In-app wallet — instant credit on cancellations, redeemable loyalty points, pay-with-wallet at checkout
- Real-time chat with organizers/theatres/admins over Socket.IO
- Rate and review movies
- AI-powered movie recommendations based on genre preferences
- Refer & Earn — share a personal invite code/link and earn wallet credit when a friend completes their first booking

### For Organisers
- Create and submit movies/shows for admin approval
- Manage show listings, poster/trailer uploads to Cloudinary
- View booking analytics on their shows

### For Theatre Owners
- Register theatres (verified by admin)
- Allot approved shows to screens with seat configuration
- Track ticket sales and seat availability
- Scan a ticket's QR code at the door to check guests in (signature-verified, one-time use)

### For Admins
- Full dashboard with analytics charts (bookings, revenue, users)
- Approve/reject shows and theatre registrations
- Manage genres, languages, cast, and hashtags
- Enable maintenance mode (blocks all non-admin users with a banner + popup)
- View and resolve bug reports submitted by users
- Complete audit log of all admin actions
- Toggle maintenance mode from dashboard

### Platform-Wide
- JWT authentication with HttpOnly cookies
- OTP-based email verification on signup
- 17 transactional email templates (booking confirmation, ticket, OTP, maintenance alerts, bug report status, etc.)
- Background cron jobs — auto-transitions movie status (Upcoming → Released → Expired) every 6 hours
- PDF ticket generation (Puppeteer) with an embedded, HMAC-signed QR code, downloadable or emailed as an attachment
- Real-time chat (Socket.IO) between Viewers, Organizers, Theatre Owners, and Admins, with a REST-backed inbox/history
- Rate limiting — 5 auth attempts / 200 general requests per 15 minutes
- Swagger UI API documentation
- SEO: per-page meta tags, Open Graph, JSON-LD Movie schema, dynamic sitemap
- PWA support with service worker and manifest
- Bug reporting system with image/video uploads

---

## Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, Vite, Tailwind CSS 4, Redux Toolkit, React Router v7 |
| **Backend** | Node.js 20, Express 4, Mongoose 8 |
| **Database** | MongoDB 6 |
| **Auth** | JWT, bcrypt, HttpOnly cookies |
| **Payments** | Razorpay (order creation + webhook verification) |
| **Media Storage** | Cloudinary (images, videos, posters, trailers) |
| **Real-time Chat** | Socket.IO |
| **Ticket Generation** | Puppeteer (PDF), `qrcode` (HMAC-signed check-in QR codes) |
| **Email** | Nodemailer (Gmail SMTP) |
| **Background Jobs** | node-cron |
| **API Docs** | Swagger UI (OpenAPI 3) |
| **Animations** | GSAP, Swiper |
| **Deployment** | Vercel (frontend), Render (backend) |

---

## Architecture Overview

```
cine-circuit/
├── frontends/                  # React + Vite SPA
│   ├── src/
│   │   ├── Components/         # 90+ components across 6 feature domains
│   │   │   ├── Dashboard/      # 40+ admin & user dashboard components (incl. Chating/, Tickets/)
│   │   │   ├── Home/           # Landing, slider, movie listings
│   │   │   ├── Movies/         # Movie detail, purchase, reviews
│   │   │   ├── Theatres/       # Theatre finder & show listings
│   │   │   └── extra/          # AI agent, bug report, maintenance UI
│   │   ├── Slices/             # 14 Redux slices for global state
│   │   ├── Services/           # Axios API calls + Redux thunks
│   │   └── Hooks/              # Private/Open route guards, custom hooks
│
└── backend/                    # Node.js + Express REST API
    ├── controllers/            # Business logic by role
    │   ├── user/               # Auth, profile, password reset, watchlist
    │   ├── Administrator/      # Admin ops, audit log, maintenance, coupons
    │   ├── Theatrer/           # Theatre ops, ticket distribution, QR check-in
    │   ├── Orgainezer/         # Show creation & management
    │   ├── Dashboard/          # Per-role stats & dashboard endpoints
    │   └── common/             # Shared: recommendations, chat, wallet, loyalty, referrals, bug reports, sitemap
    ├── models/                 # 34 Mongoose schemas
    ├── routes/                 # 7 route files (User, Admin, Show, Payment, Theatre, Org, Chat)
    ├── middlewares/            # Auth guards per role
    ├── sockets/                # Socket.IO real-time chat handlers
    ├── Background_Process/     # Cron jobs for status transitions & ticket cleanup
    └── templates/              # HTML email templates + PDF ticket template
```

---

## Database Design

34 MongoDB collections covering the full domain:

| Domain | Models |
|---|---|
| **Users & Auth** | User, OTP, AuditLog |
| **Content** | CreateShow, CreateCast, Genre, SubGenre, CreateLanguage, CreateHashtags |
| **Booking** | Payment, Ticket, TheatresTicket, Coupon |
| **Theatres** | Theatres, TheatrerRequest |
| **Creators** | Org_data, DirectorExperience, DirectorFresher, ProducerExperience, ProducerFresher |
| **Social** | RatingAndReview, Comment, Feedback, Visitor, Watchlist |
| **Chat** | Conversation, ChatMessage |
| **Wallet & Rewards** | Wallet, LoyaltyPoints, Referral |
| **Platform** | Maintenance, BugReport |

---

## API Reference

Full Swagger docs available at:
- **Local:** `http://localhost:4003/api/docs`
- **Production:** `https://mw-9z0s.onrender.com/api/docs`

**79+ REST endpoints** across 7 route groups:

```
/api/v1/createAccount/  →  Auth, OTP, profile, watchlist, tickets
/api/v1/Admin/          →  Shows, theatres, genres, users, coupons, audit logs
/api/v1/Show/           →  Movie listings, search, seat maps, reviews
/api/v1/Payment/        →  Order creation, webhook verification, wallet, loyalty, referrals
/api/v1/Theatre/        →  Theatre CRUD, show allotment, ticket distribution, QR check-in
/api/v1/Org/            →  Movie/show creation, media upload
/api/v1/Chat/           →  Conversations, message history, real-time chat (Socket.IO for live delivery)
```

---

## Getting Started

### Prerequisites

- Node.js 20+
- MongoDB (local or Atlas)
- Cloudinary account
- Razorpay account (test keys work)
- Gmail account (for SMTP)

### 1. Clone the repository

```bash
git clone https://github.com/Faizankhan17623/Cine-Circuit.git
cd Cine-Circuit
```

### 2. Configure environment variables

**Backend** — copy `backend/.env.example` to `backend/.env` and fill in:

```env
DATABASE_URL=mongodb+srv://...
JWT_PRIVATE_KEY=your_jwt_secret
JWT_ORGAINEZER_PRIVATE_KEY=your_org_jwt_secret

CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...

MAIL_USER=your@gmail.com
PASSWORD_NAME=your_app_password

RAZORPAY_KEY_ID=rzp_test_...
RAZORPAY_KEY_SECRETS=...

DEFAULT_PORT_NUMBER=4000
PASSWORD_CHANGING_HASH_ROUNDS=10
```

**Frontend** — copy `frontends/.env.example` to `frontends/.env`:

```env
VITE_MAIN_BACKEND_URL=http://localhost:4000
VITE_RAZORPAY_KEY_ID=rzp_test_...
```

### 3. Install dependencies & run

```bash
# From the frontends/ directory — runs both frontend and backend concurrently
cd frontends
npm install
cd ../backend
npm install
cd ../frontends
npm run dev
```

| Service | URL |
|---|---|
| Frontend | `http://localhost:5173` |
| Backend API | `http://localhost:4000` |
| Swagger Docs | `http://localhost:4003/api/docs` |

---

## Key Engineering Decisions

**Atomic seat reservation** — `findOneAndUpdate` with `$inc` and a condition check prevents double-booking under concurrent requests. A fresh DB re-check runs before Razorpay order creation so sold-out shows return 409 before any payment is initiated.

**Role-based middleware** — Each route group has its own auth middleware (`verifyUserToken`, `verifyAdminToken`, `verifyTheatrerToken`, `verifyOrgToken`) so role boundaries are enforced at the router level, not scattered across controllers.

**Background movie status** — A cron job runs every 6 hours to transition movies from `Upcoming → Released → Expired` automatically. No manual intervention needed.

**Maintenance mode** — Admin can flip a kill-switch that puts the entire platform into maintenance mode. A Redis-ready architecture separates the status fetch (public endpoint) from the toggle (admin-only), and admins themselves are never blocked.

**Referral rewards after conversion** — a referral is recorded at signup but only pays out inside the booking transaction that confirms the invited user's first payment, so codes can't be farmed by creating empty accounts. Payout failures are swallowed rather than rolling back a paid booking.

**Signed QR check-in** — each ticket's QR code encodes the payment ID plus an HMAC-SHA256 signature (keyed off the JWT secret), so theatre staff can verify a scanned code offline without a live lookup before confirming entry. Check-in is one-time — already-scanned, cancelled, or unpaid tickets are rejected.

**Audit trail** — All admin actions are written to an `AuditLog` collection with actor ID, action type, target, and timestamp. Useful for compliance and debugging.

**Lazy loading + code splitting** — All 40+ React routes use `React.lazy()` + `<Suspense>`, keeping the initial bundle small.

---

## Screenshots

> *Coming soon — UI walkthrough of booking flow, admin dashboard, and AI recommendation agent.*

---

## Project Stats

| Metric | Count |
|---|---|
| REST API endpoints | 79+ |
| MongoDB models | 34 |
| Email templates | 17 |
| React components | 90+ |
| Redux slices | 14 |
| User roles | 4 |
| Cron jobs | 3 |

---

<div align="center">

Built with focus on real-world patterns: multi-role auth, payment processing, background jobs, and admin tooling — not just a CRUD app.

</div>
