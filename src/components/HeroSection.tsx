import React, { useEffect, useRef, useState } from 'react';

interface HeroSectionProps {
  onExploreClick?: () => void;
}

const HERO_VIDEO = '/images/funcity_ooty_fog.mp4';
const HERO_POSTER = '/images/funcity.png';
// Seconds of overlap between the ending clip and the restarting clip
const CROSSFADE = 0.8;

export const HeroSection: React.FC<HeroSectionProps> = ({ onExploreClick }) => {
  const videoARef = useRef<HTMLVideoElement>(null);
  const videoBRef = useRef<HTMLVideoElement>(null);
  const activeIsARef = useRef(true);
  const [showB, setShowB] = useState(false);

  // Ping-pong two identical videos and crossfade at the loop point so the
  // restart is never visible as a jump / flash.
  useEffect(() => {
    const a = videoARef.current;
    const b = videoBRef.current;
    if (!a || !b) return;

    a.play().catch(() => {});

    let raf = 0;
    const tick = () => {
      const current = activeIsARef.current ? a : b;
      const next = activeIsARef.current ? b : a;
      const d = current.duration;

      // Clip too short to crossfade meaningfully -> plain seamless loop instead.
      if (d && !Number.isNaN(d) && d < CROSSFADE * 2 + 0.5) {
        a.loop = true;
        return; // stop the rAF loop
      }

      if (
        d &&
        !Number.isNaN(d) &&
        current.currentTime >= d - CROSSFADE &&
        next.paused
      ) {
        next.currentTime = 0;
        next.play().catch(() => {});
        activeIsARef.current = !activeIsARef.current;
        setShowB((prev) => !prev);
      }

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <section className="relative w-full h-[92vh] min-h-[560px] max-h-[900px] flex items-center justify-center overflow-hidden">
      {/* Seamless looping background video (crossfaded ping-pong) */}
      <div className="absolute inset-0 z-0 bg-black">
        <video
          ref={videoARef}
          className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-[900ms] ease-linear ${
            showB ? 'opacity-0' : 'opacity-100'
          }`}
          src={HERO_VIDEO}
          poster={HERO_POSTER}
          muted
          playsInline
          preload="auto"
        />
        <video
          ref={videoBRef}
          className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-[900ms] ease-linear ${
            showB ? 'opacity-100' : 'opacity-0'
          }`}
          src={HERO_VIDEO}
          poster={HERO_POSTER}
          muted
          playsInline
          preload="auto"
        />
        {/* Atmospheric darkening for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/40 pointer-events-none" />
      </div>

      {/* Centered Hero Copy */}
      <div className="relative z-20 mx-auto max-w-3xl px-6 text-center text-white">
        {/* Hero heading and descriptive paragraph removed per request */}
      </div>

      {/* Foamy Sea-Wash Divider at bottom of Hero (photo-style surf wash) */}
      <div className="absolute bottom-0 left-0 right-0 w-full overflow-hidden leading-none z-10 pointer-events-none translate-y-[1px]">
        <svg
          viewBox="0 0 1440 180"
          preserveAspectRatio="none"
          className="relative block w-full h-[95px] sm:h-[120px] md:h-[170px]"
        >
          {/* Layer 1 - far wisps of spray reaching highest */}
          <path
            fill="#fcf9f1"
            fillOpacity="0.4"
            d="M0,180 V104 Q30,70 60,96 Q90,116 120,98 Q150,72 184,96 Q210,112 240,96 Q270,74 304,96 Q330,112 360,98 Q390,76 424,96 Q450,112 484,98 Q516,74 548,96 Q580,112 612,98 Q644,74 678,96 Q710,112 742,98 Q774,74 808,96 Q840,112 872,98 Q904,76 938,96 Q966,112 1000,98 Q1032,74 1066,96 Q1096,112 1128,98 Q1160,74 1194,96 Q1224,112 1258,98 Q1290,76 1324,96 Q1356,112 1390,98 Q1416,80 1440,100 V180 Z"
          />
          {/* Layer 2 - mid body of the wash */}
          <path
            fill="#fcf9f1"
            fillOpacity="0.68"
            d="M0,180 V120 Q40,104 80,116 Q120,128 160,114 Q200,100 240,116 Q280,130 320,116 Q360,102 400,116 Q440,130 480,116 Q520,102 560,116 Q600,130 640,116 Q680,100 720,114 Q760,128 800,116 Q840,102 880,116 Q920,130 960,116 Q1000,102 1040,116 Q1080,130 1120,116 Q1160,100 1200,114 Q1240,128 1280,116 Q1320,102 1360,116 Q1400,130 1440,118 V180 Z"
          />
          {/* Layer 3 - dense foreground foam with surge peaks */}
          <path
            fill="#fcf9f1"
            d="M0,180 V98 Q20,86 40,96 Q58,72 82,92 Q100,108 120,92 Q138,74 160,92 Q178,106 198,90 Q216,72 238,90 Q252,50 276,84 Q294,104 314,88 Q332,72 354,90 Q372,106 392,90 Q410,74 432,92 Q450,106 470,90 Q488,74 510,92 Q528,106 548,90 Q566,74 588,92 Q606,106 626,90 Q644,74 666,90 Q684,52 708,84 Q726,104 746,88 Q764,72 786,90 Q804,106 824,90 Q842,74 864,92 Q882,106 902,90 Q920,74 942,92 Q960,106 980,90 Q998,74 1020,92 Q1038,106 1058,90 Q1076,74 1098,92 Q1116,106 1136,88 Q1154,54 1178,84 Q1196,104 1216,88 Q1234,72 1256,90 Q1274,106 1294,90 Q1312,74 1334,92 Q1352,106 1372,90 Q1390,76 1412,92 Q1430,104 1440,96 V180 Z"
          />
          {/* Foam froth texture clinging to the crest */}
          <g fill="#fcf9f1">
            <ellipse cx="48" cy="90" rx="9" ry="6" fillOpacity="0.85" />
            <ellipse cx="120" cy="94" rx="7" ry="5" fillOpacity="0.7" />
            <ellipse cx="238" cy="86" rx="11" ry="7" fillOpacity="0.9" />
            <ellipse cx="300" cy="92" rx="8" ry="5" fillOpacity="0.75" />
            <ellipse cx="392" cy="90" rx="9" ry="6" fillOpacity="0.8" />
            <ellipse cx="470" cy="94" rx="7" ry="5" fillOpacity="0.7" />
            <ellipse cx="548" cy="88" rx="10" ry="6" fillOpacity="0.85" />
            <ellipse cx="626" cy="92" rx="8" ry="5" fillOpacity="0.75" />
            <ellipse cx="708" cy="84" rx="12" ry="7" fillOpacity="0.9" />
            <ellipse cx="786" cy="92" rx="8" ry="5" fillOpacity="0.75" />
            <ellipse cx="864" cy="90" rx="9" ry="6" fillOpacity="0.8" />
            <ellipse cx="942" cy="94" rx="7" ry="5" fillOpacity="0.7" />
            <ellipse cx="1020" cy="90" rx="9" ry="6" fillOpacity="0.8" />
            <ellipse cx="1098" cy="92" rx="8" ry="5" fillOpacity="0.75" />
            <ellipse cx="1178" cy="86" rx="11" ry="7" fillOpacity="0.9" />
            <ellipse cx="1256" cy="92" rx="8" ry="5" fillOpacity="0.75" />
            <ellipse cx="1334" cy="90" rx="9" ry="6" fillOpacity="0.8" />
            <ellipse cx="1412" cy="93" rx="7" ry="5" fillOpacity="0.7" />
          </g>
          {/* Airborne spray specks */}
          <g fill="#fcf9f1">
            <circle cx="70" cy="66" r="3" fillOpacity="0.75" />
            <circle cx="110" cy="54" r="2" fillOpacity="0.6" />
            <circle cx="250" cy="46" r="3.5" fillOpacity="0.8" />
            <circle cx="286" cy="60" r="2" fillOpacity="0.6" />
            <circle cx="420" cy="62" r="2.5" fillOpacity="0.7" />
            <circle cx="470" cy="52" r="2" fillOpacity="0.6" />
            <circle cx="560" cy="58" r="3" fillOpacity="0.75" />
            <circle cx="680" cy="48" r="3.5" fillOpacity="0.8" />
            <circle cx="720" cy="62" r="2" fillOpacity="0.6" />
            <circle cx="880" cy="60" r="2.5" fillOpacity="0.7" />
            <circle cx="960" cy="52" r="2" fillOpacity="0.6" />
            <circle cx="1120" cy="60" r="3" fillOpacity="0.75" />
            <circle cx="1160" cy="50" r="3.5" fillOpacity="0.8" />
            <circle cx="1200" cy="62" r="2" fillOpacity="0.6" />
            <circle cx="1360" cy="58" r="2.5" fillOpacity="0.7" />
          </g>
        </svg>
      </div>
    </section>
  );
};
