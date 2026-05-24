import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import Escalation from '../models/Escalation.js';

export const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select('-passwordHash -resetOtpHash -resetOtpExpires').sort({ createdAt: -1 });
  res.json({ users });
});

export const updateEscalationStatus = asyncHandler(async (req, res) => {
  const escalation = await Escalation.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
  res.json({ escalation });
});