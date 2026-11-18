import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Facebook, Instagram, Youtube, Mail, ShieldCheck, ArrowUpRight } from 'lucide-react';
import { RESORT_SOCIAL, RESORT_EMAIL } from '../data/contact';

interface HeroSectionProps {
  onExploreClick?: () => void;
  onAdmin?: () => void;
}

interface HeroSlide {
  src: string;
  title: string;
  subtitle: string;
}

const SLIDES: HeroSlide[] = [
  { src: '/images/funcituy_rooms.JPG', title: 'Our Rooms', subtitle: 'Lovedale, Ooty' },
  { src: '/images/funcity_couple_room.JPG', title: 'Couple Room', subtitle: 'Cozy stay for two' },
  { src: '/images/funcity_couple_room_resteoom.JPG', title: 'Private Restroom', subtitle: 'Clean & modern' },
  { src: '/images/funcity_family_bedroom.JPG', title: 'Family Room', subtitle: 'Space for everyone' },
];

const INTERVAL_MS = 3000;
const SCRIPT_FONT = { fontFamily: "'Lobster', cursive" };

/** Horizontal offset (px) so the thumbnails sit on an arc bulging to the right. */
const arcOffset = (i: number, n: number) => {
  const mid = (n - 1) / 2;
  return -Math.pow(i - mid, 2) * 34;
};

