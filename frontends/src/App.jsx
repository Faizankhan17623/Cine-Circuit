import { useState, useEffect, lazy, Suspense } from 'react'
import Navbar from './Components/Home/Navbar'
import toast from 'react-hot-toast';
import Slider from './Components/Home/Slider'
import Finder from './Components/Home/Finder'
import Listing from './Components/Home/Listing';
import {  Routes, Route, Navigate} from "react-router-dom";
import OpenRoute from './Hooks/OpenRoute'
import PrivateRoute from './Hooks/PrivateRoute';
import { useDispatch, useSelector } from 'react-redux'
import {ACCOUNT_TYPE} from './utils/constants'
import CookieConsent from "react-cookie-consent";
import { MdDesktopMac } from 'react-icons/md'
import AgentLauncher from './Components/extra/AgentLauncher'
import ScrollToTop from './Components/extra/ScrollToTop'
import MaintenanceBanner from './Components/extra/MaintenanceBanner'
import MaintenancePopup from './Components/extra/MaintenancePopup'
import { fetchMaintenanceStatus } from './Services/operations/Maintenance'
import ReviewPopup from './Components/Movies/ReviewPopup'
import Error from './Components/extra/Extra'
import { Helmet } from 'react-helmet-async'

// Lazy-loaded route components — split into separate chunks for faster initial load
const About = lazy(() => import('./Components/Home/AboutUs'))
const Contact = lazy(() => import('./Components/Home/contact'))
const Join = lazy(() => import('./Components/UserCreation/Join'))
const OPT = lazy(() => import('./Components/UserCreation/OTP'))
const Login = lazy(() => import('./Components/Login/join'))
const Forgot = lazy(() => import('./Components/Login/Forgot'))
const Reset = lazy(() => import('./Components/Login/Reset'))
const Dasboard = lazy(() => import('./Components/Dashboard/Connector'))
const Movies = lazy(() => import('./Components/Movies/Heading'))
const Movie = lazy(() => import('./Components/Movies/Movie'))
const Theatres = lazy(() => import('./Components/Theatres/Heading'))
const AllotedShows = lazy(() => import('./Components/Theatres/AllotedShows'))
const TheatreFullDetails = lazy(() => import('./Components/Theatres/TheatreFullDetails'))
const Purchase = lazy(() => import('./Components/Movies/Purchase'))
const Profile = lazy(() => import('./Components/Dashboard/Profile'))
const Purchased = lazy(() => import('./Components/Dashboard/PurchasedTickets'))
const Wishlist = lazy(() => import('./Components/Dashboard/Wishlist'))
const History = lazy(() => import('./Components/Dashboard/PurchasedHistory'))
const Tickets = lazy(() => import('./Components/Dashboard/Tickets'))
const Settings = lazy(() => import('./Components/Dashboard/Settings'))
const Right = lazy(() => import('./Components/Dashboard/RightSide'))
const UserManage = lazy(() => import('./Components/Dashboard/UserManagement'))
const Site = lazy(() => import('./Components/Dashboard/SiteSettings'))
const Genre = lazy(() => import('./Components/Dashboard/Genres'))
const Language = lazy(() => import('./Components/Dashboard/Language'))
const Users = lazy(() => import('./Components/Dashboard/Users'))
const OrganizerVerificationForm = lazy(() => import('./Components/Dashboard/OrganizerVerificationForm'))
const Tags = lazy(() => import('./Components/Dashboard/Tags'))
const Cast = lazy(() => import('./Components/Dashboard/Cast'))
const ShowsManager = lazy(() => import('./Components/Dashboard/ShowsManager'))
const UploadShow = lazy(() => import('./Components/Dashboard/UploadShow'))
const AllShows = lazy(() => import('./Components/Dashboard/AllShows'))
const VerifyShow = lazy(() => import('./Components/Dashboard/VerifyShows'))
const VerifyTheatrer = lazy(() => import('./Components/Dashboard/VerifyTheatrer'))
const CreateTicket = lazy(() => import('./Components/Dashboard/Tickets/CreateTicketes'))
const TicketAllotment = lazy(() => import('./Components/Dashboard/Tickets/TicketAllotment'))
const AllTickets = lazy(() => import('./Components/Dashboard/Tickets/GetAllTicket'))
const Chat = lazy(() => import('./Components/Dashboard/Chating/Chat'))
const TheatreDetailsDash = lazy(() => import('./Components/Dashboard/TheatreDetails'))
const TotalSales = lazy(() => import('./Components/Dashboard/TotalSales'))
const AllotedShowsDash = lazy(() => import('./Components/Dashboard/AllotedShows'))
const TheatreAllTickets = lazy(() => import('./Components/Dashboard/TheatreAllTickets'))
const DistributeTickets = lazy(() => import('./Components/Dashboard/DistributeTickets'))
const UpdateTicketTime = lazy(() => import('./Components/Dashboard/UpdateTicketTime'))
const MovieCategory = lazy(() => import('./Components/Home/MovieCategory'))
const MaintenanceMode = lazy(() => import('./Components/Dashboard/MaintenanceMode'))
const BugReports = lazy(() => import('./Components/Dashboard/BugReports'))
const MyBugReports = lazy(() => import('./Components/Dashboard/MyBugReports'))
const AuditLogs = lazy(() => import('./Components/Dashboard/AuditLogs'))
const AdminDashboardHome = lazy(() => import('./Components/Dashboard/AdminDashboardHome'))
const OrganizerDashboardHome = lazy(() => import('./Components/Dashboard/OrganizerDashboardHome'))
const TheatrerDashboardHome = lazy(() => import('./Components/Dashboard/TheatrerDashboardHome'))
const OrganizerTicketReport = lazy(() => import('./Components/Dashboard/OrganizerTicketReport'))
const CouponManager = lazy(() => import('./Components/Dashboard/CouponManager'))
const VisitorStats = lazy(() => import('./Components/Dashboard/VisitorStats'))

