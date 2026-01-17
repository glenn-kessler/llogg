/**
 * Service Worker for PWA functionality
 * Provides offline capability and caching
 */

// Import version from centralized location
importScripts('./version.js');

const CACHE_NAME = `life-logger-v${self.APP_VERSION}`;
const ASSETS = [
  './',
  './index.html',
  './styles.css',
  './manifest.json',
  './version.js',
  './src/main.js',
  './src/lib/db.js',
  './src/lib/dataService.js',
  './src/lib/csvService.js',
  './src/lib/configService.js',
  './src/components/charts.js'
];

// Install event - cache assets
self.addEventListener('install', (event) => {
  console.log(`[SW] Installing service worker v${self.APP_VERSION}...`);
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Opened cache:', CACHE_NAME);
        // Cache assets individually to avoid one failure blocking all
        return Promise.allSettled(
          ASSETS.map(asset =>
            cache.add(asset).catch(err => {
              console.warn('[SW] Failed to cache:', asset, err);
            })
          )
        );
      })
      .then(() => {
        console.log('[SW] Assets cached, skipping waiting...');
        return self.skipWaiting();
      })
      .catch(err => {
        console.error('[SW] Install failed:', err);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker v7...');
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        console.log('[SW] Existing caches:', cacheNames);
        return Promise.all(
          cacheNames
            .filter((name) => name !== CACHE_NAME)
            .map((name) => {
              console.log('[SW] Deleting old cache:', name);
              return caches.delete(name);
            })
        );
      })
      .then(() => {
        console.log('[SW] Claiming clients...');
        return self.clients.claim();
      })
      .then(() => {
        console.log('[SW] Service worker activated successfully!');
      })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  // Never cache TEST files - always fetch fresh from network
  if (event.request.url.includes('TEST_')) {
    event.respondWith(fetch(event.request));
    return;
  }

  // For index.html and main.js, use network-first strategy to get updates
  if (event.request.url.includes('index.html') || event.request.url.includes('main.js')) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // Cache the new version
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseClone);
          });
          return response;
        })
        .catch(() => {
          // Fallback to cache if network fails
          return caches.match(event.request);
        })
    );
    return;
  }

  // For other files, use cache-first strategy
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      })
      .catch(() => {
        // If both cache and network fail, return offline page
        return caches.match('./index.html');
      })
  );
});
