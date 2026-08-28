import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  Mail,
  Send,
  CheckCircle2,
  Navigation,
  Star,
  ExternalLink,
  Clock,
  Compass
} from 'lucide-react';
import { TESTIMONIALS } from '../data/resortData';

export const ContactSection: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.message) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setFormData({ fullName: '', email: '', phone: '', message: '' });
    }, 800);
  };

  const mainTestimonial = TESTIMONIALS[0];

  return (
    <div className="w-full bg-[#fcf9f1]">
      {/* Top Banner with Beach Background and Wave Divider */}
      <div className="relative w-full h-[320px] md:h-[400px] flex flex-col items-center justify-center text-center overflow-hidden">
        <img
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuACqWFcttmHbbOba6mepMsgCof1MywUHwXbQkoo0T5byjgJoRt-CazQ3_qknlpobHGZeswXcEIX7i78rEpa90TacJod5DI8bYI_skgU_Qtl0RQ4x7EnYuGBmbmAEMN2l1h6AbYSBujGFP2rufjGXoWXYPyUwXEST-XonD2DNDXZiDJXNzoKIwG8wZci9fL3jIP1SoC0PEy6H1qLJm31gjlsNlhxW1udc5cF0b1iNRI7A2moUyiNIcvtnw"
          alt="Beach resort background"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/35" />

        {/* Title in Header Banner */}
        <div className="relative z-20 flex flex-col items-center px-4">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight drop-shadow-md">
            Contact Us
          </h1>
          {/* Cyan Wave Graphic */}
          <div className="w-20 h-2 bg-[#35BFD0] rounded-full mt-3 shadow-sm" />
        </div>

        {/* Organic Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0 w-full overflow-hidden leading-none z-10 pointer-events-none translate-y-[2px]">
          <svg
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
            className="relative block w-full h-[45px] md:h-[70px] text-[#fcf9f1] fill-current"
          >
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" />
          </svg>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="max-w-[1280px] mx-auto px-4 md:px-12 py-12 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          {/* Left Column: "Get in Touch" Form (7 Cols) */}
          <div className="lg:col-span-7 bg-white rounded-[24px] p-8 md:p-10 sunlight-shadow border border-[#e5e2db]">
            <div className="mb-8">
              <h2 className="text-2xl md:text-3xl font-extrabold text-[#1c1c17] tracking-tight">
                Get in Touch
              </h2>
              <p className="text-[#3f484e] text-sm md:text-base mt-2 leading-relaxed">
                Whether planning a getaway, hosting a private beachfront celebration, or inquiring about custom suites, our dedicated hospitality team is here to assist.
              </p>
            </div>

            {submitted ? (
              <div className="bg-[#f6f3eb] rounded-2xl p-8 text-center border border-[#e5e2db] animate-in fade-in zoom-in-95 duration-200">
                <div className="w-14 h-14 bg-[#087ea4]/10 text-[#087ea4] rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-[#1c1c17]">Message Received!</h3>
                  <p className="text-[#3f484e] text-sm mt-2 max-w-md mx-auto">
                  Thank you for reaching out to Funcity Resort. Our guest relations team will respond to your inquiry within 2-4 hours.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-6 bg-[#087ea4] hover:bg-[#006483] text-white text-xs font-bold px-6 py-2.5 rounded-full transition-colors"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#3f484e] mb-2">
                    Full Name <span className="text-[#087ea4]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Eleanor Vance"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full bg-[#fcf9f1]/70 border border-[#bec8ce] rounded-xl px-4 py-3.5 text-sm text-[#1c1c17] focus:outline-none focus:border-[#087ea4] focus:bg-white transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#3f484e] mb-2">
                      Email Address <span className="text-[#087ea4]">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="eleanor@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-[#fcf9f1]/70 border border-[#bec8ce] rounded-xl px-4 py-3.5 text-sm text-[#1c1c17] focus:outline-none focus:border-[#087ea4] focus:bg-white transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#3f484e] mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      placeholder="+994 50 000 00 00"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-[#fcf9f1]/70 border border-[#bec8ce] rounded-xl px-4 py-3.5 text-sm text-[#1c1c17] focus:outline-none focus:border-[#087ea4] focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#3f484e] mb-2">
                    Your Message <span className="text-[#087ea4]">*</span>
                  </label>
                  <textarea
                    required
                    rows={5}
                    placeholder="Tell us about your upcoming stay, event requests, or any questions..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-[#fcf9f1]/70 border border-[#bec8ce] rounded-xl p-4 text-sm text-[#1c1c17] focus:outline-none focus:border-[#087ea4] focus:bg-white transition-all resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#087ea4] hover:bg-[#006483] text-white font-bold text-base py-4 rounded-xl floating-shadow hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
                >
                  <Send className="w-4 h-4" />
                  <span>{loading ? 'Sending Request...' : 'Send Message'}</span>
                </button>
              </form>
            )}
          </div>

          {/* Right Column: Contact Info & Find Us Map (5 Cols) */}
          <div className="lg:col-span-5 space-y-8">
            {/* Contact Information Block */}
            <div className="bg-white rounded-[24px] p-8 sunlight-shadow border border-[#e5e2db] space-y-6">
              <h3 className="text-xl font-bold text-[#1c1c17] tracking-tight">
                Contact Information
              </h3>

              <div className="space-y-5">
                {/* Address */}
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-full bg-[#f6f3eb] text-[#087ea4] flex items-center justify-center flex-shrink-0 border border-[#e5e2db]">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#6f787e]">
                      Resort Location
                    </h4>
                    <p className="text-sm font-semibold text-[#1c1c17] mt-0.5">
                      Baku Seaside Boulevard & Coastal Bay, Azerbaijan
                    </p>
                    <p className="text-xs text-[#6f787e] mt-0.5">
                      123 Coastal Breeze Way, Azure Bay
                    </p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-full bg-[#f6f3eb] text-[#087ea4] flex items-center justify-center flex-shrink-0 border border-[#e5e2db]">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#6f787e]">
                      Phone Number
                    </h4>
                    <a
                      href="tel:+994500000000"
                      className="text-sm font-bold text-[#087ea4] hover:underline block mt-0.5"
                    >
                      +994 50 000 00 00
                    </a>
                    <span className="text-xs text-[#6f787e]">
                      Available 24/7 for VIP reservations
                    </span>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-full bg-[#f6f3eb] text-[#087ea4] flex items-center justify-center flex-shrink-0 border border-[#e5e2db]">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#6f787e]">
                      Email Inquiries
                    </h4>
                    <a
                      href="mailto:reservations@funcityresort.com"
                      className="text-sm font-semibold text-[#1c1c17] hover:text-[#087ea4] block mt-0.5"
                    >
                      reservations@funcityresort.com
                    </a>
                    <a
                      href="mailto:info@funcityresort.com"
                      className="text-xs text-[#6f787e] hover:text-[#087ea4] block"
                    >
                      info@funcityresort.com
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* "Find Us" Interactive Map Card */}
            <div className="bg-white rounded-[24px] overflow-hidden sunlight-shadow border border-[#e5e2db]">
              <div className="p-5 border-b border-[#e5e2db] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Compass className="w-5 h-5 text-[#087ea4]" />
                  <h3 className="font-bold text-[#1c1c17]">Find Us</h3>
                </div>
                <span className="text-xs text-[#6f787e]">15 min from Airport</span>
              </div>

              {/* Map View Frame */}
              <div className="relative h-56 w-full group">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDyz6GRWIi9wXVQ5rN_jekGApOlAfOUtIBlGtJiZK1vTIEMxwM1NK3wHhCmU1njX9As2hNCbTAgtrqngYbaqKXTiAMSUU9CPKEUJNT_6RwY6YiP6QuOFLYhbc8rBaH3CpmHbSdzvmGVLz37BrwmEZ43V-A32YDz_PwrYhkPyLJwQmM0HP0pu-I109MT49PXyqBewuWZTYP7xg4ykD5vi1NvEyby4vpnIdTVhlcrq0cf4N1zOcbX5jlkmA"
                  alt="Resort Satellite Location Map"
                  className="w-full h-full object-cover"
                />

                {/* Floating Map Pin Badge */}
                <div className="absolute inset-0 flex items-center justify-center p-4">
                  <div className="bg-white/95 backdrop-blur-md p-3.5 rounded-xl shadow-xl border border-white/80 max-w-xs text-center flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-[#087ea4] text-white flex items-center justify-center mb-1.5 shadow">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold text-[#1c1c17]">Funcity Resort</span>
                    <span className="text-[11px] text-[#6f787e] mt-0.5">Baku Seaside Promenade</span>
                    <a
                      href="https://maps.google.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2.5 inline-flex items-center gap-1.5 bg-[#087ea4] text-white text-[11px] font-bold px-3 py-1.5 rounded-full hover:bg-[#006483] transition-colors"
                    >
                      <Navigation className="w-3 h-3" />
                      <span>Get Directions</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Testimonial Section Quote Card matching Image 7 */}
        <div className="mt-16 md:mt-24 bg-white rounded-[24px] p-8 md:p-12 sunlight-shadow border border-[#e5e2db] flex flex-col md:flex-row items-center gap-8">
          <img
            src={mainTestimonial.avatar}
            alt={mainTestimonial.name}
            className="w-24 h-24 md:w-28 md:h-28 rounded-full object-cover border-4 border-[#f6f3eb] shadow-md flex-shrink-0"
          />
          <div className="flex-grow text-center md:text-left space-y-3">
            <div className="flex items-center justify-center md:justify-start gap-1 text-amber-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-current" />
              ))}
            </div>
            <p className="text-lg md:text-xl font-medium text-[#1c1c17] italic leading-relaxed">
              "{mainTestimonial.comment}"
            </p>
            <div>
              <span className="font-bold text-[#1c1c17] text-base">{mainTestimonial.name}</span>
              <span className="text-[#6f787e] text-sm ml-2">— {mainTestimonial.location}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
