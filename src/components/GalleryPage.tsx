import React, { useState } from 'react';
import { ArrowLeft, MousePointer2, X, ChevronLeft, ChevronRight } from 'lucide-react';
import CircularGallery from './CircularGallery';
import BlurText from './BlurText';
import SplitText from './SplitText';
import { GALLERY_IMAGES } from '../data/gallery';
import { RESORT_NAME, RESORT_ADDRESS } from '../data/contact';

interface GalleryPageProps {
  onBack: () => void;
}

export const GalleryPage: React.FC<GalleryPageProps> = ({ onBack }) => {
  const [lightbox, setLightbox] = useState<number | null>(null);

  const show = (i: number) => setLightbox(((i % GALLERY_IMAGES.length) + GALLERY_IMAGES.length) % GALLERY_IMAGES.length);

  return (
    <div className="bg-[#fcf9f1] min-h-screen">
      {/* Header */}
      <section className="pt-24 md:pt-28 pb-6 px-4 md:px-12 max-w-[1280px] mx-auto">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-[#3f484e] hover:text-[#087ea4] text-sm font-semibold mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </button>
        <span className="text-xs font-bold uppercase tracking-[0.22em] text-[#a6893f]">
          {RESORT_NAME}
        </span>
        <BlurText
          as="h1"
          text="Resort Gallery"
          className="text-3xl md:text-5xl font-extrabold tracking-tight text-[#1c1c17] mt-2"
        />
        <div className="w-20 h-2 bg-[#35BFD0] rounded-full mt-3" />
        <SplitText
          tag="p"
          splitType="words"
          delay={14}
          duration={0.55}
          from={{ opacity: 0, y: 14 }}
          to={{ opacity: 1, y: 0 }}
          textAlign="left"
          text="A look inside Fun City Resorts, Lovedale — reception, rooms, bathrooms, the family dining area and parking. Drag, scroll or use the arrow keys to spin through."
          className="max-w-xl text-[#3f484e] text-sm md:text-base mt-4 leading-relaxed"
        />
      </section>

      {/* Circular WebGL gallery */}
      <div className="relative h-[420px] sm:h-[520px] md:h-[600px] w-full">
        <CircularGallery
          items={GALLERY_IMAGES}
          bend={2.5}
          textColor="#ffffff"
          borderRadius={0.06}
          scrollEase={0.05}
          scrollSpeed={2}
          font="bold 26px Figtree"
        />
      </div>

      <p className="flex items-center justify-center gap-2 text-xs text-[#8a7f66] mt-3">
        <MousePointer2 className="w-3.5 h-3.5" />
        Drag or scroll to explore
      </p>

      {/* Full grid of every photo */}
      <section className="px-4 md:px-12 max-w-[1280px] mx-auto py-12 md:py-16">
        <h2 className="text-xs font-bold uppercase tracking-wider text-[#6f787e] mb-5">
          All photos ({GALLERY_IMAGES.length})
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {GALLERY_IMAGES.map((g, i) => (
            <button
              key={g.image}
              onClick={() => setLightbox(i)}
              className="group relative overflow-hidden rounded-2xl border border-[#e5e2db] bg-white sunlight-shadow"
            >
              <img
                src={g.image}
                alt={g.text}
                loading="lazy"
                className="w-full h-40 sm:h-48 object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent text-white text-[11px] font-semibold px-3 py-2 text-left">
                {g.text}
              </span>
            </button>
          ))}
        </div>
        <p className="flex items-start gap-1.5 text-xs text-[#8a7f66] mt-6">
          {RESORT_ADDRESS}
        </p>
      </section>

      {/* Lightbox */}
      {lightbox !== null && (
        <div
          className="fixed inset-0 z-[60] bg-black/85 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <button
            onClick={() => setLightbox(null)}
            className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/15 hover:bg-white/30 text-white flex items-center justify-center"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); show(lightbox - 1); }}
            className="absolute left-3 md:left-8 text-white/80 hover:text-white"
            aria-label="Previous"
          >
            <ChevronLeft className="w-10 h-10" strokeWidth={1.5} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); show(lightbox + 1); }}
            className="absolute right-3 md:right-8 text-white/80 hover:text-white"
            aria-label="Next"
          >
            <ChevronRight className="w-10 h-10" strokeWidth={1.5} />
          </button>
          <figure className="max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
            <img
              src={GALLERY_IMAGES[lightbox].image}
              alt={GALLERY_IMAGES[lightbox].text}
              className="w-full max-h-[80vh] object-contain rounded-xl"
            />
            <figcaption className="text-center text-white/80 text-sm mt-3">
              {GALLERY_IMAGES[lightbox].text} — {lightbox + 1} / {GALLERY_IMAGES.length}
            </figcaption>
          </figure>
        </div>
      )}
    </div>
  );
};
