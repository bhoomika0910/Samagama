import express from 'express';
import {
  addComment,
  createEscalation,
  getEscalationById,
  getEscalations,
  resolveEscalation,
  toggleVote
} from '../controllers/escalationController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getEscalations);
router.post('/', authMiddleware, createEscalation);
router.get('/:id', getEscalationById);
router.put('/:id/vote', authMiddleware, toggleVote);
router.put('/:id/resolve', authMiddleware, resolveEscalation);
router.post('/:id/comment', authMiddleware, addComment);

export default router;