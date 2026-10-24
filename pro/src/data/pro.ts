// Salet Pro catalogue. Products are defined once in the shared catalogue
// (src/data/reports.ts); this file picks the professional ones and holds the
// Pro-only copy. Until PackForge publishes an order URL a product stays
// "Coming soon" and its tile collects an email.
import { pick, type Product } from '../../../src/data/reports';

export const SITE = 'https://pro.salet.uk';

export const LEADS_SCOPE = 'Leads cover every area except the few Salet sources in itself.';

export const LEADS: Product[] = pick('offmarket', 'seller-leads');
export const PACKS: Product[] = pick('pack-builder', 'valuation-evidence', 'market-brief');
export const PASSES: Product[] = pick('sourcer-pass');
export const ALL_PRO: Product[] = [...LEADS, ...PACKS, ...PASSES];

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
    h1: 'Find deals first, pack them fast',
    lede: 'Property level motivated seller signals for your area, every week, and a branded investor pack from an address and a price.',
    products: pick('offmarket', 'pack-builder', 'sourcer-pass'),
    leads: true,
    faqs: [
      { q: 'Do the leads name owners?', a: 'No, never. Every lead is a property and a public signal: an expiring licence, a refused plan, an auction lot, an energy rating a landlord must fix. How you approach the owner is up to you.' },
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
    h1: 'Know who is likely to sell next',
    lede: 'Homes in your patch likely to come to market, which sectors are getting busier, and the evidence pack for every valuation.',
    products: pick('seller-leads', 'market-brief', 'valuation-evidence'),
    leads: true,
    faqs: [
      { q: 'How do you know a home is likely to sell?', a: 'From public signals: HMO licences ending, planning permissions lapsing or refused, lots that failed at auction, and how fast energy certificates are being lodged in each sector. It is a lean, not a certainty, and we say how often it has been right.' },
      { q: 'Do the leads name owners?', a: 'No, never. Every lead is a property and a public signal.' },
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
  { type: 'Energy rating pressure', addr: 'A flat off a residential avenue, B42 1', signal: 'EPC F, private rental', sale: '2021, £125k to £150k', route: 'Letter to the owner at their title address' },
  { type: 'Pre-auction', addr: 'A house on a lane in Great Barr, B42 1', signal: 'In a regional auction, guide £50k to £75k', sale: 'No sale recorded since 1995', route: 'Pre-auction offer through the auctioneer, legal pack read first' },
  { type: 'HMO refused', addr: 'A house on an avenue, B20 1', signal: 'HMO change of use refused', sale: '2024, £400k to £425k', route: 'Letter to the owner, title checked first' },
  { type: 'Energy rating pressure', addr: 'A house in Perry Barr, B42 1', signal: 'EPC F, private rental', sale: '2004, £125k to £150k', route: 'Letter to the owner at their title address' },
  { type: 'Pre-auction', addr: 'A house in Great Barr, B43 5', signal: 'In a regional auction, guide £75k to £100k', sale: '2008, £100k to £125k', route: 'Pre-auction offer through the auctioneer, legal pack read first' },
  { type: 'HMO refused', addr: 'A house in Perry Barr, B42 2', signal: 'HMO change of use refused', sale: '2021, £175k to £200k', route: 'Letter to the owner, title checked first' },
];
