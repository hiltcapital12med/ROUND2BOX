// UBICACIÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œN: /src/components/features/dashboard/SummarySection.jsx
import React from 'react';
import { Heartbeat } from '@phosphor-icons/react';

/**
 * Componente para mostrar un resumen rÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¡pido de datos clave
 * DiseÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â±o compacto y responsive
 */
export default function SummarySection({ items = [], title = 'Resumen RÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¡pido' }) {
  return (
    <div className="bg-gradient-to-br from-white/5 to-white/0 border border-white/10 rounded-xl p-4">
      {/* Encabezado */}
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 bg-brand-accent/10 rounded-lg">
          <Heartbeat size={18} className="text-brand-accent" weight="fill" />
        </div>
        <h3 className="text-gray-800 font-bold text-base">
          {title}
        </h3>
      </div>

      {/* Grid de items */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {items.map((item, index) => (
          <div
            key={index}
            className="bg-white/5 border border-white/10 rounded-lg p-3 hover:border-white/20 transition-all"
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-800/60 text-xs font-medium">
                {item.label}
              </p>
              {item.icon && (
                <span className="text-lg">
                  {item.icon}
                </span>
              )}
            </div>
            <p className="text-gray-800 text-xl font-bold">
              {item.value}
            </p>
            {item.subtext && (
              <p className="text-gray-800/50 text-xs mt-1">
                {item.subtext}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

