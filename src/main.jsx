import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

// Registrar Service Worker de forma segura
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      // Desregistrar todos los SWs anteriores para limpiar cache
      registrations.forEach((registration) => {
        registration.unregister().then(() => {
          console.log('[App] Unregistered old service worker');
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
  });
}
