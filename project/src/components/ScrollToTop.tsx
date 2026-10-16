import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ArrowUp } from 'lucide-react';

const ScrollToTop: React.FC = () => {
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // 1. Automatically scroll to top on every route change across the entire application
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [location.pathname, location.search]);

  // 2. Track scroll position and calculate percentage progress
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;

      // Show floating button when user scrolls down more than 220px
      if (scrollY > 220) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }

      // Calculate 0 to 100 percentage progress
      if (scrollHeight > 0) {
        const progress = (scrollY / scrollHeight) * 100;
        setScrollProgress(Math.min(100, Math.max(0, progress)));
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Smooth scroll back to top handler
  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
    document.documentElement.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
    document.body.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  };

  // Keep fullscreen Relaxation Room completely clean and unencumbered
  if (location.pathname === '/relaxation') {
    return null;
  }

  // SVG circular progress calculation
  // Radius: 20px, Circumference = 2 * PI * 20 ≈ 125.66px
  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (scrollProgress / 100) * circumference;

  return (
    <div
      className={`fixed bottom-6 right-6 z-40 transition-all duration-300 ease-out ${
        isVisible
          ? 'opacity-100 translate-y-0 pointer-events-auto'
          : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
    >
      <button
        type="button"
        onClick={handleScrollToTop}
        aria-label="Scroll to top of page"
        title="Scroll to top"
        className="group relative w-12 h-12 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200/90 dark:border-slate-800 shadow-[0_8px_24px_rgba(0,0,0,0.12)] hover:shadow-[0_12px_32px_rgba(20,184,166,0.25)] hover:border-teal-500/50 dark:hover:border-teal-500/50 flex items-center justify-center cursor-pointer transition-all duration-200 active:scale-95"
      >
        {/* Circular Progress Ring */}
        <svg
          className="absolute inset-0 w-12 h-12 -rotate-90 pointer-events-none p-1"
          viewBox="0 0 48 48"
        >
          {/* Subtle track background */}
          <circle
            cx="24"
            cy="24"
            r={radius}
            className="text-slate-200/60 dark:text-slate-800 stroke-current"
            strokeWidth="2.5"
            fill="transparent"
          />
          {/* Active Progress Line */}
          <circle
            cx="24"
            cy="24"
            r={radius}
            className="text-teal-500 stroke-current transition-[stroke-dashoffset] duration-150"
            strokeWidth="2.5"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
          />
        </svg>

        {/* Arrow Icon */}
        <div className="relative z-10 w-6 h-6 flex items-center justify-center">
          <ArrowUp className="w-4 h-4 text-slate-700 dark:text-slate-200 group-hover:text-teal-600 dark:group-hover:text-teal-400 group-hover:-translate-y-0.5 transition-transform duration-200 stroke-[2.4]" />
        </div>

        {/* Hover Tooltip Pill */}
        <span className="absolute -top-9 right-1/2 translate-x-1/2 px-2.5 py-1 rounded-lg bg-slate-900/95 dark:bg-white/95 text-white dark:text-slate-900 text-[10px] font-bold tracking-wide opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap shadow-md">
          Back to top
        </span>
      </button>
    </div>
  );
};

export default ScrollToTop;
