// UBICACIÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œN: /src/components/features/dashboard/AthleteHomeDashboard.new.jsx
// Dashboard Premium para Atletas - DiseÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â±o Visual de Impacto Alto

import React from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useUserStats } from '../../../hooks/useUserStats';
import { useWeeklyStats } from '../../../hooks/useWeeklyStats';
import { useMonthlyStats } from '../../../hooks/useMonthlyStats';
import { useNextClassForAthlete } from '../../../hooks/useNextClassForAthlete';
import { CalendarCheck, Target, User, CheckCircle, Clock, Dumbbell } from '@phosphor-icons/react';
import ProgressRing from './ProgressRing';
import AttendanceHistory from './AttendanceHistory';
import MotivationalMessage from './MotivationalMessage';
import AttendanceConfirmation from './AttendanceConfirmation';
import DashboardCard from '../common/DashboardCard';
import HistoryItem from '../common/HistoryItem';

export default function AthleteHomeDashboard({ onNavigate }) {
  const { user } = useAuth();
  const { weight, bmi, loading: weighLoading } = useUserStats();
  const { weeklyConsistency, loading: weeklyLoading } = useWeeklyStats();
  const { monthlyAttendances, loading: monthlyLoading } = useMonthlyStats();
  const { nextClass, trainer, loading: classLoading } = useNextClassForAthlete(user?.uid || '');

  if (!user) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">Por favor inicia sesiÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â³n</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8" style={{ paddingBottom: '120px' }}>
      
      {/* HEADER - Saludo Personalizado */}
      <div className="mb-8 sm:mb-12">
        <h1 className="text-4xl sm:text-5xl font-black text-gray-900 mb-2">
          ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¡Hola, <span className="text-red-500">{user?.displayName?.split(' ')[0]}</span>!
        </h1>
        <p className="text-lg text-gray-600 font-medium">
          AquÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â­ estÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¡ tu resumen de progreso
        </p>
      </div>

      {/* QUICK NAV BUTTONS */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-8 sm:mb-12">
        <button
          onClick={() => onNavigate && onNavigate('home')}
          className="bg-gradient-to-br from-red-500 to-red-600 text-gray-800 py-3 sm:py-4 rounded-2xl font-black text-sm sm:text-base hover:shadow-lg transition-all hover:scale-105 active:scale-95"
        >
          Principal
        </button>
        <button
          onClick={() => onNavigate && onNavigate('agenda')}
          className="border-2 border-red-500 text-red-500 py-3 sm:py-4 rounded-2xl font-bold text-sm sm:text-base hover:bg-red-50 transition-all"
        >
          Agenda
        </button>
        <button
          onClick={() => onNavigate && onNavigate('profile')}
          className="border-2 border-gray-200 text-gray-900 py-3 sm:py-4 rounded-2xl font-bold text-sm sm:text-base hover:border-red-500 hover:text-red-500 transition-all"
        >
          Perfil
        </button>
      </div>

      {/* ===== FILA 1: TARJETAS PRINCIPALES ===== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-8 sm:mb-12">
        
        {/* CARD 1: Mi Progreso */}
        <DashboardCard title="Mi Progreso" className="md:col-span-1">
          <div className="flex justify-center">
            <ProgressRing />
          </div>
        </DashboardCard>

        {/* CARD 2: PrÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â³xima Clase - DESTACADA */}
        <DashboardCard 
          title="PrÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â³xima Clase" 
          className="md:col-span-1 bg-gradient-to-br from-white via-white to-red-50 relative overflow-hidden"
        >
          {classLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="w-12 h-12 border-4 border-red-200 border-t-red-500 rounded-full animate-spin"></div>
            </div>
          ) : nextClass ? (
            <div className="space-y-4">
              {/* Clase Info */}
              <div>
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">
                  Clase
                </p>
                <h3 className="text-2xl font-black text-gray-900 mb-1">
                  {nextClass.className || 'Boxeo Funcional'}
                </h3>
                <p className="text-sm text-gray-600">
                  Horario: <span className="font-bold">{nextClass.time}:00 hrs</span>
                </p>
              </div>

              {/* Trainer Info */}
              <div className="bg-red-50 rounded-2xl p-4 border border-red-100">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                  Tu Entrenador
                </p>
                <p className="text-lg font-bold text-gray-900">
                  {trainer?.name || 'Por asignar'}
                </p>
              </div>

              {/* CTA Button */}
              <button className="w-full bg-gradient-to-r from-red-500 to-red-600 text-gray-800 py-3 rounded-full font-black text-sm hover:shadow-lg hover:shadow-red-500/30 transition-all active:scale-95">
                ÃƒÆ’Ã‚Â¢Ãƒâ€¦Ã¢â‚¬Å“ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œ Confirmar Asistencia
              </button>
            </div>
          ) : (
            <div className="py-8 text-center">
              <MotivationalMessage />
            </div>
          )}
        </DashboardCard>

        {/* CARD 3: Estado Actual */}
        <DashboardCard 
          title="Tu Estado" 
          className="md:col-span-1"
          subtitle="Datos de hoy"
        >
          <div className="space-y-4">
            {/* Peso */}
            <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                Peso Actual
              </p>
              {weighLoading ? (
                <p className="text-3xl font-black text-gray-400">--</p>
              ) : weight ? (
                <div>
                  <p className="text-3xl font-black text-gray-900">
                    {weight} <span className="text-lg font-bold">kg</span>
                  </p>
                  {bmi && <p className="text-sm text-gray-600 mt-1">IMC: {bmi}</p>}
                </div>
              ) : (
                <p className="text-sm text-gray-500">Sin datos</p>
              )}
            </div>

            {/* Consistencia */}
            <div className="bg-purple-50 rounded-2xl p-4 border border-purple-100">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                Consistencia
              </p>
              <p className="text-3xl font-black text-gray-900">
                {weeklyLoading ? '--' : `${weeklyConsistency}%`}
              </p>
              <p className="text-xs text-gray-600 mt-1">Esta semana</p>
            </div>
          </div>
        </DashboardCard>
      </div>

      {/* ===== FILA 2: MÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â°TRICAS Y HISTORIAL ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        
        {/* CARD: Mis MÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â©tricas */}
        <DashboardCard title="Mis MÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â©tricas" className="lg:col-span-1">
          <div className="space-y-3">
            <HistoryItem 
              label="Asistencias Este Mes"
              value={monthlyLoading ? '--' : monthlyAttendances}
              status="completed"
              icon={<CalendarCheck />}
            />
            <HistoryItem 
              label="Racha Semanal"
              value={weeklyLoading ? '--' : weeklyConsistency}
              status="completed"
              icon={<Target />}
            />
            <HistoryItem 
              label="Peso Registrado"
              value={weighLoading ? '--' : weight ? `${weight} kg` : 'N/A'}
              status={weight ? "completed" : "pending"}
              icon={<User />}
            />
          </div>
        </DashboardCard>

        {/* CARD: Historial de Asistencia */}
        <DashboardCard title="Historial de Asistencia" className="lg:col-span-1">
          <div className="space-y-3">
            <HistoryItem 
              label="Asistencia"
              value="1"
              status="completed"
            />
            <HistoryItem 
              label="Asistencia"
              value="200-3xl"
              status="completed"
            />
            <HistoryItem 
              label="Confirmadas"
              value="5"
              status="completed"
            />
            <HistoryItem 
              label="Faltas"
              value="2"
              status="pending"
            />
          </div>
        </DashboardCard>
      </div>

      {/* Spacer para la nav inferior */}
      <div className="h-20"></div>
    </div>
  );
}

