import asyncHandler from 'express-async-handler';
import FAQ from '../models/FAQ.js';
import ChatbotFeedback from '../models/ChatbotFeedback.js';

const stopwords = new Set([
  'i', 'is', 'the', 'a', 'an', 'how', 'what', 'when', 'where', 'can', 'do',
  'my', 'for', 'to', 'of', 'in', 'on', 'at', 'will', 'get', 'need', 'want',
  'does', 'did', 'has', 'have', 'are', 'was', 'were', 'be', 'been', 'not',
  'it', 'this', 'that', 'me', 'we', 'they', 'he', 'she', 'you', 'and', 'or',
  'but', 'if', 'so', 'as', 'by', 'from', 'with', 'about', 'please', 'tell',
  'know', 'give', 'show', 'help', 'any', 'which', 'who', 'should', 'would',
  'could', 'its', 'their', 'our', 'your', 'his', 'her', 'then', 'than', 'also'
]);

const aliasMap = {
  money: ['stipend', 'paid', 'fee', 'charge', 'payment'],
  paid: ['stipend', 'salary', 'fellowship'],
  free: ['charge', 'cost', 'fee', 'stipend'],
  start: ['begin', 'join', 'commence', 'opt', 'dates'],
  quit: ['drop', 'leave', 'withdraw', 'terminate'],
  letter: ['offer', 'certificate', 'noc', 'document'],
  sign: ['signature', 'signed', 'authority', 'hod'],
  college: ['institution', 'university', 'hod', 'dean', 'principal'],
  boss: ['hod', 'dean', 'mentor', 'authority'],
  whatsapp: ['group', 'communication', 'channel', 'discord'],
  laptop: ['device', 'computer', 'system', 'software'],
  work: ['project', 'task', 'contribute', 'assignment'],
  hours: ['time', 'duration', 'daily', 'schedule'],
  pass: ['complete', 'finish', 'certificate', 'clear'],
  fail: ['incomplete', 'drop', 'terminate', 'certificate'],
  zoom: ['meeting', 'session', 'link', 'standup', 'kickoff'],
  camera: ['proctor', 'vibe', 'consent', 'face', 'access'],
  video: ['vibe', 'lesson', 'clip', 'watch', 'stuck'],
  journal: ['rosetta', 'diary', 'writing', 'entry', 'daily'],
  team: ['group', 'members', 'formation', 'phase2', 'project'],
  date: ['start', 'end', 'deadline', 'confirm', 'december'],
  noc: ['certificate', 'sign', 'college', 'authority', 'upload'],
  selected: ['vins', 'yellow', 'panel', 'result', 'dashboard'],
  interview: ['yaksha', 'chat', 'complete', 'dashboard'],
  badge: ['bronze', 'silver', 'gold', 'platinum', 'phase'],
  exemption: ['viva', 'mern', 'returning', 'previous'],
  offline: ['vise', 'online', 'vins', 'campus', 'switch']
};

const sectionBonusTerms = new Set([
  'noc', 'vins', 'vibe', 'rosetta', 'bronze', 'silver', 'certificate', 'stipend', 'mentor',
  'team', 'leave', 'dates', 'offer', 'letter', 'zoom', 'phase', 'yaksha', 'escalate'
]);

const clean = (text = '') => text.toLowerCase().replace(/[^a-z0-9.\s]/g, ' ').replace(/\s+/g, ' ').trim();

const tokenize = (message = '') =>
  clean(message)
    .split(/\s+/)
    .filter((word) => word && !stopwords.has(word) && word.length > 2);

const normalizeResult = (faq, score, note = null) => ({
  subsection: faq.subsection,
  sectionTitle: faq.sectionTitle,
  question: faq.question,
  answer: faq.answer,
  score,
  referenceNote: note || `📌 Refer to section ${faq.subsection} in the FAQ for full details.`
});

const extractSubsectionRef = (message) => {
  const cleaned = clean(message);
  const subsectionMatch = cleaned.match(/(?:point|section|sec)?\s*(\d+\.\d+)/i);
  if (subsectionMatch) return { subsection: subsectionMatch[1] };

  const sectionMatch = cleaned.match(/(?:section|sec)\s*(\d+)/i);
  if (sectionMatch) return { section: Number(sectionMatch[1]) };

  return null;
};

