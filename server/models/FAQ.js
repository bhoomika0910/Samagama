import mongoose from 'mongoose';

const faqSchema = new mongoose.Schema(
  {
    question: { type: String, required: true, trim: true },
    answer: { type: String, required: true, trim: true },
    category: { type: String, required: true, enum: ['Academics', 'Hostel', 'Fees', 'Placements', 'Tech/ERP', 'Events'] },
    tags: [{ type: String, trim: true }],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true }
);

faqSchema.index({ question: 'text', answer: 'text', tags: 'text' });

export default mongoose.model('FAQ', faqSchema);