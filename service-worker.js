var CACHE_NAME = 'jagora-v6';
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

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(FILES_TO_CACHE);
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

// Heavy media that rarely changes → cache-first (fast + offline)
function isMedia(url) {
  return url.endsWith('.mp4') || url.endsWith('.mp3') ||
         url.endsWith('.jpg') || url.endsWith('.png');
}

self.addEventListener('fetch', function(event) {
  var url = event.request.url;

  if (isMedia(url)) {
    // cache-first for media
    event.respondWith(
      caches.match(event.request).then(function(cached) {
        return cached || fetch(event.request).then(function(resp) {
          var copy = resp.clone();
          caches.open(CACHE_NAME).then(function(c) { c.put(event.request, copy); });
          return resp;
        });
      })
    );
  } else {
    // network-first for app code (index.html, etc.) → always fresh when online
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