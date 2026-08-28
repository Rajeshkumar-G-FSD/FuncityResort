import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface HeroSectionProps {
  onExploreClick?: () => void;
}

const HERO_SLIDES = [
  {
    image: '/images/funcity.png',
    alt: 'Fun City Resort',
  },
];

export const HeroSection: React.FC<HeroSectionProps> = ({ onExploreClick }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? HERO_SLIDES.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === HERO_SLIDES.length - 1 ? 0 : prev + 1));
  };

  return (
    <section className="relative w-full h-[92vh] min-h-[560px] max-h-[900px] flex items-center justify-center overflow-hidden">
      {/* Background Image Carousel */}
      <div className="absolute inset-0 z-0">
        {HERO_SLIDES.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={slide.image}
              alt={slide.alt}
              className="w-full h-full object-cover object-center"
            />
            {/* Atmospheric darkening for text legibility */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/40 pointer-events-none" />
          </div>
        ))}
      </div>

      {/* Centered Hero Copy */}
      <div className="relative z-20 mx-auto max-w-3xl px-6 text-center text-white">
        {/* Hero heading and descriptive paragraph removed per request */}
      </div>

      {/* Carousel Navigation Controls - minimal chevrons */}
      {HERO_SLIDES.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-3 md:left-8 top-1/2 -translate-y-1/2 z-20 text-white/80 hover:text-white transition-all duration-300 hover:-translate-x-0.5 focus:outline-none cursor-pointer"
            aria-label="Previous Resort View"
          >
            <ChevronLeft className="w-9 h-9 md:w-12 md:h-12" strokeWidth={1.5} />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-3 md:right-8 top-1/2 -translate-y-1/2 z-20 text-white/80 hover:text-white transition-all duration-300 hover:translate-x-0.5 focus:outline-none cursor-pointer"
            aria-label="Next Resort View"
          >
            <ChevronRight className="w-9 h-9 md:w-12 md:h-12" strokeWidth={1.5} />
          </button>
        </>
      )}

      {/* Organic Wave Divider at bottom of Hero */}
      <div className="absolute bottom-0 left-0 right-0 w-full overflow-hidden leading-none z-10 pointer-events-none translate-y-[2px]">
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="relative block w-full h-[50px] md:h-[90px] text-[#fcf9f1] fill-current"
        >
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" />
        </svg>
      </div>
    </section>
  );
};
