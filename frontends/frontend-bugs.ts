// ============================================================================
//                    CINE CIRCUIT - FRONTEND BUG REPORT
//                  AUTO-DETECTED BUGS IN FRONTEND CODEBASE
// ============================================================================


// ============================================================================
// SECTION 1: CRITICAL BUGS (Will Break Functionality)
// ============================================================================

// BUG 1: Hardcoded URL Instead of Environment Variable
// File: frontends/src/Services/operations/Theatre.js (Line ~410)
// Problem: Hardcoded "http://localhost:4000/api/v1/Theatre/Theatre-info" instead
//          of using the BASE_URL from .env
// Impact: Will break in production/deployment
// Fix: Replace with the proper API constant from the APIs file

// BUG 2: Missing HTTP Method in API Call
// File: frontends/src/Services/operations/Theatre.js (Line ~342)
// Problem: Empty string "" passed as HTTP method in apiConnector call
// Code: apiConnector("", getsingleshowdetails, { showAlloted: showid })
// Impact: API call will fail — no HTTP method means request won't send
// Fix: Change to "GET" and pass showAlloted as query param

// BUG 3: Wrong Variable Reference in Theatre Info
// File: frontends/src/Services/operations/Theatre.js (Line ~57)
// Problem: Uses `TheatreInfo` variable which doesn't exist (should be `tt`)
// Code: apiConnector("POST", TheatreInfo, { ... })
// Impact: ReferenceError — function will crash
// Fix: Replace TheatreInfo with the correct imported constant `tt`

// BUG 4: Undefined Variable in Tags Operations
// File: frontends/src/Services/operations/Tags.js (Line ~87)
// Problem: References `CreateHashtagAPI` which is never imported
// Code: apiConnector("POST", CreateHashtagAPI, { tagname }, { ... })
// Impact: ReferenceError — create tag function will crash
// Fix: Replace with `CreateTags` (which is the actual imported constant)


// ============================================================================
// SECTION 2: MAJOR BUGS (Will Cause Visible Issues)
// ============================================================================

// BUG 5: Wrong Error Response Access
// File: frontends/src/Services/operations/orgainezer.js (Line ~97)
// Problem: Accessing `response.response.data.message` — double .response
// Code: toast.error(response.response.data.message)
// Impact: Will show undefined in toast error message
// Fix: Change to `response.data.message`

// BUG 6: MakePdf Wrong Parameter — "blob" as params
// File: frontends/src/Services/operations/Payment.js (Line ~190)
// Problem: Passes "blob" as 5th argument to apiConnector (which is params, not responseType)
// Code: apiConnector("GET", `${downloadticketdata}/${ticketId}`, null, headers, "blob")
// Impact: PDF download won't work — response won't be a blob
// Fix: Remove "blob" param and configure responseType in axios config

// BUG 7: Inconsistent _id vs id Usage in UserManagement
// File: frontends/src/Components/Dashboard/UserManagement.jsx (Lines ~87, 398)
// Problem: Uses `org._id` as React key but `org.id` in filter logic
// Code: key={org._id} but filters with o.id === id
// Impact: Filter/selection logic may not match the correct items
// Fix: Use `org._id` consistently everywhere (MongoDB returns _id)

// BUG 8: Missing PaymentVerify Await
// File: frontends/src/Services/operations/Payment.js (Lines ~89-100)
// Problem: dispatch(PaymentVerify(...)) inside Razorpay handler is not awaited
// Impact: Payment verification may not complete before navigation/state changes
// Fix: Add `await` before dispatch(PaymentVerify(...))

// BUG 9: navigate() Used Without Being Defined
// File: frontends/src/Services/operations/Auth.js (Line ~27-35)
// Problem: `navigate("/Login")` called in UserDetails but navigate is not a parameter
// Impact: ReferenceError when token is missing
// Fix: Add `navigate` as a function parameter

// BUG 10: Success Check After State Dispatch
// File: frontends/src/Services/operations/Auth.js (Lines ~267-269)
// Problem: dispatch(setToken(...)) runs BEFORE checking if response was successful
// Impact: Token gets set even on failed responses
// Fix: Move the success check before dispatching state changes

