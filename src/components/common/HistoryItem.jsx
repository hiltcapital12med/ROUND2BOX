import React from 'react';
import { CheckCircle } from '@phosphor-icons/react';

/**
 * HistoryItem - Item de historial con check rojo y fondo sutil
 */
export default function HistoryItem({ 
  label, 
  value, 
  status = 'completed', // 'completed' | 'pending'
  icon = null 
}) {
  const statusStyles = {
    completed: {
      icon: 'text-red-500',
      bg: 'bg-red-50',
      border: 'border-red-100'
    },
    pending: {
      icon: 'text-yellow-500',
      bg: 'bg-yellow-50',
      border: 'border-yellow-100'
    }
  };

  const style = statusStyles[status];

  return (
    <div className={`
      flex 
      items-center 
      gap-4 
      p-4 
      ${style.bg}
      border 
      ${style.border}
      rounded-2xl
      transition-all
      duration-200
      hover:shadow-md
    `}>
      {/* Check Icon */}
      <div className={`flex-shrink-0 ${style.icon}`}>
        <CheckCircle size={28} weight="fill" />
      </div>

      {/* Content */}
      <div className="flex-grow">
        <p className="text-sm font-medium text-gray-600">
          {label}
        </p>
      </div>

      {/* Value */}
      {value && (
        <div className="text-right flex-shrink-0">
          <p className="text-lg font-black text-gray-900">
            {value}
          </p>
        </div>
      )}
    </div>
  );
}

