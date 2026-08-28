import React, { useState } from 'react';
import { Umbrella, LifeBuoy, Wine, Trophy, ArrowRight, CheckCircle2, Clock, X } from 'lucide-react';
import { RESORT_SERVICES } from '../data/resortData';
import { ServiceItem } from '../types';
import BlurText from './BlurText';
import SplitText from './SplitText';

interface ServicesSectionProps {
  onSelectService?: (service: ServiceItem) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ onSelectService }) => {
  const [activeModalService, setActiveModalService] = useState<ServiceItem | null>(null);

  const getServiceIcon = (id: string) => {
    switch (id) {
      case 'relax':
        return <Umbrella className="w-8 h-8 text-[#087ea4]" />;
      case 'save':
        return <LifeBuoy className="w-8 h-8 text-[#087ea4]" />;
      case 'drink':
        return <Wine className="w-8 h-8 text-[#087ea4]" />;
      case 'game':
        return <Trophy className="w-8 h-8 text-[#087ea4]" />;
      default:
        return <Umbrella className="w-8 h-8 text-[#087ea4]" />;
    }
  };

  return (
    <section id="services-section" className="py-12 md:py-20 px-4 md:px-12 max-w-[1280px] mx-auto">
      {/* Section Header with Cyan Wave Underline */}
      <div className="flex flex-col items-center text-center mb-14 md:mb-18">
        <BlurText
          as="h2"
          text="SERVICE"
          animateBy="letters"
          delay={45}
          className="text-3xl md:text-4xl font-extrabold text-[#1c1c17] tracking-tight uppercase justify-center"
        />
        {/* Cyan wave graphic */}
        <div className="w-20 h-2 bg-[#35BFD0] rounded-full mt-3 mb-4" />
        <SplitText
          tag="p"
          splitType="words"
          delay={16}
          duration={0.6}
          from={{ opacity: 0, y: 16 }}
          to={{ opacity: 1, y: 0 }}
          textAlign="center"
          text="Indulge in tailored beachside relaxation, certified marine safety, artisanal sunset cocktail mixology, and recreational coastal activities."
          className="max-w-2xl text-[#3f484e] text-base md:text-lg leading-relaxed"
        />
      </div>

      {/* 4-Item Service Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {RESORT_SERVICES.map((service) => (
          <div
            key={service.id}
            onClick={() => {
              setActiveModalService(service);
              onSelectService?.(service);
            }}
            className="bg-white rounded-[24px] p-8 sunlight-shadow hover:sunlight-shadow-hover hover:-translate-y-2 transition-all duration-300 flex flex-col items-center text-center border border-[#e5e2db]/80 cursor-pointer group"
          >
            {/* Circular Icon Container */}
            <div className="w-24 h-24 rounded-full bg-[#f6f3eb] group-hover:bg-[#087ea4]/10 flex items-center justify-center mb-6 transition-colors duration-300 border border-[#e5e2db]">
              <div className="transform group-hover:scale-110 transition-transform duration-300">
                {getServiceIcon(service.id)}
              </div>
            </div>

            {/* Service Name */}
            <h3 className="text-xl font-bold text-[#1c1c17] tracking-wide mb-3 uppercase group-hover:text-[#087ea4] transition-colors">
              {service.name}
            </h3>

            {/* Service Short Description */}
            <p className="text-[#3f484e] text-sm leading-relaxed mb-6 flex-grow">
              {service.shortDesc}
            </p>

            {/* Learn More pill */}
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#087ea4] group-hover:text-[#006483] group-hover:translate-x-1 transition-all">
              <span>View Experience</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
        ))}
      </div>

      {/* Service Detail Modal */}
      {activeModalService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#fcf9f1] rounded-[24px] max-w-xl w-full overflow-hidden shadow-2xl border border-[#e5e2db] relative animate-in zoom-in-95 duration-200">
            {/* Header Image */}
            <div className="relative h-48 sm:h-56 w-full">
              <img
                src={activeModalService.image}
                alt={activeModalService.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <button
                onClick={() => setActiveModalService(null)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center transition-colors focus:outline-none"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="absolute bottom-4 left-6 right-6 text-white">
                <span className="text-xs font-bold uppercase tracking-wider bg-[#35BFD0] text-[#006483] px-2.5 py-0.5 rounded-full mb-1.5 inline-block">
                  {activeModalService.category}
                </span>
                <h3 className="text-2xl font-bold text-white uppercase tracking-tight">
                  {activeModalService.name} Experience
                </h3>
              </div>
            </div>

            {/* Content Body */}
            <div className="p-6 md:p-8 space-y-6">
              <p className="text-[#3f484e] text-base leading-relaxed">
                {activeModalService.fullDesc}
              </p>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#1c1c17] mb-3">
                  Service Highlights & Inclusions
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {activeModalService.features.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm text-[#1c1c17]">
                      <CheckCircle2 className="w-4 h-4 text-[#087ea4] flex-shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-[#e5e2db]">
                <div className="flex items-center gap-2 text-xs text-[#6f787e]">
                  <Clock className="w-4 h-4 text-[#087ea4]" />
                  <span>Hours: {activeModalService.operatingHours}</span>
                </div>
                <button
                  onClick={() => setActiveModalService(null)}
                  className="bg-[#087ea4] hover:bg-[#006483] text-white text-xs font-semibold px-5 py-2.5 rounded-full transition-colors"
                >
                  Close & Continue
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
