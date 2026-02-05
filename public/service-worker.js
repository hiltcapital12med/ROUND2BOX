// public/service-worker.js

const CACHE_NAME = 'round2-static-v1';
const DATA_CACHE_NAME = 'round2-data-v1';

// Archivos estáticos del App Shell (UI Base)
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/assets/logo.png',
  '/assets/styles.css',
];

// 1. INSTALACIÓN: Guardamos la UI base
self.addEventListener('install', (evt) => {
  evt.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[ServiceWorker] Pre-caching offline page');
      // Solo cachear archivos que existen realmente
      return Promise.allSettled(
        STATIC_ASSETS.map((url) =>
          fetch(url).then((response) => {
            if (response.status === 200) {
              return cache.put(url, response);
            }
          }).catch((err) => {
            console.warn(`[ServiceWorker] Could not cache ${url}:`, err);
          })
        )
      );
    })
  );
  self.skipWaiting();
});

// 2. ACTIVACIÓN: Limpieza de caches viejos
self.addEventListener('activate', (evt) => {
  evt.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if (key !== CACHE_NAME && key !== DATA_CACHE_NAME) {
          console.log('[ServiceWorker] Removing old cache', key);
          return caches.delete(key);
        }
      }));
    })
  );
  self.clients.claim();
});

// 3. INTERCEPCIÓN DE PETICIONES (FETCH)
self.addEventListener('fetch', (evt) => {
  
  // Ignorar requests que no sean GET
  if (evt.request.method !== 'GET') {
    return;
  }

  // ESTRATEGIA A: Datos de API (Agenda, Perfil) -> Network First, then Cache
  if (evt.request.url.includes('/api/')) {
    evt.respondWith(
      caches.open(DATA_CACHE_NAME).then((cache) => {
        return fetch(evt.request)
          .then((response) => {
            // Si la red responde bien, guardamos una copia en cache
            if (response.status === 200) {
              cache.put(evt.request.url, response.clone());
            }
            return response;
          })
          .catch((err) => {
            console.warn('[ServiceWorker] API fetch failed, trying cache:', err);
            // Si falla la red, devolvemos lo que haya en cache
            return cache.match(evt.request.url).then((cachedResponse) => {
              return cachedResponse || new Response('Offline - No cached data', { status: 503 });
            });
          });
      })
    );
    return;
  }

  // ESTRATEGIA B: Archivos Estáticos (UI) -> Cache First, then Network
  evt.respondWith(
    caches.match(evt.request).then((cacheRes) => {
      // Si está en cache, devolverlo
      if (cacheRes) {
        return cacheRes;
      }
      
      // Si no está en cache, intentar fetch con timeout
      return Promise.race([
        fetch(evt.request).then((response) => {
          // Si es exitoso, guardarlo en cache para futuras peticiones
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(evt.request.url, responseClone);
            });
          }
          return response;
        }),
        new Promise((resolve) =>
          setTimeout(() => resolve(null), 5000) // 5 segundos timeout
        )
      ]).catch((err) => {
        console.warn('[ServiceWorker] Fetch failed:', evt.request.url, err);
        // Devolver respuesta vacía en lugar de fallar
        return new Response('Offline', { status: 503 });
      });
    })
  );
});

// 4. MANEJO DE NOTIFICACIONES PUSH
self.addEventListener('push', (evt) => {
  if (evt.data) {
    const data = evt.data.json();
    const options = {
      body: data.body || '',
      icon: data.icon || '/assets/logo.png',
      badge: data.badge || '/assets/badge.png',
      tag: data.tag || 'notification',
      requireInteraction: data.requireInteraction || false,
      data: data.data || {}
    };

    evt.waitUntil(
      self.registration.showNotification(data.title || 'ROUND2', options)
    );
  }
});

// 5. MANEJO DE CLICK EN NOTIFICACIÓN
self.addEventListener('notificationclick', (evt) => {
  evt.notification.close();

  // Traer ventana al foco o abrir nueva
  evt.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // Buscar si ya tenemos una ventana abierta
      for (const client of clientList) {
        if (client.url === '/' && 'focus' in client) {
          return client.focus();
        }
      }
      // Si no hay ventana, abrir una nueva
      if (clients.openWindow) {
        return clients.openWindow('/');
      }
    })
  );
});

// 6. MANEJO DE CIERRE DE NOTIFICACIÓN
self.addEventListener('notificationclose', (evt) => {
  console.log('[ServiceWorker] Notificación cerrada:', evt.notification.tag);
});