var CACHE_NAME = 'jagora-v7';

// Small core files — must all cache for the app to work offline
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

// INSTALL: cache core files reliably, and attempt the video tolerantly
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(CORE_FILES).then(function() {
        // try to cache the video now, but don't fail install if it's slow/offline
        return cache.add('jagora-counselling.mp4').catch(function() {
          console.log('Video will cache on first play instead.');
        });
      });
    })
  );
  self.skipWaiting();
});

// ACTIVATE: remove old caches from previous versions
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

// Is this a heavy media file? (cache-first so it plays fast + offline)
function isMedia(url) {
  return url.endsWith('.mp4') || url.endsWith('.mp3') ||
         url.endsWith('.jpg') || url.endsWith('.png');
}

// FETCH
self.addEventListener('fetch', function(event) {
  var url = event.request.url;

  if (isMedia(url)) {
    // MEDIA: cache-first. If not cached yet, fetch, play, AND store it for offline.
    event.respondWith(
      caches.match(event.request).then(function(cached) {
        if (cached) { return cached; }
        return fetch(event.request).then(function(resp) {
          var copy = resp.clone();
          caches.open(CACHE_NAME).then(function(c) { c.put(event.request, copy); });
          return resp;
        });
      })
    );
  } else {
    // APP CODE: network-first (always fresh when online), fall back to cache offline
    event.respondWith(
      fetch(event.request).then(function(resp) {
        var copy = resp.clone();
        caches.open(CACHE_NAME).then(function(c) { c.put(event.request, copy); });
        return resp;
      }).catch(function() {
        return caches.match(event.request);
      })
    );
  }
});