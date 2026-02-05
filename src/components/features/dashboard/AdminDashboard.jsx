// UBICACIÓN: /src/components/features/dashboard/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { Users, CalendarCheck, ChartLine, Warning, Shield, Gear, Heartbeat, Clock } from '@phosphor-icons/react';
import { db } from '../../../services/firebase';
import { collection, getDocs, query, where, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import DailyReport from './reports/DailyReport';
import WeeklyReport from './reports/WeeklyReport';
import MonthlyReport from './reports/MonthlyReport';
import ScheduleConfig from './ScheduleConfig';

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
  const [activeModal, setActiveModal] = useState(null); // 'users', 'trainers', 'reports', 'config'
  const [allUsers, setAllUsers] = useState([]);
  const [reportType, setReportType] = useState(null); // 'daily', 'weekly', 'monthly'
  const [editingTrainer, setEditingTrainer] = useState(null);
  const [trainerFormData, setTrainerFormData] = useState({});

  useEffect(() => {
    loadAdminStats();
  }, []);

  const loadAdminStats = async () => {
    try {
      // Obtener todos los usuarios
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const allUsersData = usersSnapshot.docs.map(doc => ({ ...doc.data(), uid: doc.id }));

      // Guardar todos los usuarios
      setAllUsers(allUsersData);

      // Contar solo atletas (role === 'user')
      const athletes = allUsersData.filter(user => user.role === 'user');
      const totalUsers = athletes.length;

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

  // Funciones para gestión de entrenadores
  const handleDeleteTrainer = async (trainerId) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este entrenador?')) {
      try {
        await deleteDoc(doc(db, 'users', trainerId));
        setAllUsers(allUsers.filter(u => u.uid !== trainerId));
        alert('Entrenador eliminado exitosamente');
      } catch (error) {
        console.error('Error eliminando entrenador:', error);
        alert('Error al eliminar el entrenador');
      }
    }
  };

  const handleEditTrainer = (trainer) => {
    setEditingTrainer(trainer.uid);
    setTrainerFormData({
      name: trainer.name || '',
      email: trainer.email || '',
      specialization: trainer.specialization || ''
    });
  };

  const handleSaveTrainer = async () => {
    if (!editingTrainer) return;
    try {
      await updateDoc(doc(db, 'users', editingTrainer), trainerFormData);
      
      // Actualizar en el estado local
      setAllUsers(allUsers.map(u => 
        u.uid === editingTrainer ? { ...u, ...trainerFormData } : u
      ));
      
      setEditingTrainer(null);
      setTrainerFormData({});
      alert('Entrenador actualizado exitosamente');
    } catch (error) {
      console.error('Error actualizando entrenador:', error);
      alert('Error al actualizar el entrenador');
    }
  };

  // Función para eliminar usuario
  const handleDeleteUser = async (userId) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      try {
        await deleteDoc(doc(db, 'users', userId));
        setAllUsers(allUsers.filter(u => u.uid !== userId));
        alert('Usuario eliminado exitosamente');
      } catch (error) {
        console.error('Error eliminando usuario:', error);
        alert('Error al eliminar el usuario');
      }
    }
  };

  return (
    <div className="pb-20">
      {/* ENCABEZADO ADMIN */}
      <div className="mb-8 animate-fade-in-down">
        <div className="flex items-center gap-2 mb-2">
          <Shield size={28} className="text-brand-accent" weight="fill" />
          <h1 className="text-3xl font-black text-gray-800 leading-none">
            Panel de <span className="text-brand-accent">Admin</span>
          </h1>
        </div>
        <p className="text-gray-800/70 text-sm font-medium mt-2 flex items-center gap-2">
          <span className="inline-block w-2 h-2 bg-brand-accent rounded-full animate-pulse"></span>
          Gestor del sistema • Control total
        </p>
      </div>

      {/* TARJETAS DE ESTADÍSTICAS PRINCIPALES */}
      <div className="grid grid-cols-2 gap-4 mb-8 animate-fade-in">
        {/* Total de Usuarios */}
        <div className="bg-gradient-to-br from-brand-accent/20 to-brand-accent/5 border border-brand-accent/30 rounded-2xl p-4 hover:border-brand-accent/60 transition-all">
          <Users size={24} className="text-brand-accent mb-3" weight="duotone" />
          <span className="block text-3xl font-black text-gray-800">{stats.totalUsers}</span>
          <span className="text-xs text-gray-800/60">Usuarios Totales</span>
        </div>

        {/* Usuarios Activos */}
        <div className="bg-gradient-to-br from-brand-secondary/20 to-brand-secondary/5 border border-brand-secondary/30 rounded-2xl p-4 hover:border-brand-secondary/60 transition-all">
          <Users size={24} className="text-brand-secondary mb-3" weight="duotone" />
          <span className="block text-3xl font-black text-gray-800">{stats.activeUsers}</span>
          <span className="text-xs text-gray-800/60">Activos Hoy</span>
        </div>

        {/* Clases Semanales */}
        <div className="bg-gradient-to-br from-blue-500/20 to-blue-500/5 border border-blue-500/30 rounded-2xl p-4 hover:border-blue-500/60 transition-all">
          <CalendarCheck size={24} className="text-blue-400 mb-3" weight="duotone" />
          <span className="block text-3xl font-black text-gray-800">{stats.totalClasses}</span>
          <span className="text-xs text-gray-800/60">Clases/Semana</span>
        </div>

        {/* Asistencia Promedio */}
        <div className="bg-gradient-to-br from-green-500/20 to-green-500/5 border border-green-500/30 rounded-2xl p-4 hover:border-green-500/60 transition-all">
          <ChartLine size={24} className="text-green-400 mb-3" weight="duotone" />
          <span className="block text-3xl font-black text-gray-800">{stats.avgAttendance}%</span>
          <span className="text-xs text-gray-800/60">Asistencia Prom</span>
        </div>
      </div>

      {/* ALERTAS Y NOTIFICACIONES */}
      <div className="mb-8 space-y-4 animate-fade-in-up">
        {/* Alerta de usuarios inactivos */}
        {stats.inactiveUsers > 0 && (
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-2xl p-4 flex gap-3">
            <Warning size={24} className="text-yellow-400 flex-shrink-0 mt-0.5" weight="fill" />
            <div>
              <h3 className="text-gray-800 font-bold text-sm">Usuarios Inactivos</h3>
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
            <h3 className="text-gray-800 font-bold text-sm">Tareas del Día</h3>
            <p className="text-blue-300/80 text-xs mt-1">
              Revisa la asistencia de las clases del día y actualiza los registros
            </p>
          </div>
        </div>
      </div>

      {/* ACCIONES ADMINISTRATIVAS */}
      <div className="space-y-4 mb-8 animate-fade-in-up">
        {/* Gestionar Usuarios */}
        <button onClick={() => setActiveModal('users')} className="w-full group relative bg-gradient-to-br from-brand-dark to-brand-dark border border-brand-accent/30 rounded-2xl p-6 overflow-hidden transition-all hover:border-brand-accent/60">
          <div className="absolute inset-0 bg-gradient-to-r from-brand-accent/0 via-brand-accent/10 to-brand-accent/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
          <div className="relative z-10 flex justify-between items-center">
            <div className="text-left">
              <h3 className="text-gray-800 font-bold">Gestionar Usuarios</h3>
              <p className="text-gray-800/60 text-sm">Ver, editar o eliminar usuarios del sistema</p>
            </div>
            <Users size={24} className="text-brand-accent flex-shrink-0" weight="duotone" />
          </div>
        </button>

        {/* Gestionar Entrenadores */}
        <button onClick={() => setActiveModal('trainers')} className="w-full group relative bg-gradient-to-br from-brand-dark to-brand-dark border border-brand-secondary/30 rounded-2xl p-6 overflow-hidden transition-all hover:border-brand-secondary/60">
          <div className="absolute inset-0 bg-gradient-to-r from-brand-secondary/0 via-brand-secondary/10 to-brand-secondary/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
          <div className="relative z-10 flex justify-between items-center">
            <div className="text-left">
              <h3 className="text-gray-800 font-bold">Gestionar Entrenadores</h3>
              <p className="text-gray-800/60 text-sm">Asignar roles y permisos a trainers</p>
            </div>
            <Shield size={24} className="text-brand-secondary flex-shrink-0" weight="duotone" />
          </div>
        </button>

        {/* Reportes y Análisis */}
        <button onClick={() => setActiveModal('reports')} className="w-full group relative bg-gradient-to-br from-brand-dark to-brand-dark border border-blue-500/30 rounded-2xl p-6 overflow-hidden transition-all hover:border-blue-500/60">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/10 to-blue-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
          <div className="relative z-10 flex justify-between items-center">
            <div className="text-left">
              <h3 className="text-gray-800 font-bold">Reportes y Análisis</h3>
              <p className="text-gray-800/60 text-sm">Descargar informes de asistencia y progreso</p>
            </div>
            <ChartLine size={24} className="text-blue-400 flex-shrink-0" weight="duotone" />
          </div>
        </button>

        {/* Configuración del Sistema */}
        <button onClick={() => setActiveModal('config')} className="w-full group relative bg-gradient-to-br from-brand-dark to-brand-dark border border-white/10 rounded-2xl p-6 overflow-hidden transition-all hover:border-white/30">
          <div className="relative z-10 flex justify-between items-center">
            <div className="text-left">
              <h3 className="text-gray-800 font-bold">Configuración del Sistema</h3>
              <p className="text-gray-800/60 text-sm">Ajustar horarios, cupos y políticas</p>
            </div>
            <Gear size={24} className="text-gray-800/60 flex-shrink-0" weight="duotone" />
          </div>
        </button>
      </div>

      {/* RESUMEN RÁPIDO */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 animate-fade-in-up">
        <h3 className="text-gray-800 font-bold mb-4 flex items-center gap-2">
          <Heartbeat size={20} className="text-brand-secondary" />
          Resumen Rápido
        </h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between items-center pb-3 border-b border-white/5">
            <span className="text-gray-800/70">Tasa de asistencia promedio</span>
            <span className="text-gray-800 font-bold text-lg">{stats.avgAttendance}%</span>
          </div>
          <div className="flex justify-between items-center pb-3 border-b border-white/5">
            <span className="text-gray-800/70">Usuarios nuevos (últimos 7 días)</span>
            <span className="text-gray-800 font-bold text-lg">+3</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-800/70">Próximas clases (hoy)</span>
            <span className="text-gray-800 font-bold text-lg">4</span>
          </div>
        </div>
      </div>

      {/* MODALES DE GESTIÓN */}
      
      {/* Modal: Gestionar Usuarios */}
      {activeModal === 'users' && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-brand-dark rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto border border-white/10">
            <div className="sticky top-0 bg-brand-dark border-b border-white/10 p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">Gestionar Usuarios</h2>
              <button onClick={() => setActiveModal(null)} className="text-gray-800/60 hover:text-gray-800">✕</button>
            </div>
            <div className="p-6 space-y-4">
              {allUsers.filter(u => u.role === 'user').map((usr) => (
                <div key={usr.uid} className="bg-black/20 p-4 rounded-xl flex justify-between items-center">
                  <div>
                    <p className="text-gray-800 font-bold">{usr.name}</p>
                    <p className="text-gray-800/60 text-sm">{usr.email}</p>
                  </div>
                  <button 
                    onClick={() => handleDeleteUser(usr.uid)}
                    className="px-4 py-2 bg-red-600 text-gray-800 rounded-lg text-sm hover:bg-red-700"
                  >
                    Eliminar
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modal: Gestionar Entrenadores */}
      {activeModal === 'trainers' && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-brand-dark rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto border border-white/10">
            <div className="sticky top-0 bg-brand-dark border-b border-white/10 p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">Gestionar Entrenadores</h2>
              <button onClick={() => { setActiveModal(null); setEditingTrainer(null); }} className="text-gray-800/60 hover:text-gray-800">✕</button>
            </div>
            <div className="p-6 space-y-4">
              {editingTrainer ? (
                // Formulario de edición
                <div className="bg-black/40 p-6 rounded-xl border border-white/10">
                  <h3 className="text-gray-800 font-bold mb-4">Editar Entrenador</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-gray-800/80 text-sm mb-1">Nombre</label>
                      <input 
                        type="text" 
                        value={trainerFormData.name}
                        onChange={(e) => setTrainerFormData({...trainerFormData, name: e.target.value})}
                        className="w-full px-3 py-2 bg-black/40 border border-white/20 rounded-lg text-gray-800"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-800/80 text-sm mb-1">Email</label>
                      <input 
                        type="email" 
                        value={trainerFormData.email}
                        onChange={(e) => setTrainerFormData({...trainerFormData, email: e.target.value})}
                        className="w-full px-3 py-2 bg-black/40 border border-white/20 rounded-lg text-gray-800"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-800/80 text-sm mb-1">Especialización</label>
                      <input 
                        type="text" 
                        value={trainerFormData.specialization}
                        onChange={(e) => setTrainerFormData({...trainerFormData, specialization: e.target.value})}
                        placeholder="Ej: Crossfit, Powerlifting"
                        className="w-full px-3 py-2 bg-black/40 border border-white/20 rounded-lg text-gray-800"
                      />
                    </div>
                    <div className="flex gap-2 pt-2">
                      <button 
                        onClick={handleSaveTrainer}
                        className="flex-1 px-4 py-2 bg-green-600 text-gray-800 rounded-lg hover:bg-green-700 font-bold"
                      >
                        Guardar
                      </button>
                      <button 
                        onClick={() => setEditingTrainer(null)}
                        className="flex-1 px-4 py-2 bg-gray-600 text-gray-800 rounded-lg hover:bg-gray-700"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                // Lista de entrenadores
                <>
                  {allUsers.filter(u => u.role === 'trainer').length === 0 ? (
                    <p className="text-gray-800/60 text-center py-4">No hay entrenadores registrados</p>
                  ) : (
                    allUsers.filter(u => u.role === 'trainer').map((usr) => (
                      <div key={usr.uid} className="bg-black/20 p-4 rounded-xl flex justify-between items-center">
                        <div>
                          <p className="text-gray-800 font-bold">{usr.name}</p>
                          <p className="text-gray-800/60 text-sm">{usr.email}</p>
                          {usr.specialization && (
                            <p className="text-brand-neon text-xs mt-1">📌 {usr.specialization}</p>
                          )}
                        </div>
                        <div className="space-x-2">
                          <button 
                            onClick={() => handleEditTrainer(usr)}
                            className="px-4 py-2 bg-blue-600 text-gray-800 rounded-lg text-sm hover:bg-blue-700"
                          >
                            Editar
                          </button>
                          <button 
                            onClick={() => handleDeleteTrainer(usr.uid)}
                            className="px-4 py-2 bg-red-600 text-gray-800 rounded-lg text-sm hover:bg-red-700"
                          >
                            Eliminar
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal: Reportes */}
      {activeModal === 'reports' && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-brand-dark rounded-2xl max-w-3xl w-full max-h-[85vh] overflow-y-auto border border-white/10">
            <div className="sticky top-0 bg-brand-dark border-b border-white/10 p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">Reportes y Análisis</h2>
              <button onClick={() => { setActiveModal(null); setReportType(null); }} className="text-gray-800/60 hover:text-gray-800">✕</button>
            </div>
            
            <div className="p-6">
              {!reportType ? (
                // Seleccionar tipo de reporte
                <div className="space-y-3">
                  <button 
                    onClick={() => setReportType('daily')}
                    className="w-full px-4 py-3 bg-blue-600 text-gray-800 rounded-lg hover:bg-blue-700 font-bold text-left transition-all hover:shadow-lg"
                  >
                    📅 Reporte Diario - Ver quién reservó cada clase
                  </button>
                  <button 
                    onClick={() => setReportType('weekly')}
                    className="w-full px-4 py-3 bg-purple-600 text-gray-800 rounded-lg hover:bg-purple-700 font-bold text-left transition-all hover:shadow-lg"
                  >
                    📊 Reporte Semanal - Gráfico de asistencia
                  </button>
                  <button 
                    onClick={() => setReportType('monthly')}
                    className="w-full px-4 py-3 bg-green-600 text-gray-800 rounded-lg hover:bg-green-700 font-bold text-left transition-all hover:shadow-lg"
                  >
                    📈 Reporte Mensual - Tendencias generales
                  </button>
                </div>
              ) : (
                // Mostrar reporte seleccionado
                <div className="space-y-4">
                  <button 
                    onClick={() => setReportType(null)}
                    className="text-gray-800/70 hover:text-gray-800 text-sm flex items-center gap-1 mb-4"
                  >
                    ← Volver a reportes
                  </button>
                  
                  {reportType === 'daily' && <DailyReport />}
                  {reportType === 'weekly' && <WeeklyReport />}
                  {reportType === 'monthly' && <MonthlyReport />}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal: Configuración */}
      {activeModal === 'config' && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-brand-dark rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto border border-white/10">
            <div className="sticky top-0 bg-brand-dark border-b border-white/10 p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">Configuración del Sistema</h2>
              <button onClick={() => setActiveModal(null)} className="text-gray-800/60 hover:text-gray-800">✕</button>
            </div>
            <div className="p-6">
              <ScheduleConfig onClose={() => setActiveModal(null)} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
