/**
 * Open a native <input type="date"> picker programmatically.
 * Uses showPicker() where available (Chrome/Edge/Firefox/Safari 16+),
 * falls back to focus. Deferred a tick so any closing popover unmounts first.
 */
export const openNativePicker = (el: HTMLInputElement | null): void => {
  if (!el) return;
  setTimeout(() => {
    try {
      const withPicker = el as HTMLInputElement & { showPicker?: () => void };
      if (typeof withPicker.showPicker === 'function') withPicker.showPicker();
      else el.focus();
    } catch {
      el.focus();
    }
  }, 0);
};
