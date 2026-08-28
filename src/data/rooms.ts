import { toISODate } from '../utils/dates';

export type RoomTypeId = 'couple' | 'family';

export interface RoomType {
  id: RoomTypeId;
  title: string;
  shortTitle: string;
  blurb: string;
  capacity: string;
  bed: string;
  /** Mon–Thu nightly rate (₹) */
  weekdayRate: number;
  /** Fri / Sat / Sun nightly rate (₹) */
  weekendRate: number;
  roomNumbers: string[];
  images: string[];
  amenities: string[];
}

export const ROOM_TYPES: RoomType[] = [
  {
    id: 'couple',
    title: 'Couple Room',
    shortTitle: 'Couple',
    blurb:
      'A cosy, well-kept room ideal for couples and solo travellers — free cancellation, Wi-Fi, hot water and air conditioning.',
    capacity: '2 guests',
    bed: '1 Double bed',
    weekdayRate: 1500,
    weekendRate: 2000,
    roomNumbers: ['102', '103', '104', '105', '106', '107', '108', '110', '111'],
    images: [
      '/images/funcity_couple_room.JPG',
      '/images/funcity_couple_room_washbasin.JPG',
      '/images/funcity_couple_room_water_heater.JPG',
      '/images/funcity_couple_room_resteoom.JPG',
    ],
    amenities: [
      'Free cancellation',
      'Free Wi-Fi',
      '24hr hot water',
      'Air conditioning',
      'Tea / Coffee maker',
      'Room service',
    ],
  },
  {
    id: 'family',
    title: 'Family Room',
    shortTitle: 'Family',
    blurb:
      'A spacious room for families, with a separate dining area and space for extra beds.',
    capacity: '4–5 guests',
    bed: '2 beds + dining area',
    weekdayRate: 3000,
    weekendRate: 3500,
    roomNumbers: ['109'],
    images: [
      '/images/funcity_family_bedroom.JPG',
      '/images/funcity_family_room_dining_area.JPG',
    ],
    amenities: [
      'Free cancellation',
      'Free Wi-Fi',
      '24hr hot water',
      'Dining area',
      'Tea / Coffee maker',
      'Room service',
    ],
  },
];

export const getRoomType = (id: string): RoomType =>
  ROOM_TYPES.find((r) => r.id === id) ?? ROOM_TYPES[0];

/** Weekend nights = Friday, Saturday, Sunday. */
export const isWeekendNight = (d: Date): boolean => [0, 5, 6].includes(d.getDay());

export interface NightRate {
  date: string; // YYYY-MM-DD (the night)
  rate: number;
  weekend: boolean;
}

/** Per-night rate breakdown for a stay (checkOut exclusive). */
export const nightlyRates = (
  checkInISO: string,
  checkOutISO: string,
  type: RoomType
): NightRate[] => {
  const out: NightRate[] = [];
  if (!checkInISO || !checkOutISO) return out;
  const cur = new Date(`${checkInISO}T00:00:00`);
  const end = new Date(`${checkOutISO}T00:00:00`);
  let guard = 0;
  while (cur < end && guard < 366) {
    const weekend = isWeekendNight(cur);
    out.push({
      date: toISODate(cur),
      rate: weekend ? type.weekendRate : type.weekdayRate,
      weekend,
    });
    cur.setDate(cur.getDate() + 1);
    guard += 1;
  }
  return out;
};

export const GST_RATE = 0.12; // 12% GST on room tariff

export interface Quote {
  nights: NightRate[];
  subtotal: number;
  tax: number;
  total: number;
}

export const quoteStay = (
  checkInISO: string,
  checkOutISO: string,
  type: RoomType
): Quote => {
  const nights = nightlyRates(checkInISO, checkOutISO, type);
  const subtotal = nights.reduce((s, n) => s + n.rate, 0);
  const tax = Math.round(subtotal * GST_RATE);
  return { nights, subtotal, tax, total: subtotal + tax };
};

export const inr = (n: number): string => '₹' + n.toLocaleString('en-IN');

/** Cancellation policy shown to guests and printed on the WhatsApp bill. */
export const CANCELLATION_POLICY = [
  'Free cancellation up to 5 days before check-in.',
  'If cancelled within 5 days of check-in, 30% of the total is deducted.',
];

/** Cheapest nightly rate to advertise ("from ₹1,500"). */
export const fromRate = (type: RoomType): number =>
  Math.min(type.weekdayRate, type.weekendRate);
