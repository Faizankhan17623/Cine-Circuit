# Things To Add — Cine Circuit

> Features identified for future implementation to improve the platform and impress in interviews.
> Check off items as they get implemented.

---

## BACKEND

### High Priority (Implement These First)

- [ ] **Seat Reservation with 15-min TTL**
  - New model: `backend/models/SeatReservation.js` (ticketId, userId, reservedSeats[], expiresAt, status)
  - Add MongoDB TTL index on `expiresAt` — auto-releases expired reservations, no cron needed
  - On `MakePayment`: lock seats first, only create Razorpay order if lock succeeds
  - On `Verifypayment`: confirm lock → deduct permanently
  - New util: `backend/utils/seatLocking.js` (ReserveSeat, ConfirmSeat, ReleaseReservedSeat)
  - Interview hook: *"Race condition handling with MongoDB TTL indexes — DB cleans itself automatically"*

- [ ] **Refund & Cancellation System**
  - Extend `backend/models/payment.js`: add `refundStatus`, `refundAmount`, `refundReason`, `refundRequestedAt`, `refundProcessedAt`, `isRefundable`
  - New endpoints: `POST /Request-Refund` (user), `PUT /Process-Refund` (admin), `GET /Refund-Status`
  - Validation: cannot refund after show start time
  - On approval: call Razorpay refund API + atomically restore ticket count + send email
  - Interview hook: *"Integrated Razorpay refund API with time-window validation and atomic ticket restoration"*

- [ ] **Activity Audit Log**
  - New model: `backend/models/AuditLog.js` (userId, action, resource, resourceId, changes {before, after}, ipAddress, timestamp, status)
  - New middleware: `backend/middlewares/auditMiddleware.js` — wraps all admin/payment mutations
  - New controller: `backend/controllers/Administrator/AuditLog.js` (GetAuditLogs with filters, ExportAuditLogCSV)
  - New routes in `Admin.js`: `GET /Audit-Logs`, `GET /Export-Audit-Log`
  - Interview hook: *"PCI-compliant audit trail — who did what, when, from which IP"*

---

### Medium Priority

- [ ] **Idempotency Keys on Payment Endpoints**
  - New model: `backend/models/IdempotencyKey.js` (key UUID, userId, endpoint, response, status, 24h TTL)
  - New middleware: `backend/middlewares/idempotency.js` — extract `Idempotency-Key` header, return cached response if exists
  - Apply to: `MakePayment`, `Verifypayment`, `ProcessRefund`
  - Interview hook: *"Prevents double-charge on network retry or accidental double-click"*

- [ ] **Soft Deletes on All Core Models**
  - Add `isDeleted` (bool), `deletedAt` (Date), `deletedBy`, `deletionReason` to: User, CreateShow, Theatres, Payment
  - Update all `.find()` queries to add `{ isDeleted: false }`
  - New util: `backend/utils/softDelete.js`
  - New admin routes: `PUT /Recover-Deleted/:resource/:id`, `GET /Deleted-Items`
  - Interview hook: *"GDPR-compliant 30-day grace period before permanent erasure"*

- [ ] **Granular Notification Preferences + Unsubscribe**
  - Extend `backend/models/user.js`: add `notificationPreferences` object (emailOnPaymentSuccess, emailOnNewRelease, etc.) + `unsubscribeToken`
  - Update all email-sending logic to check preference before sending
  - New routes: `GET /Notification-Preferences`, `PUT /Update-Notification-Preferences`, `GET /Unsubscribe/:token` (no auth)
  - Add unsubscribe link to all email templates
  - Interview hook: *"GDPR opt-in at feature level, one-click unsubscribe without logging in"*

- [ ] **Per-User Rate Limiting (Redis Store)**
  - Replace global limiter with per-user limiter using `express-rate-limit` + `RedisStore`
  - `keyGenerator`: use `req.USER?.id || req.ip`
  - Search endpoints: 50 req/min per user | Payment endpoints: 5 req/min per user
  - Update `backend/index.js`
  - Interview hook: *"Stops one bot from killing quota for all other users"*

