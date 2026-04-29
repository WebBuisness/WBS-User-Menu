// Service Worker for WBS Menu Demo PWA

const CACHE_NAME = 'wbs-menu-demo-v1';
const OFFLINE_URL = '/offline.html';

// === INSTALL ===
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.add(OFFLINE_URL))
  );
  self.skipWaiting();
});

// === ACTIVATE ===
self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

// === FETCH (offline fallback) ===
self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => caches.match(OFFLINE_URL))
    );
  }
});
