import React, { useState } from 'react';
import {
  Phone,
  Mail,
  MapPin,
  Send,
  CheckCircle2,
} from 'lucide-react';

interface FooterProps {
  setActiveTab: (tab: string) => void;
  onOpenBooking: () => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab, onOpenBooking }) => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setSubscribed(true);
    setNewsletterEmail('');
    setTimeout(() => setSubscribed(false), 3500);
  };

  const scrollToTopAndSet = (tabId: string) => {
    setActiveTab(tabId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#f1eee6] border-t border-[#e5e2db] pt-16 pb-10 text-[#3f484e]">
      <div className="max-w-[1280px] mx-auto px-5 md:px-12">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-12 border-b border-[#bec8ce]/50">
          {/* Brand & Mission (2 Cols) */}
          <div className="lg:col-span-2 space-y-4">
            <div
              onClick={() => scrollToTopAndSet('home')}
              className="flex items-center gap-2.5 cursor-pointer group"
            >
              <div className="w-9 h-9 md:w-12 md:h-12 rounded-full bg-[#006483]/10 text-[#006483] flex items-center justify-center group-hover:bg-[#006483]/20 transition-colors">
                <img src="/images/funcity_logo.png" alt="Funcity logo" className="w-6 h-6 md:w-8 md:h-8 object-contain" />
              </div>
              <span className="sr-only">Funcity Resort</span>
            </div>

            <p className="text-sm text-[#3f484e] leading-relaxed max-w-sm">
              An exclusive seaside resort sanctuary nestled along the Baku coastline, where azure waves meet golden sands, world-class comfort, and bespoke hospitality.
            </p>

            {/* Newsletter Subscription */}
            <div className="pt-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#1c1c17] block mb-2">
                Resort Newsletter & Exclusive Offers
              </span>
              {subscribed ? (
                <div className="flex items-center gap-2 text-xs font-bold text-[#087ea4] bg-[#087ea4]/10 p-2.5 rounded-xl">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Subscribed! Welcome to the VIP Circle.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex items-center gap-2">
                  <input
                    type="email"
                    required
                    placeholder="Enter your email"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    className="bg-white border border-[#bec8ce] rounded-full px-4 py-2 text-xs text-[#1c1c17] focus:outline-none focus:border-[#087ea4] w-full max-w-xs"
                  />
                  <button
                    type="submit"
                    className="bg-[#087ea4] hover:bg-[#006483] text-white p-2 rounded-full shadow transition-colors flex-shrink-0 cursor-pointer"
                    aria-label="Subscribe to newsletter"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#1c1c17]">
              Explore
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => scrollToTopAndSet('home')}
                  className="hover:text-[#087ea4] transition-colors"
                >
                  Home Retreat
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToTopAndSet('services')}
                  className="hover:text-[#087ea4] transition-colors"
                >
                  Resort Services
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToTopAndSet('rooms')}
                  className="hover:text-[#087ea4] transition-colors"
                >
                  Suites & Villas
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToTopAndSet('gallery')}
                  className="hover:text-[#087ea4] transition-colors"
                >
                  Photo Gallery
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToTopAndSet('testimonials')}
                  className="hover:text-[#087ea4] transition-colors"
                >
                  Guest Stories
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToTopAndSet('contact')}
                  className="hover:text-[#087ea4] transition-colors"
                >
                  Contact & Location
                </button>
              </li>
            </ul>
          </div>

          {/* Resort Experiences */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#1c1c17]">
              Experiences
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <span className="hover:text-[#087ea4] cursor-pointer" onClick={() => scrollToTopAndSet('services')}>
                  Private Beach Cabanas
                </span>
              </li>
              <li>
                <span className="hover:text-[#087ea4] cursor-pointer" onClick={() => scrollToTopAndSet('services')}>
                  Sunset Cocktail Mixology
                </span>
              </li>
              <li>
                <span className="hover:text-[#087ea4] cursor-pointer" onClick={() => scrollToTopAndSet('services')}>
                  Lagoon Watersports
                </span>
              </li>
              <li>
                <span className="hover:text-[#087ea4] cursor-pointer" onClick={() => scrollToTopAndSet('services')}>
                  Oceanfront Wellness Spa
                </span>
              </li>
              <li>
                <button
                  onClick={onOpenBooking}
                  className="text-[#087ea4] font-semibold hover:underline block pt-1"
                >
                  Instant Online Booking →
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#1c1c17]">
              Contact Us
            </h4>
            <ul className="space-y-2.5 text-xs text-[#3f484e]">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#087ea4] flex-shrink-0 mt-0.5" />
                <span>Baku Seaside Boulevard, Azerbaijan</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#087ea4] flex-shrink-0" />
                <a href="tel:+994500000000" className="hover:text-[#087ea4] font-semibold">
                  +994 50 000 00 00
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#087ea4] flex-shrink-0" />
                <a
                  href="mailto:reservations@funcityresort.com"
                  className="hover:text-[#087ea4] truncate"
                >
                  reservations@funcityresort.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#6f787e]">
          <p>© {new Date().getFullYear()} Funcity Resort. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-[#087ea4] cursor-pointer">Privacy Policy</span>
            <span className="hover:text-[#087ea4] cursor-pointer">Terms of Service</span>
            <span className="hover:text-[#087ea4] cursor-pointer">Cookie Preferences</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
