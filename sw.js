const CACHE_NAME = 'evaluandonos-v2026-v25';
const urlsToCache = [
  './',
  './index.html',
  './app.js',
  './style.css',
  './manifest.json',
  './icon.png'
];

self.addEventListener('install', event => {
  console.log('SW Evaluándonos: Instalando...');
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('SW Evaluándonos: Cacheando archivos...');
        return cache.addAll(urlsToCache).catch(err => {
          console.error('SW Evaluándonos: Error al cachear:', err);
        });
      })
  );
});

self.addEventListener('activate', event => {
  console.log('SW Evaluándonos: Activado');
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim(); // Toma el control inmediatamente
});

// Estrategia Network First (Red primero, luego caché)
self.addEventListener('fetch', event => {
  // Ignorar peticiones que no sean GET (ej. llamadas a Supabase)
  if (event.request.method !== 'GET') return;

  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Actualizamos la caché con la respuesta de red
        if (response && response.status === 200) {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseToCache);
          });
        }
        return response;
      })
      .catch(() => {
        // Si no hay red, buscamos en la caché
        return caches.match(event.request);
      })
  );
});
