import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { getNotifications, markAllNotificationsRead, markNotificationRead } from '../controllers/notificationController.js';

const router = express.Router();

router.get('/', authMiddleware, getNotifications);
router.put('/read-all', authMiddleware, markAllNotificationsRead);
router.put('/:id/read', authMiddleware, markNotificationRead);

export default router;