// BUG 11: Typo in Parameter Name
// File: frontends/src/Services/operations/Theatre.js (Line ~21)
// Problem: Parameter named `pasword` instead of `password`
// Code: export function CreateTheatree(name, email, pasword, number)
// Impact: If caller passes `password`, it won't be received correctly
// Fix: Rename to `password` and update usage on line ~29

// BUG 12: Space in .env Variable Name
// File: frontends/.env (Line ~26)
// Problem: Space around = in environment variable
// Code: VITE_RAZORPAY_KEY_ID = "rzp_test_9k1NsiGy7HDgky"
// Impact: May not be parsed correctly by Vite
// Fix: Remove spaces: VITE_RAZORPAY_KEY_ID="rzp_test_9k1NsiGy7HDgky"


// ============================================================================
// SECTION 3: COMPONENT BUGS
// ============================================================================

// BUG 13: Inconsistent useState Naming Convention
// File: frontends/src/Components/UserCreation/User.jsx (Line ~30)
// Problem: [Loading, setloading] — uppercase state, lowercase setter
// Code: const [Loading, setloading] = useState(false)
// Impact: Confusing and breaks React naming conventions
// Fix: Change to const [loading, setLoading] = useState(false) and update all refs

// BUG 14: Typo in Variable Name (Unused Variable)
// File: frontends/src/Components/Dashboard/LeftSide.jsx (Line ~190)
// Problem: Variable named `isVerificatioasdefnSubmitted` — obvious typo, never used
// Impact: Dead code, clutters the component
// Fix: Remove the variable entirely or fix to `isVerificationSubmitted` if needed

// BUG 15: Memory Leak — Object URLs Not Cleaned Up
// File: frontends/src/Components/extra/TheatrerForm.jsx (Lines ~83-91)
// Problem: URL.createObjectURL() is called in setPreviews but URLs are never revoked
// Impact: Memory leak — browser keeps blob URLs in memory
// Fix: Add useEffect cleanup:
//   useEffect(() => {
//     return () => previews.forEach(url => URL.revokeObjectURL(url));
//   }, [previews]);

// BUG 16: Missing useEffect Dependency
// File: frontends/src/Components/Dashboard/LeftSide.jsx (Line ~84)
// Problem: useEffect depends on [token, dispatch] but also accesses `user` state
// Impact: Effect may not re-run when user changes, leading to stale data
// Fix: Add `user` to the dependency array if needed

// BUG 17: Inconsistent setState Naming in Org.jsx
// File: frontends/src/Components/Login/Org.jsx (Line ~17)
// Problem: const [username, setusername] — setter should be camelCase
// Impact: Inconsistent naming, harder to maintain
// Fix: Change to const [username, setUsername] and update line ~111

// BUG 18: Inconsistent Property Access in UserManagement
// File: frontends/src/Components/Dashboard/UserManagement.jsx (Lines ~447-454)
// Problem: Uses `org.DirectFresh` as ID but property names may vary in data
// Impact: Could access wrong/undefined properties
// Fix: Verify actual property names from backend response and standardize

// BUG 19: Missing Key Fallback in Listing
// File: frontends/src/Components/Home/Listing.jsx (Line ~102)
// Problem: key={slide._id} — no fallback if _id is undefined
// Impact: React warning and potential rendering issues
// Fix: Change to key={slide._id || index}


// ============================================================================
// SECTION 4: MISSING AUTH TOKENS IN API CALLS
// ============================================================================

// BUG 20: No Auth Token in Theatre Info
// File: frontends/src/Services/operations/Theatre.js (Lines ~52-86)
// Problem: theatreinfo() function doesn't accept or send auth token
// Impact: Protected endpoint will reject the request (401 Unauthorized)
// Fix: Add token param and include { Authorization: `Bearer ${token}` } header

// BUG 21: No Auth Token in All Theatres Info
// File: frontends/src/Services/operations/Theatre.js (Lines ~89-113)
// Problem: AllTheatresInfo() and TheatreCreationRequestInfo() don't send auth token
// Impact: Protected endpoints will fail
// Fix: Add token parameter and Authorization header