export const HeroSection: React.FC<HeroSectionProps> = ({ onExploreClick, onAdmin }) => {
  const [active, setActive] = useState(0);
  const timerRef = useRef<number | null>(null);

  const startTimer = useCallback(() => {
    if (timerRef.current) window.clearInterval(timerRef.current);
    timerRef.current = window.setInterval(
      () => setActive((a) => (a + 1) % SLIDES.length),
      INTERVAL_MS,
    );
  }, []);

  useEffect(() => {
    startTimer();
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [startTimer]);

  const select = (i: number) => {
    setActive(i);
    startTimer(); // restart the 3s countdown after a manual pick
  };

  return (
    <section className="relative w-full h-[100svh] min-h-[600px] max-h-[960px] overflow-hidden bg-black">
      {/* Background: the selected image, cross-fading */}
      <div className="absolute inset-0 z-0">
        {SLIDES.map((s, i) => (
          <img
            key={s.src}
            src={s.src}
            alt={s.title}
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-[1200ms] ease-out ${
              i === active ? 'opacity-100 scale-105' : 'opacity-0 scale-100'
            }`}
            loading={i === 0 ? 'eager' : 'lazy'}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/30 to-black/10 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/40 pointer-events-none" />
      </div>

      <div className="relative z-20 h-full max-w-[1280px] mx-auto px-5 md:px-12 flex items-center">
        {/* Left copy */}
        <div className="max-w-xl text-white pt-20 md:pt-0 pb-40 md:pb-0">
          <div className="inline-flex items-center gap-3 pl-1.5 pr-5 py-1.5 rounded-full border border-white/35 bg-white/10 backdrop-blur-md">
            <span className="bg-white text-[#1c1c17] text-xs md:text-sm font-semibold px-4 py-1.5 rounded-full">
              New
            </span>
            <span className="text-sm md:text-base text-white/95">Stay Beyond Expectations</span>
          </div>

          <h1
            style={SCRIPT_FONT}
            className="mt-6 text-4xl sm:text-5xl md:text-6xl leading-tight text-white drop-shadow-[0_2px_24px_rgba(0,0,0,0.45)]"
          >
            A Calm Base in the Hills
          </h1>

          <p className="mt-4 text-white/90 text-sm md:text-lg leading-relaxed">
            Comfortable Couple &amp; Family rooms at Fun City Resorts, moments from Love Dale
            Junction. Wake up to misty Ooty mornings and make every moment count.
          </p>

          <button
            onClick={onExploreClick}
            className="mt-7 inline-flex items-center gap-3 px-7 py-3.5 rounded-full border border-white/40 bg-white/15 backdrop-blur-md text-white font-medium text-base md:text-lg hover:bg-white/25 hover:scale-[1.03] active:scale-95 transition-all"
          >
            Explore Rooms
            <ArrowUpRight className="w-5 h-5" />
          </button>

          {/* Social row */}
          <div className="mt-8 flex items-center gap-2.5">
            <RailLink href={RESORT_SOCIAL.facebook} label="Facebook">
              <Facebook className="w-4 h-4" />
            </RailLink>
            <RailLink href={RESORT_SOCIAL.instagram} label="Instagram">
              <Instagram className="w-4 h-4" />
            </RailLink>
            <RailLink href={RESORT_SOCIAL.youtube} label="YouTube">
              <Youtube className="w-4 h-4" />
            </RailLink>
            <RailLink href={`mailto:${RESORT_EMAIL}`} label="Email us" external={false}>
              <Mail className="w-4 h-4" />
            </RailLink>
            {onAdmin && (
              <button onClick={onAdmin} aria-label="Admin login" className={RAIL_CLASS}>
                <ShieldCheck className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Right: round thumbnails on an arc (desktop) */}
        <div className="hidden md:flex absolute right-20 lg:right-28 top-1/2 -translate-y-1/2 flex-col gap-5 items-end">
          {SLIDES.map((s, i) => {
            const isActive = i === active;
            return (
              <button
                key={s.src}
                onClick={() => select(i)}
                aria-label={`Show ${s.title}`}
                aria-pressed={isActive}
                className="group flex items-center gap-4 text-right transition-transform duration-500"
                style={{ transform: `translateX(${arcOffset(i, SLIDES.length)}px)` }}
              >
                <span
                  className={`transition-opacity duration-500 ${
                    isActive ? 'opacity-0' : 'opacity-100'
                  }`}
                >
                  <span style={SCRIPT_FONT} className="block text-xl lg:text-2xl text-white drop-shadow-md">
                    {s.title}
                  </span>
                  <span className="block text-sm text-white/90 drop-shadow">{s.subtitle}</span>
                </span>
                <span
                  className={`relative block rounded-full overflow-hidden shrink-0 transition-all duration-500 shadow-[0_12px_30px_rgba(0,0,0,0.35)] ${
                    isActive
                      ? 'w-36 h-36 lg:w-40 lg:h-40 ring-[6px] ring-white/35 ring-offset-0'
                      : 'w-28 h-28 lg:w-32 lg:h-32 ring-2 ring-white/60 group-hover:scale-105'
                  }`}
                >
                  <img src={s.src} alt="" className="w-full h-full object-cover" />
                </span>
              </button>
            );
          })}
        </div>

        {/* Progress dots (desktop) */}
        <div className="hidden md:flex absolute right-5 lg:right-8 top-1/2 -translate-y-1/2 flex-col gap-3">
          {SLIDES.map((s, i) => (
            <button
              key={s.src}
              onClick={() => select(i)}
              aria-label={`Go to ${s.title}`}
              className={`w-3 h-3 rounded-full transition-all ${
                i === active ? 'bg-white scale-110' : 'bg-white/40 hover:bg-white/70'
              }`}
            />
          ))}
        </div>

        {/* Mobile: thumbnail strip */}
        <div className="md:hidden absolute left-0 right-0 bottom-20 px-5 flex justify-center gap-3">
          {SLIDES.map((s, i) => {
            const isActive = i === active;
            return (
              <button
                key={s.src}
                onClick={() => select(i)}
                aria-label={`Show ${s.title}`}
                className="flex flex-col items-center gap-1.5"
              >
                <span
                  className={`block rounded-full overflow-hidden transition-all duration-500 ${
                    isActive ? 'w-16 h-16 ring-4 ring-white/50' : 'w-14 h-14 ring-2 ring-white/50 opacity-80'
                  }`}
                >
                  <img src={s.src} alt="" className="w-full h-full object-cover" />
                </span>
                <span style={SCRIPT_FONT} className="text-[11px] text-white drop-shadow">
                  {s.title}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Wave divider */}
      <div className="absolute bottom-0 left-0 right-0 z-10 leading-none pointer-events-none translate-y-[1px]">
        <svg
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
          className="block w-full h-[50px] sm:h-[70px] md:h-[90px]"
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

const RAIL_CLASS =
  'w-9 h-9 rounded-full flex items-center justify-center text-white bg-white/10 hover:bg-white/25 border border-white/25 backdrop-blur-md transition-all hover:scale-110 active:scale-95';

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
    className={RAIL_CLASS}
  >
    {children}
  </a>
);