- [ ] **RBAC with Scoped Permissions**
  - New models: `backend/models/Permission.js` (name, resource, action, scope: all/own/org), `backend/models/Role.js`
  - New util: `backend/utils/rbac.js` with `checkPermission(action, resource)` middleware
  - Replace simple `usertype` checks in routes with `checkPermission` calls
  - Interview hook: *"Scoped permissions scale without code changes — just assign new permissions to roles"*

- [ ] **Real-Time Seat Updates (WebSocket)**
  - Install `socket.io`
  - New file: `backend/socketEvents/seatUpdates.js`
  - After `Verifypayment` succeeds: emit `seats-updated` to all users on that show room
  - Frontend joins room `show-${showId}` on Purchase page mount
  - Interview hook: *"Users see sold-out instantly — no 5-second polling delay"*

- [ ] **Payment Settlement & Reconciliation**
  - New model: `backend/models/PaymentSettlement.js` (razorpaySettlementId, totalAmount, feesCharged, netAmount, status, payments[])
  - New controller: `backend/controllers/Administrator/Settlement.js` (GetSettlementReport, ReconcilePayments, ExportSettlementCSV)
  - Daily cron in `backend/Background_Process/` — auto-reconcile last 24h with Razorpay API, email theatre owners payout summary
  - Interview hook: *"Financial audit trail — flags discrepancies between Razorpay and internal DB"*

- [ ] **Bulk CSV Import for Theatres & Shows**
  - New controller: `backend/controllers/Administrator/BulkOperations.js`
  - New util: `backend/utils/csvParser.js` (validate schema, per-row error reporting, transactional insert)
  - New routes: `POST /Bulk-Create-Theatres`, `POST /Bulk-Create-Shows`, `GET /Bulk-Operation-Status/:jobId`
  - Interview hook: *"100 theatres in one upload — async Bull queue, all-or-nothing transaction"*

- [ ] **Standardized Error Responses**
  - New util: `backend/utils/APIError.js` (statusCode, message, errorCode, details)
  - New middleware: `backend/middlewares/errorHandler.js` — catch all errors, format consistently with timestamp
  - New constants: `backend/constants/errorCodes.js`
  - Update all controllers to throw `APIError` instead of inline `res.json` errors
  - Document all error codes in Swagger
  - Interview hook: *"Predictable API contract — frontend can reliably parse errors by code, not message string"*

---

## FRONTEND

### High Priority (Implement These First)

- [ ] **Multi-Step Checkout with Progress Indicator**
  - 4 steps: Select Seats → Date & Time → Review Order → Payment
  - New component: `frontends/src/Components/Movies/CheckoutStepper.jsx`
  - Validate before advancing to next step, back navigation works
  - State lives in Redux, order summary shown before payment
  - Interview hook: *"Mirrors real booking platforms, reduces cart abandonment"*

- [ ] **Real-Time Seat Availability Updates**
  - On Purchase page: poll every 5-10s (or use WebSocket if backend implements it)
  - Show "Only 2 left!" urgency badge, highlight newly-unavailable seats in red
  - Cancel polling on component unmount (memory leak prevention)
  - Files: `frontends/src/Components/Movies/Purchase.jsx`
  - Interview hook: *"Polling with exponential backoff + cleanup on unmount — shows lifecycle awareness"*

- [ ] **URL State Sync for Pagination & Filters**
  - Sync `?page=2&genre=action&rating=8` to URL using `useSearchParams`
  - On mount: read URL params → set Redux state
  - Browser back button works, URLs are shareable
  - Files: `frontends/src/Components/Home/MovieCategory.jsx`
  - Interview hook: *"URL as single source of truth — the SPA pattern most devs miss"*

---

### Medium Priority

- [ ] **Advanced Filtering (Genre, Rating, Price, Language)**
  - Multi-select genre, price range slider, rating range, language dropdown
  - New slice: `frontends/src/Slices/filterSlice.js`
  - Sidebar filter panel in `MovieCategory.jsx`, debounce API calls on filter change
  - Show result count per filter option
  - Interview hook: *"Complex Redux state — union/intersection logic for multi-select filters"*

