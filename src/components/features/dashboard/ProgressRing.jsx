// UBICACIÓN: /src/components/features/dashboard/ProgressRing.jsx
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

export default function ProgressRing() {
  const { user } = useAuth();
  const [weeklyData, setWeeklyData] = useState({
    attendances: 0,
    possibleClasses: 7,
    consistency: 0,
    level: 'INICIADO',
    streak: 0,
    message: 'Comienza tu viaje'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      calculateWeeklyProgress();
    }
  }, [user]);

  const calculateWeeklyProgress = async () => {
    try {
      setLoading(true);

      // Obtener rango de esta semana (usando utilidad)
      const { startOfWeek, endOfWeek } = getCurrentWeekRange();

      // Calcular clases disponibles esta semana (sin domingos ni festivos)
      const possibleClasses = calculateEffectiveDays(startOfWeek, endOfWeek);

      // Obtener asistencias del usuario en Firebase
      const userAttendanceRef = collection(db, 'users', user.uid, 'attendance');
      const q = query(userAttendanceRef);
      const querySnapshot = await getDocs(q);

      let weeklyAttendances = 0;

      // Filtrar solo las de esta semana
      querySnapshot.docs.forEach((doc) => {
        const attendanceDate = new Date(doc.data().date);

        if (
          attendanceDate >= startOfWeek &&
          attendanceDate <= endOfWeek &&
          doc.data().attended
        ) {
          weeklyAttendances++;
        }
      });

      // Calcular racha actual
      const streak = await calculateCurrentStreak();

      // Calcular nivel y porcentaje (usando utilidades)
      const consistency = calculateConsistencyPercentage(
        weeklyAttendances,
        possibleClasses
      );

      const { level, message } = getLevelFromConsistency(consistency);

      setWeeklyData({
        attendances: weeklyAttendances,
        possibleClasses,
        consistency,
        level,
        streak,
        message
      });
    } catch (error) {
      console.error('Error calculando progreso:', error);
      // Valores por defecto
      setWeeklyData({
        attendances: 0,
        possibleClasses: 7,
        consistency: 0,
        level: 'INICIADO',
        streak: 0,
        message: 'Comienza tu viaje'
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateCurrentStreak = async () => {
    try {
      const userAttendanceRef = collection(db, 'users', user.uid, 'attendance');
      const q = query(userAttendanceRef);
      const querySnapshot = await getDocs(q);

      // Ordenar por fecha descendente
      const sortedDocs = querySnapshot.docs.sort((a, b) =>
        new Date(b.data().date) - new Date(a.data().date)
      );

      let streak = 0;
      let lastDate = null;

      for (const doc of sortedDocs) {
        if (!doc.data().attended) continue;

        const docDate = new Date(doc.data().date);
        docDate.setHours(0, 0, 0, 0);

        if (lastDate === null) {
          lastDate = docDate;
          streak = 1;
        } else {
          const dayDiff = Math.floor(
            (lastDate - docDate) / (1000 * 60 * 60 * 24)
          );

          if (dayDiff === 1) {
            streak++;
            lastDate = docDate;
          } else {
            break;
          }
        }
      }

      return streak;
    } catch (error) {
      console.error('Error calculando racha:', error);
      return 0;
    }
  };

  // Calcular offset para la rueda (0-100%)
  const circumference = 283.27; // 2 * Math.PI * 45
  const strokeDashoffset = circumference * (1 - weeklyData.consistency / 100);

  // Determinar color basado en nivel
  const getColorClass = () => {
    switch (weeklyData.level) {
      case 'ÉLITE':
        return 'text-brand-gold';
      case 'PRO':
        return 'text-brand-red';
      case 'CONSISTENTE':
        return 'text-orange-400';
      default:
        return 'text-white';
    }
  };

  if (loading) {
    return (
      <div className="relative w-56 h-56 flex items-center justify-center">
        <div className="text-center">
          <span className="text-white/60 text-sm">Cargando progreso...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-56 h-56 flex items-center justify-center">
      {/* SVG del Anillo de Progreso */}
      <svg className="w-full h-full rotate-[-90deg]" viewBox="0 0 100 100">
        {/* Círculo base (gris oscuro) */}
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="#171717"
          strokeWidth="8"
        />
        {/* Círculo de progreso (Gradiente Dorado/Rojo) */}
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="url(#progressGradient)"
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-1000 ease-out"
          strokeLinecap="round"
        />
        {/* Definición del Gradiente */}
        <defs>
          <linearGradient
            id="progressGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="0%"
          >
            <stop offset="0%" stopColor="#E30613" />
            <stop offset="100%" stopColor="#CBA135" />
          </linearGradient>
        </defs>
      </svg>

      {/* CONTENIDO CENTRAL DEL NÚCLEO */}
      <div className="absolute text-center z-10">
        <span className="block text-brand-gold text-xs font-bold uppercase tracking-widest mb-1">
          Esta Semana
        </span>
        <span className={`block text-5xl font-black leading-none ${getColorClass()}`}>
          {weeklyData.level}
        </span>
        
        {/* Porcentaje en la mitad */}
        <div className="mt-3 flex flex-col items-center gap-1">
          <span className="block text-2xl font-bold text-white">
            {weeklyData.consistency}%
          </span>
          <span className="block text-xs text-gray-400">
            {weeklyData.attendances}/{weeklyData.possibleClasses} clases
          </span>
        </div>

        {/* Racha */}
        {weeklyData.streak > 0 && (
          <div className="mt-2 inline-block bg-brand-red/20 border border-brand-red rounded-full px-2 py-1">
            <span className="text-xs text-brand-red font-bold">
              🔥 {weeklyData.streak} días consecutivos
            </span>
          </div>
        )}
      </div>

      {/* Mensaje motivador debajo */}
      <div className="absolute -bottom-16 text-center">
        <span className="text-sm text-white/80 font-medium">
          {weeklyData.message}
        </span>
      </div>
    </div>
  );
}
