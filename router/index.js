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

// --- visits from AI tools (20 Nov 2026) ------------------------------------
// One row per page an AI tool sends a person to ('visit') or fetches itself
// ('read'), written to the app's database with its publishable key (packforge
// migration 031). Only the tool's name and the page path are kept. Never in
// the way of the page: it runs after the response and a failure is dropped.
const AI_SITES = [
  [/(^|\.)(chatgpt\.com|chat\.openai\.com|openai\.com)$/, 'chatgpt'],
  [/(^|\.)perplexity\.ai$/, 'perplexity'],
  [/(^|\.)claude\.ai$/, 'claude'],
  [/^gemini\.google\.com$/, 'gemini'],
  [/^copilot\.microsoft\.com$/, 'copilot'],
  [/(^|\.)(grok\.com|x\.ai)$/, 'grok'],
  [/(^|\.)meta\.ai$/, 'meta'],
  [/(^|\.)deepseek\.com$/, 'deepseek'],
  [/(^|\.)mistral\.ai$/, 'mistral'],
  [/(^|\.)you\.com$/, 'you'],
  [/(^|\.)phind\.com$/, 'phind'],
];
const AI_AGENTS = [
  [/ChatGPT-User|OAI-SearchBot|GPTBot/i, 'chatgpt'],
  [/Perplexity-User|PerplexityBot/i, 'perplexity'],
  [/Claude-User|Claude-SearchBot|ClaudeBot|anthropic-ai/i, 'claude'],
  [/MistralAI-User/i, 'mistral'],
  [/meta-externalagent|meta-externalfetcher/i, 'meta'],
  [/DuckAssistBot/i, 'duckduckgo'],
];
const siteOf = (host) => (AI_SITES.find(([re]) => re.test(host)) || [])[1] || null;

/** { kind, source, path } when this page request came from an AI tool, else null. */
export function aiHit(method, url, referer, userAgent) {
  if (method !== 'GET') return null;
  // Pages only: nothing with a file extension, and not the app's plumbing.
  if (/\.[a-z0-9]{2,5}$/i.test(url.pathname) || /^\/(api|webhooks|healthz|auth|push)(\/|$)/.test(url.pathname)) return null;
  const path = url.pathname.slice(0, 200);
  const agent = (AI_AGENTS.find(([re]) => re.test(userAgent || '')) || [])[1];
  if (agent) return { kind: 'read', source: agent, path };
  let source = null;
  try {
    if (referer) source = siteOf(new URL(referer).hostname.toLowerCase());
  } catch { /* not a URL */ }
  // ChatGPT and others tag their links, which survives a stripped referrer.
  if (!source) {
    const tag = (url.searchParams.get('utm_source') || '').toLowerCase().replace(/^www\./, '');
    if (tag) source = siteOf(tag) || siteOf(`${tag}.com`) || siteOf(`${tag}.ai`);
  }
  return source ? { kind: 'visit', source, path } : null;
}

const recordAi = (env, hit) => fetch(`${env.SUPABASE_URL}/rest/v1/ai_visits`, {
  method: 'POST',
  headers: {
    apikey: env.SUPABASE_KEY,
    authorization: `Bearer ${env.SUPABASE_KEY}`,
    'content-type': 'application/json',
    prefer: 'return=minimal',
  },
  body: JSON.stringify(hit),
}).catch(() => {});

export default {
  async fetch(request, env, ctx) {
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
    try {
      if (env?.SUPABASE_URL && env?.SUPABASE_KEY && res.status === 200 && (res.headers.get('content-type') || '').includes('text/html')) {
        const hit = aiHit(request.method, url, request.headers.get('referer'), request.headers.get('user-agent'));
        if (hit) ctx.waitUntil(recordAi(env, hit));
      }
    } catch { /* counting never breaks a page */ }
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
