// Where each site lives, so salet.uk and Salet Pro can link to each other.
// Preview builds point at the preview deployments instead:
//   PUBLIC_SALET_URL=https://preview.salet.pages.dev PUBLIC_PRO_URL=https://preview.salet-pro.pages.dev
export const SALET_URL: string = import.meta.env.PUBLIC_SALET_URL ?? 'https://salet.uk';
export const PRO_URL: string = import.meta.env.PUBLIC_PRO_URL ?? 'https://pro.salet.uk';

export interface AudienceLink {
  key: string;
  label: string; // tab label
  choose: string; // chooser tile title, in the visitor's words
  hook: string;
  href: string;
  art: string; // /images/art/<art>-800.webp
}

// salet.uk: every kind of visitor finds their category first. Sourcers and
// estate agents are served by Salet Pro.
export const SALET_AUDIENCE_LINKS: AudienceLink[] = [
  { key: 'home-buyers', label: 'Home buyers', choose: 'I’m buying a home', hook: 'Know what to pay before you offer', href: '/for/home-buyers', art: 'who-home-buyer' },
  { key: 'investors', label: 'Investors', choose: 'I’m an investor', hook: 'Run the numbers in minutes', href: '/for/investors', art: 'who-investor' },
  { key: 'sourcers', label: 'Deal sourcers', choose: 'I source deals', hook: 'Find and package deals first', href: `${PRO_URL}/sourcers`, art: 'who-sourcer' },
  { key: 'agents', label: 'Estate agents', choose: 'I’m an estate agent', hook: 'Win instructions before rivals', href: `${PRO_URL}/agents`, art: 'who-agent' },
];

// Salet Pro's own chooser and tab bar.
export const PRO_AUDIENCE_LINKS: AudienceLink[] = [
  { key: 'sourcers', label: 'Deal sourcers', choose: 'I source deals', hook: 'Find and package deals first', href: '/sourcers', art: 'who-sourcer' },
  { key: 'agents', label: 'Estate agents', choose: 'I’m an estate agent', hook: 'Win instructions before rivals', href: '/agents', art: 'who-agent' },
  { key: 'data', label: 'Data & research', choose: 'I need data', hook: 'Every district, every month', href: '/pricing#data', art: 'area-data-licence' },
];

// Card payment for fees (buying agent, sourcing): PackForge serves the page.
export const PAY_INVOICE_URL = 'https://reports.salet.uk/pay';
