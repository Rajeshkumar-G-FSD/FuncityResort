import React, { useRef, useState } from 'react';
import { Calendar, Search } from 'lucide-react';
import { GuestSelector, GuestValue, DEFAULT_GUESTS } from './GuestSelector';
import { todayISO, addDaysISO, formatDate } from '../utils/dates';
import { openNativePicker } from '../utils/showPicker';

export interface BookingSearch {
  checkIn: string;
  checkOut: string;
  guests: GuestValue;
}

interface BookingSearchWidgetProps {
  onSearch: (criteria: BookingSearch) => void;
}

export const BookingSearchWidget: React.FC<BookingSearchWidgetProps> = ({ onSearch }) => {
  const [guestValue, setGuestValue] = useState<GuestValue>(DEFAULT_GUESTS);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');

  const checkInRef = useRef<HTMLInputElement>(null);
  const checkOutRef = useRef<HTMLInputElement>(null);

  const today = todayISO();
  const minCheckOut = checkIn ? addDaysISO(checkIn, 1) : addDaysISO(today, 1);

  const openPicker = (el: HTMLInputElement | null) => {
    try {
      (el as (HTMLInputElement & { showPicker?: () => void }) | null)?.showPicker?.();
    } catch {
      /* already open */
    }
  };

  const handleCheckInChange = (value: string) => {
    if (value === checkIn) return;
    setCheckIn(value);
    // Check-out must always be after check-in
    if (value && checkOut && checkOut <= value) setCheckOut('');
    // Only jump to check-out when it isn't chosen yet
    if (value && !checkOut) openNativePicker(checkOutRef.current);
  };

  // Progress: guests (always ready) -> check-in -> check-out
  const progress = 1 + (checkIn ? 1 : 0) + (checkOut ? 1 : 0);
  const helperText = [
    '',
    'Now pick your check-in date',
    'Now pick your check-out date',
    "You're all set — hit search",
  ][progress];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({ checkIn, checkOut, guests: guestValue });
  };

  return (
    <section className="relative z-20 mt-8 md:mt-12 px-4 md:px-12 max-w-[1280px] mx-auto mb-16 md:mb-24">
      <div className="bg-[#fdfbf6] rounded-[28px] p-4 md:p-5 shadow-[0_24px_60px_-20px_rgba(120,95,30,0.25)] border border-[#ece3cf]">
        <div className="flex flex-col md:flex-row md:items-stretch">
          {/* GUESTS — first */}
          <div className="relative flex-1 min-w-0 rounded-xl border-b md:border-b-0 md:border-r border-[#ece3cf] hover:bg-[#f7f1e2]/60 transition-colors">
            <GuestSelector
              value={guestValue}
              onChange={setGuestValue}
              onApply={() => openNativePicker(checkInRef.current)}
            />
          </div>

          {/* CHECK-IN — tap anywhere to (re)open the calendar */}
          <div className="relative flex-1 min-w-0 rounded-xl border-b md:border-b-0 md:border-r border-[#ece3cf] hover:bg-[#f7f1e2]/60 transition-colors">
            <div className="w-full flex items-center gap-3.5 px-4 py-4 md:px-5">
              <Calendar className="w-5 h-5 text-[#a6893f] flex-shrink-0" strokeWidth={1.75} />
              <span className="flex-grow min-w-0">
                <span className="block text-[11px] font-bold uppercase tracking-[0.18em] text-[#8a7643]">
                  Check-In
                </span>
                <span
                  className={`block text-[17px] font-semibold truncate ${
                    checkIn ? 'text-[#2f2a20]' : 'text-[#b8a986]'
                  }`}
                >
                  {checkIn ? formatDate(checkIn) : 'Select Date'}
                </span>
                <span className="block text-[11px] font-semibold text-[#a6893f] h-3 leading-3">
                  {checkIn ? 'Tap to change' : ''}
                </span>
              </span>
            </div>
            <input
              ref={checkInRef}
              type="date"
              value={checkIn}
              min={today}
              onChange={(e) => handleCheckInChange(e.target.value)}
              onClick={(e) => openPicker(e.currentTarget)}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              aria-label="Check-in date"
            />
          </div>

          {/* CHECK-OUT — enabled after check-in, opens from the next day */}
          <div
            className={`relative flex-1 min-w-0 rounded-xl border-b md:border-b-0 md:border-r border-[#ece3cf] transition-colors ${
              checkIn ? 'hover:bg-[#f7f1e2]/60' : 'opacity-60'
            }`}
          >
            <div className="w-full flex items-center gap-3.5 px-4 py-4 md:px-5">
              <Calendar className="w-5 h-5 text-[#a6893f] flex-shrink-0" strokeWidth={1.75} />
              <span className="flex-grow min-w-0">
                <span className="block text-[11px] font-bold uppercase tracking-[0.18em] text-[#8a7643]">
                  Check-Out
                </span>
                <span
                  className={`block text-[17px] font-semibold truncate ${
                    checkOut ? 'text-[#2f2a20]' : 'text-[#b8a986]'
                  }`}
                >
                  {checkOut ? formatDate(checkOut) : checkIn ? 'Select Date' : 'Check-in first'}
                </span>
                <span className="block text-[11px] font-semibold text-[#a6893f] h-3 leading-3">
                  {checkOut ? 'Tap to change' : ''}
                </span>
              </span>
            </div>
            <input
              ref={checkOutRef}
              type="date"
              value={checkOut}
              min={minCheckOut}
              disabled={!checkIn}
              onChange={(e) => setCheckOut(e.target.value)}
              onClick={(e) => openPicker(e.currentTarget)}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
              aria-label="Check-out date"
            />
          </div>

          {/* SEARCH */}
          <div className="pt-3 md:pt-0 md:pl-4 flex md:items-center">
            <button
              onClick={handleSearchSubmit}
              aria-label="Search availability"
              className="w-full md:w-16 md:h-16 h-14 rounded-2xl flex items-center justify-center text-white bg-gradient-to-b from-[#d8b348] to-[#a9801d] shadow-[0_16px_30px_-10px_rgba(160,120,25,0.5)] hover:brightness-105 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
            >
              <Search className="w-6 h-6" strokeWidth={2.25} />
            </button>
          </div>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-0 pt-5 pb-1">
          {[1, 2, 3].map((n, i) => (
            <React.Fragment key={n}>
              <span
                className={`w-8 h-8 rounded-full border flex items-center justify-center text-[13px] font-semibold transition-colors ${
                  progress >= n
                    ? 'border-[#a6893f] bg-[#a6893f] text-white'
                    : 'border-[#d8cbac] text-[#b8a986]'
                }`}
              >
                {n}
              </span>
              {i < 2 && (
                <span
                  className={`h-px w-12 sm:w-20 transition-colors ${
                    progress > n ? 'bg-[#a6893f]' : 'bg-[#d8cbac]'
                  }`}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {helperText && (
        <p className="text-center text-[13px] md:text-sm text-[#8a7f66] mt-4">{helperText}</p>
      )}
    </section>
  );
};
