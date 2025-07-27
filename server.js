import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import admin from 'firebase-admin';
import { createRequire } from 'module';
import fs from 'fs';

import authRoutes from './routes/authRoutes.js';
import taskRoutes from './routes/taskRoutes.js';

dotenv.config();
const require = createRequire(import.meta.url);

// ✅ Load Firebase service account JSON from secret-mounted path
const serviceAccountPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
if (!serviceAccountPath || !fs.existsSync(serviceAccountPath)) {
  console.error(`❌ Firebase key not found at ${serviceAccountPath}`);
  process.exit(1);
}

const serviceAccount = require(serviceAccountPath);

// ✅ Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

export const db = admin.firestore(); // Firestore DB export for use in routes

// ✅ Express app setup
const app = express();
app.use(cors());
app.use(express.json());

// ✅ Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// ✅ Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🔥 Server running on port ${PORT}`);
});
