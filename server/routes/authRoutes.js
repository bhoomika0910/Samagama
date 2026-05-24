import express from 'express';
import { changePassword, forgotPassword, getMe, login, logout, register, resetPassword, updateMe } from '../controllers/authController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/change-password', authMiddleware, changePassword);
router.put('/me', authMiddleware, updateMe);
router.get('/me', authMiddleware, getMe);

export default router;