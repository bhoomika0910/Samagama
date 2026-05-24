import express from 'express';
import { queryChatbot, saveChatbotFeedback } from '../controllers/chatbotController.js';

const router = express.Router();

router.post('/query', queryChatbot);
router.post('/feedback', saveChatbotFeedback);

export default router;