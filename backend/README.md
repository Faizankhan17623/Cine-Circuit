# 🎬 Cine Circuit — Backend

The Node.js / Express + MongoDB backend for **Cine Circuit**, a movie‑ticketing
platform. It handles user accounts, organizer & theatre onboarding, show
creation, ticket distribution, Razorpay payments, and an admin/audit layer.

The React (Vite) frontend lives in a separate `frontends/` project and talks to
this API.

---

## Tech stack

| Area | What's used |
|------|-------------|
| Runtime | Node.js **20.x** |
| Framework | Express 4 |
| Database | MongoDB with Mongoose 8 |
| Auth | JWT (`jsonwebtoken`) + `bcrypt` password hashing |
| File / media uploads | `express-fileupload` → Cloudinary |
| Payments | Razorpay |
| Email | Nodemailer (OTP verification, maintenance blasts) |
| Scheduled jobs | `node-cron` / `node-schedule` |
| Real-time | `socket.io` (chat) |
| Ticket generation | `puppeteer` (PDF tickets), `qrcode` (HMAC-signed check-in QR) |
| Security | `helmet`, `cors`, `express-rate-limit`, `mongo-sanitize` |
| API docs | Swagger (`swagger-jsdoc` + `swagger-ui-express`) |

---

## What the app does (actual features)

- **Accounts & auth** — signup with email **OTP verification**, login with JWT,
  password reset. Four user types: `Viewer`, `Organizer`, `Administrator`,
  `Theatrer`.
- **Organizer onboarding** — multi‑step organizer profile (`OrgainezerData`) with
  separate Director/Producer × Fresher/Experienced detail forms, plus an
  admin approval queue with attempt limits and locking.
- **Shows** — organizers create shows (poster/trailer to Cloudinary), admin
  verifies them; shows carry genres, sub‑genres, languages, cast, hashtags,
  and ratings/reviews.
- **Theatres & tickets** — theatre registration/approval, two ticket layers:
  `Ticket` (org‑level batch allotted to theatres) and `CreateTicket` (per‑theatre
  inventory with category pricing — Standard/Premium/VIP/Family/Loyalty).
- **PDF tickets & QR check‑in** — Puppeteer renders a PDF ticket (downloadable
  or emailed as an attachment) embedding a QR code whose payload is HMAC‑signed
  (`utils/generateTicketQr.js`); theatre staff scan it at the door and
  `controllers/Theatrer/CheckIn.js` verifies the signature and marks the
  ticket checked‑in (rejecting already‑used, cancelled, or unpaid tickets).
- **Payments** — Razorpay order creation + signature verification, coupon
  discounts (`Coupon`), and per‑payment records.
- **Wallet & loyalty** — in‑app wallet for instant cancellation refunds and
  pay‑with‑wallet at checkout, plus loyalty points earned on bookings and
  redeemable for wallet credit (`Wallet`, `LoyaltyPoints`).
- **Referrals** — invite codes recorded at signup, payout only fires from
  inside the transaction confirming the invited user's first booking
  (`Referral`).
- **Real‑time chat** — Socket.IO (`sockets/chat.js`) delivers live messages
  between any two roles; REST endpoints (`routes/Chat.js`) handle starting a
  conversation, listing the inbox, loading history, and marking read
  (`Conversation`, `ChatMessage`).
- **Engagement** — comments, banner likes/dislikes, watchlists, ratings & reviews.
- **Admin / ops** — audit logging (`AuditLog`), bug reports, maintenance mode
  (with optional email blast), coupon management, and visitor counting.
- **Background jobs** — cron tasks that update movie status, manage tickets, and
  return unsold tickets (see `Background_Process/`).
- **Extras** — dynamic `sitemap.xml` for verified movies and Swagger API docs.

> This list reflects what's implemented in the code today. If a feature isn't
> here, it isn't built yet.

---

## Project structure

