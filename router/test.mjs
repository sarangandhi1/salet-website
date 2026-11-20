import { isApp, aiHit } from './index.js';
const app = ['/intelligence','/checkout/intelligence_basic','/report/abc','/pro/investor-pack','/app.css','/img/products/x.jpg','/.well-known/apple-developer-merchantid-domain-association','/webhooks/revolut','/compare-homes','/terms','/auth/link'];
const site = ['/','/reports/','/reports/buyer-intelligence/','/check/','/icons/icon-192.png','/sw.js','/robots.txt','/images/products/intelligence.jpg','/_astro/x.css','/about/','/intelligence-guide','/reportsx'];
let bad = app.filter(p=>!isApp(p)).concat(site.filter(p=>isApp(p)));
console.log(bad.length ? 'WRONG: '+bad.join(' ') : 'routing ok');

const u = (s) => new URL('https://salet.uk' + s);
const hit = (...a) => { const h = aiHit(...a); return h ? `${h.kind} ${h.source} ${h.path}` : 'none'; };
const cases = [
  [hit('GET', u('/reports/'), 'https://chatgpt.com/', 'Mozilla/5.0'), 'visit chatgpt /reports/'],
  [hit('GET', u('/area/e15/?utm_source=chatgpt.com'), null, 'Mozilla/5.0'), 'visit chatgpt /area/e15/'],
  [hit('GET', u('/check/?utm_source=perplexity'), '', 'Mozilla/5.0'), 'visit perplexity /check/'],
  [hit('GET', u('/'), 'https://www.perplexity.ai/search/x', 'Mozilla/5.0'), 'visit perplexity /'],
  [hit('GET', u('/'), 'https://claude.ai/chat/1', 'Mozilla/5.0'), 'visit claude /'],
  [hit('GET', u('/insights/'), null, 'Mozilla/5.0 AppleWebKit; compatible; ChatGPT-User/1.0; +https://openai.com/bot'), 'read chatgpt /insights/'],
  [hit('GET', u('/'), null, 'Mozilla/5.0 (compatible; ClaudeBot/1.0)'), 'read claude /'],
  [hit('GET', u('/'), 'https://www.google.com/', 'Mozilla/5.0'), 'none'],
  [hit('GET', u('/?utm_source=facebook'), null, 'Mozilla/5.0'), 'none'],
  [hit('GET', u('/'), 'https://notchatgpt.com.evil.example/', 'Mozilla/5.0'), 'none'],
  [hit('GET', u('/app.css'), 'https://chatgpt.com/', 'Mozilla/5.0'), 'none'],
  [hit('GET', u('/api/x'), 'https://chatgpt.com/', 'Mozilla/5.0'), 'none'],
  [hit('POST', u('/intelligence'), 'https://chatgpt.com/', 'Mozilla/5.0'), 'none'],
  [hit('GET', u('/'), 'not a url', 'Mozilla/5.0'), 'none'],
];
const wrong = cases.filter(([got, want]) => got !== want);
console.log(wrong.length ? 'WRONG: ' + wrong.map(([g, w]) => `${g} (wanted ${w})`).join('; ') : 'ai visits ok');
if (bad.length || wrong.length) process.exit(1);
