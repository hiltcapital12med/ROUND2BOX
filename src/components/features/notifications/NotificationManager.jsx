// UBICACIÓN: /src/components/features/notifications/NotificationManager.jsx
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useNotifications } from '../../../hooks/useNotifications';
import { sendClassReminder } from '../../../services/notificationsService';
import { Bell, BellSimple } from '@phosphor-icons/react';

export default function NotificationManager({ upcomingClasses = [] }) {
  const { user } = useAuth();
  const { notificationsEnabled, permissionStatus, initializeNotifications } = useNotifications();
  const [showSettings, setShowSettings] = useState(false);

  // Programar recordatorios para clases próximas
  useEffect(() => {
    if (notificationsEnabled && upcomingClasses.length > 0) {
      upcomingClasses.forEach((classData) => {
        // Programar recordatorios 60, 30 y 5 minutos antes
        scheduleClassReminder(classData);
      });
    }
  }, [notificationsEnabled, upcomingClasses]);

  const scheduleClassReminder = (classData) => {
    const { time: classTime, label: classLabel, date } = classData;

    if (!classTime || !date) return;

    // Crear objeto Date de la clase
    const [hours, minutes] = classTime.split(':').map(Number);
    const classDateTime = new Date(date);
    classDateTime.setHours(hours, minutes, 0, 0);
    const now = new Date();

    // Para cada intervalo de recordatorio
    const remindersMinutes = [60, 30, 5];
    remindersMinutes.forEach((minutesBefore) => {
      const reminderTime = new Date(classDateTime.getTime() - minutesBefore * 60 * 1000);
      const timeUntilReminder = reminderTime.getTime() - now.getTime();

      if (timeUntilReminder > 0) {
        setTimeout(() => {
          sendClassReminder(classTime, classLabel, minutesBefore);
        }, timeUntilReminder);
      }
    });
  };

  const handleToggleNotifications = async () => {
    if (!notificationsEnabled) {
      await initializeNotifications();
    }
  };

  return (
    <>
      {/* Botón flotante de notificaciones */}
      <div className="fixed bottom-24 right-4 z-40">
        <button
          onClick={() => setShowSettings(!showSettings)}
          className={`flex items-center justify-center w-14 h-14 rounded-full shadow-lg transition-all ${
            notificationsEnabled
              ? 'bg-brand-gold text-black hover:scale-110'
              : 'bg-gray-600 text-white hover:scale-110'
          }`}
          title={notificationsEnabled ? 'Notificaciones activas' : 'Activar notificaciones'}
        >
          {notificationsEnabled ? (
            <Bell weight="fill" size={24} />
          ) : (
            <BellSimple size={24} />
          )}
        </button>

        {/* Panel de configuración de notificaciones */}
        {showSettings && (
          <div className="absolute bottom-16 right-0 bg-brand-charcoal border border-white/10 rounded-2xl p-4 w-80 shadow-2xl animate-fade-in-up">
            <h3 className="text-white font-bold text-lg mb-4">Notificaciones Push</h3>

            {/* Estado de permiso */}
            <div className="mb-4 p-3 bg-black/30 rounded-lg border border-white/5">
              <span className="text-xs text-gray-400 uppercase tracking-wider">Estado</span>
              <div className="flex items-center gap-2 mt-2">
                <div
                  className={`w-3 h-3 rounded-full ${
                    notificationsEnabled ? 'bg-green-500' : 'bg-red-500'
                  }`}
                ></div>
                <span className="text-white font-bold">
                  {notificationsEnabled ? 'Activas' : 'Desactivadas'}
                </span>
              </div>
            </div>

            {/* Opciones de notificaciones */}
            <div className="space-y-3 mb-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={notificationsEnabled}
                  onChange={handleToggleNotifications}
                  className="w-4 h-4 rounded bg-white/20 border border-white/30 cursor-pointer"
                />
                <span className="text-sm text-white">Mensajes de motivación</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer opacity-50">
                <input
                  type="checkbox"
                  checked={notificationsEnabled}
                  disabled
                  className="w-4 h-4 rounded bg-white/20 border border-white/30 cursor-pointer"
                />
                <span className="text-sm text-white">Recordatorios de clase</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer opacity-50">
                <input
                  type="checkbox"
                  checked={notificationsEnabled}
                  disabled
                  className="w-4 h-4 rounded bg-white/20 border border-white/30 cursor-pointer"
                />
                <span className="text-sm text-white">Progreso semanal</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer opacity-50">
                <input
                  type="checkbox"
                  checked={notificationsEnabled}
                  disabled
                  className="w-4 h-4 rounded bg-white/20 border border-white/30 cursor-pointer"
                />
                <span className="text-sm text-white">Progreso mensual</span>
              </label>
            </div>

            {/* Info de permisos */}
            {permissionStatus === 'denied' && (
              <div className="p-3 bg-red-500/10 border border-red-500 rounded-lg text-xs text-red-400 mb-4">
                ⚠️ Los permisos de notificación han sido bloqueados. Habilítalo en la configuración del navegador.
              </div>
            )}

            {permissionStatus === 'default' && (
              <button
                onClick={handleToggleNotifications}
                className="w-full py-2 bg-brand-red text-white font-bold rounded-lg hover:bg-red-700 transition text-sm"
              >
                Activar Notificaciones
              </button>
            )}

            <p className="text-xs text-gray-500 mt-4 text-center">
              Recibe actualizaciones sobre tu entrenamiento
            </p>
          </div>
        )}
      </div>
    </>
  );
}
