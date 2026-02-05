// UBICACIÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œN: /src/components/features/dashboard/AlertSection.jsx
import React from 'react';
import { Warning, Info, CheckCircle } from '@phosphor-icons/react';

/**
 * Componente para mostrar alertas y notificaciones importantes
 * @param {Array} props.alerts - Array de objetos con { type, title, message, icon }
 */
export default function AlertSection({ alerts = [] }) {
  if (alerts.length === 0) {
    return (
      <div className="bg-brand-accent/10 border border-brand-accent/30 rounded-2xl p-6">
        <div className="flex gap-4">
          <div className="flex-shrink-0">
            <CheckCircle size={24} className="text-brand-accent" weight="fill" />
          </div>
          <div>
            <h3 className="text-gray-800 font-bold">Todo estÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¡ bien</h3>
            <p className="text-brand-accent/80 text-sm mt-1">
              No hay alertas pendientes. El sistema funciona correctamente.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const alertTypeStyles = {
    warning: {
      bg: 'bg-yellow-500/10',
      border: 'border-yellow-500/30',
      icon: Warning,
      iconColor: 'text-yellow-400',
      titleColor: 'text-gray-800'
    },
    error: {
      bg: 'bg-red-500/10',
      border: 'border-red-500/30',
      icon: Warning,
      iconColor: 'text-red-400',
      titleColor: 'text-gray-800'
    },
    info: {
      bg: 'bg-brand-accent/10',
      border: 'border-brand-accent/30',
      icon: Info,
      iconColor: 'text-brand-accent',
      titleColor: 'text-gray-800'
    }
  };

  return (
    <div className="space-y-3">
      {alerts.map((alert, index) => {
        const styles = alertTypeStyles[alert.type] || alertTypeStyles.info;
        const IconComponent = styles.icon;

        return (
          <div key={index} className={`${styles.bg} border ${styles.border} rounded-2xl p-4 flex gap-4`}>
            <div className="flex-shrink-0 pt-0.5">
              <IconComponent size={20} className={styles.iconColor} weight="fill" />
            </div>
            <div className="flex-1">
              <h3 className={`${styles.titleColor} font-bold text-sm`}>
                {alert.title}
              </h3>
              <p className="text-gray-800/70 text-xs mt-1">
                {alert.message}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

