// Salet Pro catalogue. Products are defined once in the shared catalogue
// (src/data/reports.ts); this file picks the professional ones and holds the
// Pro-only copy. Until PackForge publishes an order URL a product stays
// "Coming soon" and its tile collects an email.
import { APP, pick as pickShared, type Product } from '../../../src/data/reports';
import type { Tab } from '../../../src/components/PricingBoard.astro';

export const SITE = 'https://pro.salet.uk';

// Order pages in the Pro app (reports.salet.uk/pro) and the pass checkouts.
// A product listed here sells from its tile; anything else keeps the
// "Coming soon" email capture. Add a line when PackForge publishes one.
const ORDER: Record<string, { href: string; cta: string }> = {
  'pack-builder': { href: `${APP}/pro/investor-pack`, cta: 'Build a pack' },
  'valuation-evidence': { href: `${APP}/pro/valuation-evidence`, cta: 'Order the pack' },
  offmarket: { href: `${APP}/checkout/offmarket_leads`, cta: 'Get 30 days of leads' },
  'seller-leads': { href: `${APP}/checkout/seller_leads`, cta: 'Get 30 days of leads' },
  'sourcer-pass': { href: `${APP}/checkout/sourcer_pass`, cta: 'Buy the pass' },
};

const pick = (...keys: string[]): Product[] =>
  pickShared(...keys).map((p) =>
    ORDER[p.key] ? { ...p, ...ORDER[p.key], soon: false, notify: false, badge: undefined } : p,
  );

export const LEADS_SCOPE = 'Leads cover every area except the few Salet sources in itself.';

export const LEADS: Product[] = pick('offmarket', 'seller-leads', 'demand-board', 'letter-kit');
export const PACKS: Product[] = pick('pack-builder', 'valuation-evidence', 'market-brief', 'photo-refurb');
export const PASSES: Product[] = pick('sourcer-pass');
export const DATA: Product[] = pick('data-licence', 'bespoke');
export const ALL_PRO: Product[] = [...LEADS, ...PACKS, ...PASSES, ...DATA];

export interface ProAudience {
  slug: string;
  label: string;
  img: string;
  title: string;
  h1: string;
  lede: string;
  products: Product[];
  leads: boolean;
  faqs: { q: string; a: string }[];
}

export const AUDIENCES: ProAudience[] = [
  {
    slug: 'sourcers',
    label: 'Deal sourcers',
    img: '/images/reports/planning.webp',
    title: 'Off-market leads and investor packs for sourcers | Salet Pro',
    h1: 'Find deals before Rightmove does',
    lede: 'Every week, the homes in your area whose owners may want to sell. Then package each deal for your investors in minutes, under your own brand.',
    products: pick('offmarket', 'pack-builder', 'sourcer-pass', 'demand-board', 'letter-kit', 'photo-refurb'),
    leads: true,
    faqs: [
      { q: 'Do the leads name owners?', a: 'No, never. Every lead is a property and the public record that put it on the list: a licence ending, a refused plan, an auction lot, an energy rating a landlord must improve. How you approach the owner is up to you.' },
      { q: 'Where does the data come from?', a: 'Council licence registers and planning portals, the EPC register, HM Land Registry and auction catalogues. Every lead says where it came from and when.' },
      { q: 'Which areas do you cover?', a: LEADS_SCOPE },
      { q: 'What is a pass?', a: 'One payment for 30 days of packs and leads. It does not renew.' },
    ],
  },
  {
    slug: 'agents',
    label: 'Estate agents',
    img: '/images/reports/area-activity.webp',
    title: 'Seller leads and market briefs for estate agents | Salet Pro',
    h1: 'Win the instruction before your rivals know it exists',
    lede: 'Know which homes in your patch are about to come to market, which streets are heating up, and walk into every valuation with hard evidence.',
    products: pick('seller-leads', 'market-brief', 'valuation-evidence', 'letter-kit', 'data-licence'),
    leads: true,
    faqs: [
      { q: 'How do you know a home is likely to sell?', a: 'From public records: HMO licences ending, planning permissions lapsing or refused, lots that failed at auction, and how fast energy certificates are being lodged in each sector. We show you how often it has been right.' },
      { q: 'Do the leads name owners?', a: 'No, never. Every lead is a property and the public record behind it.' },
      { q: 'Which areas do you cover?', a: LEADS_SCOPE },
      { q: 'Can I put my branding on the brief?', a: 'Yes. The Area Market Brief is made to send to your vendors and applicants under your name.' },
    ],
  },
];

