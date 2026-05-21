// Nikkarien Oy — Hinnasto 2026 — Service Worker
//
// HUOM JARMO: kun julkaiset uuden version GitHub-repoosi, päivitä
// CACHE_VERSION (esim. v1 → v2). Se on se, mikä saa kollegoiden
// puhelimet lataamaan uuden hinnastoversion automaattisesti.

const CACHE_VERSION = 'nikkarien-hinnasto-v2';

const APP_SHELL = [
  './',
  './index.html',
  './Hinnasto_2026_FI_EN_ver3.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
];

// INSTALL: esitäytä sovelluksen runko välimuistiin
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) => {
      return cache.addAll(APP_SHELL.map((u) => new Request(u, { cache: 'reload' })));
    }).then(() => self.skipWaiting())
  );
});

// ACTIVATE: siivoa vanhat välimuistit
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_VERSION).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// FETCH: stale-while-revalidate HTML:lle, cache-first muille
self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  if (req.mode === 'navigate' || req.destination === 'document'
      || url.pathname.endsWith('.html') || url.pathname.endsWith('/')) {
    event.respondWith(staleWhileRevalidate(req));
    return;
  }

  event.respondWith(cacheFirst(req));
});

async function staleWhileRevalidate(req) {
  const cache = await caches.open(CACHE_VERSION);
  const cached = await cache.match(req, { ignoreSearch: true });

  const network = fetch(req).then((res) => {
    if (res && res.status === 200 && (res.type === 'basic' || res.type === 'default')) {
      cache.put(req, res.clone()).catch(() => {});
    }
    return res;
  }).catch(() => null);

  return cached || (await network) || new Response('Offline', { status: 503, statusText: 'Offline' });
}

async function cacheFirst(req) {
  const cache = await caches.open(CACHE_VERSION);
  const cached = await cache.match(req, { ignoreSearch: true });
  if (cached) return cached;
  try {
    const res = await fetch(req);
    if (res && res.status === 200 && (res.type === 'basic' || res.type === 'default')) {
      cache.put(req, res.clone()).catch(() => {});
    }
    return res;
  } catch (e) {
    return new Response('Offline resource missing', { status: 503, statusText: 'Offline' });
  }
}

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
