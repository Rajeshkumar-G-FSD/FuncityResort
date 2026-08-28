import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  getDocs,
  query,
  where,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../firebase';

const COL = 'roomBlocks';

/** Deterministic id so a room/day can only be blocked once and is easy to delete. */
export const blockId = (roomNumber: string, date: string) => `${roomNumber}__${date}`;

export interface RoomBlock {
  roomNumber: string;
  date: string; // YYYY-MM-DD
  note?: string;
}

/** Manually block one room for one night. */
export async function blockRoomDay(roomNumber: string, date: string, note = ''): Promise<void> {
  await setDoc(doc(db, COL, blockId(roomNumber, date)), {
    roomNumber,
    date,
    note,
    createdAt: serverTimestamp(),
  });
}

/** Remove a manual block for one room/night. */
export async function unblockRoomDay(roomNumber: string, date: string): Promise<void> {
  await deleteDoc(doc(db, COL, blockId(roomNumber, date)));
}

/**
 * Live set of `${roomNumber}__${date}` keys that are manually blocked,
 * limited to [startISO, endISO) — used by the admin calendar.
 */
export function subscribeRoomBlocks(
  startISO: string,
  endISO: string,
  cb: (keys: Set<string>) => void,
  onError?: (e: Error) => void
) {
  const q = query(
    collection(db, COL),
    where('date', '>=', startISO),
    where('date', '<', endISO)
  );
  return onSnapshot(
    q,
    (snap) => {
      const keys = new Set<string>();
      snap.forEach((d) => {
        const b = d.data() as RoomBlock;
        keys.add(blockId(b.roomNumber, b.date));
      });
      cb(keys);
    },
    (e) => onError?.(e as Error)
  );
}

/** Room numbers with a manual block on ANY night in [checkIn, checkOut). */
export async function getManuallyBlockedRooms(
  checkIn: string,
  checkOut: string
): Promise<Set<string>> {
  const out = new Set<string>();
  if (!checkIn || !checkOut) return out;
  const snap = await getDocs(
    query(collection(db, COL), where('date', '>=', checkIn), where('date', '<', checkOut))
  );
  snap.forEach((d) => out.add((d.data() as RoomBlock).roomNumber));
  return out;
}
