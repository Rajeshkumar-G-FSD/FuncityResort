import React, { useState, useEffect } from 'react';
import { Phone, Menu, X, CalendarCheck, MessageCircle, ShieldCheck } from 'lucide-react';
import { RESORT_PHONES, RESORT_WHATSAPP } from '../data/contact';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenBooking: () => void;
  onAdmin: () => void;
  isScrolledForce?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenBooking,
  onAdmin,
  isScrolledForce = false,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About Us' },
    { id: 'services', label: 'Services' },
    { id: 'rooms', label: 'Rooms' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'testimonials', label: 'Testimonials' },
    { id: 'contact', label: 'Contact' },
  ];

  const effectiveScrolled = isScrolled || isScrolledForce || activeTab !== 'home';

  const handleNavClick = (tabId: string) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header
      id="main-header"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        effectiveScrolled
          ? 'bg-[#fcf9f1]/95 backdrop-blur-md shadow-sm border-b border-[#e5e2db]/60 py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-[1280px] mx-auto px-5 md:px-12 flex items-center justify-between">
        {/* Brand Logo */}
        <button
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-2.5 text-left group focus:outline-none"
        >
          <div
            className={`w-9 h-9 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-colors ${
              effectiveScrolled
                ? 'bg-[#006483]/10 text-[#006483]'
                : 'bg-white/20 backdrop-blur text-white group-hover:bg-white/30'
            }`}
          >
            <img src="/images/funcity_logo.png" alt="Funcity logo" className="w-6 h-6 md:w-8 md:h-8 object-contain" />
          </div>
          <span className="sr-only">Funcity Resort</span>
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 lg:gap-9">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`relative font-semibold text-[14px] tracking-wide transition-all py-1 cursor-pointer focus:outline-none ${
                  isActive
                    ? effectiveScrolled
                      ? 'text-[#006483]'
                      : 'text-white'
                    : effectiveScrolled
                    ? 'text-[#3f484e] hover:text-[#006483]'
                    : 'text-white/85 hover:text-white'
                }`}
              >
                {item.label}
                {isActive && (
                  <span
                    className={`absolute bottom-0 left-0 right-0 h-[2px] rounded-full transition-all ${
                      effectiveScrolled ? 'bg-[#006483]' : 'bg-white'
                    }`}
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Desktop Actions & Contact */}
        <div className="hidden md:flex items-center gap-5">
          <a
            href={RESORT_WHATSAPP.link}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${
              effectiveScrolled ? 'text-[#3f484e] hover:text-[#006483]' : 'text-white/90 hover:text-white drop-shadow-sm'
            }`}
          >
            <MessageCircle className="w-4 h-4 text-[#25D366]" />
            <span>{RESORT_WHATSAPP.display}</span>
          </a>

          <button
            onClick={onAdmin}
            className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${
              effectiveScrolled ? 'text-[#3f484e] hover:text-[#006483]' : 'text-white/85 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Admin</span>
          </button>

          <button
            onClick={onOpenBooking}
            className="bg-[#087ea4] hover:bg-[#006483] text-white font-semibold text-sm px-6 py-2.5 rounded-full floating-shadow hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
          >
            <CalendarCheck className="w-4 h-4" />
            <span>Book Now</span>
          </button>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-3 md:hidden">
          <button
            onClick={onOpenBooking}
            className="bg-[#087ea4] text-white text-xs font-semibold px-4 py-2 rounded-full shadow-sm"
          >
            Book
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`p-2 rounded-lg transition-colors ${
              effectiveScrolled ? 'text-[#1c1c17] hover:bg-[#ebe8e0]' : 'text-white hover:bg-white/20'
            }`}
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#fcf9f1] border-b border-[#e5e2db] px-5 py-6 shadow-xl animate-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col gap-4">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`text-left font-semibold text-base py-2.5 px-3 rounded-xl transition-colors flex items-center justify-between ${
                    isActive
                      ? 'bg-[#006483]/10 text-[#006483]'
                      : 'text-[#3f484e] hover:bg-[#f1eee6]'
                  }`}
                >
                  <span>{item.label}</span>
                  {isActive && <span className="w-2 h-2 rounded-full bg-[#006483]" />}
                </button>
              );
            })}

            <div className="pt-4 border-t border-[#e5e2db] flex flex-col gap-3">
              <a
                href={RESORT_WHATSAPP.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm font-semibold text-[#1c1c17] py-1"
              >
                <MessageCircle className="w-4 h-4 text-[#25D366]" />
                <span>WhatsApp {RESORT_WHATSAPP.display}</span>
              </a>
              {RESORT_PHONES.map((p) => (
                <a
                  key={p.tel}
                  href={`tel:${p.tel}`}
                  className="flex items-center gap-2 text-sm text-[#3f484e] py-1"
                >
                  <Phone className="w-4 h-4 text-[#006483]" />
                  <span>{p.display}</span>
                </a>
              ))}
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onAdmin();
                }}
                className="flex items-center gap-2 text-sm text-[#3f484e] py-1"
              >
                <ShieldCheck className="w-4 h-4 text-[#006483]" />
                <span>Admin login</span>
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenBooking();
                }}
                className="w-full bg-[#087ea4] hover:bg-[#006483] text-white font-semibold py-3 rounded-full text-center shadow-md transition-colors"
              >
                Reserve Your Stay
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
