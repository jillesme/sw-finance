const version = '0.1';

self.addEventListener('install', function (ev) {
  return;
  ev.waitUntil(
    caches.open(`file-cache-v${version}`)
    .then(function (cache) {
      return cache.addAll([
        '/'
      ]);
    })
  );
});

self.addEventListener('fetch', function (ev) {
  return fetch(ev.request);
  // this is shite for dev
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
