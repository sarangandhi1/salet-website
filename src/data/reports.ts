// The report catalogue for /reports and /reports/<slug>. One place for names,
// prices, promises and the report-app URL each button goes to, so the nav,
// the pricing tiles and the product pages cannot drift apart.
//
// Every image is a crop of the live sample reports at
// reports.salet.uk/sample/intelligence and /sample/legal-pack, never a mock-up.
//
// `soon` products are being built in PackForge. Until their checkout exists
// their buttons go to the property report and say "Coming this week"; when
// reports.salet.uk serves the real page, set `href` and drop `soon`.

export const APP = 'https://reports.salet.uk';
export const SAMPLE_INTEL = `${APP}/sample/intelligence`;
export const SAMPLE_LEGAL = `${APP}/sample/legal-pack`;

export interface Feature {
  img: string;
  title: string;
  line: string;
}

const f = (img: string, title: string, line: string): Feature => ({
  img: `/images/reports/${img}.webp`,
  title,
  line,
});

export const INTEL_FEATURES: Feature[] = [
  f('valuation', 'Recent sales near you', 'The price range the sold evidence supports, with every sale plotted.'),
  f('comparables', 'The sales behind it', 'Each comparable by address, month sold and price per square metre.'),
  f('like-for-like', 'Like for like sales', 'The same type of home at a similar size, as a cross check.'),
  f('stamp-duty', 'Stamp duty you will really pay', 'At both ends of the range, as your only home or an extra one.'),
  f('rent', 'Rent from real local lets', 'Led by actual lettings near the address, not a city average.'),
  f('area-activity', 'Is this area getting busier?', 'How fast homes come to market here against a year ago.'),
  f('flood', 'Flood risk', 'The Environment Agency rating for the postcode.'),
  f('crime', 'Crime by type', 'Recorded offences in the last twelve months, by offence.'),
  f('schools', 'Schools named', 'The nearest state schools, their type and last inspection.'),
  f('planning', 'Planning nearby', 'What the neighbours have applied to build, and the outcome.'),
  f('epc', 'Energy certificate', 'The official rating and floor area for the address.'),
  f('price-paid', 'What has sold here', 'Every registered sale at the address and in the postcode.'),
  f('area-type', 'Who lives around here', 'The neighbourhood type from the 2021 census.'),
  f('hmo', 'Shared housing nearby', 'Licensed houses in multiple occupation on the street.'),
];

export const LEGAL_FEATURES: Feature[] = [
  f('legal-summary', 'The summary first', 'What changes the price, in plain words, before any detail.'),
  f('legal-findings', 'Every finding with its page', 'Graded: changes the price, needs an answer, or worth knowing.'),
  f('legal-absent', 'What the pack does not answer', 'Missing searches and gaps, reported as gaps.'),
  f('legal-questions', 'Questions for your solicitor', 'Ready to send, one per open point.'),
];

export interface Product {
  slug: string | null; // null: no product page of its own
  key: string;
  name: string;
  price: string;
  promise: string;
  points: string[];
  img: string;
  href: string;
  cta: string;
  soon?: boolean;
  popular?: boolean;
  badge?: string;
}

export const PRODUCTS: Product[] = [
  {
    slug: null,
    key: 'free',
    name: 'Free preview',
    price: '£0',
    promise: 'See real data on your address before you spend anything.',
    points: [
      'The street and the energy certificate',
      'What the Land Registry has recorded',
      'Who lives around here',
      'The local rent floors',
    ],
    img: '/images/reports/price-paid.webp',
    href: `${APP}/intelligence`,
    cta: 'Start free',
  },
  {
    slug: 'buyer-intelligence',
    key: 'intelligence',
    name: 'Buyer Intelligence Report',
    price: '£19',
    promise: 'Is this house worth the asking price? The evidence for one address.',
    points: [
      'The price range recent sales support',
      'Stamp duty you will really pay',
      'Rent, flood, crime, planning and schools',
      'Is this area getting busier?',
    ],
    img: '/images/reports/valuation.webp',
    href: `${APP}/intelligence`,
    cta: 'Check a property',
    popular: true,
  },
  {
    slug: 'legal-pack',
    key: 'legal',
    name: 'Legal Pack Review',
    price: '£29',
    promise: 'What the auction or sale pack really says, with the page behind every finding.',
    points: [
      'Every finding cited to its document and page',
      'What the pack leaves out',
      'Special conditions read clause by clause',
      'Questions to send your solicitor',
    ],
    img: '/images/reports/legal-findings.webp',
    href: `${APP}/legal-pack`,
    cta: 'Upload a legal pack',
  },
  {
    slug: null,
    key: 'bundle',
    name: 'Auction bundle',
    price: '£39',
    promise: 'Buying at auction? The property report and the legal pack review together.',
    points: [
      'One Buyer Intelligence Report',
      'One Legal Pack Review',
      'Save £9 against buying both',
    ],
    img: '/images/reports/legal-summary.webp',
    href: `${APP}/intelligence`,
    cta: 'Coming this week',
    soon: true,
  },
  {
    slug: 'decision-pack',
    key: 'decision',
    name: 'Buyer Decision Pack',
    price: '£69',
    promise: 'Everything you need to decide on one property, in one pack.',
    points: [
      'The Buyer Intelligence Report',
      'The Legal Pack Review for the same property',
      'The open questions to settle before you offer',
    ],
    img: '/images/reports/legal-questions.webp',
    href: `${APP}/intelligence`,
    cta: 'Coming this week',
    soon: true,
    badge: 'New',
  },
  {
    slug: 'five-pack',
    key: 'five',
    name: '5 report pack',
    price: '£79',
    promise: 'Comparing a shortlist? Five property reports at £15.80 each.',
    points: [
      'Five Buyer Intelligence Reports',
      'Use them on any five addresses',
      '£15.80 a report instead of £19',
    ],
    img: '/images/reports/comparables.webp',
    href: `${APP}/intelligence`,
    cta: 'Coming this week',
    soon: true,
    badge: 'New',
  },
];

