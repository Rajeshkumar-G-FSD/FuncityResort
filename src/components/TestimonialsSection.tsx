import React from 'react';
import BlurText from './BlurText';
import SplitText from './SplitText';
import DecryptedText from './DecryptedText';
import { GoogleG, Stars } from './GoogleBits';
import {
  GOOGLE_REVIEWS,
  GOOGLE_RATING,
  GOOGLE_REVIEW_COUNT,
  GoogleReview,
} from '../data/reviews';

const ReviewCard: React.FC<{ r: GoogleReview }> = ({ r }) => (
  <div className="bg-white rounded-2xl p-5 md:p-6 border border-[#e5e2db] sunlight-shadow flex flex-col break-inside-avoid">
    <div className="flex items-start gap-3">
      <span
        className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
        style={{ background: r.color }}
      >
        {r.initials}
      </span>
      <div className="flex-grow min-w-0">
        <p className="text-sm font-bold text-[#1c1c17] truncate">{r.name}</p>
        <p className="text-[11px] text-[#8a8677]">{r.when}</p>
      </div>
      <GoogleG className="w-4 h-4 flex-shrink-0 mt-0.5" />
    </div>

    <div className="mt-2.5">
      <Stars n={r.rating} />
    </div>

    <p className="mt-3 text-[13px] md:text-sm leading-relaxed text-[#3f484e]">
      <DecryptedText
        text={r.text}
        animateOn="view"
        sequential
        revealDirection="start"
        useOriginalCharsOnly
        speed={12}
        className="text-[#3f484e]"
        encryptedClassName="text-[#b8b2a1]"
      />
    </p>
  </div>
);

export const TestimonialsSection: React.FC = () => {
  return (
    <section className="py-12 md:py-20 px-4 md:px-12 max-w-[1280px] mx-auto animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col items-center text-center mb-10 md:mb-14">
        <BlurText
          as="h2"
          text="GUEST EXPERIENCES"
          className="text-3xl md:text-4xl font-extrabold text-[#1c1c17] tracking-tight uppercase justify-center"
        />
        <div className="w-20 h-2 bg-[#35BFD0] rounded-full mt-3 mb-4" />
        <SplitText
          tag="p"
          splitType="words"
          delay={16}
          duration={0.6}
          from={{ opacity: 0, y: 16 }}
          to={{ opacity: 1, y: 0 }}
          textAlign="center"
          text="Real Google reviews from guests who stayed at Fun City Resorts, Lovedale, Ooty."
          className="max-w-2xl text-[#3f484e] text-base md:text-lg leading-relaxed"
        />
      </div>

      {/* Google rating summary */}
      <div className="bg-white rounded-2xl border border-[#e5e2db] sunlight-shadow p-6 md:p-8 flex flex-col sm:flex-row items-center gap-6 mb-8 md:mb-10">
        <div className="flex items-center gap-3">
          <GoogleG className="w-9 h-9" />
          <div>
            <p className="text-sm font-bold text-[#1c1c17]">Google Reviews</p>
            <p className="text-[11px] text-[#8a8677]">Fun City Resorts, Ooty</p>
          </div>
        </div>
        <div className="hidden sm:block w-px h-12 bg-[#e5e2db]" />
        <div className="flex items-center gap-4">
          <span className="text-4xl font-extrabold text-[#1c1c17] leading-none">
            {GOOGLE_RATING.toFixed(1)}
          </span>
          <div>
            <Stars n={Math.round(GOOGLE_RATING)} size="w-5 h-5" />
            <p className="text-xs text-[#6f787e] mt-1">
              Based on {GOOGLE_REVIEW_COUNT.toLocaleString('en-IN')} reviews
            </p>
          </div>
        </div>
        <a
          href="https://www.google.com/search?q=Fun+City+Resorts+Ooty+reviews"
          target="_blank"
          rel="noopener noreferrer"
          className="sm:ml-auto text-xs font-bold text-[#087ea4] border border-[#087ea4]/30 rounded-full px-4 py-2 hover:bg-[#087ea4]/5 transition-colors"
        >
          View on Google
        </a>
      </div>

      {/* Review masonry */}
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 [column-fill:_balance]">
        {GOOGLE_REVIEWS.map((r) => (
          <div key={r.name} className="mb-5">
            <ReviewCard r={r} />
          </div>
        ))}
      </div>

      <p className="text-center text-[11px] text-[#8a8677] mt-6">
        Showing {GOOGLE_REVIEWS.length} of {GOOGLE_REVIEW_COUNT.toLocaleString('en-IN')} Google
        reviews.
      </p>
    </section>
  );
};
