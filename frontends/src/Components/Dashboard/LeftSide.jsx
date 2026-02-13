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
  const organizerLocked = localStorage.getItem("Verified") === "false";
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

  if (status === "submitted" || status === "approved") {
    localStorage.setItem("Data_Submitted", "true");
  }

  if (status === "locked") {
    localStorage.setItem("Data_Submitted", "true");
  }
}, [status]);



  const isVerificatioasdefnSubmitted = localStorage.getItem("user");
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
  className={`w-full h-full bg-richblack-800 flex flex-col text-richblack-900 transition duration-300 ease-in-out ${
    direction ? "hidden" : "flex transition duration-300 ease-in-out h-full"
  }`}
>
      <nav className="flex flex-col gap-3 Sides text-richblack-100">
        {navigationItems.map(({ icon: Icon, label, path, id, disabled }) => (
          <div key={id} className="flex flex-col">
            {label === 'Create Show' ? (
              <>
                 <button
                  disabled={disabled}
                 className={`flex items-center justify-between w-full text-left p-2 Drop rounded ${
                    text === label ? 'bg-yellow-200 text-richblack-900' : 'hover:bg-richblack-700'
                  } ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
                  onClick={() => {
                    if (disabled) return;
                    setShow(prev => !prev);
                    setInside('');
                    setText(label);
                  }}
                >
                  <span className="flex items-center gap-2">
                    {disabled && <FaLock />}
                    <Icon />{label}
                  </span>
                  <FaCaretDown className={`transition-transform ${show ? 'rotate-180' : ''}`} />
                </button>

                {show && !organizerLocked && (
                  <div className="ml-8 mt-2 subMenu flex flex-col gap-2">
                    <Link to="/Dashboard/Shows/Tags" className="hover:text-yellow-200 flex items-center gap-2">
                      <FaHashtag className="text-xs" /> Manage Tags
                    </Link>
                    <Link to="/Dashboard/Shows/Cast" className="hover:text-yellow-200 flex items-center gap-2">
                      <FaUserFriends className="text-xs" /> Manage Cast
                    </Link>
                    <Link to="/Dashboard/Shows/Create" className="hover:text-yellow-200 flex items-center gap-2">
                      <FaFilm className="text-xs" /> Manage Shows
                    </Link>
                    <Link to="/Dashboard/Shows/Upload" className="hover:text-yellow-200 flex items-center gap-2">
                      <FaUpload className="text-xs" /> Upload Show
                    </Link>
                    {/* <Link to="/Dashboard/Shows/All" className="hover:text-yellow-200 flex items-center gap-2">
                      <FaList className="text-xs" /> See All Shows
                    </Link> */}
                  </div>
                )}
                <div className="flex flex-col">
                   <button
                  disabled={organizerLocked}
                  className={`flex items-center justify-between w-full text-left p-2 Drop rounded ${
                      text === 'Tickets' ? 'bg-yellow-200 text-richblack-900' : 'hover:bg-richblack-700'
                    } ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
                  onClick={() => {
                    if (organizerLocked) return;
                    setTicket(prev => !prev);
                    setText('Tickets');
                  }}
                >
                  <span className="flex items-center gap-2">
                    {organizerLocked && <FaLock />}
                    <IoTicketSharp /> Tickets
                  </span>
                  <FaCaretDown className={`transition-transform ${ticket ? 'rotate-180' : ''}`} />
                </button>

                  {ticket && !organizerLocked &&(
                    <div className="ml-8 mt-2 subMenu1 flex flex-col gap-2">
                      <Link to="/Dashboard/Tickets/Create" className="hover:text-yellow-200">
                        Create Ticket
                      </Link>
                      <Link to="/Dashboard/Tickets/Update" className="hover:text-yellow-200">
                        Ticket Allotment
                      </Link>
                      <Link to="/Dashboard/Tickets/All" className="hover:text-yellow-200">
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
                  className={`flex items-center gap-2 w-full p-2 rounded ${
                    disabled ? "cursor-not-allowed opacity-50" : text === label ? "bg-yellow-200 text-richblack-900" : "hover:bg-richblack-700"
                  }`}
                >
                  {disabled && <FaLock />}
                  <Icon /> {label}
                </button>
              </Link>
            )}
            {/* {label === 'Org-Verification' ? (
              <>
                <div
                      className={
                        inside === 'Org-Verification'
                          ? 'hover:text-yellow-200 flex items-center gap-4 cursor-pointer text-yellow-200'
                          : 'flex items-center gap-4'
                      }
                      onClick={() => setInside((prev) => (prev === 'Org-Verification' ? '' : 'Org-Verification'))}
                    >
                      Org-Verification <FaCaretDown className={`${inside === 'Org-Verification' ? 'rotate-180' : ''}`} />
                    </div>
                    {inside === 'Org-Verification' && (
                      <div className="ml-8 mt-2 flex flex-col gap-2 Tags1">
                        <Link to="/Dashboard/Shows/Option1" className="hover:text-yellow-200">
                          Create Show
                        </Link>
                        <Link to="/Dashboard/Shows/Option2" className="hover:text-yellow-200">
                          Update Show Title
                        </Link>
                        <Link to="/Dashboard/Shows/Option3" className="hover:text-yellow-200">
                          Update Tagline
                        </Link>
                        <Link to="/Dashboard/Shows/Option4" className="hover:text-yellow-200">
                          Update Title Image
                        </Link>
                        <Link to="/Dashboard/Shows/Option5" className="hover:text-yellow-200">
                          Update Trailer
                        </Link>
                        <Link to="/Dashboard/Shows/Option6" className="hover:text-yellow-200">
                          Delete Show
                        </Link>
                      </div>
                    )}
              </>
            ) : (
            <></>
            ) } */}
          </div>
        ))}

        {/* Verification Status Indicator */}
        {user.usertype === ACCOUNT_TYPE.ORGANIZER && (

         <div className="mt-4 text-richblack-200 text-sm">
  {status === "locked"
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


      <span className="inline-block w-35 h-[1px] bg-white my-2 DashLine"></span>

      <div className="flex flex-col gap-3 Sides text-richblack-300">
        <Link to="/Dashboard/Settings">
          <button
            className={`flex items-center gap-2 w-full text-left p-2 Close rounded ${
              extra ? 'bg-yellow-200' : 'hover:bg-richblack-700'
            }`}
            onClick={(e) => {
              setExtra(e.target.innerText);
              setText('');
            }}
          >
            <IoSettings />Settings
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
          className="flex items-center gap-2 w-full text-left p-2 hover:bg-richblack-700 rounded"
        >
          <IoLogOutOutline />LogOut
        </button>
      </div>
      {confirmationModal && <Logout modalData={confirmationModal} />}
    </div>
  );
};

export default LeftSide;