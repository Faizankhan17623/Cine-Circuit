import { useState, useRef, useEffect, useCallback } from 'react';
import { FaRobot, FaTimes, FaSearch } from 'react-icons/fa';
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from 'react-icons/md';
import { useSelector } from 'react-redux';
import { agentTasks } from '../../data/agentTasks';

// Typewriter hook — types text char by char at given speed (ms per char)
const useTypewriter = (text, speed = 14) => {
  const [displayed, setDisplayed] = useState('');
  const timerRef = useRef(null);

  useEffect(() => {
    setDisplayed('');
    if (!text) return;
    let i = 0;
    timerRef.current = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) clearInterval(timerRef.current);
    }, speed);
    return () => clearInterval(timerRef.current);
  }, [text, speed]);

  return displayed;
};

const AIAgent = () => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [expandedCategories, setExpandedCategories] = useState({});
  const [activeAnswer, setActiveAnswer] = useState('');
  const [activeQuery, setActiveQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const popupRef = useRef(null);
  const answerRef = useRef(null);

  const { user } = useSelector((state) => state.profile);
  // Redux first — fallback to localStorage after login
  const userType = user?.usertype || localStorage.getItem('userType') || null;
  const isLoggedIn = !!userType;

  const typedAnswer = useTypewriter(activeAnswer, 14);

  // Track if still typing
  useEffect(() => {
    setIsTyping(typedAnswer !== activeAnswer);
  }, [typedAnswer, activeAnswer]);

  // Scroll answer into view when it starts
  useEffect(() => {
    if (activeAnswer && answerRef.current) {
      answerRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [activeAnswer]);

  // Filter categories based on login state + role
  const visibleCategories = agentTasks.filter((cat) => {
    // "all" = visible to everyone, logged in or not
    if (cat.roles.includes('all')) return true;
    // everything else requires login
    if (!isLoggedIn) return false;
    // show only if user's role is in the category's roles list
    return cat.roles.includes(userType);
  });

  // Filter by search
  const filteredCategories = visibleCategories
    .map((cat) => ({
      ...cat,
      tasks: cat.tasks.filter((t) =>
        t.query.toLowerCase().includes(search.toLowerCase())
      ),
    }))
    .filter((cat) => cat.tasks.length > 0);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  const toggleCategory = (id) => {
    setExpandedCategories((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleTaskClick = useCallback((task) => {
    setActiveQuery(task.query);
    setActiveAnswer('');
    // Small delay so useEffect resets cleanly before new text starts
    setTimeout(() => setActiveAnswer(task.answer), 80);
  }, []);

  return (
    <div className="fixed bottom-8 right-8 z-50" ref={popupRef}>
      {/* Popup Panel */}
      {open && (
        <div className="absolute bottom-20 right-0 w-[370px] max-h-[75vh] flex flex-col bg-richblack-800 border border-richblack-600 rounded-2xl shadow-2xl shadow-purple-900/30 overflow-hidden animate-slideUp">

          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <FaRobot className="text-white text-sm" />
              </div>
              <div>
                <p className="text-white font-bold text-sm leading-tight">AI Movie Agent</p>
                <p className="text-purple-200 text-xs">Cine Circuit Assistant</p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-white/70 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/10"
            >
              <FaTimes />
            </button>
          </div>

          {/* Search */}
          <div className="px-3 pt-3 pb-2 shrink-0">
            <div className="flex items-center gap-2 bg-richblack-700 border border-richblack-600 rounded-xl px-3 py-2 focus-within:border-purple-500 transition-colors">
              <FaSearch className="text-richblack-400 text-xs shrink-0" />
              <input
                type="text"
                placeholder="Search tasks..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-transparent text-white text-sm outline-none w-full placeholder:text-richblack-400"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="text-richblack-400 hover:text-white transition-colors"
                >
                  <FaTimes className="text-xs" />
                </button>
              )}
            </div>
          </div>

          {/* Login nudge — only for logged out users */}
          {!isLoggedIn && (
            <div className="mx-3 mt-2 px-3 py-2 bg-yellow-900/20 border border-yellow-600/30 rounded-xl shrink-0 flex items-center gap-2">
              <span className="text-base shrink-0">🔒</span>
              <p className="text-yellow-300 text-xs leading-snug">
                Log in to unlock ticket, review, and account tasks.
              </p>
            </div>
          )}

          {/* Scrollable body */}
          <div className="overflow-y-auto flex-1 px-3 pb-3 space-y-2 scrollbar-thin scrollbar-thumb-richblack-600 scrollbar-track-transparent">

            {/* Answer Panel */}
            {activeAnswer && (
              <div ref={answerRef} className="bg-richblack-900 border border-purple-700/40 rounded-xl p-3 mb-1">
                {/* User question */}
                <div className="flex justify-end mb-2">
                  <div className="bg-purple-600/30 border border-purple-600/40 rounded-xl rounded-br-sm px-3 py-1.5 max-w-[85%]">
                    <p className="text-purple-200 text-xs leading-snug">{activeQuery}</p>
                  </div>
                </div>
                {/* Agent answer */}
                <div className="flex items-start gap-2">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shrink-0 mt-0.5">
                    <FaRobot className="text-white text-xs" />
                  </div>
                  <div className="bg-richblack-700 border border-richblack-600 rounded-xl rounded-bl-sm px-3 py-2 max-w-[88%]">
                    <p className="text-richblack-100 text-xs leading-relaxed">
                      {typedAnswer}
                      {isTyping && (
                        <span className="inline-block w-0.5 h-3.5 bg-purple-400 ml-0.5 animate-pulse align-middle rounded-full" />
                      )}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Category List */}
            {filteredCategories.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-4xl mb-2">🔍</p>
                <p className="text-richblack-400 text-sm">No tasks found for</p>
                <p className="text-richblack-300 text-sm font-medium">"{search}"</p>
              </div>
            ) : (
              filteredCategories.map((cat) => {
                const isExpanded = expandedCategories[cat.id] !== false;
                return (
                  <div
                    key={cat.id}
                    className="bg-richblack-700 border border-richblack-600 rounded-xl overflow-hidden"
                  >
                    {/* Category Header */}
                    <button
                      onClick={() => toggleCategory(cat.id)}
                      className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-richblack-600 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-base">{cat.icon}</span>
                        <span className="text-white text-sm font-semibold">{cat.category}</span>
                        <span className="text-xs text-richblack-400 bg-richblack-600 px-1.5 py-0.5 rounded-full">
                          {cat.tasks.length}
                        </span>
                      </div>
                      {isExpanded ? (
                        <MdKeyboardArrowUp className="text-richblack-400 text-lg shrink-0" />
                      ) : (
                        <MdKeyboardArrowDown className="text-richblack-400 text-lg shrink-0" />
                      )}
                    </button>

                    {/* Tasks */}
                    {isExpanded && (
                      <div className="border-t border-richblack-600 divide-y divide-richblack-600/50">
                        {cat.tasks.map((task) => (
                          <button
                            key={task.id}
                            onClick={() => handleTaskClick(task)}
                            className={`w-full text-left px-3 py-2 text-xs leading-snug transition-all duration-150 ${
                              activeQuery === task.query
                                ? 'bg-purple-900/30 text-purple-200 border-l-2 border-purple-500'
                                : 'text-richblack-200 hover:bg-purple-900/20 hover:text-white'
                            }`}
                          >
                            {task.query}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-2.5 border-t border-richblack-600 bg-richblack-800/80 shrink-0">
            <p className="text-xs text-richblack-500 text-center">
              {isTyping ? (
                <span className="text-purple-400 flex items-center justify-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  <span>Agent is typing...</span>
                </span>
              ) : (
                '🤖 Click any task to get an instant answer'
              )}
            </p>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <div className="relative group">
        <button
          onClick={() => setOpen((prev) => !prev)}
          className={`w-14 h-14 flex items-center justify-center rounded-full transition-all duration-300 shadow-xl hover:scale-110 ${
            open
              ? 'bg-gradient-to-r from-purple-400 to-pink-400 shadow-purple-500/40'
              : 'bg-gradient-to-r from-purple-500 to-pink-500 shadow-purple-500/30'
          }`}
        >
          {open ? (
            <FaTimes className="text-xl text-white" />
          ) : (
            <FaRobot className="text-2xl text-white" />
          )}
        </button>

        {/* Tooltip — only when closed */}
        {!open && (
          <div className="invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-200 absolute bottom-full right-0 mb-3 pointer-events-none">
            <div className="bg-richblack-700 border border-richblack-500 rounded-lg px-4 py-2 shadow-xl whitespace-nowrap">
              <p className="text-sm text-white font-semibold">AI Movie Agent</p>
              <p className="text-xs text-richblack-400">Click to explore tasks</p>
              <div className="absolute top-full right-5 -mt-1 border-4 border-transparent border-t-richblack-700" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIAgent;
