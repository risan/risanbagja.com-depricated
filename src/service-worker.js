const CACHE_NAME = 'offline-v1';
const OFFLINE_URL = 'offline.html';
const CACHE_URLS = ['/', OFFLINE_URL];

const isNavigationRequest = request => request.mode === 'navigate' ||
  (request.method === 'GET' && request.headers.get('accept').includes('text/html'));

self.addEventListener('install', event => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then(cache => cache.addAll(CACHE_URLS))
      .then(() => {
        // Force the service worker to become active immediatelly
        return self.skipWaiting()
      })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches
      .keys()
      .then(keys => keys.filter(key => key !== CACHE_NAME))
      .then(invalidKeys =>
        Promise.all(invalidKeys.map(key => caches.delete(key))))
      .then(() => {
        // Immediatelly set the service worker as the controller for all of the
        // clients(pages) that matches the scope
        return self.clients.claim();
      })
  );
});

self.addEventListener('fetch', event => {
  // Skip URL from another origin
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  event.respondWith(
    caches
      .match(event.request)
      .then(cachedResponse => {
        if (cachedResponse) {
          return cachedResponse;
        }

        return fetch(event.request).then(response => {
          return response;
        }).catch(err => {
          if (isNavigationRequest(event.request)) {
            return caches.match(OFFLINE_URL);
          }
        });
      })
  );
});
