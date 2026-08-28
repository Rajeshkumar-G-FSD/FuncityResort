import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './firebase';
import { LOCAL_ADMIN_KEY } from './data/admin';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { BookingSearchWidget, BookingSearch } from './components/BookingSearchWidget';
import { AboutSection } from './components/AboutSection';
import { ServicesSection } from './components/ServicesSection';
import { RoomsPage } from './components/RoomsPage';
import { GallerySection } from './components/GallerySection';
import { TestimonialsSection } from './components/TestimonialsSection';
import { ContactSection } from './components/ContactSection';
import { BookingPopup } from './components/BookingPopup';
import { BookingPage } from './components/BookingPage';
import { AdminLoginModal } from './components/AdminLoginModal';
import { AdminPage } from './components/AdminPage';
import { Footer } from './components/Footer';
import { ScrollToTop } from './components/ScrollToTop';
import { GuestValue, DEFAULT_GUESTS } from './components/GuestSelector';
import { TESTIMONIALS } from './data/resortData';
import { ROOM_TYPES, fromRate, inr } from './data/rooms';
import { RESORT_NAME } from './data/contact';
import { Star, MapPin, Wallet, Clock3 } from 'lucide-react';

const FROM_RATE = Math.min(...ROOM_TYPES.map(fromRate));