- [ ] **Wishlist Backend Sync**
  - Current wishlist is Redux-only — lost on logout
  - Add sync operation in `frontends/src/Services/operations/BugReport.js` (new wishlist file)
  - Debounce save calls, show sync indicator, fallback to local state if offline
  - Files: `frontends/src/Slices/AddtoFavouritslistSlice.js`, `frontends/src/Components/Dashboard/Wishlist.jsx`
  - Interview hook: *"Cross-device persistence — wishlist survives logout and new devices"*

- [ ] **Cancellation / Refund UI**
  - Add refund button to ticket cards in `PurchasedTickets.jsx`
  - Show cancellation policy modal, date-based eligibility check, reason dropdown
  - Refund amount calculation shown before confirmation
  - Interview hook: *"Full business logic on frontend — eligibility check, amount preview, confirmation flow"*

- [ ] **Geolocation "Find Theatres Near Me"**
  - Add "Use my location" button in `Finder.jsx`
  - Request Geolocation API permission, calculate distance with Haversine formula
  - Sort theatres by distance, show km badge, handle permission denied gracefully
  - Interview hook: *"Browser Geolocation API + permission handling + distance algorithm"*

- [ ] **Dark / Light Theme Toggle**
  - New slice: `frontends/src/Slices/themeSlice.js`
  - Persist to localStorage, apply class to document root
  - Toggle button in navbar
  - Files: `frontends/src/App.jsx`, `frontends/tailwind.config.js`
  - Interview hook: *"Tailwind dark mode + localStorage persistence + system preference detection"*

- [ ] **Persistent Search History & Smart Suggestions**
  - Cache search history in sessionStorage (cleared on tab close for privacy)
  - Show recent searches + popular searches in dropdown
  - Debounce suggestions, filter duplicates
  - Files: `frontends/src/Components/extra/SearchPopup.jsx`
  - Interview hook: *"Privacy-respecting search history with sessionStorage (not localStorage)"*

- [ ] **Image Lazy Loading with Blur Placeholder (LQIP)**
  - New component: `frontends/src/Components/common/ResponsiveImage.jsx`
  - Blur-up placeholder on load, srcset for 2x/3x density
  - Native `loading="lazy"` + Intersection Observer fallback
  - Interview hook: *"Directly improves LCP (Core Web Vitals) — Google ranking factor"*

- [ ] **Notification Inbox with Priority Queue**
  - New slice: `frontends/src/Slices/notificationSlice.js`
  - Priority levels: error > warning > info > success
  - Max 3 toasts visible at once, auto-dismiss with configurable duration
  - Persistent inbox in dashboard showing last 20 notifications
  - Interview hook: *"Prevents notification chaos — same pattern used in Slack and Gmail"*

- [ ] **Accessibility (a11y) Pass**
  - Add `role`, `aria-label`, `aria-describedby` to all buttons and inputs
  - Improve `:focus-visible` indicators
  - Modals: focus trap on open, restore focus on close
  - Add skip-to-content link
  - Interview hook: *"WCAG 2.1 AA compliance — increasingly required by enterprise clients"*

- [ ] **"Recommended For You" Section on Homepage**
  - Call the existing `POST /Recommend-Movies` API on homepage mount (if user logged in)
  - Show personalized row above or between existing sections
  - New slice or extend existing recommendation state
  - Files: `frontends/src/Components/Home/Listing.jsx`
  - Interview hook: *"AI recommendations integrated into the main UI, not just on-demand"*

---

## Quick Reference — Best 5 to Impress an Interviewer

| # | Feature | Why It Wins |
|---|---------|-------------|
| 1 | Seat Reservation TTL | Distributed systems + race condition thinking |
| 2 | Refund System | Payment expertise + data integrity |
| 3 | Audit Log | Security + compliance awareness |
| 4 | Multi-step Checkout | UX maturity + product thinking |
| 5 | URL State Sync | SPA architecture — separates good devs from great ones |
