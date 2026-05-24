import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import Escalation from '../models/Escalation.js';
import Notification from '../models/Notification.js';

export const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select('-passwordHash -resetOtpHash -resetOtpExpires').sort({ createdAt: -1 });
  res.json({ users });
});

export const updateEscalationStatus = asyncHandler(async (req, res) => {
  const escalation = await Escalation.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
  res.json({ escalation });
});

export const broadcastAnnouncement = asyncHandler(async (req, res) => {
  const { message, link = '/home' } = req.body;

  if (!message || !String(message).trim()) {
    return res.status(400).json({ message: 'Announcement message is required' });
  }

  const users = await User.find({}, { _id: 1 });
  if (!users.length) {
    return res.status(200).json({ message: 'No users found for announcement', notifiedUsers: 0 });
  }

  const notifications = users.map((user) => ({
    userId: user._id,
    type: 'announcement',
    message: String(message).trim(),
    link
  }));

  await Notification.insertMany(notifications);

  res.status(201).json({
    message: 'Announcement broadcasted successfully',
    notifiedUsers: notifications.length
  });
});