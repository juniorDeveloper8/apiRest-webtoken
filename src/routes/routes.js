import express from 'express';
import { check } from 'express-validator';
import authController from '../controllers/authController.js';
import profile from './profile.js';
import user from './user.js';

const router = express.Router();

// @route POST api/auth/register
// @desc Register user
// @access Public
router.post('/register', [
  check('name', 'Name is required').not().isEmpty(),
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
], authController.register);

// @route POST api/auth/login
// @desc Login user
// @access Public
router.post('/login', [
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password is required').exists()
], authController.login);

// Profile route
router.use('/profile', profile);

// User route
router.use('/user', user);

export default router;
