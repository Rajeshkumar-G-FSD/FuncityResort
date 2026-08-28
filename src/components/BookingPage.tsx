import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowLeft,
  ShieldCheck,
  Sparkles,
  Users as UsersIcon,
  CalendarDays,
  MapPin,
  Wifi,
  Loader2,
  BedDouble,
  ChevronRight,
  AlertCircle,
  MessageCircle,
  Clock,
  Check,
} from 'lucide-react';
import { GuestSelector, GuestValue, DEFAULT_GUESTS, summariseGuests } from './GuestSelector';
import { todayISO, addDaysISO, nightsBetween, isISODate, formatDate } from '../utils/dates';
import { openNativePicker } from '../utils/showPicker';
import { RESORT_ADDRESS, RESORT_NAME, RESORT_UPI, RESORT_WHATSAPP } from '../data/contact';
import {
  ROOM_TYPES,
  RoomType,
  quoteStay,
  Quote,
  inr,
  fromRate,
  CANCELLATION_POLICY,
} from '../data/rooms';
import {
  getBlockedRoomNumbers,
  createBooking,
  BookingRecord,
  BookingInput,
} from '../services/bookings';

interface BookingPageProps {
  onBack: () => void;
  initialRoomTypeId?: string;
  initialCheckIn?: string;
  initialCheckOut?: string;
  initialGuests?: GuestValue;
}

type Step = 'rooms' | 'details' | 'payment' | 'confirmed';
type PayOption = '10' | '40' | 'custom';

const waDigits = RESORT_WHATSAPP.tel.replace(/[^\d]/g, '');
const localRef = () => 'FC-' + Math.floor(100000 + Math.random() * 900000);
const HERO_IMAGE = '/images/funcity_couple_room.JPG';

const roomTypeOf = (roomNumber: string): RoomType | undefined =>
  ROOM_TYPES.find((t) => t.roomNumbers.includes(roomNumber));

/** Bill-style WhatsApp message covering every room in the booking. */
const buildWaMessage = (rows: BookingRecord[]) => {
  const first = rows[0];
  const sum = (f: (r: BookingRecord) => number) => rows.reduce((s, r) => s + f(r), 0);
  const advLabel =
    first.paymentOption === 'custom' ? 'custom advance' : `${first.paymentOption}% advance`;
  return [
    `🧾 *FUN CITY RESORTS — OOTY*`,
    RESORT_ADDRESS,
    ``,
    `*BOOKING BILL*`,
    `Ref(s): ${rows.map((r) => r.bookingRef).join(', ')}`,
    `Status: PENDING CONFIRMATION`,
    `Generated: ${new Date().toLocaleString('en-IN')}`,
    `──────────────────────`,
    `Guest    : ${first.guestName}`,
    `Phone    : ${first.guestPhone}`,
    `Email    : ${first.guestEmail}`,
    `Guests   : ${first.guestSummary}`,
    `Check-in : ${formatDate(first.checkIn)}`,
    `Check-out: ${formatDate(first.checkOut)}  (${first.nights} night${first.nights !== 1 ? 's' : ''})`,
    `──────────────────────`,
    `Rooms (${rows.length}):`,
    ...rows.map((r) => `  • ${r.roomTypeTitle} No.${r.roomNumber} — ${inr(r.total)}`),
    `──────────────────────`,
    `Room charges : ${inr(sum((r) => r.subtotal))}`,
    `GST (12%)    : ${inr(sum((r) => r.tax))}`,
    `*TOTAL*      : ${inr(sum((r) => r.total))}`,
    ``,
    `Advance paid (${advLabel}) : ${inr(sum((r) => r.paidAmount))}`,
    `Payment mode : ${first.paymentMethod}`,
    `Txn ID       : ${first.transactionId}`,
    `*Balance at hotel* : ${inr(sum((r) => r.balanceDue))}`,
    `──────────────────────`,
    `Cancellation policy:`,
    ...CANCELLATION_POLICY.map((p) => `• ${p}`),
    ``,
    `Requests: ${first.specialRequests || '—'}`,
  ].join('\n');
};

const waUrl = (rows: BookingRecord[]) =>
  `https://wa.me/${waDigits}?text=${encodeURIComponent(buildWaMessage(rows))}`;

