
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import db from '../db/db.js';

const authController = {};

authController.register = async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password } = req.body;

  try {
    // Check if email already exists
    let user = await db.query(`SELECT * FROM users WHERE email='${email}'`);
    if (user[0]) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    // Create new user object
    user = {
      name,
      email,
      password: await bcrypt.hash(password, 10)
    }

    // Insert user into database
    await db.query(`INSERT INTO users SET ?`, user);

    // Create and sign the JWT token
    const payload = {
      user: {
        id: user.id
      }
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '1h'
    });

    res.json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
}

authController.login = async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    // Check if user exists
    let user = await db.query(`SELECT * FROM users WHERE email='${email}'`);
    if (!user[0]) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    // Check if password is correct
    const isMatch = await bcrypt.compare(password, user[0].password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    // Create and sign the JWT token
    const payload = {
      user: {
        id: user[0].id
      }
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '1h'
    });

    res.json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
}

export default authController;
