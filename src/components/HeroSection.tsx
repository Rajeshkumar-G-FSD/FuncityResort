import React, { useEffect, useState } from 'react';
import { Facebook, Instagram, Youtube, Mail, ShieldCheck } from 'lucide-react';
import { RESORT_SOCIAL, RESORT_EMAIL } from '../data/contact';
import BlurText from './BlurText';
import SplitText from './SplitText';

interface HeroSectionProps {
  onExploreClick?: () => void;
  onAdmin?: () => void;
}

const HERO_VIDEO = '/images/funcity_ooty_fog.mp4';
const HERO_POSTER = '/images/funcity.png';

export const HeroSection: React.FC<HeroSectionProps> = ({ onExploreClick, onAdmin }) => {
  const [railVisible, setRailVisible] = useState(true);

  useEffect(() => {
    const onScroll = () => setRailVisible(window.scrollY < window.innerHeight * 0.75);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <section className="relative w-full h-[92vh] min-h-[560px] max-h-[900px] flex items-end justify-center overflow-hidden">
      {/* Looping background video */}
      <div className="absolute inset-0 z-0 bg-black">
        <video
          className="w-full h-full object-cover object-center"
          src={HERO_VIDEO}
          poster={HERO_POSTER}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/15 to-black/55 pointer-events-none" />
      </div>

      {/* Copy */}
      <div className="relative z-20 max-w-3xl px-6 pb-24 md:pb-32 text-center text-white">
        <span className="text-[11px] font-bold uppercase tracking-[0.28em] text-white/80">
          Fun City Resorts · Lovedale, Ooty
        </span>
        <BlurText
          as="h1"
          text="A calm base in the hills"
          delay={200}
          animateBy="words"
          direction="top"
          className="text-4xl md:text-6xl font-extrabold tracking-tight mt-3 text-white drop-shadow-[0_2px_24px_rgba(0,0,0,0.4)] justify-center"
        />
        <SplitText
          tag="p"
          splitType="words"
          delay={20}
          duration={0.6}
          from={{ opacity: 0, y: 16 }}
          to={{ opacity: 1, y: 0 }}
          textAlign="center"
          rootMargin="0px"
          text="Comfortable Couple & Family rooms, moments from Love Dale Junction."
          className="text-white/85 text-sm md:text-lg mt-3"
        />
        <button
          onClick={onExploreClick}
          className="mt-6 bg-white text-[#1c1c17] font-bold text-sm px-8 py-3.5 rounded-full hover:scale-105 active:scale-95 transition-transform"
        >
          View Rooms
        </button>
      </div>

      {/* Right-side glass social rail */}
      <div
        className={`absolute right-3 md:right-6 top-1/2 -translate-y-1/2 z-30 flex flex-col items-center gap-2.5 md:gap-3 transition-opacity duration-300 ${
          railVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <RailLink href={RESORT_SOCIAL.facebook} label="Facebook">
          <Facebook className="w-4 h-4 md:w-[18px] md:h-[18px]" />
        </RailLink>
        <RailLink href={RESORT_SOCIAL.instagram} label="Instagram">
          <Instagram className="w-4 h-4 md:w-[18px] md:h-[18px]" />
        </RailLink>
        <RailLink href={RESORT_SOCIAL.youtube} label="YouTube">
          <Youtube className="w-4 h-4 md:w-[18px] md:h-[18px]" />
        </RailLink>
        <RailLink href={`mailto:${RESORT_EMAIL}`} label="Email us" external={false}>
          <Mail className="w-4 h-4 md:w-[18px] md:h-[18px]" />
        </RailLink>
        {onAdmin && (
          <button
            onClick={onAdmin}
            aria-label="Admin login"
            className="w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center text-white bg-white/10 hover:bg-white/25 border border-white/20 backdrop-blur-md transition-all hover:scale-110 active:scale-95"
          >
            <ShieldCheck className="w-4 h-4 md:w-[18px] md:h-[18px]" />
          </button>
        )}
        <span className="w-px h-8 bg-white/25 mt-1" />
      </div>

      {/* Wave divider */}
      <div className="absolute bottom-0 left-0 right-0 z-10 leading-none pointer-events-none translate-y-[1px]">
        <svg
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
          className="block w-full h-[70px] sm:h-[90px] md:h-[120px]"
        >
          <path
            fill="#fcf9f1"
            d="M0,120 V54 C160,110 320,10 520,40 C700,68 820,120 1000,96 C1160,74 1300,20 1440,52 V120 Z"
          />
        </svg>
      </div>
    </section>
  );
};

const RailLink: React.FC<{
  href: string;
  label: string;
  external?: boolean;
  children: React.ReactNode;
}> = ({ href, label, external = true, children }) => (
  <a
    href={href}
    aria-label={label}
    {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    className="w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center text-white bg-white/10 hover:bg-white/25 border border-white/20 backdrop-blur-md transition-all hover:scale-110 active:scale-95"
  >
    {children}
  </a>
);
