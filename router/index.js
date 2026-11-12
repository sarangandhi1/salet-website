/**
 * salet.uk router (11 Nov 2026): everything opens from salet.uk.
 *
 * The reports app (PackForge, on Render) and the site (Astro, on Cloudflare
 * Pages) are two programs. This Worker sits on salet.uk/* and sends each
 * request to the right one, so buyers only ever see salet.uk. The app's
 * paths are listed here; everything else is the site. Keep APP_PATHS in step
 * with public/sw.js and with the app's routes (packforge src/server.js,
 * src/pro.js).
 */
const APP_ORIGIN = 'https://packforge-0liu.onrender.com';
const SITE_ORIGIN = 'https://salet.pages.dev';

const APP_PATHS = /^\/(account|api|auth|checkout|decision-pack|healthz|intelligence|landlord|legal-pack|library|login|logout|operator|pay|pricing|privacy|pro|push|refund|report|sample|signup|terms|thanks|unsubscribe|watch|webhooks|deal-analyser|hmo-viability|auction-lot|home-search|photo-refurb|compare-homes)(\/|$)/;
// The app's own files. The site keeps /icons, /pixel.js (the same file),
// /sw.js (one worker for both), /offline.html, /manifest.webmanifest and /robots.txt.
const APP_FILES = /^\/(app\.css|app\.js|wallet\.js|img\/|fonts\/|\.well-known\/apple-developer-merchantid-domain-association$)/;

export const isApp = (pathname) => APP_PATHS.test(pathname) || APP_FILES.test(pathname);

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const toApp = isApp(url.pathname);
    const target = new URL(url.pathname + url.search, toApp ? APP_ORIGIN : SITE_ORIGIN);
    const headers = new Headers(request.headers);
    headers.delete('host');
    if (toApp) {
      // The app limits guest orders per connection and builds links on salet.uk.
      headers.set('x-forwarded-for', request.headers.get('cf-connecting-ip') || '');
      headers.set('x-forwarded-host', url.host);
      headers.set('x-forwarded-proto', 'https');
    }
    const init = {
      method: request.method,
      headers,
      body: ['GET', 'HEAD'].includes(request.method) ? undefined : request.body,
      redirect: 'manual',
    };
    const res = await fetch(target, init);
    // A redirect the origin builds on its own address is turned back to salet.uk.
    const loc = res.headers.get('location');
    if (loc && (loc.startsWith(APP_ORIGIN) || loc.startsWith(SITE_ORIGIN) || loc.startsWith('https://reports.salet.uk'))) {
      const out = new Response(res.body, res);
      const l = new URL(loc);
      out.headers.set('location', `https://salet.uk${l.pathname}${l.search}`);
      return out;
    }
    return res;
  },
};
