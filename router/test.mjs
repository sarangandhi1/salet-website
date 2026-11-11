import { isApp } from './index.js';
const app = ['/intelligence','/checkout/intelligence_basic','/report/abc','/pro/investor-pack','/app.css','/img/products/x.jpg','/.well-known/apple-developer-merchantid-domain-association','/webhooks/revolut','/compare-homes','/terms','/auth/link'];
const site = ['/','/reports/','/reports/buyer-intelligence/','/check/','/icons/icon-192.png','/sw.js','/robots.txt','/images/products/intelligence.jpg','/_astro/x.css','/about/','/intelligence-guide','/reportsx'];
let bad = app.filter(p=>!isApp(p)).concat(site.filter(p=>isApp(p)));
console.log(bad.length ? 'WRONG: '+bad.join(' ') : 'routing ok');
