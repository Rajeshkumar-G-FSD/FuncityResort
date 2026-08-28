import {
  collection,
  addDoc,
  updateDoc,
  doc,
  getDocs,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../firebase';

export type BookingStatus = 'pending' | 'confirmed' | 'cancelled';

export interface BookingGuests {
  adults: number;
  children: number;
  childAges: number[];
}

export interface BookingInput {
  roomTypeId: string;
  roomTypeTitle: string;
  roomNumber: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  guests: BookingGuests;
  guestSummary: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  specialRequests: string;
  subtotal: number;
  tax: number;
  total: number;
  // payment
  paymentOption: '10' | '40' | 'custom';
  paidAmount: number;
  balanceDue: number;
  transactionId: string;
  paymentMethod: string;
}

export interface BookingRecord extends BookingInput {
  id: string;
  bookingRef: string;
  status: BookingStatus;
  createdAt: Date | null;
  statusUpdatedAt: Date | null;
}

const COL = 'bookings';
const genRef = () => 'FC-' + Math.floor(100000 + Math.random() * 900000);

/** [aIn, aOut) overlaps [bIn, bOut) */
export const rangesOverlap = (aIn: string, aOut: string, bIn: string, bOut: string) =>
  aIn < bOut && aOut > bIn;

/**
 * Room numbers that are unavailable for the requested dates.
 * A room is locked while a booking that overlaps the range is either
 * `pending` (awaiting confirmation) or `confirmed`.
 */
export async function getBlockedRoomNumbers(
  checkIn: string,
  checkOut: string
): Promise<Set<string>> {
  const blocked = new Set<string>();
  if (!checkIn || !checkOut) return blocked;
  const snap = await getDocs(
    query(collection(db, COL), where('status', 'in', ['pending', 'confirmed']))
  );
  snap.forEach((d) => {
    const b = d.data() as BookingInput;
    if (b.checkIn && b.checkOut && rangesOverlap(b.checkIn, b.checkOut, checkIn, checkOut)) {
      blocked.add(b.roomNumber);
    }
  });
  return blocked;
}

export async function createBooking(input: BookingInput): Promise<BookingRecord> {
  const bookingRef = genRef();
  await addDoc(collection(db, COL), {
    ...input,
    bookingRef,
    status: 'pending',
    createdAt: serverTimestamp(),
    statusUpdatedAt: serverTimestamp(),
  });
  return {
    ...input,
    id: bookingRef,
    bookingRef,
    status: 'pending',
    createdAt: new Date(),
    statusUpdatedAt: new Date(),
  };
}

export async function updateBookingStatus(id: string, status: BookingStatus): Promise<void> {
  await updateDoc(doc(db, COL, id), { status, statusUpdatedAt: serverTimestamp() });
}

/** Live stream of every booking, newest first (admin panel). */
export function subscribeBookings(
  cb: (rows: BookingRecord[]) => void,
  onError?: (e: Error) => void
) {
  const q = query(collection(db, COL), orderBy('createdAt', 'desc'));
  return onSnapshot(
    q,
    (snap) => {
      const rows: BookingRecord[] = snap.docs.map((d) => {
        const b = d.data() as BookingInput & {
          bookingRef?: string;
          status?: BookingStatus;
          createdAt?: Timestamp | null;
          statusUpdatedAt?: Timestamp | null;
        };
        return {
          ...(b as BookingInput),
          id: d.id,
          bookingRef: b.bookingRef ?? d.id,
          status: b.status ?? 'pending',
          createdAt: b.createdAt instanceof Timestamp ? b.createdAt.toDate() : null,
          statusUpdatedAt:
            b.statusUpdatedAt instanceof Timestamp ? b.statusUpdatedAt.toDate() : null,
        };
      });
      cb(rows);
    },
    (e) => onError?.(e as Error)
  );
}
