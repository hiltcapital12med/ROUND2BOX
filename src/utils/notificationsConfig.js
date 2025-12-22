// UBICACIÓN: /src/utils/notificationsConfig.js

// Mensajes de Motivación (Aleatorios)
export const MOTIVATIONAL_MESSAGES = [
  {
    title: '🔥 ¡Vamos campeón!',
    body: 'Tu consistencia es tu superpoder. Sigue adelante.',
    tag: 'motivation'
  },
  {
    title: '💪 ¡Otro día, otra victoria!',
    body: 'Cada entrenamiento te acerca a tu meta. No pares.',
    tag: 'motivation'
  },
  {
    title: '⚡ Mentalidad de ganador',
    body: 'Los mejores entrenan cuando los demás descansan.',
    tag: 'motivation'
  },
  {
    title: '🥊 Tú puedes',
    body: 'El dolor de hoy es la fuerza de mañana.',
    tag: 'motivation'
  },
  {
    title: '🎯 Focus',
    body: 'Recuerda tu objetivo. Cada round cuenta.',
    tag: 'motivation'
  },
  {
    title: '🏆 Eres más fuerte',
    body: 'De cada caída, te levantarás más fuerte.',
    tag: 'motivation'
  }
];

// Recordatorios de Clase
export const CLASS_REMINDER_MESSAGES = {
  oneHour: {
    title: '⏰ Recordatorio: Clase en 1 hora',
    body: 'Tu clase de ROUND2 comienza en 1 hora. ¡Prepárate!',
    tag: 'class-reminder'
  },
  thirtyMinutes: {
    title: '⏰ ¡Ya casi!',
    body: 'Tu clase comienza en 30 minutos. ¡Ve preparándote!',
    tag: 'class-reminder'
  },
  fiveMinutes: {
    title: '🚨 ¡Última llamada!',
    body: 'Tu clase comienza en 5 minutos. ¡Vamos!',
    tag: 'class-reminder'
  }
};

// Recordatorios de Progreso
export const PROGRESS_REMINDER_MESSAGES = {
  weekly: {
    title: '📊 Resumen Semanal',
    body: 'Revisa tu progreso de esta semana. ¡Vas bien!',
    tag: 'progress-weekly'
  },
  monthly: {
    title: '🏅 Resumen Mensual',
    body: 'Mira cómo has evolucionado este mes.',
    tag: 'progress-monthly'
  },
  inactivity: {
    title: '😴 Te echamos de menos',
    body: 'No has entrenado en 7 días. ¡Vuelve al ring!',
    tag: 'inactivity-warning'
  }
};

// Horarios de notificaciones (en horas)
export const NOTIFICATION_SCHEDULES = {
  motivational: {
    enabled: true,
    time: '08:00', // Cada mañana a las 8:00
    frequency: 'daily'
  },
  classReminders: {
    enabled: true,
    timesBeforeClass: [60, 30, 5] // minutos antes de la clase
  },
  weeklyProgress: {
    enabled: true,
    day: 0, // 0 = Domingo
    time: '19:00' // 7 PM del domingo
  },
  monthlyProgress: {
    enabled: true,
    dayOfMonth: 1, // Primer día del mes
    time: '09:00' // 9 AM
  }
};

// Badge icon y badge count
export const NOTIFICATION_BADGE = '/assets/badge.png';
export const NOTIFICATION_ICON = '/assets/logo.png';
