// salet.uk pricing board: what each job costs, three cards per job.
// Launch pricing: `was` with `launch` is the list price that applies after
// launch, labelled "after launch". Bundle savings are true sums at launch
// prices. There are no sales yet, so the flagged card says "Top pick" or
// "Best value", never "most popular". No testimonials, counts or timers.
//
// Decision Pack, 5 report pack and Home Search Shortlist are not on sale
// yet: their cards collect an email. When PackForge sells one, give its
// card an href and a verb, and drop `notify`.
import type { Tab } from '../components/PricingBoard.astro';
import { APP, SAMPLE_INTEL, SAMPLE_LEGAL } from './reports';

const FREE_FIRST = 'Free preview first. Pay only if you want the rest.';
const ONE_PAYMENT = 'One payment by card. No subscription, no auto renew.';

const report = {
  id: 'intelligence',
  name: 'Never overpay again',
  promise: 'See what every home nearby really sold for, before you make an offer.',
  price: '£19',
  was: '£29',
  launch: true,
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
        flag: 'Top pick',
        name: 'Walk in knowing your number',
        promise: 'Every likely price, fully costed with stamp duty, works and fees. No nasty surprises.',
        price: '£69',
        was: '£99',
        launch: true,
        unit: 'per property',
        ticks: ['The full Buyer Intelligence Report', 'Five prices, each with stamp duty, works and fees', 'A works budget, line by line'],
        cta: 'Tell me when it is live',
        notify: 'Decision Pack',
        risk: 'Coming this week. Free preview first when it opens.',
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
        id: 'five',
        flag: 'Best value',
        name: 'Check your whole shortlist',
        promise: 'Five full reports. Line every home up side by side and pick the winner.',
        price: '£79',
        unit: 'for 5 reports',
        was: '£95',
        perUnit: '£15.80 a report',
        ticks: ['The same full report on every home', 'Use them over 12 months', 'Compare like with like'],
        cta: 'Tell me when it is live',
        notify: '5 report pack',
        risk: 'Coming this week. ' + ONE_PAYMENT,
        img: '/images/reports/comparables.webp',
      },
      {
        id: 'shortlist',
        name: 'We find the homes for you',
        promise: 'Tell us what you want. We send the homes that fit, every one checked.',
        price: '£149',
        unit: 'per search',
        ticks: ['Homes on the market that match your brief', 'Each priced against its sold evidence', 'Area, flood and schools for each'],
        cta: 'Tell me when it is live',
        notify: 'Home Search Shortlist',
        risk: 'Coming soon. ' + ONE_PAYMENT,
        img: '/images/reports/area-type.webp',
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
  { name: 'Buyer Intelligence Report', price: '£19 (£29 after launch)', what: 'Price range from recent sales, comparables, stamp duty, rent, flood, crime, planning, schools, area activity.', href: '/reports/buyer-intelligence' },
  { name: 'Legal Pack Review', price: '£29', what: 'Every finding with its page, what the pack leaves out, questions for your solicitor.', href: '/reports/legal-pack' },
  { name: 'Auction bundle', price: '£39', what: 'One Buyer Intelligence Report and one Legal Pack Review.' },
  { name: 'Decision Pack (this week)', price: '£69 (£99 after launch)', what: 'The full report plus five costed prices, a works budget and fees.', href: '/reports/decision-pack' },
  { name: '5 report pack (this week)', price: '£79', what: 'Five Buyer Intelligence Reports, used within 12 months.', href: '/reports/five-pack' },
  { name: 'Home Search Shortlist (soon)', price: '£149', what: 'Homes that fit your brief, each checked.' },
  { name: 'Buying agent', price: 'Agreed upfront', what: 'Search, negotiation and the whole purchase, acting only for you.', href: '/services' },
];

export const SALET_FAQS = [
  { q: 'What do I get for free?', a: 'A real preview of your address: the street, the energy certificate, what the Land Registry has recorded, the neighbourhood type and local rents. You pay only if you want the full report.' },
  { q: 'Is this a subscription?', a: 'No. Every report is one payment by card. Nothing renews.' },
  { q: 'How fast is it?', a: 'Minutes. The preview usually takes under a minute, the full report a minute or two more, on screen, as a PDF and by email.' },
  { q: 'What if there is no data for my address?', a: 'Where a source has nothing, the report says so. If a report fails to run, or comes back with no data, we refund it in full.' },
  { q: 'Can I get a refund?', a: `A credit you have not used can be cancelled within 14 days of payment for a full refund. Once a report has been delivered it is not refundable. <a href="${APP}/terms#refunds">Refund terms</a>.` },
];

export const SALET_PROOF = [
  'Built on 30 years of Land Registry sales',
  'Every home in England and Wales covered',
  '2,000+ areas tracked every month',
];

export const SALET_BANNER = 'Introductory prices while we launch. They go up after.';

export { SAMPLE_INTEL, SAMPLE_LEGAL };
