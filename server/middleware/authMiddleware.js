import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const authMiddleware = asyncHandler(async (req, res, next) => {
  const token = req.cookies?.token || req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    res.status(401);
    throw new Error('Not authenticated');
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findById(decoded.userId).select('-passwordHash -resetTokenHash -resetTokenExpires -resetPasswordToken -resetPasswordExpire');

  if (!user) {
    res.status(401);
    throw new Error('Not authenticated');
  }

  req.user = user;
  next();
});