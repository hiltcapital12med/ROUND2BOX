// UBICACIÓN: /src/hooks/useNotifications.js
import { useState, useEffect } from 'react';
import {
  requestNotificationPermission,
  registerServiceWorkerForNotifications,
  scheduleDailyMotivationalNotification,
  scheduleClassReminders,
  scheduleWeeklyProgressNotification,
  scheduleMonthlyProgressNotification,
  sendInactivityWarning
} from '../services/notificationsService';
import { NOTIFICATION_SCHEDULES } from '../utils/notificationsConfig';

export function useNotifications() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState('default');

  // Inicializar notificaciones al montar el componente
  useEffect(() => {
    initializeNotifications();
  }, []);

  const initializeNotifications = async () => {
    try {
      // 1. Registrar service worker
      await registerServiceWorkerForNotifications();

      // 2. Solicitar permiso
      const hasPermission = await requestNotificationPermission();
      setNotificationsEnabled(hasPermission);
      setPermissionStatus(window.Notification?.permission || 'default');

      // 3. Si tenemos permiso, programar notificaciones
      if (hasPermission) {
        scheduleAllNotifications();
      }
    } catch (error) {
      console.error('Error inicializando notificaciones:', error);
    }
  };

  // Programar todas las notificaciones automáticas
  const scheduleAllNotifications = () => {
    const { motivational, classReminders, weeklyProgress, monthlyProgress } = NOTIFICATION_SCHEDULES;

    // Notificaciones de motivación diaria
    if (motivational.enabled) {
      scheduleDailyMotivationalNotification(motivational.time);
    }

    // Recordatorios de clase (estos se programan por clase individual)
    // Se manejan en el componente AgendaView

    // Progreso semanal
    if (weeklyProgress.enabled) {
      scheduleWeeklyProgressNotification(weeklyProgress.day, weeklyProgress.time);
    }

    // Progreso mensual
    if (monthlyProgress.enabled) {
      scheduleMonthlyProgressNotification(monthlyProgress.dayOfMonth, monthlyProgress.time);
    }
  };

  // Verificar inactividad del usuario
  const checkInactivity = (lastClassDate) => {
    const today = new Date();
    const daysSince = Math.floor((today - lastClassDate) / (1000 * 60 * 60 * 24));

    if (daysSince >= 7 && notificationsEnabled) {
      sendInactivityWarning(daysSince);
    }
  };

  // Función maestra: Verifica si podemos enviar una notificación hoy
  const checkRules = () => {
    const today = new Date().toISOString().split('T')[0];
    const storageKey = 'round2_notifs_log';
    
    let history = JSON.parse(localStorage.getItem(storageKey) || '[]');

    // REGLA 1: ¿Ya enviamos una hoy?
    const sentToday = history.filter(date => date === today).length;
    if (sentToday >= 3) return false; // Máximo 3 notificaciones por día

    // REGLA 2: ¿Enviamos más de 15 esta semana?
    if (history.length >= 15) {
        return false;
    }

    return true;
  };

  // Función para registrar que enviamos una
  const logNotification = () => {
    if (!checkRules()) return false;

    const today = new Date().toISOString().split('T')[0];
    const storageKey = 'round2_notifs_log';
    let history = JSON.parse(localStorage.getItem(storageKey) || '[]');
    
    history.push(today);
    if (history.length > 14) history.shift();
    
    localStorage.setItem(storageKey, JSON.stringify(history));
    return true;
  };

  return {
    notificationsEnabled,
    permissionStatus,
    initializeNotifications,
    scheduleAllNotifications,
    checkInactivity,
    canSend: checkRules(),
    logNotification
  };
}

