import React, { useState } from 'react';
import { X, Download, Loader2, Printer, MapPin, Phone, MessageCircle, Mail, Globe, Star } from 'lucide-react';
import { jsPDF } from 'jspdf';
import { ROOM_TYPES, inr } from '../data/rooms';
import { GALLERY_IMAGES } from '../data/gallery';
import {
  RESORT_LOGO,
  RESORT_ADDRESS,
  RESORT_PHONES,
  RESORT_WHATSAPP,
  RESORT_EMAIL,
  RESORT_WEBSITE,
} from '../data/contact';

interface PropertyBrochureProps {
  open: boolean;
  onClose: () => void;
  guestName?: string;
}

const rs = (n: number) => 'Rs ' + n.toLocaleString('en-IN');

const loadImage = (src: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });

/** Downscale + JPEG-compress a source image to keep the PDF small. */
const thumb = async (src: string, w: number, h: number): Promise<string> => {
  const img = await loadImage(src);
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const ctx = c.getContext('2d')!;
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, w, h);
  const ar = img.width / img.height;
  const tar = w / h;
  let sw = img.width;
  let sh = img.height;
  let sx = 0;
  let sy = 0;
  if (ar > tar) {
    sw = img.height * tar;
    sx = (img.width - sw) / 2;
  } else {
    sh = img.width / tar;
    sy = (img.height - sh) / 2;
  }
  ctx.drawImage(img, sx, sy, sw, sh, 0, 0, w, h);
  return c.toDataURL('image/jpeg', 0.72);
};

async function buildPdf(guestName?: string) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });
  const M = 12;
  const RIGHT = 210 - M;
  const teal: [number, number, number] = [8, 126, 164];
  const grey: [number, number, number] = [110, 120, 126];
  let y = M;

  // ---- header ----
  const logo = await thumb(RESORT_LOGO, 120, 120);
  doc.addImage(logo, 'JPEG', M, y, 20, 20);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(20, 20, 20);
  doc.text('FUN CITY RESORTS', M + 24, y + 8);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...grey);
  doc.text('Lovedale  -  Ooty  -  Tamil Nadu', M + 24, y + 14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...teal);
  doc.text(RESORT_WEBSITE, RIGHT, y + 5, { align: 'right' });
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...grey);
  doc.text('Rating 3.7 / 5  -  413 Google reviews', RIGHT, y + 11, { align: 'right' });
  y += 24;
  doc.setDrawColor(...teal);
  doc.setLineWidth(0.6);
  doc.line(M, y, RIGHT, y);
  y += 6;

  // ---- address + contact ----
  doc.setFontSize(9);
  doc.setTextColor(30, 30, 30);
  doc.setFont('helvetica', 'bold');
  doc.text(RESORT_ADDRESS, M, y);
  y += 5;
  doc.setFont('helvetica', 'normal');
  doc.text(
    `Phone: ${RESORT_PHONES.map((p) => p.display).join(', ')}    |    WhatsApp: ${RESORT_WHATSAPP.display}`,
    M,
    y
  );
  y += 4.5;
  doc.text(`Email: ${RESORT_EMAIL}    |    Web: ${RESORT_WEBSITE}`, M, y);
  y += 8;

  // ---- room categories ----
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...teal);
  doc.text('ROOM CATEGORIES & ROOM NUMBERS', M, y);
  y += 5;

  const tW = 30;
  const tH = 19;
  for (const t of ROOM_TYPES) {
    const blurbLines = doc.splitTextToSize(t.blurb, 182);
    const boxH = 15 + blurbLines.length * 3.6 + tH + 4;
    doc.setDrawColor(220, 218, 210);
    doc.setLineWidth(0.3);
    doc.roundedRect(M, y, RIGHT - M, boxH, 1.5, 1.5);

    let iy = y + 5;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(20, 20, 20);
    doc.text(t.title, M + 3, iy);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(...teal);
    doc.text(
      `${rs(t.weekdayRate)} Mon-Thu   -   ${rs(t.weekendRate)} Fri-Sun   -   + 12% GST`,
      RIGHT - 3,
      iy,
      { align: 'right' }
    );
    iy += 4.5;
    doc.setTextColor(60, 60, 60);
    doc.setFontSize(7.5);
    doc.text(blurbLines, M + 3, iy);
    iy += blurbLines.length * 3.6 + 1;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(20, 20, 20);
    doc.text(`Room numbers:  ${t.roomNumbers.join(',  ')}`, M + 3, iy);
    iy += 3;

    let ix = M + 3;
    // eslint-disable-next-line no-await-in-loop
    for (const src of t.images) {
      // eslint-disable-next-line no-await-in-loop
      const d = await thumb(src, 300, 190);
      doc.addImage(d, 'JPEG', ix, iy, tW, tH);
      ix += tW + 2;
    }
    y += boxH + 3;
  }

  // ---- property strip ----
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...teal);
  doc.text('THE PROPERTY', M, y);
  y += 4;
  const stripSrc = [
    '/images/funcity_reception.JPG',
    '/images/funcity_parking.JPG',
    '/images/funcity_family_room_dining_area.JPG',
    ...GALLERY_IMAGES.filter((g) => /couple|family|room|washbasin|water/i.test(g.text))
      .slice(0, 3)
      .map((g) => g.image),
  ];
  let sx2 = M;
  for (const src of stripSrc) {
    // eslint-disable-next-line no-await-in-loop
    const d = await thumb(src, 300, 190);
    doc.addImage(d, 'JPEG', sx2, y, tW, tH);
    sx2 += tW + 2;
  }
  y += tH + 6;

  // ---- amenities + policy ----
  const colW = (RIGHT - M - 8) / 2;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(...grey);
  doc.text('INCLUDED', M, y);
  doc.text('BOOKING & CANCELLATION', M + colW + 8, y);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(40, 40, 40);
  const amen = doc.splitTextToSize(
    '24 hr hot water, free Wi-Fi, air conditioning, TV, room service, daily housekeeping, gated CCTV entry, free on-site parking and 24 hr reception.',
    colW
  );
  const pol = doc.splitTextToSize(
    'Check-in 12:00 PM, check-out 11:00 AM. Hold a room with a 10-40% UPI advance; balance paid at the hotel. Free cancellation up to 5 days before check-in; within 5 days, 30% of the total is deducted.',
    colW
  );
  doc.text(amen, M, y + 4);
  doc.text(pol, M + colW + 8, y + 4);
  y += 4 + Math.max(amen.length, pol.length) * 3.4 + 4;

  // ---- footer ----
  doc.setDrawColor(...teal);
  doc.setLineWidth(0.6);
  doc.line(M, y, RIGHT, y);
  y += 4;
  doc.setFontSize(8);
  doc.setTextColor(...grey);
  const when = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  doc.text(`${guestName ? `Prepared for ${guestName}  -  ` : ''}${when}`, M, y);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...teal);
  doc.text(`Book online at ${RESORT_WEBSITE}`, RIGHT, y, { align: 'right' });

  doc.save('FunCity-Resorts-Ooty.pdf');
}