const PageLoader = () => (
  <div className="min-h-screen bg-richblack-900 flex items-center justify-center">
    <div className="w-10 h-10 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin" />
  </div>
)

const MobileBlocker = () => (
  <div className="fixed inset-0 z-[9999] bg-richblack-900 flex flex-col items-center justify-center px-8 text-center">
    <MdDesktopMac className="text-6xl text-yellow-50 mb-6" />
    <h1 className="text-2xl font-bold text-white mb-3">Desktop Only</h1>
    <p className="text-richblack-300 text-sm max-w-xs leading-relaxed">
      Cine Circuit is optimized for tablet and desktop screens. Please switch to a device with a screen width of 768px or larger.
    </p>
    <div className="mt-6 w-16 h-1 bg-gradient-to-r from-yellow-400 to-yellow-200 rounded-full" />
  </div>
)

const Homelayout = ({Notify}) =>{
  const BASE_URL = import.meta.env.VITE_MAIN_BACKEND_URL_USER
// console.log(BASE_URL)
  return(
    <div className={`bg-richblack-900 min-h-screen`}>
    <Navbar setColors={Notify}  />
    <div className="max-w-[1440px] mx-auto px-2">
      <div className="">
        <Slider />
      </div>
      <Finder />
    </div>
      <Listing/>

      <CookieConsent
  location="bottom"
  buttonText="Sure man!!"
  cookieName="myAwesomeCookieName2"
  style={{ background: "#2B373B" }}
  buttonStyle={{ color: "#4e503b", fontSize: "13px" }}
  expires={150}
>
   We use cookies to improve your experience. By continuing, you agree to our cookie policy.
</CookieConsent>
  </div>
  )
}

