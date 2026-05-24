import express from 'express';
import { createFaq, deleteFaq, getFaqs, updateFaq } from '../controllers/faqController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { adminMiddleware } from '../middleware/adminMiddleware.js';

const router = express.Router();

router.get('/', getFaqs);
router.post('/', authMiddleware, adminMiddleware, createFaq);
router.put('/:id', authMiddleware, adminMiddleware, updateFaq);
router.delete('/:id', authMiddleware, adminMiddleware, deleteFaq);

export default router;