import { useState, useEffect } from 'react';
import { FaArrowUp } from 'react-icons/fa';

const ScrollToTop = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollUp = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  if (!visible) return null;

  return (
    <div className="fixed bottom-8 left-8 z-50 group">
      {/* Tooltip */}
      <div className="invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-200 absolute bottom-full left-0 mb-3 pointer-events-none">
        <div className="bg-richblack-700 border border-richblack-500 rounded-lg px-4 py-2 shadow-xl whitespace-nowrap">
          <p className="text-sm text-white font-semibold">Scroll to Top</p>
          <div className="absolute top-full left-5 -mt-1 border-4 border-transparent border-t-richblack-700" />
        </div>
      </div>

      <button
        onClick={scrollUp}
        className="w-14 h-14 flex items-center justify-center rounded-full bg-gradient-to-br from-yellow-400 via-yellow-500 to-orange-400 shadow-xl shadow-yellow-500/30 hover:scale-110 transition-all duration-300"
      >
        <FaArrowUp className="text-richblack-900 text-xl group-hover:-translate-y-0.5 transition-transform duration-200" />
      </button>
    </div>
  );
};

export default ScrollToTop;
