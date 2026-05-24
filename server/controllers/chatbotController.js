import asyncHandler from 'express-async-handler';
import FAQ from '../models/FAQ.js';

const stopwords = new Set(['is', 'the', 'a', 'an', 'for', 'how', 'what', 'where', 'when', 'why', 'to', 'of', 'in', 'on', 'and', 'i', 'we', 'you']);

const tokenize = (message) =>
  message
    .toLowerCase()
    .split(/\s+/)
    .map((word) => word.replace(/[^a-z0-9]/g, ''))
    .filter((word) => word && !stopwords.has(word));

export const queryChatbot = asyncHandler(async (req, res) => {
  const { message = '' } = req.body;
  const keywords = tokenize(message);

  if (!keywords.length) {
    return res.json({ found: false, faqs: [] });
  }

  const regexes = keywords.map((keyword) => new RegExp(keyword, 'i'));
  const faqs = await FAQ.find({
    $or: [
      { question: { $in: regexes } },
      { answer: { $in: regexes } },
      { tags: { $in: regexes } }
    ]
  });

  const scored = faqs
    .map((faq) => {
      const haystack = `${faq.question} ${faq.answer} ${faq.tags.join(' ')}`.toLowerCase();
      const score = keywords.reduce((total, keyword) => total + (haystack.includes(keyword) ? 1 : 0), 0);
      return { ...faq.toObject(), score };
    })
    .filter((faq) => faq.score > 0)
    .sort((left, right) => right.score - left.score)
    .slice(0, 3);

  if (!scored.length) {
    return res.json({ found: false, faqs: [] });
  }

  res.json({ found: true, faqs: scored });
});