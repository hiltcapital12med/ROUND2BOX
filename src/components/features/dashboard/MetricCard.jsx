// UBICACIÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œN: /src/components/features/dashboard/MetricCard.jsx
import React from 'react';

/**
 * Componente reutilizable para tarjetas de mÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â©tricas en el dashboard
 * DiseÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â±o compacto y responsive
 */
export default function MetricCard({ icon: Icon, label, value, color = 'blue', trend, className = '' }) {
  const colorMap = {
    red: {
      bg: 'from-brand-accent/15 to-brand-accent/5',
      border: 'border-brand-accent/40 hover:border-brand-accent/70',
      icon: 'text-brand-accent',
      accent: 'bg-brand-accent/10'
    },
    gray: {
      bg: 'from-brand-gray200/15 to-brand-gray200/5',
      border: 'border-brand-gray200/40 hover:border-brand-gray200/70',
      icon: 'text-brand-gray200',
      accent: 'bg-brand-gray200/10'
    },
    blue: {
      bg: 'from-brand-accent/15 to-brand-accent/5',
      border: 'border-brand-accent/40 hover:border-brand-accent/70',
      icon: 'text-brand-accent',
      accent: 'bg-brand-accent/10'
    },
    green: {
      bg: 'from-brand-accent/15 to-brand-accent/5',
      border: 'border-brand-accent/40 hover:border-brand-accent/70',
      icon: 'text-brand-accent',
      accent: 'bg-brand-accent/10'
    }
  };

  const styles = colorMap[color] || colorMap.blue;

  return (
    <div
      className={`bg-gradient-to-br ${styles.bg} border ${styles.border} rounded-xl p-4 transition-all duration-300 hover:shadow-lg ${className}`}
    >
      {/* Header con icono */}
      <div className="flex items-center justify-between mb-3">
        <div className={`${styles.accent} p-2 rounded-lg`}>
          <Icon size={18} className={styles.icon} weight="duotone" />
        </div>
      </div>

      {/* Valor principal */}
      <div className="text-2xl md:text-3xl font-bold text-gray-800 mb-1">
        {value}
      </div>

      {/* Etiqueta */}
      <p className="text-sm text-gray-800/70 font-medium">
        {label}
      </p>

      {/* Tendencia */}
      {trend && (
        <p className="text-xs text-gray-800/50 mt-2 pt-2 border-t border-white/10">
          {trend}
        </p>
      )}
    </div>
  );
}

