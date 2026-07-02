var CACHE_NAME = 'jagora-v9';

var CORE_FILES = [
  'index.html',
  'style.css',
  'manifest.json',
  'icons/icon-192.png',
  'icons/icon-512.png',
  'danger-signs.jpg',
  'counsel-audio/faq-1.mp3',
  'counsel-audio/faq-2.mp3',
  'counsel-audio/faq-3.mp3'
];

// INSTALL: cache core files, then fetch the FULL video explicitly and cache it
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(CORE_FILES).then(function() {
        // fetch the whole video (not a range request) so it can be cached for offline
        return fetch('jagora-counselling.mp4', { cache: 'reload' })
          .then(function(resp) {
            return cache.put('jagora-counselling.mp4', resp);
          })
          .catch(function() {
            console.log('Video fetch failed at install; will retry on next load.');
          });
      });
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(keys.map(function(key) {
        if (key !== CACHE_NAME) { return caches.delete(key); }
      }));
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', function(event) {
  var url = event.request.url;

  // VIDEO: always serve the full cached copy (ignore range headers)
  if (url.indexOf('jagora-counselling.mp4') !== -1) {
    event.respondWith(
      caches.open(CACHE_NAME).then(function(cache) {
        return cache.match('jagora-counselling.mp4').then(function(cached) {
          if (cached) { return cached; }
          // not cached yet → fetch full, cache it, return it
          return fetch('jagora-counselling.mp4', { cache: 'reload' }).then(function(resp) {
            cache.put('jagora-counselling.mp4', resp.clone());
            return resp;
          });
        });
      })
    );
    return;
  }

  // OTHER MEDIA: cache-first
  if (url.endsWith('.mp3') || url.endsWith('.jpg') || url.endsWith('.png')) {
    event.respondWith(
      caches.match(event.request).then(function(cached) {
        return cached || fetch(event.request).then(function(resp) {
          var copy = resp.clone();
          caches.open(CACHE_NAME).then(function(c) { c.put(event.request, copy); });
          return resp;
        });
      })
    );
    return;
  }

  // APP CODE: network-first (fresh when online), cache fallback offline
  event.respondWith(
    fetch(event.request).then(function(resp) {
      var copy = resp.clone();
      caches.open(CACHE_NAME).then(function(c) { c.put(event.request, copy); });
      return resp;
    }).catch(function() {
      return caches.match(event.request);
    })
  );
});