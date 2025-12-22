// UBICACIÓN: /src/services/notificationsService.js

import {
  MOTIVATIONAL_MESSAGES,
  CLASS_REMINDER_MESSAGES,
  PROGRESS_REMINDER_MESSAGES,
  NOTIFICATION_BADGE,
  NOTIFICATION_ICON
} from '../utils/notificationsConfig';

/**
 * Solicitar permiso para enviar notificaciones
 */
export const requestNotificationPermission = async () => {
  // Verificar si el navegador soporta notificaciones
  if (!('Notification' in window)) {
    console.warn('Este navegador no soporta notificaciones');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
};

/**
 * Enviar notificación local
 */
export const sendLocalNotification = (title, options = {}) => {
  if (Notification.permission !== 'granted') {
    console.warn('Permisos de notificación no otorgados');
    return;
  }

  const defaultOptions = {
    icon: NOTIFICATION_ICON,
    badge: NOTIFICATION_BADGE,
    requireInteraction: false,
    ...options
  };

  // Si estamos en un service worker
  if (typeof self !== 'undefined' && self.registration) {
    self.registration.showNotification(title, defaultOptions);
  } else {
    // Notificación local en el navegador
    new Notification(title, defaultOptions);
  }
};

/**
 * Enviar notificación de motivación
 */
export const sendMotivationalNotification = () => {
  const randomMessage = MOTIVATIONAL_MESSAGES[
    Math.floor(Math.random() * MOTIVATIONAL_MESSAGES.length)
  ];

  sendLocalNotification(randomMessage.title, {
    body: randomMessage.body,
    tag: randomMessage.tag,
    icon: NOTIFICATION_ICON
  });
};

/**
 * Enviar recordatorio de clase
 */
export const sendClassReminder = (classTime, classLabel, minutesBefore) => {
  const reminderConfig = getClassReminderConfig(minutesBefore);

  if (!reminderConfig) return;

  sendLocalNotification(reminderConfig.title, {
    body: `${classLabel} - ${classTime} ${reminderConfig.body}`,
    tag: reminderConfig.tag,
    icon: NOTIFICATION_ICON,
    requireInteraction: minutesBefore <= 5 // Mayor prioridad para recordatorios cortos
  });
};

/**
 * Obtener configuración del recordatorio según minutos
 */
const getClassReminderConfig = (minutesBefore) => {
  if (minutesBefore === 60) return CLASS_REMINDER_MESSAGES.oneHour;
  if (minutesBefore === 30) return CLASS_REMINDER_MESSAGES.thirtyMinutes;
  if (minutesBefore === 5) return CLASS_REMINDER_MESSAGES.fiveMinutes;
  return null;
};

/**
 * Enviar recordatorio de progreso semanal
 */
export const sendWeeklyProgressNotification = (weekData = {}) => {
  const { attendances = 0, totalClasses = 0 } = weekData;
  const percentage = totalClasses > 0 ? Math.round((attendances / totalClasses) * 100) : 0;

  sendLocalNotification(PROGRESS_REMINDER_MESSAGES.weekly.title, {
    body: `${PROGRESS_REMINDER_MESSAGES.weekly.body} Asistencia: ${percentage}%`,
    tag: PROGRESS_REMINDER_MESSAGES.weekly.tag,
    icon: NOTIFICATION_ICON
  });
};

/**
 * Enviar recordatorio de progreso mensual
 */
export const sendMonthlyProgressNotification = (monthData = {}) => {
  const { totalAttendances = 0, totalWorkouts = 0, personalRecords = 0 } = monthData;

  const body = `Este mes: ${totalAttendances} clases, ${personalRecords} PRs alcanzados.`;

  sendLocalNotification(PROGRESS_REMINDER_MESSAGES.monthly.title, {
    body,
    tag: PROGRESS_REMINDER_MESSAGES.monthly.tag,
    icon: NOTIFICATION_ICON
  });
};

/**
 * Enviar recordatorio de inactividad
 */
export const sendInactivityWarning = (daysSinceLastClass = 7) => {
  sendLocalNotification(PROGRESS_REMINDER_MESSAGES.inactivity.title, {
    body: `No has entrenado en ${daysSinceLastClass} días. ${PROGRESS_REMINDER_MESSAGES.inactivity.body}`,
    tag: PROGRESS_REMINDER_MESSAGES.inactivity.tag,
    icon: NOTIFICATION_ICON,
    requireInteraction: true // Mayor prioridad
  });
};

/**
 * Registrar service worker para notificaciones push
 */
export const registerServiceWorkerForNotifications = async () => {
  try {
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.register('/service-worker.js');
      console.log('Service Worker registrado para notificaciones:', registration);
      return registration;
    }
  } catch (error) {
    console.error('Error registrando Service Worker:', error);
  }
};