const expandKeywords = (keywords) => {
  const expanded = new Set(keywords);

  for (const keyword of keywords) {
    if (aliasMap[keyword]) {
      aliasMap[keyword].forEach((alias) => expanded.add(alias));
    }

    Object.entries(aliasMap).forEach(([root, aliases]) => {
      if (aliases.includes(keyword)) {
        expanded.add(root);
        aliases.forEach((alias) => expanded.add(alias));
      }
    });
  }

  return [...expanded];
};

export const queryChatbot = asyncHandler(async (req, res) => {
  const { message = '' } = req.body;
  const cleanedMessage = clean(message);

  if (!cleanedMessage) {
    return res.json({ found: false, results: [], totalMatches: 0, suggestion: null });
  }

  // LAYER 1: Exact phrase match in question.
  const exactQuestionMatch = await FAQ.findOne({ question: { $regex: cleanedMessage.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), $options: 'i' } });
  if (exactQuestionMatch) {
    return res.json({
      found: true,
      results: [normalizeResult(exactQuestionMatch, 100)],
      totalMatches: 1,
      suggestion: null
    });
  }

  // LAYER 2: Subsection/section reference matching.
  const reference = extractSubsectionRef(cleanedMessage);
  if (reference?.subsection) {
    const subsectionFaq = await FAQ.findOne({ subsection: reference.subsection });
    if (subsectionFaq) {
      return res.json({
        found: true,
        results: [normalizeResult(subsectionFaq, 100)],
        totalMatches: 1,
        suggestion: null
      });
    }
  }

  if (reference?.section) {
    const sectionFaq = await FAQ.findOne({ section: reference.section }).sort({ subsection: 1 });
    if (sectionFaq) {
      return res.json({
        found: true,
        results: [normalizeResult(sectionFaq, 100)],
        totalMatches: 1,
        suggestion: null
      });
    }
  }

  // LAYER 3 + 4: Weighted keyword scoring with alias expansion.
  const baseKeywords = tokenize(cleanedMessage);
  const keywords = expandKeywords(baseKeywords);

  if (!keywords.length) {
    return res.json({ found: false, results: [], totalMatches: 0, suggestion: null });
  }

  const faqs = await FAQ.find();
  const scored = faqs
    .map((faq) => {
      const question = clean(faq.question);
      const answer = clean(faq.answer);
      const tags = faq.tags.map((tag) => clean(tag)).join(' ');
      let score = 0;

      keywords.forEach((keyword) => {
        if (question.includes(keyword)) score += 3;
        if (tags.includes(keyword)) score += 2;
        if (answer.includes(keyword)) score += 1;
        if (sectionBonusTerms.has(keyword)) score += 5;
      });

      return { faq, score };
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  if (scored.length) {
    const suggestion = scored[0].score <= 4 ? `Did you mean: ${scored[0].faq.question}` : null;
    return res.json({
      found: true,
      results: scored.map((entry) => normalizeResult(entry.faq, entry.score)),
      totalMatches: scored.length,
      suggestion
    });
  }

  // LAYER 5: Fuzzy fallback on 4+ substrings.
  const fuzzyTokens = clean(message).split(/\s+/).filter((word) => word.length >= 4);
  if (fuzzyTokens.length) {
    const regex = new RegExp(fuzzyTokens.join('|'), 'i');
    const fuzzyFaq = await FAQ.findOne({
      $or: [{ question: regex }, { answer: regex }, { tags: regex }, { sectionTitle: regex }]
    });

    if (fuzzyFaq) {
      return res.json({
        found: true,
        results: [normalizeResult(fuzzyFaq, 1, 'This might be related to your question')],
        totalMatches: 1,
        suggestion: null
      });
    }
  }

  return res.json({ found: false, results: [], totalMatches: 0, suggestion: null });
});

export const saveChatbotFeedback = asyncHandler(async (req, res) => {
  const { question, response, helpful } = req.body;

  if (!question || !response || typeof helpful !== 'boolean') {
    return res.status(400).json({ message: 'Missing chatbot feedback fields' });
  }

  const feedback = await ChatbotFeedback.create({
    userId: req.user?._id,
    question,
    response,
    helpful
  });

  res.status(201).json({ feedback });
});