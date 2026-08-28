import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { BookingSearchWidget } from './components/BookingSearchWidget';
import { AboutSection } from './components/AboutSection';
import { ServicesSection } from './components/ServicesSection';
import { RoomsPage } from './components/RoomsPage';
import { GallerySection } from './components/GallerySection';
import { TestimonialsSection } from './components/TestimonialsSection';
import { ContactSection } from './components/ContactSection';
import { BookingPopup } from './components/BookingPopup';
import { BookingPage } from './components/BookingPage';
import { Footer } from './components/Footer';
import { RESORT_ROOMS, RESORT_SERVICES, TESTIMONIALS } from './data/resortData';
import { Room, ServiceItem } from './types';
import { Star, ArrowRight, ShieldCheck, Waves, Sparkles, MapPin, Phone, CalendarCheck } from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [selectedRoom, setSelectedRoom] = useState<Room>(RESORT_ROOMS[0]);
  const [isBookingPopupOpen, setIsBookingPopupOpen] = useState(false);
  const [bookingCategoryId, setBookingCategoryId] = useState<string | undefined>(undefined);
  const [searchCriteria, setSearchCriteria] = useState<{
    checkIn: string;
    checkOut: string;
    guests: string;
    rooms: string;
  }>({
    checkIn: '',
    checkOut: '',
    guests: '2 Adults',
    rooms: '1 Room',
  });

  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  // Navigate to the full booking page (optionally pre-selecting a room category)
  const goToBookingPage = (categoryId?: string) => {
    setBookingCategoryId(categoryId);
    setActiveTab('booking');
    scrollTop();
  };

  // Inline search widget on the home page -> jump straight to the booking page
  const handleSearch = (criteria: {
    checkIn: string;
    checkOut: string;
    guests: string;
    rooms: string;
  }) => {
    setSearchCriteria(criteria);
    setBookingCategoryId(undefined);
    goToBookingPage();
  };

  // Header / footer "Book Now" -> open the quick popup dialog
  const openBookingPopup = () => setIsBookingPopupOpen(true);

  // "Search" inside the popup -> close it and open the booking page
  const handlePopupSearch = (criteria: {
    checkIn: string;
    checkOut: string;
    guests: string;
    rooms: string;
  }) => {
    setSearchCriteria(criteria);
    setBookingCategoryId(undefined);
    setIsBookingPopupOpen(false);
    goToBookingPage();
  };

  const goToRooms = () => {
    setActiveTab('rooms');
    scrollTop();
  };

  return (
    <div className="min-h-screen bg-[#fcf9f1] text-[#1c1c17] flex flex-col font-sans selection:bg-[#087ea4] selection:text-white">
      {/* Fixed Sticky Header Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenBooking={openBookingPopup}
        isScrolledForce={activeTab !== 'home'}
      />

      {/* Main App Body */}
      <main className="flex-grow">
        {/* ================= 1. HOME TAB ================= */}
        {activeTab === 'home' && (
          <div>
            {/* Clean Hero Section (Text removed from hero as requested) */}
            <HeroSection onExploreClick={goToRooms} />

            {/* Floating Booking Search Widget */}
            <BookingSearchWidget onSearch={handleSearch} />

            {/* Services Section */}
            <ServicesSection
              onSelectService={(service) => {
                // optional callback
              }}
            />

            {/* Featured Suite Spotlight Showcase */}
            <section className="py-12 md:py-20 px-4 md:px-12 max-w-[1280px] mx-auto">
              <div className="bg-white rounded-[28px] overflow-hidden sunlight-shadow border border-[#e5e2db] grid grid-cols-1 lg:grid-cols-12 gap-0">
                {/* Image Bento Side (7 Cols) */}
                <div className="lg:col-span-7 relative h-[320px] sm:h-[400px] lg:h-auto overflow-hidden group">
                  <img
                    src={selectedRoom.mainImage}
                    alt={selectedRoom.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute top-5 left-5 bg-white/95 backdrop-blur-md text-[#006483] text-xs font-bold px-3.5 py-1.5 rounded-full uppercase tracking-wider shadow">
                    Featured Signature Suite
                  </div>
                  <div className="absolute bottom-5 left-5 text-white">
                    <span className="text-sm font-semibold opacity-90">Starting from</span>
                    <p className="text-2xl font-extrabold">${selectedRoom.price} / night</p>
                  </div>
                </div>

                {/* Details Side (5 Cols) */}
                <div className="lg:col-span-5 p-8 md:p-12 flex flex-col justify-between space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center text-amber-500 font-semibold text-sm">
                        <Star className="w-4 h-4 fill-current mr-1" />
                        <span>{selectedRoom.rating}</span>
                      </div>
                      <span className="text-[#bec8ce]">•</span>
                      <span className="text-xs text-[#6f787e]">{selectedRoom.reviewsCount} verified reviews</span>
                    </div>

                    <h3 className="text-2xl md:text-3xl font-extrabold text-[#1c1c17] tracking-tight">
                      {selectedRoom.title}
                    </h3>

                    <p className="text-sm text-[#3f484e] leading-relaxed line-clamp-4">
                      {selectedRoom.description}
                    </p>

                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <div className="bg-[#f6f3eb] p-2.5 rounded-xl text-center sm:text-left">
                        <span className="text-[10px] uppercase font-bold text-[#6f787e] block">Size</span>
                        <span className="text-xs font-bold text-[#1c1c17]">{selectedRoom.specs.sqft}</span>
                      </div>
                      <div className="bg-[#f6f3eb] p-2.5 rounded-xl text-center sm:text-left">
                        <span className="text-[10px] uppercase font-bold text-[#6f787e] block">Occupancy</span>
                        <span className="text-xs font-bold text-[#1c1c17]">{selectedRoom.specs.guests}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-3 pt-4 border-t border-[#e5e2db]">
                    <button
                      onClick={goToRooms}
                      className="w-full sm:w-auto flex-1 bg-[#087ea4] hover:bg-[#006483] text-white font-bold text-sm py-3.5 px-6 rounded-full text-center floating-shadow hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                    >
                      View Full Details
                    </button>
                    <button
                      onClick={openBookingPopup}
                      className="w-full sm:w-auto bg-[#f1eee6] hover:bg-[#ebe8e0] text-[#006483] font-bold text-sm py-3.5 px-6 rounded-full text-center transition-colors cursor-pointer"
                    >
                      Instant Reserve
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* Testimonials Preview Quote */}
            <section className="py-8 md:py-14 px-4 md:px-12 max-w-[1280px] mx-auto">
              <div className="bg-white rounded-[24px] p-8 md:p-12 sunlight-shadow border border-[#e5e2db] flex flex-col md:flex-row items-center gap-8">
                <img
                  src={TESTIMONIALS[0].avatar}
                  alt={TESTIMONIALS[0].name}
                  className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover border-4 border-[#f6f3eb] shadow-md flex-shrink-0"
                />
                <div className="flex-grow text-center md:text-left space-y-2">
                  <div className="flex items-center justify-center md:justify-start gap-1 text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-base md:text-lg font-medium text-[#1c1c17] italic leading-relaxed">
                    "{TESTIMONIALS[0].comment}"
                  </p>
                  <div>
                    <span className="font-bold text-[#1c1c17] text-sm">{TESTIMONIALS[0].name}</span>
                    <span className="text-[#6f787e] text-xs ml-2">— {TESTIMONIALS[0].location}</span>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* ================= 1b. ABOUT US TAB ================= */}
        {activeTab === 'about' && (
          <div className="pt-20 md:pt-24">
            <AboutSection onOpenBooking={openBookingPopup} />
          </div>
        )}

        {/* ================= 2. SERVICES TAB ================= */}
        {activeTab === 'services' && (
          <div className="pt-20 md:pt-24">
            <ServicesSection />
          </div>
        )}

        {/* ================= 3. ROOMS & SUITES PAGE ================= */}
        {activeTab === 'rooms' && (
          <RoomsPage
            onBack={() => {
              setActiveTab('home');
              scrollTop();
            }}
            onBook={(categoryId) => goToBookingPage(categoryId)}
          />
        )}

        {/* ================= 3b. BOOKING PAGE ================= */}
        {activeTab === 'booking' && (
          <BookingPage
            onBack={() => {
              setActiveTab('home');
              scrollTop();
            }}
            initialCategoryId={bookingCategoryId}
            initialCriteria={searchCriteria}
          />
        )}

        {/* ================= 4. GALLERY TAB ================= */}
        {activeTab === 'gallery' && (
          <div className="pt-20 md:pt-24">
            <GallerySection />
          </div>
        )}

        {/* ================= 5. TESTIMONIALS TAB ================= */}
        {activeTab === 'testimonials' && (
          <div className="pt-20 md:pt-24">
            <TestimonialsSection />
          </div>
        )}

        {/* ================= 6. CONTACT TAB ================= */}
        {activeTab === 'contact' && (
          <div className="pt-16 md:pt-20">
            <ContactSection />
          </div>
        )}
      </main>

      {/* Quick "Book Now" popup dialog */}
      <BookingPopup
        isOpen={isBookingPopupOpen}
        onClose={() => setIsBookingPopupOpen(false)}
        onSearch={handlePopupSearch}
      />

      {/* Luxury Footer */}
      <Footer
        setActiveTab={setActiveTab}
        onOpenBooking={openBookingPopup}
      />
    </div>
  );
}

export default App;
