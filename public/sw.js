// salet.uk service worker, for the site and the reports app together since
// 11 Nov 2026, when the app moved behind salet.uk (router/). Every page is
// fetched fresh from the network first, so a deploy shows at once. Only the
// site's own pages are kept for when there is no signal: app pages (reports,
// previews, checkout, payment, accounts) and every POST are never cached and
// never answered from a cache; with no signal they get the offline page.
// Street alerts (push) arrive here too.
const VERSION = 'salet-v3';
const SHELL = ['/offline.html', '/for/home-buyers/', '/favicon.svg', '/icons/icon-192.png'];

// The app's paths: the same list the router sends to the app.
const APP = /^\/(account|api|auth|checkout|decision-pack|healthz|intelligence|legal-pack|library|login|logout|operator|pay|pricing|privacy|pro|push|refund|report|sample|signup|terms|thanks|unsubscribe|watch|webhooks|deal-analyser|hmo-viability|auction-lot|home-search|photo-refurb|compare-homes)(\/|$)/;

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(VERSION).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

const isStatic = (url) => url.pathname.startsWith('/_astro/') || url.pathname.startsWith('/images/')
  || url.pathname.startsWith('/icons/') || url.pathname.startsWith('/og/') || url.pathname === '/favicon.svg';
// The app's own files change without a new name, so they are fetched fresh
// and the cached copy is only for when there is no signal.
const isAppStatic = (url) => /^\/(app\.css|app\.js|wallet\.js|img\/|fonts\/)/.test(url.pathname);

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  if (req.mode === 'navigate') {
    if (APP.test(url.pathname)) {
      event.respondWith(fetch(req).catch(() => caches.match('/offline.html')));
      return;
    }
    // Network first. A site page that loads is kept for the next time there is no signal.
    event.respondWith(
      fetch(req)
        .then((res) => {
          // A redirected page cannot be replayed to a navigation, so it is not kept.
          if (res.ok && !res.redirected) { const copy = res.clone(); caches.open(VERSION).then((c) => c.put(req, copy)); }
          return res;
        })
        .catch(() => caches.match(req).then((hit) => hit || caches.match('/offline.html')))
    );
    return;
  }

  if (isStatic(url)) {
    // Astro's files are content-hashed, so a cached copy is never stale.
    event.respondWith(
      caches.match(req).then((hit) => hit || fetch(req).then((res) => {
        if (res.ok) { const copy = res.clone(); caches.open(VERSION).then((c) => c.put(req, copy)); }
        return res;
      }))
    );
    return;
  }

  if (isAppStatic(url)) {
    event.respondWith(
      fetch(req)
        .then((res) => {
          if (res.ok) { const copy = res.clone(); caches.open(VERSION).then((c) => c.put(req, copy)); }
          return res;
        })
        .catch(() => caches.match(req))
    );
  }
});

self.addEventListener('push', (event) => {
  let alert = {};
  try { alert = event.data ? event.data.json() : {}; } catch (e) { alert = { body: event.data && event.data.text() }; }
  event.waitUntil(self.registration.showNotification(alert.title || 'Salet', {
    body: alert.body || '',
    icon: '/icons/icon-192.png',
    badge: '/icons/icon-192.png',
    tag: alert.tag,
    data: { url: alert.url || '/watch' },
  }));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const target = new URL(event.notification.data && event.notification.data.url || '/watch', self.location.origin).href;
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((list) => {
      for (const c of list) {
        if (c.url === target && 'focus' in c) return c.focus();
      }
      return self.clients.openWindow(target);
    })
  );
});
