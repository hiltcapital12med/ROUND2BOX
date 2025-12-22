// UBICACIÓN: /src/components/features/dashboard/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { Users, CalendarCheck, ChartLine, Warning, Shield, Gear, Heartbeat, Clock } from '@phosphor-icons/react';
import { db } from '../../../services/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalClasses: 0,
    avgAttendance: 0,
    inactiveUsers: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAdminStats();
  }, []);

  const loadAdminStats = async () => {
    try {
      // Obtener usuarios
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const totalUsers = usersSnapshot.size;

      // Simular datos (en producción, estos vendrían de Firestore)
      const activeUsers = Math.floor(totalUsers * 0.8);
      const inactiveUsers = totalUsers - activeUsers;
      const totalClasses = 24; // Total de clases en la semana
      const avgAttendance = 78; // Promedio de asistencia

      setStats({
        totalUsers,
        activeUsers,
        totalClasses,
        avgAttendance,
        inactiveUsers
      });
    } catch (error) {
      console.error('Error cargando estadísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pb-20">
      {/* ENCABEZADO ADMIN */}
      <div className="mb-8 animate-fade-in-down">
        <div className="flex items-center gap-2 mb-2">
          <Shield size={28} className="text-brand-red" weight="fill" />
          <h1 className="text-3xl font-black text-white leading-none">
            Panel de <span className="text-brand-red">Admin</span>
          </h1>
        </div>
        <p className="text-white/70 text-sm font-medium mt-2 flex items-center gap-2">
          <span className="inline-block w-2 h-2 bg-brand-red rounded-full animate-pulse"></span>
          Gestor del sistema • Control total
        </p>
      </div>

      {/* TARJETAS DE ESTADÍSTICAS PRINCIPALES */}
      <div className="grid grid-cols-2 gap-4 mb-8 animate-fade-in">
        {/* Total de Usuarios */}
        <div className="bg-gradient-to-br from-brand-red/20 to-brand-red/5 border border-brand-red/30 rounded-2xl p-4 hover:border-brand-red/60 transition-all">
          <Users size={24} className="text-brand-red mb-3" weight="duotone" />
          <span className="block text-3xl font-black text-white">{stats.totalUsers}</span>
          <span className="text-xs text-white/60">Usuarios Totales</span>
        </div>

        {/* Usuarios Activos */}
        <div className="bg-gradient-to-br from-brand-gold/20 to-brand-gold/5 border border-brand-gold/30 rounded-2xl p-4 hover:border-brand-gold/60 transition-all">
          <Users size={24} className="text-brand-gold mb-3" weight="duotone" />
          <span className="block text-3xl font-black text-white">{stats.activeUsers}</span>
          <span className="text-xs text-white/60">Activos Hoy</span>
        </div>

        {/* Clases Semanales */}
        <div className="bg-gradient-to-br from-blue-500/20 to-blue-500/5 border border-blue-500/30 rounded-2xl p-4 hover:border-blue-500/60 transition-all">
          <CalendarCheck size={24} className="text-blue-400 mb-3" weight="duotone" />
          <span className="block text-3xl font-black text-white">{stats.totalClasses}</span>
          <span className="text-xs text-white/60">Clases/Semana</span>
        </div>

        {/* Asistencia Promedio */}
        <div className="bg-gradient-to-br from-green-500/20 to-green-500/5 border border-green-500/30 rounded-2xl p-4 hover:border-green-500/60 transition-all">
          <ChartLine size={24} className="text-green-400 mb-3" weight="duotone" />
          <span className="block text-3xl font-black text-white">{stats.avgAttendance}%</span>
          <span className="text-xs text-white/60">Asistencia Prom</span>
        </div>
      </div>

      {/* ALERTAS Y NOTIFICACIONES */}
      <div className="mb-8 space-y-4 animate-fade-in-up">
        {/* Alerta de usuarios inactivos */}
        {stats.inactiveUsers > 0 && (
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-2xl p-4 flex gap-3">
            <Warning size={24} className="text-yellow-400 flex-shrink-0 mt-0.5" weight="fill" />
            <div>
              <h3 className="text-white font-bold text-sm">Usuarios Inactivos</h3>
              <p className="text-yellow-300/80 text-xs mt-1">
                {stats.inactiveUsers} usuario{stats.inactiveUsers > 1 ? 's' : ''} no han asistido en los últimos 7 días
              </p>
            </div>
          </div>
        )}

        {/* Recordatorio de mantenimiento */}
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-2xl p-4 flex gap-3">
          <Clock size={24} className="text-blue-400 flex-shrink-0 mt-0.5" weight="fill" />
          <div>
            <h3 className="text-white font-bold text-sm">Tareas del Día</h3>
            <p className="text-blue-300/80 text-xs mt-1">
              Revisa la asistencia de las clases del día y actualiza los registros
            </p>
          </div>
        </div>
      </div>

      {/* ACCIONES ADMINISTRATIVAS */}
      <div className="space-y-4 mb-8 animate-fade-in-up">
        {/* Gestionar Usuarios */}
        <button className="w-full group relative bg-gradient-to-br from-brand-charcoal to-brand-dark border border-brand-red/30 rounded-2xl p-6 overflow-hidden transition-all hover:border-brand-red/60">
          <div className="absolute inset-0 bg-gradient-to-r from-brand-red/0 via-brand-red/10 to-brand-red/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
          <div className="relative z-10 flex justify-between items-center">
            <div className="text-left">
              <h3 className="text-white font-bold">Gestionar Usuarios</h3>
              <p className="text-white/60 text-sm">Ver, editar o eliminar usuarios del sistema</p>
            </div>
            <Users size={24} className="text-brand-red flex-shrink-0" weight="duotone" />
          </div>
        </button>

        {/* Gestionar Entrenadores */}
        <button className="w-full group relative bg-gradient-to-br from-brand-charcoal to-brand-dark border border-brand-gold/30 rounded-2xl p-6 overflow-hidden transition-all hover:border-brand-gold/60">
          <div className="absolute inset-0 bg-gradient-to-r from-brand-gold/0 via-brand-gold/10 to-brand-gold/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
          <div className="relative z-10 flex justify-between items-center">
            <div className="text-left">
              <h3 className="text-white font-bold">Gestionar Entrenadores</h3>
              <p className="text-white/60 text-sm">Asignar roles y permisos a trainers</p>
            </div>
            <Shield size={24} className="text-brand-gold flex-shrink-0" weight="duotone" />
          </div>
        </button>

        {/* Reportes y Análisis */}
        <button className="w-full group relative bg-gradient-to-br from-brand-charcoal to-brand-dark border border-blue-500/30 rounded-2xl p-6 overflow-hidden transition-all hover:border-blue-500/60">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/10 to-blue-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
          <div className="relative z-10 flex justify-between items-center">
            <div className="text-left">
              <h3 className="text-white font-bold">Reportes y Análisis</h3>
              <p className="text-white/60 text-sm">Descargar informes de asistencia y progreso</p>
            </div>
            <ChartLine size={24} className="text-blue-400 flex-shrink-0" weight="duotone" />
          </div>
        </button>

        {/* Configuración del Sistema */}
        <button className="w-full group relative bg-gradient-to-br from-brand-charcoal to-brand-dark border border-white/10 rounded-2xl p-6 overflow-hidden transition-all hover:border-white/30">
          <div className="relative z-10 flex justify-between items-center">
            <div className="text-left">
              <h3 className="text-white font-bold">Configuración del Sistema</h3>
              <p className="text-white/60 text-sm">Ajustar horarios, cupos y políticas</p>
            </div>
            <Gear size={24} className="text-white/60 flex-shrink-0" weight="duotone" />
          </div>
        </button>
      </div>

      {/* RESUMEN RÁPIDO */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 animate-fade-in-up">
        <h3 className="text-white font-bold mb-4 flex items-center gap-2">
          <Heartbeat size={20} className="text-brand-gold" />
          Resumen Rápido
        </h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between items-center pb-3 border-b border-white/5">
            <span className="text-white/70">Tasa de asistencia promedio</span>
            <span className="text-white font-bold text-lg">{stats.avgAttendance}%</span>
          </div>
          <div className="flex justify-between items-center pb-3 border-b border-white/5">
            <span className="text-white/70">Usuarios nuevos (últimos 7 días)</span>
            <span className="text-white font-bold text-lg">+3</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-white/70">Próximas clases (hoy)</span>
            <span className="text-white font-bold text-lg">4</span>
          </div>
        </div>
      </div>
    </div>
  );
}
