import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getAnalytics, isSupported as analyticsIsSupported } from 'firebase/analytics';

// Fun City Resort — web app Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyAiyGpl4rv-h2wBWXAM6rUpmBNgj704oOE',
  authDomain: 'funcityresort-a712a.firebaseapp.com',
  projectId: 'funcityresort-a712a',
  storageBucket: 'funcityresort-a712a.firebasestorage.app',
  messagingSenderId: '352726123068',
  appId: '1:352726123068:web:0352f4ad77bdb05d453939',
  measurementId: 'G-39NXVGLHS7',
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

// Analytics only works in supported browser contexts (https / localhost, no SSR)
analyticsIsSupported()
  .then((ok) => {
    if (ok) getAnalytics(app);
  })
  .catch(() => {
    /* analytics unavailable — ignore */
  });
