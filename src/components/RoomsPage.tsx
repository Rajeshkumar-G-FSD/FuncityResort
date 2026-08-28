import React, { useState } from 'react';
import { ArrowLeft, X, ChevronLeft, ChevronRight, CalendarCheck, Star, MapPin } from 'lucide-react';
import { ROOM_CATEGORIES } from '../data/resortData';
import { RESORT_ADDRESS } from '../data/contact';

interface RoomsPageProps {
  onBack: () => void;
  onBook: (categoryId?: string) => void;
}

interface LightboxState {
  images: string[];
  index: number;
  title: string;
}

export const RoomsPage: React.FC<RoomsPageProps> = ({ onBack, onBook }) => {
  const [lightbox, setLightbox] = useState<LightboxState | null>(null);

  const showPrev = () =>
    setLightbox((lb) =>
      lb ? { ...lb, index: (lb.index - 1 + lb.images.length) % lb.images.length } : lb
    );
  const showNext = () =>
    setLightbox((lb) => (lb ? { ...lb, index: (lb.index + 1) % lb.images.length } : lb));

  return (
    <div className="bg-[#fcf9f1]">
      {/* ===== Hero banner ===== */}
      <section className="relative h-[52vh] min-h-[360px] max-h-[520px] w-full overflow-hidden flex items-end">
        <img
          src="/images/funcituy_rooms.JPG"
          alt="Fun City rooms"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/35 to-black/25" />

        {/* Back to Home */}
        <button
          onClick={onBack}
          className="absolute top-24 md:top-28 left-4 md:left-12 z-10 flex items-center gap-2 bg-white/90 hover:bg-white text-[#1c1c17] text-sm font-semibold px-4 py-2.5 rounded-full shadow-md backdrop-blur transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </button>

        <div className="relative z-10 max-w-[1280px] mx-auto w-full px-4 md:px-12 pb-10 md:pb-14 text-white">
          <span className="text-xs font-bold uppercase tracking-[0.22em] text-white/80">
            Fun City · Lovedale, Ooty
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mt-2">
            Rooms &amp; Suites
          </h1>
          <p className="max-w-xl text-white/85 text-sm md:text-base mt-3 leading-relaxed">
            A blend of modern amenities and classic hospitality. Choose the space that fits your stay.
          </p>
          <p className="flex items-start gap-1.5 text-white/75 text-xs md:text-sm mt-3 max-w-md">
            <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
            {RESORT_ADDRESS}
          </p>
        </div>
      </section>

      {/* ===== Category sections ===== */}
      <div className="max-w-[1280px] mx-auto px-4 md:px-12 py-14 md:py-20 space-y-16 md:space-y-24">
        {ROOM_CATEGORIES.map((cat, i) => (
          <section key={cat.id} id={cat.id} className="scroll-mt-28">
            {/* Heading row */}
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-7">
              <div>
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#a6893f]">
                  Category {i + 1}
                </span>
                <h2 className="text-2xl md:text-3xl font-extrabold text-[#1c1c17] tracking-tight mt-1">
                  {cat.title}
                </h2>
                <div className="w-16 h-1.5 bg-[#35BFD0] rounded-full mt-3" />
                <p className="max-w-2xl text-[#3f484e] text-sm md:text-base leading-relaxed mt-4">
                  {cat.blurb}
                </p>
                <div className="flex items-center gap-4 mt-4">
                  <span className="text-lg font-extrabold text-[#1c1c17]">
                    ₹{cat.price.toLocaleString('en-IN')}
                    <span className="text-xs font-semibold text-[#6f787e]"> / night</span>
                  </span>
                  <span className="flex items-center gap-1 text-xs font-semibold text-[#a6893f]">
                    <Star className="w-3.5 h-3.5 fill-current" /> 3.7 · 413 reviews
                  </span>
                </div>
              </div>

              <button
                onClick={() => onBook(cat.id)}
                className="self-start sm:self-auto flex items-center gap-2 bg-gradient-to-b from-[#d8b348] to-[#a9801d] text-white font-semibold text-sm px-6 py-3 rounded-full shadow-[0_16px_30px_-10px_rgba(160,120,25,0.5)] hover:brightness-105 active:scale-95 transition-all whitespace-nowrap"
              >
                <CalendarCheck className="w-4 h-4" />
                Book Now
              </button>
            </div>

            {/* Image grid */}
            <div
              className={`grid gap-4 sm:gap-5 ${
                cat.images.length === 1
                  ? 'grid-cols-1'
                  : cat.images.length === 2
                  ? 'grid-cols-1 sm:grid-cols-2'
                  : 'grid-cols-2 lg:grid-cols-4'
              }`}
            >
              {cat.images.map((src, idx) => (
                <button
                  key={src}
                  onClick={() => setLightbox({ images: cat.images, index: idx, title: cat.title })}
                  className={`group relative overflow-hidden rounded-2xl border border-[#e5e2db] bg-white sunlight-shadow ${
                    cat.images.length >= 3 && idx === 0 ? 'col-span-2 lg:col-span-2 row-span-2' : ''
                  }`}
                >
                  <img
                    src={src}
                    alt={`${cat.title} ${idx + 1}`}
                    loading="lazy"
                    className="w-full h-52 sm:h-60 lg:h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                </button>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* ===== Lightbox ===== */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[60] bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setLightbox(null)}
        >
          <button
            onClick={() => setLightbox(null)}
            className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/15 hover:bg-white/30 text-white flex items-center justify-center transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          {lightbox.images.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  showPrev();
                }}
                className="absolute left-3 md:left-8 text-white/80 hover:text-white transition-colors"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-10 h-10" strokeWidth={1.5} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  showNext();
                }}
                className="absolute right-3 md:right-8 text-white/80 hover:text-white transition-colors"
                aria-label="Next image"
              >
                <ChevronRight className="w-10 h-10" strokeWidth={1.5} />
              </button>
            </>
          )}

          <figure className="max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
            <img
              src={lightbox.images[lightbox.index]}
              alt={`${lightbox.title} ${lightbox.index + 1}`}
              className="w-full max-h-[80vh] object-contain rounded-xl"
            />
            <figcaption className="text-center text-white/80 text-sm mt-3">
              {lightbox.title} — {lightbox.index + 1} / {lightbox.images.length}
            </figcaption>
          </figure>
        </div>
      )}
    </div>
  );
};
