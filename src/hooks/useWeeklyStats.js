// UBICACIÓN: /src/hooks/useWeeklyStats.js
// Hook para obtener estadísticas semanales del usuario

import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../services/firebase';
import { useAuth } from '../context/AuthContext';
import {
  getCurrentWeekRange,
  calculateEffectiveDays,
  calculateConsistencyPercentage,
  getLevelFromConsistency
} from '../utils/dateUtils';

export function useWeeklyStats() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    weeklyAttendances: 0,
    weeklyPossibleClasses: 0,
    weeklyConsistency: 0,
    weeklyStreak: 0,
    level: 'INICIADO',
    loading: true,
    error: null
  });

  useEffect(() => {
    const loadWeeklyStats = async () => {
      if (!user) {
        setStats(prev => ({ ...prev, loading: false }));
        return;
      }

      try {
        setStats(prev => ({ ...prev, loading: true, error: null }));

        // Obtener rango de esta semana (usando utilidad reutilizable)
        const { startOfWeek, endOfWeek } = getCurrentWeekRange();

        // Obtener todas las asistencias del usuario
        const userAttendanceRef = collection(db, 'users', user.uid, 'attendance');
        const querySnapshot = await getDocs(userAttendanceRef);

        let weeklyAttendances = 0;

        querySnapshot.docs.forEach((doc) => {
          const attendanceData = doc.data();
          const attendanceDate = new Date(attendanceData.date);

          if (
            attendanceDate >= startOfWeek &&
            attendanceDate <= endOfWeek &&
            attendanceData.attended
          ) {
            weeklyAttendances++;
          }
        });

        // Calcular días efectivos de esta semana
        const weeklyPossibleClasses = calculateEffectiveDays(
          startOfWeek,
          endOfWeek
        );

        // Calcular consistencia semanal
        const weeklyConsistency = calculateConsistencyPercentage(
          weeklyAttendances,
          weeklyPossibleClasses
        );

        // Determinar nivel según consistencia (usando utilidad)
        const { level } = getLevelFromConsistency(weeklyConsistency);

        // Calcular racha
        const streak = await calculateCurrentStreak();

        setStats({
          weeklyAttendances,
          weeklyPossibleClasses,
          weeklyConsistency,
          weeklyStreak: streak,
          level,
          loading: false,
          error: null
        });

        console.log('✅ Stats semanales cargadas:', {
          weeklyAttendances,
          weeklyPossibleClasses,
          weeklyConsistency: weeklyConsistency + '%',
          level,
          streak
        });
      } catch (error) {
        console.error('Error cargando stats semanales:', error);
        setStats(prev => ({
          ...prev,
          loading: false,
          error: error.message
        }));
      }
    };

    loadWeeklyStats();
  }, [user]);

  return stats;
}

/**
 * Calcula la racha actual (días consecutivos con asistencia)
 */
async function calculateCurrentStreak() {
  // Por ahora retorna 0, podría implementarse más adelante
  return 0;
}
