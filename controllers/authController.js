import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../firebase.js'; // Firestore initialized here

const usersCollection = db.collection('users');

export const register = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const snapshot = await usersCollection.where('email', '==', email).get();
    if (!snapshot.empty) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUserRef = usersCollection.doc(); // auto ID
    await newUserRef.set({
      email,
      password: hashedPassword,
      createdAt: new Date()
    });

    res.status(201).json({ message: 'User registered successfully' });

  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const snapshot = await usersCollection.where('email', '==', email).get();
    if (snapshot.empty) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const userDoc = snapshot.docs[0];
    const userData = userDoc.data();

    const match = await bcrypt.compare(password, userData.password);
    if (!match) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ userId: userDoc.id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.json({ token });

  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};
