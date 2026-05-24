import dotenv from 'dotenv';
import FAQ from '../models/FAQ.js';
import { connectDB } from '../config/db.js';

dotenv.config();

const faqs = [
  // Add FAQ objects here before running: node seed/faqs.js
  // Example:
  // {
  //   question: 'How do I reset my password?',
  //   answer: 'Use the reset-password link on the login page.',
  //   category: 'Tech/ERP',
  //   tags: ['password', 'login', 'reset']
  // }
];

const seedFaqs = async () => {
  await connectDB();
  await FAQ.deleteMany();

  if (faqs.length) {
    await FAQ.insertMany(faqs);
  }

  console.log(`Seeded ${faqs.length} FAQ records.`);
  process.exit(0);
};

seedFaqs().catch((error) => {
  console.error('FAQ seed failed', error);
  process.exit(1);
});