export const bySlug = (slug: string) => PRODUCTS.find((p) => p.slug === slug)!;

// Product page copy. Kept beside the catalogue so a price or a name changes
// in one file.
export interface ProductPage {
  title: string;
  h1: string;
  lede: string;
  who: string;
  problem: string;
  notIncluded: string[];
  how: string;
  delivery: string;
  features: Feature[];
  sample: string;
}

export const PAGES: Record<string, ProductPage> = {
  'buyer-intelligence': {
    title: 'Buyer Intelligence Report | £19 | Is this house worth the asking price? | Salet',
    h1: 'Is this house worth the asking price?',
    lede: 'Every recent sale nearby, the stamp duty, rent, flood, crime, planning and schools for one address. Free preview first, full report £19.',
    who: 'Anyone about to offer on a home in England or Wales, whether to live in or to let, who wants the evidence before they name a number.',
    problem: 'The asking price is the seller’s opinion. The sold prices around it are facts, but they are scattered across a dozen public sources. This report pulls them into one place for one address.',
    notIncluded: [
      'Not a RICS valuation or a survey: nobody visits the property',
      'Not advice on what to offer or whether to buy',
      'It cannot see work done since the home last sold, such as an extension',
    ],
    how: 'You type the postcode and house number. We pull the sold prices, the energy certificate, lettings and area data from the official sources, date each one, and set the price range from the recent sales at this floor area.',
    delivery: 'The free preview in under a minute. The full report a minute or two after you unlock it, on screen, as a PDF and by email.',
    features: INTEL_FEATURES,
    sample: SAMPLE_INTEL,
  },
  'legal-pack': {
    title: 'Legal Pack Review | £29 | What the auction pack really says | Salet',
    h1: 'Is there a problem in the paperwork?',
    lede: 'Upload an auction pack, a lease or a management pack. Get back what the documents say, with the page behind every finding. Free preview first, full review £29.',
    who: 'Buyers at auction and anyone handed a legal pack with days, not weeks, to decide. Especially leasehold flats, where the costs hide in the lease.',
    problem: 'Special conditions move costs to the buyer, and a pack can be 300 pages. The expensive part is often what is missing: searches, service charge accounts, answers to title questions.',
    notIncluded: [
      'Not legal advice: a solicitor must review the pack before you exchange',
      'It reads only the documents you upload',
      'It does not tell you what to bid or whether to buy',
    ],
    how: 'You upload the pack as PDFs. We read it against a named risk checklist and report each finding with the document and page it rests on, graded by whether it changes the price, needs an answer before exchange, or is worth knowing.',
    delivery: 'A few minutes to read properly. The free preview shows the summary and a finding from each section; the full review comes on screen, as a PDF and by email.',
    features: LEGAL_FEATURES,
    sample: SAMPLE_LEGAL,
  },
  'decision-pack': {
    title: 'Buyer Decision Pack | £69 | The evidence and the paperwork for one property | Salet',
    h1: 'Everything you need to decide on one property',
    lede: 'The Buyer Intelligence Report and the Legal Pack Review for the same address, with the open questions to settle before you offer. £69.',
    who: 'Buyers who are serious about one property and have the legal pack in hand, at auction or by private treaty.',
    problem: 'The price evidence and the paperwork are usually read by different people at different times. The pack puts them side by side, so you see both before you commit.',
    notIncluded: [
      'Not a RICS valuation, a survey or legal advice',
      'A solicitor must still review the pack before exchange',
      'It does not tell you what to offer or whether to buy',
    ],
    how: 'You give the address and upload the legal pack. Both reports run on the same engine as the single reports, from the same official sources, and every figure and finding is dated and cited.',
    delivery: 'Minutes, on screen, as PDFs and by email.',
    features: [...INTEL_FEATURES.slice(0, 6), ...LEGAL_FEATURES],
    sample: SAMPLE_INTEL,
  },
  'five-pack': {
    title: '5 report pack | £79 | Five Buyer Intelligence Reports | Salet',
    h1: 'Comparing a shortlist? Check all five',
    lede: 'Five Buyer Intelligence Reports to use on any five addresses. £79, which is £15.80 a report instead of £19.',
    who: 'Buyers weighing several homes at once, and investors screening a shortlist before viewings.',
    problem: 'One report tells you about one house. A shortlist needs the same evidence on each, laid out the same way, so you can compare like with like.',
    notIncluded: [
      'Not a RICS valuation, a survey or legal advice',
      'Each credit runs one Buyer Intelligence Report on one address',
      'No legal pack reviews in this pack',
    ],
    how: 'Each report is the full Buyer Intelligence Report: sold prices, stamp duty, rent and area data from the official sources, every figure dated and sourced.',
    delivery: 'Each report in a minute or two, on screen, as a PDF and by email. Every free preview stays free.',
    features: INTEL_FEATURES.slice(0, 8),
    sample: SAMPLE_INTEL,
  },
};
