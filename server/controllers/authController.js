import asyncHandler from 'express-async-handler';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { cookieOptions, createToken } from '../utils/tokenUtils.js';
import { sendOtpEmail } from '../utils/emailUtils.js';

const publicUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  rollNumber: user.rollNumber,
  branch: user.branch,
  year: user.year,
  role: user.role
});

export const register = asyncHandler(async (req, res) => {
  const { name, email, rollNumber, branch, year, password, role } = req.body;

  const existing = await User.findOne({ $or: [{ email }, { rollNumber }] });
  if (existing) {
    return res.status(400).json({ message: 'Email or roll number already exists' });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({
    name,
    email,
    rollNumber,
    branch,
    year,
    passwordHash,
    role: role === 'admin' ? 'admin' : 'student'
  });

  res.cookie('token', createToken(user._id), cookieOptions());
  res.status(201).json({ user: publicUser(user) });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  res.cookie('token', createToken(user._id), cookieOptions());
  res.json({ user: publicUser(user) });
});

export const logout = asyncHandler(async (req, res) => {
  res.clearCookie('token', cookieOptions());
  res.json({ message: 'Logged out' });
});

export const getMe = asyncHandler(async (req, res) => {
  res.json({ user: publicUser(req.user) });
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  const otp = String(Math.floor(100000 + Math.random() * 900000));
  user.resetOtpHash = await bcrypt.hash(otp, 10);
  user.resetOtpExpires = new Date(Date.now() + 10 * 60 * 1000);
  await user.save();

  await sendOtpEmail(user.email, otp);
  res.json({ message: 'OTP sent to your email' });
});

export const resetPassword = asyncHandler(async (req, res) => {
  const { email, otp, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || !user.resetOtpHash || !user.resetOtpExpires) {
    return res.status(400).json({ message: 'Invalid reset request' });
  }

  if (user.resetOtpExpires < new Date()) {
    return res.status(400).json({ message: 'OTP has expired' });
  }

  const validOtp = await bcrypt.compare(otp, user.resetOtpHash);
  if (!validOtp) {
    return res.status(400).json({ message: 'Invalid OTP' });
  }

  user.passwordHash = await bcrypt.hash(password, 10);
  user.resetOtpHash = undefined;
  user.resetOtpExpires = undefined;
  await user.save();

  res.json({ message: 'Password reset successful' });
});