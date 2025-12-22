// UBICACIÓN: /src/components/features/notifications/NotificationDemo.jsx
// Componente de demostración para probar notificaciones

import React, { useState } from 'react';
import {
  sendMotivationalNotification,
  sendClassReminder,
  sendWeeklyProgressNotification,
  sendMonthlyProgressNotification,
  sendInactivityWarning
} from '../../../services/notificationsService';

export default function NotificationDemo() {
  const [showDemo, setShowDemo] = useState(false);

  return (
    <>
      {/* Botón para abrir demo (solo en desarrollo) */}
      {import.meta.env.DEV && (
        <button
          onClick={() => setShowDemo(!showDemo)}
          className="fixed bottom-4 right-4 text-xs bg-gray-600 text-white px-3 py-2 rounded z-50 hover:bg-gray-700"
        >
          📢 Demo
        </button>
      )}

      {/* Panel de demostración */}
      {showDemo && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-brand-charcoal border border-white/10 rounded-2xl p-8 max-w-md max-h-96 overflow-y-auto">
            <h2 className="text-2xl font-bold text-white mb-6">🧪 Demo de Notificaciones</h2>

            <div className="space-y-3">
              {/* Motivación */}
              <button
                onClick={() => {
                  sendMotivationalNotification();
                  alert('✅ Notificación de motivación enviada');
                }}
                className="w-full bg-brand-red hover:bg-red-700 text-white font-bold py-3 rounded-lg transition"
              >
                🔥 Motivación
              </button>

              {/* Recordatorio 1 hora */}
              <button
                onClick={() => {
                  sendClassReminder('18:30', 'Boxeo Funcional', 60);
                  alert('✅ Recordatorio (60 min) enviado');
                }}
                className="w-full bg-brand-gold hover:bg-yellow-600 text-black font-bold py-3 rounded-lg transition"
              >
                ⏰ Recordatorio 1 hora
              </button>

              {/* Recordatorio 5 minutos */}
              <button
                onClick={() => {
                  sendClassReminder('18:30', 'Boxeo Funcional', 5);
                  alert('✅ Recordatorio (5 min) enviado');
                }}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-lg transition"
              >
                🚨 Recordatorio 5 min
              </button>

              {/* Progreso Semanal */}
              <button
                onClick={() => {
                  sendWeeklyProgressNotification({
                    attendances: 3,
                    totalClasses: 4
                  });
                  alert('✅ Progreso semanal enviado');
                }}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition"
              >
                📊 Progreso Semanal
              </button>

              {/* Progreso Mensual */}
              <button
                onClick={() => {
                  sendMonthlyProgressNotification({
                    totalAttendances: 12,
                    totalWorkouts: 15,
                    personalRecords: 2
                  });
                  alert('✅ Progreso mensual enviado');
                }}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-lg transition"
              >
                🏅 Progreso Mensual
              </button>

              {/* Inactividad */}
              <button
                onClick={() => {
                  sendInactivityWarning(7);
                  alert('✅ Alerta de inactividad enviada');
                }}
                className="w-full bg-red-700 hover:bg-red-800 text-white font-bold py-3 rounded-lg transition"
              >
                😴 Alerta Inactividad
              </button>

              {/* Cerrar */}
              <button
                onClick={() => setShowDemo(false)}
                className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 rounded-lg transition mt-4"
              >
                ✕ Cerrar
              </button>
            </div>

            <p className="text-xs text-gray-400 mt-6 text-center">
              ⚠️ Solo disponible en modo desarrollo
            </p>
          </div>
        </div>
      )}
    </>
  );
}
