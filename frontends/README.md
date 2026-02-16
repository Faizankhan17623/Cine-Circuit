# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.



<!-- ============================================ -->
<!-- NEW FEATURES TO ADD (TODO LIST) -->
<!-- ============================================ -->

---

## 📌 Feature 1: Device & IP Tracking for Login Security

### Description:
When a user logs in, we will:
1. Capture their IP address and device info (browser, OS, etc.)
2. Save it to the database on first login
3. On subsequent logins, check if it's a new device/IP
4. If new device/IP detected, send an email alert to the user
5. If user says "That's not me" - block the account until they unblock it

### Implementation Steps:

#### Backend - User Model Changes:
Add these fields to `backend/models/user.js`:
```javascript
loginHistory: [{
    ipAddress: String,
    deviceInfo: String,
    browser: String,
    os: String,
    lastLogin: Date,
    isTrusted: Boolean
}],
isBlocked: { type: Boolean, default: false },
blockedAt: Date,
unblockedAt: Date
```

#### Backend - Login Controller Changes:
In `backend/controllers/user/auth.js`:
1. Get IP address from request (req.ip or req.headers['x-forwarded-for'])
2. Get device info from user-agent
3. Check if it's a new device/IP
4. If new, send alert email
5. Save login history

#### Backend - New Endpoints:
- POST `/api/v1/user/block-account` - Block own account
- POST `/api/v1/user/unblock-account` - Unblock own account
- POST `/api/v1/user/trust-device` - Trust a device

#### Backend - Email Template:
Create new template `backend/templates/userTemplates/newDeviceLoginTemplate.js`

#### Frontend - New Components:
- Add "Trust this device" checkbox on login
- Add "My Devices" page to show login history
- Add "Block Account" / "Unblock Account" buttons in profile

---

<!-- ============================================ -->
<!-- COMPLETED / RESOLVED ITEMS -->
<!-- ============================================ -->

<!-- ✅ HttpOnly Cookies - Already implemented in backend (auth.js and CreateOrg.js) -->
<!-- ✅ secure: true - Needs to be set to true for production deployment -->



<!-- ============================================ -->
<!-- OTHER NOTES -->
<!-- ============================================ -->

<!-- Commits start from 1.0.0 -->
<!-- Then they will update in the order 1.0.1 -->
<!-- if the third one ends then the second order will update 1.1.0 -->
<!-- if second ends third will update 2.0.0 -->

<!-- making a new commit -->
<!-- 1.0.1 -->

<!-- Rememebr when the app is build like 100 percentage make the HttpOnly true so that it can be blocked by the attackers -->

<!-- For production deployment, update secure: false to secure: true in:
- backend/controllers/user/auth.js (line 77)
- backend/controllers/Orgainezer/CreateOrg.js (line 168)
-->