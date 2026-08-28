import React, { useRef, useState } from 'react';
import { X, Calendar, Search, Sparkles } from 'lucide-react';
import { GuestSelector, GuestValue, DEFAULT_GUESTS } from './GuestSelector';
import { todayISO, addDaysISO, formatDate } from '../utils/dates';
import { openNativePicker } from '../utils/showPicker';
import type { BookingSearch } from './BookingSearchWidget';

interface BookingPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSearch: (criteria: BookingSearch) => void;
}

export const BookingPopup: React.FC<BookingPopupProps> = ({ isOpen, onClose, onSearch }) => {
  const [guestValue, setGuestValue] = useState<GuestValue>(DEFAULT_GUESTS);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');

  const checkInRef = useRef<HTMLInputElement>(null);
  const checkOutRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const today = todayISO();
  const minCheckOut = checkIn ? addDaysISO(checkIn, 1) : addDaysISO(today, 1);

  const handleSearch = () => {
    onSearch({ checkIn, checkOut, guests: guestValue });
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-start sm:items-center justify-center p-4 bg-black/70 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-[#fdfbf6] rounded-[28px] w-full max-w-md shadow-2xl border border-[#ece3cf] relative animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto custom-scrollbar my-4">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-[#1c1c17] flex items-center justify-center shadow-md transition-all"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="px-6 pt-7 pb-5 text-center">
          <img
            src="/images/funcity_logo.png"
            alt="Fun City"
            className="w-12 h-12 md:w-16 md:h-16 object-contain mx-auto"
          />
          <div className="flex items-center justify-center gap-2 text-[11px] font-bold text-[#a6893f] uppercase tracking-[0.18em] mt-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Reserve Your Stay</span>
          </div>
          <h2 className="text-xl md:text-2xl font-extrabold text-[#2f2a20] tracking-tight mt-1">
            Find your perfect stay
          </h2>
        </div>

        {/* Fields */}
        <div className="px-5 pb-6 space-y-3">
          <div className="bg-white rounded-xl border border-[#ece3cf]">
            <GuestSelector
              value={guestValue}
              onChange={setGuestValue}
              compact
              inlinePanel
              onApply={() => openNativePicker(checkInRef.current)}
            />
          </div>

          {/* Check-in */}
          <div className="bg-white rounded-xl border border-[#ece3cf] px-3 py-2.5 flex items-center gap-3">
            <Calendar className="w-5 h-5 text-[#a6893f] flex-shrink-0" strokeWidth={1.75} />
            <div className="flex-grow min-w-0">
              <span className="block text-[11px] font-bold uppercase tracking-[0.16em] text-[#8a7643]">
                Check-In
              </span>
              <div className="relative">
                <span
                  className={`block text-[15px] font-semibold ${
                    checkIn ? 'text-[#2f2a20]' : 'text-[#b8a986]'
                  }`}
                >
                  {checkIn ? formatDate(checkIn) : 'Select Date'}
                </span>
                <input
                  ref={checkInRef}
                  type="date"
                  value={checkIn}
                  min={today}
                  onChange={(e) => {
                    setCheckIn(e.target.value);
                    if (e.target.value && checkOut && checkOut <= e.target.value) setCheckOut('');
                    if (e.target.value) openNativePicker(checkOutRef.current);
                  }}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  aria-label="Check-in date"
                />
              </div>
            </div>
          </div>

          {/* Check-out */}
          <div
            className={`bg-white rounded-xl border border-[#ece3cf] px-3 py-2.5 flex items-center gap-3 ${
              checkIn ? '' : 'opacity-60'
            }`}
          >
            <Calendar className="w-5 h-5 text-[#a6893f] flex-shrink-0" strokeWidth={1.75} />
            <div className="flex-grow min-w-0">
              <span className="block text-[11px] font-bold uppercase tracking-[0.16em] text-[#8a7643]">
                Check-Out
              </span>
              <div className="relative">
                <span
                  className={`block text-[15px] font-semibold ${
                    checkOut ? 'text-[#2f2a20]' : 'text-[#b8a986]'
                  }`}
                >
                  {checkOut ? formatDate(checkOut) : checkIn ? 'Select Date' : 'Check-in first'}
                </span>
                <input
                  ref={checkOutRef}
                  type="date"
                  value={checkOut}
                  min={minCheckOut}
                  disabled={!checkIn}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                  aria-label="Check-out date"
                />
              </div>
            </div>
          </div>

          <button
            onClick={handleSearch}
            className="w-full mt-1 flex items-center justify-center gap-2.5 text-white font-bold text-[15px] py-3.5 rounded-2xl bg-gradient-to-b from-[#d8b348] to-[#a9801d] shadow-[0_16px_30px_-10px_rgba(160,120,25,0.5)] hover:brightness-105 active:scale-95 transition-all"
          >
            <Search className="w-5 h-5" strokeWidth={2.25} />
            Search
          </button>
        </div>
      </div>
    </div>
  );
};
