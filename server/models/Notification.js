import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['issue_resolved', 'comment_added', 'issue_upvoted', 'announcement'], required: true },
    message: { type: String, required: true },
    link: { type: String, default: '/' },
    read: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export default mongoose.model('Notification', notificationSchema);