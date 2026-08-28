import React, { useRef, useState } from 'react';
import {
  Users,
  BedDouble,
  Maximize2,
  Wind,
  Wifi,
  Tv,
  Coffee,
  Bath,
  Lock,
  Calendar,
  ChevronDown,
  Sparkles,
  Camera,
  Check,
  Star,
  ArrowRight,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  X,
  Share2,
  Heart
} from 'lucide-react';
import { Room } from '../types';
import { RESORT_ROOMS } from '../data/resortData';
import { GuestSelector, GuestValue, DEFAULT_GUESTS, summariseGuests } from './GuestSelector';
import { todayISO, addDaysISO, nightsBetween, formatDate } from '../utils/dates';
import { openNativePicker } from '../utils/showPicker';

interface RoomDetailViewProps {
  room?: Room;
  onSelectRoom: (room: Room) => void;
  onBookNow: (room: Room, bookingData?: { checkIn: string; checkOut: string; guests: string }) => void;
}

export const RoomDetailView: React.FC<RoomDetailViewProps> = ({
  room = RESORT_ROOMS[0],
  onSelectRoom,
  onBookNow,
}) => {
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guestValue, setGuestValue] = useState<GuestValue>(DEFAULT_GUESTS);
  const checkInRef = useRef<HTMLInputElement>(null);
  const checkOutRef = useRef<HTMLInputElement>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Lightbox state for "View all 12 photos"
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);

  const guests = summariseGuests(guestValue);
  const today = todayISO();
  const minCheckOut = checkIn ? addDaysISO(checkIn, 1) : addDaysISO(today, 1);

  // Nights calculation
  const nights = nightsBetween(checkIn, checkOut) || 4;
  const roomTotal = room.price * nights;
  const resortFee = 120;
  const taxes = Math.round(roomTotal * 0.08);
  const grandTotal = roomTotal + resortFee + taxes;

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const getAmenityIcon = (iconName: string) => {
    switch (iconName) {
      case 'wifi':
        return <Wifi className="w-5 h-5 text-[#087ea4]" />;
      case 'ac_unit':
        return <Wind className="w-5 h-5 text-[#087ea4]" />;
      case 'coffee_maker':
        return <Coffee className="w-5 h-5 text-[#087ea4]" />;
      case 'bathtub':
        return <Bath className="w-5 h-5 text-[#087ea4]" />;
      case 'tv':
        return <Tv className="w-5 h-5 text-[#087ea4]" />;
      case 'lock':
        return <Lock className="w-5 h-5 text-[#087ea4]" />;
      default:
        return <Sparkles className="w-5 h-5 text-[#087ea4]" />;
    }
  };

  return (
    <section className="py-8 md:py-14 px-4 md:px-12 max-w-[1280px] mx-auto animate-in fade-in duration-300">
      {/* Top Gallery Bento Grid */}
      <div className="relative mb-10 md:mb-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 md:gap-4 h-auto md:h-[480px] rounded-[24px] overflow-hidden">
          {/* Main Large Photo */}
          <div
            onClick={() => {
              setActivePhotoIdx(0);
              setLightboxOpen(true);
            }}
            className="md:col-span-2 relative group cursor-pointer overflow-hidden h-[300px] md:h-full rounded-2xl md:rounded-none"
          >
            <img
              src={room.galleryImages[0] || room.mainImage}
              alt={`${room.title} Main Room View`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
          </div>

          {/* Right Column Photos Grid */}
          <div className="grid grid-cols-2 md:grid-cols-1 gap-3 md:gap-4 md:col-span-1 h-[180px] md:h-full">
            <div
              onClick={() => {
                setActivePhotoIdx(1);
                setLightboxOpen(true);
              }}
              className="relative group cursor-pointer overflow-hidden rounded-2xl md:rounded-none h-full"
            >
              <img
                src={room.galleryImages[1] || room.galleryImages[0]}
                alt={`${room.title} King Bed Sanctuary`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
            </div>

            <div
              onClick={() => {
                setActivePhotoIdx(2);
                setLightboxOpen(true);
              }}
              className="relative group cursor-pointer overflow-hidden rounded-2xl md:rounded-none h-full"
            >
              <img
                src={room.galleryImages[2] || room.galleryImages[0]}
                alt={`${room.title} Soaking Tub Bath`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
            </div>
          </div>

          {/* Fourth Photo with "View all photos" Button */}
          <div
            onClick={() => {
              setActivePhotoIdx(3);
              setLightboxOpen(true);
            }}
            className="md:col-span-1 relative group cursor-pointer overflow-hidden h-[200px] md:h-full rounded-2xl md:rounded-none"
          >
            <img
              src={room.galleryImages[3] || room.galleryImages[0]}
              alt={`${room.title} Private Oceanfront Balcony`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-black/15 group-hover:bg-black/5 transition-colors" />

            {/* View all photos Button Badge */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setLightboxOpen(true);
              }}
              className="absolute bottom-4 right-4 bg-white/90 hover:bg-white text-[#1c1c17] text-xs md:text-sm font-semibold px-4 py-2.5 rounded-full shadow-lg backdrop-blur-md flex items-center gap-2 hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <Camera className="w-4 h-4 text-[#087ea4]" />
              <span>View all 12 photos</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content & Sticky Booking Card Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
        {/* Left Column: Room Details (8 Cols) */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-8">
          {/* Header & Badges */}
          <div>
            <div className="flex items-center justify-between gap-4 mb-3">
              <div className="flex items-center gap-2.5">
                <span className="bg-[#35BFD0]/20 text-[#006483] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  {room.badge}
                </span>
                <span className="bg-[#f1eee6] text-[#3f484e] text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
                  {room.type}
                </span>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsLiked(!isLiked)}
                  className={`p-2.5 rounded-full border border-[#e5e2db] transition-colors ${
                    isLiked ? 'bg-red-50 text-red-500 border-red-200' : 'hover:bg-[#f6f3eb] text-[#6f787e]'
                  }`}
                  aria-label="Save to favorites"
                >
                  <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                </button>
                <button
                  onClick={handleShare}
                  className="p-2.5 rounded-full border border-[#e5e2db] hover:bg-[#f6f3eb] text-[#6f787e] transition-colors relative"
                  aria-label="Share room"
                >
                  <Share2 className="w-4 h-4" />
                  {copiedLink && (
                    <span className="absolute -top-8 right-0 bg-black text-white text-[10px] px-2 py-0.5 rounded shadow">
                      Copied!
                    </span>
                  )}
                </button>
              </div>
            </div>

            <h1 className="text-3xl md:text-4xl font-extrabold text-[#1c1c17] tracking-tight">
              {room.title}
            </h1>

            <div className="flex items-center gap-2 mt-2 text-sm text-[#3f484e]">
              <div className="flex items-center text-amber-500 font-semibold">
                <Star className="w-4 h-4 fill-current mr-1" />
                <span>{room.rating}</span>
              </div>
              <span className="text-[#bec8ce]">•</span>
              <span className="underline cursor-pointer">{room.reviewsCount} reviews</span>
              <span className="text-[#bec8ce]">•</span>
              <span className="text-[#087ea4] font-medium">Baku Seaside Horizon</span>
            </div>

            <p className="mt-5 text-[#3f484e] text-base md:text-lg leading-relaxed">
              {room.description}
            </p>
          </div>

          {/* Specifications Row */}
          <div className="bg-white rounded-2xl p-6 border border-[#e5e2db] sunlight-shadow">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="flex flex-col items-center sm:items-start text-center sm:text-left gap-1.5 p-2">
                <Users className="w-6 h-6 text-[#087ea4]" />
                <span className="text-xs text-[#6f787e] uppercase font-bold tracking-wider">Capacity</span>
                <span className="text-sm font-bold text-[#1c1c17]">{room.specs.guests}</span>
              </div>

              <div className="flex flex-col items-center sm:items-start text-center sm:text-left gap-1.5 p-2">
                <BedDouble className="w-6 h-6 text-[#087ea4]" />
                <span className="text-xs text-[#6f787e] uppercase font-bold tracking-wider">Beds</span>
                <span className="text-sm font-bold text-[#1c1c17]">{room.specs.beds}</span>
              </div>

              <div className="flex flex-col items-center sm:items-start text-center sm:text-left gap-1.5 p-2">
                <Maximize2 className="w-6 h-6 text-[#087ea4]" />
                <span className="text-xs text-[#6f787e] uppercase font-bold tracking-wider">Room Size</span>
                <span className="text-sm font-bold text-[#1c1c17]">{room.specs.sqft}</span>
              </div>

              <div className="flex flex-col items-center sm:items-start text-center sm:text-left gap-1.5 p-2">
                <Wind className="w-6 h-6 text-[#087ea4]" />
                <span className="text-xs text-[#6f787e] uppercase font-bold tracking-wider">Outdoor</span>
                <span className="text-sm font-bold text-[#1c1c17]">{room.specs.balcony}</span>
              </div>
            </div>
          </div>

          {/* Suite Amenities Section */}
          <div className="pt-2">
            <h2 className="text-xl font-bold text-[#1c1c17] mb-5 tracking-tight">
              Suite Amenities
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {room.amenities.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3.5 bg-white p-3.5 rounded-xl border border-[#e5e2db]/70"
                >
                  <div className="w-9 h-9 rounded-lg bg-[#f6f3eb] flex items-center justify-center flex-shrink-0">
                    {getAmenityIcon(item.icon)}
                  </div>
                  <span className="text-sm font-semibold text-[#1c1c17]">{item.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Highlights & Experience inclusions */}
          {room.highlights && (
            <div className="pt-2">
              <h2 className="text-xl font-bold text-[#1c1c17] mb-4 tracking-tight">
                Exclusive Inclusions
              </h2>
              <div className="space-y-3">
                {room.highlights.map((h, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-[#087ea4]/10 text-[#087ea4] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-sm text-[#3f484e] leading-relaxed">{h}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Sticky Booking Widget (4-5 Cols) */}
        <div className="lg:col-span-5 xl:col-span-4">
          <div className="sticky top-28 bg-white rounded-[24px] p-6 md:p-8 sunlight-shadow border border-[#e5e2db] space-y-6">
            {/* Price Header */}
            <div className="flex items-baseline justify-between pb-5 border-b border-[#e5e2db]">
              <div>
                <span className="text-3xl font-extrabold text-[#1c1c17]">${room.price}</span>
                <span className="text-[#6f787e] font-medium text-sm ml-1.5">/ night</span>
              </div>
              <div className="flex items-center gap-1 text-xs font-semibold text-[#087ea4] bg-[#087ea4]/10 px-2.5 py-1 rounded-full">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Best Rate Guaranteed</span>
              </div>
            </div>

            {/* Booking Inputs Box — Guests first, then dates */}
            <div className="border border-[#bec8ce]/70 rounded-2xl overflow-hidden divide-y divide-[#bec8ce]/60">
              <div className="bg-[#fcf9f1]/60">
                <GuestSelector
                  value={guestValue}
                  onChange={setGuestValue}
                  compact
                  onApply={() => openNativePicker(checkInRef.current)}
                />
              </div>

              <div className="grid grid-cols-2 divide-x divide-[#bec8ce]/60">
                <div className="p-3 bg-[#fcf9f1]/60">
                  <label className="text-[10px] font-bold text-[#6f787e] uppercase tracking-wider block">
                    Check In
                  </label>
                  <div className="relative mt-1">
                    <span
                      className={`text-sm font-semibold ${
                        checkIn ? 'text-[#1c1c17]' : 'text-[#9aa2a7]'
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
                <div className={`p-3 bg-[#fcf9f1]/60 ${checkIn ? '' : 'opacity-60'}`}>
                  <label className="text-[10px] font-bold text-[#6f787e] uppercase tracking-wider block">
                    Check Out
                  </label>
                  <div className="relative mt-1">
                    <span
                      className={`text-sm font-semibold ${
                        checkOut ? 'text-[#1c1c17]' : 'text-[#9aa2a7]'
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
            </div>

            {/* Reserve Button */}
            <button
              onClick={() => onBookNow(room, { checkIn, checkOut, guests })}
              className="w-full bg-[#087ea4] hover:bg-[#006483] text-white font-bold text-base py-4 rounded-2xl floating-shadow hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            >
              Reserve Now
            </button>

            <p className="text-center text-xs text-[#6f787e]">
              You won't be charged yet • Free cancellation up to 48 hours prior
            </p>

            {/* Price Breakdown */}
            <div className="space-y-3 pt-4 border-t border-[#e5e2db] text-sm">
              <div className="flex justify-between text-[#3f484e]">
                <span>${room.price} x {nights} nights</span>
                <span className="font-semibold text-[#1c1c17]">${roomTotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-[#3f484e]">
                <span>Resort & Beach Access Fee</span>
                <span className="font-semibold text-[#1c1c17]">${resortFee}</span>
              </div>
              <div className="flex justify-between text-[#3f484e]">
                <span>Taxes & Tourism Dues</span>
                <span className="font-semibold text-[#1c1c17]">${taxes}</span>
              </div>

              <div className="flex justify-between pt-4 border-t border-[#e5e2db] text-base font-extrabold text-[#1c1c17]">
                <span>Total Due</span>
                <span className="text-[#087ea4]">${grandTotal.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* "More to Explore" Related Rooms Section */}
      <div className="mt-20 md:mt-28 pt-12 border-t border-[#e5e2db]">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#1c1c17] tracking-tight">
              More to Explore
            </h2>
            <p className="text-[#6f787e] text-sm mt-1">
              Discover other exquisite suites & beach villas at Funcity Resort.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {RESORT_ROOMS.filter((r) => r.id !== room.id).map((otherRoom) => (
            <div
              key={otherRoom.id}
              onClick={() => {
                onSelectRoom(otherRoom);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="bg-white rounded-[24px] overflow-hidden sunlight-shadow hover:sunlight-shadow-hover hover:-translate-y-1.5 transition-all duration-300 border border-[#e5e2db] flex flex-col group cursor-pointer"
            >
              {/* Room Image */}
              <div className="relative h-56 w-full overflow-hidden">
                <img
                  src={otherRoom.mainImage}
                  alt={otherRoom.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-md text-[#006483] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow">
                  {otherRoom.badge}
                </span>
                <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md text-white text-xs font-semibold px-3 py-1 rounded-full">
                  ${otherRoom.price} / night
                </div>
              </div>

              {/* Room Body */}
              <div className="p-6 flex flex-col flex-grow justify-between">
                <div>
                  <h3 className="text-xl font-bold text-[#1c1c17] group-hover:text-[#087ea4] transition-colors">
                    {otherRoom.title}
                  </h3>
                  <p className="text-[#6f787e] text-xs line-clamp-2 mt-2 leading-relaxed">
                    {otherRoom.description}
                  </p>
                </div>

                <div className="pt-5 mt-5 border-t border-[#e5e2db] flex items-center justify-between text-xs font-semibold text-[#087ea4]">
                  <span>{otherRoom.specs.guests} • {otherRoom.specs.sqft}</span>
                  <div className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    <span>View Suite</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center p-4 animate-in fade-in duration-200">
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-6 right-6 text-white/80 hover:text-white p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors focus:outline-none"
            aria-label="Close Lightbox"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="relative max-w-5xl max-h-[80vh] w-full flex items-center justify-center">
            <img
              src={room.galleryImages[activePhotoIdx] || room.mainImage}
              alt="Room view"
              className="max-h-[75vh] w-auto max-w-full object-contain rounded-xl shadow-2xl"
            />

            {/* Carousel buttons */}
            <button
              onClick={() =>
                setActivePhotoIdx((prev) =>
                  prev === 0 ? room.galleryImages.length - 1 : prev - 1
                )
              }
              className="absolute left-2 md:-left-12 p-3 rounded-full bg-white/20 hover:bg-white/40 text-white backdrop-blur transition-all"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              onClick={() =>
                setActivePhotoIdx((prev) =>
                  prev === room.galleryImages.length - 1 ? 0 : prev + 1
                )
              }
              className="absolute right-2 md:-right-12 p-3 rounded-full bg-white/20 hover:bg-white/40 text-white backdrop-blur transition-all"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          <div className="text-white/80 text-sm mt-4">
            Photo {activePhotoIdx + 1} of {room.galleryImages.length}
          </div>
        </div>
      )}
    </section>
  );
};