// BUG 22: No Auth Token in Create Theatre
// File: frontends/src/Services/operations/Theatre.js (Lines ~21-50)
// Problem: CreateTheatree() doesn't include auth token in request
// Impact: Protected endpoint will reject
// Fix: Add token param and Authorization header


// ============================================================================
// SECTION 5: CONSOLE LOGS LEFT IN PRODUCTION CODE
// ============================================================================

// BUG 23: Console Logs in UserManagement.jsx
// File: frontends/src/Components/Dashboard/UserManagement.jsx
// Lines: ~85, 91, 120, 157, 186
// Impact: Exposes internal data in browser console
// Fix: Remove all console.log statements

// BUG 24: Console Errors in VerifyTheatrer.jsx
// File: frontends/src/Components/Dashboard/VerifyTheatrer.jsx
// Lines: ~66, 98, 123, 179, 252
// Fix: Remove all console.error statements

// BUG 25: Console Errors in User.jsx
// File: frontends/src/Components/UserCreation/User.jsx
// Lines: ~64, 88, 112, 136, 179
// Fix: Remove all console.error statements


// ============================================================================
// SECTION 6: CODE QUALITY & MINOR ISSUES
// ============================================================================

// BUG 26: Function Name Typos in Theatre.js
// File: frontends/src/Services/operations/Theatre.js
// Lines: ~261, 285, 336
// Problem: Multiple typos in exported function names:
//   - CalculatTotalSale → should be CalculateTotalSale (missing 'e')
//   - GetShowAllotdDetailes → should be GetShowAllotedDetails (typo)
//   - GetSingleShowDetailss → should be GetSingleShowDetails (extra 's')
// Impact: Any component importing these will need the typo version
// Fix: Rename functions and update all imports

// BUG 27: Inconsistent Error Handling in Theatre Operations
// File: frontends/src/Services/operations/Theatre.js (Lines ~176-205)
// Problem: Catch blocks only console.log the error, don't show toast to user
// Impact: User sees no feedback when operations fail
// Fix: Add toast.error() in all catch blocks

// BUG 28: Typo in Error Message
// File: frontends/src/Services/operations/Theatre.js (Line ~199)
// Problem: "tickeet" instead of "ticket" in error log
// Fix: Change to "ticket"

// BUG 29: Missing Return Statement in UserLogin
// File: frontends/src/Services/operations/Auth.js (Line ~283)
// Problem: UserLogin doesn't return anything on success, only on error
// Impact: Calling code can't check if login succeeded
// Fix: Add return statement with response data on success

// BUG 30: Test Credentials in .env (Committed to Git)
// File: frontends/.env (Lines ~10, 26)
// Problem: Razorpay test key and other secrets in .env file tracked by git
// Impact: Security risk — credentials exposed in repository
// Fix: Move to .env.local (gitignored) and use .env.example for template


// ============================================================================
// SECTION 7: SUMMARY
// ============================================================================

// TOTAL BUGS FOUND: 30
//
// By Severity:
//   CRITICAL (will crash):     4 bugs  (Bugs 1-4)
//   MAJOR (visible issues):    8 bugs  (Bugs 5-12)
//   COMPONENT BUGS:            7 bugs  (Bugs 13-19)
//   MISSING AUTH:              3 bugs  (Bugs 20-22)
//   CONSOLE LOGS:              3 bugs  (Bugs 23-25)
//   CODE QUALITY:              5 bugs  (Bugs 26-30)
//
// By File (most bugs):
//   Theatre.js (Services):     10 bugs — most problematic file
//   UserManagement.jsx:         4 bugs
//   Auth.js (Services):         3 bugs
//   User.jsx (UserCreation):    2 bugs
//   LeftSide.jsx:               2 bugs
//
// RECOMMENDED FIX ORDER:
//   Phase 1: Fix Critical Bugs 1-4 (will crash the app)
//   Phase 2: Fix Major Bugs 5-12 (visible to users)
//   Phase 3: Fix Component Bugs 13-19
//   Phase 4: Add missing auth tokens 20-22
//   Phase 5: Clean up console logs & code quality 23-30


// ============================================================================
//                          END OF BUG REPORT
// ============================================================================