// A sample of the off-market lead sheet, from a real preview edition
// (Perry Barr, Birmingham, October 2026). The page is public, so house
// numbers, street names and the end of each postcode are removed, and
// deceased-estate leads are left out entirely.
export const LEAD_STATS = [
  { n: '65', label: 'leads within about 2 miles' },
  { n: '16', label: 'marked top priority' },
  { n: '4', label: 'lots heading to auction' },
  { n: '6', label: 'HMO plans refused' },
];

export const LEAD_SAMPLE = [
  { type: 'Landlord must improve energy rating', addr: 'A flat off a residential avenue, B42 1', signal: 'EPC F, private rental', sale: '2021, £125k to £150k', route: 'Letter to the owner at their title address' },
  { type: 'Pre-auction', addr: 'A house on a lane in Great Barr, B42 1', signal: 'In a regional auction, guide £50k to £75k', sale: 'No sale recorded since 1995', route: 'Pre-auction offer through the auctioneer, legal pack read first' },
  { type: 'HMO refused', addr: 'A house on an avenue, B20 1', signal: 'HMO change of use refused', sale: '2024, £400k to £425k', route: 'Letter to the owner, title checked first' },
  { type: 'Landlord must improve energy rating', addr: 'A house in Perry Barr, B42 1', signal: 'EPC F, private rental', sale: '2004, £125k to £150k', route: 'Letter to the owner at their title address' },
  { type: 'Pre-auction', addr: 'A house in Great Barr, B43 5', signal: 'In a regional auction, guide £75k to £100k', sale: '2008, £100k to £125k', route: 'Pre-auction offer through the auctioneer, legal pack read first' },
  { type: 'HMO refused', addr: 'A house in Perry Barr, B42 2', signal: 'HMO change of use refused', sale: '2021, £175k to £200k', route: 'Letter to the owner, title checked first' },
];

// Pricing board: pick the job, see three cards, the middle one flagged.
// Savings shown only where the list prices add up: ten packs at £15 plus
// 30 days of leads at £49 is £199 against the £99 pass.
const PER_30 = 'One payment by card. Ends after 30 days, never renews.';
const PER_PACK = 'Pay per pack by card. No subscription.';
const o = (key: string) => ORDER[key];

export const PRO_TABS: Tab[] = [
  {
    id: 'sourcers',
    label: 'I source deals',
    cards: [
      {
        id: 'pack-builder', name: 'Your next deal, packaged in minutes', promise: 'Address and price in. A branded pack your investors will read, out.',
        price: '£15', unit: 'per pack',
        ticks: ['Your branding on a full PDF pack', 'A one page summary to share', 'Returns, comparables and area, sourced'],
        cta: o('pack-builder').cta, href: o('pack-builder').href, risk: PER_PACK, img: '/images/reports/valuation.webp',
      },
      {
        id: 'sourcer-pass', flag: 'Best value', name: 'Your next 10 deals, packaged',
        promise: 'The Sourcer Pass: ten packs plus the leads your competitors don\u2019t have.',
        price: '£99', unit: '30 days', was: '£199', launch: true, perUnit: '£9.90 a pack, leads included',
        ticks: ['Ten Investor Pack Builder packs', 'Off-market leads for one area, weekly', 'Letter Kit included'],
        cta: 'Start my pass', href: o('sourcer-pass').href, risk: PER_30, img: '/images/reports/planning.webp',
      },
      {
        id: 'offmarket', name: 'Find deals before Rightmove does', promise: 'The leads your competitors don\u2019t have, every week, for your area.',
        price: '£49', unit: '30 days per area',
        ticks: ['Licences ending and refused plans', 'Auction lots and energy rating deadlines', 'Addresses only, never owner names'],
        cta: 'Get leads for my area', href: o('offmarket').href, risk: PER_30, img: '/images/reports/price-paid.webp',
      },
    ],
  },
  {
    id: 'agents',
    label: 'I am an estate agent',
    cards: [
      {
        id: 'valuation-evidence', name: 'Back every valuation with hard evidence', promise: 'Walk in with the numbers and win the instruction.',
        price: '£15', unit: 'per instruction',
        ticks: ['The comparable sales with dates', 'The energy certificate and floor area', 'The area on one page'],
        cta: o('valuation-evidence').cta, href: o('valuation-evidence').href, risk: PER_PACK, img: '/images/reports/like-for-like.webp',
      },
      {
        id: 'seller-leads', flag: 'Best value', name: 'Know who will sell next', promise: 'Seller Leads: reach owners before they call another agent.',
        price: '£79', unit: '30 days per patch', was: '£129', launch: true,
        ticks: ['Licences ending and permissions lapsing', 'Refused plans and failed auctions', 'Which sectors are getting busier'],
        cta: 'Get my seller leads', href: o('seller-leads').href, risk: PER_30, img: '/images/reports/area-activity.webp',
      },
      {
        id: 'market-brief', name: 'Win more instructions', promise: 'A monthly market brief, in your branding, that vendors actually keep.',
        price: '£49', unit: '30 days',
        ticks: ['Activity in your sectors against a year ago', 'Recent sales and what is changing locally', 'Your branding, ready to send'],
        cta: 'Tell me when it is live', notify: 'Area Market Brief', risk: 'Coming soon. ' + PER_30, img: '/images/reports/crime.webp',
      },
    ],
  },
  {
    id: 'data',
    label: 'I need data',
    cards: [
      {
        id: 'demand-board', name: 'See exactly what investors want', promise: 'Live buyer briefs, area by area. Source to order.',
        price: '£29', unit: '30 days',
        ticks: ['Strategy and budget by area', 'Updated as briefs come in', 'No names, ever'],
        cta: 'Tell me when it is live', notify: 'Buyer Demand Board', risk: 'Coming soon. ' + PER_30, img: '/images/reports/area-type.webp',
      },
      {
        id: 'data-licence', flag: 'Best value', name: 'Every district, every month', promise: 'The market data your team needs, ready to use.',
        price: '£199', unit: 'per month',
        ticks: ['Sales and new energy certificates by district', 'How busy each postcode sector is against a year ago', 'As a spreadsheet or a direct connection'],
        cta: 'Tell me when it is live', notify: 'Area Data Licence', risk: 'Coming soon. Terms set out in full before launch.', img: '/images/reports/area-activity.webp',
      },
      {
        id: 'bespoke', name: 'Find the stock nobody else can', promise: 'Freeholds, blocks and whole portfolios, traced for funds and family offices.',
        price: 'from £500', unit: 'per project',
        ticks: ['Freehold and block ownership', 'Company owned stock and portfolios', 'Scoped and priced before we start'],
        cta: 'Scope a project', href: '/contact?topic=research', risk: 'Fixed price agreed before any work starts.',
      },
    ],
  },
];

