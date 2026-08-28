/**
 * Bootstrap admin credentials.
 *
 * Login flow:
 *  1. The app first tries a real Firebase Authentication session (and
 *     auto-creates this account on first sign-in).
 *  2. If Firebase Auth is not enabled for the project, it falls back to a
 *     LOCAL admin gate keyed on these credentials (stored in sessionStorage).
 *
 * The local gate is convenient but weak — this password ships in the client
 * bundle. For production: enable Email/Password in Firebase Authentication and
 * change this password in the Firebase console.
 */
export const ADMIN_EMAIL = 'funcityresort@gmail.com';
export const ADMIN_PASSWORD = '123456';

/** sessionStorage key used by the local admin fallback. */
export const LOCAL_ADMIN_KEY = 'fc_admin';
