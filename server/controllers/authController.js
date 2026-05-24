import asyncHandler from 'express-async-handler';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
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
  isFirstLogin: Boolean(user.isFirstLogin ?? user.mustChangePassword)
});

const generateTempPassword = () => crypto.randomBytes(8).toString('base64').slice(0, 10);

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const register = asyncHandler(async (req, res) => {
  const { name, email, rollNumber, branch, year, role } = req.body;

  if (!name || !email || !rollNumber || !branch || !year) {
    return res.status(400).json({ message: 'All registration fields are required' });
  }

  if (!emailPattern.test(String(email).trim())) {
    return res.status(400).json({ message: 'Please enter a valid email address' });
  }

  const normalizedEmail = String(email).toLowerCase().trim();
  const existing = await User.findOne({ $or: [{ email: normalizedEmail }, { rollNumber }] });
  if (existing) {
    return res.status(400).json({ message: 'Email or roll number already exists' });
  }

  const tempPassword = generateTempPassword();
  const passwordHash = await bcrypt.hash(tempPassword, 12);
  const user = await User.create({
    name,
    email: normalizedEmail,
    rollNumber,
    branch,
    year,
    passwordHash,
    isFirstLogin: true,
    role: role === 'admin' ? 'admin' : 'student'
  });

  await sendWelcomeEmail({ to: user.email, name: user.name, tempPassword });
  res.status(201).json({ message: 'Check your email for login credentials' });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: String(email).toLowerCase().trim() });

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
  const user = await User.findOne({ email: String(email).toLowerCase().trim() });

  if (user) {
    const resetToken = createRandomToken();
    user.resetPasswordToken = hashToken(resetToken);
    user.resetPasswordExpire = new Date(Date.now() + 60 * 60 * 1000);
    await user.save();

    const resetLink = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
    await sendResetLinkEmail({ to: user.email, name: user.name, link: resetLink });
  }

  res.json({ message: "If that email is registered, you'll receive a link shortly." });
});

export const validateResetToken = asyncHandler(async (req, res) => {
  const tokenHash = hashToken(req.params.token);
  const user = await User.findOne({
    resetPasswordToken: tokenHash,
    resetPasswordExpire: { $gt: new Date() }
  });

  if (!user) {
    return res.status(400).json({ valid: false, message: 'This link has expired or is invalid.' });
  }

  res.json({ valid: true });
});

export const resetPassword = asyncHandler(async (req, res) => {
  const { token, password } = req.body;
  const tokenHash = hashToken(token);
  const user = await User.findOne({
    resetPasswordToken: tokenHash,
    resetPasswordExpire: { $gt: new Date() }
  });

  if (!user) {
    return res.status(400).json({ message: 'This link has expired or is invalid. Request a new one.' });
  }

  user.passwordHash = await bcrypt.hash(password, 12);
  user.isFirstLogin = false;
  user.mustChangePassword = false;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  user.resetTokenHash = undefined;
  user.resetTokenExpires = undefined;
  await user.save();

  res.json({ message: 'Password updated' });
});

export const setPassword = asyncHandler(async (req, res) => {
  const { password } = req.body;

  if (!password || password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters long' });
  }

  const user = await User.findById(req.user._id);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  user.passwordHash = await bcrypt.hash(password, 12);
  user.isFirstLogin = false;
  user.mustChangePassword = false;
  await user.save();

  res.json({ user: publicUser(user), message: 'Password updated' });
});

export const updateMe = asyncHandler(async (req, res) => {
  const { name, branch, year } = req.body;
  const user = await User.findByIdAndUpdate(req.user._id, { name, branch, year }, { new: true });
  res.json({ user: publicUser(user) });
});