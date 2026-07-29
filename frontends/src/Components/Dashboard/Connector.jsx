import Left from './LeftSide'
import Navbar from '../Home/Navbar'
import { Outlet, useLocation, Navigate } from 'react-router-dom'
import { FaChevronRight,FaChevronLeft } from "react-icons/fa";
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Org from './OrganizerVerificationForm'
import { connectSocket, disconnectSocket, getSocket } from '../../Services/socket'
import { fetchConversations } from '../../Services/operations/Chat'
import { upsertConversation, appendMessage } from '../../Slices/chatSlice'
const Connector = () => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);

  const location = useLocation();
  const isBaseDashboard = location.pathname === '/Dashboard' || location.pathname === '/Dashboard/';
  const [direction,Setdirection] = useState(false)

  useEffect(() => {
    if (!token) return
    connectSocket()
    dispatch(fetchConversations(token))

    const socket = getSocket()
    const onConversationUpdated = (conversation) => dispatch(upsertConversation(conversation))
    const onNewMessage = (message) => dispatch(appendMessage(message))
    socket?.on('conversation_updated', onConversationUpdated)
    socket?.on('new_message', onNewMessage)

    return () => {
      socket?.off('conversation_updated', onConversationUpdated)
      socket?.off('new_message', onNewMessage)
      disconnectSocket()
    }
  }, [token, dispatch])

  if (isBaseDashboard) {
    return <Navigate to="/Dashboard/My-Profile" replace />
  }

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
