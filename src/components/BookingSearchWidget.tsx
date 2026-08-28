import React, { useState } from 'react';
import { Calendar, Users, BedDouble, Search, ChevronDown, Check } from 'lucide-react';

interface BookingSearchWidgetProps {
  onSearch: (criteria: {
    checkIn: string;
    checkOut: string;
    guests: string;
    rooms: string;
  }) => void;
}

export const BookingSearchWidget: React.FC<BookingSearchWidgetProps> = ({ onSearch }) => {
  const [checkIn, setCheckIn] = useState('24 Oct, 2024');
  const [checkOut, setCheckOut] = useState('28 Oct, 2024');
  const [guests, setGuests] = useState('2 Adults, 1 Child');
  const [rooms, setRooms] = useState('1 Room');
  
  const [guestDropdownOpen, setGuestDropdownOpen] = useState(false);
  const [roomDropdownOpen, setRoomDropdownOpen] = useState(false);

  const guestOptions = [
    '1 Adult',
    '2 Adults',
    '2 Adults, 1 Child',
    '2 Adults, 2 Children',
    '4+ Guests / Family',
  ];

  const roomOptions = ['1 Room', '2 Rooms', '3 Rooms', '4+ Suites & Villas'];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({
      checkIn,
      checkOut,
      guests,
      rooms,
    });
  };

  return (
    <section className="relative z-20 -mt-16 md:-mt-24 px-4 md:px-12 max-w-[1280px] mx-auto mb-16 md:mb-24">
      <div className="bg-[#ffffff] rounded-[24px] p-6 md:p-8 sunlight-shadow border border-[#e5e2db] flex flex-col md:flex-row items-center gap-5 justify-between w-full transition-all">
        <form
          onSubmit={handleSearchSubmit}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 w-full flex-grow"
        >
          {/* Check In Input */}
          <div className="flex flex-col gap-1.5 relative group">
            <label className="text-[12px] font-semibold text-[#3f484e] uppercase tracking-wider">
              Check In
            </label>
            <div className="flex items-center gap-2.5 border-b border-[#bec8ce] pb-2 group-focus-within:border-[#087ea4] transition-colors">
              <Calendar className="w-5 h-5 text-[#087ea4] flex-shrink-0" />
              <input
                type="text"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className="bg-transparent border-none p-0 focus:outline-none focus:ring-0 text-[16px] font-medium text-[#1c1c17] w-full placeholder:text-[#6f787e]"
                placeholder="24 Oct, 2024"
              />
            </div>
          </div>

          {/* Check Out Input */}
          <div className="flex flex-col gap-1.5 relative group">
            <label className="text-[12px] font-semibold text-[#3f484e] uppercase tracking-wider">
              Check Out
            </label>
            <div className="flex items-center gap-2.5 border-b border-[#bec8ce] pb-2 group-focus-within:border-[#087ea4] transition-colors">
              <Calendar className="w-5 h-5 text-[#087ea4] flex-shrink-0" />
              <input
                type="text"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className="bg-transparent border-none p-0 focus:outline-none focus:ring-0 text-[16px] font-medium text-[#1c1c17] w-full placeholder:text-[#6f787e]"
                placeholder="28 Oct, 2024"
              />
            </div>
          </div>

          {/* Guests Selector */}
          <div className="flex flex-col gap-1.5 relative">
            <label className="text-[12px] font-semibold text-[#3f484e] uppercase tracking-wider">
              Guests
            </label>
            <div
              onClick={() => {
                setGuestDropdownOpen(!guestDropdownOpen);
                setRoomDropdownOpen(false);
              }}
              className="flex items-center justify-between border-b border-[#bec8ce] pb-2 cursor-pointer hover:border-[#087ea4] transition-colors"
            >
              <div className="flex items-center gap-2.5 overflow-hidden">
                <Users className="w-5 h-5 text-[#087ea4] flex-shrink-0" />
                <span className="text-[16px] font-medium text-[#1c1c17] truncate">
                  {guests}
                </span>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-[#6f787e] transition-transform ${
                  guestDropdownOpen ? 'rotate-180 text-[#087ea4]' : ''
                }`}
              />
            </div>

            {guestDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-[#e5e2db] py-2 z-30 animate-in fade-in zoom-in-95 duration-150">
                {guestOptions.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => {
                      setGuests(opt);
                      setGuestDropdownOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm flex items-center justify-between hover:bg-[#f6f3eb] transition-colors ${
                      guests === opt ? 'text-[#087ea4] font-semibold bg-[#f6f3eb]/60' : 'text-[#1c1c17]'
                    }`}
                  >
                    <span>{opt}</span>
                    {guests === opt && <Check className="w-4 h-4 text-[#087ea4]" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Rooms Selector */}
          <div className="flex flex-col gap-1.5 relative">
            <label className="text-[12px] font-semibold text-[#3f484e] uppercase tracking-wider">
              Rooms
            </label>
            <div
              onClick={() => {
                setRoomDropdownOpen(!roomDropdownOpen);
                setGuestDropdownOpen(false);
              }}
              className="flex items-center justify-between border-b border-[#bec8ce] pb-2 cursor-pointer hover:border-[#087ea4] transition-colors"
            >
              <div className="flex items-center gap-2.5 overflow-hidden">
                <BedDouble className="w-5 h-5 text-[#087ea4] flex-shrink-0" />
                <span className="text-[16px] font-medium text-[#1c1c17] truncate">
                  {rooms}
                </span>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-[#6f787e] transition-transform ${
                  roomDropdownOpen ? 'rotate-180 text-[#087ea4]' : ''
                }`}
              />
            </div>

            {roomDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-[#e5e2db] py-2 z-30 animate-in fade-in zoom-in-95 duration-150">
                {roomOptions.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => {
                      setRooms(opt);
                      setRoomDropdownOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm flex items-center justify-between hover:bg-[#f6f3eb] transition-colors ${
                      rooms === opt ? 'text-[#087ea4] font-semibold bg-[#f6f3eb]/60' : 'text-[#1c1c17]'
                    }`}
                  >
                    <span>{opt}</span>
                    {rooms === opt && <Check className="w-4 h-4 text-[#087ea4]" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </form>

        {/* Search CTA Button */}
        <button
          onClick={handleSearchSubmit}
          className="w-full md:w-auto bg-[#087ea4] hover:bg-[#006483] text-white font-semibold text-[15px] px-8 py-3.5 md:py-4 rounded-[16px] floating-shadow hover:scale-105 active:scale-95 transition-all whitespace-nowrap mt-2 md:mt-0 flex items-center justify-center gap-2.5 cursor-pointer"
        >
          <Search className="w-5 h-5" />
          <span>Search</span>
        </button>
      </div>
    </section>
  );
};
