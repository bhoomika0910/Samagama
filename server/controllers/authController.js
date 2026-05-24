import asyncHandler from 'express-async-handler';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { cookieOptions, createRandomToken, createToken, hashToken } from '../utils/tokenUtils.js';
import { sendResetLinkEmail, sendWelcomeEmail } from '../utils/emailUtils.js';

const publicUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  rollNumber: user.rollNumber,
  branch: user.branch,
  year: user.year,
  role: user.role,
  mustChangePassword: user.mustChangePassword
});

const generateTempPassword = () => `${Math.random().toString(36).slice(-8)}Aa1!`;

export const register = asyncHandler(async (req, res) => {
  const { name, email, rollNumber, branch, year, role } = req.body;

  const existing = await User.findOne({ $or: [{ email }, { rollNumber }] });
  if (existing) {
    return res.status(400).json({ message: 'Email or roll number already exists' });
  }

  const tempPassword = generateTempPassword();
  const passwordHash = await bcrypt.hash(tempPassword, 10);
  const user = await User.create({
    name,
    email,
    rollNumber,
    branch,
    year,
    passwordHash,
    mustChangePassword: true,
    role: role === 'admin' ? 'admin' : 'student'
  });

  await sendWelcomeEmail({ to: user.email, name: user.name, tempPassword });
  res.status(201).json({ message: 'Registration complete. Check your email for a temporary password.', user: publicUser(user) });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  res.cookie('token', createToken(user._id), cookieOptions());
  res.json({ user: publicUser(user), needsPasswordChange: Boolean(user.mustChangePassword) });
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

  const resetToken = createRandomToken();
  user.resetTokenHash = hashToken(resetToken);
  user.resetTokenExpires = new Date(Date.now() + 30 * 60 * 1000);
  await user.save();

  const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}&email=${encodeURIComponent(user.email)}`;
  await sendResetLinkEmail({ to: user.email, name: user.name, link: resetLink });
  res.json({ message: 'Password reset link sent to your email' });
});

export const resetPassword = asyncHandler(async (req, res) => {
  const { email, token, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || !user.resetTokenHash || !user.resetTokenExpires) {
    return res.status(400).json({ message: 'Invalid reset request' });
  }

  if (user.resetTokenExpires < new Date()) {
    return res.status(400).json({ message: 'Reset link has expired' });
  }

  if (hashToken(token) !== user.resetTokenHash) {
    return res.status(400).json({ message: 'Invalid reset token' });
  }

  user.passwordHash = await bcrypt.hash(password, 10);
  user.mustChangePassword = false;
  user.resetTokenHash = undefined;
  user.resetTokenExpires = undefined;
  await user.save();

  res.json({ message: 'Password reset successful' });
});

export const changePassword = asyncHandler(async (req, res) => {
  const { password } = req.body;

  if (!password || password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters long' });
  }

  const user = await User.findById(req.user._id);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  user.passwordHash = await bcrypt.hash(password, 10);
  user.mustChangePassword = false;
  await user.save();

  res.json({ user: publicUser(user), message: 'Password updated' });
});

export const updateMe = asyncHandler(async (req, res) => {
  const { name, branch, year } = req.body;
  const user = await User.findByIdAndUpdate(req.user._id, { name, branch, year }, { new: true });
  res.json({ user: publicUser(user) });
});