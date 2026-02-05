// UBICACIÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œN: /src/components/features/dashboard/QuickAccessSection.jsx
import React from 'react';

/**
 * Componente para mostrar accesos rÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¡pidos como cuadrÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â­cula de botones
 * DiseÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â±o compacto y responsive
 */
export default function QuickAccessSection({ actions = [] }) {
  const colorVariants = {
    red: 'bg-gradient-to-br from-brand-accent/10 to-brand-accent/5 border-brand-accent/40 hover:border-brand-accent/70',
    gray: 'bg-gradient-to-br from-brand-gray200/10 to-brand-gray200/5 border-brand-gray200/40 hover:border-brand-gray200/70',
    blue: 'bg-gradient-to-br from-brand-accent/10 to-brand-accent/5 border-brand-accent/40 hover:border-brand-accent/70',
    neutral: 'bg-gradient-to-br from-white/5 to-white/0 border-white/20 hover:border-white/40'
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {actions.map((action, index) => {
        const variant = colorVariants[action.color] || colorVariants.neutral;

        return (
          <button
            key={index}
            onClick={action.onClick}
            className={`${variant} border rounded-xl p-4 transition-all duration-300 text-left flex items-center gap-3 hover:shadow-lg`}
          >
            {/* Icono */}
            {action.icon && (
              <div className="flex-shrink-0">
                {action.icon}
              </div>
            )}
            
            {/* Contenido */}
            <div className="flex-1 min-w-0">
              <h3 className="text-gray-800 font-semibold text-sm truncate">
                {action.label}
              </h3>
              <p className="text-gray-800/60 text-xs truncate">
                {action.description}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
}

