import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

// UNREGISTER SERVICE WORKERS EN DESARROLLO
// Ejecutar esta limpieza SIEMPRE al cargar la app
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    registrations.forEach((registration) => {
      registration.unregister();
      console.log('[App] SW unregistered');
    });
  });

  // Limpiar caches
  if ('caches' in window) {
    caches.keys().then((names) => {
      names.forEach((name) => caches.delete(name));
    });
  }
}

// NOTA: Service Worker será registrado SOLO en producción 
// mediante un build script o configuración de deploy
