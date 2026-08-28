import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  LogOut,
  ArrowLeft,
  Loader2,
  CalendarDays,
  IndianRupee,
  BedDouble,
  Search,
  RefreshCw,
  Bell,
  Check,
  X as XIcon,
  Clock,
  TrendingUp,
} from 'lucide-react';
import {
  subscribeBookings,
  updateBookingStatus,
  BookingRecord,
  BookingStatus,
} from '../services/bookings';
import { formatDate, todayISO, toISODate } from '../utils/dates';
import { inr } from '../data/rooms';
import { RESORT_NAME } from '../data/contact';

interface AdminPageProps {
  onExit: () => void;
  onSignOut: () => void;
  adminEmail: string | null;
}

const STATUS_META: Record<BookingStatus, { label: string; cls: string; dot: string }> = {
  pending: { label: 'Pending', cls: 'bg-[#b8860b]/10 text-[#a9801d]', dot: '#a9801d' },
  confirmed: { label: 'Confirmed', cls: 'bg-[#0a7d33]/10 text-[#0a7d33]', dot: '#0a7d33' },
  cancelled: { label: 'Cancelled', cls: 'bg-[#a12a2a]/10 text-[#a12a2a]', dot: '#a12a2a' },
};

export const AdminPage: React.FC<AdminPageProps> = ({ onExit, onSignOut, adminEmail }) => {
  const [rows, setRows] = useState<BookingRecord[] | null>(null);
  const [error, setError] = useState('');
  const [q, setQ] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | BookingStatus>('all');
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [bellOpen, setBellOpen] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [nonce, setNonce] = useState(0); // bump to re-subscribe
  const [toast, setToast] = useState<{ msg: string; kind: 'ok' | 'err' } | null>(null);
  const bellRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(t);
  }, [toast]);

  useEffect(() => {
    const unsub = subscribeBookings(
      (data) => {
        setRows(data);
        setError('');
        setLastSync(new Date());
      },
      (e) => setError(e.message || 'Failed to load bookings.')
    );
    return unsub;
  }, [nonce]);

  useEffect(() => {
    if (!bellOpen) return;
    const h = (e: MouseEvent) => {
      if (bellRef.current && !bellRef.current.contains(e.target as Node)) setBellOpen(false);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [bellOpen]);

  const refresh = () => {
    setRefreshing(true);
    setNonce((n) => n + 1);
    setTimeout(() => setRefreshing(false), 700);
  };

  const setStatus = async (id: string, status: BookingStatus) => {
    setBusyId(id);
    setError('');
    try {
      await updateBookingStatus(id, status);
      setToast({ msg: `Booking marked ${status}`, kind: 'ok' });
    } catch (e) {
      console.error('Status update failed:', e);
      const code = (e as { code?: string })?.code || '';
      const msg =
        code === 'permission-denied'
          ? 'Blocked by Firestore rules — publish the latest firestore.rules (bookings → allow update).'
          : code === 'not-found'
          ? 'That booking no longer exists.'
          : code === 'unavailable'
          ? 'Firestore unreachable — check your connection.'
          : `Could not update status${code ? ` (${code})` : ''}.`;
      setError(msg);
      setToast({ msg, kind: 'err' });
    } finally {
      setBusyId(null);
    }
  };

  const today = todayISO();
  const list = rows ?? [];
  const pending = list.filter((b) => b.status === 'pending');

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return list.filter((b) => {
      if (statusFilter !== 'all' && b.status !== statusFilter) return false;
      if (!term) return true;
      return [b.bookingRef, b.guestName, b.guestEmail, b.guestPhone, b.roomNumber, b.roomTypeTitle]
        .join(' ')
        .toLowerCase()
        .includes(term);
    });
  }, [list, q, statusFilter]);

  const stats = useMemo(() => {
    const confirmedRevenue = list
      .filter((b) => b.status === 'confirmed')
      .reduce((s, b) => s + (b.total || 0), 0);
    const collected = list
      .filter((b) => b.status !== 'cancelled')
      .reduce((s, b) => s + (b.paidAmount || 0), 0);
    const pendingAmount = pending.reduce((s, b) => s + (b.total || 0), 0);
    const cancelledToday = list.filter(
      (b) => b.status === 'cancelled' && b.statusUpdatedAt && toISODate(b.statusUpdatedAt) === today
    ).length;
    return { confirmedRevenue, collected, pendingAmount, cancelledToday };
  }, [list, pending, today]);

  // ---- chart data ----
  const days = useMemo(() => {
    const out: { key: string; label: string }[] = [];
    const d = new Date();
    d.setDate(d.getDate() - 13);
    for (let i = 0; i < 14; i++) {
      out.push({ key: toISODate(d), label: `${d.getDate()}/${d.getMonth() + 1}` });
      d.setDate(d.getDate() + 1);
    }
    return out;
  }, [lastSync]);

  const revenueByDay = useMemo(
    () =>
      days.map((day) => ({
        label: day.label,
        value: list
          .filter((b) => b.status !== 'cancelled' && b.createdAt && toISODate(b.createdAt) === day.key)
          .reduce((s, b) => s + (b.total || 0), 0),
      })),
    [days, list]
  );

  const bookingsByDay = useMemo(
    () =>
      days.map((day) => ({
        label: day.label,
        value: list.filter((b) => b.createdAt && toISODate(b.createdAt) === day.key).length,
      })),
    [days, list]
  );

  const statusSplit = useMemo(
    () => [
      { label: 'Confirmed', value: list.filter((b) => b.status === 'confirmed').length, color: '#0a7d33' },
      { label: 'Pending', value: pending.length, color: '#a9801d' },
      { label: 'Cancelled', value: list.filter((b) => b.status === 'cancelled').length, color: '#a12a2a' },
    ],
    [list, pending]
  );

  const roomTypeSplit = useMemo(() => {
    const map = new Map<string, number>();
    list.forEach((b) => map.set(b.roomTypeTitle, (map.get(b.roomTypeTitle) || 0) + 1));
    return [...map.entries()].map(([label, value]) => ({ label, value }));
  }, [list]);

  return (
    <div className="min-h-screen bg-[#f4f1e9]">
      {/* Header */}
      <header className="bg-[#1c1c17] text-white sticky top-0 z-30">
        <div className="max-w-[1200px] mx-auto px-4 md:px-8 py-3.5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <img src="/images/funcity_logo.png" alt="" className="w-9 h-9 object-contain" />
            <div>
              <p className="text-sm font-extrabold leading-tight">{RESORT_NAME}</p>
              <p className="text-[11px] text-white/55 leading-tight flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#25D366] inline-block" />
                Live · {lastSync ? lastSync.toLocaleTimeString('en-IN') : '—'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={refresh}
              className="flex items-center gap-1.5 text-xs font-semibold bg-white/10 hover:bg-white/20 px-3 py-2 rounded-full transition-colors"
              title="Refresh"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>

            <div className="relative" ref={bellRef}>
              <button
                onClick={() => setBellOpen((o) => !o)}
                className="relative flex items-center bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors"
                title="Pending bookings"
              >
                <Bell className="w-4 h-4" />
                {pending.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#a12a2a] text-white text-[10px] font-bold min-w-[16px] h-4 px-1 rounded-full flex items-center justify-center">
                    {pending.length}
                  </span>
                )}
              </button>
              {bellOpen && (
                <div className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto bg-white text-[#1c1c17] rounded-2xl shadow-2xl border border-[#e5e0d2] p-2 z-40">
                  <p className="text-xs font-bold uppercase tracking-wider text-[#6f6650] px-2 py-1.5">
                    Pending confirmation ({pending.length})
                  </p>
                  {pending.length === 0 && (
                    <p className="text-xs text-[#8a8677] px-2 py-3">All caught up 🎉</p>
                  )}
                  {pending.map((b) => (
                    <div key={b.id} className="p-2 rounded-xl hover:bg-[#f7f4ec]">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-bold text-[#087ea4]">
                          {b.bookingRef}
                        </span>
                        <span className="text-[11px] text-[#6f6650]">{inr(b.total)}</span>
                      </div>
                      <p className="text-xs text-[#1c1c17] font-semibold">
                        {b.roomTypeTitle} #{b.roomNumber} · {b.guestName}
                      </p>
                      <p className="text-[11px] text-[#6f6650]">
                        {formatDate(b.checkIn)} → {formatDate(b.checkOut)}
                      </p>
                      <div className="flex gap-1.5 mt-1.5">
                        <button
                          onClick={() => setStatus(b.id, 'confirmed')}
                          disabled={busyId === b.id}
                          className="flex-1 text-[11px] font-bold bg-[#0a7d33] text-white py-1.5 rounded-lg hover:brightness-110 disabled:opacity-50"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => setStatus(b.id, 'cancelled')}
                          disabled={busyId === b.id}
                          className="flex-1 text-[11px] font-bold bg-[#f1eee6] text-[#a12a2a] py-1.5 rounded-lg hover:bg-[#eae5d8] disabled:opacity-50"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {adminEmail && (
              <span className="hidden md:block text-xs text-white/60 px-1">{adminEmail}</span>
            )}
            <button
              onClick={onExit}
              className="flex items-center gap-1.5 text-xs font-semibold bg-white/10 hover:bg-white/20 px-3 py-2 rounded-full transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Site</span>
            </button>
            <button
              onClick={onSignOut}
              className="flex items-center gap-1.5 text-xs font-semibold bg-[#a9801d] hover:bg-[#8a6916] px-3 py-2 rounded-full transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Sign out</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-[1200px] mx-auto px-4 md:px-8 py-6 md:py-8 space-y-6">
        {error && (
          <div className="bg-[#fff3f3] border border-[#f3c9c9] text-[#a12a2a] text-sm rounded-xl p-4">
            {error} — make sure Firestore rules allow the admin account to read/update{' '}
            <code>bookings</code>.
          </div>
        )}

        {/* KPI cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          <Kpi
            icon={<IndianRupee className="w-4 h-4" />}
            label="Confirmed revenue"
            value={inr(stats.confirmedRevenue)}
            tone="green"
          />
          <Kpi
            icon={<TrendingUp className="w-4 h-4" />}
            label="Advance collected"
            value={inr(stats.collected)}
            tone="teal"
          />
          <Kpi
            icon={<Clock className="w-4 h-4" />}
            label="Pending amount"
            value={inr(stats.pendingAmount)}
            sub={`${pending.length} awaiting`}
            tone="gold"
          />
          <Kpi
            icon={<XIcon className="w-4 h-4" />}
            label="Cancelled today"
            value={String(stats.cancelledToday)}
            tone="red"
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Panel title="Revenue · last 14 days" className="lg:col-span-2">
            <BarChart data={revenueByDay} color="#087ea4" format={(v) => inr(v)} />
          </Panel>
          <Panel title="Status split">
            <Donut segments={statusSplit} />
          </Panel>
          <Panel title="Bookings · last 14 days" className="lg:col-span-2">
            <BarChart data={bookingsByDay} color="#a9801d" format={(v) => String(v)} />
          </Panel>
          <Panel title="By room type">
            <HBars data={roomTypeSplit} />
          </Panel>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-grow">
            <Search className="w-4 h-4 text-[#8a8677] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search ref, guest, phone, room…"
              className="w-full text-sm bg-white border border-[#ded2b5] rounded-xl pl-9 pr-3 py-2.5 focus:outline-none focus:border-[#a6893f]"
            />
          </div>
          <div className="flex gap-1 bg-white border border-[#ded2b5] rounded-xl p-1">
            {(['all', 'pending', 'confirmed', 'cancelled'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setStatusFilter(f)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg capitalize transition-colors ${
                  statusFilter === f ? 'bg-[#1c1c17] text-white' : 'text-[#6f6650] hover:bg-[#f4f1e9]'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Bookings */}
        {!rows && !error && (
          <div className="flex items-center gap-2 text-sm text-[#6f6650] py-10 justify-center">
            <Loader2 className="w-4 h-4 animate-spin" /> Loading bookings…
          </div>
        )}
        {rows && filtered.length === 0 && !error && (
          <div className="text-center text-sm text-[#6f6650] py-10 bg-white rounded-2xl border border-[#e5e0d2]">
            No bookings match.
          </div>
        )}
        <div className="space-y-3">
          {filtered.map((b) => (
            <BookingCard key={b.id} b={b} busy={busyId === b.id} onStatus={setStatus} />
          ))}
        </div>
      </main>

      {toast && (
        <div
          className={`fixed bottom-5 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-xl text-sm font-semibold shadow-xl border animate-in fade-in slide-in-from-bottom-2 ${
            toast.kind === 'ok'
              ? 'bg-[#0a7d33] text-white border-[#0a7d33]'
              : 'bg-[#a12a2a] text-white border-[#a12a2a]'
          }`}
        >
          {toast.msg}
        </div>
      )}
    </div>
  );
};

/* ============================== bits ============================== */

const toneMap: Record<string, string> = {
  green: 'text-[#0a7d33]',
  teal: 'text-[#087ea4]',
  gold: 'text-[#a9801d]',
  red: 'text-[#a12a2a]',
};

const Kpi: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
  tone: keyof typeof toneMap | string;
}> = ({ icon, label, value, sub, tone }) => (
  <div className="bg-white rounded-2xl border border-[#e5e0d2] p-4">
    <div className={`flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider ${toneMap[tone] || 'text-[#8a7643]'}`}>
      {icon}
      {label}
    </div>
    <p className="text-xl md:text-2xl font-extrabold text-[#1c1c17] mt-1">{value}</p>
    {sub && <p className="text-[11px] text-[#8a8677] mt-0.5">{sub}</p>}
  </div>
);

const Panel: React.FC<{ title: string; className?: string; children: React.ReactNode }> = ({
  title,
  className = '',
  children,
}) => (
  <div className={`bg-white rounded-2xl border border-[#e5e0d2] p-4 ${className}`}>
    <p className="text-xs font-bold uppercase tracking-wider text-[#6f6650] mb-3">{title}</p>
    {children}
  </div>
);

const BarChart: React.FC<{
  data: { label: string; value: number }[];
  color: string;
  format: (v: number) => string;
}> = ({ data, color, format }) => {
  const max = Math.max(1, ...data.map((d) => d.value));
  const total = data.reduce((s, d) => s + d.value, 0);
  return (
    <div>
      <div className="flex items-end gap-1 h-32">
        {data.map((d, i) => (
          <div key={i} className="flex-1 flex flex-col items-center justify-end group relative">
            <span className="absolute -top-5 text-[10px] font-bold text-[#1c1c17] opacity-0 group-hover:opacity-100 whitespace-nowrap">
              {format(d.value)}
            </span>
            <div
              className="w-full rounded-t"
              style={{
                height: `${(d.value / max) * 100}%`,
                minHeight: d.value > 0 ? 3 : 0,
                background: color,
              }}
            />
          </div>
        ))}
      </div>
      <div className="flex gap-1 mt-1">
        {data.map((d, i) => (
          <span key={i} className="flex-1 text-center text-[9px] text-[#8a8677]">
            {i % 2 === 0 ? d.label : ''}
          </span>
        ))}
      </div>
      <p className="text-[11px] text-[#6f6650] mt-1">Total: {format(total)}</p>
    </div>
  );
};

const Donut: React.FC<{ segments: { label: string; value: number; color: string }[] }> = ({
  segments,
}) => {
  const total = segments.reduce((s, x) => s + x.value, 0);
  const R = 42;
  const C = 2 * Math.PI * R;
  let offset = 0;
  return (
    <div className="flex items-center gap-4">
      <svg viewBox="0 0 100 100" className="w-28 h-28 flex-shrink-0 -rotate-90">
        <circle cx="50" cy="50" r={R} fill="none" stroke="#eee7d8" strokeWidth="14" />
        {total > 0 &&
          segments.map((s, i) => {
            const len = (s.value / total) * C;
            const el = (
              <circle
                key={i}
                cx="50"
                cy="50"
                r={R}
                fill="none"
                stroke={s.color}
                strokeWidth="14"
                strokeDasharray={`${len} ${C - len}`}
                strokeDashoffset={-offset}
              />
            );
            offset += len;
            return el;
          })}
      </svg>
      <div className="space-y-1.5">
        {segments.map((s) => (
          <div key={s.label} className="flex items-center gap-2 text-xs">
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: s.color }} />
            <span className="text-[#3f484e]">{s.label}</span>
            <span className="font-bold text-[#1c1c17]">{s.value}</span>
          </div>
        ))}
        {total === 0 && <p className="text-xs text-[#8a8677]">No data yet</p>}
      </div>
    </div>
  );
};

const HBars: React.FC<{ data: { label: string; value: number }[] }> = ({ data }) => {
  const max = Math.max(1, ...data.map((d) => d.value));
  return (
    <div className="space-y-2.5">
      {data.length === 0 && <p className="text-xs text-[#8a8677]">No data yet</p>}
      {data.map((d) => (
        <div key={d.label}>
          <div className="flex justify-between text-xs mb-0.5">
            <span className="text-[#3f484e]">{d.label}</span>
            <span className="font-bold text-[#1c1c17]">{d.value}</span>
          </div>
          <div className="h-2.5 bg-[#eee7d8] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#087ea4] rounded-full"
              style={{ width: `${(d.value / max) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

const BookingCard: React.FC<{
  b: BookingRecord;
  busy: boolean;
  onStatus: (id: string, s: BookingStatus) => void;
}> = ({ b, busy, onStatus }) => {
  const kids =
    b.guests?.children > 0
      ? ` · ${b.guests.children} child${b.guests.children !== 1 ? 'ren' : ''}${
          b.guests.childAges?.length ? ` (ages ${b.guests.childAges.join(', ')})` : ''
        }`
      : '';
  const meta = STATUS_META[b.status];
  return (
    <div className="bg-white rounded-2xl border border-[#e5e0d2] p-4 md:p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm font-bold text-[#087ea4]">{b.bookingRef}</span>
            <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${meta.cls}`}>
              {meta.label}
            </span>
          </div>
          <p className="text-lg font-extrabold text-[#1c1c17] mt-1">
            {b.roomTypeTitle} · Room {b.roomNumber}
          </p>
        </div>
        <div className="text-right">
          <p className="text-lg font-extrabold text-[#1c1c17]">{inr(b.total)}</p>
          <p className="text-[11px] text-[#6f6650]">
            Paid {inr(b.paidAmount || 0)} · Bal {inr(b.balanceDue ?? b.total)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-2 mt-4 text-sm">
        <Field k="Guest" v={b.guestName} />
        <Field k="Phone" v={b.guestPhone} />
        <Field k="Email" v={b.guestEmail} />
        <Field k="Occupancy" v={`${b.guests?.adults ?? 0} adult${(b.guests?.adults ?? 0) !== 1 ? 's' : ''}${kids}`} />
        <Field k="Check-in" v={formatDate(b.checkIn)} />
        <Field k="Check-out" v={formatDate(b.checkOut)} />
        <Field k="Nights" v={String(b.nights)} />
        <Field k="Txn ID" v={b.transactionId || '—'} />
        <Field k="Payment" v={`${b.paymentOption === 'custom' ? 'Custom' : (b.paymentOption || '') + '%'} · ${b.paymentMethod || '—'}`} />
        <Field k="Booked on" v={b.createdAt ? b.createdAt.toLocaleString('en-IN') : '—'} />
        <Field
          k="Status changed"
          v={b.statusUpdatedAt ? b.statusUpdatedAt.toLocaleString('en-IN') : '—'}
        />
      </div>

      {b.specialRequests && (
        <p className="mt-3 text-xs text-[#3f484e] bg-[#faf7ef] border border-[#eee7d8] rounded-lg p-2.5">
          <span className="font-bold">Requests: </span>
          {b.specialRequests}
        </p>
      )}

      {/* Status control */}
      <div className="mt-4 flex items-center gap-2">
        <span className="text-[11px] font-bold uppercase tracking-wider text-[#8a8677]">Set status:</span>
        {(['pending', 'confirmed', 'cancelled'] as BookingStatus[]).map((s) => (
          <button
            key={s}
            disabled={busy || b.status === s}
            onClick={() => onStatus(b.id, s)}
            className={`text-xs font-bold px-3 py-1.5 rounded-full border transition-colors flex items-center gap-1 ${
              b.status === s
                ? 'border-transparent ' + STATUS_META[s].cls
                : 'border-[#ded2b5] text-[#6f6650] hover:bg-[#f7f4ec] disabled:opacity-50'
            }`}
          >
            {busy ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : s === 'confirmed' ? (
              <Check className="w-3 h-3" />
            ) : s === 'cancelled' ? (
              <XIcon className="w-3 h-3" />
            ) : (
              <Clock className="w-3 h-3" />
            )}
            {STATUS_META[s].label}
          </button>
        ))}
      </div>
    </div>
  );
};

const Field: React.FC<{ k: string; v: string }> = ({ k, v }) => (
  <div>
    <p className="text-[10px] font-bold uppercase tracking-wider text-[#8a8677]">{k}</p>
    <p className="text-[#1c1c17] font-medium break-words">{v || '—'}</p>
  </div>
);
