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
  unit?: string; // shown beside the price, e.g. "per pack", "30 days"
  notify?: boolean; // not built yet: the tile collects an email instead of selling
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
    href: `${APP}/pricing`,
    cta: 'Buy the bundle',
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

// Products still being built. The professional ones (packs, leads, agent
// tools) are sold only on Salet Pro (pro.salet.uk), never on salet.uk,
// which acts only for buyers. Each tile shows the real report section the
// product is built on and collects an email for launch day. When PackForge
// sells one, move it into PRODUCTS with its real href.
const soon = (
  key: string,
  name: string,
  price: string,
  unit: string,
  promise: string,
  points: string[],
  img: string,
): Product => ({
  slug: null,
  key,
  name,
  price,
  unit,
  promise,
  points,
  img: `/images/reports/${img}.webp`,
  href: '',
  cta: 'Tell me when it is live',
  soon: true,
  notify: true,
  badge: 'Coming soon',
});

export const COMING: Product[] = [
  soon('shortlist', 'Home Search Shortlist', '£149', 'one search', 'Your brief in, the homes that fit it out, each one checked.', ['Homes on the market that match your brief', 'Each one priced against its sold evidence', 'Area, flood and schools for every one'], 'area-type'),
  soon('deal-analyser', 'Deal Analyser', '£29', 'per deal', 'Buy to let, BRRR or flip: does the deal stack up?', ['Yield, cash left in and return', 'A stress test on rate and rent', 'Built from local lettings and sold prices'], 'rent'),
  soon('hmo', 'HMO Viability Report', '£29', 'per address', 'Can this house work as an HMO, and what would it let for?', ['Article 4 and licensing for the address', 'Local housing allowance and room rents', 'Licensed HMOs and refusals nearby'], 'hmo'),
  soon('auction-lot', 'Auction Lot Report', '£39', 'per lot', 'The evidence on one lot, and the legal pack read, before you bid.', ['Sold evidence for the lot', 'The highest bid the evidence supports', 'The legal pack read with page references'], 'legal-findings'),
  soon('investor-pass', 'Investor Pass', '£49', '30 days', 'Ten reports of any type in thirty days. One payment, no renewal.', ['Any mix of reports', 'One payment, no auto renewal', 'Every free preview stays free'], 'comparables'),
  soon('pack-builder', 'Investor Pack Builder', '£15', 'per pack', 'Address and price in, a branded investor pack out.', ['Your branding on a full PDF pack', 'A one page summary for WhatsApp', 'Returns, comparables and area, all sourced'], 'valuation'),
  soon('offmarket', 'Off-market leads', '£49', '30 days', 'Motivated seller signals for one area, every week.', ['Expiring HMO licences and refused plans', 'Pre-auction lots and energy rating pressure', 'Property level, never owner names'], 'planning'),
  soon('sourcer-pass', 'Sourcer Pass', '£99', '30 days', 'Ten investor packs and the weekly leads for one area.', ['Ten Investor Pack Builder packs', 'Off-market leads for one area', 'One payment, no auto renewal'], 'price-paid'),
  soon('seller-leads', 'Seller Leads', '£79', '30 days per patch', 'Homes in your patch likely to come to market soon.', ['Licences ending and permissions lapsing', 'Refused plans and failed auctions', 'Which sectors are getting busier'], 'area-activity'),
  soon('market-brief', 'Area Market Brief', '£49', '30 days', 'A monthly branded brief for your vendors and applicants.', ['Activity in your sectors against a year ago', 'Sold evidence and local signals', 'Your branding, ready to send'], 'crime'),
  soon('valuation-evidence', 'Valuation Evidence Pack', '£15', 'per instruction', 'Comparables, energy certificate and area for one instruction.', ['The comparable sales with dates', 'The energy certificate and floor area', 'The area in one page'], 'like-for-like'),
];

const ALL = [...PRODUCTS, ...COMING];
export const pick = (...keys: string[]) => keys.map((k) => ALL.find((p) => p.key === k)!);

export interface Audience {
  slug: string;
  label: string; // nav heading
  short: string; // homepage tile line
  img: string;
  title: string;
  h1: string;
  lede: string;
  products: Product[];
  free?: { href: string; label: string }[];
  faqs: { q: string; a: string }[];
  service?: string;
}

const REFUND =
  'A credit you have not used can be cancelled within 14 days of payment for a full refund. If a report fails to run, or comes back with no data, we refund it in full. Once a report has been delivered it is not refundable.';

export const AUDIENCES: Audience[] = [
  {
    slug: 'home-buyers',
    label: 'Home buyers',
    short: 'Is this house worth the asking price, and is the paperwork clean?',
    img: '/images/reports/valuation.webp',
    title: 'Reports for home buyers | From free | Salet',
    h1: 'Buying a home? Check it before you offer',
    lede: 'The sold evidence, the stamp duty and the area for any address, and the legal pack read with the page behind every finding. Every report starts with a free preview.',
    products: pick('free', 'intelligence', 'legal', 'bundle', 'decision', 'shortlist'),
    free: [
      { href: '/deal-check', label: 'What should I offer?' },
      { href: '/price-check', label: 'What is this property worth?' },
      { href: '/refurb-check', label: 'What will the refurb cost?' },
      { href: '/area', label: 'Is my area getting busier?' },
    ],
    faqs: [
      { q: 'Is this a valuation?', a: 'No. It is not a RICS valuation or a survey. It reports what the public records show, as a range, so a survey and your own viewing still matter.' },
      { q: 'How fast is it?', a: 'Minutes. The free preview usually takes under a minute, the full report a minute or two more. It lands in your account and in your inbox.' },
      { q: 'Can I get a refund?', a: REFUND },
      { q: 'Is my data shared?', a: 'No. We do not sell your data and we do not share it with anyone else.' },
    ],
    service: 'Want someone to negotiate for you? Salet also acts as your',
  },
  {
    slug: 'investors',
    label: 'Investors',
    short: 'Rent, yield, HMO rules and auction lots, checked before you buy.',
    img: '/images/reports/rent.webp',
    title: 'Reports for property investors | Salet',
    h1: 'Investing? Know the numbers before the viewing',
    lede: 'Sold prices, real local rents and the area for any address today. Deal, HMO and auction reports are on the way.',
    products: pick('intelligence', 'five', 'legal', 'deal-analyser', 'hmo', 'auction-lot', 'investor-pass'),
    faqs: [
      { q: 'Where do the rents come from?', a: 'Actual lettings near the address lead, with wider area figures beside them as a cross check. Every figure says where it came from and when.' },
      { q: 'Do you predict prices?', a: 'No. The reports show what the evidence supports today, as a range. Nobody has a tested edge on where prices go next, and we do not pretend to.' },
      { q: 'What is a pass?', a: 'One payment for a set number of reports used within 30 days. It does not renew. Real subscriptions only come later.' },
      { q: 'Can I get a refund?', a: REFUND },
    ],
    service: 'Want us to find and negotiate the deal? Salet also acts as your',
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
