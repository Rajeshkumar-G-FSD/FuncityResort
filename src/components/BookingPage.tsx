import React, { useRef, useState } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  Check,
  CreditCard,
  ShieldCheck,
  Sparkles,
  Users as UsersIcon,
  CalendarDays,
  MapPin,
} from 'lucide-react';
import { ROOM_CATEGORIES } from '../data/resortData';
import { GuestSelector, GuestValue, DEFAULT_GUESTS, summariseGuests } from './GuestSelector';
import { todayISO, addDaysISO, nightsBetween, isISODate, formatDate } from '../utils/dates';
import { openNativePicker } from '../utils/showPicker';
import { RESORT_ADDRESS } from '../data/contact';

const inr = (n: number) => '₹' + n.toLocaleString('en-IN');

interface BookingPageProps {
  onBack: () => void;
  initialCategoryId?: string;
  initialCriteria?: {
    checkIn?: string;
    checkOut?: string;
    guests?: string;
  };
}

const HERO_IMAGE = '/images/funcity_couple_room.JPG';

export const BookingPage: React.FC<BookingPageProps> = ({
  onBack,
  initialCategoryId,
  initialCriteria,
}) => {
  const [categoryId, setCategoryId] = useState<string>(
    initialCategoryId ?? ROOM_CATEGORIES[0].id
  );
  const [checkIn, setCheckIn] = useState(
    isISODate(initialCriteria?.checkIn || '') ? (initialCriteria!.checkIn as string) : ''
  );
  const [checkOut, setCheckOut] = useState(
    isISODate(initialCriteria?.checkOut || '') ? (initialCriteria!.checkOut as string) : ''
  );
  const [guestValue, setGuestValue] = useState<GuestValue>(DEFAULT_GUESTS);

  const checkInRef = useRef<HTMLInputElement>(null);
  const checkOutRef = useRef<HTMLInputElement>(null);

  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('');

  const [step, setStep] = useState<'configure' | 'confirmed'>('configure');
  const [bookingRef, setBookingRef] = useState('');

  const guests = summariseGuests(guestValue);
  const today = todayISO();
  const minCheckOut = checkIn ? addDaysISO(checkIn, 1) : addDaysISO(today, 1);

  const selectedCat = ROOM_CATEGORIES.find((c) => c.id === categoryId) ?? ROOM_CATEGORIES[0];

  const nights = nightsBetween(checkIn, checkOut) || 4;
  const roomBasePrice = selectedCat.price * nights;

  const serviceFee = 500;
  const taxes = Math.round(roomBasePrice * 0.12); // 12% GST
  const grandTotal = roomBasePrice + serviceFee + taxes;

  const handleConfirmReservation = (e: React.FormEvent) => {
    e.preventDefault();
    setBookingRef(`FUN-${Math.floor(100000 + Math.random() * 900000)}`);
    setStep('confirmed');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="bg-[#fcf9f1]">
      {/* ===== Large hero ===== */}
      <section className="relative h-[64vh] min-h-[460px] max-h-[680px] w-full overflow-hidden flex items-end">
        <img
          src={HERO_IMAGE}
          alt="Fun City stay"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/30" />

        <button
          onClick={onBack}
          className="absolute top-24 md:top-28 left-4 md:left-12 z-10 flex items-center gap-2 bg-white/90 hover:bg-white text-[#1c1c17] text-sm font-semibold px-4 py-2.5 rounded-full shadow-md backdrop-blur transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </button>

        <div className="relative z-10 max-w-[1100px] mx-auto w-full px-4 md:px-12 pb-12 md:pb-16 text-white">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-white/80">
            <Sparkles className="w-3.5 h-3.5" />
            Fun City · Lovedale, Ooty
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mt-3">
            Reserve Your Getaway
          </h1>
          <p className="max-w-xl text-white/85 text-sm md:text-lg mt-3 leading-relaxed">
            Confirm your room category and dates — all on one page.
          </p>

          {/* Summary chips */}
          <div className="flex flex-wrap items-center gap-2.5 mt-6">
            <span className="flex items-center gap-1.5 bg-white/15 border border-white/25 rounded-full px-3.5 py-1.5 text-sm font-semibold backdrop-blur">
              <UsersIcon className="w-4 h-4" />
              {guests}
            </span>
            <span className="flex items-center gap-1.5 bg-white/15 border border-white/25 rounded-full px-3.5 py-1.5 text-sm font-semibold backdrop-blur">
              <CalendarDays className="w-4 h-4" />
              {checkIn && checkOut
                ? `${formatDate(checkIn)} – ${formatDate(checkOut)} · ${nights} nights`
                : 'Dates not set'}
            </span>
          </div>

          <p className="flex items-start gap-1.5 text-white/75 text-xs md:text-sm mt-4 max-w-md">
            <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
            {RESORT_ADDRESS}
          </p>
        </div>
      </section>

      {/* ===== Content ===== */}
      <div className="max-w-[900px] mx-auto px-4 md:px-8 py-12 md:py-16">
        {step === 'configure' ? (
          <form onSubmit={handleConfirmReservation} className="space-y-7">
            {/* Room Category */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#3f484e] mb-3">
                Select Room Category
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {ROOM_CATEGORIES.map((c) => (
                  <div
                    key={c.id}
                    onClick={() => setCategoryId(c.id)}
                    className={`rounded-2xl border cursor-pointer transition-all overflow-hidden bg-white ${
                      categoryId === c.id
                        ? 'border-[#087ea4] ring-2 ring-[#087ea4]'
                        : 'border-[#e5e2db] hover:border-[#bec8ce]'
                    }`}
                  >
                    <div className="relative h-28">
                      <img src={c.images[0]} alt={c.title} className="w-full h-full object-cover" />
                      {categoryId === c.id && (
                        <span className="absolute top-2 right-2 bg-white rounded-full">
                          <CheckCircle2 className="w-5 h-5 text-[#087ea4]" />
                        </span>
                      )}
                    </div>
                    <div className="p-3">
                      <h4 className="text-sm font-bold text-[#1c1c17]">{c.title}</h4>
                      <p className="text-xs text-[#087ea4] font-semibold">{inr(c.price)} / night</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Guests & Dates */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-white rounded-xl border border-[#e5e2db]">
                <GuestSelector
                  value={guestValue}
                  onChange={setGuestValue}
                  compact
                  onApply={() => openNativePicker(checkInRef.current)}
                />
              </div>

              <div className="bg-white p-3 rounded-xl border border-[#e5e2db]">
                <label className="text-[10px] font-bold text-[#6f787e] uppercase block">Check In</label>
                <div className="relative mt-1">
                  <span
                    className={`text-xs font-bold ${checkIn ? 'text-[#1c1c17]' : 'text-[#9aa2a7]'}`}
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

              <div
                className={`bg-white p-3 rounded-xl border border-[#e5e2db] ${
                  checkIn ? '' : 'opacity-60'
                }`}
              >
                <label className="text-[10px] font-bold text-[#6f787e] uppercase block">
                  Check Out
                </label>
                <div className="relative mt-1">
                  <span
                    className={`text-xs font-bold ${checkOut ? 'text-[#1c1c17]' : 'text-[#9aa2a7]'}`}
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

            {/* Guest Details */}
            <div className="bg-white p-5 rounded-2xl border border-[#e5e2db] space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#1c1c17]">
                Primary Guest Information
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-[#6f787e] uppercase block mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Priya Sharma"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    className="w-full text-xs bg-[#fcf9f1] border border-[#bec8ce] rounded-lg p-2.5 text-[#1c1c17] focus:outline-none focus:border-[#087ea4]"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-[#6f787e] uppercase block mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="priya@example.com"
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)}
                    className="w-full text-xs bg-[#fcf9f1] border border-[#bec8ce] rounded-lg p-2.5 text-[#1c1c17] focus:outline-none focus:border-[#087ea4]"
                  />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold text-[#6f787e] uppercase block mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  placeholder="+91 90000 00000"
                  value={guestPhone}
                  onChange={(e) => setGuestPhone(e.target.value)}
                  className="w-full text-xs bg-[#fcf9f1] border border-[#bec8ce] rounded-lg p-2.5 text-[#1c1c17] focus:outline-none focus:border-[#087ea4]"
                />
              </div>
            </div>

            {/* Price Summary */}
            <div className="bg-[#f6f3eb] p-5 rounded-2xl border border-[#e5e2db] space-y-2 text-xs">
              <div className="flex justify-between text-[#3f484e]">
                <span>
                  {selectedCat.title} ({inr(selectedCat.price)} x {nights} nights)
                </span>
                <span className="font-semibold text-[#1c1c17]">{inr(roomBasePrice)}</span>
              </div>
              <div className="flex justify-between text-[#3f484e]">
                <span>Property Service Fee</span>
                <span className="font-semibold text-[#1c1c17]">{inr(serviceFee)}</span>
              </div>
              <div className="flex justify-between text-[#3f484e]">
                <span>GST (12%)</span>
                <span className="font-semibold text-[#1c1c17]">{inr(taxes)}</span>
              </div>
              <div className="flex justify-between pt-3 border-t border-[#bec8ce] text-base font-extrabold text-[#1c1c17]">
                <span>Total Estimated Stay</span>
                <span className="text-[#087ea4]">{inr(grandTotal)}</span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#087ea4] hover:bg-[#006483] text-white font-bold text-base py-4 rounded-2xl floating-shadow hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <CreditCard className="w-5 h-5" />
              Confirm &amp; Reserve Experience
            </button>

            <div className="flex items-center justify-center gap-2 text-xs text-[#6f787e]">
              <ShieldCheck className="w-4 h-4 text-[#087ea4]" />
              <span>Flexible cancellation • Pay directly at the property</span>
            </div>
          </form>
        ) : (
          /* Confirmation */
          <div className="text-center space-y-6 py-6">
            <div className="w-20 h-20 bg-[#087ea4]/10 text-[#087ea4] rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#087ea4] bg-[#087ea4]/10 px-3 py-1 rounded-full">
                Booking Confirmed
              </span>
              <h2 className="text-3xl font-extrabold text-[#1c1c17] mt-3">
                We Can't Wait to Welcome You!
              </h2>
              <p className="text-sm text-[#3f484e] max-w-md mx-auto mt-2">
                Your reservation has been registered with priority concierge status.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-[#e5e2db] text-left space-y-3 max-w-md mx-auto text-xs shadow-sm">
              <div className="flex justify-between pb-2 border-b border-[#e5e2db]">
                <span className="text-[#6f787e] font-semibold">Confirmation Ref</span>
                <span className="font-mono font-bold text-sm text-[#087ea4]">{bookingRef}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6f787e]">Reserved Accommodation</span>
                <span className="font-bold text-[#1c1c17]">{selectedCat.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6f787e]">Dates</span>
                <span className="font-bold text-[#1c1c17]">
                  {checkIn && checkOut
                    ? `${formatDate(checkIn)} – ${formatDate(checkOut)} (${nights} nights)`
                    : `${nights} nights`}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6f787e]">Guests</span>
                <span className="font-bold text-[#1c1c17]">{guests}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6f787e]">Primary Guest</span>
                <span className="font-bold text-[#1c1c17]">{guestName || 'Guest'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6f787e]">Property</span>
                <span className="font-bold text-[#1c1c17] text-right">{RESORT_ADDRESS}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-[#e5e2db] text-sm font-extrabold">
                <span>Total Amount Due at Check-in</span>
                <span className="text-[#087ea4]">{inr(grandTotal)}</span>
              </div>
            </div>

            <button
              onClick={onBack}
              className="bg-[#087ea4] hover:bg-[#006483] text-white font-bold text-sm px-8 py-3.5 rounded-full transition-all shadow-md"
            >
              Done &amp; Return to Home
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
