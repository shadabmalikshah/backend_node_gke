// firebase.js
import admin from 'firebase-admin';
import { readFileSync, existsSync } from 'fs';

// Detect environment (GKE vs local)
const isProd = process.env.NODE_ENV === 'production';
const keyPath = isProd
  ? process.env.GOOGLE_APPLICATION_CREDENTIALS || '/secrets/firebase_key.json'
  : './firebase_key.json';

if (!existsSync(keyPath)) {
  console.error(`❌ Firebase key not found at: ${keyPath}`);
  process.exit(1);
}

// ✅ Prevent duplicate initialization
if (!admin.apps.length) {
  const serviceAccount = JSON.parse(readFileSync(keyPath, 'utf8'));
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export const db = admin.firestore();
