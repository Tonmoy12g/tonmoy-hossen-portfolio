import test from 'node:test';
import assert from 'node:assert/strict';
import {
  filterProjects,
  validateContactForm,
  calculateAverageSkill,
  DEFAULT_FORM_ENDPOINT,
  isPlaceholderFormEndpoint,
  buildMailtoUrl,
} from './portfolioLogic';
import { Project } from '../types/portfolio';

const mockProjects: Project[] = [
  {
    id: 'tg-bot',
    title: 'Tonmoy Developer Telegram Bots',
    category: 'telegram-bots',
    categoryLabel: 'Telegram Bots',
    tagline: 'Automated bot ecosystem',
    description: 'High performance Telegram bots with Node.js and Telegraf.',
    features: ['Auto response', 'Webhooks'],
    techStack: ['Node.js', 'Telegraf', 'MongoDB'],
    featured: true,
    accentColor: '#00D4FF',
    status: 'Active Bot',
  },
  {
    id: 'glowmart',
    title: 'GlowMart E-Commerce',
    category: 'ecommerce',
    categoryLabel: 'E-Commerce',
    tagline: 'Modern shopping site',
    description: 'Fast responsive e-commerce web platform.',
    features: ['Cart', 'Search'],
    techStack: ['React', 'TypeScript', 'Tailwind CSS'],
    featured: true,
    accentColor: '#38BDF8',
    status: 'Featured',
  },
  {
    id: 'topup',
    title: 'TONMOY Topup site',
    category: 'web-app',
    categoryLabel: 'Top-Up Portal',
    tagline: 'Game top-up portal',
    description: 'Gaming vouchers and instant currency recharge.',
    features: ['UID check', 'Receipts'],
    techStack: ['React', 'Node.js', 'REST API'],
    featured: true,
    accentColor: '#00E5FF',
    status: 'Live',
  },
];

test('filterProjects returns all projects when category is all and no query', () => {
  const result = filterProjects(mockProjects, 'all', '');
  assert.equal(result.length, 3);
});

test('filterProjects correctly filters by category', () => {
  const tgResults = filterProjects(mockProjects, 'telegram-bots');
  assert.equal(tgResults.length, 1);
  assert.equal(tgResults[0].id, 'tg-bot');

  const ecommerceResults = filterProjects(mockProjects, 'ecommerce');
  assert.equal(ecommerceResults.length, 1);
  assert.equal(ecommerceResults[0].id, 'glowmart');
});

test('filterProjects searches across title, tech stack, and description', () => {
  const queryResult = filterProjects(mockProjects, 'all', 'Telegraf');
  assert.equal(queryResult.length, 1);
  assert.equal(queryResult[0].id, 'tg-bot');

  const searchTopup = filterProjects(mockProjects, 'all', 'gaming');
  assert.equal(searchTopup.length, 1);
  assert.equal(searchTopup[0].id, 'topup');
});

test('validateContactForm rejects empty inputs', () => {
  const result = validateContactForm({});
  assert.equal(result.isValid, false);
  assert.ok(result.errors.name);
  assert.ok(result.errors.email);
  assert.ok(result.errors.message);
});

test('validateContactForm validates email format and message length', () => {
  const invalidEmailResult = validateContactForm({
    name: 'Md Tonmoy',
    email: 'not-an-email',
    subject: 'Project Inquiry',
    message: 'Too short',
  });
  assert.equal(invalidEmailResult.isValid, false);
  assert.ok(invalidEmailResult.errors.email);
  assert.ok(invalidEmailResult.errors.message);

  const validResult = validateContactForm({
    name: 'Rahim Ahmed',
    email: 'rahim@example.com',
    subject: 'Need custom Telegram bot',
    message: 'Hello Tonmoy, I need an automated shop delivery bot for my channel.',
  });
  assert.equal(validResult.isValid, true);
  assert.equal(Object.keys(validResult.errors).length, 0);
});

test('calculateAverageSkill accurately averages proficiency scores', () => {
  const skills = [{ level: 80 }, { level: 90 }, { level: 100 }];
  assert.equal(calculateAverageSkill(skills), 90);
  assert.equal(calculateAverageSkill([]), 0);
});

test('isPlaceholderFormEndpoint detects placeholder vs real Formspree URLs', () => {
  assert.equal(isPlaceholderFormEndpoint(DEFAULT_FORM_ENDPOINT), true);
  assert.equal(isPlaceholderFormEndpoint(''), true);
  assert.equal(isPlaceholderFormEndpoint('https://formspree.io/f/mxyz1234'), false);
});

test('buildMailtoUrl encodes visitor name, email, subject, and message', () => {
  const mailto = buildMailtoUrl('mdtonmoyhossen327@gmail.com', {
    name: 'Rahim Ahmed',
    email: 'rahim@example.com',
    telegramOrSocial: '@rahimdev',
    subject: 'Telegram Bot Project',
    message: 'Hello Tonmoy, I want to build a shop bot.',
  });
  assert.ok(mailto.startsWith('mailto:mdtonmoyhossen327@gmail.com?'));
  assert.ok(mailto.includes(encodeURIComponent('Rahim Ahmed')));
  assert.ok(mailto.includes(encodeURIComponent('Telegram Bot Project')));
  assert.ok(mailto.includes(encodeURIComponent('Hello Tonmoy, I want to build a shop bot.')));
});

