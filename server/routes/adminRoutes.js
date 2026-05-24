import express from 'express';
import { getUsers, updateEscalationStatus } from '../controllers/adminController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { adminMiddleware } from '../middleware/adminMiddleware.js';

const router = express.Router();

router.get('/users', authMiddleware, adminMiddleware, getUsers);
router.put('/escalations/:id/status', authMiddleware, adminMiddleware, updateEscalationStatus);

export default router;