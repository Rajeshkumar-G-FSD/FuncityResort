import React from 'react';
import { Star, Quote, Sparkles } from 'lucide-react';
import { TESTIMONIALS } from '../data/resortData';

export const TestimonialsSection: React.FC = () => {
  return (
    <section className="py-12 md:py-20 px-4 md:px-12 max-w-[1280px] mx-auto animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col items-center text-center mb-12 md:mb-16">
        <h2 className="text-3xl md:text-4xl font-extrabold text-[#1c1c17] tracking-tight uppercase">
          GUEST EXPERIENCES
        </h2>
        <div className="w-20 h-2 bg-[#35BFD0] rounded-full mt-3 mb-4" />
        <p className="max-w-2xl text-[#3f484e] text-base md:text-lg leading-relaxed">
          Read genuine stories and memories shared by travelers from around the world who found their peaceful retreat at Funcity Resort.
        </p>
      </div>

      {/* Testimonials Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {TESTIMONIALS.map((t) => (
          <div
            key={t.id}
            className="bg-white rounded-[24px] p-8 sunlight-shadow hover:sunlight-shadow-hover hover:-translate-y-1.5 transition-all duration-300 border border-[#e5e2db] flex flex-col justify-between relative"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-amber-500">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <Quote className="w-6 h-6 text-[#087ea4]/20" />
              </div>

              <p className="text-[#3f484e] text-sm md:text-base leading-relaxed italic">
                "{t.comment}"
              </p>
            </div>

            <div className="pt-6 mt-6 border-t border-[#e5e2db] flex items-center gap-4">
              <img
                src={t.avatar}
                alt={t.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-[#087ea4]/20 shadow-sm"
              />
              <div>
                <h4 className="text-sm font-bold text-[#1c1c17]">{t.name}</h4>
                <p className="text-xs text-[#6f787e]">{t.location}</p>
                <span className="text-[10px] font-semibold text-[#087ea4] bg-[#087ea4]/10 px-2 py-0.5 rounded-full inline-block mt-1">
                  Stayed in {t.roomName}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
