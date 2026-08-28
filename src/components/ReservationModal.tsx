import React, { useState } from 'react';
import {
  X,
  Calendar,
  Users,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  CreditCard,
  Check,
  ChevronDown,
  Info
} from 'lucide-react';
import { Room, AddOnOption } from '../types';
import { RESORT_ROOMS, ADD_ON_OPTIONS } from '../data/resortData';

interface ReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialRoom?: Room;
  initialCriteria?: {
    checkIn?: string;
    checkOut?: string;
    guests?: string;
  };
}

export const ReservationModal: React.FC<ReservationModalProps> = ({
  isOpen,
  onClose,
  initialRoom = RESORT_ROOMS[0],
  initialCriteria,
}) => {
  const [selectedRoom, setSelectedRoom] = useState<Room>(initialRoom);
  const [checkIn, setCheckIn] = useState(initialCriteria?.checkIn || '24 Oct, 2024');
  const [checkOut, setCheckOut] = useState(initialCriteria?.checkOut || '28 Oct, 2024');
  const [guests, setGuests] = useState(initialCriteria?.guests || '2 Adults');
  const [selectedAddOnIds, setSelectedAddOnIds] = useState<string[]>(['champagne-fruit']);

  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');

  const [step, setStep] = useState<'configure' | 'confirmed'>('configure');
  const [bookingRef, setBookingRef] = useState('');

  if (!isOpen) return null;

  const nights = 4;
  const roomBasePrice = selectedRoom.price * nights;

  const addOnsTotal = selectedAddOnIds.reduce((total, id) => {
    const item = ADD_ON_OPTIONS.find((a) => a.id === id);
    if (!item) return total;
    return total + (item.perNight ? item.price * nights : item.price);
  }, 0);

  const resortFee = 120;
  const taxes = Math.round((roomBasePrice + addOnsTotal) * 0.08);
  const grandTotal = roomBasePrice + addOnsTotal + resortFee + taxes;

  const toggleAddOn = (id: string) => {
    setSelectedAddOnIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleConfirmReservation = (e: React.FormEvent) => {
    e.preventDefault();
    const ref = `TRB-${Math.floor(100000 + Math.random() * 900000)}`;
    setBookingRef(ref);
    setStep('confirmed');
  };

  const handleResetAndClose = () => {
    setStep('configure');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-[#fcf9f1] rounded-[28px] max-w-2xl w-full max-h-[92vh] overflow-y-auto custom-scrollbar shadow-2xl border border-[#e5e2db] relative animate-in zoom-in-95 duration-200 my-8">
        {/* Modal Close Button */}
        <button
          onClick={handleResetAndClose}
          className="absolute top-5 right-5 z-20 w-9 h-9 rounded-full bg-white/80 hover:bg-white text-[#1c1c17] flex items-center justify-center shadow-md transition-all focus:outline-none"
          aria-label="Close Reservation Modal"
        >
          <X className="w-5 h-5" />
        </button>

        {step === 'configure' ? (
          <div>
            {/* Modal Header */}
            <div className="p-6 md:p-8 bg-white border-b border-[#e5e2db] rounded-t-[28px]">
              <div className="flex items-center gap-2 text-xs font-bold text-[#087ea4] uppercase tracking-wider mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Luxury Coastal Reservation</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-[#1c1c17] tracking-tight">
                Reserve Your Getaway
              </h2>
              <p className="text-sm text-[#3f484e] mt-1">
                Customize your dates, select curated resort experiences, and confirm your stay.
              </p>
            </div>

            <form onSubmit={handleConfirmReservation} className="p-6 md:p-8 space-y-6">
              {/* Room Selection */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#3f484e] mb-2">
                  Select Suite or Villa
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {RESORT_ROOMS.map((r) => (
                    <div
                      key={r.id}
                      onClick={() => setSelectedRoom(r)}
                      className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center gap-3 ${
                        selectedRoom.id === r.id
                          ? 'border-[#087ea4] bg-[#087ea4]/5 ring-1 ring-[#087ea4]'
                          : 'border-[#e5e2db] bg-white hover:border-[#bec8ce]'
                      }`}
                    >
                      <img
                        src={r.mainImage}
                        alt={r.title}
                        className="w-14 h-14 rounded-xl object-cover flex-shrink-0"
                      />
                      <div className="overflow-hidden flex-grow">
                        <h4 className="text-sm font-bold text-[#1c1c17] truncate">{r.title}</h4>
                        <p className="text-xs text-[#087ea4] font-semibold">${r.price} / night</p>
                        <span className="text-[10px] text-[#6f787e]">{r.badge}</span>
                      </div>
                      {selectedRoom.id === r.id && (
                        <CheckCircle2 className="w-5 h-5 text-[#087ea4] flex-shrink-0" />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Dates & Guests */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-white p-3 rounded-xl border border-[#e5e2db]">
                  <label className="text-[10px] font-bold text-[#6f787e] uppercase block">Check In</label>
                  <input
                    type="text"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="w-full text-xs font-bold text-[#1c1c17] bg-transparent focus:outline-none mt-1"
                  />
                </div>
                <div className="bg-white p-3 rounded-xl border border-[#e5e2db]">
                  <label className="text-[10px] font-bold text-[#6f787e] uppercase block">Check Out</label>
                  <input
                    type="text"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="w-full text-xs font-bold text-[#1c1c17] bg-transparent focus:outline-none mt-1"
                  />
                </div>
                <div className="bg-white p-3 rounded-xl border border-[#e5e2db]">
                  <label className="text-[10px] font-bold text-[#6f787e] uppercase block">Guests</label>
                  <input
                    type="text"
                    value={guests}
                    onChange={(e) => setGuests(e.target.value)}
                    className="w-full text-xs font-bold text-[#1c1c17] bg-transparent focus:outline-none mt-1"
                  />
                </div>
              </div>

              {/* Curated Luxury Add-Ons */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#3f484e] mb-2">
                  Enhance Your Stay (Optional Inclusions)
                </label>
                <div className="space-y-2.5">
                  {ADD_ON_OPTIONS.map((addon) => {
                    const isSelected = selectedAddOnIds.includes(addon.id);
                    return (
                      <div
                        key={addon.id}
                        onClick={() => toggleAddOn(addon.id)}
                        className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                          isSelected
                            ? 'bg-[#087ea4]/5 border-[#087ea4]'
                            : 'bg-white border-[#e5e2db] hover:border-[#bec8ce]'
                        }`}
                      >
                        <div className="flex items-start gap-3 pr-2">
                          <div
                            className={`w-5 h-5 rounded-md flex items-center justify-center mt-0.5 border ${
                              isSelected
                                ? 'bg-[#087ea4] border-[#087ea4] text-white'
                                : 'border-[#bec8ce] bg-white'
                            }`}
                          >
                            {isSelected && <Check className="w-3.5 h-3.5" />}
                          </div>
                          <div>
                            <h5 className="text-xs font-bold text-[#1c1c17]">{addon.name}</h5>
                            <p className="text-[11px] text-[#6f787e] mt-0.5">{addon.description}</p>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <span className="text-xs font-bold text-[#087ea4]">
                            +${addon.price}
                          </span>
                          {addon.perNight && (
                            <span className="text-[10px] text-[#6f787e] block">/ night</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
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
                      placeholder="e.g. Sarah Connor"
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
                      placeholder="sarah@example.com"
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
                    placeholder="+994 50 000 00 00"
                    value={guestPhone}
                    onChange={(e) => setGuestPhone(e.target.value)}
                    className="w-full text-xs bg-[#fcf9f1] border border-[#bec8ce] rounded-lg p-2.5 text-[#1c1c17] focus:outline-none focus:border-[#087ea4]"
                  />
                </div>
              </div>

              {/* Price Calculation Summary */}
              <div className="bg-[#f6f3eb] p-5 rounded-2xl border border-[#e5e2db] space-y-2 text-xs">
                <div className="flex justify-between text-[#3f484e]">
                  <span>
                    {selectedRoom.title} (${selectedRoom.price} x {nights} nights)
                  </span>
                  <span className="font-semibold text-[#1c1c17]">${roomBasePrice.toLocaleString()}</span>
                </div>
                {addOnsTotal > 0 && (
                  <div className="flex justify-between text-[#3f484e]">
                    <span>Curated Add-Ons ({selectedAddOnIds.length} selected)</span>
                    <span className="font-semibold text-[#1c1c17]">${addOnsTotal.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-[#3f484e]">
                  <span>Resort & Beach Maintenance Fee</span>
                  <span className="font-semibold text-[#1c1c17]">${resortFee}</span>
                </div>
                <div className="flex justify-between text-[#3f484e]">
                  <span>Estimated Taxes & Coastal Tourism Dues</span>
                  <span className="font-semibold text-[#1c1c17]">${taxes}</span>
                </div>

                <div className="flex justify-between pt-3 border-t border-[#bec8ce] text-base font-extrabold text-[#1c1c17]">
                  <span>Total Estimated Stay</span>
                  <span className="text-[#087ea4]">${grandTotal.toLocaleString()}</span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-[#087ea4] hover:bg-[#006483] text-white font-bold text-base py-4 rounded-2xl floating-shadow hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <CreditCard className="w-5 h-5" />
                <span>Confirm & Reserve Experience</span>
              </button>

              <div className="flex items-center justify-center gap-2 text-xs text-[#6f787e]">
                <ShieldCheck className="w-4 h-4 text-[#087ea4]" />
                <span>Flexible cancellation • Pay directly at resort check-in</span>
              </div>
            </form>
          </div>
        ) : (
          /* Booking Confirmation State */
          <div className="p-8 md:p-12 text-center space-y-6">
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
                Your reservation at The Relax Beach has been registered with priority concierge status.
              </p>
            </div>

            {/* Receipt Summary Card */}
            <div className="bg-white rounded-2xl p-6 border border-[#e5e2db] text-left space-y-3 max-w-md mx-auto text-xs shadow-sm">
              <div className="flex justify-between pb-2 border-b border-[#e5e2db]">
                <span className="text-[#6f787e] font-semibold">Confirmation Ref</span>
                <span className="font-mono font-bold text-sm text-[#087ea4]">{bookingRef}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6f787e]">Reserved Accommodation</span>
                <span className="font-bold text-[#1c1c17]">{selectedRoom.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6f787e]">Dates</span>
                <span className="font-bold text-[#1c1c17]">{checkIn} - {checkOut} ({nights} nights)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6f787e]">Primary Guest</span>
                <span className="font-bold text-[#1c1c17]">{guestName || 'Guest'}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-[#e5e2db] text-sm font-extrabold">
                <span>Total Amount Due at Check-in</span>
                <span className="text-[#087ea4]">${grandTotal.toLocaleString()}</span>
              </div>
            </div>

            <button
              onClick={handleResetAndClose}
              className="bg-[#087ea4] hover:bg-[#006483] text-white font-bold text-sm px-8 py-3.5 rounded-full transition-all shadow-md"
            >
              Done & Return to Resort
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