const App = () => {
  const notify = () => toast.error('Work Under Progress !');

// const user = localStorage.getItem('userType')
const {user} = useSelector((state)=>state.profile)
const { theme } = useSelector((state) => state.theme)
const dispatch = useDispatch()

const [isMobile, setIsMobile] = useState(false)

useEffect(() => {
  const root = document.documentElement
  if (theme === 'dim') {
    root.classList.add('dim')
  } else {
    root.classList.remove('dim')
  }
}, [theme])

useEffect(() => {
  const check = () => setIsMobile(window.innerWidth < 768)
  check()
  window.addEventListener('resize', check)
  return () => window.removeEventListener('resize', check)
}, [])

useEffect(() => {
  dispatch(fetchMaintenanceStatus())
}, [])

useEffect(() => {
  const goOffline = () => {
    console.error('[Cine Circuit] No internet connection detected.')
    toast.error('No internet connection!', {
      id: 'network-status',
      duration: Infinity,
      icon: '📡',
      style: { background: '#1e1e2e', color: '#fff', border: '1px solid #ef4444' },
    })
  }

  const goOnline = () => {
    console.log('[Cine Circuit] Internet connection restored.')
    toast.dismiss('network-status')
    toast.success('Back online!', {
      id: 'network-online',
      duration: 3000,
      icon: '✅',
      style: { background: '#1e1e2e', color: '#fff', border: '1px solid #22c55e' },
    })
  }

  // fire immediately if already offline when component mounts
  if (!navigator.onLine) goOffline()

  window.addEventListener('offline', goOffline)
  window.addEventListener('online', goOnline)
  return () => {
    window.removeEventListener('offline', goOffline)
    window.removeEventListener('online', goOnline)
  }
}, [])


 if (user === null) {
    const storedUser = localStorage.getItem("userType");
    if (storedUser && !user) {
      return <div className="text-white text-center mt-10">Loading...</div>;
    }
  }



  return (
    <div className={`bg-richblack-800 min-h-screen`}>
      {isMobile && <MobileBlocker />}
      <MaintenanceBanner />
      <MaintenancePopup />
      <ReviewPopup />
      <AgentLauncher />
      <ScrollToTop />

      <Suspense fallback={<PageLoader />}>
      <Routes>

        <Route path='/' element={<Homelayout  Notify={notify}/>}/>
        <Route path='/top-rated' element={
          <>
            <Helmet>
              <title>Top Rated Movies — Cine Circuit</title>
              <meta name="description" content="Browse the highest-rated movies on Cine Circuit. Critics and audiences agree — these are the best films showing now." />
            </Helmet>
            <MovieCategory type="top-rated" />
          </>
        } />
        <Route path='/most-liked' element={
          <>
            <Helmet>
              <title>Most Liked Movies — Cine Circuit</title>
              <meta name="description" content="Discover the most liked movies by Cine Circuit audiences. Book tickets for the films everyone is talking about." />
            </Helmet>
            <MovieCategory type="most-liked" />
          </>
        } />
        <Route path='/recently-released' element={
          <>
            <Helmet>
              <title>Recently Released Movies — Cine Circuit</title>
              <meta name="description" content="Watch the latest movies just released in theatres. Book your tickets for brand new releases on Cine Circuit." />
            </Helmet>
            <MovieCategory type="recently-released" />
          </>
        } />
        <Route path='/About' element={
          <>
            <Helmet>
              <title>About Cine Circuit — Our Story</title>
              <meta name="description" content="Learn about Cine Circuit — the platform built to bring movies and audiences together. Our mission, team, and values." />
            </Helmet>
            <About/>
          </>
        }/>
        <Route path='/Contact' element={
          <>
            <Helmet>
              <title>Contact Us — Cine Circuit</title>
              <meta name="description" content="Get in touch with the Cine Circuit team. We're here to help with bookings, partnerships, and feedback." />
            </Helmet>
            <Contact/>
          </>
        }/>
        <Route path='/SignUp' element={<Join/> }/>
        <Route path='/Login' element={ <Login/>}/>
        <Route path='/OTP' element={<OPT/>}/>

        <Route path='/Movies/:id' element={<Movies/>}/>
        <Route path='/Movie/:id' element={<Movie/>}/>
        <Route path='/Theatres/:id' element={<Theatres/>}/>
        <Route path='/theatres/alloted-shows/:id' element={<AllotedShows/>}/>
        <Route path='/theatre/full-details/:id' element={<TheatreFullDetails/>}/>

        <Route path='/Purchase/:id' element={<Purchase/>}/>

          <Route path='/Forgot-Password' element={
          <OpenRoute>
            <Forgot/>
           </OpenRoute> 
          }/>

        <Route path='/Reset-Password/:id' element={ 
          <OpenRoute>
            <Reset/> 
          </OpenRoute>
        }/>


<Route element={
  <PrivateRoute>
    <Dasboard /> {/* This is your Connector */}
  </PrivateRoute>
}>
  

  {/* Dashboard home — role-based */}
  {user?.usertype === ACCOUNT_TYPE.ADMIN && (
    <Route path="/Dashboard/Home" element={<AdminDashboardHome />} />
  )}
  {user?.usertype === ACCOUNT_TYPE.ORGANIZER && (
    <Route path="/Dashboard/Home" element={<OrganizerDashboardHome />} />
  )}
  {user?.usertype === ACCOUNT_TYPE.THEATER && (
    <Route path="/Dashboard/Home" element={<TheatrerDashboardHome />} />
  )}

  {/* Common to all */}
  <Route path="/Dashboard/My-Profile" element={<Profile />} />
  <Route path="/Dashboard/Settings" element={<Settings />} />

  {/* Viewer specific */}
{user?.usertype === ACCOUNT_TYPE.USER && (
    <>
      <Route path="/Dashboard/Purchased-Tickets" element={<Purchased />} />
      <Route path="/Dashboard/Wishlist" element={<Wishlist />} />
      <Route path="/Dashboard/Purchase-History" element={<History />} />
      <Route path="/Dashboard/Tickets" element={<Tickets />} />
      <Route path="/Dashboard/Chats" element={<Chat/>} />
      <Route path="/Dashboard/My-Bug-Reports" element={<MyBugReports/>} />
    </>
  )}

  {/* Organizer specific */}
  {user?.usertype === ACCOUNT_TYPE.ORGANIZER && (
    <>
      <Route path="/Dashboard/Manage-Events" element={<AllShows />} />
      <Route path="/Dashboard/Shows" element={<ShowsManager />} />
      <Route path="/Dashboard/Shows/Tags" element={<Tags />} />
      <Route path="/Dashboard/Shows/Cast" element={<Cast />} />
      <Route path="/Dashboard/Shows/Create" element={<ShowsManager />} />
      <Route path="/Dashboard/Shows/Upload" element={<UploadShow />} />
      <Route path="/Dashboard/My-Venues" element={<div className='text-white'>Organizer Venues Page</div>} />
      <Route path="/Dashboard/Organizer-Verification" element={<OrganizerVerificationForm />} />
      <Route path="/Dashboard/Tickets/Create" element={<CreateTicket/>} />
      <Route path="/Dashboard/Tickets/Update" element={<TicketAllotment/>} />
      <Route path="/Dashboard/Tickets/All" element={<AllTickets/>} />
      <Route path="/Dashboard/Ticket-Report" element={<OrganizerTicketReport />} />
      <Route path="/Dashboard/Chats" element={<Chat/>} />
    </>
  )}

  {/* Theatre specific */}
  {user?.usertype === ACCOUNT_TYPE.THEATER && (
    <>
      <Route path="/Dashboard/Theatre-Details" element={<TheatreDetailsDash />} />
      <Route path="/Dashboard/Total-Sales" element={<TotalSales />} />
      <Route path="/Dashboard/Alloted-Shows" element={<AllotedShowsDash />} />
      <Route path="/Dashboard/All-Tickets" element={<TheatreAllTickets />} />
      <Route path="/Dashboard/Distribute-Tickets" element={<DistributeTickets />} />
      <Route path="/Dashboard/Update-Ticket-Time" element={<UpdateTicketTime />} />
      <Route path="/Dashboard/Chats" element={<Chat />} />
    </>
  )}

  {/* Admin specific */}
  {user?.usertype === ACCOUNT_TYPE.ADMIN && (
    <>
      <Route path="/Dashboard/Verifications" element={<UserManage />} />
      <Route path="/Dashboard/Genre" element={<Genre />} />
      <Route path="/Dashboard/CreateLanguage" element={<Language/>} />
      <Route path="/Dashboard/VerifyShows" element={<VerifyShow/>} />
      <Route path="/Dashboard/VerifyTheatre" element={<VerifyTheatrer/>} />
      <Route path="/Dashboard/users" element={<Users/>} />
      <Route path="/Dashboard/Chats" element={<Chat/>} />
      <Route path="/Dashboard/Maintenance" element={<MaintenanceMode/>} />
      <Route path="/Dashboard/Bug-Reports" element={<BugReports/>} />
      <Route path="/Dashboard/Audit-Logs" element={<AuditLogs/>} />
      <Route path="/Dashboard/Coupon-Manager" element={<CouponManager/>} />
      <Route path="/Dashboard/Visitor-Stats" element={<VisitorStats/>} />
    </>
  )}

</Route>


<Route path='*' element={<Error/>}/>
    </Routes>
    </Suspense>
    </div>
  )
}

export default App
