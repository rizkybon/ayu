// ============================================================
// Dompet AYU v4.2 — Service Worker
// App Shell Caching untuk offline support
// ============================================================
const CACHE_NAME = 'dompet-ayu-v4.2';
const SHELL_URLS = [
  './',
  './index.html'
];

// Install: cache app shell
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(SHELL_URLS).catch(() => {
        // Jika gagal cache (misal: offline saat install), lanjut tanpa error
        return Promise.resolve();
      });
    }).then(() => self.skipWaiting())
  );
});

// Activate: hapus cache lama
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Fetch: Cache First untuk shell, Network First untuk API
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Jangan intercept request ke GAS API (selalu network)
  if (url.hostname.includes('script.google.com') || 
      url.hostname.includes('googleapis.com')) {
    return; // biarkan browser handle normal
  }

  // Untuk asset CDN (chart.js, jsQR): Cache First
  if (url.hostname.includes('jsdelivr.net') || 
      url.hostname.includes('cdnjs.cloudflare.com')) {
    event.respondWith(
      caches.match(event.request).then(cached => {
        if (cached) return cached;
        return fetch(event.request).then(response => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
          }
          return response;
        }).catch(() => cached || new Response('', {status: 503}));
      })
    );
    return;
  }

  // Untuk index.html dan asset lokal: Cache First dengan network fallback
  event.respondWith(
    caches.match(event.request).then(cached => {
      const networkFetch = fetch(event.request).then(response => {
        if (response.ok && event.request.method === 'GET') {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return response;
      }).catch(() => null);

      // Return cache langsung jika ada, background update
      return cached || networkFetch || new Response('Offline', {status: 503});
    })
  );
});
