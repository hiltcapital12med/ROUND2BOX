import React from 'react';

/**
 * DashboardCard - Componente reutilizable para tarjetas con glow rojo premium
 * 
 * CaracterÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â­sticas:
 * - Fondo blanco puro
 * - Bordes muy redondeados (rounded-3xl)
 * - Sombra roja vibrante (glow effect)
 * - Responsive
 */
export default function DashboardCard({ 
  children, 
  className = '', 
  title = null,
  subtitle = null,
  accentColor = 'red' // 'red' | 'pink' | 'orange'
}) {
  // Mapeo de colores de glow
  const glowColorMap = {
    red: 'shadow-[0_15px_50px_-10px_rgba(239,68,68,0.4)]',
    pink: 'shadow-[0_15px_50px_-10px_rgba(236,72,153,0.4)]',
    orange: 'shadow-[0_15px_50px_-10px_rgba(249,115,22,0.4)]'
  };

  const glowClass = glowColorMap[accentColor] || glowColorMap.red;

  return (
    <div 
      className={`
        bg-white 
        rounded-3xl 
        p-6 sm:p-8 
        ${glowClass}
        transition-all 
        duration-300 
        hover:shadow-[0_20px_60px_-8px_rgba(239,68,68,0.5)]
        ${className}
      `}
    >
      {/* Header de la tarjeta (opcional) */}
      {title && (
        <div className="mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-1">
            {title}
          </h2>
          {subtitle && (
            <p className="text-sm text-gray-500 font-medium">
              {subtitle}
            </p>
          )}
        </div>
      )}

      {/* Contenido */}
      <div>
        {children}
      </div>
    </div>
  );
}

