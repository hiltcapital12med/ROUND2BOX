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
  // Radio de 40 en SVG viewBox de 100x100
  const circumference = 2 * Math.PI * 40; // 251.33
  const strokeDashoffset = circumference * (1 - weeklyData.consistency / 100);

  if (loading) {
    return (
      <div className="relative w-56 h-56 flex items-center justify-center">
        <div className="text-center">
          <span className="text-gray-800/60 text-sm">Cargando progreso...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center gap-8">
      {/* TARJETA CONTENEDORA */}
      <div className="w-full bg-white rounded-3xl border border-gray-200 p-12 shadow-sm">
        
        {/* ENCABEZADO */}
        <div className="text-center mb-8">
          <span className="inline-block text-brand-secondary text-xs font-bold uppercase tracking-widest px-3 py-1 bg-brand-secondary/10 rounded-full mb-2">
            Esta Semana
          </span>
          <h3 className="text-gray-800 text-lg font-bold">Tu Progreso</h3>
        </div>

        {/* CONTENEDOR CENTRAL - CÍRCULO DE PROGRESO */}
        <div className="flex flex-col items-center gap-6">
          
          {/* SVG del Anillo de Progreso - CENTRADO */}
          <div className="relative w-64 h-64 flex items-center justify-center">
            {/* SVG del anillo */}
            <svg className="w-full h-full rotate-[-90deg] absolute" viewBox="0 0 100 100">
              {/* Círculo base (gris claro) */}
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="6"
              />
              {/* Círculo de progreso (Gradiente nuevo) */}
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="url(#progressGradient)"
                strokeWidth="6"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-1000 ease-out"
                strokeLinecap="round"
              />
              {/* Definición del Gradiente - Nueva Paleta */}
              <defs>
                <linearGradient
                  id="progressGradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="0%"
                >
                  <stop offset="0%" stopColor="#d8315b" />
                  <stop offset="50%" stopColor="#e85a7f" />
                  <stop offset="100%" stopColor="#3e92cc" />
                </linearGradient>
              </defs>
            </svg>

            {/* CONTENIDO DENTRO DEL CÍRCULO */}
            <div className="absolute text-center z-10">
              <div className="text-5xl font-black text-gray-800 leading-none mb-2">
                {weeklyData.consistency}%
              </div>
              <div className="text-sm text-gray-600 font-medium">
                de asistencia
              </div>
            </div>
          </div>

          {/* MENSAJE MOTIVADOR DEBAJO */}
          <div className="text-center pt-2">
            <span className="text-sm text-gray-700 font-medium italic">
              "{weeklyData.message}"
            </span>
          </div>

        </div>
      </div>
    </div>
  );
}
