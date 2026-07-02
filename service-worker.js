var CACHE_NAME = 'jagora-v11';

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

// INSTALL: cache core files, then fetch the FULL video and cache it.
// Tell the app when everything (incl. video) is truly ready offline.
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(CORE_FILES).then(function() {
        return fetch('jagora-counselling.mp4', { cache: 'reload' })
          .then(function(resp) { return cache.put('jagora-counselling.mp4', resp); })
          .catch(function() { console.log('Video will cache on next online load.'); });
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

// Let the page ask "is the video cached yet?"
self.addEventListener('message', function(event) {
  if (event.data === 'check-video') {
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.match('jagora-counselling.mp4');
    }).then(function(hit) {
      if (event.source) { event.source.postMessage(hit ? 'video-ready' : 'video-missing'); }
    });
  }
});

self.addEventListener('fetch', function(event) {
  var url = event.request.url;

  // VIDEO: always serve full cached copy (ignore range/streaming)
  if (url.indexOf('jagora-counselling.mp4') !== -1) {
    event.respondWith(
      caches.open(CACHE_NAME).then(function(cache) {
        return cache.match('jagora-counselling.mp4').then(function(cached) {
          if (cached) { return cached; }
          return fetch('jagora-counselling.mp4', { cache: 'reload' }).then(function(resp) {
            cache.put('jagora-counselling.mp4', resp.clone());
            return resp;
          });
        });
      })
    );
    return;
  }

  // EVERYTHING ELSE: cache-first (offline-first). Update cache in background if online.
  event.respondWith(
    caches.match(event.request).then(function(cached) {
      var networkFetch = fetch(event.request).then(function(resp) {
        var copy = resp.clone();
        caches.open(CACHE_NAME).then(function(c) { c.put(event.request, copy); });
        return resp;
      }).catch(function() { return cached; });
      return cached || networkFetch;
    })
  );
});