// Structured data (schema.org JSON-LD) helpers. Base.astro adds the
// Organization and WebSite blocks to every page; pages pass anything extra
// (Product, FAQPage) through Base's `schema` prop. Only true, checkable facts:
// no ratings, no review counts, no invented numbers.
import type { Product } from '../data/reports';

const SITE = 'https://salet.uk';
export const ORG_ID = `${SITE}/#organisation`;
const RISE_DATE_ISO = '2026-11-30'; // launch prices hold until 1 December 2026

/** Plain text for schema fields: drop any HTML and collapse whitespace. */
export const plain = (s: string) => s.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();

/** "£19" or "£15.80" to "19.00"; null for anything that is not a single fixed price. */
const gbp = (price: string) => {
  const m = /^£(\d+(?:\.\d{1,2})?)$/.exec(price.trim());
  return m ? Number(m[1]).toFixed(2) : null;
};

/** A schema.org Product with a GBP Offer, or null when the item has no fixed price or is not on sale yet. */
export function productSchema(p: Product, url?: string, description?: string) {
  const price = gbp(p.price);
  if (!price || p.soon || p.notify) return null;
  const offer: Record<string, unknown> = {
    '@type': 'Offer',
    price,
    priceCurrency: 'GBP',
    availability: 'https://schema.org/InStock',
    url: p.href || url,
    seller: { '@id': ORG_ID },
    hasMerchantReturnPolicy: {
      '@type': 'MerchantReturnPolicy',
      applicableCountry: 'GB',
      returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
      merchantReturnDays: 30,
    },
  };
  if (p.rises) offer.priceValidUntil = RISE_DATE_ISO;
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: p.name,
    description: plain(description || p.promise),
    image: `${SITE}${p.img}`,
    brand: { '@type': 'Brand', name: 'Salet' },
    category: 'Property report',
    ...(url ? { url } : {}),
    offers: offer,
  };
}

/** FAQPage from the question and answer pairs a page renders. */
export function faqSchema(faqs: { q: string; a: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: plain(f.q),
      acceptedAnswer: { '@type': 'Answer', text: plain(f.a) },
    })),
  };
}

/** BreadcrumbList; the last crumb without a link points at the current page. */
export function breadcrumbSchema(trail: { label: string; href?: string }[], current: URL) {
  const base = current.origin;
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((t, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: t.label,
      item: t.href ? new URL(t.href, base).href : current.href,
    })),
  };
}

// The answer-first explainer shown on /check and /for/home-buyers. Direct
// answers to the questions buyers actually type, kept in one place so the
// visible copy and the FAQPage data never drift apart.
export const OFFER_EXPLAINER = {
  heading: 'How much should I offer on a house?',
  answer:
    'Start from what similar homes nearby actually sold for, not from the asking price. Take the sold prices on the same street and postcode from the last one to two years, compare them at the same floor area, and adjust for condition. If the asking price sits above the range those sales support, offer inside the range and show the seller the evidence. Then add the stamp duty, the works and the fees, because that is what the home really costs you.',
  faqs: [
    {
      q: 'Is this house overpriced?',
      a: 'Compare the asking price with the price per square metre that similar homes nearby sold for recently. If the asking price is well above the top of that range, the home is either overpriced or the seller is testing the market. An asking price is the seller’s opinion; sold prices are the facts.',
    },
    {
      q: 'How do I find the sold prices on my street?',
      a: 'HM Land Registry records the price paid for every home sold in England since 1995. The free Salet preview pulls those sales for your address, and the full report sets them against floor area from the energy certificate register, so you compare like with like.',
    },
    {
      q: 'Should I offer below the asking price?',
      a: 'Often, yes, but let the evidence set the number rather than a rule of thumb. An offer backed by named, dated sold prices is much harder for a seller or agent to dismiss than a round number.',
    },
    {
      q: 'How much stamp duty will I pay?',
      a: 'In England, for a home you will live in, stamp duty is 0% up to £125,000, 2% on the part from £125,001 to £250,000, 5% from £250,001 to £925,000, 10% from £925,001 to £1.5 million and 12% above that. First time buyers paying £500,000 or less pay nothing up to £300,000 and 5% on the rest. A second home or buy to let pays 5% more on every band. The Salet report works out the figure for your price and your situation.',
    },
  ],
};
