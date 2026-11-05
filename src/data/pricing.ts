// salet.uk pricing board: what each job costs, three cards per job.
// Launch pricing: `rises` is the price from 1 December 2026, shown as
// "Rising to £29 on 1 December 2026", never as a struck "was" price. `was` is
// only for real savings against today's prices (bundle, 5 pack). No sales
// yet, so flags say "Our pick" or "Best value", never "most popular".

import type { Tab } from '../components/PricingBoard.astro';
import { APP, SAMPLE_INTEL, SAMPLE_LEGAL } from './reports';

const FREE_FIRST = 'Free preview first. Pay only if you want the rest.';
const ONE_PAYMENT = 'One payment by card. No subscription, no auto renew.';

const report = {
  id: 'intelligence',
  name: 'Never overpay again',
  promise: 'See what every home nearby really sold for, before you make an offer.',
  price: '£19',
  unit: 'per report',
  ticks: ['The price range recent sales support', 'Stamp duty you will really pay', 'Rent, flood, crime, planning, schools'],
  cta: 'Check a property',
  href: `${APP}/intelligence`,
  risk: FREE_FIRST,
  img: '/images/reports/valuation.webp',
};

const agent = {
  id: 'agent',
  name: 'Let a pro fight on price for you',
  promise: 'We find it, check it and negotiate hard. You just move in.',
  price: 'Free call',
  unit: 'fee agreed before we start',
  ticks: ['Search, viewings and checks done for you', 'We negotiate the price on your side', 'Managed through to completion'],
  cta: 'Book a free call',
  href: '/contact',
  risk: 'Retainer deducted from the success fee, which is due only at exchange.',
};

export const SALET_TABS: Tab[] = [
  {
    id: 'one-home',
    label: 'Checking one home',
    cards: [
      report,
      {
        id: 'decision',
        flag: 'Our pick',
        name: 'Walk in knowing your number',
        promise: 'Every likely price, fully costed with stamp duty, works and fees. No nasty surprises.',
        price: '£69',
        unit: 'per property',
        ticks: ['The full Buyer Intelligence Report', 'Five prices, each with stamp duty, works and fees', 'A works budget, line by line'],
        cta: 'Get my Decision Pack',
        href: `${APP}/decision-pack`,
        risk: FREE_FIRST,
        img: '/images/reports/dp-scenarios.webp',
      },
      agent,
    ],
  },
  {
    id: 'compare',
    label: 'Comparing a few',
    cards: [
      { ...report, name: 'Check one home', promise: 'The full report on the one you love.' },
      {
        id: 'compare-homes',
        flag: 'New',
        name: 'Compare 2 or more of your home choices',
        promise: 'Up to five homes side by side. We name the one priced best against what similar homes really sold for.',
        price: '£28',
        unit: 'for up to 5 homes',
        ticks: ['Every home on the same sold evidence', 'Tenure, energy rating, stamp duty, flood and schools', 'What to ask the agent about each one'],
        cta: 'Compare my homes',
        href: `${APP}/compare-homes`,
        risk: ONE_PAYMENT,
        img: '/images/reports/comparables.webp',
      },
      {
        id: 'five',
        flag: 'Best value',
        name: 'Check your whole shortlist',
        promise: 'Five full reports. Line every home up side by side and pick the winner.',
        price: '£79',
        unit: 'for 5 reports',
        was: '£95',
        perUnit: '£15.80 a report',
        ticks: ['The same full report on every home', 'Use them over 12 months', 'Compare like with like'],
        cta: 'Buy 5 reports',
        href: `${APP}/checkout/intelligence_5`,
        risk: ONE_PAYMENT,
        img: '/images/reports/comparables.webp',
      },
      {
        id: 'shortlist',
        name: 'We find the homes for you',
        promise: 'Tell us what you want. We send the homes that fit, every one checked.',
        price: '£149',
        unit: 'per search',
        ticks: ['Homes on the market that match your brief', 'Each priced against its sold evidence', 'Area, flood and schools for each'],
        cta: 'Start my search',
        href: `${APP}/home-search`,
        risk: ONE_PAYMENT,
        img: '/images/reports/home-search-shortlist.webp',
      },
    ],
  },
  {
    id: 'with-help',
    label: 'Buying with help',
    cards: [
      {
        id: 'legal',
        name: 'Spot the trap before you bid',
        promise: 'Every hidden cost and catch in the legal pack, with the page it is on.',
        price: '£29',
        unit: 'per pack',
        ticks: ['Every finding cited to its page', 'What the pack leaves out', 'Questions to send your solicitor'],
        cta: 'Upload a legal pack',
        href: `${APP}/legal-pack`,
        risk: FREE_FIRST,
        img: '/images/reports/legal-findings.webp',
      },
      {
        id: 'bundle',
        flag: 'Best value',
        name: 'Bid at auction with confidence',
        promise: 'The home and the paperwork, both checked, for less.',
        price: '£39',
        unit: 'for both',
        was: '£48',
        perUnit: 'Save £9',
        ticks: ['One Buyer Intelligence Report', 'One Legal Pack Review', 'Made for buying at auction'],
        cta: 'Get both reports',
        href: `${APP}/pricing`,
        risk: ONE_PAYMENT,
        img: '/images/reports/legal-summary.webp',
      },
      agent,
    ],
  },
];

