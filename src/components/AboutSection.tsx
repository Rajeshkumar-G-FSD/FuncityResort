import React from 'react';
import {
  Star,
  MapPin,
  CalendarDays,
  BedDouble,
  Briefcase,
  Users,
  ConciergeBell,
  Dumbbell,
  UtensilsCrossed,
  CalendarCheck,
  ShieldCheck,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import BlurText from './BlurText';
import SplitText from './SplitText';

interface AboutSectionProps {
  onOpenBooking?: () => void;
}

const ROOM_CATEGORIES = [
  {
    icon: BedDouble,
    name: 'Deluxe Rooms',
    desc: 'Spacious and elegantly furnished, these rooms feature premium Free Cancellation, WiFi, and Air Conditioning — ideal for solo travelers and couples.',
  },
  {
    icon: Briefcase,
    name: 'Executive Suites',
    desc: 'Perfect for business travelers, these suites include a private work area and exclusive amenities.',
  },
  {
    icon: Users,
    name: 'Family Suites',
    desc: 'Designed for families, these suites offer interconnected rooms with ample space and kid-friendly amenities.',
  },
];

const AMENITIES = [
  {
    icon: ConciergeBell,
    text: '24/7 concierge service to assist with Love Dale Junction bookings and personalized itineraries.',
  },
  {
    icon: Dumbbell,
    text: 'State-of-the-art fitness center and spa facilities for a rejuvenating stay.',
  },
  {
    icon: UtensilsCrossed,
    text: 'Multiple dining options serving an array of Tea/Coffee Maker selections to delight every palate.',
  },
  {
    icon: CalendarCheck,
    text: 'Event and meeting spaces equipped with the latest technology for seamless gatherings.',
  },
];

export const AboutSection: React.FC<AboutSectionProps> = ({ onOpenBooking }) => {
  return (
    <section id="about-section" className="py-12 md:py-20 px-4 md:px-12 max-w-[1280px] mx-auto">
      {/* Section Header */}
      <div className="flex flex-col items-center text-center mb-14 md:mb-18">
        <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#087ea4] mb-3">
          About Us
        </span>
        <BlurText
          as="h2"
          text="Fun City in Lovedale, Ooty"
          className="text-3xl md:text-4xl font-extrabold text-[#1c1c17] tracking-tight uppercase justify-center"
        />
        <div className="w-20 h-2 bg-[#35BFD0] rounded-full mt-3 mb-5" />
        <SplitText
          tag="p"
          splitType="words"
          delay={12}
          duration={0.55}
          from={{ opacity: 0, y: 14 }}
          to={{ opacity: 1, y: 0 }}
          textAlign="center"
          text="Fun City in Lovedale, Ooty is a comfortable base for travellers seeking a clean, well-run stay. Established in 2014, the hotel sits right by Love Dale Junction on Coonoor Road, with easy access to Ooty's key destinations and a team focused on guest satisfaction and prompt service."
          className="max-w-3xl text-[#3f484e] text-base md:text-lg leading-relaxed"
        />

        {/* Key facts */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-7">
          <span className="flex items-center gap-1.5 bg-white border border-[#e5e2db] rounded-full px-4 py-2 text-sm font-semibold text-[#1c1c17] sunlight-shadow">
            <Star className="w-4 h-4 fill-current text-amber-500" />
            3.7 Rating
          </span>
          <span className="flex items-center gap-1.5 bg-white border border-[#e5e2db] rounded-full px-4 py-2 text-sm font-semibold text-[#1c1c17] sunlight-shadow">
            <Users className="w-4 h-4 text-[#087ea4]" />
            413 Reviews
          </span>
          <span className="flex items-center gap-1.5 bg-white border border-[#e5e2db] rounded-full px-4 py-2 text-sm font-semibold text-[#1c1c17] sunlight-shadow">
            <CalendarDays className="w-4 h-4 text-[#087ea4]" />
            Established 2014
          </span>
          <span className="flex items-center gap-1.5 bg-white border border-[#e5e2db] rounded-full px-4 py-2 text-sm font-semibold text-[#1c1c17] sunlight-shadow">
            <MapPin className="w-4 h-4 text-[#087ea4]" />
            Lovedale, Ooty
          </span>
        </div>
      </div>

      {/* Overview */}
      <div className="bg-white rounded-[24px] p-8 md:p-12 sunlight-shadow border border-[#e5e2db]/80 mb-10">
        <BlurText
          as="h3"
          text="Overview"
          className="text-2xl font-bold text-[#1c1c17] tracking-tight mb-4"
        />
        <p className="text-[#3f484e] text-base leading-relaxed">
          At Fun City, guests are treated to a blend of modern amenities and classic hospitality.
          Each room and suite is meticulously designed to offer unparalleled comfort, featuring Free
          Cancellation, WiFi, and AC that cater to every need. Whether you're traveling for business
          or leisure, the hotel's prime location and impeccable service ensure a memorable stay.
        </p>
      </div>

      {/* Room Categories */}
      <div className="mb-10">
        <div className="text-center mb-8">
          <BlurText
            as="h3"
            text="Room Categories"
            className="text-2xl md:text-3xl font-bold text-[#1c1c17] tracking-tight justify-center"
          />
          <p className="max-w-2xl mx-auto text-[#3f484e] text-sm md:text-base leading-relaxed mt-2">
            Fun City in Lovedale, Ooty offers a variety of accommodation options tailored to suit
            every guest's preferences. These include:
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {ROOM_CATEGORIES.map((room) => (
            <div
              key={room.name}
              className="bg-white rounded-[24px] p-8 sunlight-shadow hover:sunlight-shadow-hover hover:-translate-y-2 transition-all duration-300 flex flex-col items-center text-center border border-[#e5e2db]/80"
            >
              <div className="w-20 h-20 rounded-full bg-[#f6f3eb] flex items-center justify-center mb-6 border border-[#e5e2db]">
                <room.icon className="w-8 h-8 text-[#087ea4]" />
              </div>
              <h4 className="text-lg font-bold text-[#1c1c17] tracking-wide mb-3">{room.name}</h4>
              <p className="text-[#3f484e] text-sm leading-relaxed">{room.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Amenities and Services */}
      <div className="bg-white rounded-[24px] p-8 md:p-12 sunlight-shadow border border-[#e5e2db]/80 mb-10">
        <BlurText
          as="h3"
          text="Amenities and Services"
          className="text-2xl font-bold text-[#1c1c17] tracking-tight mb-2"
        />
        <p className="text-[#3f484e] text-sm md:text-base leading-relaxed mb-8">
          The hotel provides a range of services to enhance your experience, including:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {AMENITIES.map((item, idx) => (
            <div key={idx} className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#087ea4]/10 flex items-center justify-center flex-shrink-0">
                <item.icon className="w-5 h-5 text-[#087ea4]" />
              </div>
              <p className="text-[#3f484e] text-sm leading-relaxed pt-1">{item.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Commitment to Excellence */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-10">
        <div className="lg:col-span-7 bg-white rounded-[24px] p-8 md:p-12 sunlight-shadow border border-[#e5e2db]/80">
          <div className="flex items-center gap-3 mb-4">
            <ShieldCheck className="w-6 h-6 text-[#087ea4]" />
            <BlurText
              as="h3"
              text="Commitment to Excellence"
              className="text-2xl font-bold text-[#1c1c17] tracking-tight"
            />
          </div>
          <p className="text-[#3f484e] text-base leading-relaxed mb-4">
            At Fun City, every detail is thoughtfully curated to provide an exceptional experience.
            From the moment you check in to the time you depart, the hotel's dedicated team ensures
            personalized service, catering to your every need. With years of experience and a passion
            for hospitality, Fun City continues to be a preferred choice for travelers visiting Ooty.
          </p>
          <p className="text-[#3f484e] text-base leading-relaxed">
            Thank you for considering Fun City in Lovedale, Ooty for your stay. Whether you're here
            for leisure or business, their goal is to make your experience truly unforgettable.
          </p>
        </div>

        {/* Summary card */}
        <div className="lg:col-span-5 bg-[#006483] text-white rounded-[24px] p-8 md:p-12 floating-shadow flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-[#35BFD0]" />
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#35BFD0]">
                Summary
              </span>
            </div>
            <p className="text-white/90 text-base leading-relaxed">
              Fun City in Lovedale, Ooty is a premier hospitality destination, offering luxurious
              accommodations and top-notch amenities. Book your experience today and discover why they
              are rated 3.7 by countless satisfied guests.
            </p>
          </div>
          <button
            onClick={onOpenBooking}
            className="mt-8 w-full sm:w-auto self-start bg-white text-[#006483] font-bold text-sm py-3.5 px-7 rounded-full flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-transform cursor-pointer"
          >
            Book Your Stay
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