export const BookingPage: React.FC<BookingPageProps> = ({
  onBack,
  initialRoomTypeId,
  initialCheckIn,
  initialCheckOut,
  initialGuests,
}) => {
  const [checkIn, setCheckIn] = useState(
    isISODate(initialCheckIn || '') ? (initialCheckIn as string) : ''
  );
  const [checkOut, setCheckOut] = useState(
    isISODate(initialCheckOut || '') ? (initialCheckOut as string) : ''
  );
  const [guestValue, setGuestValue] = useState<GuestValue>(initialGuests ?? DEFAULT_GUESTS);

  const [openTypeId, setOpenTypeId] = useState<string>(initialRoomTypeId || '');
  const [selectedRooms, setSelectedRooms] = useState<string[]>([]);

  const [bookedRooms, setBookedRooms] = useState<Set<string>>(new Set());
  const [loadingAvail, setLoadingAvail] = useState(false);
  const [availError, setAvailError] = useState(false);

  const [step, setStep] = useState<Step>('rooms');
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');

  const [payOption, setPayOption] = useState<PayOption>('10');
  const [customAmount, setCustomAmount] = useState('');
  const [txnId, setTxnId] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [saveWarning, setSaveWarning] = useState(false);
  const [confirmed, setConfirmed] = useState<BookingRecord[] | null>(null);

  const checkInRef = useRef<HTMLInputElement>(null);
  const checkOutRef = useRef<HTMLInputElement>(null);

  const today = todayISO();
  const minCheckOut = checkIn ? addDaysISO(checkIn, 1) : addDaysISO(today, 1);
  const datesReady = isISODate(checkIn) && isISODate(checkOut) && checkOut > checkIn;
  const nights = nightsBetween(checkIn, checkOut);
  const guestSummary = summariseGuests(guestValue);
  const totalGuests = guestValue.adults + guestValue.children;

  // Per-selected-room quote
  const selection = useMemo(() => {
    if (!datesReady) return [] as { room: string; type: RoomType; q: Quote }[];
    return selectedRooms
      .map((room) => {
        const type = roomTypeOf(room);
        if (!type) return null;
        return { room, type, q: quoteStay(checkIn, checkOut, type) };
      })
      .filter(Boolean) as { room: string; type: RoomType; q: Quote }[];
  }, [selectedRooms, checkIn, checkOut, datesReady]);

  const combined = useMemo(
    () => ({
      subtotal: selection.reduce((s, r) => s + r.q.subtotal, 0),
      tax: selection.reduce((s, r) => s + r.q.tax, 0),
      total: selection.reduce((s, r) => s + r.q.total, 0),
    }),
    [selection]
  );
  const total = combined.total;

  const payNow = useMemo(() => {
    if (!total) return 0;
    if (payOption === '10') return Math.round(total * 0.1);
    if (payOption === '40') return Math.round(total * 0.4);
    const n = Math.floor(Number(customAmount) || 0);
    return Math.max(0, Math.min(n, total));
  }, [total, payOption, customAmount]);
  const balanceDue = Math.max(0, total - payNow);

  // Load availability whenever the date range changes; drop any now-unavailable picks
  useEffect(() => {
    if (!datesReady) {
      setBookedRooms(new Set());
      return;
    }
    let cancelled = false;
    setLoadingAvail(true);
    setAvailError(false);
    getBlockedRoomNumbers(checkIn, checkOut)
      .then((set) => {
        if (cancelled) return;
        setBookedRooms(set);
        setSelectedRooms((prev) => prev.filter((n) => !set.has(n)));
      })
      .catch(() => !cancelled && setAvailError(true))
      .finally(() => !cancelled && setLoadingAvail(false));
    return () => {
      cancelled = true;
    };
  }, [checkIn, checkOut, datesReady]);

  const availableFor = (type: RoomType) => type.roomNumbers.filter((n) => !bookedRooms.has(n));
  const selectedInType = (type: RoomType) =>
    selectedRooms.filter((n) => type.roomNumbers.includes(n)).length;

  const toggleRoom = (n: string) =>
    setSelectedRooms((prev) => (prev.includes(n) ? prev.filter((x) => x !== n) : [...prev, n]));

  const handleCheckInChange = (v: string) => {
    if (v === checkIn) return; // re-opened picker, same date — keep everything
    setCheckIn(v);
    setSelectedRooms([]);
    if (v && checkOut && checkOut <= v) setCheckOut('');
    // only auto-jump to check-out when it isn't set yet
    if (v && !checkOut) openNativePicker(checkOutRef.current);
  };

  const handleCheckOutChange = (v: string) => {
    if (v === checkOut) return;
    setCheckOut(v);
    setSelectedRooms([]);
  };

  const detailsValid =
    datesReady &&
    selectedRooms.length > 0 &&
    guestName.trim().length > 1 &&
    /\S+@\S+\.\S+/.test(guestEmail) &&
    guestPhone.trim().length >= 7;

  const paymentValid = detailsValid && payNow > 0 && txnId.trim().length >= 6 && !submitting;

  const openWhatsApp = (rows: BookingRecord[]) => {
    try {
      window.open(waUrl(rows), '_blank', 'noopener');
    } catch {
      /* popup blocked — button on the confirmation screen covers this */
    }
  };

  const handleSubmit = async () => {
    if (!datesReady || selection.length === 0) return;
    setSubmitting(true);
    setSubmitError('');
    setSaveWarning(false);

    // Best-effort lock re-check
    try {
      const fresh = await getBlockedRoomNumbers(checkIn, checkOut);
      const taken = selectedRooms.filter((n) => fresh.has(n));
      if (taken.length) {
        setBookedRooms(fresh);
        setSelectedRooms((prev) => prev.filter((n) => !fresh.has(n)));
        setStep('rooms');
        setSubmitError(
          `Room ${taken.join(', ')} was just taken. Please review your selection.`
        );
        setSubmitting(false);
        return;
      }
    } catch (e) {
      console.warn('Availability re-check skipped:', e);
    }

    // Split the advance across rooms proportionally
    const grand = selection.reduce((s, r) => s + r.q.total, 0);
    let allocated = 0;
    const inputs: BookingInput[] = selection.map((r, i) => {
      const isLast = i === selection.length - 1;
      const share = isLast
        ? Math.max(0, payNow - allocated)
        : Math.max(0, Math.round((payNow * r.q.total) / grand));
      allocated += share;
      return {
        roomTypeId: r.type.id,
        roomTypeTitle: r.type.title,
        roomNumber: r.room,
        checkIn,
        checkOut,
        nights,
        guests: {
          adults: guestValue.adults,
          children: guestValue.children,
          childAges: guestValue.childAges,
        },
        guestSummary,
        guestName: guestName.trim(),
        guestEmail: guestEmail.trim(),
        guestPhone: guestPhone.trim(),
        specialRequests: specialRequests.trim(),
        subtotal: r.q.subtotal,
        tax: r.q.tax,
        total: r.q.total,
        paymentOption: payOption,
        paidAmount: share,
        balanceDue: Math.max(0, r.q.total - share),
        transactionId: txnId.trim(),
        paymentMethod: 'UPI',
      };
    });

    const records: BookingRecord[] = [];
    let anyFail = false;
    for (const input of inputs) {
      try {
        // eslint-disable-next-line no-await-in-loop
        records.push(await createBooking(input));
      } catch (e) {
        console.error('Firestore save failed:', e);
        anyFail = true;
        records.push({
          ...input,
          id: 'local',
          bookingRef: localRef(),
          status: 'pending',
          createdAt: new Date(),
          statusUpdatedAt: new Date(),
        });
      }
    }

    setSaveWarning(anyFail);
    setConfirmed(records);
    setStep('confirmed');
    setSubmitting(false);
    openWhatsApp(records);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  /* ============================ CONFIRMED (pending) ============================ */
  if (step === 'confirmed' && confirmed && confirmed.length) {
    const rows = confirmed;
    const first = rows[0];
    const sum = (f: (r: BookingRecord) => number) => rows.reduce((s, r) => s + f(r), 0);
    return (
      <div className="bg-[#fcf9f1] min-h-screen pt-24 md:pt-28 pb-20 px-4">
        <div className="max-w-xl mx-auto text-center">
          <div className="w-20 h-20 bg-[#b8860b]/10 text-[#a9801d] rounded-full flex items-center justify-center mx-auto shadow-inner">
            <Clock className="w-10 h-10" />
          </div>
          <span className="inline-block mt-4 text-xs font-bold uppercase tracking-wider text-[#a9801d] bg-[#b8860b]/10 px-3 py-1 rounded-full">
            Advance recorded · Awaiting confirmation
          </span>
          <h1 className="text-3xl font-extrabold text-[#1c1c17] mt-3">
            Thanks, {first.guestName.split(' ')[0]}!
          </h1>
          <p className="text-sm text-[#3f484e] mt-2">
            {rows.length > 1 ? `${rows.length} rooms are held.` : 'Your room is held.'}{' '}
            <b>Tap "Send bill on WhatsApp"</b> so the hotel can verify the payment &amp; confirm.
          </p>

          {saveWarning && (
            <div className="mt-4 text-left bg-[#fff8e8] border border-[#e8d9a8] text-[#7a5c12] text-xs rounded-xl p-3 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              We couldn't reach our server for part of this booking — your details are safe: send
              the WhatsApp bill and the hotel will still get everything.
            </div>
          )}

          <div className="bg-white rounded-2xl border border-[#e5e2db] text-left mt-6 p-6 space-y-2.5 text-sm shadow-sm">
            <Row
              k={rows.length > 1 ? 'Booking Refs' : 'Booking Ref'}
              v={
                <span className="font-mono text-[#087ea4] font-bold">
                  {rows.map((r) => r.bookingRef).join(', ')}
                </span>
              }
            />
            <div className="pt-1 space-y-1">
              {rows.map((r) => (
                <div key={r.bookingRef} className="flex justify-between text-[13px]">
                  <span className="text-[#3f484e]">
                    {r.roomTypeTitle} · Room {r.roomNumber}
                  </span>
                  <span className="font-semibold text-[#1c1c17]">{inr(r.total)}</span>
                </div>
              ))}
            </div>
            <Row
              k="Stay"
              v={`${formatDate(first.checkIn)} → ${formatDate(first.checkOut)} (${first.nights} night${first.nights !== 1 ? 's' : ''})`}
            />
            <Row k="Guests" v={first.guestSummary} />
            <Row k="Contact" v={`${first.guestPhone} · ${first.guestEmail}`} />
            <div className="pt-2 border-t border-[#eee7d8]" />
            <Row k="Room charges" v={inr(sum((r) => r.subtotal))} />
            <Row k="GST (12%)" v={inr(sum((r) => r.tax))} />
            <Row k="Total" v={<b>{inr(sum((r) => r.total))}</b>} />
            <Row k="Txn ID" v={<span className="font-mono">{first.transactionId}</span>} />
            <Row
              k="Advance paid"
              v={<span className="text-[#0a7d33] font-bold">{inr(sum((r) => r.paidAmount))}</span>}
            />
            <div className="flex justify-between pt-2 border-t border-[#e5e2db] text-base font-extrabold">
              <span>Balance at hotel</span>
              <span className="text-[#087ea4]">{inr(sum((r) => r.balanceDue))}</span>
            </div>
          </div>

          <div className="bg-[#f6f3eb] border border-[#e5e2db] rounded-xl text-left mt-4 p-4 text-xs text-[#3f484e]">
            <p className="font-bold text-[#1c1c17] mb-1">Cancellation policy</p>
            <ul className="list-disc pl-4 space-y-0.5">
              {CANCELLATION_POLICY.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
            <a
              href={waUrl(rows)}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#25D366] hover:brightness-105 text-white font-bold text-sm px-7 py-3.5 rounded-full transition-all shadow-md flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4" /> Send bill on WhatsApp
            </a>
            <button
              onClick={onBack}
              className="bg-[#f1eee6] hover:bg-[#e8e4d8] text-[#1c1c17] font-bold text-sm px-7 py-3.5 rounded-full transition-all"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ========================= SEARCH + FLOW ========================= */
  return (
    <div className="bg-[#fcf9f1] min-h-screen">
      <section className="relative overflow-hidden">
        <img src={HERO_IMAGE} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/55 to-black/70" />

        <div className="relative z-10 max-w-[1100px] mx-auto px-4 md:px-8 pt-24 md:pt-28 pb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-white/85 hover:text-white text-sm font-semibold mb-5"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </button>

          <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] text-white/75">
            <Sparkles className="w-3.5 h-3.5" />
            {RESORT_NAME}
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white mt-2">
            Book your stay
          </h1>
          <p className="flex items-start gap-1.5 text-white/75 text-xs md:text-sm mt-2 max-w-md">
            <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
            {RESORT_ADDRESS}
          </p>

          <div className="mt-5 bg-white rounded-2xl shadow-xl border border-[#e5e2db] p-2.5 flex flex-col sm:flex-row sm:items-stretch gap-2">
            <div className="flex-1 min-w-0">
              <DateField
                label="Check-in"
                value={checkIn}
                placeholder="Select date"
                min={today}
                inputRef={checkInRef}
                onChange={handleCheckInChange}
              />
            </div>
            <div className="hidden sm:block w-px bg-[#e5e2db]" />
            <div className="flex-1 min-w-0">
              <DateField
                label="Check-out"
                value={checkOut}
                placeholder={checkIn ? 'Select date' : 'Check-in first'}
                min={minCheckOut}
                disabled={!checkIn}
                inputRef={checkOutRef}
                onChange={handleCheckOutChange}
              />
            </div>
            <div className="hidden sm:block w-px bg-[#e5e2db]" />
            <div className="flex-1 min-w-0">
              <div className="rounded-xl">
                <GuestSelector value={guestValue} onChange={setGuestValue} compact inlinePanel />
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-[1100px] mx-auto px-4 md:px-8 py-8 md:py-12">
        <Steps step={step} />

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6 lg:gap-8 mt-6">
          {/* LEFT */}
          <div className="space-y-5">
            {!datesReady && (
              <div className="bg-white rounded-2xl border border-[#e5e2db] p-6 text-sm text-[#3f484e] flex items-center gap-3">
                <CalendarDays className="w-5 h-5 text-[#087ea4]" />
                Choose your check-in and check-out dates above to see live room availability.
              </div>
            )}

            {submitError && step === 'rooms' && (
              <div className="bg-[#fff3f3] border border-[#f3c9c9] text-[#a12a2a] text-sm rounded-xl p-3 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                {submitError}
              </div>
            )}

            {step === 'rooms' && (
              <>
                {loadingAvail && (
                  <div className="flex items-center gap-2 text-sm text-[#6f787e]">
                    <Loader2 className="w-4 h-4 animate-spin" /> Checking availability…
                  </div>
                )}
                {availError && (
                  <div className="bg-[#fff3f3] border border-[#f3c9c9] text-[#a12a2a] text-xs rounded-xl p-3">
                    Couldn't reach the booking server. You can still browse rooms; availability may
                    be out of date.
                  </div>
                )}

                {datesReady && (
                  <p className="text-xs text-[#6f787e]">
                    Tap room numbers to select <b>one or more</b> — you can mix Couple and Family
                    rooms. Your picks stay selected when you switch between room types.
                  </p>
                )}

                {ROOM_TYPES.map((type) => {
                  const avail = availableFor(type);
                  const isOpen = openTypeId === type.id;
                  const soldOut = datesReady && avail.length === 0;
                  const picked = selectedInType(type);
                  const recommended = totalGuests > 2 && type.id === 'family';
                  return (
                    <div
                      key={type.id}
                      className={`bg-white rounded-2xl border overflow-hidden transition-all ${
                        picked > 0 ? 'border-[#087ea4] ring-1 ring-[#087ea4]' : 'border-[#e5e2db]'
                      }`}
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-[210px_1fr]">
                        <div className="relative h-44 sm:h-full min-h-[160px]">
                          <img src={type.images[0]} alt={type.title} className="w-full h-full object-cover" />
                          {recommended && (
                            <span className="absolute top-2 left-2 bg-[#087ea4] text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wide">
                              Best for your group
                            </span>
                          )}
                          {picked > 0 && (
                            <span className="absolute bottom-2 left-2 bg-[#087ea4] text-white text-[11px] font-bold px-2.5 py-1 rounded-full">
                              {picked} selected
                            </span>
                          )}
                        </div>

                        <div className="p-4 md:p-5 flex flex-col sm:flex-row gap-4">
                          <div className="flex-grow">
                            <h3 className="text-lg font-extrabold text-[#1c1c17]">{type.title}</h3>
                            <p className="text-xs text-[#6f787e] mt-0.5 flex items-center gap-2">
                              <UsersIcon className="w-3.5 h-3.5" /> {type.capacity}
                              <span className="text-[#d5cfc2]">|</span>
                              <BedDouble className="w-3.5 h-3.5" /> {type.bed}
                            </p>
                            <p className="text-sm text-[#3f484e] leading-relaxed mt-2">{type.blurb}</p>
                            <div className="flex flex-wrap gap-1.5 mt-3">
                              {type.amenities.slice(0, 5).map((a) => (
                                <span
                                  key={a}
                                  className="text-[11px] bg-[#f6f3eb] text-[#3f484e] px-2 py-0.5 rounded-full"
                                >
                                  {a}
                                </span>
                              ))}
                            </div>
                            <p className="text-[11px] text-[#087ea4] font-semibold mt-3 flex items-center gap-1">
                              <Wifi className="w-3 h-3" /> Free cancellation · Pay at hotel
                            </p>
                          </div>

                          <div className="sm:w-40 sm:text-right sm:border-l sm:border-[#eee7d8] sm:pl-4 flex sm:flex-col items-center sm:items-end justify-between gap-2">
                            <div>
                              <p className="text-[11px] text-[#6f787e]">from</p>
                              <p className="text-xl font-extrabold text-[#1c1c17] leading-none">
                                {inr(fromRate(type))}
                              </p>
                              <p className="text-[11px] text-[#6f787e]">/ night + 12% GST</p>
                            </div>
                            {datesReady ? (
                              soldOut ? (
                                <span className="text-xs font-bold text-[#a12a2a]">
                                  Sold out for these dates
                                </span>
                              ) : (
                                <span className="text-[11px] font-semibold text-[#0a7d33]">
                                  {avail.length} room{avail.length !== 1 ? 's' : ''} available
                                </span>
                              )
                            ) : (
                              <span className="text-[11px] text-[#6f787e]">Select dates</span>
                            )}
                            <button
                              disabled={!datesReady || soldOut}
                              onClick={() => setOpenTypeId(isOpen ? '' : type.id)}
                              className="w-full sm:w-auto bg-[#087ea4] hover:bg-[#006483] disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold px-4 py-2.5 rounded-full transition-colors"
                            >
                              {isOpen ? 'Hide rooms' : picked > 0 ? 'Edit rooms' : 'Select rooms'}
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Multi-select room picker */}
                      {isOpen && !soldOut && (
                        <div className="border-t border-[#eee7d8] bg-[#fcfaf4] p-4 md:p-5">
                          <p className="text-xs font-bold uppercase tracking-wider text-[#6f787e] mb-2.5">
                            Tap to select room number(s)
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {avail.map((n) => {
                              const on = selectedRooms.includes(n);
                              return (
                                <button
                                  key={n}
                                  onClick={() => toggleRoom(n)}
                                  className={`relative w-14 h-11 rounded-xl border text-sm font-bold transition-all ${
                                    on
                                      ? 'bg-[#087ea4] border-[#087ea4] text-white'
                                      : 'bg-white border-[#d8cfbd] text-[#1c1c17] hover:border-[#087ea4]'
                                  }`}
                                >
                                  {n}
                                  {on && (
                                    <Check className="w-3 h-3 absolute -top-1 -right-1 bg-white text-[#087ea4] rounded-full" />
                                  )}
                                </button>
                              );
                            })}
                          </div>
                          <p className="text-[11px] text-[#6f787e] mt-2">
                            Booked or blocked rooms are not shown. Selected rooms stay selected here
                            and in the other room type.
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </>
            )}

            {step === 'details' && selectedRooms.length > 0 && (
              <div className="bg-white rounded-2xl border border-[#e5e2db] p-5 md:p-6 space-y-5">
                <button
                  onClick={() => setStep('rooms')}
                  className="text-xs font-bold text-[#087ea4] flex items-center gap-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Change rooms
                </button>
                <h3 className="text-lg font-extrabold text-[#1c1c17]">Guest details</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Input label="Full name *" value={guestName} onChange={setGuestName} placeholder="e.g. Priya Sharma" />
                  <Input label="Phone *" value={guestPhone} onChange={setGuestPhone} placeholder="+91 90000 00000" type="tel" />
                </div>
                <Input label="Email *" value={guestEmail} onChange={setGuestEmail} placeholder="priya@example.com" type="email" />
                <div>
                  <label className="text-[10px] font-bold text-[#6f787e] uppercase block mb-1">
                    Special requests (optional)
                  </label>
                  <textarea
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    rows={3}
                    placeholder="Early check-in, extra bed, higher floor…"
                    className="w-full text-sm bg-[#fcf9f1] border border-[#bec8ce] rounded-lg p-2.5 text-[#1c1c17] focus:outline-none focus:border-[#087ea4] resize-none"
                  />
                </div>

                {submitError && (
                  <div className="bg-[#fff3f3] border border-[#f3c9c9] text-[#a12a2a] text-sm rounded-xl p-3 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" /> {submitError}
                  </div>
                )}

                <p className="text-xs text-[#6f787e] flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#087ea4]" />
                  Pay a small advance now to hold the room(s) — balance in cash / UPI at the hotel.
                </p>
              </div>
            )}

            {step === 'payment' && selectedRooms.length > 0 && datesReady && (
              <div className="bg-white rounded-2xl border border-[#e5e2db] p-5 md:p-6 space-y-5">
                <button
                  onClick={() => setStep('details')}
                  className="text-xs font-bold text-[#087ea4] flex items-center gap-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back to guest details
                </button>
                <div>
                  <h3 className="text-lg font-extrabold text-[#1c1c17]">
                    Pay advance to hold your {selectedRooms.length > 1 ? 'rooms' : 'room'}
                  </h3>
                  <p className="text-sm text-[#3f484e] mt-1">
                    Choose how much to pay now. The rest is paid at the hotel.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {([
                    { id: '10', label: '10% now', amt: Math.round(total * 0.1) },
                    { id: '40', label: '40% now', amt: Math.round(total * 0.4) },
                    { id: 'custom', label: 'Custom amount', amt: -1 },
                  ] as { id: PayOption; label: string; amt: number }[]).map((o) => (
                    <button
                      key={o.id}
                      type="button"
                      onClick={() => setPayOption(o.id)}
                      className={`text-left rounded-xl border p-3.5 transition-all ${
                        payOption === o.id
                          ? 'border-[#087ea4] ring-2 ring-[#087ea4] bg-[#087ea4]/5'
                          : 'border-[#e5e2db] hover:border-[#bec8ce]'
                      }`}
                    >
                      <span className="block text-xs font-bold uppercase tracking-wide text-[#6f787e]">
                        {o.label}
                      </span>
                      <span className="block text-lg font-extrabold text-[#1c1c17] mt-1">
                        {o.id === 'custom' ? 'You decide' : inr(o.amt)}
                      </span>
                    </button>
                  ))}
                </div>

                {payOption === 'custom' && (
                  <div>
                    <label className="text-[10px] font-bold text-[#6f787e] uppercase block mb-1">
                      Amount to pay now (₹) — up to {inr(total)}
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={total}
                      value={customAmount}
                      onChange={(e) => setCustomAmount(e.target.value)}
                      placeholder="e.g. 1000"
                      className="w-full text-sm bg-[#fcf9f1] border border-[#bec8ce] rounded-lg p-2.5 text-[#1c1c17] focus:outline-none focus:border-[#087ea4]"
                    />
                  </div>
                )}

                <div className="bg-[#f6f3eb] border border-[#e5e2db] rounded-xl p-4 space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-[#3f484e]">Pay now</span>
                    <span className="font-extrabold text-[#087ea4] text-lg">{inr(payNow)}</span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[#3f484e]">UPI ID</span>
                    <button
                      type="button"
                      onClick={() => navigator.clipboard?.writeText(RESORT_UPI)}
                      className="font-mono font-bold text-[#1c1c17] hover:text-[#087ea4]"
                      title="Copy UPI ID"
                    >
                      {RESORT_UPI}
                    </button>
                  </div>
                  <p className="text-[11px] text-[#6f787e]">
                    Open any UPI app (GPay / PhonePe / Paytm), pay the amount above to this UPI ID,
                    then enter the transaction reference below.
                  </p>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-[#6f787e] uppercase block mb-1">
                    UPI transaction / reference ID *
                  </label>
                  <input
                    type="text"
                    value={txnId}
                    onChange={(e) => setTxnId(e.target.value)}
                    placeholder="12-digit UPI reference number"
                    className="w-full text-sm bg-[#fcf9f1] border border-[#bec8ce] rounded-lg p-2.5 text-[#1c1c17] focus:outline-none focus:border-[#087ea4]"
                  />
                </div>

                <div className="flex items-center justify-between text-sm bg-white border border-[#e5e2db] rounded-xl p-3">
                  <span className="text-[#3f484e]">Balance to pay at hotel</span>
                  <span className="font-bold text-[#1c1c17]">{inr(balanceDue)}</span>
                </div>

                <div className="bg-[#f6f3eb] border border-[#e5e2db] rounded-xl p-3 text-xs text-[#3f484e]">
                  <p className="font-bold text-[#1c1c17] mb-1">Cancellation policy</p>
                  <ul className="list-disc pl-4 space-y-0.5">
                    {CANCELLATION_POLICY.map((p) => (
                      <li key={p}>{p}</li>
                    ))}
                  </ul>
                </div>

                {submitError && (
                  <div className="bg-[#fff3f3] border border-[#f3c9c9] text-[#a12a2a] text-sm rounded-xl p-3 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" /> {submitError}
                  </div>
                )}

                <p className="text-xs text-[#6f787e] flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-[#25D366]" />
                  On submit we'll open WhatsApp to <b>{RESORT_WHATSAPP.display}</b> with your full
                  bill so the hotel can verify &amp; confirm.
                </p>
              </div>
            )}
          </div>

          {/* RIGHT — fare summary */}
          <aside className="lg:sticky lg:top-24 h-max">
            <div className="bg-white rounded-2xl border border-[#e5e2db] shadow-sm overflow-hidden">
              <div className="p-4 border-b border-[#eee7d8]">
                <p className="text-xs font-bold uppercase tracking-wider text-[#6f787e]">Fare summary</p>
              </div>
              <div className="p-4 space-y-3 text-sm">
                <div className="text-[13px] text-[#3f484e]">
                  {datesReady ? (
                    <>
                      {formatDate(checkIn)} → {formatDate(checkOut)}
                      <span className="block text-[11px] text-[#6f787e]">
                        {nights} night{nights !== 1 ? 's' : ''} · {guestSummary}
                      </span>
                    </>
                  ) : (
                    <span className="text-[#9aa2a7]">Select dates</span>
                  )}
                </div>

                <div className="pt-2 border-t border-[#eee7d8] space-y-1.5 text-[13px]">
                  {selection.length === 0 ? (
                    <p className="text-[#9aa2a7]">No rooms selected</p>
                  ) : (
                    <>
                      {selection.map((r) => (
                        <div key={r.room} className="flex justify-between">
                          <span className="text-[#3f484e]">
                            {r.type.shortTitle} · {r.room}
                            <span className="block text-[10px] text-[#6f787e]">
                              {nights} night{nights !== 1 ? 's' : ''}
                            </span>
                          </span>
                          <span className="font-semibold text-[#1c1c17]">{inr(r.q.total)}</span>
                        </div>
                      ))}
                      <div className="pt-1.5 border-t border-[#eee7d8]" />
                      <Line k="Room subtotal" v={inr(combined.subtotal)} />
                      <Line k="GST (12%)" v={inr(combined.tax)} />
                      <div className="flex justify-between pt-2 border-t border-[#eee7d8] text-base font-extrabold text-[#1c1c17]">
                        <span>Total</span>
                        <span className="text-[#087ea4]">{inr(combined.total)}</span>
                      </div>
                      {step === 'payment' && (
                        <div className="pt-2 border-t border-[#eee7d8] space-y-1">
                          <Line k="Advance now" v={inr(payNow)} />
                          <Line k="Balance at hotel" v={inr(balanceDue)} />
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>

              <div className="p-4 border-t border-[#eee7d8]">
                {step === 'rooms' && (
                  <button
                    disabled={selectedRooms.length === 0 || !datesReady}
                    onClick={() => {
                      setSubmitError('');
                      setStep('details');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="w-full bg-[#087ea4] hover:bg-[#006483] disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-sm py-3.5 rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                  >
                    Continue{selectedRooms.length > 0 ? ` · ${selectedRooms.length} room${selectedRooms.length !== 1 ? 's' : ''}` : ''}
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
                {step === 'details' && (
                  <button
                    disabled={!detailsValid}
                    onClick={() => {
                      setSubmitError('');
                      setStep('payment');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="w-full bg-[#087ea4] hover:bg-[#006483] disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-sm py-3.5 rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                  >
                    Continue to payment <ChevronRight className="w-4 h-4" />
                  </button>
                )}
                {step === 'payment' && (
                  <button
                    disabled={!paymentValid}
                    onClick={handleSubmit}
                    className="w-full bg-[#087ea4] hover:bg-[#006483] disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-sm py-3.5 rounded-xl flex items-center justify-center gap-2 transition-colors"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" /> Submitting…
                      </>
                    ) : (
                      <>Submit &amp; confirm payment</>
                    )}
                  </button>
                )}
                <p className="text-[11px] text-center text-[#6f787e] mt-2">
                  Free cancellation · Balance paid at the hotel
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

/* ---------- small helpers ---------- */

const Steps: React.FC<{ step: Step }> = ({ step }) => {
  const items = [
    { id: 'rooms', label: 'Choose rooms' },
    { id: 'details', label: 'Guest details' },
    { id: 'payment', label: 'Payment' },
    { id: 'confirmed', label: 'Done' },
  ];
  const idx = items.findIndex((i) => i.id === step);
  return (
    <div className="flex items-center gap-2 text-xs font-semibold">
      {items.map((it, i) => (
        <React.Fragment key={it.id}>
          <span className={`flex items-center gap-1.5 ${i <= idx ? 'text-[#087ea4]' : 'text-[#b3ad9d]'}`}>
            <span
              className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${
                i <= idx ? 'bg-[#087ea4] text-white' : 'bg-[#e5e2db] text-[#6f787e]'
              }`}
            >
              {i + 1}
            </span>
            <span className="hidden sm:inline">{it.label}</span>
          </span>
          {i < items.length - 1 && (
            <span className={`h-px w-6 sm:w-10 ${i < idx ? 'bg-[#087ea4]' : 'bg-[#d8cfbd]'}`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

const DateField: React.FC<{
  label: string;
  value: string;
  placeholder: string;
  min: string;
  disabled?: boolean;
  inputRef?: React.RefObject<HTMLInputElement>;
  onChange: (v: string) => void;
}> = ({ label, value, placeholder, min, disabled, inputRef, onChange }) => (
  <div
    className={`relative rounded-xl transition-colors ${
      disabled ? 'opacity-60' : 'hover:bg-[#f7f4ec]/70'
    }`}
  >
    <div className="px-3 py-2">
      <span className="block text-[10px] font-bold uppercase tracking-[0.16em] text-[#6f787e]">
        {label}
      </span>
      <div className="flex items-center justify-between gap-2 mt-0.5">
        <span
          className={`text-[15px] font-semibold truncate ${
            value ? 'text-[#1c1c17]' : 'text-[#9aa2a7]'
          }`}
        >
          {value ? formatDate(value) : placeholder}
        </span>
        <CalendarDays className="w-4 h-4 text-[#087ea4] flex-shrink-0" />
      </div>
      <span className="block text-[10px] font-semibold text-[#087ea4] mt-0.5 h-3 leading-3">
        {value && !disabled ? 'Tap to change' : ''}
      </span>
    </div>
    <input
      ref={inputRef}
      type="date"
      value={value}
      min={min}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value)}
      onClick={(e) => {
        try {
          (e.currentTarget as HTMLInputElement & { showPicker?: () => void }).showPicker?.();
        } catch {
          /* picker already open */
        }
      }}
      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
      aria-label={label}
    />
  </div>
);

const Input: React.FC<{
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}> = ({ label, value, onChange, placeholder, type = 'text' }) => (
  <div>
    <label className="text-[10px] font-bold text-[#6f787e] uppercase block mb-1">{label}</label>
    <input
      type={type}
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className="w-full text-sm bg-[#fcf9f1] border border-[#bec8ce] rounded-lg p-2.5 text-[#1c1c17] focus:outline-none focus:border-[#087ea4]"
    />
  </div>
);

const Line: React.FC<{ k: string; v: string }> = ({ k, v }) => (
  <div className="flex justify-between text-[#3f484e]">
    <span>{k}</span>
    <span className="font-semibold text-[#1c1c17]">{v}</span>
  </div>
);

const Row: React.FC<{ k: string; v: React.ReactNode }> = ({ k, v }) => (
  <div className="flex justify-between gap-4">
    <span className="text-[#6f787e]">{k}</span>
    <span className="font-semibold text-[#1c1c17] text-right">{v}</span>
  </div>
);