```
backend/
├── index.js                 # App entry — middleware, routes, server bootstrap
├── config/
│   ├── database.js          # Mongo connection
│   ├── cloudinary.js        # Cloudinary config
│   ├── razorpay.js          # Razorpay client
│   ├── nodemailer.js        # Mail transport
│   └── swagger.js           # Swagger spec
├── models/                  # Mongoose schemas (34 models)
├── routes/                  # User, Admin, Organizaer, CreateShow, Theatrer, Payment, Chat
├── controllers/
│   ├── user/                # account creation, auth, watchlist
│   ├── Orgainezer/          # organizer onboarding, shows, tickets
│   ├── Theatrer/            # theatre + ticket distribution + QR check-in
│   ├── Administrator/       # verification, coupons, maintenance, theatres
│   ├── Dashboard/           # stats & dashboard endpoints
│   └── common/              # comments, chat, wallet, loyalty, referrals, payments, sitemap, etc.
├── middlewares/
│   └── verification.js      # JWT / role checks
├── sockets/
│   └── chat.js              # Socket.IO real-time chat
├── utils/
│   ├── imageUploader.js     # Cloudinary upload helper
│   ├── mailsender.js        # email helper
│   ├── generateTicketQr.js  # HMAC-signed ticket QR generation
│   └── logAudit.js          # audit‑log helper
├── Background_Process/      # cron jobs (movie status, tickets, unsold tickets)
└── templates/               # email templates + PDF ticket template (Puppeteer)
```

---

## Getting started

### Prerequisites
- Node.js 20.x
- A MongoDB connection string (Atlas or local)
- Cloudinary, Razorpay, and an SMTP/Gmail account for the integrations

### Install & run

```bash
npm install
npm run dev      # development (nodemon, auto‑reload)
npm start        # production (node ./index.js)
```

The server listens on `DEFAULT_PORT_NUMBER` (falls back to `SECOND_NUMBER`, then
`4003`).

- API base URL: `http://localhost:4003/api/v1`
- Swagger docs: `http://localhost:4003/api/docs`

---

## Environment variables

Create a `.env` file in `backend/`. These are the variables the code actually
reads:

```env
# Server
DEFAULT_PORT_NUMBER=4003
SECOND_NUMBER=4004
HOST_NAME=

# Database
DATABASE_URL=your_mongodb_connection_string

# Auth
JWT_PRIVATE_KEY=your_jwt_secret

# Cloudinary
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
CLOUDINARY_FOLDER_NAME=

# Razorpay
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRETS=

# Mail (Nodemailer)
MAIL_USER=
USER_NAME=
PASSWORD_NAME=
NODEMAILER_PORT_NUMBER=
```

> `.env` is gitignored — never commit real secrets.

---

## API routes (top‑level)

All routes are mounted under `/api/v1`:

| Prefix | Router file | Purpose |
|--------|-------------|---------|
| `/createAccount` | `routes/User.js` | signup, OTP, login, password reset |
| `/Admin` | `routes/Admin.js` | admin: verification, coupons, maintenance, theatres |
| `/Org` | `routes/Organizaer.js` | organizer onboarding & shows |
| `/Show` | `routes/CreateShow.js` | show creation / listing |
| `/Theatre` | `routes/Theatrer.js` | theatre & ticket distribution, QR check-in |
| `/Payment` | `routes/Payment.js` | Razorpay orders & verification |
| `/Chat` | `routes/Chat.js` | conversations, message history (live delivery over Socket.IO) |

A `GET /sitemap.xml` endpoint serves a dynamic sitemap of verified movies.

---

## Security middleware

Applied globally in `index.js`:

- `helmet()` — security headers
- `cors()` — allow‑listed origins (`localhost:5173`, the deployed frontend)
- **Rate limiting** — 200 req / 15 min general; **5 req / 15 min** on Login &
  Create‑OTP
- **`mongo-sanitize`** — strips MongoDB operators (`$gt`, `$ne`, `$where`, …)
  from `body`, `query`, and `params` to block NoSQL injection

---

## Notes

- Versioning of commits follows a simple `MAJOR.MINOR.PATCH` scheme, starting at
  `1.0.0`.
- `express-form-data` is intentionally disabled in `index.js` — it conflicts with
  `express-fileupload` (both consume the request stream). File uploads go through
  `express-fileupload`.

---

*Author: Faizan Khan*
