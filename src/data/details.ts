// What a customer actually gets, per product, in plain words: three or four
// concrete deliverables, then the format and how fast it arrives. Every tile
// and pricing card on salet.uk and Salet Pro reads from here, keyed by the
// product key, so the description of a product is written once.
//
// Wording rule: talk like a property professional to a client. No system or
// software words ("engine", "generated", "output", "signals", "feed").

export type Icon =
  | 'eye' | 'house' | 'scales' | 'stack' | 'document' | 'docs' | 'search' | 'handshake'
  | 'camera' | 'calculator' | 'rooms' | 'gavel' | 'ticket' | 'briefcase' | 'pin' | 'bell'
  | 'chart' | 'clipboard' | 'envelope' | 'people' | 'grid' | 'compass';

export type Device = 'doc' | 'phone' | 'icon';

export interface Detail {
  icon: Icon;
  device: Device;
  img?: string;
  deliverables: string[];
  format: string;
}

const img = (n: string) => `/images/reports/${n}.webp`;
const PDF = 'On screen and as a PDF by email, ready in minutes';

export const DETAILS: Record<string, Detail> = {
  free: {
    icon: 'eye', device: 'doc', img: img('price-paid'),
    deliverables: ['Your street and its energy certificate', 'What the Land Registry has recorded there', 'Who lives around here', 'What homes nearby rent for'],
    format: 'On screen, usually in under a minute',
  },
  intelligence: {
    icon: 'house', device: 'doc', img: img('valuation'),
    deliverables: ['The price range recent sales near you support', 'Those sales, with their prices and dates', 'Your stamp duty, worked out', 'Rent, flood risk, crime, planning and schools nearby'],
    format: PDF,
  },
  legal: {
    icon: 'document', device: 'doc', img: img('legal-findings'),
    deliverables: ['Every finding, with the page it is on', 'What the pack leaves out', 'Special conditions read clause by clause', 'Questions to send your solicitor'],
    format: 'On screen and as a PDF, ready in a few minutes',
  },
  bundle: {
    icon: 'docs', device: 'doc', img: img('legal-summary'),
    deliverables: ['The full Buyer Intelligence Report', 'The full Legal Pack Review', 'Made for buying at auction'],
    format: PDF,
  },
  decision: {
    icon: 'scales', device: 'doc', img: img('dp-scenarios'),
    deliverables: ['The full Buyer Intelligence Report', 'Five prices, each with stamp duty, works and fees added up', 'A works budget, line by line, with contingency', 'A plain read of what the figures say'],
    format: PDF,
  },
  five: {
    icon: 'stack', device: 'doc', img: img('comparables'),
    deliverables: ['Five full Buyer Intelligence Reports', 'Use them on any five homes within 12 months', 'The same layout every time, so they compare side by side'],
    format: PDF,
  },
  shortlist: {
    icon: 'search', device: 'doc', img: img('area-type'),
    deliverables: ['Homes for sale that match your brief', 'Each one priced against recent sales nearby', 'Flood risk, schools and the area for each'],
    format: 'A written shortlist by email',
  },
  'photo-refurb': {
    icon: 'camera', device: 'doc', img: img('epc'),
    deliverables: ['Send us the listing photos', 'A costed refurbishment, room by room', 'A range, with what drives the cost'],
    format: 'On screen and as a PDF',
  },
  agent: {
    icon: 'handshake', device: 'icon',
    deliverables: ['We search, view and check homes for you', 'We negotiate the price on your side', 'We manage the purchase through to completion'],
    format: 'Starts with a free call',
  },
  'deal-analyser': {
    icon: 'calculator', device: 'doc', img: img('rent'),
    deliverables: ['Rental yield and the cash left in the deal', 'What happens if rates or rents move', 'Based on local lettings and recent sales'],
    format: PDF,
  },
  hmo: {
    icon: 'rooms', device: 'doc', img: img('hmo'),
    deliverables: ['Whether you need planning for an HMO here', 'The licensing rules for the address', 'Room rents and housing allowance locally'],
    format: PDF,
  },
  'auction-lot': {
    icon: 'gavel', device: 'doc', img: img('legal-findings'),
    deliverables: ['What recent sales say the lot is worth', 'The highest bid the evidence supports', 'The legal pack read, with page references'],
    format: PDF,
  },
  'investor-pass': {
    icon: 'ticket', device: 'doc', img: img('comparables'),
    deliverables: ['Ten reports of any type', 'Use them within 30 days', 'One payment, nothing renews'],
    format: 'Each report on screen and as a PDF',
  },
  'pack-builder': {
    icon: 'briefcase', device: 'doc', img: img('valuation'),
    deliverables: ['A branded PDF pack you can send to investors', 'A one page summary for WhatsApp', 'Returns, recent sales and the area, each with its source'],
    format: 'PDF, ready in minutes',
  },
  'sourcer-pass': {
    icon: 'ticket', device: 'phone', img: img('leads-phone'),
    deliverables: ['Ten branded investor packs', 'Each week, homes in your area whose owners may want to sell', 'Letters ready to send to those owners'],
    format: '30 days for one payment',
  },
  offmarket: {
    icon: 'pin', device: 'phone', img: img('leads-phone'),
    deliverables: ['Each week, homes in your area whose owners may want to sell', 'Why each is listed: a licence ending, a refused plan, an auction date', 'The last recorded sale and a way to approach', 'Addresses only, never owner names'],
    format: 'A weekly list by email for 30 days',
  },
  'letter-kit': {
    icon: 'envelope', device: 'doc', img: img('planning'),
    deliverables: ['A ready letter for each reason an owner might sell', 'This week’s homes as a mail merge spreadsheet', 'Free with the Sourcer Pass'],
    format: 'Download each week for 30 days',
  },
  'demand-board': {
    icon: 'people', device: 'doc', img: img('area-type'),
    deliverables: ['What investors are looking for, area by area', 'Their strategy and budget', 'No names, ever'],
    format: 'Updated as new briefs come in',
  },
  'seller-leads': {
    icon: 'bell', device: 'phone', img: img('leads-phone'),
    deliverables: ['Homes in your patch whose owners may want to sell', 'Why each is listed: a licence ending, a permission lapsing, a failed auction', 'Which streets are busier than a year ago'],
    format: 'A weekly list by email for 30 days',
  },
  'market-brief': {
    icon: 'chart', device: 'doc', img: img('area-activity'),
    deliverables: ['A monthly brief with your branding', 'How busy each part of your patch is against a year ago', 'Recent sales and what is changing locally'],
    format: 'A PDF each month, ready to send',
  },
  'valuation-evidence': {
    icon: 'clipboard', device: 'doc', img: img('like-for-like'),
    deliverables: ['The recent sales that support your figure', 'The energy certificate and floor area', 'A one page area summary for your vendor'],
    format: 'PDF, ready in minutes',
  },
  'data-licence': {
    icon: 'grid', device: 'doc', img: img('area-activity'),
    deliverables: ['Sales and new energy certificates, district by district', 'How busy each postcode sector is against a year ago', 'As a spreadsheet, or a direct connection to your own systems'],
    format: 'Refreshed every month',
  },
  bespoke: {
    icon: 'compass', device: 'icon',
    deliverables: ['Who owns the freeholds and blocks in an area', 'Company owned homes and portfolios', 'A written report, scoped and priced before we start'],
    format: 'Delivered to an agreed date',
  },
};
