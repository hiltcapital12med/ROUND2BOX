// UBICACIÓN: /src/docs/NOTIFICATIONS.md

# Sistema de Notificaciones Push - ROUND2BOX

## 📋 Descripción General

El sistema de notificaciones push proporciona:
- ✅ Mensajes de motivación diarios
- ✅ Recordatorios automáticos de clases (60, 30, 5 minutos antes)
- ✅ Resumen semanal de progreso
- ✅ Resumen mensual de progreso
- ✅ Alertas de inactividad

## 📂 Estructura de Archivos

```
src/
├── utils/
│   └── notificationsConfig.js          # Configuración de mensajes
├── services/
│   └── notificationsService.js         # Lógica de notificaciones
├── hooks/
│   └── useNotifications.js             # Hook personalizado
├── components/
│   └── features/
│       └── notifications/
│           └── NotificationManager.jsx # Componente UI
└── docs/
    └── NOTIFICATIONS.md                # Este archivo
```

## 🔧 Configuración

### notificationsConfig.js

Define los mensajes y horarios:

```javascript
export const NOTIFICATION_SCHEDULES = {
  motivational: {
    enabled: true,
    time: '08:00',        // Hora diaria
    frequency: 'daily'
  },
  classReminders: {
    enabled: true,
    timesBeforeClass: [60, 30, 5]  // minutos antes
  },
  weeklyProgress: {
    enabled: true,
    day: 0,               // 0 = Domingo
    time: '19:00'
  },
  monthlyProgress: {
    enabled: true,
    dayOfMonth: 1,        // Primer día
    time: '09:00'
  }
};
```

## 🚀 Uso

### 1. Inicializar en tu componente

```jsx
import { useNotifications } from '../hooks/useNotifications';

function MiComponente() {
  const { notificationsEnabled, initializeNotifications } = useNotifications();

  useEffect(() => {
    // Inicializa automáticamente al montar
  }, []);

  return <div>...</div>;
}
```

### 2. Usar el componente NotificationManager

```jsx
import NotificationManager from './components/features/notifications/NotificationManager';

function App() {
  return (
    <div>
      {/* Aparecerá un botón flotante con panel de configuración */}
      <NotificationManager upcomingClasses={[]} />
    </div>
  );
}
```

### 3. Enviar notificaciones personalizadas

```javascript
import {
  sendMotivationalNotification,
  sendClassReminder,
  sendWeeklyProgressNotification,
  sendMonthlyProgressNotification,
  sendInactivityWarning
} from '../services/notificationsService';

// Motivación
sendMotivationalNotification();

// Recordatorio de clase
sendClassReminder('18:30', 'Boxeo Funcional', 60);

// Progreso semanal con datos
sendWeeklyProgressNotification({
  attendances: 3,
  totalClasses: 4
});

// Progreso mensual con datos
sendMonthlyProgressNotification({
  totalAttendances: 12,
  totalWorkouts: 15,
  personalRecords: 2
});

// Alerta de inactividad
sendInactivityWarning(7);  // 7 días sin entrenar
```

## 📱 Tipos de Notificaciones

### 1. Mensajes de Motivación
- **Frecuencia**: Diaria a las 08:00
- **Ejemplos**:
  - "🔥 ¡Vamos campeón! Tu consistencia es tu superpoder."
  - "💪 ¡Otro día, otra victoria!"
  - "⚡ Mentalidad de ganador"

### 2. Recordatorios de Clase
- **Frecuencia**: Antes de cada clase reservada
- **Tiempos**: 60, 30 y 5 minutos antes
- **Ejemplo**: "⏰ Tu clase de Boxeo Funcional comienza en 5 minutos"

### 3. Progreso Semanal
- **Frecuencia**: Todos los domingos a las 19:00
- **Contenido**: Porcentaje de asistencia y clases
- **Ejemplo**: "📊 Resumen Semanal - Asistencia: 75%"

### 4. Progreso Mensual
- **Frecuencia**: Primer día del mes a las 09:00
- **Contenido**: Total de clases, PRs alcanzados
- **Ejemplo**: "🏅 Resumen Mensual - 12 clases, 2 PRs"

### 5. Alertas de Inactividad
- **Frecuencia**: Cuando no entrena por 7+ días
- **Ejemplo**: "😴 No has entrenado en 7 días. ¡Vuelve al ring!"

## 🎯 Funciones Principales

### requestNotificationPermission()
Solicita permiso al usuario para enviar notificaciones.

```javascript
const hasPermission = await requestNotificationPermission();
```

### registerServiceWorkerForNotifications()
Registra el Service Worker para manejar notificaciones.

```javascript
await registerServiceWorkerForNotifications();
```

### sendLocalNotification(title, options)
Envía una notificación local inmediata.

```javascript
sendLocalNotification('Mi Título', {
  body: 'Descripción',
  tag: 'unique-id',
  icon: '/icon.png',
  requireInteraction: false
});
```

### scheduleDaily/Weekly/Monthly Notifications
Programa notificaciones automáticas.

```javascript
// Diaria
scheduleDailyMotivationalNotification('08:00');

// Semanal (día 0 = domingo)
scheduleWeeklyProgressNotification(0, '19:00');

// Mensual (día 1 del mes)
scheduleMonthlyProgressNotification(1, '09:00');
```

## 🔐 Permisos Requeridos

El navegador solicita permiso al usuario la primera vez:
- ✅ Permitir: Usuario recibe notificaciones
- ❌ Denegar: Las notificaciones se desactivan
- ⚠️ Si deniega y quiere cambiar: Debe ir a Configuración del Navegador

## 📊 Control de Frecuencia

El sistema limita notificaciones para evitar spam:

```javascript
// Máximo 3 notificaciones por día
const canSend = checkRules();

// Máximo 15 por semana
// Se registran en localStorage con timestamp
```

## 🛠️ Troubleshooting

### Las notificaciones no aparecen

1. ✅ Verifica que los permisos estén habilitados
2. ✅ Comprueba que el Service Worker esté registrado
3. ✅ Abre la consola del navegador (F12) para ver errores
4. ✅ Asegúrate de tener HTTPS (en producción)

### El Service Worker no se carga

```javascript
// En main.jsx
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js');
}
```

### Las notificaciones se ven cortadas

Ajusta el texto en `notificationsConfig.js`:
- Título máximo: ~60 caracteres
- Body máximo: ~120 caracteres

## 🔄 Integración con Firebase

Para usar Firebase Cloud Messaging (FCM) en producción:

1. Añade tu `google-services.json`
2. Configura FCM en Firebase Console
3. Reemplaza `sendLocalNotification()` con FCM API

```javascript
// Ejemplo con FCM
const messaging = getMessaging(app);
onMessage(messaging, (payload) => {
  console.log('Mensaje recibido:', payload);
  // Mostrar notificación
});
```

## 📈 Métricas

El sistema rastrea:
- ✅ Notificaciones enviadas por tipo
- ✅ Tasa de clics en notificaciones
- ✅ Preferencias del usuario

Datos almacenados en localStorage:
```javascript
'round2_notifs_log'  // Historial de notificaciones
'round2_notifs_prefs' // Preferencias del usuario
```

---

**Versión**: 1.0
**Última actualización**: Diciembre 2025