export const PRO_COMPARE = [
  { name: 'Investor Pack Builder', price: '£15 a pack', what: 'Branded PDF pack and a one page summary from an address and a price.' },
  { name: 'Valuation Evidence Pack', price: '£15', what: 'Comparables, energy certificate and area for one instruction.' },
  { name: 'Letter Kit (soon)', price: '£19 / 30 days', what: 'A ready letter for each reason an owner might sell, and a mail merge file. Free with the Sourcer Pass.' },
  { name: 'Buyer Demand Board (soon)', price: '£29 / 30 days', what: 'What investors are asking for, by area. No names.' },
  { name: 'Off-market leads', price: '£49 / 30 days', what: 'Each week, homes in one area whose owners may want to sell.' },
  { name: 'Area Market Brief (soon)', price: '£49 / 30 days', what: 'Monthly branded brief for vendors and applicants.' },
  { name: 'Photo Refurb Estimate (soon)', price: '£15', what: 'A costed refurbishment from the listing photos.' },
  { name: 'Seller Leads', price: '£79 / 30 days (£129 after launch)', what: 'Homes in one patch likely to come to market.' },
  { name: 'Sourcer Pass', price: '£99 / 30 days', what: 'Ten packs, weekly leads for one area and the Letter Kit.' },
  { name: 'Area Data Licence (soon)', price: '£199 / month', what: 'District figures as a spreadsheet or a direct connection.' },
  { name: 'Bespoke Research', price: 'from £500', what: 'Freehold, block and portfolio sweeps, scoped and priced first.', href: '/contact?topic=research' },
];

export const PRO_FAQS = [
  { q: 'Does anything renew?', a: 'No. Passes and leads are one payment for 30 days and then they end. Real subscriptions come later, and only if you ask for them.' },
  { q: 'Do the leads name owners?', a: 'No, never. Every lead is a property and the public record behind it.' },
  { q: 'Which areas do you cover?', a: LEADS_SCOPE },
  { q: 'How do I pay?', a: 'By card, once, at checkout. Salet Ltd is not VAT registered, so the price shown is the price you pay.' },
  { q: 'Can I see a sample first?', a: 'Yes. <a href="/sample-leads">See a real lead sheet</a> with the addresses masked.' },
];

export const PRO_PROOF = [
  'Built on 30 years of Land Registry sales',
  'Every home in England and Wales covered',
  '2,000+ areas tracked every month',
];

export const PRO_BANNER = 'Introductory prices while we launch. They go up after.';
