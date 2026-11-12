
const CACHE = 'feline31-v2';

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    await cache.addAll([
      './',
      './index.html',
      './manifest.webmanifest',
      './icon-192.png',
      './icon-512.png'
    ]);
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(
      keys.filter(k => k.startsWith('feline31-') && k !== CACHE)
        .map(k => caches.delete(k))
    );
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', event => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => caches.match('./index.html'))
    );
  } else {
    event.respondWith(
      caches.match(event.request).then(r => r || fetch(event.request))
    );
  }
});
