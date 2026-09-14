// Nativa PWA Service Worker (Android 13 / WebAPK Compatible)
const CACHE_NAME = 'nativa-v1.0.1';
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/producto.html',
  '/contact.html',
  '/css/style.css',
  '/js/products.js',
  '/js/cart.js',
  '/js/video-player.js',
  '/manifest.json',
  '/img/icon-192.png',
  '/img/icon-512.png',
  '/img/icon-maskable-192.png',
  '/img/icon-maskable-512.png',
  '/img/portfolio/LogoNativa.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_URLS).catch((err) => {
        console.warn('Pre-cache item failed, continuing:', err);
      });
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_NAME) {
            return caches.delete(name);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return;
  
  const url = new URL(event.request.url);
  // Avoid caching foreign cross-origin video streaming chunks or analytics
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Return cached asset if found, but also refresh in background (Stale-While-Revalidate)
      const fetchPromise = fetch(event.request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      }).catch(() => {
        // Network failed, nothing to update
      });

      return cachedResponse || fetchPromise;
    })
  );
});
