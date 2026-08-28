import React, { useEffect, useRef, useState } from 'react';
import { Users, ChevronDown, Minus, Plus } from 'lucide-react';

export interface GuestValue {
  adults: number;
  children: number;
  childAges: number[];
}

export const DEFAULT_GUESTS: GuestValue = { adults: 2, children: 0, childAges: [] };

export const summariseGuests = (v: GuestValue): string => {
  const parts = [`${v.adults} Adult${v.adults !== 1 ? 's' : ''}`];
  if (v.children > 0) parts.push(`${v.children} Child${v.children !== 1 ? 'ren' : ''}`);
  return parts.join(' · ');
};

interface GuestSelectorProps {
  value: GuestValue;
  onChange: (v: GuestValue) => void;
  /** compact = smaller trigger used inside the reservation modal */
  compact?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** fired when the user confirms the guest count via the Apply button */
  onApply?: () => void;
  /** render the panel in normal flow (pushes content down) instead of absolutely positioned */
  inlinePanel?: boolean;
}

export const GuestSelector: React.FC<GuestSelectorProps> = ({
  value,
  onChange,
  compact = false,
  onOpenChange,
  onApply,
  inlinePanel = false,
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    onOpenChange?.(open);
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open, onOpenChange]);

  const setAdults = (n: number) =>
    onChange({ ...value, adults: Math.max(1, Math.min(12, n)) });

  const setChildren = (n: number) => {
    const children = Math.max(0, Math.min(8, n));
    const childAges = Array.from({ length: children }, (_, i) => value.childAges[i] ?? 6);
    onChange({ ...value, children, childAges });
  };

  const setAge = (i: number, age: number) => {
    const childAges = [...value.childAges];
    childAges[i] = age;
    onChange({ ...value, childAges });
  };

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`w-full flex items-center gap-3.5 text-left ${
          compact ? 'px-3 py-2.5' : 'px-4 py-4 md:px-5'
        }`}
      >
        <Users className="w-5 h-5 text-[#a6893f] flex-shrink-0" strokeWidth={1.75} />
        <span className="flex-grow min-w-0">
          <span className="block text-[11px] font-bold uppercase tracking-[0.18em] text-[#8a7643]">
            Guests
          </span>
          <span className="block text-[17px] font-semibold truncate text-[#2f2a20]">
            {summariseGuests(value)}
          </span>
        </span>
        <ChevronDown
          className={`w-4 h-4 text-[#b8a986] flex-shrink-0 transition-transform ${
            open ? 'rotate-180 text-[#a6893f]' : ''
          }`}
        />
      </button>

      {open && (
        <div
          className={
            inlinePanel
              ? 'relative mx-3 mb-3 mt-1 border-t border-[#f0e9d9] pt-4 animate-in fade-in duration-150'
              : 'absolute top-full left-2 right-2 md:left-2 md:right-auto md:min-w-[300px] mt-1 bg-white rounded-2xl shadow-xl border border-[#ece3cf] p-4 z-40 animate-in fade-in zoom-in-95 duration-150'
          }
        >
          <StepperRow
            label="Adults"
            hint="Age 13 or above"
            value={value.adults}
            min={1}
            onDec={() => setAdults(value.adults - 1)}
            onInc={() => setAdults(value.adults + 1)}
          />
          <div className="h-px bg-[#f0e9d9] my-3" />
          <StepperRow
            label="Children"
            hint="Age 0 - 12"
            value={value.children}
            min={0}
            onDec={() => setChildren(value.children - 1)}
            onInc={() => setChildren(value.children + 1)}
          />

          {value.children > 0 && (
            <div className="mt-3 pt-3 border-t border-[#f0e9d9]">
              <span className="block text-[11px] font-bold uppercase tracking-[0.16em] text-[#8a7643] mb-2">
                Age of children at check-out
              </span>
              <div className="grid grid-cols-2 gap-2">
                {value.childAges.map((age, i) => (
                  <label key={i} className="text-xs text-[#6f6650]">
                    <span className="block mb-1">Child {i + 1}</span>
                    <select
                      value={age}
                      onChange={(e) => setAge(i, Number(e.target.value))}
                      className="w-full border border-[#ded2b5] rounded-lg px-2 py-2 text-sm text-[#2f2a20] bg-white focus:outline-none focus:border-[#a6893f]"
                    >
                      {Array.from({ length: 13 }, (_, n) => (
                        <option key={n} value={n}>
                          {n === 0 ? 'Under 1' : `${n} year${n !== 1 ? 's' : ''}`}
                        </option>
                      ))}
                    </select>
                  </label>
                ))}
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={() => {
              setOpen(false);
              onApply?.();
            }}
            className="mt-4 w-full bg-gradient-to-b from-[#d8b348] to-[#a9801d] text-white font-semibold text-sm py-2.5 rounded-xl hover:brightness-105 active:scale-95 transition-all"
          >
            Apply
          </button>
        </div>
      )}
    </div>
  );
};

const StepperRow: React.FC<{
  label: string;
  hint: string;
  value: number;
  min: number;
  onDec: () => void;
  onInc: () => void;
}> = ({ label, hint, value, min, onDec, onInc }) => (
  <div className="flex items-center justify-between">
    <div>
      <span className="block text-sm font-semibold text-[#2f2a20]">{label}</span>
      <span className="block text-xs text-[#9a8f74]">{hint}</span>
    </div>
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={onDec}
        disabled={value <= min}
        className="w-8 h-8 rounded-full border border-[#ded2b5] text-[#a6893f] flex items-center justify-center hover:bg-[#f7f1e2] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        aria-label={`Decrease ${label}`}
      >
        <Minus className="w-4 h-4" />
      </button>
      <span className="w-5 text-center text-sm font-bold text-[#2f2a20]">{value}</span>
      <button
        type="button"
        onClick={onInc}
        className="w-8 h-8 rounded-full border border-[#ded2b5] text-[#a6893f] flex items-center justify-center hover:bg-[#f7f1e2] transition-colors"
        aria-label={`Increase ${label}`}
      >
        <Plus className="w-4 h-4" />
      </button>
    </div>
  </div>
);
