import Left from './LeftSide'
import Navbar from '../Home/Navbar'
import { Outlet ,useLocation } from 'react-router-dom'
import { FaArrowRight,FaArrowLeft } from "react-icons/fa";
import { useState } from 'react';
import Org from './OrganizerVerificationForm'
const Connector = () => {

  const location = useLocation();
  const isBaseDashboard = location.pathname === '/Dashboard' || location.pathname === '/Dashboard/';
  const [direction,Setdirection] = useState(false)

  return (
    <div className='w-screen h-screen overflow-hidden flex flex-col'>
      <Navbar />
      <div className='w-full h-full flex '>

         <div
          className={`h-full flex-shrink-0 transition-all duration-300 ${
            direction ? "hidden" : "w-54 h-full"
          }`}
        >
          <Left direction={direction} />
        </div>

        <div className="w-4 h-full Seperation">
          <button
            className={`border w-10 bg-white relative top-60 rounded-md flex justify-center items-center -left-2 ${direction?"h-12":""}`}
            onClick={() => Setdirection(prev => !prev)}
          >
            {direction ? (
              <FaArrowRight className="text-3xl animate-bounce" />
            ) : (
              <FaArrowLeft className="text-2xl" />
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