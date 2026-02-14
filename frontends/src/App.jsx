import { useState, useEffect } from 'react'
import Navbar from './Components/Home/Navbar'
import toast from 'react-hot-toast';
import Slider from './Components/Home/Slider'
import Finder from './Components/Home/Finder'
import Listing from './Components/Home/Listing';
import {  Routes, Route, Navigate} from "react-router-dom";
import About from './Components/Home/AboutUs'
import Contact from './Components/Home/contact'
import Join from './Components/UserCreation/Join'
import OPT from './Components/UserCreation/OTP'
import Login from './Components/Login/join'
import Forgot from './Components/Login/Forgot'
import Reset from './Components/Login/Reset'
import OpenRoute from './Hooks/OpenRoute'
import PrivateRoute from './Hooks/PrivateRoute';
import Dasboard from './Components/Dashboard/Connector'
import Movies from './Components/Movies/Heading'
import Movie from './Components/Movies/Movie'
import Theatres from './Components/Theatres/Heading'
import AllotedShows from './Components/Theatres/AllotedShows'
import TheatreFullDetails from './Components/Theatres/TheatreFullDetails'
import Purchase from './Components/Movies/Purchase'
import Profile from './Components/Dashboard/Profile'
import { useDispatch, useSelector } from 'react-redux'
// import Error from './Components/extra/Extra'
import {ACCOUNT_TYPE} from './utils/constants'
import Purchased from './Components/Dashboard/PurchasedTickets'
import Wishlist from './Components/Dashboard/Wishlist'
import History from './Components/Dashboard/PurchasedHistory'
import Tickets from './Components/Dashboard/Tickets'
import Settings from './Components/Dashboard/Settings'
import Right from './Components/Dashboard/RightSide'
import UserManage from './Components/Dashboard/UserManagement'
import Site from './Components/Dashboard/SiteSettings'
import Genre from './Components/Dashboard/Genres'
import Language from './Components/Dashboard/Language'
import Users from './Components/Dashboard/Users'
import Error from './Components/extra/Extra'
import OrganizerVerificationForm from './Components/Dashboard/OrganizerVerificationForm'
import Tags from './Components/Dashboard/Tags'
import Cast from './Components/Dashboard/Cast'
import ShowsManager from './Components/Dashboard/ShowsManager'
import UploadShow from './Components/Dashboard/UploadShow'
import AllShows from './Components/Dashboard/AllShows'
import  VerifyShow from './Components/Dashboard/VerifyShows'
import CookieConsent, { Cookies } from "react-cookie-consent";
import  VerifyTheatrer from './Components/Dashboard/VerifyTheatrer'
import CreateTicket from './Components/Dashboard/Tickets/CreateTicketes'
import TicketAllotment from './Components/Dashboard/Tickets/TicketAllotment'
import AllTickets from './Components/Dashboard/Tickets/GetAllTicket'
import Chat from './Components/Dashboard/Chating/Chat'
import ReviewPopup from './Components/Movies/ReviewPopup'
import { MdDesktopMac } from 'react-icons/md'

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
const dispatch = useDispatch()

const [isMobile, setIsMobile] = useState(false)

useEffect(() => {
  const check = () => setIsMobile(window.innerWidth < 768)
  check()
  window.addEventListener('resize', check)
  return () => window.removeEventListener('resize', check)
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
      <ReviewPopup />

      <Routes>

        <Route path='/' element={<Homelayout  Notify={notify}/>}/>
        <Route path='/About' element={<About/>}/>
        <Route path='/Contact' element={<Contact/>}/>
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
      <Route path="/Dashboard/Chats" element={<Chat/>} />

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
    </>
  )}

</Route>


<Route path='*' element={<Error/>}/>
    </Routes>
    </div>
  )
}

export default App
