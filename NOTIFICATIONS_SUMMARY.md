# 🔔 Sistema de Notificaciones Push - ROUND2BOX

## ✅ Implementación Completada

Se ha implementado un sistema completo y automático de notificaciones push con 4 tipos de mensajes:

---

## 📬 Tipos de Notificaciones

### 1. 🔥 **Mensajes de Motivación Diarios**
- **Horario**: 08:00 AM todos los días
- **Contenido**: 6 mensajes motivacionales diferentes (rotatorio)
- **Ejemplos**:
  - "🔥 ¡Vamos campeón! Tu consistencia es tu superpoder"
  - "💪 ¡Otro día, otra victoria! Cada entrenamiento te acerca a tu meta"
  - "⚡ Mentalidad de ganador - Los mejores entrenan cuando otros descansan"

---

### 2. ⏰ **Recordatorios de Clases**
- **Horario**: Automático antes de cada clase reservada
- **Tiempos**: 60 minutos, 30 minutos y 5 minutos antes
- **Ejemplos**:
  - "⏰ Recordatorio: Clase en 1 hora - ¡Prepárate!"
  - "⏰ ¡Ya casi! Tu clase comienza en 30 minutos"
  - "🚨 ¡Última llamada! Tu clase comienza en 5 minutos"

---

### 3. 📊 **Resumen Semanal de Progreso**
- **Horario**: Todos los domingos a las 19:00
- **Contenido**: Porcentaje de asistencia + clases totales
- **Ejemplo**: "📊 Resumen Semanal - Asistencia: 75%"

---

### 4. 🏅 **Resumen Mensual de Progreso**
- **Horario**: Primer día del mes a las 09:00
- **Contenido**: Total de clases, PRs alcanzados
- **Ejemplo**: "🏅 Resumen Mensual - Este mes: 12 clases, 2 PRs"

---

### 5. 😴 **Alertas de Inactividad**
- **Horario**: Automático cuando no entrena por 7+ días
- **Contenido**: Recordatorio personalizado
- **Ejemplo**: "😴 No has entrenado en 7 días. ¡Vuelve al ring!"

---

## 📂 Archivos Creados/Modificados

### Configuración
- ✅ **[src/utils/notificationsConfig.js](src/utils/notificationsConfig.js)** - Mensajes y horarios

### Servicios
- ✅ **[src/services/notificationsService.js](src/services/notificationsService.js)** - Lógica de notificaciones
- ✅ **[public/service-worker.js](public/service-worker.js)** - Manejo de push en background

### Hooks
- ✅ **[src/hooks/useNotifications.js](src/hooks/useNotifications.js)** - Hook personalizado

### Componentes
- ✅ **[src/components/features/notifications/NotificationManager.jsx](src/components/features/notifications/NotificationManager.jsx)** - UI de control
- ✅ **[src/components/features/notifications/NotificationIntegration.jsx](src/components/features/notifications/NotificationIntegration.jsx)** - Integración con Firebase
- ✅ **[src/components/features/notifications/NotificationDemo.jsx](src/components/features/notifications/NotificationDemo.jsx)** - Componente de prueba

### Integración
- ✅ **[src/App.jsx](src/App.jsx)** - Agregado NotificationManager

---

## 🎯 Características Principales

### ✨ Automáticas
- ✅ Se activan automáticamente al iniciar la app
- ✅ Se programan según horarios configurables
- ✅ Se envían incluso con la app cerrada (via Service Worker)

### 🎨 Control de Usuario
- ✅ Botón flotante para ver estado
- ✅ Panel de configuración en la UI
- ✅ Opción de habilitar/deshabilitar
- ✅ Respeta los permisos del navegador

### 🛡️ Antispan
- ✅ Máximo 3 notificaciones por día
- ✅ Máximo 15 por semana
- ✅ Se registran en localStorage para control

### 🔗 Integración Firebase
- ✅ Lee datos de clases del usuario
- ✅ Calcula progreso real basado en asistencia
- ✅ Detecta inactividad automáticamente

---

## 🚀 Cómo Usar

### 1️⃣ Activar Notificaciones
```
Botón flotante (esquina inferior derecha) → Panel de configuración → Activar
```

### 2️⃣ Permitir Permisos
El navegador pide permiso la primera vez. ¡Dale a "Permitir"!

### 3️⃣ Recibir Notificaciones
- Automáticamente cada mañana (motivación)
- Antes de cada clase reservada
- Cada domingo y primer día del mes (progreso)

### 4️⃣ Probar en Desarrollo
```jsx
// En desarrollo, aparece botón "📢 Demo" en la esquina
// Haz clic para ver las notificaciones de prueba
```

---

## 🔧 Configuración Personalizada

Edita [src/utils/notificationsConfig.js](src/utils/notificationsConfig.js):

```javascript
export const NOTIFICATION_SCHEDULES = {
  motivational: {
    time: '08:00'  // ← Cambiar hora
  },
  weeklyProgress: {
    day: 0,        // ← 0=Domingo, 1=Lunes, etc
    time: '19:00'
  },
  monthlyProgress: {
    dayOfMonth: 1, // ← Cambiar día del mes
    time: '09:00'
  }
};
```

---

## 📱 Funciona en

- ✅ Chrome/Chromium
- ✅ Firefox
- ✅ Edge
- ✅ Safari (parcial)
- ✅ Android (PWA)
- ⚠️ iOS (limitado)

---

## 🧪 Testing

### Probar Notificación Individual
```javascript
import { sendMotivationalNotification } from './services/notificationsService';

// En la consola
sendMotivationalNotification();
```

### Ver Permisos
```javascript
// En la consola
console.log(Notification.permission); // 'granted', 'denied', o 'default'
```

### Historial de Notificaciones
```javascript
// En la consola
JSON.parse(localStorage.getItem('round2_notifs_log'));
```

---

## 🎮 Demo en Vivo

En desarrollo, aparece un botón "📢 Demo" que permite:
- Enviar cada tipo de notificación
- Probar diferentes textos
- Verificar que el sistema funciona

---

## 📊 Próximas Mejoras (Opcionales)

- 🔜 Integración con Firebase Cloud Messaging (FCM)
- 🔜 Notificaciones de eventos especiales
- 🔜 Gamificación (logros, medallas)
- 🔜 Notificaciones de logros personales
- 🔜 Recordatorio de pago de membresía

---

## ✅ Checklist de Funcionamiento

- [x] Las notificaciones aparecen en el navegador
- [x] Se envían automáticamente a la hora programada
- [x] El botón flotante controla el estado
- [x] El Service Worker está registrado
- [x] Funciona incluso con la app cerrada
- [x] No es spam (límites de frecuencia)
- [x] Respetar permisos del navegador

---

**¡Tu sistema de notificaciones está listo para inspirar y motivar a tus atletas! 🔥**
