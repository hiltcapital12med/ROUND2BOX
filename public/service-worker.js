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
  
  // REGLA DE ORO: Solo responder a peticiones que REALMENTE podemos cachear
  // Para CUALQUIER otra cosa, no llamar evt.respondWith() - dejar que el navegador lo haga
  
  // Solo GET requests
  if (evt.request.method !== 'GET') {
    return;
  }

  const url = new URL(evt.request.url);
  const pathname = url.pathname;

  // NUNCA cachear archivos de desarrollo - simplemente no interceptar
  if (
    pathname.includes('/@vite') ||
    pathname.includes('/@react-refresh') ||
    pathname.includes('/node_modules/') ||
    pathname.includes('/src/') ||
    pathname.includes('.hot-update') ||
    pathname.includes('vite.svg') ||
    pathname === '/'
  ) {
    // NO HACER NADA - no llamar evt.respondWith()
    // El navegador manejará la petición normalmente
    return;
  }

  // SOLO cachear ciertos tipos de archivos estáticos
  const cacheableExtensions = ['.js', '.css', '.png', '.jpg', '.svg', '.woff', '.woff2'];
  const isCacheable = cacheableExtensions.some((ext) => pathname.endsWith(ext));

  if (!isCacheable && !pathname.includes('/api/')) {
    // Si no es una extensión conocida ni es API, no cachear
    return;
  }

  // ESTRATEGIA A: API -> Network First
  if (pathname.includes('/api/')) {
    evt.respondWith(
      fetch(evt.request)
        .then((response) => {
          if (response.status === 200) {
            caches.open(DATA_CACHE_NAME).then((cache) => {
              cache.put(evt.request.url, response.clone());
            });
          }
          return response;
        })
        .catch(() => {
          return caches.match(evt.request);
        })
    );
    return;
  }

  // ESTRATEGIA B: Archivos estáticos -> Cache First
  // IMPORTANTE: Filtrar requests que no sean http/https para evitar errores de chrome-extension
  if (!evt.request.url.startsWith('http://') && !evt.request.url.startsWith('https://')) {
    return;
  }

  evt.respondWith(
    caches.match(evt.request).then((cached) => {
      if (cached) {
        return cached;
      }
      return fetch(evt.request).then((response) => {
        // Si response es válido y es 200, clonar INMEDIATAMENTE
        if (response && response.status === 200) {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(evt.request.url, responseToCache);
          });
        }
        return response;
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