import React from 'react';
import { ArrowRight } from 'lucide-react';
import BlurText from './BlurText';
import { GoogleG, Stars } from './GoogleBits';
import { GOOGLE_REVIEWS, GOOGLE_RATING, GOOGLE_REVIEW_COUNT } from '../data/reviews';

interface ReviewsMarqueeProps {
  onSeeAll: () => void;
}

/** Home-page strip: Google reviews sliding horizontally on a seamless loop. */
export const ReviewsMarquee: React.FC<ReviewsMarqueeProps> = ({ onSeeAll }) => {
  const loop = [...GOOGLE_REVIEWS, ...GOOGLE_REVIEWS];
  const maskStyle: React.CSSProperties = {
    WebkitMaskImage:
      'linear-gradient(to right, transparent, #000 6%, #000 94%, transparent)',
    maskImage: 'linear-gradient(to right, transparent, #000 6%, #000 94%, transparent)',
  };

  return (
    <section className="py-12 md:py-20 overflow-hidden bg-[#f6f3eb]/40">
      <div className="max-w-[1280px] mx-auto px-4 md:px-12 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
        <div>
          <BlurText
            as="h2"
            text="What guests say on Google"
            className="text-2xl md:text-3xl font-extrabold text-[#1c1c17] tracking-tight"
          />
          <div className="flex items-center gap-2 mt-2">
            <GoogleG className="w-5 h-5" />
            <span className="font-extrabold text-[#1c1c17]">{GOOGLE_RATING.toFixed(1)}</span>
            <Stars n={Math.round(GOOGLE_RATING)} />
            <span className="text-xs text-[#6f787e]">
              · {GOOGLE_REVIEW_COUNT.toLocaleString('en-IN')} reviews
            </span>
          </div>
        </div>
        <button
          onClick={onSeeAll}
          className="self-start sm:self-auto flex items-center gap-1.5 text-sm font-bold text-[#087ea4] border border-[#087ea4]/30 rounded-full px-5 py-2.5 hover:bg-[#087ea4]/5 transition-colors"
        >
          Read all reviews <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <div className="marquee-paused" style={maskStyle}>
        <div className="marquee-track flex w-max">
          {loop.map((r, i) => (
            <article
              key={i}
              className="w-[300px] mr-5 flex-shrink-0 bg-white rounded-2xl border border-[#e5e2db] sunlight-shadow p-5"
            >
              <div className="flex items-center gap-3">
                <span
                  className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                  style={{ background: r.color }}
                >
                  {r.initials}
                </span>
                <div className="flex-grow min-w-0">
                  <p className="text-sm font-bold text-[#1c1c17] truncate">{r.name}</p>
                  <p className="text-[11px] text-[#8a8677]">{r.when}</p>
                </div>
                <GoogleG className="w-4 h-4 flex-shrink-0" />
              </div>
              <div className="mt-2.5">
                <Stars n={r.rating} />
              </div>
              <p className="mt-2.5 text-[13px] leading-relaxed text-[#3f484e] line-clamp-4">
                {r.text}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
