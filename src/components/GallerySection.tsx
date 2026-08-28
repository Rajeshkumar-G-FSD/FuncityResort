import React, { useState } from 'react';
import { Camera, X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import { GALLERY_ITEMS } from '../data/resortData';

export const GallerySection: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);

  const categories = ['All', 'Suites', 'Beach & Pool', 'Sunset & Views'];

  const filteredItems =
    activeCategory === 'All'
      ? GALLERY_ITEMS
      : GALLERY_ITEMS.filter((item) => item.category === activeCategory);

  return (
    <section className="py-12 md:py-20 px-4 md:px-12 max-w-[1280px] mx-auto animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col items-center text-center mb-10 md:mb-14">
        <h2 className="text-3xl md:text-4xl font-extrabold text-[#1c1c17] tracking-tight uppercase">
          RESORT GALLERY
        </h2>
        <div className="w-20 h-2 bg-[#35BFD0] rounded-full mt-3 mb-4" />
        <p className="max-w-2xl text-[#3f484e] text-base md:text-lg leading-relaxed">
          Glimpse into the pristine coastal sanctuary of The Relax Beach. Every frame captures the warm harmony of golden sands and turquoise waters.
        </p>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 mt-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-full text-xs md:text-sm font-bold transition-all cursor-pointer ${
                activeCategory === cat
                  ? 'bg-[#087ea4] text-white shadow-md scale-105'
                  : 'bg-white text-[#3f484e] hover:bg-[#f1eee6] border border-[#e5e2db]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Bento-style Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
        {filteredItems.map((item, index) => (
          <div
            key={item.id}
            onClick={() => setSelectedPhotoIndex(index)}
            className="group relative h-64 md:h-72 rounded-[24px] overflow-hidden sunlight-shadow border border-[#e5e2db] cursor-pointer bg-white"
          >
            <img
              src={item.url}
              alt={item.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />

            {/* Overlay Info */}
            <div className="absolute bottom-4 left-5 right-5 text-white transform group-hover:-translate-y-1 transition-transform">
              <span className="text-[10px] font-bold uppercase tracking-wider bg-[#35BFD0] text-[#006483] px-2.5 py-0.5 rounded-full inline-block mb-1.5 shadow-sm">
                {item.category}
              </span>
              <h3 className="text-base md:text-lg font-bold text-white leading-tight">
                {item.title}
              </h3>
              <p className="text-xs text-white/80 mt-1 line-clamp-1">
                {item.desc}
              </p>
            </div>

            <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Maximize2 className="w-4 h-4" />
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedPhotoIndex !== null && (
        <div className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center p-4 animate-in fade-in duration-200">
          <button
            onClick={() => setSelectedPhotoIndex(null)}
            className="absolute top-6 right-6 text-white/80 hover:text-white p-2.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors focus:outline-none"
            aria-label="Close Lightbox"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="relative max-w-5xl max-h-[80vh] w-full flex items-center justify-center">
            <img
              src={filteredItems[selectedPhotoIndex].url}
              alt={filteredItems[selectedPhotoIndex].title}
              className="max-h-[75vh] w-auto max-w-full object-contain rounded-2xl shadow-2xl"
            />

            <button
              onClick={() =>
                setSelectedPhotoIndex((prev) =>
                  prev === 0 ? filteredItems.length - 1 : (prev as number) - 1
                )
              }
              className="absolute left-2 md:-left-12 p-3 rounded-full bg-white/20 hover:bg-white/40 text-white backdrop-blur transition-all"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              onClick={() =>
                setSelectedPhotoIndex((prev) =>
                  prev === filteredItems.length - 1 ? 0 : (prev as number) + 1
                )
              }
              className="absolute right-2 md:-right-12 p-3 rounded-full bg-white/20 hover:bg-white/40 text-white backdrop-blur transition-all"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          <div className="text-center mt-4 text-white">
            <h4 className="text-lg font-bold">
              {filteredItems[selectedPhotoIndex].title}
            </h4>
            <p className="text-xs text-white/70 mt-0.5">
              {filteredItems[selectedPhotoIndex].desc}
            </p>
          </div>
        </div>
      )}
    </section>
  );
};
