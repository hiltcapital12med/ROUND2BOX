// UBICACIÓN: /src/components/features/dashboard/AthleteProgressCard.jsx
// Tarjeta de progreso semanal del atleta (Vista del Entrenador/Admin)

import React, { useState, useEffect } from 'react';
import { db } from '../../../services/firebase';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { TrendingUp, Target, Flame } from '@phosphor-icons/react';

export default function AthleteProgressCard({ athleteId, athleteName = 'Atleta' }) {
  const [progress, setProgress] = useState({
    consistency: 0,
    attendances: 0,
    totalClasses: 0,
    streak: 0,
    level: 'INICIADO'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (athleteId) {
      calculateAthleteProgress();
    }
  }, [athleteId]);

  const calculateAthleteProgress = async () => {
    try {
      setLoading(true);

      // Obtener rango de esta semana
      const today = new Date();
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay());
      startOfWeek.setHours(0, 0, 0, 0);

      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      endOfWeek.setHours(23, 59, 59, 999);

      // Obtener asistencias del atleta
      const attendanceRef = collection(db, 'users', athleteId, 'attendance');
      const snapshot = await getDocs(attendanceRef);

      let weeklyAttendances = 0;
      let streak = 0;

      // Contar asistencias de esta semana
      snapshot.docs.forEach((doc) => {
        const date = new Date(doc.data().date);
        if (date >= startOfWeek && date <= endOfWeek && doc.data().attended) {
          weeklyAttendances++;
        }
      });

      // Calcular clases disponibles (simplificado)
      const possibleClasses = 7; // Lunes a sábado
      const consistency = Math.round((weeklyAttendances / possibleClasses) * 100);

      // Calcular racha
      const sortedDocs = snapshot.docs.sort((a, b) =>
        new Date(b.data().date) - new Date(a.data().date)
      );

      let lastDate = null;
      for (const doc of sortedDocs) {
        if (!doc.data().attended) continue;
        const docDate = new Date(doc.data().date);
        docDate.setHours(0, 0, 0, 0);

        if (lastDate === null) {
          lastDate = docDate;
          streak = 1;
        } else {
          const dayDiff = Math.floor((lastDate - docDate) / (1000 * 60 * 60 * 24));
          if (dayDiff === 1) {
            streak++;
            lastDate = docDate;
          } else {
            break;
          }
        }
      }

      // Determinar nivel
      let level = 'PRINCIPIANTE';
      if (consistency >= 85) level = 'ÉLITE';
      else if (consistency >= 70) level = 'PRO';
      else if (consistency >= 50) level = 'CONSISTENTE';
      else if (consistency >= 25) level = 'INICIADO';

      setProgress({
        consistency,
        attendances: weeklyAttendances,
        totalClasses: possibleClasses,
        streak,
        level
      });
    } catch (error) {
      console.error('Error calculando progreso del atleta:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-brand-charcoal border border-white/10 rounded-lg p-4 animate-pulse">
        <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-700 rounded w-1/2"></div>
      </div>
    );
  }

  const getColorClass = () => {
    switch (progress.level) {
      case 'ÉLITE':
        return 'bg-brand-gold/10 border-brand-gold text-brand-gold';
      case 'PRO':
        return 'bg-brand-red/10 border-brand-red text-brand-red';
      case 'CONSISTENTE':
        return 'bg-orange-500/10 border-orange-500 text-orange-400';
      default:
        return 'bg-white/5 border-white/10 text-white/60';
    }
  };

  return (
    <div className={`border rounded-lg p-3 transition-all ${getColorClass()}`}>
      <div className="flex items-center justify-between mb-2">
        <div>
          <p className="text-sm font-bold text-white">{athleteName}</p>
          <p className="text-xs text-white/60">{progress.level}</p>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold">{progress.consistency}%</p>
          <p className="text-xs text-white/60">{progress.attendances}/{progress.totalClasses}</p>
        </div>
      </div>

      {/* Barra de progreso mini */}
      <div className="w-full h-1 bg-black/30 rounded-full overflow-hidden mb-2">
        <div
          className={`h-full ${
            progress.level === 'ÉLITE'
              ? 'bg-brand-gold'
              : progress.level === 'PRO'
              ? 'bg-brand-red'
              : 'bg-orange-400'
          }`}
          style={{ width: `${progress.consistency}%` }}
        ></div>
      </div>

      {/* Racha */}
      {progress.streak > 0 && (
        <div className="flex items-center gap-1 text-xs">
          <Flame size={12} className="text-brand-red" />
          <span>{progress.streak} días</span>
        </div>
      )}
    </div>
  );
}
