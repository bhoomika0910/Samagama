import express from 'express';
import { forgotPassword, getMe, login, logout, register, resetPassword, setPassword, updateMe, validateResetToken } from '../controllers/authController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.post('/forgot-password', forgotPassword);
router.get('/validate-reset-token/:token', validateResetToken);
router.post('/reset-password', resetPassword);
router.patch('/set-password', authMiddleware, setPassword);
router.post('/change-password', authMiddleware, setPassword);
router.put('/me', authMiddleware, updateMe);
router.get('/me', authMiddleware, getMe);

export default router;