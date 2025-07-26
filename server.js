import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import admin from 'firebase-admin';

import authRoutes from './routes/authRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import serviceAccount from './firebase_key.json'; // make sure this file is added in CI/CD

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

export const db = admin.firestore(); // Export Firestore DB for route files

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🔥 Server running on port ${PORT}`);
});
