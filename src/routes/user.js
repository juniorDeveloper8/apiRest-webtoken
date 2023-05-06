import express from 'express';
import verifyToken from '../middlewares/verifyToken.js';
import { check } from 'express-validator';
import userController from '../controllers/userController.js';

const router = express.Router();

// @route PUT api/user
// @desc Update user profile
// @access Private
router.put('/', [
  verifyToken,
  check('name', 'Name is required').not().isEmpty(),
  check('email', 'Please include a valid email').isEmail()
], userController.updateProfile);

export default router;
