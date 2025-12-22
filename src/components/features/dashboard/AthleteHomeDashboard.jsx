// UBICACIÓN: /src/components/features/dashboard/AthleteHomeDashboard.jsx
// Dashboard de inicio para atletas con datos dinámicos desde Firebase

import React from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useUserStats } from '../../../hooks/useUserStats';
import { useWeeklyStats } from '../../../hooks/useWeeklyStats';
import { useMonthlyStats } from '../../../hooks/useMonthlyStats';
import { CalendarCheck, Target, User } from '@phosphor-icons/react';
import ProgressRing from './ProgressRing';

export default function AthleteHomeDashboard() {
  const { user } = useAuth();
  const { weight, bmi, loading: weighLoading } = useUserStats();
  const { weeklyConsistency, loading: weeklyLoading } = useWeeklyStats();
  const { monthlyAttendances, loading: monthlyLoading } = useMonthlyStats();

  return (
    <div className="flex flex-col h-full">
      {/* 1. ENCABEZADO PERSONALIZADO */}
      <div className="mb-8 animate-fade-in-down">
        <h1 className="text-3xl font-black text-white leading-none relative z-10">
          Hola, <span className="text-brand-red">{user.displayName?.split(' ')[0]}</span>
        </h1>
        <p className="text-white/70 text-sm font-medium mt-2 flex items-center gap-2">
          <span className="inline-block w-2 h-2 bg-brand-red rounded-full animate-pulse"></span>
          Racha de 3 días activa. No pares.
        </p>
      </div>

      {/* 2. EL NÚCLEO DEL ATLETA (Visualización Central) */}
      <div className="flex-grow flex flex-col items-center justify-center mb-8 relative animate-fade-in">
        {/* Círculos de fondo decorativos (Dinamismo) */}
        <div className="absolute w-64 h-64 bg-brand-red/10 rounded-full blur-3xl -z-10"></div>
        <div className="absolute w-48 h-48 bg-brand-gold/5 rounded-full blur-2xl -z-10"></div>

        {/* COMPONENTE DE RUEDA DINÁMICA */}
        <ProgressRing />
      </div>

      {/* 3. PRÓXIMA ACCIÓN IMPACTANTE */}
      <div className="mb-8 animate-fade-in-up">
        <div className="group relative bg-gradient-to-br from-brand-charcoal to-brand-dark border border-brand-gold/30 rounded-2xl p-6 overflow-hidden transition-all hover:border-brand-red/50">
          {/* Efecto de brillo al pasar el mouse */}
          <div className="absolute inset-0 bg-gradient-to-r from-brand-red/0 via-brand-red/10 to-brand-red/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>

          <div className="relative z-10 flex justify-between items-center">
            <div>
              <span className="inline-block bg-brand-red text-white text-[10px] font-bold px-2 py-0.5 rounded mb-2 uppercase">HOY • 18:00</span>
              <h3 className="text-2xl font-bold text-white">Boxeo Funcional</h3>
              <p className="text-white/60 text-sm">Coach Mike</p>
            </div>
            {/* Botón de Acción Dinámico */}
            <button className="bg-brand-red text-white p-4 rounded-full shadow-lg shadow-brand-red/20 hover:scale-105 transition-transform flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* 4. MÉTRICAS CLAVE (Dinámicas desde Firebase) */}
      <div className="grid grid-cols-3 gap-4 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
        {/* Métrica 1 - Asistencias del Mes */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center relative hover:bg-white/10 transition-colors">
          {/* Indicador de estado */}
          <div 
            className={`absolute top-2 right-2 w-2 h-2 rounded-full ${
              monthlyLoading ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'
            }`}
          ></div>
          <CalendarCheck size={24} className="text-brand-gold mx-auto mb-2" weight="duotone" />
          {monthlyLoading ? (
            <span className="block text-2xl font-bold text-white/60">--</span>
          ) : (
            <span className="block text-2xl font-bold text-white">{monthlyAttendances}</span>
          )}
          <span className="text-xs text-white/60">Asistencias Mes</span>
        </div>

        {/* Métrica 2 - Objetivo Semanal (%) */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center relative hover:bg-white/10 transition-colors">
          {/* Indicador de estado */}
          <div 
            className={`absolute top-2 right-2 w-2 h-2 rounded-full ${
              weeklyLoading ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'
            }`}
          ></div>
          <Target size={24} className="text-brand-red mx-auto mb-2" weight="duotone" />
          {weeklyLoading ? (
            <span className="block text-2xl font-bold text-white/60">--</span>
          ) : (
            <span className="block text-2xl font-bold text-white">{weeklyConsistency}%</span>
          )}
          <span className="text-xs text-white/60">Obj. Semanal</span>
        </div>

        {/* Métrica 3 - Peso Actual (Dinámico desde Firebase) */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center relative hover:bg-white/10 transition-colors">
          {/* Indicador de estado */}
          <div 
            className={`absolute top-2 right-2 w-2 h-2 rounded-full ${
              weighLoading ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'
            }`}
          ></div>
          
          <User size={24} className="text-brand-gold mx-auto mb-2" weight="duotone" />
          
          {weighLoading ? (
            <span className="block text-xl font-bold text-white/60">--</span>
          ) : weight ? (
            <span className="block text-xl font-bold text-white">
              {weight} <span className="text-sm font-normal">kg</span>
            </span>
          ) : (
            <span className="block text-sm font-bold text-white/60">Sin datos</span>
          )}
          
          <span className="text-xs text-white/60">Peso Actual</span>
          
          {bmi && weight && (
            <span className="block text-xs text-white/40 mt-1">IMC: {bmi}</span>
          )}
        </div>
      </div>
    </div>
  );
}
