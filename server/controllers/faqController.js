import asyncHandler from 'express-async-handler';
import FAQ from '../models/FAQ.js';

export const getFaqs = asyncHandler(async (req, res) => {
  const { category, search } = req.query;
  const query = {};

  if (category) query.category = category;
  if (search) {
    query.$or = [
      { question: { $regex: search, $options: 'i' } },
      { answer: { $regex: search, $options: 'i' } },
      { tags: { $regex: search, $options: 'i' } }
    ];
  }

  const faqs = await FAQ.find(query).sort({ createdAt: -1 });
  res.json({ faqs });
});

export const createFaq = asyncHandler(async (req, res) => {
  const faq = await FAQ.create({ ...req.body, createdBy: req.user._id });
  res.status(201).json({ faq });
});

export const updateFaq = asyncHandler(async (req, res) => {
  const faq = await FAQ.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json({ faq });
});

export const deleteFaq = asyncHandler(async (req, res) => {
  await FAQ.findByIdAndDelete(req.params.id);
  res.json({ message: 'FAQ deleted' });
});