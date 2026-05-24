import asyncHandler from 'express-async-handler';
import Notification from '../models/Notification.js';

export const getNotifications = asyncHandler(async (req, res) => {
  const { unread } = req.query;
  const query = { userId: req.user._id };
  if (String(unread).toLowerCase() === 'true') {
    query.read = false;
  }

  const notifications = await Notification.find(query).sort({ createdAt: -1 }).limit(20);
  const unreadCount = await Notification.countDocuments({ userId: req.user._id, read: false });

  res.json({ notifications, unreadCount });
});

export const markNotificationRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findOneAndUpdate(
    { _id: req.params.id, userId: req.user._id },
    { read: true },
    { new: true }
  );

  if (!notification) {
    return res.status(404).json({ message: 'Notification not found' });
  }

  res.json({ notification });
});

export const markAllNotificationsRead = asyncHandler(async (req, res) => {
  await Notification.updateMany({ userId: req.user._id, read: false }, { read: true });
  res.json({ message: 'Notifications marked as read' });
});