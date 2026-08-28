import React, { useState } from 'react';
import { X, Lock, Loader2, AlertCircle } from 'lucide-react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { ADMIN_EMAIL, ADMIN_PASSWORD, LOCAL_ADMIN_KEY } from '../data/admin';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const errCode = (e: unknown) => (e as { code?: string })?.code || '';

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [email, setEmail] = useState(ADMIN_EMAIL);
  const [password, setPassword] = useState(ADMIN_PASSWORD);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [note, setNote] = useState('');

  if (!isOpen) return null;

  const finish = () => {
    setPassword('');
    setBusy(false);
    onSuccess();
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    setNote('');
    const mail = email.trim();
    const isConfiguredAdmin = mail === ADMIN_EMAIL && password === ADMIN_PASSWORD;

    // 1) Try for a real Firebase Auth session (best case, when Auth is enabled).
    let authBlocked = false;
    try {
      await signInWithEmailAndPassword(auth, mail, password);
    } catch (e1) {
      const c1 = errCode(e1);
      if (c1 === 'auth/operation-not-allowed' || c1 === 'auth/configuration-not-found') {
        authBlocked = true;
      } else if (isConfiguredAdmin) {
        // account probably doesn't exist yet — create it (also signs us in)
        try {
          await createUserWithEmailAndPassword(auth, mail, password);
        } catch (e2) {
          const c2 = errCode(e2);
          if (c2 === 'auth/operation-not-allowed' || c2 === 'auth/configuration-not-found') {
            authBlocked = true;
          }
        }
      }
    }

    if (auth.currentUser) {
      finish();
      return;
    }

    // 2) Firebase Auth unavailable — fall back to the local admin gate.
    if (isConfiguredAdmin) {
      try {
        sessionStorage.setItem(LOCAL_ADMIN_KEY, '1');
      } catch {
        /* private mode — session still works in-memory via onSuccess */
      }
      if (authBlocked) {
        setNote(
          'Signed in locally. Enable Email/Password in Firebase Authentication for server-verified login.'
        );
      }
      finish();
      return;
    }

    setError('Incorrect email or password.');
    setBusy(false);
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#fdfbf6] rounded-[24px] w-full max-w-sm shadow-2xl border border-[#ece3cf] relative animate-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-[#1c1c17] flex items-center justify-center shadow-md"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="px-7 pt-8 pb-6 text-center">
          <img src="/images/funcity_logo.png" alt="Fun City" className="w-14 h-14 object-contain mx-auto" />
          <div className="flex items-center justify-center gap-2 text-[11px] font-bold text-[#a6893f] uppercase tracking-[0.18em] mt-2">
            <Lock className="w-3.5 h-3.5" />
            Admin Access
          </div>
          <h2 className="text-xl font-extrabold text-[#2f2a20] mt-1">Sign in to continue</h2>
        </div>

        <form onSubmit={submit} className="px-6 pb-7 space-y-3">
          <input
            type="email"
            required
            autoFocus
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full text-sm bg-white border border-[#ded2b5] rounded-xl p-3 text-[#1c1c17] focus:outline-none focus:border-[#a6893f]"
          />
          <input
            type="password"
            required
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full text-sm bg-white border border-[#ded2b5] rounded-xl p-3 text-[#1c1c17] focus:outline-none focus:border-[#a6893f]"
          />

          {error && (
            <div className="flex items-start gap-2 text-xs text-[#a12a2a] bg-[#fff3f3] border border-[#f3c9c9] rounded-lg p-2.5">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              {error}
            </div>
          )}
          {note && (
            <div className="text-[11px] text-[#8a7f66] bg-[#f6f3eb] border border-[#e5e2db] rounded-lg p-2.5">
              {note}
            </div>
          )}

          <button
            type="submit"
            disabled={busy}
            className="w-full flex items-center justify-center gap-2 text-white font-bold text-sm py-3 rounded-xl bg-gradient-to-b from-[#d8b348] to-[#a9801d] hover:brightness-105 active:scale-95 disabled:opacity-60 transition-all"
          >
            {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            {busy ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
};