export const PropertyBrochure: React.FC<PropertyBrochureProps> = ({ open, onClose, guestName }) => {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  if (!open) return null;

  const today = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  const download = async () => {
    setBusy(true);
    setErr('');
    try {
      await buildPdf(guestName);
    } catch (e) {
      console.error(e);
      setErr('Could not build the PDF. Try the Print option instead.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[80] bg-black/60 overflow-auto p-4 print:static print:p-0 print:bg-white">
      <div className="max-w-[820px] mx-auto flex flex-wrap justify-end gap-2 mb-3 print:hidden">
        <button
          onClick={download}
          disabled={busy}
          className="flex items-center gap-2 bg-[#087ea4] hover:bg-[#006483] disabled:opacity-60 text-white text-sm font-bold px-4 py-2 rounded-full"
        >
          {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
          {busy ? 'Preparing PDF…' : 'Download PDF'}
        </button>
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 bg-white text-[#1c1c17] text-sm font-bold px-4 py-2 rounded-full"
        >
          <Printer className="w-4 h-4" /> Print
        </button>
        <button
          onClick={onClose}
          className="flex items-center gap-1.5 bg-white text-[#1c1c17] text-sm font-bold px-4 py-2 rounded-full"
        >
          <X className="w-4 h-4" /> Close
        </button>
      </div>
      {err && (
        <p className="max-w-[820px] mx-auto text-xs text-[#ffdada] bg-[#a12a2a]/80 rounded-lg px-3 py-2 mb-3 print:hidden">
          {err}
        </p>
      )}

      {/* preview sheet (also used by the Print fallback) */}
      <div
        id="property-brochure"
        className="max-w-[820px] mx-auto bg-white text-[#1c1c17] rounded-xl shadow-2xl p-7 print:shadow-none print:rounded-none print:max-w-none print:w-full print:p-0"
      >
        <div className="flex items-center gap-4 border-b-2 border-[#087ea4] pb-3">
          <img src={RESORT_LOGO} alt="" className="w-16 h-16 object-contain flex-shrink-0" />
          <div className="flex-grow">
            <h1 className="text-2xl font-extrabold tracking-tight leading-none">FUN CITY RESORTS</h1>
            <p className="text-sm text-[#3f484e] mt-0.5">Lovedale · Ooty · Tamil Nadu</p>
          </div>
          <div className="text-right">
            <p className="flex items-center gap-1 justify-end text-amber-500 font-bold text-sm">
              <Star className="w-4 h-4 fill-current" /> 3.7
            </p>
            <p className="text-[11px] text-[#6f787e]">413 Google reviews</p>
            <p className="text-[11px] font-bold text-[#087ea4] mt-0.5">{RESORT_WEBSITE}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 text-[12px] mt-3">
          <p className="flex items-start gap-1.5 col-span-full">
            <MapPin className="w-3.5 h-3.5 text-[#087ea4] flex-shrink-0 mt-0.5" />
            <span className="font-semibold">{RESORT_ADDRESS}</span>
          </p>
          {RESORT_PHONES.map((p) => (
            <p key={p.tel} className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-[#087ea4]" /> {p.display}
            </p>
          ))}
          <p className="flex items-center gap-1.5">
            <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" /> WhatsApp {RESORT_WHATSAPP.display}
          </p>
          <p className="flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5 text-[#087ea4]" /> {RESORT_EMAIL}
          </p>
          <p className="flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-[#087ea4]" /> {RESORT_WEBSITE}
          </p>
        </div>

        <h2 className="text-sm font-extrabold uppercase tracking-wider text-[#087ea4] mt-4 mb-2">
          Room Categories &amp; Numbers
        </h2>
        <div className="space-y-3">
          {ROOM_TYPES.map((t) => (
            <div key={t.id} className="border border-[#e5e2db] rounded-lg p-2.5">
              <div className="flex items-baseline justify-between gap-2">
                <h3 className="text-[13px] font-extrabold">{t.title}</h3>
                <p className="text-[12px] font-bold text-[#087ea4] text-right">
                  {inr(t.weekdayRate)} <span className="text-[#6f787e] font-normal">Mon–Thu</span> ·{' '}
                  {inr(t.weekendRate)} <span className="text-[#6f787e] font-normal">Fri–Sun</span>
                </p>
              </div>
              <p className="text-[11px] text-[#3f484e] mt-0.5">{t.blurb}</p>
              <p className="text-[11px] mt-1">
                <span className="font-bold">Room numbers:</span> {t.roomNumbers.join(', ')}
              </p>
              <div className="flex flex-wrap gap-1 mt-1.5">
                {t.images.map((src) => (
                  <img
                    key={src}
                    src={src}
                    alt={t.title}
                    className="w-[92px] h-[62px] object-cover rounded border border-[#e5e2db]"
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        <h2 className="text-sm font-extrabold uppercase tracking-wider text-[#087ea4] mt-4 mb-2">
          The Property
        </h2>
        <div className="flex flex-wrap gap-2">
          {[
            { src: '/images/funcity_reception.JPG', label: 'Reception' },
            { src: '/images/funcity_parking.JPG', label: 'Parking' },
            { src: '/images/funcity_family_room_dining_area.JPG', label: 'Dining area' },
          ].map((g) => (
            <figure key={g.src} className="w-[128px]">
              <img src={g.src} alt={g.label} className="w-full h-[80px] object-cover rounded border border-[#e5e2db]" />
              <figcaption className="text-[10px] text-[#6f787e] text-center mt-0.5">{g.label}</figcaption>
            </figure>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4 text-[11px] mt-4">
          <div>
            <h3 className="font-extrabold uppercase tracking-wider text-[#6f787e] mb-1">Included</h3>
            <p>24 hr hot water · Free Wi-Fi · Air conditioning · TV · Room service · Daily housekeeping · Gated CCTV entry · Free on-site parking · 24 hr reception</p>
          </div>
          <div>
            <h3 className="font-extrabold uppercase tracking-wider text-[#6f787e] mb-1">
              Booking &amp; cancellation
            </h3>
            <p>Check-in 12:00 PM · Check-out 11:00 AM. Hold a room with a 10–40% UPI advance; balance at the hotel. Free cancellation up to 5 days before check-in; within 5 days, 30% is deducted.</p>
          </div>
        </div>

        <div className="border-t-2 border-[#087ea4] mt-4 pt-2 flex items-center justify-between text-[11px]">
          <span className="text-[#6f787e]">
            {guestName ? `Prepared for ${guestName} · ` : ''}
            {today}
          </span>
          <span className="font-extrabold text-[#087ea4]">Book online at {RESORT_WEBSITE}</span>
        </div>
      </div>
    </div>
  );
};
