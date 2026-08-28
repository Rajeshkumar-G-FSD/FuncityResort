import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Compass } from 'lucide-react';

interface HeroSectionProps {
  onExploreClick?: () => void;
}

const HERO_SLIDES = [
  {
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDCLybys6b_-UAnkh_7QVzrH6PVBpV8ambA4-liXp_wK-H2oRH4Icvhimvv0IFTVOb_W-SMo3-LagMqLFRvxS3zy5kB0lV5zAqjvSayOTqW0YtA7jt2FcNF6lWLm-5_fD-zy8qTd1neilk-2hK_YKSFA2F3oZIzFhLaZPqSGKJsH9vXQBUj7N6GlpLD_AevdkdF-d0FQFGYwPS8oSoV_Dqq5DMUue7HVw1MMqwFs3oRsbQDVb0E1-4oCsq0g0wKeyQ6Q8c',
    alt: 'Pristine beach resort with sunbeds, palm trees, and crystal azure ocean waters in Baku',
    caption: 'Baku Shores Beachfront',
  },
  {
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuACqWFcttmHbbOba6mepMsgCof1MywUHwXbQkoo0T5byjgJoRt-CazQ3_qknlpobHGZeswXcEIX7i78rEpa90TacJod5DI8bYI_skgU_Qtl0RQ4x7EnYuGBmbmAEMN2l1h6AbYSBujGFP2rufjGXoWXYPyUwXEST-XonD2DNDXZiDJXNzoKIwG8wZci9fL3jIP1SoC0PEy6H1qLJm31gjlsNlhxW1udc5cF0b1iNRI7A2moUyiNIcvtnw',
    alt: 'Panoramic coastal sunrise over private overwater resort bungalows',
    caption: 'Azure Lagoon Horizon',
  },
  {
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuD5fjtbXkchaFikCsFWPbNx30q7Mj_ziZ1X7eaQXxFGw2fgh7ji57RQwyDtNFQCC9pP6wQEZ-Ll3TARCzWcRUoF-2gse0m4OgNLl4tZckLXeKPYJEs5R3N_1O0pe94dN4Wg-JvD491mV8TU94NDaVgp-Xf8ooqAMhvPxG_ACd4CjE4OnQO6dfuSXmTnKDbXJn_oXs9DQInjP9CHBWxmO0oFsJDa3uhs7ABRSF_wtqo5ES6dWeoGACr73g',
    alt: 'Private ocean balcony overlooking turquoise sea',
    caption: 'Oceanfront Sunset Retreat',
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
    <section className="relative w-full h-[75vh] min-h-[480px] max-h-[780px] flex items-center justify-center overflow-hidden">
      {/* Background Image Carousel (Pure visuals - text removed as requested) */}
      <div className="absolute inset-0 z-0">
        {HERO_SLIDES.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
            }`}
          >
            <img
              src={slide.image}
              alt={slide.alt}
              className="w-full h-full object-cover object-center transform transition-transform duration-[4000ms]"
            />
            {/* Subtle atmospheric vignette gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/30 pointer-events-none" />
          </div>
        ))}
      </div>

      {/* Carousel Navigation Controls */}
      <button
        onClick={prevSlide}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 w-11 h-11 md:w-13 md:h-13 rounded-full bg-white/20 hover:bg-white/40 text-white backdrop-blur-md flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 shadow-md focus:outline-none cursor-pointer"
        aria-label="Previous Resort View"
      >
        <ChevronLeft className="w-6 h-6 md:w-7 md:h-7" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 w-11 h-11 md:w-13 md:h-13 rounded-full bg-white/20 hover:bg-white/40 text-white backdrop-blur-md flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 shadow-md focus:outline-none cursor-pointer"
        aria-label="Next Resort View"
      >
        <ChevronRight className="w-6 h-6 md:w-7 md:h-7" />
      </button>

      {/* Floating subtle location & slide indicator (Clean, non-intrusive) */}
      <div className="absolute bottom-28 md:bottom-32 z-20 flex items-center gap-3 bg-black/25 backdrop-blur-md text-white/90 px-4 py-1.5 rounded-full text-xs font-medium border border-white/15">
        <Compass className="w-3.5 h-3.5 text-[#35BFD0]" />
        <span>{HERO_SLIDES[currentSlide].caption}</span>
        <span className="w-1 h-1 rounded-full bg-white/40" />
        <div className="flex gap-1.5">
          {HERO_SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`h-1.5 rounded-full transition-all cursor-pointer ${
                i === currentSlide ? 'w-4 bg-white' : 'w-1.5 bg-white/40'
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Organic Wave Divider at bottom of Hero (Seamless transition to soft beach cream surface) */}
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
