const CACHE_NAME = 'photo-tool-cache-v1';
const OFFLINE_URLS = [
  './index.html',
  './favicon.ico',
  './manifest.json',
  './assets/index-yKFlT6CK.js',
  './assets/index-Tr8oecXO.css',
  './icons/apple-touch-icon.png',
  './icons/icon-32x32.png',
  './icons/icon-192x192.png',
  './icons/icon-512x512.png'
];

// Установка SW и кеширование нужных файлов
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(OFFLINE_URLS);
    })
  );
  self.skipWaiting();
});

// Активация — удаляем старые кэши, если есть
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keyList) =>
      Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim();
});

// Перехват запросов
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Возвращаем из кеша, если есть, иначе идем в сеть
      return (
        cachedResponse ||
        fetch(event.request).catch(() => caches.match('./index.html'))
      );
    })
  );
});
