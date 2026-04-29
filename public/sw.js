// Service Worker for WBS Menu Demo PWA
const CACHE_NAME = 'wbs-menu-v2';
const STATIC_ASSETS = [
  '/',
  '/offline.html',
  '/manifest.json',
  '/icon.svg',
  '/globals.css',
];

// === INSTALL ===
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Opened cache');
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// === ACTIVATE ===
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// === FETCH ===
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // For HTML navigations, try network first, then cache, then offline page
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(() => {
        return caches.match(request).then((response) => {
          return response || caches.match('/offline.html');
        });
      })
    );
    return;
  }

  // For other requests (images, scripts, etc.)
  event.respondWith(
    caches.match(request).then((response) => {
      // Return cached version if found
      if (response) return response;

      // Otherwise fetch from network and cache for next time (Stale-While-Revalidate-ish)
      return fetch(request).then((networkResponse) => {
        // Don't cache if not a success or if it's a POST etc.
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
          return networkResponse;
        }

        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(request, responseToCache);
        });

        return networkResponse;
      }).catch(() => {
        // If fetch fails and we have no cache, just fail (or return placeholder for images)
        if (request.destination === 'image') {
          // Could return a placeholder here
        }
      });
    })
  );
});
