import mongoose from 'mongoose';

const faqSchema = new mongoose.Schema(
  {
    section: { type: Number, required: true },
    sectionTitle: { type: String, required: true, trim: true },
    subsection: { type: String, required: true, trim: true },
    question: { type: String, required: true, trim: true },
    answer: { type: String, required: true, trim: true },
    category: {
      type: String,
      required: true,
      enum: ['general', 'timing', 'noc', 'selection', 'work', 'certificate', 'rosetta', 'vibe', 'team']
    },
    tags: [{ type: String, trim: true }],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true }
);

faqSchema.index({ question: 'text', answer: 'text', tags: 'text', sectionTitle: 'text' });
faqSchema.index({ subsection: 1 }, { unique: true });

export default mongoose.model('FAQ', faqSchema);