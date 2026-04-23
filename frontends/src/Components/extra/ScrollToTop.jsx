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
    <button
      onClick={scrollUp}
      title="Scroll to top"
      className="fixed bottom-8 left-8 z-50 w-14 h-14 flex items-center justify-center rounded-full bg-gradient-to-br from-yellow-400 via-yellow-500 to-orange-400 shadow-xl shadow-yellow-500/30 hover:scale-110 transition-all duration-300 group"
    >
      <FaArrowUp className="text-richblack-900 text-xl group-hover:-translate-y-0.5 transition-transform duration-200" />
    </button>
  );
};

export default ScrollToTop;
