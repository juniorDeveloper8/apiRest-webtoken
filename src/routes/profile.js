
import express from 'express';
import verifyToken from '../middlewares/verifyToken.js';
import profileController from '../controllers/profileController.js';

const router = express.Router();

// @route GET api/profile
// @desc Get user profile
// @access Private
router.get('/', verifyToken, profileController.getProfile);

export default router;
