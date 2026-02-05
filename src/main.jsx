import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

// Registrar Service Worker SOLO en producción, no en desarrollo
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js').then((registration) => {
      console.log('[App] Service Worker registered:', registration);
    }).catch((error) => {
      console.warn('[App] Service Worker registration failed:', error);
    });
  });
} else if (!import.meta.env.PROD && 'serviceWorker' in navigator) {
  // En desarrollo, desregistrar cualquier SW anterior
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    registrations.forEach((registration) => {
      registration.unregister().then(() => {
        console.log('[App] Unregistered service worker (dev mode)');
        // Limpiar todos los caches
        if ('caches' in window) {
          caches.keys().then((cacheNames) => {
            cacheNames.forEach((cacheName) => {
              caches.delete(cacheName).then(() => {
                console.log('[App] Cleared cache:', cacheName);
              });
            });
          });
        }
      });
    });
  });
}
