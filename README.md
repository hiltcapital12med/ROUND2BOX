# 🥊 ROUND2BOX - Aplicación de Gestión de Gimnasio

Plataforma web para atletas, entrenadores y administradores de un gimnasio de boxeo.

## 🚀 Inicio Rápido

### Requisitos
- Node.js 18+
- npm o yarn
- Cuenta Firebase

### Instalación Local

```bash
# 1. Instalar dependencias
npm install

# 2. Iniciar servidor de desarrollo
npm run dev

# El servidor estará en: http://localhost:5173
```

## 🌐 Despliegue en Firebase Hosting

### Primer Despliegue

```bash
# 1. Instalar Firebase CLI (si no lo tienes)
npm install -g firebase-tools

# 2. Iniciar sesión en Firebase
firebase login

# 3. Compilar la aplicación
npm run build

# 4. Desplegar a Firebase Hosting
firebase deploy --only hosting
```

### Despliegues Posteriores

```bash
# Opción 1: Comando único
npm run deploy

# Opción 2: Solo hosting
npm run firebase:deploy

# Opción 3: Completo (hosting + funciones)
firebase deploy
```

### Tu URL en Firebase

Después del despliegue, tu aplicación estará disponible en:
```
https://round2box-11d85.web.app
https://round2box-11d85.firebaseapp.com
```

## 📊 Estructura del Proyecto

```
ROUND2BOX/
├── src/
│   ├── components/       # Componentes React
│   ├── context/         # Context API (autenticación)
│   ├── hooks/           # Hooks personalizados
│   ├── services/        # Firebase services
│   ├── utils/           # Utilidades (cálculos de fechas, etc)
│   ├── App.jsx          # Componente principal
│   ├── main.jsx         # Entry point
│   └── index.css        # Estilos globales
├── public/
│   └── service-worker.js # PWA Service Worker
├── dist/                # Build output (generado)
├── firebase.json        # Configuración Firebase
├── .firebaserc          # Proyecto Firebase
├── package.json         # Dependencias
└── vite.config.js       # Configuración Vite
```

## 🔧 Configuración Firebase

### Variables de Entorno

Crea un archivo `.env.local`:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=round2box-11d85.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=round2box-11d85
VITE_FIREBASE_STORAGE_BUCKET=round2box-11d85.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=948239545378
VITE_FIREBASE_APP_ID=1:948239545378:web:8dfaae8cd5465181dc067b
```

> **NOTA:** Las claves ya están hardcodeadas en `src/services/firebase.js` por ahora.

## 📱 Características

### ✅ Implementadas
- ✅ Autenticación con Google
- ✅ Roles de usuario (Atleta, Entrenador, Admin)
- ✅ Agenda de clases con capacidad limitada
- ✅ Calendario (excluyendo domingos y festivos colombianos)
- ✅ Sistema de asistencia
- ✅ Rueda de progreso dinámico
- ✅ Notificaciones push
- ✅ Datos biomédicos (peso, altura, IMC)
- ✅ Métricas dinámicas (asistencias, objetivo semanal)
- ✅ PWA (funciona sin conexión)
- ✅ Firebase Hosting

### ⏳ Pendientes
- [ ] Trainer dashboard
- [ ] Export/reportes
- [ ] Analytics avanzados
- [ ] Pago/membresías
- [ ] Social features

## 🎯 Usuarios de Prueba

### Atleta
- Email: `atletra@gmail.com` (con rol "user")
- Puedes: Ver progreso, registrar pesos, ver agenda

### Entrenador
- Email: `entrenador@gmail.com` (con rol "trainer")
- Puedes: Crear clases, marcar asistencias, ver atletas

### Admin
- Email: `admin@gmail.com` (con rol "admin")
- Puedes: Acceso total al sistema

## 📚 Documentación

- `/src/docs/ROLES_AND_FUNCTIONS.md` - Permisos por rol
- `/src/docs/METRICS_DATA_MAPPING.md` - Mapeo de métricas
- `/src/docs/DATA_COHERENCE_VERIFICATION.md` - Coherencia de datos
- `/src/docs/EFFECTIVE_DAYS_CALCULATION.md` - Sistema de días efectivos
- `/src/docs/PROGRESS_RING.md` - Rueda de progreso
- `/src/docs/NOTIFICATIONS.md` - Sistema de notificaciones

## 🐛 Troubleshooting

### Error: "Firebase not initialized"
→ Verifica que `VITE_FIREBASE_*` esté configurado en `.env.local`

### Error: "Insufficient permissions"
→ Revisa las Firestore Rules en Firebase Console

### Build falla
```bash
# Limpia caché y reinstala
rm -rf node_modules dist
npm install
npm run build
```

### Deploy falla
```bash
# Verifica que Firebase CLI está instalado
firebase --version

# Inicia sesión
firebase login

# Selecciona el proyecto
firebase use round2box-11d85
```

## 🔒 Seguridad

- Claves de Firebase están públicas (es normal para web)
- Firestore Rules protegen datos sensibles
- Firebase Auth maneja autenticación segura
- HTTPS obligatorio en Firebase Hosting

## 📞 Soporte

Para reportar bugs o sugerencias, contacta al equipo de desarrollo.

## 📝 Licencia

Propiedad de ROUND2BOX Gym. Todos los derechos reservados.

---

**Última actualización:** 19 de Diciembre, 2025  
**Versión:** 1.0  
**Estado:** 🟢 Producción