// The card each product page shows in its price block.
const allCards = SALET_TABS.flatMap((t) => t.cards);
const cardFor = (id: string) => allCards.find((c) => c.id === id && !c.name.startsWith('Check one'))!;
export const PAGE_CARD: Record<string, ReturnType<typeof cardFor>> = {
  'buyer-intelligence': cardFor('intelligence'),
  'legal-pack': cardFor('legal'),
  'decision-pack': cardFor('decision'),
  'five-pack': cardFor('five'),
};

export const SALET_COMPARE = [
  { name: 'Free preview', price: '£0', what: 'The street, energy certificate, Land Registry record, neighbourhood type and local rents for one address.' },
  { name: 'Buyer Intelligence Report', price: '£19', what: 'Price range from recent sales, comparables, stamp duty, rent, flood, crime, planning, schools, area activity.', href: '/reports/buyer-intelligence' },
  { name: 'Legal Pack Review', price: '£29', what: 'Every finding with its page, what the pack leaves out, questions for your solicitor.', href: '/reports/legal-pack' },
  { name: 'Auction bundle', price: '£39', what: 'One Buyer Intelligence Report and one Legal Pack Review.' },
  { name: 'Decision Pack', price: '£69', what: 'The full report plus five costed prices, a works budget and fees.', href: '/reports/decision-pack' },
  { name: '5 report pack', price: '£79', what: 'Five Buyer Intelligence Reports, used within 12 months.', href: '/reports/five-pack' },
  { name: 'Compare Homes', price: '£28', what: 'Up to five homes side by side, the best buy named first, with questions for the agent.' },
  { name: 'Home Search Shortlist', price: '£149', what: 'Homes that fit your brief, each checked.' },
  { name: 'Buying agent', price: 'Agreed upfront', what: 'Search, negotiation and the whole purchase, acting only for you.', href: '/services' },
];

export const SALET_FAQS = [
  { q: 'What do I get for free?', a: 'A real preview of your address: the street, the energy certificate, what the Land Registry has recorded, the neighbourhood type and local rents. You pay only if you want the full report.' },
  { q: 'Is this a subscription?', a: 'No. Every report is one payment by card. Nothing renews.' },
  { q: 'How fast is it?', a: 'Minutes. The preview usually takes under a minute, the full report a minute or two more, on screen, as a PDF and by email.' },
  { q: 'What if there is no data for my address?', a: 'Where a source has nothing, the report says so. If a report fails to run, or comes back with no data, we refund it in full.' },
  { q: 'Can I get a refund?', a: `Yes. Not useful? Full refund, no questions: ask within 30 days of paying and we refund the full amount, with no reason needed. A credit you have not used can also be cancelled within 14 days, and a report that fails to run or comes back with no data is refunded in full. <a href="${APP}/terms#refunds">Refund terms</a>.` },
];

export const SALET_PROOF = [
  'Built on 30 years of Land Registry sales',
  'Every home in England covered',
  '2,000+ areas tracked every month',
];

export const SALET_BANNER = 'Introductory prices while we launch. They go up after.';

export { SAMPLE_INTEL, SAMPLE_LEGAL };