export function App() {
  const [activeTab, setActiveTab] = useState<string>('home');

  const [isBookingPopupOpen, setIsBookingPopupOpen] = useState(false);
  const [bookingRoomTypeId, setBookingRoomTypeId] = useState<string | undefined>(undefined);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guestValue, setGuestValue] = useState<GuestValue>(DEFAULT_GUESTS);

  // Firebase auth session: undefined = resolving, null = none, string = email
  const [fbUser, setFbUser] = useState<string | null | undefined>(undefined);
  const [localAdmin, setLocalAdmin] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem(LOCAL_ADMIN_KEY) === '1';
    } catch {
      return false;
    }
  });
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);

  const authResolved = fbUser !== undefined;
  const isAdmin = !!fbUser || localAdmin;
  const adminEmail = fbUser && fbUser !== 'admin' ? fbUser : null;

  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  useEffect(
    () => onAuthStateChanged(auth, (u) => setFbUser(u ? u.email ?? 'admin' : null)),
    []
  );

  // Deep-link: #admin opens the admin area (login first if needed)
  useEffect(() => {
    if (!authResolved) return;
    if (window.location.hash === '#admin') {
      if (isAdmin) setActiveTab('admin');
      else setIsAdminLoginOpen(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authResolved]);

  // If admin access is lost while on the panel, leave it
  useEffect(() => {
    if (!isAdmin && activeTab === 'admin') setActiveTab('home');
  }, [isAdmin, activeTab]);

  const handleAdminSignOut = () => {
    signOut(auth).catch(() => {});
    try {
      sessionStorage.removeItem(LOCAL_ADMIN_KEY);
    } catch {
      /* ignore */
    }
    setLocalAdmin(false);
    setActiveTab('home');
    scrollTop();
  };

  const handleAdminLoginSuccess = () => {
    setIsAdminLoginOpen(false);
    try {
      setLocalAdmin(sessionStorage.getItem(LOCAL_ADMIN_KEY) === '1');
    } catch {
      setLocalAdmin(true);
    }
    setActiveTab('admin');
    scrollTop();
  };

  const goToBookingPage = (roomTypeId?: string) => {
    setBookingRoomTypeId(roomTypeId);
    setActiveTab('booking');
    scrollTop();
  };

  const applySearch = (s: BookingSearch) => {
    setCheckIn(s.checkIn);
    setCheckOut(s.checkOut);
    setGuestValue(s.guests);
  };

  const handleSearch = (s: BookingSearch) => {
    applySearch(s);
    setBookingRoomTypeId(undefined);
    goToBookingPage();
  };

  const openBookingPopup = () => setIsBookingPopupOpen(true);

  const handlePopupSearch = (s: BookingSearch) => {
    applySearch(s);
    setBookingRoomTypeId(undefined);
    setIsBookingPopupOpen(false);
    goToBookingPage();
  };

  const goToRooms = () => {
    setActiveTab('rooms');
    scrollTop();
  };

  const openAdmin = () => {
    if (isAdmin) {
      setActiveTab('admin');
      scrollTop();
    } else {
      setIsAdminLoginOpen(true);
    }
  };

  /* ===================== ADMIN (full-screen, no site chrome) ===================== */
  if (activeTab === 'admin' && isAdmin) {
    return (
      <AdminPage
        adminEmail={adminEmail}
        onExit={() => {
          setActiveTab('home');
          scrollTop();
        }}
        onSignOut={handleAdminSignOut}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#fcf9f1] text-[#1c1c17] flex flex-col font-sans selection:bg-[#087ea4] selection:text-white">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenBooking={openBookingPopup}
        onAdmin={openAdmin}
        isScrolledForce={activeTab !== 'home'}
      />

      <main className="flex-grow">
        {activeTab === 'home' && (
          <div>
            <HeroSection onExploreClick={goToRooms} onAdmin={openAdmin} />
            <BookingSearchWidget onSearch={handleSearch} />
            <ServicesSection onSelectService={() => {}} />

            {/* Property Spotlight */}
            <section className="py-12 md:py-20 px-4 md:px-12 max-w-[1280px] mx-auto">
              <div className="bg-white rounded-[28px] overflow-hidden sunlight-shadow border border-[#e5e2db] grid grid-cols-1 lg:grid-cols-12 gap-0">
                <div className="lg:col-span-7 relative h-[320px] sm:h-[400px] lg:h-auto overflow-hidden group">
                  <img
                    src="/images/funcity_reception.JPG"
                    alt="Fun City Resorts reception, Lovedale, Ooty"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
                  <div className="absolute top-5 left-5 bg-white/95 backdrop-blur-md text-[#006483] text-xs font-bold px-3.5 py-1.5 rounded-full uppercase tracking-wider shadow">
                    Our Property
                  </div>
                </div>

                <div className="lg:col-span-5 p-8 md:p-12 flex flex-col justify-between space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center text-amber-500 font-semibold text-sm">
                        <Star className="w-4 h-4 fill-current mr-1" />
                        <span>3.7</span>
                      </div>
                      <span className="text-[#bec8ce]">•</span>
                      <span className="text-xs text-[#6f787e]">413 guest reviews</span>
                    </div>

                    <h3 className="text-2xl md:text-3xl font-extrabold text-[#1c1c17] tracking-tight">
                      {RESORT_NAME}
                    </h3>

                    <p className="text-sm text-[#3f484e] leading-relaxed">
                      Located in Lovedale, right by Love Dale Junction on Coonoor Road, Fun City
                      Resorts offers spotless Couple and Family rooms with 24&#8209;hour hot water,
                      free Wi-Fi, air conditioning and prompt room service. Our reception is staffed
                      around the clock, and the toy&#8209;train station, Ooty Lake and the Botanical
                      Garden are all a short drive away — a comfortable, well&#8209;connected base for
                      your hill&#8209;station stay.
                    </p>

                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <div className="bg-[#f6f3eb] p-3 rounded-xl">
                        <span className="text-[10px] uppercase font-bold text-[#6f787e] flex items-center gap-1">
                          <Wallet className="w-3 h-3" /> Tariff
                        </span>
                        <span className="text-xs font-bold text-[#1c1c17]">
                          From {inr(FROM_RATE)} / night
                        </span>
                      </div>
                      <div className="bg-[#f6f3eb] p-3 rounded-xl">
                        <span className="text-[10px] uppercase font-bold text-[#6f787e] flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> Location
                        </span>
                        <span className="text-xs font-bold text-[#1c1c17]">Lovedale, Ooty</span>
                      </div>
                      <div className="bg-[#f6f3eb] p-3 rounded-xl">
                        <span className="text-[10px] uppercase font-bold text-[#6f787e] flex items-center gap-1">
                          <Clock3 className="w-3 h-3" /> Reception
                        </span>
                        <span className="text-xs font-bold text-[#1c1c17]">24 hours</span>
                      </div>
                      <div className="bg-[#f6f3eb] p-3 rounded-xl">
                        <span className="text-[10px] uppercase font-bold text-[#6f787e] block">
                          Rooms
                        </span>
                        <span className="text-xs font-bold text-[#1c1c17]">Couple &amp; Family</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-3 pt-4 border-t border-[#e5e2db]">
                    <button
                      onClick={goToRooms}
                      className="w-full sm:w-auto flex-1 bg-[#087ea4] hover:bg-[#006483] text-white font-bold text-sm py-3.5 px-6 rounded-full text-center floating-shadow hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                    >
                      View Rooms
                    </button>
                    <button
                      onClick={openBookingPopup}
                      className="w-full sm:w-auto bg-[#f1eee6] hover:bg-[#ebe8e0] text-[#006483] font-bold text-sm py-3.5 px-6 rounded-full text-center transition-colors cursor-pointer"
                    >
                      Book Now
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

        {activeTab === 'about' && (
          <div className="pt-20 md:pt-24">
            <AboutSection onOpenBooking={openBookingPopup} />
          </div>
        )}

        {activeTab === 'services' && (
          <div className="pt-20 md:pt-24">
            <ServicesSection />
          </div>
        )}

        {activeTab === 'rooms' && (
          <RoomsPage
            onBack={() => {
              setActiveTab('home');
              scrollTop();
            }}
            onBook={(roomTypeId) => goToBookingPage(roomTypeId)}
          />
        )}

        {activeTab === 'booking' && (
          <BookingPage
            onBack={() => {
              setActiveTab('home');
              scrollTop();
            }}
            initialRoomTypeId={bookingRoomTypeId}
            initialCheckIn={checkIn}
            initialCheckOut={checkOut}
            initialGuests={guestValue}
          />
        )}

        {activeTab === 'gallery' && (
          <div className="pt-20 md:pt-24">
            <GallerySection />
          </div>
        )}

        {activeTab === 'testimonials' && (
          <div className="pt-20 md:pt-24">
            <TestimonialsSection />
          </div>
        )}

        {activeTab === 'contact' && (
          <div className="pt-16 md:pt-20">
            <ContactSection />
          </div>
        )}
      </main>

      <BookingPopup
        isOpen={isBookingPopupOpen}
        onClose={() => setIsBookingPopupOpen(false)}
        onSearch={handlePopupSearch}
      />

      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onSuccess={handleAdminLoginSuccess}
      />

      <Footer
        setActiveTab={setActiveTab}
        onOpenBooking={openBookingPopup}
        onAdmin={openAdmin}
      />

      <ScrollToTop />
    </div>
  );
}

export default App;
