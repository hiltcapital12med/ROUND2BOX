// UBICACIÓN: /src/components/features/notifications/NotificationIntegration.jsx
// EJEMPLO: Cómo integrar notificaciones con datos reales de Firebase

import React, { useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { db } from '../../../services/firebase';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import {
  sendClassReminder,
  sendWeeklyProgressNotification,
  sendMonthlyProgressNotification,
  sendInactivityWarning
} from '../../../services/notificationsService';
import { getDailySlots } from '../../../utils/agendaConfig';

export function useNotificationIntegration() {
  const { user } = useAuth();

  // ============================
  // 1. RECORDATORIOS DE CLASE
  // ============================
  const setupClassReminders = async () => {
    if (!user) return;

    try {
      // Obtener clases del usuario para hoy y mañana
      const today = new Date().toISOString().split('T')[0];
      
      // Consultar reservas en Firebase
      const scheduleRef = doc(db, 'schedule', today);
      const scheduleSnap = await getDoc(scheduleRef);

      if (scheduleSnap.exists()) {
        const daySchedule = scheduleSnap.data();

        // Iterar sobre cada hora del día
        Object.entries(daySchedule).forEach(([time, attendees]) => {
          // Verificar si el usuario está inscrito
          const isUserBooked = attendees.some(a => a.uid === user.uid);

          if (isUserBooked) {
            // Encontrar el slot completo
            const slots = getDailySlots(new Date());
            const slot = slots.find(s => s.time === time);

            if (slot) {
              // Programar recordatorios
              scheduleClassRemindersForSlot(time, slot.label);
            }
          }
        });
      }
    } catch (error) {
      console.error('Error en recordatorios de clase:', error);
    }
  };

  // ============================
  // 2. PROGRESO SEMANAL
  // ============================
  const fetchWeeklyProgress = async () => {
    if (!user) return;

    try {
      // Obtener todas las clases de esta semana
      const userAttendanceRef = collection(db, 'users', user.uid, 'attendance');
      const startOfWeek = getStartOfWeek();
      const endOfWeek = getEndOfWeek();

      const q = query(
        userAttendanceRef,
        where('date', '>=', startOfWeek),
        where('date', '<=', endOfWeek)
      );

      const querySnapshot = await getDocs(q);
      const attendances = querySnapshot.docs.filter(doc => doc.data().attended).length;
      const totalClasses = querySnapshot.size;

      // Enviar notificación con datos reales
      sendWeeklyProgressNotification({
        attendances,
        totalClasses
      });
    } catch (error) {
      console.error('Error en progreso semanal:', error);
    }
  };

  // ============================
  // 3. PROGRESO MENSUAL
  // ============================
  const fetchMonthlyProgress = async () => {
    if (!user) return;

    try {
      // Obtener todas las clases del mes
      const userAttendanceRef = collection(db, 'users', user.uid, 'attendance');
      const startOfMonth = getStartOfMonth();
      const endOfMonth = getEndOfMonth();

      const q = query(
        userAttendanceRef,
        where('date', '>=', startOfMonth),
        where('date', '<=', endOfMonth)
      );

      const querySnapshot = await getDocs(q);
      const attendances = querySnapshot.docs.filter(doc => doc.data().attended).length;

      // Obtener PRs (Personal Records) si existen
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);
      const personalRecords = userSnap.data()?.personalRecordsThisMonth || 0;

      // Enviar notificación con datos reales
      sendMonthlyProgressNotification({
        totalAttendances: attendances,
        totalWorkouts: querySnapshot.size,
        personalRecords
      });
    } catch (error) {
      console.error('Error en progreso mensual:', error);
    }
  };

  // ============================
  // 4. ALERTAS DE INACTIVIDAD
  // ============================
  const checkUserInactivity = async () => {
    if (!user) return;

    try {
      // Obtener última clase del usuario
      const userAttendanceRef = collection(db, 'users', user.uid, 'attendance');
      const q = query(userAttendanceRef);
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) return;

      // Ordenar por fecha descendente
      const docs = querySnapshot.docs.sort((a, b) => 
        new Date(b.data().date) - new Date(a.data().date)
      );

      const lastClassDate = new Date(docs[0].data().date);
      const today = new Date();
      const daysSince = Math.floor((today - lastClassDate) / (1000 * 60 * 60 * 24));

      // Si han pasado 7 o más días, enviar alerta
      if (daysSince >= 7) {
        sendInactivityWarning(daysSince);
      }
    } catch (error) {
      console.error('Error en verificación de inactividad:', error);
    }
  };

  // ============================
  // UTILIDADES
  // ============================

  const getStartOfWeek = () => {
    const now = new Date();
    const day = now.getDay();
    const diff = now.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(now.setDate(diff)).toISOString().split('T')[0];
  };

  const getEndOfWeek = () => {
    const now = new Date();
    const day = now.getDay();
    const diff = now.getDate() - day + (day === 0 ? -6 : 1) + 6;
    return new Date(now.setDate(diff)).toISOString().split('T')[0];
  };

  const getStartOfMonth = () => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1)
      .toISOString()
      .split('T')[0];
  };

  const getEndOfMonth = () => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth() + 1, 0)
      .toISOString()
      .split('T')[0];
  };

  const scheduleClassRemindersForSlot = (time, label) => {
    const [hours, minutes] = time.split(':').map(Number);
    const classTime = new Date();
    classTime.setHours(hours, minutes, 0, 0);

    // Programar recordatorios 60, 30 y 5 minutos antes
    [60, 30, 5].forEach(minutesBefore => {
      const reminderTime = new Date(classTime.getTime() - minutesBefore * 60 * 1000);
      const now = new Date();
      const timeUntilReminder = reminderTime.getTime() - now.getTime();

      if (timeUntilReminder > 0) {
        setTimeout(() => {
          sendClassReminder(time, label, minutesBefore);
        }, timeUntilReminder);
      }
    });
  };

  return {
    setupClassReminders,
    fetchWeeklyProgress,
    fetchMonthlyProgress,
    checkUserInactivity
  };
}

// ============================
// COMPONENTE DE EJEMPLO
// ============================

export function NotificationSetupComponent() {
  const { setupClassReminders, fetchWeeklyProgress, checkUserInactivity } =
    useNotificationIntegration();

  useEffect(() => {
    // Ejecutar verificaciones al montar
    setupClassReminders();
    checkUserInactivity();

    // Ejecutar progreso semanal cada domingo a las 7 PM
    const now = new Date();
    if (now.getDay() === 0) {
      fetchWeeklyProgress();
    }
  }, []);

  return null; // Este componente solo ejecuta lógica
}
