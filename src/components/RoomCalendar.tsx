import React, { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Lock, LockOpen, Loader2, CalendarRange } from 'lucide-react';
import { ROOM_TYPES, inr } from '../data/rooms';
import { todayISO, addDaysISO, formatDate } from '../utils/dates';
import { BookingRecord, BookingStatus } from '../services/bookings';
import {
  blockId,
  blockRoomDay,
  unblockRoomDay,
  subscribeRoomBlocks,
} from '../services/roomBlocks';

const WINDOW = 21; // days visible at once

interface RoomCalendarProps {
  bookings: BookingRecord[];
  onToast: (msg: string, kind: 'ok' | 'err') => void;
}

export const RoomCalendar: React.FC<RoomCalendarProps> = ({ bookings, onToast }) => {
  const [anchor, setAnchor] = useState<string>(todayISO());
  const [blocks, setBlocks] = useState<Set<string>>(new Set());
  const [busy, setBusy] = useState<Set<string>>(new Set());
  const [blockErr, setBlockErr] = useState('');

  const days = useMemo(() => {
    const out: string[] = [];
    for (let i = 0; i < WINDOW; i++) out.push(addDaysISO(anchor, i));
    return out;
  }, [anchor]);

  const rangeEndExclusive = addDaysISO(days[days.length - 1], 1);

  useEffect(() => {
    const unsub = subscribeRoomBlocks(
      days[0],
      rangeEndExclusive,
      (keys) => {
        setBlocks(keys);
        setBlockErr('');
      },
      (e) => setBlockErr(e.message || 'Could not load room blocks.')
    );
    return unsub;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [days[0], rangeEndExclusive]);

  // Expand bookings -> per room/day map
  const bookingByCell = useMemo(() => {
    const m = new Map<string, { status: BookingStatus; label: string }>();
    bookings.forEach((b) => {
      if (b.status === 'cancelled') return;
      let d = b.checkIn;
      let guard = 0;
      while (d < b.checkOut && guard < 400) {
        m.set(blockId(b.roomNumber, d), {
          status: b.status,
          label: `${b.bookingRef} · ${b.guestName} (${b.status})`,
        });
        d = addDaysISO(d, 1);
        guard += 1;
      }
    });
    return m;
  }, [bookings]);

  const today = todayISO();

  const setBusyKey = (key: string, on: boolean) =>
    setBusy((prev) => {
      const next = new Set(prev);
      on ? next.add(key) : next.delete(key);
      return next;
    });

  const toggle = async (room: string, date: string, isBlocked: boolean) => {
    if (date < today || bookingByCell.has(blockId(room, date))) return;
    const key = blockId(room, date);
    setBusyKey(key, true);
    // optimistic
    setBlocks((prev) => {
      const next = new Set(prev);
      isBlocked ? next.delete(key) : next.add(key);
      return next;
    });
    try {
      if (isBlocked) await unblockRoomDay(room, date);
      else await blockRoomDay(room, date);
      onToast(`Room ${room} ${isBlocked ? 'unblocked' : 'blocked'} · ${formatDate(date)}`, 'ok');
    } catch (e) {
      // revert
      setBlocks((prev) => {
        const next = new Set(prev);
        isBlocked ? next.add(key) : next.delete(key);
        return next;
      });
      const code = (e as { code?: string })?.code || '';
      onToast(
        code === 'permission-denied'
          ? 'Blocked by Firestore rules — publish the roomBlocks rule.'
          : `Could not update block${code ? ` (${code})` : ''}.`,
        'err'
      );
    } finally {
      setBusyKey(key, false);
    }
  };

  const bulk = async (room: string, action: 'block' | 'clear') => {
    const targets = days.filter((d) => {
      if (d < today) return false;
      if (bookingByCell.has(blockId(room, d))) return false;
      const has = blocks.has(blockId(room, d));
      return action === 'block' ? !has : has;
    });
    if (!targets.length) return;
    for (const d of targets) {
      // eslint-disable-next-line no-await-in-loop
      await toggle(room, d, action === 'clear');
    }
  };

  const rangeLabel = `${formatDate(days[0])} – ${formatDate(days[days.length - 1])}`;

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <CalendarRange className="w-5 h-5 text-[#087ea4]" />
          <h2 className="text-lg font-extrabold text-[#1c1c17]">Room block calendar</h2>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setAnchor(addDaysISO(anchor, -7))}
            className="w-9 h-9 rounded-full border border-[#ded2b5] bg-white flex items-center justify-center hover:bg-[#f7f4ec]"
            aria-label="Previous week"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-sm font-bold text-[#1c1c17] px-2 min-w-[190px] text-center">
            {rangeLabel}
          </span>
          <button
            onClick={() => setAnchor(addDaysISO(anchor, 7))}
            className="w-9 h-9 rounded-full border border-[#ded2b5] bg-white flex items-center justify-center hover:bg-[#f7f4ec]"
            aria-label="Next week"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => setAnchor(todayISO())}
            className="ml-1 text-xs font-bold px-3 h-9 rounded-full border border-[#ded2b5] bg-white hover:bg-[#f7f4ec]"
          >
            Today
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11px] text-[#6f6650]">
        <Legend swatch="bg-white border border-[#d8cfbd]" label="Available — click to block" />
        <Legend swatch="bg-[#d9534f]" label="Blocked — click to unblock" />
        <Legend swatch="bg-[#087ea4]" label="Confirmed booking" />
        <Legend swatch="bg-[#e0a800]" label="Pending booking" />
        <Legend swatch="bg-[#efe9db]" label="Past" />
      </div>

      {blockErr && (
        <div className="bg-[#fff3f3] border border-[#f3c9c9] text-[#a12a2a] text-xs rounded-lg p-2.5">
          {blockErr}
        </div>
      )}

      {/* Grid */}
      <div className="bg-white rounded-2xl border border-[#e5e0d2] overflow-hidden">
        <div className="overflow-x-auto">
          <div className="min-w-max">
            {/* header */}
            <div className="flex sticky top-0 z-10 bg-[#faf7ef] border-b border-[#e5e0d2]">
              <div className="w-[132px] flex-shrink-0 sticky left-0 bg-[#faf7ef] z-20 px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-[#6f6650] border-r border-[#e5e0d2]">
                Room
              </div>
              {days.map((d) => {
                const dt = new Date(`${d}T00:00:00`);
                const weekend = dt.getDay() === 0 || dt.getDay() === 6;
                const isToday = d === today;
                return (
                  <div
                    key={d}
                    className={`w-11 flex-shrink-0 text-center py-1.5 border-r border-[#eee7d8] ${
                      weekend ? 'bg-[#f3efe3]' : ''
                    } ${isToday ? 'bg-[#087ea4]/10' : ''}`}
                  >
                    <div className="text-[9px] uppercase text-[#8a8677] leading-none">
                      {dt.toLocaleDateString('en-IN', { weekday: 'short' })}
                    </div>
                    <div
                      className={`text-[12px] font-bold leading-tight ${
                        isToday ? 'text-[#087ea4]' : 'text-[#1c1c17]'
                      }`}
                    >
                      {dt.getDate()}
                    </div>
                    <div className="text-[8px] text-[#8a8677] leading-none">
                      {dt.toLocaleDateString('en-IN', { month: 'short' })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* rows grouped by room type */}
            {ROOM_TYPES.map((type) => (
              <React.Fragment key={type.id}>
                <div className="flex bg-[#f7f4ec] border-b border-[#e5e0d2]">
                  <div className="sticky left-0 bg-[#f7f4ec] z-10 px-3 py-1.5 text-[11px] font-extrabold text-[#1c1c17]">
                    {type.title}
                    <span className="font-medium text-[#8a8677]">
                      {' '}
                      · {inr(type.weekdayRate)}/{inr(type.weekendRate)}
                    </span>
                  </div>
                </div>

                {type.roomNumbers.map((room) => (
                  <div key={room} className="flex border-b border-[#f0ece0] last:border-0 group">
                    <div className="w-[132px] flex-shrink-0 sticky left-0 bg-white z-10 px-3 py-1.5 border-r border-[#e5e0d2] flex items-center justify-between">
                      <span className="text-sm font-bold text-[#1c1c17]">{room}</span>
                      <span className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => bulk(room, 'block')}
                          title="Block all available days in view"
                          className="w-6 h-6 rounded-md border border-[#ded2b5] flex items-center justify-center hover:bg-[#f7f4ec] text-[#a12a2a]"
                        >
                          <Lock className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => bulk(room, 'clear')}
                          title="Unblock all days in view"
                          className="w-6 h-6 rounded-md border border-[#ded2b5] flex items-center justify-center hover:bg-[#f7f4ec] text-[#0a7d33]"
                        >
                          <LockOpen className="w-3 h-3" />
                        </button>
                      </span>
                    </div>

                    {days.map((d) => {
                      const key = blockId(room, d);
                      const past = d < today;
                      const bk = bookingByCell.get(key);
                      const blocked = blocks.has(key);
                      const isBusy = busy.has(key);

                      let cls = 'bg-white hover:bg-[#e8f3f6]';
                      let content: React.ReactNode = null;
                      let title = `Room ${room} · ${formatDate(d)} — available`;

                      if (past) {
                        cls = 'bg-[#efe9db] cursor-default';
                        title = 'Past date';
                      } else if (bk) {
                        cls =
                          bk.status === 'confirmed'
                            ? 'bg-[#087ea4] cursor-default'
                            : 'bg-[#e0a800] cursor-default';
                        content = <span className="w-1.5 h-1.5 rounded-full bg-white/90" />;
                        title = bk.label;
                      } else if (blocked) {
                        cls = 'bg-[#d9534f] hover:bg-[#c9302c] text-white';
                        content = <Lock className="w-3 h-3" />;
                        title = `Room ${room} · ${formatDate(d)} — blocked (click to unblock)`;
                      }

                      return (
                        <button
                          key={d}
                          disabled={past || !!bk || isBusy}
                          onClick={() => toggle(room, d, blocked)}
                          title={title}
                          className={`w-11 h-11 flex-shrink-0 border-r border-b border-[#f0ece0] flex items-center justify-center transition-colors ${cls}`}
                        >
                          {isBusy ? <Loader2 className="w-3 h-3 animate-spin text-current" /> : content}
                        </button>
                      );
                    })}
                  </div>
                ))}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      <p className="text-[11px] text-[#8a8677]">
        Blocking a room hides that room number from guests for the selected nights. Online bookings
        (confirmed / pending) are shown here but can only be changed from the Dashboard.
      </p>
    </div>
  );
};

const Legend: React.FC<{ swatch: string; label: string }> = ({ swatch, label }) => (
  <span className="inline-flex items-center gap-1.5">
    <span className={`w-3.5 h-3.5 rounded ${swatch}`} />
    {label}
  </span>
);
