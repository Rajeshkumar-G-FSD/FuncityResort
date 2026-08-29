/**
 * Generates a static single-page property brochure PDF at
 *   public/funcity-brochure.pdf
 * so it can be shared via a fixed URL:  /funcity-brochure.pdf
 *
 * Run:  npm run brochure
 * Needs macOS `sips` for image downscaling (already present on macOS).
 */
import { jsPDF } from 'jspdf';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const IMG = (f) => path.join(ROOT, 'public/images', f);
const TMP = fs.mkdtempSync('/tmp/fc-brochure-');

const WEBSITE = 'www.funcityooty.com';
const ADDRESS = 'Love Dale Junction, Coonoor Road, Lovedale, Ooty-643003, Tamil Nadu';
const PHONES = ['94870 72058', '98952 90229'];
const WHATSAPP = '+91 63856 67126';
const EMAIL = 'reservations@funcityresort.com';

const rs = (n) => 'Rs ' + n.toLocaleString('en-IN');

const ROOMS = [
  {
    title: 'Couple Room',
    weekday: 1500,
    weekend: 2000,
    rooms: ['102', '103', '104', '105', '106', '107', '108', '110', '111'],
    blurb:
      'A cosy, well-kept room ideal for couples and solo travellers - free cancellation, Wi-Fi, hot water and air conditioning.',
    images: [
      'funcity_couple_room.JPG',
      'funcity_couple_room_washbasin.JPG',
      'funcity_couple_room_water_heater.JPG',
      'funcity_couple_room_resteoom.JPG',
    ],
  },
  {
    title: 'Family Room',
    weekday: 3000,
    weekend: 3500,
    rooms: ['109'],
    blurb: 'A spacious room for families, with a separate dining area and space for extra beds.',
    images: ['funcity_family_bedroom.JPG', 'funcity_family_room_dining_area.JPG'],
  },
];

const STRIP = ['funcity_reception.JPG', 'funcity_parking.JPG', 'funcity_family_room_dining_area.JPG'];

let n = 0;
function thumbJpeg(file, px) {
  const out = path.join(TMP, `t${n++}.jpg`);
  execFileSync('sips', [
    '-s', 'format', 'jpeg',
    '-s', 'formatOptions', '55',
    '-Z', String(px),
    IMG(file), '--out', out,
  ]);
  return 'data:image/jpeg;base64,' + fs.readFileSync(out).toString('base64');
}
function thumbPng(file, px) {
  const out = path.join(TMP, `t${n++}.png`);
  execFileSync('sips', ['-Z', String(px), IMG(file), '--out', out]);
  return 'data:image/png;base64,' + fs.readFileSync(out).toString('base64');
}

const doc = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });
const M = 12;
const RIGHT = 210 - M;
const teal = [8, 126, 164];
const grey = [110, 120, 126];
let y = M;

// header
doc.addImage(thumbPng('funcity_logo.png', 160), 'PNG', M, y, 20, 20);
doc.setFont('helvetica', 'bold').setFontSize(18).setTextColor(20, 20, 20);
doc.text('FUN CITY RESORTS', M + 24, y + 8);
doc.setFont('helvetica', 'normal').setFontSize(9).setTextColor(...grey);
doc.text('Lovedale  -  Ooty  -  Tamil Nadu', M + 24, y + 14);
doc.setFont('helvetica', 'bold').setTextColor(...teal);
doc.text(WEBSITE, RIGHT, y + 5, { align: 'right' });
doc.setFont('helvetica', 'normal').setTextColor(...grey);
doc.text('Rating 3.7 / 5  -  413 Google reviews', RIGHT, y + 11, { align: 'right' });
y += 24;
doc.setDrawColor(...teal).setLineWidth(0.6).line(M, y, RIGHT, y);
y += 6;

// address + contact
doc.setFontSize(9).setTextColor(30, 30, 30).setFont('helvetica', 'bold');
doc.text(ADDRESS, M, y);
y += 5;
doc.setFont('helvetica', 'normal');
doc.text(`Phone: ${PHONES.join(', ')}    |    WhatsApp: ${WHATSAPP}`, M, y);
y += 4.5;
doc.text(`Email: ${EMAIL}    |    Web: ${WEBSITE}`, M, y);
y += 8;

// room categories
doc.setFont('helvetica', 'bold').setFontSize(11).setTextColor(...teal);
doc.text('ROOM CATEGORIES & ROOM NUMBERS', M, y);
y += 5;

const TW = 30;
const TH = 19;
for (const t of ROOMS) {
  const blurbLines = doc.splitTextToSize(t.blurb, 182);
  const boxH = 15 + blurbLines.length * 3.6 + TH + 4;
  doc.setDrawColor(220, 218, 210).setLineWidth(0.3).roundedRect(M, y, RIGHT - M, boxH, 1.5, 1.5);
  let iy = y + 5;
  doc.setFont('helvetica', 'bold').setFontSize(10).setTextColor(20, 20, 20);
  doc.text(t.title, M + 3, iy);
  doc.setFont('helvetica', 'normal').setFontSize(8).setTextColor(...teal);
  doc.text(
    `${rs(t.weekday)} Mon-Thu   -   ${rs(t.weekend)} Fri-Sun   -   + 12% GST`,
    RIGHT - 3,
    iy,
    { align: 'right' }
  );
  iy += 4.5;
  doc.setTextColor(60, 60, 60).setFontSize(7.5);
  doc.text(blurbLines, M + 3, iy);
  iy += blurbLines.length * 3.6 + 1;
  doc.setFont('helvetica', 'bold').setFontSize(8).setTextColor(20, 20, 20);
  doc.text(`Room numbers:  ${t.rooms.join(',  ')}`, M + 3, iy);
  iy += 3;
  let ix = M + 3;
  for (const f of t.images) {
    doc.addImage(thumbJpeg(f, 420), 'JPEG', ix, iy, TW, TH);
    ix += TW + 2;
  }
  y += boxH + 3;
}

// property strip
doc.setFont('helvetica', 'bold').setFontSize(11).setTextColor(...teal);
doc.text('THE PROPERTY', M, y);
y += 4;
let sx = M;
for (const f of STRIP) {
  doc.addImage(thumbJpeg(f, 420), 'JPEG', sx, y, TW, TH);
  sx += TW + 2;
}
y += TH + 6;

// amenities + policy
const colW = (RIGHT - M - 8) / 2;
doc.setFont('helvetica', 'bold').setFontSize(8).setTextColor(...grey);
doc.text('INCLUDED', M, y);
doc.text('BOOKING & CANCELLATION', M + colW + 8, y);
doc.setFont('helvetica', 'normal').setFontSize(7.5).setTextColor(40, 40, 40);
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

// footer
doc.setDrawColor(...teal).setLineWidth(0.6).line(M, y, RIGHT, y);
y += 4;
doc.setFont('helvetica', 'normal').setFontSize(8).setTextColor(...grey);
const when = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
doc.text(`Generated ${when}`, M, y);
doc.setFont('helvetica', 'bold').setTextColor(...teal);
doc.text(`Book online at ${WEBSITE}`, RIGHT, y, { align: 'right' });

const outPath = path.join(ROOT, 'public/funcity-brochure.pdf');
fs.writeFileSync(outPath, Buffer.from(doc.output('arraybuffer')));
fs.rmSync(TMP, { recursive: true, force: true });
console.log('Wrote', path.relative(ROOT, outPath), '-', fs.statSync(outPath).size, 'bytes');
