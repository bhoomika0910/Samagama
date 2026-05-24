import mongoose from 'mongoose';

const chatbotFeedbackSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    question: { type: String, required: true },
    response: { type: String, required: true },
    helpful: { type: Boolean, required: true },
    createdAt: { type: Date, default: Date.now }
  },
  { timestamps: false }
);

export default mongoose.model('ChatbotFeedback', chatbotFeedbackSchema);