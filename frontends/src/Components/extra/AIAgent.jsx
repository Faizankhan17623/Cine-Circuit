import { useState, useRef, useEffect, useCallback } from 'react';
import { FaRobot, FaTimes, FaSearch } from 'react-icons/fa';
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from 'react-icons/md';
import { IoArrowBack } from 'react-icons/io5';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { agentTasks } from '../../data/agentTasks';
import { apiConnector } from '../../Services/apiConnector';
import { Recommendation } from '../../Services/Apis/UserApi';

// Typewriter hook
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

  // Recommendation state
  const [recStep, setRecStep] = useState(null); // null | 'genre' | 'subgenre' | 'results'
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [selectedSubGenre, setSelectedSubGenre] = useState(null);
  const [recMovies, setRecMovies] = useState([]);
  const [recLoading, setRecLoading] = useState(false);

  const popupRef = useRef(null);
  const answerRef = useRef(null);
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.profile);
  const userType = user?.usertype || localStorage.getItem('userType') || null;
  const isLoggedIn = !!userType;

  const typedAnswer = useTypewriter(activeAnswer, 14);

  useEffect(() => {
    setIsTyping(typedAnswer !== activeAnswer);
  }, [typedAnswer, activeAnswer]);

  useEffect(() => {
    if ((activeAnswer || recStep) && answerRef.current) {
      answerRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [activeAnswer, recStep]);

  const visibleCategories = agentTasks.filter((cat) => {
    if (cat.roles.includes('all')) return true;
    if (!isLoggedIn) return false;
    return cat.roles.includes(userType);
  });

  const filteredCategories = visibleCategories
    .map((cat) => ({
      ...cat,
      tasks: cat.tasks.filter((t) =>
        t.query.toLowerCase().includes(search.toLowerCase())
      ),
    }))
    .filter((cat) => cat.tasks.length > 0);

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

  // ── Recommendation flow ──
  const startRecommendation = useCallback(async () => {
    setActiveAnswer('');
    setActiveQuery('Recommend me a movie 🎬');
    setRecStep('loading-genres');
    setSelectedGenre(null);
    setSelectedSubGenre(null);
    setRecMovies([]);
    try {
      const res = await apiConnector('GET', Recommendation.PublicGenres);
      if (res?.data?.success) {
        setGenres(res.data.data);
        setRecStep('genre');
      } else {
        setRecStep(null);
        setActiveAnswer('Sorry, could not load genres right now. Please try again.');
      }
    } catch {
      setRecStep(null);
      setActiveAnswer('Sorry, something went wrong. Please try again.');
    }
  }, []);

  const handleGenrePick = useCallback((genre) => {
    setSelectedGenre(genre);
    if (genre.subgeneres && genre.subgeneres.length > 0) {
      setRecStep('subgenre');
    } else {
      fetchMovies(genre._id, null);
    }
  }, []);

  const handleSubGenrePick = useCallback(async (subGenre) => {
    setSelectedSubGenre(subGenre);
    fetchMovies(selectedGenre._id, subGenre ? subGenre._id : null);
  }, [selectedGenre]);

  const fetchMovies = async (genreId, subGenreId) => {
    setRecStep('loading-results');
    setRecLoading(true);
    try {
      const res = await apiConnector('POST', Recommendation.RecommendMovies, { genreId, subGenreId });
      if (res?.data?.success && res.data.data.length > 0) {
        setRecMovies(res.data.data);
        setRecStep('results');
      } else {
        setRecStep('no-results');
      }
    } catch {
      setRecStep('no-results');
    }
    setRecLoading(false);
  };

  const resetRec = () => {
    setRecStep(null);
    setSelectedGenre(null);
    setSelectedSubGenre(null);
    setRecMovies([]);
    setActiveAnswer('');
    setActiveQuery('');
  };

  // ── Normal task click ──
  const handleTaskClick = useCallback((task) => {
    if (task.type === 'recommendation') {
      startRecommendation();
      return;
    }
    setRecStep(null);
    setActiveQuery(task.query);
    setActiveAnswer('');
    setTimeout(() => setActiveAnswer(task.answer), 80);
  }, [startRecommendation]);

  // ── Render recommendation panel ──
  const renderRecPanel = () => {
    if (!recStep) return null;

    return (
      <div ref={answerRef} className="bg-richblack-900 border border-purple-700/40 rounded-xl p-3 mb-1">
        {/* User question */}
        <div className="flex justify-end mb-2">
          <div className="bg-purple-600/30 border border-purple-600/40 rounded-xl rounded-br-sm px-3 py-1.5 max-w-[85%]">
            <p className="text-purple-200 text-xs leading-snug">Recommend me a movie 🎬</p>
          </div>
        </div>

        {/* Agent bubble */}
        <div className="flex items-start gap-2">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shrink-0 mt-0.5">
            <FaRobot className="text-white text-xs" />
          </div>

          <div className="flex-1 bg-richblack-700 border border-richblack-600 rounded-xl rounded-bl-sm px-3 py-2.5">

            {/* Loading genres */}
            {recStep === 'loading-genres' && (
              <p className="text-richblack-300 text-xs animate-pulse">Fetching genres...</p>
            )}

            {/* Genre selection */}
            {recStep === 'genre' && (
              <div>
                <p className="text-richblack-100 text-xs mb-2.5 leading-relaxed">
                  What genre are you in the mood for? 🎭
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {genres.map((g) => (
                    <button
                      key={g._id}
                      onClick={() => handleGenrePick(g)}
                      className="px-2.5 py-1 rounded-lg text-xs font-medium transition-all duration-150 bg-purple-600/20 border border-purple-500/30 text-purple-300 hover:bg-purple-600/40 hover:text-white active:scale-95"
                    >
                      {g.genreName}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Sub-genre selection */}
            {recStep === 'subgenre' && selectedGenre && (
              <div>
                <p className="text-richblack-100 text-xs mb-2.5 leading-relaxed">
                  Great choice! Pick a sub-genre for <span className="text-purple-300 font-semibold">{selectedGenre.genreName}</span>:
                </p>
                <div className="flex flex-wrap gap-1.5 mb-2.5">
                  {selectedGenre.subgeneres.map((sg) => (
                    <button
                      key={sg._id}
                      onClick={() => handleSubGenrePick(sg)}
                      className="px-2.5 py-1 rounded-lg text-xs font-medium transition-all duration-150 bg-pink-600/20 border border-pink-500/30 text-pink-300 hover:bg-pink-600/40 hover:text-white active:scale-95"
                    >
                      {sg.name}
                    </button>
                  ))}
                  <button
                    onClick={() => handleSubGenrePick(null)}
                    className="px-2.5 py-1 rounded-lg text-xs font-medium transition-all duration-150 bg-richblack-600 border border-richblack-500 text-richblack-300 hover:text-white active:scale-95"
                  >
                    Any sub-genre
                  </button>
                </div>
                <button
                  onClick={() => setRecStep('genre')}
                  className="flex items-center gap-1 text-xs text-richblack-400 hover:text-purple-400 transition-colors"
                >
                  <IoArrowBack className="text-sm" /> Back to genres
                </button>
              </div>
            )}

            {/* Loading results */}
            {(recStep === 'loading-results') && (
              <p className="text-richblack-300 text-xs animate-pulse">Finding the best movies for you...</p>
            )}

            {/* Results */}
            {recStep === 'results' && (
              <div>
                <p className="text-richblack-100 text-xs mb-2.5 leading-relaxed">
                  Here are the top picks for you 🍿
                  {selectedSubGenre && (
                    <span className="text-pink-300"> · {selectedSubGenre.name}</span>
                  )}
                  <span className="text-purple-300"> {selectedGenre?.genreName}</span>
                </p>
                <div className="flex flex-col gap-2">
                  {recMovies.map((movie) => (
                    <div
                      key={movie._id}
                      className="flex items-center justify-between gap-2 bg-richblack-800 border border-richblack-600 rounded-xl px-3 py-2 hover:border-purple-500/40 transition-colors"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        {movie.Posterurl && (
                          <img
                            src={movie.Posterurl}
                            alt={movie.title}
                            className="w-8 h-10 rounded-md object-cover shrink-0 border border-richblack-500"
                          />
                        )}
                        <p className="text-white text-xs font-medium truncate">{movie.title}</p>
                      </div>
                      <button
                        onClick={() => {
                          navigate(`/Movie/${movie._id}`);
                          setOpen(false);
                        }}
                        className="shrink-0 px-2.5 py-1 rounded-lg text-xs font-semibold bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-500 hover:to-pink-500 transition-all active:scale-95"
                      >
                        See Details
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  onClick={resetRec}
                  className="flex items-center gap-1 text-xs text-richblack-400 hover:text-purple-400 transition-colors mt-2.5"
                >
                  <IoArrowBack className="text-sm" /> Try again
                </button>
              </div>
            )}

            {/* No results */}
            {recStep === 'no-results' && (
              <div>
                <p className="text-richblack-300 text-xs mb-2">
                  😕 No movies found for that combination. Try a different genre!
                </p>
                <button
                  onClick={resetRec}
                  className="flex items-center gap-1 text-xs text-richblack-400 hover:text-purple-400 transition-colors"
                >
                  <IoArrowBack className="text-sm" /> Start over
                </button>
              </div>
            )}

          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed bottom-8 right-8 z-50" ref={popupRef}>
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
                <button onClick={() => setSearch('')} className="text-richblack-400 hover:text-white transition-colors">
                  <FaTimes className="text-xs" />
                </button>
              )}
            </div>
          </div>

          {/* Login nudge */}
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

            {/* Recommendation panel */}
            {recStep && renderRecPanel()}

            {/* Normal answer panel */}
            {!recStep && activeAnswer && (
              <div ref={answerRef} className="bg-richblack-900 border border-purple-700/40 rounded-xl p-3 mb-1">
                <div className="flex justify-end mb-2">
                  <div className="bg-purple-600/30 border border-purple-600/40 rounded-xl rounded-br-sm px-3 py-1.5 max-w-[85%]">
                    <p className="text-purple-200 text-xs leading-snug">{activeQuery}</p>
                  </div>
                </div>
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
                  <div key={cat.id} className="bg-richblack-700 border border-richblack-600 rounded-xl overflow-hidden">
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
                      {isExpanded
                        ? <MdKeyboardArrowUp className="text-richblack-400 text-lg shrink-0" />
                        : <MdKeyboardArrowDown className="text-richblack-400 text-lg shrink-0" />
                      }
                    </button>

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
              {isTyping || recStep === 'loading-genres' || recStep === 'loading-results' ? (
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
          {open ? <FaTimes className="text-xl text-white" /> : <FaRobot className="text-2xl text-white" />}
        </button>

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
