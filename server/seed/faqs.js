import dotenv from 'dotenv';
import * as cheerio from 'cheerio';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import FAQ from '../models/FAQ.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const FAQ_URL = 'https://samagama.in/internship/faq';

const stopwords = new Set([
  'the', 'is', 'a', 'an', 'and', 'or', 'to', 'of', 'in', 'for', 'on', 'with', 'that', 'this',
  'it', 'are', 'be', 'as', 'at', 'from', 'by', 'can', 'do', 'i', 'my', 'you', 'your'
]);

const categoryMap = [
  { test: /about|general|overview/i, value: 'general' },
  { test: /timing|dates|start|deadline/i, value: 'timing' },
  { test: /noc/i, value: 'noc' },
  { test: /selection|offer|interview|vins|result/i, value: 'selection' },
  { test: /work|mentorship|project|conduct/i, value: 'work' },
  { test: /certificate/i, value: 'certificate' },
  { test: /rosetta|journal/i, value: 'rosetta' },
  { test: /vibe|phase|yaksha chat/i, value: 'vibe' },
  { test: /team/i, value: 'team' }
];

const normalizeWhitespace = (value = '') => value.replace(/\s+/g, ' ').trim();

const toCategory = (sectionTitle = '') => {
  const match = categoryMap.find((entry) => entry.test.test(sectionTitle));
  return match ? match.value : 'general';
};

const extractTags = (question, answer, sectionTitle) => {
  const text = `${sectionTitle} ${question} ${answer}`.toLowerCase();
  const tokens = text
    .split(/[^a-z0-9]+/)
    .filter((token) => token.length > 2 && !stopwords.has(token));

  const unique = [...new Set(tokens)];
  return unique.slice(0, 10);
};

const parseFaqFromPage = async () => {
  const response = await fetch(FAQ_URL);
  if (!response.ok) {
    throw new Error(`Failed to fetch FAQ page: ${response.status}`);
  }

  const html = await response.text();
  const $ = cheerio.load(html);
  const parsedFaqs = [];

  $('h2[id^="s-"]').each((_, sectionHeading) => {
    const headingText = normalizeWhitespace($(sectionHeading).text());
    const sectionMatch = headingText.match(/^(\d+)\.?\s*(.*)$/);
    if (!sectionMatch) return;

    const sectionNumber = Number(sectionMatch[1]);
    const sectionTitle = sectionMatch[2] || headingText;
    const category = toCategory(sectionTitle);

    let current = $(sectionHeading).next();
    while (current.length && current[0].tagName !== 'h2') {
      const id = current.attr('id') || '';
      if (id.startsWith('q-')) {
        const question = normalizeWhitespace(current.text());
        let answerNode = current.next();
        let answer = '';

        while (answerNode.length && answerNode[0].tagName !== 'h3' && answerNode[0].tagName !== 'h2') {
          const text = normalizeWhitespace(answerNode.text());
          if (text) {
            answer = `${answer} ${text}`.trim();
          }
          answerNode = answerNode.next();
        }

        const subsection = id.replace('q-', '').replace(/-/g, '.');
        parsedFaqs.push({
          section: sectionNumber,
          sectionTitle,
          subsection,
          question,
          answer: answer || 'Please refer to the official FAQ section for complete details.',
          tags: extractTags(question, answer, sectionTitle),
          category
        });
      }

      current = current.next();
    }
  });

  return parsedFaqs;
};

const readFaqsFromJson = () => {
  const inputPath = path.join(__dirname, 'faqs.generated.json');
  if (!fs.existsSync(inputPath)) {
    throw new Error(`Missing generated FAQ file at ${inputPath}. Run dry seed first.`);
  }

  const content = fs.readFileSync(inputPath, 'utf-8');
  const parsed = JSON.parse(content);
  if (!Array.isArray(parsed)) {
    throw new Error('Generated FAQ JSON must be an array.');
  }

  return parsed;
};

const seedFaqs = async () => {
  const seedFromJson = process.argv.includes('--from-json');
  const faqs = seedFromJson ? readFaqsFromJson() : await parseFaqFromPage();

  const dryRun = process.argv.includes('--dry-run') || String(process.env.SEED_DRY_RUN).toLowerCase() === 'true';
  if (dryRun) {
    const outputPath = path.join(__dirname, 'faqs.generated.json');
    fs.writeFileSync(outputPath, JSON.stringify(faqs, null, 2));
    console.log(`Dry run complete. Parsed ${faqs.length} FAQs to ${outputPath}`);
    process.exit(0);
  }

  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    throw new Error('MONGO_URI is required for live FAQ seeding. Use --dry-run to generate JSON without DB.');
  }

  await mongoose.connect(mongoUri);
  await FAQ.deleteMany();

  if (faqs.length) {
    await FAQ.insertMany(faqs);
  }

  console.log(`Seeded ${faqs.length} FAQ records.`);
  await mongoose.disconnect();
  process.exit(0);
};

seedFaqs().catch((error) => {
  console.error('FAQ seed failed', error);
  process.exit(1);
});