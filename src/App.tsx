import React, { useCallback, useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './firebase';
import { LOCAL_ADMIN_KEY } from './data/admin';
import { pathToTab, tabToPath } from './router';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { BookingSearchWidget, BookingSearch } from './components/BookingSearchWidget';
import { AboutSection } from './components/AboutSection';
import { ServicesSection } from './components/ServicesSection';
import { RoomsPage } from './components/RoomsPage';
import { GalleryPage } from './components/GalleryPage';
import { TestimonialsSection } from './components/TestimonialsSection';
import { ContactSection } from './components/ContactSection';
import { BookingPopup } from './components/BookingPopup';
import { BookingPage } from './components/BookingPage';
import { AdminLoginModal } from './components/AdminLoginModal';
import { AdminPage } from './components/AdminPage';
import { Footer } from './components/Footer';
import { ScrollToTop } from './components/ScrollToTop';
import { ReviewsMarquee } from './components/ReviewsMarquee';
import BlurText from './components/BlurText';
import SplitText from './components/SplitText';
import { GuestValue, DEFAULT_GUESTS } from './components/GuestSelector';
import { ROOM_TYPES, fromRate, inr } from './data/rooms';
import { RESORT_NAME } from './data/contact';
import { Star, MapPin, Wallet, Clock3 } from 'lucide-react';

const FROM_RATE = Math.min(...ROOM_TYPES.map(fromRate));

export function App() {
  const [activeTab, setActiveTab] = useState<string>(() =>
    typeof window !== 'undefined' ? pathToTab(window.location.pathname) : 'home'
  );

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

  // Change page + push a real URL
  const navigate = useCallback((tab: string) => {
    setActiveTab(tab);
    const path = tabToPath(tab);
    if (window.location.pathname !== path) window.history.pushState({}, '', path);
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  // Back / forward buttons
  useEffect(() => {
    const onPop = () => setActiveTab(pathToTab(window.location.pathname));
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  useEffect(
    () => onAuthStateChanged(auth, (u) => setFbUser(u ? u.email ?? 'admin' : null)),
    []
  );

  // Landing on /admin without access -> show login over the site
  useEffect(() => {
    if (!authResolved) return;
    if (activeTab === 'admin' && !isAdmin) {
      setIsAdminLoginOpen(true);
      setActiveTab('home');
      window.history.replaceState({}, '', tabToPath('home'));
    }
  }, [authResolved, activeTab, isAdmin]);

  const handleAdminSignOut = () => {
    signOut(auth).catch(() => {});
    try {
      sessionStorage.removeItem(LOCAL_ADMIN_KEY);
    } catch {
      /* ignore */
    }
    setLocalAdmin(false);
    navigate('home');
  };

  const handleAdminLoginSuccess = () => {
    setIsAdminLoginOpen(false);
    try {
      setLocalAdmin(sessionStorage.getItem(LOCAL_ADMIN_KEY) === '1');
    } catch {
      setLocalAdmin(true);
    }
    navigate('admin');
  };

  const goToBookingPage = (roomTypeId?: string) => {
    setBookingRoomTypeId(roomTypeId);
    navigate('booking');
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

  const goToRooms = () => navigate('rooms');

  const openAdmin = () => {
    if (isAdmin) navigate('admin');
    else setIsAdminLoginOpen(true);
  };

  /* ===================== ADMIN (full-screen, no site chrome) ===================== */
  if (activeTab === 'admin' && isAdmin) {
    return (
      <AdminPage
        adminEmail={adminEmail}
        onExit={() => navigate('home')}
        onSignOut={handleAdminSignOut}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#fcf9f1] text-[#1c1c17] flex flex-col font-sans selection:bg-[#087ea4] selection:text-white">
      <Navbar
        activeTab={activeTab}
        setActiveTab={navigate}
        onOpenBooking={openBookingPopup}
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

                    <BlurText
                      as="h3"
                      text={RESORT_NAME}
                      className="text-2xl md:text-3xl font-extrabold text-[#1c1c17] tracking-tight"
                    />

                    <SplitText
                      tag="p"
                      splitType="words"
                      delay={12}
                      duration={0.55}
                      from={{ opacity: 0, y: 14 }}
                      to={{ opacity: 1, y: 0 }}
                      textAlign="left"
                      text="Located in Lovedale, right by Love Dale Junction on Coonoor Road, Fun City Resorts offers spotless Couple and Family rooms with 24-hour hot water, free Wi-Fi, air conditioning and prompt room service. Our reception is staffed around the clock, and the toy-train station, Ooty Lake and the Botanical Garden are all a short drive away."
                      className="text-sm text-[#3f484e] leading-relaxed"
                    />

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

            {/* Google reviews — horizontal auto-slide */}
            <ReviewsMarquee onSeeAll={() => navigate('testimonials')} />
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
            onBack={() => navigate('home')}
            onBook={(roomTypeId) => goToBookingPage(roomTypeId)}
          />
        )}

        {activeTab === 'booking' && (
          <BookingPage
            onBack={() => navigate('home')}
            initialRoomTypeId={bookingRoomTypeId}
            initialCheckIn={checkIn}
            initialCheckOut={checkOut}
            initialGuests={guestValue}
          />
        )}

        {activeTab === 'gallery' && <GalleryPage onBack={() => navigate('home')} />}

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
        setActiveTab={navigate}
        onOpenBooking={openBookingPopup}
        onAdmin={openAdmin}
      />

      <ScrollToTop />
    </div>
  );
}

export default App;
