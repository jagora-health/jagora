var CACHE_NAME = 'jagora-v3';
var FILES_TO_CACHE = [
  'index.html',
  'style.css',
  'manifest.json',
  'icons/icon-192.png',
  'icons/icon-512.png',
  'jagora-counselling.mp4', 
  'counsel-audio/faq-1.mp3', 
  'counsel-audio/faq-2.mp3', 
  'counsel-audio/faq-3.mp3',
  'danger-signs.jpg'
];

// INSTALL: cache the core files so the app works offline
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// ACTIVATE: clean up any old caches from previous versions
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(keys.map(function(key) {
        if (key !== CACHE_NAME) {
          return caches.delete(key);
        }
      }));
    })
  );
  self.clients.claim();
});

// FETCH: serve from cache first (offline-capable), fall back to network
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request);
    })
  );
});