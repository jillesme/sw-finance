const version = '0.1';

self.addEventListener('install', function (ev) {
  ev.waitUntil(
    caches.open(`file-cache-v${version}`)
    .then(function (cache) {
      return cache.addAll([
        '/',
        '/static/js/bundle.js'
      ]);
    })
  ); 
});

self.addEventListener('fetch', function (ev) {
  ev.respondWith(
    caches.match(ev.request)
    .then(function (response) {
      if (response) {
        return response;
      }
      return fetch(ev.request);
    })
  );
});
