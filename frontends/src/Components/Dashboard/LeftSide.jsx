import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link,Navigate } from 'react-router-dom';
import { ACCOUNT_TYPE } from '../../utils/constants';
import { LuUserRound } from 'react-icons/lu';
import { FaBookBookmark, FaCartShopping } from 'react-icons/fa6';
import { CiBookmark } from 'react-icons/ci';
import { IoTicketSharp, IoSettings, IoLogOutOutline } from 'react-icons/io5';
import Logout from '../extra/Logout';
import { UserLogout } from '../../Services/operations/Auth';
import { loadUserFromLocalStorage } from '../../Slices/ProfileSlice';
import { FaCaretDown } from 'react-icons/fa';
import { CiChat1 } from 'react-icons/ci';
import { MdReviews } from 'react-icons/md';
import { FaLock, FaHashtag, FaUserFriends, FaFilm, FaUpload, FaList } from 'react-icons/fa';
import {UserDetails} from '../../Services/operations/Auth'
import {GetMyOrgDetails} from '../../Services/operations/orgainezer'
import { FaTheaterMasks } from 'react-icons/fa'
import { MdAttachMoney, MdLocalMovies, MdAccessTime } from 'react-icons/md'
import { FaTicketSimple } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';

const LeftSide = ({direction}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate()

  const { user } = useSelector((state) => state.profile);
  const {token} = useSelector((state)=>state.auth)
  const {status,editUntil,attempts} = useSelector((state)=>state.orgainezer)
// console.log(status)
    const endTime = new Date(editUntil);
    const now = new Date();
    const diffMs = endTime - now;
    // console.log(diffMs)
// This are all the use States that I have used in my code
  const [confirmationModal, setConfirmationModal] = useState(null);

  const [text, setText] = useState('');

  const [extra, setExtra] = useState('');
  const [show, setShow] = useState(false);
  const [ticket, setTicket] = useState(false);
  const [inside, setInside] = useState('');
  const [data,setdata] = useState()
  const [verify,setVerify]= useState(false)


  const FormSubmited = localStorage.getItem("Data_Submitted") === "true";
  const organizerLocked = user?.verified === false;
  const isSubmitted = status === "submitted" || status === "approved" || status === "Approved";

  const isVerificationDisabled =
  status === "locked" ||
  diffMs <= 0 ||
    isSubmitted;


  useEffect(() => {
    if (!user) {
      dispatch(loadUserFromLocalStorage());
    }
  }, [dispatch, user]);


  useEffect(()=>{
    if (!token) return;

    const fetchData = async() => {
      try {
        const response = await dispatch(UserDetails(token));

        if (response?.success) {
          setdata(response.data.data.orgainezerdata);
          // Update Verified in localStorage to stay in sync
          localStorage.setItem('Verified', JSON.stringify(response.data.data.verified));
        }

        // Fetch org status for organizer users
        if (user?.usertype === "Organizer") {
          await dispatch(GetMyOrgDetails(token, navigate));
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  },[token,dispatch])
// console.log("This is the data of the user details",data)

  const viewerNav = [
    { icon: LuUserRound, label:'My Profile', path: '/Dashboard/My-Profile', id: 1 },
    { icon: FaBookBookmark, label:'Purchased Tickets', path: '/Dashboard/Purchased-Tickets', id: 2 },
    { icon: CiBookmark, label:'Wishlist', path: '/Dashboard/Wishlist', id: 3 },
    { icon: FaCartShopping, label:'Purchase History', path: '/Dashboard/Purchase-History', id: 4 },
  ];


  const organizerNav = [
    { icon: LuUserRound, label: 'My Profile', path: '/Dashboard/My-Profile', id: 1 },
    { icon: FaBookBookmark, label: 'My Shows', path: '/Dashboard/Manage-Events', id: 2 },
    {
      icon: FaCartShopping,
      label: 'Create Show',
      path: '/Dashboard/Shows',
      id: 3,
      disabled:organizerLocked
    },
    { icon: CiChat1, label: 'Chat', path: '/Dashboard/Chats', id: 4 },
    { icon: MdReviews, label: 'Reviews', path: '/Dashboard/My-Venues', id: 5 },
    {
      icon: IoSettings,
      label: 'Organizer Verification',
      path: '/Dashboard/Organizer-Verification',
      id: 6,
      disabled: isVerificationDisabled
    },
  ];

    const adminNav = [
    { icon: LuUserRound, label: 'My Profile', path: '/Dashboard/My-Profile', id: 1 },
    { icon: FaBookBookmark, label: 'Org-Verification', path: '/Dashboard/Verifications', id: 2 },
    { icon: IoSettings, label: 'Genre', path: '/Dashboard/Genre', id: 3 },
    { icon: IoSettings, label: 'Language Creation', path: '/Dashboard/CreateLanguage', id: 4 },
    { icon: IoSettings, label: 'Show Verification', path: '/Dashboard/VerifyShows', id: 5 },
    { icon: IoSettings, label: 'Theatres', path: '/Dashboard/VerifyTheatre', id: 6},
    { icon: IoSettings, label: 'All Users', path: '/Dashboard/users', id: 7},
    { icon: CiChat1, label: 'Chat', path: '/Dashboard/Chats', id: 8 },
  ];

  const theatreNav = [
    { icon: LuUserRound, label: 'My Profile', path: '/Dashboard/My-Profile', id: 1 },
    { icon: FaTheaterMasks, label: 'Theatre Details', path: '/Dashboard/Theatre-Details', id: 2 },
    { icon: MdAttachMoney, label: 'Total Sales', path: '/Dashboard/Total-Sales', id: 3 },
    { icon: MdLocalMovies, label: 'Alloted Shows', path: '/Dashboard/Alloted-Shows', id: 4 },
    { icon: IoTicketSharp, label: 'All Tickets', path: '/Dashboard/All-Tickets', id: 5 },
    { icon: FaTicketSimple, label: 'Distribute Tickets', path: '/Dashboard/Distribute-Tickets', id: 6 },
    { icon: MdAccessTime, label: 'Update Ticket Time', path: '/Dashboard/Update-Ticket-Time', id: 7 },
    { icon: CiChat1, label: 'Chat', path: '/Dashboard/Chats', id: 8 },
  ];

// disabled: isVerificationDisabled

  useEffect(() => {
    if (diffMs <= 0 && user?.usertype === ACCOUNT_TYPE.ORGANIZER) {
      navigate('/Dashboard/My-Profile');
    }
  }, [diffMs]);


  // if(FormSubmited === true){
  //   navigate('/Dashboard/My-Profile');
  // }

  const navMap = {
    [ACCOUNT_TYPE.USER]: viewerNav,
    [ACCOUNT_TYPE.ORGANIZER]: organizerNav,
    [ACCOUNT_TYPE.ADMIN]: adminNav,
    [ACCOUNT_TYPE.THEATER]: theatreNav,
  };

  const navigationItems = navMap[user?.usertype] || [];

  useEffect(() => {
    if (!navigationItems.length) return;
    const currentPath = window.location.pathname;

    if (currentPath.startsWith('/Dashboard/Shows')) {
      setText('Create Show');
      setShow(true);
      return;
    }
    if (currentPath.startsWith('/Dashboard/Tickets')) {
      setText('Tickets');
      setTicket(true);
      return;
    }
    if (currentPath === '/Dashboard/Settings') {
      setExtra('Settings');
      return;
    }

    const match = navigationItems.find(item => currentPath === item.path);
    if (match) {
      setText(match.label);
    }
  }, [user?.usertype]);


  useEffect(() => {
  if (status === "rejected") {
    localStorage.setItem("Data_Submitted", "false");
  }

  if (status === "submitted" || status === "approved" || status === "Approved") {
    localStorage.setItem("Data_Submitted", "true");
  }

  if (status === "locked") {
    localStorage.setItem("Data_Submitted", "true");
  }
}, [status]);



  const Verification = localStorage.getItem("Verified")

  if (!user) {
    return (
      <div className="w-full h-full bg-richblack-800 flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  return (
<div
  className={`w-full h-full bg-richblack-800 flex flex-col text-richblack-900 transition-all duration-300 ease-in-out ${
    direction ? "hidden" : "flex h-full"
  }`}
>
      <nav className="flex flex-col gap-1 pt-4 px-3 text-richblack-100">
        {navigationItems.map(({ icon: Icon, label, path, id, disabled }) => (
          <div key={id} className="flex flex-col">
            {label === 'Create Show' ? (
              <>
                 <button
                  disabled={disabled}
                 className={`flex items-center justify-between w-full text-left px-3 py-2.5 rounded-lg text-sm transition-all duration-200 ${
                    text === label ? 'bg-gradient-to-r from-yellow-200/90 to-yellow-100/90 text-richblack-900 font-semibold shadow-sm' : 'hover:bg-richblack-700/70 hover:text-white'
                  } ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
                  onClick={() => {
                    if (disabled) return;
                    setShow(prev => !prev);
                    setInside('');
                    setText(label);
                  }}
                >
                  <span className="flex items-center gap-2.5">
                    {disabled && <FaLock className="text-xs" />}
                    <Icon className="text-base" />{label}
                  </span>
                  <FaCaretDown className={`transition-transform duration-200 text-xs ${show ? 'rotate-180' : ''}`} />
                </button>

                {show && !organizerLocked && (
                  <div className="ml-4 mt-1 flex flex-col gap-0.5 border-l-2 border-richblack-600 pl-4">
                    <Link to="/Dashboard/Shows/Tags" className="text-sm py-1.5 hover:text-yellow-200 flex items-center gap-2 transition-colors">
                      <FaHashtag className="text-xs" /> Manage Tags
                    </Link>
                    <Link to="/Dashboard/Shows/Cast" className="text-sm py-1.5 hover:text-yellow-200 flex items-center gap-2 transition-colors">
                      <FaUserFriends className="text-xs" /> Manage Cast
                    </Link>
                    <Link to="/Dashboard/Shows/Create" className="text-sm py-1.5 hover:text-yellow-200 flex items-center gap-2 transition-colors">
                      <FaFilm className="text-xs" /> Manage Shows
                    </Link>
                    <Link to="/Dashboard/Shows/Upload" className="text-sm py-1.5 hover:text-yellow-200 flex items-center gap-2 transition-colors">
                      <FaUpload className="text-xs" /> Upload Show
                    </Link>
                  </div>
                )}
                <div className="flex flex-col mt-1">
                   <button
                  disabled={organizerLocked}
                  className={`flex items-center justify-between w-full text-left px-3 py-2.5 rounded-lg text-sm transition-all duration-200 ${
                      text === 'Tickets' ? 'bg-gradient-to-r from-yellow-200/90 to-yellow-100/90 text-richblack-900 font-semibold shadow-sm' : 'hover:bg-richblack-700/70 hover:text-white'
                    } ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
                  onClick={() => {
                    if (organizerLocked) return;
                    setTicket(prev => !prev);
                    setText('Tickets');
                  }}
                >
                  <span className="flex items-center gap-2.5">
                    {organizerLocked && <FaLock className="text-xs" />}
                    <IoTicketSharp className="text-base" /> Tickets
                  </span>
                  <FaCaretDown className={`transition-transform duration-200 text-xs ${ticket ? 'rotate-180' : ''}`} />
                </button>

                  {ticket && !organizerLocked &&(
                    <div className="ml-4 mt-1 flex flex-col gap-0.5 border-l-2 border-richblack-600 pl-4">
                      <Link to="/Dashboard/Tickets/Create" className="text-sm py-1.5 hover:text-yellow-200 transition-colors">
                        Create Ticket
                      </Link>
                      <Link to="/Dashboard/Tickets/Update" className="text-sm py-1.5 hover:text-yellow-200 transition-colors">
                        Ticket Allotment
                      </Link>
                      <Link to="/Dashboard/Tickets/All" className="text-sm py-1.5 hover:text-yellow-200 transition-colors">
                        See All Tickets
                      </Link>
                    </div>
                  )}
                </div>
              </>
            ) : (
                <Link to={disabled ? "#" : path} onClick={(e) => {
                   if (disabled) { e.preventDefault(); return; }
                   setText(label);
                   setExtra('');
                 }}>
                <button
                  disabled={disabled}
                  className={`flex items-center gap-2.5 w-full px-3 py-2.5 rounded-lg text-sm transition-all duration-200 ${
                    disabled ? "cursor-not-allowed opacity-50" : text === label ? "bg-gradient-to-r from-yellow-200/90 to-yellow-100/90 text-richblack-900 font-semibold shadow-sm" : "hover:bg-richblack-700/70 hover:text-white"
                  }`}
                >
                  {disabled && <FaLock className="text-xs" />}
                  <Icon className="text-base" /> {label}
                </button>
              </Link>
            )}
          </div>
        ))}

        {/* Verification Status Indicator */}
        {user.usertype === ACCOUNT_TYPE.ORGANIZER && (

         <div className={`mt-3 mx-1 p-3 rounded-lg text-xs leading-relaxed ${
            status === "approved" || status === "Approved"
              ? "bg-green-500/10 border border-green-500/30 text-green-400"
              : "bg-richblack-700/50 border border-richblack-600/50 text-richblack-200"
          }`}>
  {status === "approved" || status === "Approved"
    ? "Your account has been approved. You now have full access to all features."
    : status === "locked"
    ? "Your account is locked. Please message the admin to give you one more chance."
    : diffMs <= 0
      ? "Edit time is over. You cannot edit now. Please message the admin for a new chance."
      : status === "rejected"
        ? `Please fill the data with the right details before time ends (Attempt ${attempts}/3)`
        : FormSubmited
          ? "Verification data submitted."
          : "Please submit verification data to unlock full features."
  }
</div>

        )}
      </nav>


      <div className="my-3 mx-3 h-[1px] bg-gradient-to-r from-transparent via-richblack-600 to-transparent"></div>

      <div className="flex flex-col gap-1 px-3 text-richblack-300">
        <Link to="/Dashboard/Settings">
          <button
            className={`flex items-center gap-2.5 w-full text-left px-3 py-2.5 rounded-lg text-sm transition-all duration-200 ${
              extra ? 'bg-gradient-to-r from-yellow-200/90 to-yellow-100/90 text-richblack-900 font-semibold shadow-sm' : 'hover:bg-richblack-700/70 hover:text-white'
            }`}
            onClick={(e) => {
              setExtra(e.target.innerText);
              setText('');
            }}
          >
            <IoSettings className="text-base" />Settings
          </button>
        </Link>
        <button
          onClick={() =>
            setConfirmationModal({
              text1: 'Are you sure?',
              text2: 'You will be logged out of your account.',
              btn1Text: 'Logout',
              btn2Text: 'Cancel',
              btn1Handler: () => dispatch(UserLogout()),
              btn2Handler: () => setConfirmationModal(null),
            })
          }
          className="flex items-center gap-2.5 w-full text-left px-3 py-2.5 rounded-lg text-sm hover:bg-red-500/10 hover:text-red-400 transition-all duration-200"
        >
          <IoLogOutOutline className="text-base" />LogOut
        </button>
      </div>
      {confirmationModal && <Logout modalData={confirmationModal} />}
    </div>
  );
};

export default LeftSide;
