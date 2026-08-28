import { ROOM_TYPES, inr, CANCELLATION_POLICY } from './rooms';
import {
  RESORT_ADDRESS,
  RESORT_PHONES,
  RESORT_WHATSAPP,
  RESORT_EMAIL,
} from './contact';

export const greetingByTime = (d = new Date()): string => {
  const h = d.getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
};

const rateLines = ROOM_TYPES.map(
  (t) =>
    `• ${t.title}: ${inr(t.weekdayRate)} / night (Mon–Thu), ${inr(t.weekendRate)} on Fri–Sun. Rooms: ${t.roomNumbers.join(', ')}.`
).join('\n');

const phoneLine = RESORT_PHONES.map((p) => p.display).join(' or ');

interface Intent {
  test: RegExp;
  answer: string;
}

const INTENTS: Intent[] = [
  {
    test: /\b(hi|hello|hey|hola|namaste|vanakkam)\b/i,
    answer: `${greetingByTime()}! 👋 How can I help — room rates, availability, location, or booking?`,
  },
  {
    test: /\b(rate|price|cost|tariff|charge|rent|how much|per night|rates)\b/i,
    answer: `Our tariff (before 12% GST):\n${rateLines}\nA small advance holds the room; the balance is paid at the hotel.`,
  },
  {
    test: /\b(room|rooms|room type|accommodation|deluxe|couple room|family room|suite)\b/i,
    answer:
      `We have two room types:\n${rateLines}\nEvery room has 24-hour hot water, free Wi-Fi, air conditioning and room service.`,
  },
  {
    test: /\b(location|address|where|located|directions|reach|map|how to get)\b/i,
    answer: `We're at ${RESORT_ADDRESS} — a short walk from Lovedale railway station, right by Love Dale Junction on Coonoor Road.`,
  },
  {
    test: /\b(check.?in|check.?out|checkin|checkout|timing|time|arrival|departure)\b/i,
    answer:
      'Check-in is from 12:00 PM and check-out by 11:00 AM. Reception is staffed 24 hours, so late arrivals by bus or train are fine.',
  },
  {
    test: /\b(amenit|facilit|wifi|wi-fi|internet|parking|hot water|heater|geyser|ac|air condition|tv|room service|blanket)\b/i,
    answer:
      'Facilities: 24-hour hot water, free Wi-Fi, air conditioning, TV, room service, daily housekeeping, gated CCTV entry and free on-site parking.',
  },
  {
    test: /\b(breakfast|food|restaurant|dining|meal|lunch|dinner|kitchen|eat)\b/i,
    answer:
      "We don't run an in-house restaurant, but there are eateries a short walk away and we can arrange a simple hot breakfast on request. Fresh Nilgiri tea and filter coffee are available round the clock.",
  },
  {
    test: /\b(cancel|cancellation|refund|reschedul)\b/i,
    answer: `Cancellation policy:\n${CANCELLATION_POLICY.map((p) => `• ${p}`).join('\n')}`,
  },
  {
    test: /\b(pay|payment|advance|deposit|upi|gpay|phonepe|card|online)\b/i,
    answer:
      'To hold a room you pay a small advance (10%, 40% or a custom amount) by UPI, then enter the transaction ID. The balance is paid in cash / UPI at the hotel.',
  },
  {
    test: /\b(pet|dog|cat|animal)\b/i,
    answer: 'Sorry, pets are not allowed on the property.',
  },
  {
    test: /\b(contact|phone|call|number|mobile|whatsapp|email|reach you|talk)\b/i,
    answer: `You can call ${phoneLine}, WhatsApp ${RESORT_WHATSAPP.display}, or email ${RESORT_EMAIL}.`,
  },
  {
    test: /\b(toy train|sightsee|places|visit|doddabetta|ooty lake|botanical|garden|tea estate|tourist|nearby|attraction)\b/i,
    answer:
      "You're minutes from Lovedale station and the Nilgiri toy train, and a short drive from Ooty Lake, the Botanical Garden, Doddabetta Peak and the tea-estate viewpoints. The front desk arranges cabs and guides.",
  },
  {
    test: /\b(airport|bus stand|bus station|railway|train station|distance)\b/i,
    answer:
      'Lovedale railway station is a short walk. Ooty bus stand is about 6 km, and Coimbatore International Airport is roughly 90 km (about 3 hours).',
  },
  {
    test: /\b(available|availab|vacancy|free room|room available|book for|dates)\b/i,
    answer:
      'Live availability is shown on the booking page once you pick your dates. Tap “Book a room” here and I’ll take a few details, then send you straight to it.',
  },
  {
    test: /\b(thank|thanks|thank you|nandri|great|awesome)\b/i,
    answer: "You're welcome! 😊 Anything else I can help with?",
  },
  {
    test: /\b(bye|goodbye|see you|ok bye|that's all)\b/i,
    answer: 'Thanks for chatting with Funcity Resort. Have a great day! 🌄',
  },
];

export const answerFor = (raw: string): string => {
  const text = raw.trim();
  for (const intent of INTENTS) {
    if (intent.test.test(text)) return intent.answer;
  }
  return `I can help with room rates, availability, location, amenities, cancellation and booking. You can also call us on ${phoneLine} or tap “Book a room”.`;
};

export const QUICK_REPLIES = [
  'Room rates',
  'Location',
  'Amenities',
  'Cancellation policy',
  'Book a room',
];
