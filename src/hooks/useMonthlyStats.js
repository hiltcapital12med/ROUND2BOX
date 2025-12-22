// UBICACIÓN: /src/hooks/useMonthlyStats.js
// Hook para obtener estadísticas mensuales del usuario

import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../services/firebase';
import { useAuth } from '../context/AuthContext';
import {
  getCurrentMonthRange,
  calculateEffectiveDays,
  calculateConsistencyPercentage
} from '../utils/dateUtils';

export function useMonthlyStats() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    monthlyAttendances: 0,
    monthlyPossibleClasses: 0,
    monthlyConsistency: 0,
    loading: true,
    error: null
  });

  useEffect(() => {
    const loadMonthlyStats = async () => {
      if (!user) {
        setStats(prev => ({ ...prev, loading: false }));
        return;
      }

      try {
        setStats(prev => ({ ...prev, loading: true, error: null }));

        // Obtener rango del mes actual (usando utilidad reutilizable)
        const { startOfMonth, endOfMonth } = getCurrentMonthRange();

        // Obtener todas las asistencias del usuario
        const userAttendanceRef = collection(db, 'users', user.uid, 'attendance');
        const querySnapshot = await getDocs(userAttendanceRef);

        let monthlyAttendances = 0;

        querySnapshot.docs.forEach((doc) => {
          const attendanceData = doc.data();
          const attendanceDate = new Date(attendanceData.date);

          if (
            attendanceDate >= startOfMonth &&
            attendanceDate <= endOfMonth
          ) {
            if (attendanceData.attended) {
              monthlyAttendances++;
            }
          }
        });

        // Calcular días efectivos del mes (sin domingos ni festivos)
        const monthlyPossibleClasses = calculateEffectiveDays(
          startOfMonth,
          endOfMonth
        );

        // Calcular consistencia mensual
        const monthlyConsistency = calculateConsistencyPercentage(
          monthlyAttendances,
          monthlyPossibleClasses
        );

        setStats({
          monthlyAttendances,
          monthlyPossibleClasses,
          monthlyConsistency,
          loading: false,
          error: null
        });

        console.log('✅ Stats mensuales cargadas:', {
          monthlyAttendances,
          monthlyPossibleClasses,
          monthlyConsistency: monthlyConsistency + '%'
        });
      } catch (error) {
        console.error('Error cargando stats mensuales:', error);
        setStats(prev => ({
          ...prev,
          loading: false,
          error: error.message
        }));
      }
    };

    loadMonthlyStats();
  }, [user]);

  return stats;
}
