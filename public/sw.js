const STATIC_CACHE = 'palooza-static-v1';
const PAGE_CACHE = 'palooza-pages-v1';

const PRECACHE_URLS = [
  '/',
  '/home',
  '/manifest.webmanifest',
  '/favicon.ico',
  '/apple-icon',
  '/icon/192',
  '/icon/512',
  '/event-1.jpg',
  '/event-2.jpg',
  '/event-3.jpg',
  '/event-4.jpg',
];

const STATIC_ASSET_PATTERN =
  /\.(?:avif|gif|ico|jpeg|jpg|js|css|png|svg|webp|woff|woff2)$/i;

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => ![STATIC_CACHE, PAGE_CACHE].includes(key))
            .map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

async function networkFirst(request) {
  const cache = await caches.open(PAGE_CACHE);

  try {
    const response = await fetch(request);

    if (response.ok) {
      cache.put(request, response.clone());
    }

    return response;
  } catch {
    return (
      (await cache.match(request)) ||
      (await caches.match(request)) ||
      (await cache.match('/home')) ||
      caches.match('/')
    );
  }
}

async function staleWhileRevalidate(request) {
  const cache = await caches.open(STATIC_CACHE);
  const cachedResponse = await cache.match(request);

  const networkResponse = fetch(request)
    .then((response) => {
      if (response.ok) {
        cache.put(request, response.clone());
      }

      return response;
    })
    .catch(() => cachedResponse);

  return cachedResponse || networkResponse;
}

self.addEventListener('fetch', (event) => {
  const { request } = event;

  if (request.method !== 'GET') {
    return;
  }

  const url = new URL(request.url);

  if (url.origin !== self.location.origin) {
    return;
  }

  if (url.pathname.startsWith('/api/') || url.pathname === '/sw.js') {
    return;
  }

  if (request.mode === 'navigate') {
    event.respondWith(networkFirst(request));
    return;
  }

  if (
    url.pathname.startsWith('/_next/static/') ||
    url.pathname.startsWith('/_next/image') ||
    url.pathname === '/manifest.webmanifest' ||
    STATIC_ASSET_PATTERN.test(url.pathname)
  ) {
    event.respondWith(staleWhileRevalidate(request));
  }
});
