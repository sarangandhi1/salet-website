// Land Registry Price Paid relay for the report engine. The register's CDN
// refuses Render's addresses (403 since about 28 Oct 2026), so the engine
// asks here instead. It passes one read-only query on public Open Government
// Licence data through and nothing else, so it needs no key.
const ORIGIN = 'https://landregistry.data.gov.uk/data/ppi/transaction-record.json';

export async function onRequestGet({ request }) {
  const url = new URL(request.url);
  const postcode = (url.searchParams.get('propertyAddress.postcode') || '').trim().toUpperCase();
  if (!/^[A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}$/.test(postcode)) return new Response('postcode required', { status: 400 });
  const upstream = new URL(ORIGIN);
  upstream.searchParams.set('propertyAddress.postcode', postcode);
  upstream.searchParams.set('_pageSize', String(Math.min(Number(url.searchParams.get('_pageSize')) || 200, 200)));
  if (url.searchParams.get('_sort') === '-transactionDate') upstream.searchParams.set('_sort', '-transactionDate');
  const r = await fetch(upstream, { headers: { Accept: 'application/json', 'User-Agent': 'Salet/1.0 (+https://salet.uk; saran@salet.uk)' } });
  return new Response(r.body, { status: r.status, headers: { 'Content-Type': r.headers.get('Content-Type') || 'application/json', 'Cache-Control': 'no-store' } });
}
