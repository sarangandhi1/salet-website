import data from '../data/area_activity.json';

// Monthly export from DealForge's Demand Engine: EPC lodgements per postcode
// sector, ranked within their postcode area. An activity call only. Nothing
// here is a price call, and the copy built on it must never read as one.

export interface Sector {
  sector: string;
  score: number;
  change_pct: number;
  call: 'busier' | 'quieter';
  strength: 'strong' | 'moderate' | 'weak';
  sentence: string;
}

export interface District {
  district: string;
  area: string;
  score: number;
  call: 'busier' | 'quieter';
  busier_sectors: number;
  sectors: Sector[];
}

export const activity = data as {
  as_of: string;
  built: string;
  source: string;
  accuracy: string;
  districts: Record<string, District>;
};

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
const [year, month] = activity.as_of.split('-').map(Number);
export const asOfLong = `${MONTHS[month - 1]} ${year}`;
export const asOfShort = `${MONTHS[month - 1].slice(0, 3)} ${year}`;

// Postcode area names, the main town or district each area is named after.
export const AREA_NAMES: Record<string, string> = {
  AL: 'St Albans', B: 'Birmingham', BA: 'Bath', BB: 'Blackburn', BD: 'Bradford',
  BH: 'Bournemouth', BL: 'Bolton', BN: 'Brighton', BR: 'Bromley', BS: 'Bristol',
  CA: 'Carlisle', CB: 'Cambridge', CH: 'Chester', CM: 'Chelmsford', CO: 'Colchester',
  CR: 'Croydon', CT: 'Canterbury', CV: 'Coventry', CW: 'Crewe', DA: 'Dartford',
  DE: 'Derby', DH: 'Durham', DL: 'Darlington', DN: 'Doncaster', DT: 'Dorchester',
  DY: 'Dudley', E: 'East London', EC: 'East Central London', EN: 'Enfield', EX: 'Exeter',
  FY: 'Blackpool', GL: 'Gloucester', GU: 'Guildford', HA: 'Harrow', HD: 'Huddersfield',
  HG: 'Harrogate', HP: 'Hemel Hempstead', HR: 'Hereford', HU: 'Hull', HX: 'Halifax',
  IG: 'Ilford', IP: 'Ipswich', KT: 'Kingston upon Thames', L: 'Liverpool', LA: 'Lancaster',
  LE: 'Leicester', LN: 'Lincoln', LS: 'Leeds', LU: 'Luton', M: 'Manchester',
  ME: 'Medway', MK: 'Milton Keynes', N: 'North London', NE: 'Newcastle upon Tyne',
  NG: 'Nottingham', NN: 'Northampton', NR: 'Norwich', NW: 'North West London',
  OL: 'Oldham', OX: 'Oxford', PE: 'Peterborough', PL: 'Plymouth', PO: 'Portsmouth',
  PR: 'Preston', RG: 'Reading', RH: 'Redhill', RM: 'Romford', S: 'Sheffield',
  SE: 'South East London', SG: 'Stevenage', SK: 'Stockport', SL: 'Slough', SM: 'Sutton',
  SN: 'Swindon', SO: 'Southampton', SP: 'Salisbury', SR: 'Sunderland', SS: 'Southend on Sea',
  ST: 'Stoke on Trent', SW: 'South West London', SY: 'Shrewsbury', TA: 'Taunton',
  TF: 'Telford', TN: 'Tonbridge', TQ: 'Torquay', TR: 'Truro', TS: 'Cleveland',
  TW: 'Twickenham', UB: 'Southall', W: 'West London', WA: 'Warrington', WC: 'West Central London',
  WD: 'Watford', WF: 'Wakefield', WN: 'Wigan', WR: 'Worcester', WS: 'Walsall',
  WV: 'Wolverhampton', YO: 'York',
};

export const areaName = (area: string) => AREA_NAMES[area] ?? area;

// Natural postcode order: CV1, CV2 ... CV10, then letter suffixes (EC1A, EC1M).
export function compareDistricts(a: string, b: string) {
  const pa = a.match(/^([A-Z]+)(\d+)([A-Z]?)$/);
  const pb = b.match(/^([A-Z]+)(\d+)([A-Z]?)$/);
  if (!pa || !pb) return a.localeCompare(b);
  return (
    pa[1].localeCompare(pb[1]) ||
    Number(pa[2]) - Number(pb[2]) ||
    pa[3].localeCompare(pb[3])
  );
}

export const allDistricts = Object.values(activity.districts).sort((x, y) =>
  compareDistricts(x.district, y.district)
);

export function districtsByArea() {
  const groups = new Map<string, District[]>();
  for (const d of allDistricts) {
    if (!groups.has(d.area)) groups.set(d.area, []);
    groups.get(d.area)!.push(d);
  }
  return [...groups.entries()].sort(([a], [b]) => a.localeCompare(b));
}

export const slug = (district: string) => district.toLowerCase();
