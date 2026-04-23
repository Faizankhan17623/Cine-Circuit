import { useState, useRef, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import { MdOutlineSmartToy } from 'react-icons/md';
import { RiRobot2Fill } from 'react-icons/ri';
import AIAgent from './AIAgent';
import BotChat from './BotChat';

const AgentLauncher = () => {
  const [open, setOpen] = useState(false);
  const [activeMode, setActiveMode] = useState(null); // null | 'agent' | 'bot'
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
        setActiveMode(null);
      }
    };
    if (open) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  const handleClose = () => {
    setOpen(false);
    setActiveMode(null);
  };

  const handleFabClick = () => {
    if (open && activeMode) {
      setActiveMode(null);
    } else {
      setOpen((prev) => !prev);
      if (!open) setActiveMode(null);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-50" ref={containerRef}>

      {open && (
        <>
          {/* Selection menu */}
          {!activeMode && (
            <div className="absolute bottom-20 right-0 w-64 bg-richblack-800 border border-richblack-600 rounded-2xl shadow-2xl shadow-purple-900/30 p-3 animate-slideUp">
              <p className="text-richblack-300 text-xs font-semibold uppercase tracking-wider mb-3 px-1">Choose your assistant</p>

              {/* AI Movie Agent */}
              <button
                onClick={() => setActiveMode('agent')}
                className="w-full flex items-center gap-3 p-3 rounded-xl bg-richblack-700 hover:bg-purple-900/40 border border-richblack-600 hover:border-purple-500/50 transition-all mb-2 text-left"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shrink-0">
                  <RiRobot2Fill className="text-white text-lg" />
                </div>
                <div>
                  <p className="text-white text-sm font-semibold leading-tight">AI Movie Agent</p>
                  <p className="text-richblack-400 text-xs mt-0.5">Explore tasks & get recommendations</p>
                </div>
              </button>

              {/* Data Bot */}
              <button
                onClick={() => setActiveMode('bot')}
                className="w-full flex items-center gap-3 p-3 rounded-xl bg-richblack-700 hover:bg-yellow-900/30 border border-richblack-600 hover:border-yellow-500/50 transition-all text-left"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center shrink-0">
                  <MdOutlineSmartToy className="text-white text-xl" />
                </div>
                <div>
                  <p className="text-white text-sm font-semibold leading-tight">Data Bot</p>
                  <p className="text-richblack-400 text-xs mt-0.5">Login, signup & search movies</p>
                </div>
              </button>
            </div>
          )}

          {activeMode === 'agent' && (
            <AIAgent onClose={handleClose} onBack={() => setActiveMode(null)} />
          )}

          {activeMode === 'bot' && (
            <BotChat onClose={handleClose} onBack={() => setActiveMode(null)} />
          )}
        </>
      )}

      {/* Floating launcher button */}
      <div className="relative group">
        <button
          onClick={handleFabClick}
          className={`w-14 h-14 flex items-center justify-center rounded-full transition-all duration-300 shadow-xl hover:scale-110 ${
            open
              ? 'bg-richblack-600 shadow-richblack-500/40'
              : 'bg-gradient-to-br from-purple-500 via-pink-500 to-yellow-400 shadow-purple-500/30'
          }`}
        >
          {open
            ? <FaTimes className="text-xl text-white" />
            : <RiRobot2Fill className="text-2xl text-white" />
          }
        </button>

        {!open && (
          <div className="invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-200 absolute bottom-full right-0 mb-3 pointer-events-none">
            <div className="bg-richblack-700 border border-richblack-500 rounded-lg px-4 py-2 shadow-xl whitespace-nowrap">
              <p className="text-sm text-white font-semibold">Cine Circuit Assistant</p>
              <p className="text-xs text-richblack-400">AI Agent · Data Bot</p>
              <div className="absolute top-full right-5 -mt-1 border-4 border-transparent border-t-richblack-700" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AgentLauncher;
