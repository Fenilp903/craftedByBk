import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// This file will be populated by the set_up_firebase tool
// For now, we'll use a placeholder or check if it exists
let firebaseConfig = {};

try {
  // @ts-ignore
  firebaseConfig = require('./firebase-applet-config.json');
} catch (e) {
  console.warn("Firebase config not found. Please run set_up_firebase.");
}

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
