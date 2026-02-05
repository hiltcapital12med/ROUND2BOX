import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

// LIMPIAR TODOS LOS SERVICE WORKERS EN DESARROLLO
// Esto se ejecuta SIEMPRE, incluso en producción, para limpiar versiones viejas
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    console.log(`[App] Found ${registrations.length} service workers`);
    
    registrations.forEach((registration) => {
      console.log('[App] Unregistering SW:', registration.scope);
      registration.unregister();
    });
  });

  // Limpiar TODOS los caches
  if ('caches' in window) {
    caches.keys().then((cacheNames) => {
      console.log(`[App] Found ${cacheNames.length} caches to clear`);
      cacheNames.forEach((cacheName) => {
        caches.delete(cacheName).then(() => {
          console.log('[App] Deleted cache:', cacheName);
        });
      });
    });
  }
}
