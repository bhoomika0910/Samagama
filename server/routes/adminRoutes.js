import express from 'express';
import { broadcastAnnouncement, getUsers, updateEscalationStatus } from '../controllers/adminController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { adminMiddleware } from '../middleware/adminMiddleware.js';

const router = express.Router();

router.get('/users', authMiddleware, adminMiddleware, getUsers);
router.put('/escalations/:id/status', authMiddleware, adminMiddleware, updateEscalationStatus);
router.post('/announcements', authMiddleware, adminMiddleware, broadcastAnnouncement);

export default router;