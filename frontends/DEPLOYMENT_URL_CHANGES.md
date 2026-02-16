# Backend Deployment URL Changes Required

## After deploying your backend and frontend, update these files with your production URLs:

---

## 1. CORS Configuration (Backend)
- **File:** `backend/index.js`
- **Line:** 34
- **Current:** `origin: "http://localhost:5173"`
- **Change to:** `origin: "https://your-frontend-domain.com"`

---

## 2. Password Reset Link (Backend)
- **File:** `backend/controllers/user/Resetpassword.js`
- **Line:** 31
- **Current:** `http://localhost:5173/Reset-Password/${token}`
- **Change to:** `https://your-frontend-domain.com/Reset-Password/${token}`

---

## 3. Email Templates - Dashboard Links

### orgApprovedTemplate.js
- **File:** `backend/templates/userTemplates/orgApprovedTemplate.js`
- **Line:** 464
- **Current:** `http://localhost:5173/dashboard`
- **Change to:** `https://your-frontend-domain.com/dashboard`

### orgRejectedTemplate.js
- **File:** `backend/templates/userTemplates/orgRejectedTemplate.js`
- **Line:** 572
- **Current:** `http://localhost:5173/dashboard`
- **Change to:** `https://your-frontend-domain.com/dashboard`

### theatreApprovedTemplate.js
- **File:** `backend/templates/userTemplates/theatreApprovedTemplate.js`
- **Line:** 472
- **Current:** `http://localhost:5173/dashboard`
- **Change to:** `https://your-frontend-domain.com/dashboard`

### theatreRejectedTemplate.js
- **File:** `backend/templates/userTemplates/theatreRejectedTemplate.js`
- **Line:** 563
- **Current:** `http://localhost:5173/dashboard`
- **Change to:** `https://your-frontend-domain.com/dashboard`

### paymentFailedTemplate.js
- **File:** `backend/templates/userTemplates/paymentFailedTemplate.js`
- **Line:** 563
- **Current:** `http://localhost:5173/dashboard`
- **Change to:** `https://your-frontend-domain.com/dashboard`

---

## 4. Email Templates - Password Reset Links

### Updatepasswordtemplate.js
- **File:** `backend/templates/userTemplates/Updatepasswordtemplate.js`
- **Line:** 409
- **Current:** `http://localhost:5173/Reset-Password/${token}`
- **Change to:** `https://your-frontend-domain.com/Reset-Password/${token}`

- **Line:** 422
- **Current:** `http://localhost:5173/Reset-Password/${token}`
- **Change to:** `https://your-frontend-domain.com/Reset-Password/${token}`

---

## 5. Ticket Download Link (Backend API)

### TicketTemplate.js
- **File:** `backend/templates/userTemplates/TicketTemplate.js`
- **Line:** 612
- **Current:** `http://localhost:4000/api/v1/Payment/download/${data._id}`
- **Change to:** `https://your-backend-domain.com/api/v1/Payment/download/${data._id}`

---

## Environment Variables to Add (.env file)

```env
# Frontend URL (for CORS and email templates)
FRONTEND_URL=https://your-frontend-domain.com

# Backend URL (for ticket download links)
BACKEND_URL=https://your-backend-domain.com
```

---

## Quick Checklist - Total 9 Files to Update

- [ ] backend/index.js (Line 34)
- [ ] backend/controllers/user/Resetpassword.js (Line 31)
- [ ] backend/templates/userTemplates/orgApprovedTemplate.js (Line 464)
- [ ] backend/templates/userTemplates/orgRejectedTemplate.js (Line 572)
- [ ] backend/templates/userTemplates/theatreApprovedTemplate.js (Line 472)
- [ ] backend/templates/userTemplates/theatreRejectedTemplate.js (Line 563)
- [ ] backend/templates/userTemplates/paymentFailedTemplate.js (Line 563)
- [ ] backend/templates/userTemplates/Updatepasswordtemplate.js (Lines 409, 422)
- [ ] backend/templates/userTemplates/TicketTemplate.js (Line 612)
