// server.js
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import { db } from './firebase.js'; // use exported Firestore (for future direct use if needed)
import authRoutes from './routes/authRoutes.js';
import taskRoutes from './routes/taskRoutes.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🔥 Server running on port ${PORT}`);
});