/**
 * Programar notificación de motivación diaria
 */
export const scheduleDailyMotivationalNotification = (time = '08:00') => {
  const [hours, minutes] = time.split(':').map(Number);

  const scheduleNotification = () => {
    const now = new Date();
    let next = new Date();
    next.setHours(hours, minutes, 0, 0);

    // Si la hora ya pasó hoy, programar para mañana
    if (next <= now) {
      next.setDate(next.getDate() + 1);
    }

    const timeUntilNext = next.getTime() - now.getTime();

    setTimeout(() => {
      sendMotivationalNotification();
      // Volver a programar para mañana
      setInterval(sendMotivationalNotification, 24 * 60 * 60 * 1000);
    }, timeUntilNext);
  };

  scheduleNotification();
};

/**
 * Programar notificaciones de recordatorio de clase
 */
export const scheduleClassReminders = (classTime, classLabel, minutesArray = [60, 30, 5]) => {
  const [hours, minutes] = classTime.split(':').map(Number);

  minutesArray.forEach((minutesBefore) => {
    const scheduleReminder = () => {
      const now = new Date();
      let nextClass = new Date();
      nextClass.setHours(hours, minutes, 0, 0);

      // Si la clase ya pasó hoy, programar para mañana
      if (nextClass <= now) {
        nextClass.setDate(nextClass.getDate() + 1);
      }

      const reminderTime = new Date(nextClass.getTime() - minutesBefore * 60 * 1000);
      const timeUntilReminder = reminderTime.getTime() - now.getTime();

      if (timeUntilReminder > 0) {
        setTimeout(() => {
          sendClassReminder(classTime, classLabel, minutesBefore);
          // Reprogramar para mañana
          setInterval(
            () => sendClassReminder(classTime, classLabel, minutesBefore),
            24 * 60 * 60 * 1000
          );
        }, timeUntilReminder);
      }
    };

    scheduleReminder();
  });
};

/**
 * Programar notificación de progreso semanal
 */
export const scheduleWeeklyProgressNotification = (dayOfWeek = 0, time = '19:00') => {
  const [hours, minutes] = time.split(':').map(Number);

  const scheduleNotification = () => {
    const now = new Date();
    let nextDate = new Date();

    // Calcular el próximo día de la semana especificado
    const currentDay = nextDate.getDay();
    const daysAhead = dayOfWeek - currentDay;
    const daysToAdd = daysAhead >= 0 ? daysAhead : 7 + daysAhead;

    nextDate.setDate(nextDate.getDate() + daysToAdd);
    nextDate.setHours(hours, minutes, 0, 0);

    if (nextDate <= now) {
      nextDate.setDate(nextDate.getDate() + 7);
    }

    const timeUntilNext = nextDate.getTime() - now.getTime();

    setTimeout(() => {
      sendWeeklyProgressNotification();
      // Volver a programar para la próxima semana
      setInterval(sendWeeklyProgressNotification, 7 * 24 * 60 * 60 * 1000);
    }, timeUntilNext);
  };

  scheduleNotification();
};

/**
 * Programar notificación de progreso mensual
 */
export const scheduleMonthlyProgressNotification = (dayOfMonth = 1, time = '09:00') => {
  const [hours, minutes] = time.split(':').map(Number);

  const scheduleNotification = () => {
    const now = new Date();
    let nextDate = new Date();

    nextDate.setDate(dayOfMonth);
    nextDate.setHours(hours, minutes, 0, 0);

    if (nextDate <= now) {
      nextDate.setMonth(nextDate.getMonth() + 1);
    }

    const timeUntilNext = nextDate.getTime() - now.getTime();

    setTimeout(() => {
      sendMonthlyProgressNotification();
      // Volver a programar para el próximo mes
      setInterval(sendMonthlyProgressNotification, 30 * 24 * 60 * 60 * 1000);
    }, timeUntilNext);
  };

  scheduleNotification();
};
