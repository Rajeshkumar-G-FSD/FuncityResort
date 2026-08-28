import React, { useEffect, useState } from 'react';

/**
 * Minimal right-side "SCROLL TO TOP" affordance that fades in once the page
 * has been scrolled down, and smooth-scrolls back to the top on click.
 */
export const ScrollToTop: React.FC = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 500);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Scroll to top"
      className={`group fixed right-3 md:right-5 bottom-24 md:bottom-28 z-40 flex flex-col items-center gap-3 transition-all duration-500 ${
        show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6 pointer-events-none'
      }`}
    >
      <span className="text-[10px] font-bold tracking-[0.28em] text-[#8a8677] group-hover:text-[#1c1c17] transition-colors [writing-mode:vertical-rl] rotate-180 select-none">
        SCROLL&nbsp;TO&nbsp;TOP
      </span>
      <span className="relative w-px h-16 bg-[#d8cfbd] overflow-hidden rounded-full">
        <span className="absolute inset-x-0 top-0 h-5 bg-[#087ea4] rounded-full animate-[scrollTick_1.8s_ease-in-out_infinite]" />
      </span>
    </button>
  );
};
