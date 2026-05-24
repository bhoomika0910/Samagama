import asyncHandler from 'express-async-handler';
import Escalation from '../models/Escalation.js';

export const getEscalations = asyncHandler(async (req, res) => {
  const { status, category } = req.query;
  const query = {};

  if (status) query.status = status;
  if (category) query.category = category;

  const escalations = await Escalation.find(query)
    .populate('raisedBy', 'name rollNumber branch year role')
    .sort({ votes: -1, createdAt: -1 });

  res.json({ escalations });
});

export const createEscalation = asyncHandler(async (req, res) => {
  const escalation = await Escalation.create({ ...req.body, raisedBy: req.user._id });
  res.status(201).json({ escalation });
});

export const getEscalationById = asyncHandler(async (req, res) => {
  const escalation = await Escalation.findById(req.params.id)
    .populate('raisedBy', 'name rollNumber branch year role')
    .populate('votes', 'name role')
    .populate('resolvedBy', 'name role')
    .populate('comments.user', 'name role');

  if (!escalation) {
    return res.status(404).json({ message: 'Escalation not found' });
  }

  res.json({ escalation });
});

export const toggleVote = asyncHandler(async (req, res) => {
  const escalation = await Escalation.findById(req.params.id);

  if (!escalation) {
    return res.status(404).json({ message: 'Escalation not found' });
  }

  const voteIndex = escalation.votes.findIndex((voteId) => voteId.toString() === req.user._id.toString());
  if (voteIndex >= 0) {
    escalation.votes.splice(voteIndex, 1);
  } else {
    escalation.votes.push(req.user._id);
  }

  await escalation.save();
  res.json({ escalation });
});

export const resolveEscalation = asyncHandler(async (req, res) => {
  const { resolution = '', comment = '' } = req.body;
  const escalation = await Escalation.findById(req.params.id);

  if (!escalation) {
    return res.status(404).json({ message: 'Escalation not found' });
  }

  escalation.status = 'resolved';
  escalation.resolution = resolution;
  escalation.resolvedBy = req.user._id;

  if (comment) {
    escalation.comments.push({ user: req.user._id, text: comment });
  }

  await escalation.save();
  res.json({ escalation });
});

export const addComment = asyncHandler(async (req, res) => {
  const escalation = await Escalation.findById(req.params.id);

  if (!escalation) {
    return res.status(404).json({ message: 'Escalation not found' });
  }

  escalation.comments.push({ user: req.user._id, text: req.body.text });
  await escalation.save();

  res.status(201).json({ escalation });
});