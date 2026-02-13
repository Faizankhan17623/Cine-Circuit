import React, { useState, useEffect } from 'react';
import { IoChatbubblesOutline, IoChatbubbleEllipsesOutline } from 'react-icons/io5';
import { FiSend, FiSmile, FiPaperclip } from 'react-icons/fi';
import { HiOutlineUserGroup } from 'react-icons/hi';
import { MdOutlineConstruction } from 'react-icons/md';
import { BsTools } from 'react-icons/bs';

const Chat = () => {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? '' : prev + '.'));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-richblack-900 via-richblack-800 to-richblack-900 flex items-center justify-center p-4 animate-fadeIn">
      <div className="w-full max-w-4xl">

        {/* Faux Chat Window */}
        <div className="bg-gray-800/60 backdrop-blur-xl rounded-2xl border border-gray-700/50 shadow-2xl overflow-hidden">

          {/* Chat Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700/50 bg-gray-800/80">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
                <IoChatbubblesOutline className="text-white text-xl" />
              </div>
              <div>
                <h2 className="text-white font-semibold text-lg">Chat Room</h2>
                <p className="text-gray-400 text-xs flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse inline-block"></span>
                  Building something awesome{dots}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-gray-500">
              <HiOutlineUserGroup className="text-xl" />
              <IoChatbubbleEllipsesOutline className="text-xl" />
            </div>
          </div>

          {/* Chat Body - Under Construction */}
          <div className="px-6 py-16 flex flex-col items-center justify-center min-h-[420px] relative overflow-hidden">

            {/* Decorative blurred blobs */}
            <div className="absolute top-10 left-10 w-32 h-32 bg-yellow-500/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-10 right-10 w-40 h-40 bg-orange-500/10 rounded-full blur-3xl"></div>

            {/* Construction Icon */}
            <div className="relative mb-6">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-yellow-400/20 to-orange-500/20 border-2 border-yellow-500/30 flex items-center justify-center animate-bounce" style={{ animationDuration: '3s' }}>
                <MdOutlineConstruction className="text-yellow-400 text-5xl" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-gray-800 border-2 border-yellow-500/40 flex items-center justify-center">
                <BsTools className="text-yellow-400 text-sm" />
              </div>
            </div>

            {/* Main Message */}
            <h1 className="text-3xl font-bold text-white mb-2 text-center">
              Under Construction
            </h1>
            <p className="text-gray-400 text-center max-w-md mb-8 leading-relaxed">
              We're crafting the perfect chat experience for you.
              Real-time messaging, media sharing, and more — coming soon!
            </p>

            {/* Feature Pills */}
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              {['Real-time Messaging', 'Media Sharing', 'Group Chats', 'Notifications'].map(
                (feature) => (
                  <span
                    key={feature}
                    className="px-4 py-1.5 rounded-full bg-gray-700/50 border border-gray-600/40 text-gray-300 text-sm"
                  >
                    {feature}
                  </span>
                )
              )}
            </div>

            {/* Progress Bar */}
            <div className="w-full max-w-xs">
              <div className="flex justify-between text-xs text-gray-500 mb-1.5">
                <span>Progress</span>
                <span>40%</span>
              </div>
              <div className="w-full h-2 bg-gray-700/60 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full transition-all duration-1000"
                  style={{ width: '40%' }}
                ></div>
              </div>
            </div>
          </div>

          {/* Disabled Input Bar */}
          <div className="px-6 py-4 border-t border-gray-700/50 bg-gray-800/40">
            <div className="flex items-center gap-3 bg-gray-700/30 rounded-xl px-4 py-3 border border-gray-600/30 opacity-50 cursor-not-allowed">
              <FiSmile className="text-gray-500 text-xl" />
              <span className="flex-1 text-gray-500 text-sm select-none">
                Type a message...
              </span>
              <FiPaperclip className="text-gray-500 text-xl" />
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
                <FiSend className="text-white text-sm" />
              </div>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <p className="text-center text-gray-600 text-xs mt-4">
          Stay tuned — great things are on the way!
        </p>
      </div>
    </div>
  );
};

export default Chat;