// salet.uk service worker. Offline shell and static files only. Every page
// is fetched fresh from the network first, so a deploy shows at once; the
// cached copy is only for when there is no signal. Nothing from
// reports.salet.uk (previews, reports, payments) is ever touched: those are
// another origin and go straight to the network.
const VERSION = 'salet-v1';
const SHELL = ['/offline.html', '/for/home-buyers', '/favicon.svg', '/icons/icon-192.png'];

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

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  if (req.mode === 'navigate') {
    // Network first. A page that loads is kept for the next time there is no signal.
    event.respondWith(
      fetch(req)
        .then((res) => {
          if (res.ok) { const copy = res.clone(); caches.open(VERSION).then((c) => c.put(req, copy)); }
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
  }
});
