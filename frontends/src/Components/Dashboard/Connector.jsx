import Left from './LeftSide'
import Navbar from '../Home/Navbar'
import { Outlet ,useLocation } from 'react-router-dom'
import { FaChevronRight,FaChevronLeft } from "react-icons/fa";
import { useState } from 'react';
import Org from './OrganizerVerificationForm'
const Connector = () => {

  const location = useLocation();
  const isBaseDashboard = location.pathname === '/Dashboard' || location.pathname === '/Dashboard/';
  const [direction,Setdirection] = useState(false)

  return (
    <div className='w-screen h-screen overflow-hidden flex flex-col'>
      <Navbar />
      <div className='w-full h-full flex'>

         <div
          className={`h-full flex-shrink-0 transition-all duration-300 ease-in-out border-r border-richblack-700 ${
            direction ? "w-0 overflow-hidden" : "w-60"
          }`}
        >
          <Left direction={direction} />
        </div>

        <div className="relative">
          <button
            className={`absolute top-1/2 -translate-y-1/2 z-10 w-6 h-12 rounded-r-lg bg-richblack-700 hover:bg-richblack-600 flex items-center justify-center transition-all duration-200 border border-l-0 border-richblack-600 hover:border-yellow-200/30`}
            onClick={() => Setdirection(prev => !prev)}
          >
            {direction ? (
              <FaChevronRight className="text-xs text-richblack-300 hover:text-yellow-200" />
            ) : (
              <FaChevronLeft className="text-xs text-richblack-300 hover:text-yellow-200" />
            )}
          </button>
        </div>
  <div className="flex-1 h-full overflow-auto bg-richblack-900">
          <Outlet />
        </div>

      </div>
       {/* {direction && <Org direction={direction} />} */}
    </div>
  );
};

export default Connector
