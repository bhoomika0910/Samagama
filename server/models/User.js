import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    rollNumber: { type: String, required: true, unique: true, trim: true },
    branch: { type: String, required: true, trim: true },
    year: { type: String, required: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['student', 'admin'], default: 'student' },
    mustChangePassword: { type: Boolean, default: false },
    resetTokenHash: { type: String },
    resetTokenExpires: { type: Date }
  },
  { timestamps: true }
);

export default mongoose.model('User', userSchema);