import { useState, useRef, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaRobot, FaTimes, FaPaperPlane, FaFilm } from 'react-icons/fa';
import { parseCommand, FLOW_FIELDS, FIELD_PROMPTS } from '../../utils/botCommandParser';
import {
  botSendOtp,
  botLogin,
  botLogout,
  botCreateViewer,
  botCreateOrganizer,
  botCreateTheatre,
  botSearch,
} from '../../Services/operations/BotActions';

// ── Welcome text shown when bot opens ────────────────────────────────────────
const WELCOME =
  `Hi! I'm the Cine Circuit Bot 🤖\n\nI can help you:\n• Login / Logout\n• Send OTP to an email\n• Create Viewer / Organizer / Theatre accounts\n• Search movies\n\nType a command or just describe what you want.\nExamples:\n  login email abc@x.com password Test@123\n  send otp abc@x.com\n  create viewer name John email j@x.com password Pass@1 phone 9876543210 otp 123456\n  search Pathaan`;

// ── Small spinner ─────────────────────────────────────────────────────────────
const Spinner = () => (
  <span className="inline-block w-3 h-3 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin align-middle ml-1" />
);

// ── Single chat bubble ────────────────────────────────────────────────────────
const Bubble = ({ msg }) => {
  const isUser = msg.role === 'user';
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'items-start gap-2'} mb-2`}>
      {!isUser && (
        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shrink-0 mt-0.5">
          <FaRobot className="text-richblack-900 text-xs" />
        </div>
      )}
      <div
        className={`max-w-[85%] rounded-xl px-3 py-2 text-xs leading-relaxed whitespace-pre-wrap ${
          isUser
            ? 'bg-yellow-500/20 border border-yellow-500/30 text-yellow-100 rounded-br-sm'
            : 'bg-richblack-700 border border-richblack-600 text-richblack-100 rounded-bl-sm'
        }`}
      >
        {msg.loading ? (
          <span className="text-richblack-400 animate-pulse">Thinking<Spinner /></span>
        ) : (
          <>
            {msg.text}
            {/* Movie search results */}
            {msg.movies && msg.movies.length > 0 && (
              <div className="mt-2 flex flex-col gap-1.5">
                {msg.movies.map((m) => (
                  <div
                    key={m._id}
                    className="flex items-center gap-2 bg-richblack-800 border border-richblack-600 rounded-lg px-2 py-1.5"
                  >
                    {m.Posterurl ? (
                      <img
                        src={m.Posterurl}
                        alt={m.title}
                        className="w-7 h-9 object-cover rounded shrink-0 border border-richblack-500"
                      />
                    ) : (
                      <div className="w-7 h-9 bg-richblack-600 rounded shrink-0 flex items-center justify-center">
                        <FaFilm className="text-richblack-400 text-xs" />
                      </div>
                    )}
                    <span className="text-white text-xs font-medium truncate">{m.title}</span>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
export default function BotChat({ onClose, onBack }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);

  // Guided-flow state — when a command needs more fields
  const [pendingIntent, setPendingIntent] = useState(null);   // e.g. 'create_viewer'
  const [collectedData, setCollectedData] = useState({});     // fields gathered so far
  const [remainingFields, setRemainingFields] = useState([]); // fields still needed

  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  // ── Scroll to bottom whenever messages change ─────────────────────────────
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // ── Seed welcome message and focus on mount ───────────────────────────────
  useEffect(() => {
    if (messages.length === 0) {
      pushBot(WELCOME);
    }
    setTimeout(() => inputRef.current?.focus(), 100);
  }, []);

  // ── Helpers ───────────────────────────────────────────────────────────────
  const pushBot = (text, extra = {}) => {
    setMessages((prev) => [...prev, { role: 'bot', text, ...extra }]);
  };

  const pushUser = (text) => {
    setMessages((prev) => [...prev, { role: 'user', text }]);
  };

  const pushLoading = () => {
    const id = Date.now();
    setMessages((prev) => [...prev, { role: 'bot', text: '', loading: true, id }]);
    return id;
  };

  const resolveLoading = (id, text, extra = {}) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, loading: false, text, ...extra } : m))
    );
  };

  // ── Execute a fully-collected intent ─────────────────────────────────────
  const executeIntent = async (intent, data) => {
    const loadId = pushLoading();
    setBusy(true);
    let result;

    try {
      if (intent === 'logout') {
        result = botLogout(dispatch);
      } else if (intent === 'send_otp') {
        result = await botSendOtp(data.email);
      } else if (intent === 'login') {
        result = await botLogin(data.email, data.password, dispatch, navigate);
      } else if (intent === 'create_viewer') {
        result = await botCreateViewer(data.name, data.email, data.password, data.phone, data.otp, data.countrycode);
      } else if (intent === 'create_organizer') {
        result = await botCreateOrganizer(data.name, data.email, data.password, data.phone, data.otp, data.countrycode);
      } else if (intent === 'create_theatre') {
        result = await botCreateTheatre(data.name, data.email, data.password);
      } else if (intent === 'search') {
        result = await botSearch(data.query);
      } else {
        result = { success: false, message: 'Unknown command.' };
      }
    } catch (e) {
      result = { success: false, message: 'Something went wrong. Please try again.' };
    }

    resolveLoading(
      loadId,
      result.message,
      intent === 'search' && result.movies ? { movies: result.movies } : {}
    );
    setBusy(false);
  };

  // ── Handle what the user typed ────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e?.preventDefault();
    const text = input.trim();
    if (!text || busy) return;

    pushUser(text);
    setInput('');

    // ── If we're mid guided-flow, treat input as the answer to the next field
    if (pendingIntent) {
      const field = remainingFields[0];
      const updated = { ...collectedData, [field]: text };
      const rest = remainingFields.slice(1);

      if (rest.length > 0) {
        // Still more fields needed
        setCollectedData(updated);
        setRemainingFields(rest);
        pushBot(FIELD_PROMPTS[rest[0]]);
      } else {
        // All fields collected — execute
        setPendingIntent(null);
        setCollectedData({});
        setRemainingFields([]);
        await executeIntent(pendingIntent, updated);
      }
      return;
    }

    // ── Fresh command parse ───────────────────────────────────────────────
    const { intent, data } = parseCommand(text);

    if (intent === 'unknown') {
      pushBot(
        `I didn't understand that. Try commands like:\n  login email x@x.com password Pass@1\n  send otp x@x.com\n  create viewer ...\n  search <movie name>\n  logout`
      );
      return;
    }

    // Check which required fields are missing
    const required = FLOW_FIELDS[intent] || [];
    const missing = required.filter((f) => !data[f]);

    if (missing.length === 0) {
      // All fields present — execute immediately
      await executeIntent(intent, data);
    } else {
      // Start guided flow — ask for missing fields one by one
      setPendingIntent(intent);
      setCollectedData(data);
      setRemainingFields(missing);
      pushBot(FIELD_PROMPTS[missing[0]]);
    }
  };

  // ── Handle Enter key ──────────────────────────────────────────────────────
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // ── Cancel guided flow ────────────────────────────────────────────────────
  const cancelFlow = () => {
    setPendingIntent(null);
    setCollectedData({});
    setRemainingFields([]);
    pushBot('Flow cancelled. Start a new command whenever you\'re ready.');
  };

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="absolute bottom-20 right-0 w-[360px] max-h-[70vh] flex flex-col bg-richblack-800 border border-richblack-600 rounded-2xl shadow-2xl shadow-yellow-900/20 overflow-hidden"
      style={{ animation: 'slideUpBot 0.2s ease-out' }}
    >

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 shrink-0">
        <div className="flex items-center gap-2">
          <button
            onClick={onBack}
            className="text-white/70 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10 mr-1"
            title="Back to menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
            <FaRobot className="text-white text-sm" />
          </div>
          <div>
            <p className="text-white font-bold text-sm leading-tight">Data Bot</p>
            <p className="text-yellow-100 text-xs">Account & Search Assistant</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-white/70 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/10"
        >
          <FaTimes />
        </button>
      </div>

      {/* Guided-flow bar */}
      {pendingIntent && (
        <div className="mx-3 mt-2 px-3 py-1.5 bg-yellow-900/20 border border-yellow-600/30 rounded-xl flex items-center justify-between shrink-0">
          <p className="text-yellow-300 text-xs">
            Collecting info for: <span className="font-semibold">{pendingIntent.replace('_', ' ')}</span>
            {' '}({remainingFields.length} field{remainingFields.length !== 1 ? 's' : ''} left)
          </p>
          <button
            onClick={cancelFlow}
            className="text-richblack-400 hover:text-red-400 transition-colors text-xs ml-2 shrink-0"
          >
            cancel
          </button>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1 scrollbar-thin scrollbar-thumb-richblack-600 scrollbar-track-transparent">
        {messages.map((msg, i) => (
          <Bubble key={i} msg={msg} />
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-2 px-3 py-2.5 border-t border-richblack-600 bg-richblack-800 shrink-0"
      >
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={busy}
          placeholder={
            pendingIntent
              ? FIELD_PROMPTS[remainingFields[0]] || 'Type your answer...'
              : 'Type a command...'
          }
          className="flex-1 bg-richblack-700 border border-richblack-600 focus:border-yellow-500 rounded-xl px-3 py-2 text-xs text-white outline-none placeholder:text-richblack-400 transition-colors disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={busy || !input.trim()}
          className="w-8 h-8 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center text-white disabled:opacity-40 hover:from-yellow-400 hover:to-orange-400 transition-all active:scale-95 shrink-0"
        >
          <FaPaperPlane className="text-xs" />
        </button>
      </form>

      {/* Footer hint */}
      <div className="px-4 py-1.5 border-t border-richblack-700 bg-richblack-800/80 shrink-0">
        <p className="text-xs text-richblack-500 text-center">
          Press <kbd className="text-richblack-400 bg-richblack-700 px-1 rounded text-[10px]">Enter</kbd> to send &nbsp;·&nbsp; type <span className="text-yellow-600">cancel</span> to abort flow
        </p>
      </div>

      <style>{`
        @keyframes slideUpBot {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
