import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../db/db.js';
import verifyToken from '../middlewares/verifyToken.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

// Register a new user
router.post('/register', async (req, res, next) => {
  try {
    const {username, email, password } = req.body;

    // Check if the email is already registered
    const [rows, fields] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length > 0) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    // Hash the password and insert the new user into the database
    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.execute('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [username, email, hashedPassword]);

    res.json({ message: 'User registered successfully' });
  } catch (err) {
    console.error(err);
    next(err);
  }
});

// Login with email and password
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check if the email is registered
    const [rows, fields] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check if the password is correct
    const match = await bcrypt.compare(password, rows[0].password);
    if (!match) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate a JWT and return it to the client
    const token = jwt.sign({ id: rows[0].id, email: rows[0].email }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    console.error(err);
    next(err);
  }
});

// Get the user profile
router.get('/profile', verifyToken, async (req, res, next) => {
  try {
    const [rows, fields] = await pool.execute('SELECT email FROM users WHERE id = ?', [req.user.id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ email: rows[0].email });
  } catch (err) {
    console.error(err);
    next(err);
  }
});

export default router;
