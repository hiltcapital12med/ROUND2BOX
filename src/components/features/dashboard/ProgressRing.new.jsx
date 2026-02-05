import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { db } from '../../../services/firebase';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import {
  getCurrentWeekRange,
  calculateEffectiveDays,
  calculateConsistencyPercentage,
  getLevelFromConsistency
} from '../../../utils/dateUtils';

/**
 * ProgressRing - Anillo de progreso con diseÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â±o premium rojo
 * Muestra el porcentaje de consistencia del usuario
 */
export default function ProgressRing() {
  const { user } = useAuth();
  const [monthlyData, setMonthlyData] = useState({
    attendances: 0,
    paidClasses: 0,
    isUnlimited: false,
    percentage: 0,
    level: 'INICIADO',
    streak: 0,
    message: 'Comienza tu viaje',
    classesRemaining: 0,
    isExpired: false
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      calculateMonthlyProgress();
    }
  }, [user]);

  const calculateMonthlyProgress = async () => {
    try {
      setLoading(true);

      // Obtener datos del usuario (clases pagadas)
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      const userData = userDoc.data() || {};
      
      const currentMonth = new Date().toISOString().slice(0, 7); // "2026-01"
      const paidClassesMonth = userData.paidClassesMonth || '';
      const paidClasses = userData.paidClasses ?? 0;
      
      // Verificar si el paquete es del mes actual
      const isCurrentMonth = paidClassesMonth === currentMonth;
      const activePaidClasses = isCurrentMonth ? paidClasses : 0;
      const isUnlimited = activePaidClasses === -1;

      // Obtener inicio y fin del mes actual
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

      // Obtener asistencias del mes
      const userAttendanceRef = collection(db, 'users', user.uid, 'attendance');
      const querySnapshot = await getDocs(query(userAttendanceRef));

      let monthlyAttendances = 0;
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const attendanceDate = data.date?.toDate?.() || new Date(data.date);
        if (attendanceDate >= startOfMonth && attendanceDate <= endOfMonth) {
          monthlyAttendances++;
        }
      });

      // Calcular consistencia semanal
      const { startDate: weekStart, endDate: weekEnd } = getCurrentWeekRange();
      const weeklySnapshot = await getDocs(
        query(
          userAttendanceRef,
          where('date', '>=', weekStart),
          where('date', '<=', weekEnd)
        )
      );
      const weeklyCount = weeklySnapshot.size;
      const effectiveDays = calculateEffectiveDays(weekStart, weekEnd, new Date());
      const consistencyPercentage = calculateConsistencyPercentage(weeklyCount, effectiveDays);

      // Calcular clases restantes
      const classesRemaining = isUnlimited ? Infinity : Math.max(0, activePaidClasses - monthlyAttendances);

      setMonthlyData({
        attendances: monthlyAttendances,
        paidClasses: activePaidClasses,
        isUnlimited,
        percentage: consistencyPercentage,
        level: getLevelFromConsistency(consistencyPercentage),
        streak: weeklyCount,
        message: consistencyPercentage >= 80 ? 'ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¡Vas en el camino correcto!' : 'ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¡Puedes mejorar!',
        classesRemaining,
        isExpired: !isCurrentMonth
      });
    } catch (error) {
      console.error('Error calculating progress:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="w-20 h-20 border-4 border-red-200 border-t-red-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Calcular ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¡ngulo para SVG
  const circumference = 2 * Math.PI * 85;
  const strokeDashoffset = circumference - (monthlyData.percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center w-full">
      {/* SVG Circular Progress */}
      <div className="relative w-64 h-64 flex items-center justify-center mb-6">
        <svg 
          className="transform -rotate-90" 
          width="256" 
          height="256" 
          viewBox="0 0 256 256"
        >
          {/* CÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â­rculo de fondo */}
          <circle
            cx="128"
            cy="128"
            r="85"
            fill="none"
            stroke="#f3f4f6"
            strokeWidth="16"
          />
          
          {/* Anillo de progreso - ROJO INTENSO */}
          <circle
            cx="128"
            cy="128"
            r="85"
            fill="none"
            stroke="#ef4444"
            strokeWidth="16"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{
              transition: 'stroke-dashoffset 0.6s ease-in-out'
            }}
            filter="drop-shadow(0 0 8px rgba(239, 68, 68, 0.4))"
          />
        </svg>

        {/* Contenido Central */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <div className="text-5xl font-black text-gray-900 mb-1">
            {Math.round(monthlyData.percentage)}%
          </div>
          <div className="text-sm font-medium text-gray-600">
            {monthlyData.percentage > 75 ? 'ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¡Excelente!' : 'Muy Bien'}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="text-center space-y-2 mb-4">
        <div>
          <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
            Consistencia Semanal
          </p>
          <p className="text-2xl font-black text-gray-900">
            {monthlyData.streak} clases
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
            Nivel
          </p>
          <p className="text-lg font-bold text-red-500">
            {monthlyData.level}
          </p>
        </div>
      </div>

      {/* Mensaje motivacional */}
      <p className="text-sm text-gray-700 font-medium text-center px-4">
        {monthlyData.message}
      </p>
    </div>
  );
}

