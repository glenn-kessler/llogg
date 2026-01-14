/**
 * Service Worker for PWA functionality (Subfolder version)
 * Configured for /llogg/ subdirectory
 * Provides offline capability and caching
 */

const CACHE_NAME = 'life-logger-v2-llogg';
const BASE_PATH = '/llogg';
const ASSETS = [
  `${BASE_PATH}/`,
  `${BASE_PATH}/index.html`,
  `${BASE_PATH}/styles.css`,
  `${BASE_PATH}/manifest.json`,
  `${BASE_PATH}/src/main.js`,
  `${BASE_PATH}/src/lib/db.js`,
  `${BASE_PATH}/src/lib/dataService.js`,
  `${BASE_PATH}/src/lib/csvService.js`,
  `${BASE_PATH}/src/components/charts.js`
];

// Install event - cache assets
self.addEventListener('install', (event) => {
  console.log('[SW] Installing for', BASE_PATH);
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Caching assets:', ASSETS);
        return cache.addAll(ASSETS);
      })
      .then(() => self.skipWaiting())
      .catch(err => console.error('[SW] Install failed:', err))
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating');
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((name) => name !== CACHE_NAME)
            .map((name) => {
              console.log('[SW] Deleting old cache:', name);
              return caches.delete(name);
            })
        );
      })
      .then(() => self.clients.claim())
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  // Only handle requests within our scope
  if (!event.request.url.includes(BASE_PATH)) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          console.log('[SW] Serving from cache:', event.request.url);
          return response;
        }

        console.log('[SW] Fetching from network:', event.request.url);
        return fetch(event.request)
          .then(response => {
            // Cache successful responses
            if (response.status === 200) {
              const responseClone = response.clone();
              caches.open(CACHE_NAME)
                .then(cache => cache.put(event.request, responseClone));
            }
            return response;
          });
      })
      .catch((error) => {
        console.error('[SW] Fetch failed:', error);
        // If both cache and network fail, return offline page
        return caches.match(`${BASE_PATH}/index.html`);
      })
  );
});
