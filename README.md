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

Cine Circuit is a production-grade, multi-role movie ticket booking platform — similar in scope to BookMyShow or Fandango. It supports four distinct user roles (Viewer, Organizer, Theatre Owner, Admin), integrates real payment processing via Razorpay, sends transactional emails, manages media on Cloudinary, and exposes a fully documented REST API with 79+ endpoints.

Built as a solo full-stack project, it demonstrates end-to-end ownership of a complex system: database schema design, API development, state management, payment flows, background jobs, and admin tooling.

---

## Core Features

### For Viewers
- Browse movies by category — Top Rated, Most Liked, Recently Released
- Search & filter by genre, language, cast
- Book & purchase tickets with real Razorpay payment gateway
- Manage wishlist, view booking history, download tickets
- Rate and review movies
- AI-powered movie recommendations based on genre preferences

### For Organisers
- Create and submit movies/shows for admin approval
- Manage show listings, poster/trailer uploads to Cloudinary
- View booking analytics on their shows

### For Theatre Owners
- Register theatres (verified by admin)
- Allot approved shows to screens with seat configuration
- Track ticket sales and seat availability

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
│   │   ├── Components/         # 50+ components across 6 feature domains
│   │   │   ├── Dashboard/      # 27 admin & user dashboard components
│   │   │   ├── Home/           # Landing, slider, movie listings
│   │   │   ├── Movies/         # Movie detail, purchase, reviews
│   │   │   ├── Theatres/       # Theatre finder & show listings
│   │   │   └── extra/          # AI agent, bug report, maintenance UI
│   │   ├── Slices/             # 12 Redux slices for global state
│   │   ├── Services/           # Axios API calls + Redux thunks
│   │   └── Hooks/              # Private/Open route guards, custom hooks
│
└── backend/                    # Node.js + Express REST API
    ├── controllers/            # Business logic by role
    │   ├── user/               # Auth, profile, password reset
    │   ├── Administrator/      # Admin ops, audit log, maintenance
    │   ├── Theatrer/           # Theatre ops, ticket distribution
    │   ├── Orgainezer/         # Show creation & management
    │   └── common/             # Shared: recommendations, bug reports, sitemap
    ├── models/                 # 26 Mongoose schemas
    ├── routes/                 # 6 route files (User, Admin, Show, Payment, Theatre, Org)
    ├── middlewares/            # Auth guards per role
    ├── Background_Process/     # Cron jobs for status transitions
    └── templates/              # 17 HTML email templates
```

---

## Database Design

26 MongoDB collections covering the full domain:

| Domain | Models |
|---|---|
| **Users & Auth** | User, OTP, AuditLog |
| **Content** | CreateShow, CreateCast, Genre, SubGenre, CreateLanguage, CreateHashtags |
| **Booking** | Payment, Ticket, TheatresTicket |
| **Theatres** | Theatres, TheatrerRequest |
| **Creators** | Org_data, DirectorExperience, DirectorFresher, ProducerExperience, ProducerFresher |
| **Social** | RatingAndReview, Comment, Feedback, Visitor |
| **Platform** | Maintenance, BugReport |

---

## API Reference

Full Swagger docs available at:
- **Local:** `http://localhost:4003/api/docs`
- **Production:** `https://mw-9z0s.onrender.com/api/docs`

**79+ REST endpoints** across 6 route groups:

```
/api/user/         →  Auth, profile, wishlist, tickets
/api/admin/        →  Shows, theatres, genres, users, audit logs
/api/show/         →  Movie listings, search, seat maps
/api/payment/      →  Order creation, webhook verification
/api/theatre/      →  Theatre CRUD, show allotment
/api/organizer/    →  Movie/show creation, media upload
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
git clone https://github.com/your-username/cine-circuit.git
cd cine-circuit
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
| MongoDB models | 26 |
| Email templates | 17 |
| React components | 50+ |
| Redux slices | 12 |
| User roles | 4 |
| Cron jobs | 2 |

---

## Roadmap

- [ ] WebSocket-based real-time seat locking (15-min TTL)
- [ ] Refund & cancellation system
- [ ] Redis caching for high-traffic endpoints
- [ ] "Recommended For You" row using content-based filtering
- [ ] Per-user rate limiting with Redis
- [ ] Mobile app (React Native)

---

## License

MIT — feel free to fork and use for learning or as a base project.

---

<div align="center">

Built with focus on real-world patterns: multi-role auth, payment processing, background jobs, and admin tooling — not just a CRUD app.

</div>
