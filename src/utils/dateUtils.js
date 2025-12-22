// UBICACIÓN: /src/utils/dateUtils.js
// Utilidades para cálculos de fechas y días efectivos de entrenamiento

/**
 * Lista de festivos colombianos para 2025-2026
 */
export const COLOMBIAN_HOLIDAYS = [
  // 2025
  '2025-01-01', // Año Nuevo
  '2025-01-06', // Reyes Magos
  '2025-01-08', // San Mauro (observancia)
  '2025-03-05', // San José
  '2025-04-09', // Miércoles de Ceniza
  '2025-04-10', // Jueves Santo
  '2025-04-11', // Viernes Santo
  '2025-04-12', // Sábado Santo
  '2025-05-01', // Día del Trabajo
  '2025-06-02', // Corpus Christi
  '2025-06-09', // Sagrado Corazón
  '2025-06-30', // San Pedro y San Pablo
  '2025-07-01', // San Pedro y San Pablo (observancia)
  '2025-07-03', // San Tomás
  '2025-07-07', // San Mauro (observancia)
  '2025-08-07', // Batalla de Boyacá
  '2025-08-15', // Asunción
  '2025-08-17', // Asunción (observancia)
  '2025-11-01', // Todos los Santos
  '2025-11-03', // Todos los Santos (observancia)
  '2025-11-17', // Independencia de Cartagena
  '2025-12-08', // Inmaculada Concepción
  '2025-12-25', // Navidad

  // 2026
  '2026-01-01', // Año Nuevo
  '2026-01-12', // Reyes Magos (observancia)
  '2026-03-02', // San José (observancia)
  '2026-03-25', // Miércoles de Ceniza
  '2026-03-26', // Jueves Santo
  '2026-03-27', // Viernes Santo
  '2026-03-28', // Sábado Santo
  '2026-05-01', // Día del Trabajo
  '2026-05-18', // Corpus Christi
  '2026-05-25', // Sagrado Corazón
  '2026-06-22', // San Pedro y San Pablo (observancia)
  '2026-06-29', // San Pedro y San Pablo (observancia)
  '2026-07-20', // Grito de Independencia
  '2026-07-22', // Grito de Independencia (observancia)
  '2026-08-07', // Batalla de Boyacá
  '2026-08-17', // Asunción
  '2026-08-19', // Asunción (observancia)
  '2026-11-02', // Todos los Santos (observancia)
  '2026-11-16', // Todos los Santos (observancia)
  '2026-11-23', // Independencia de Cartagena (observancia)
  '2026-11-25', // Independencia de Cartagena (observancia)
  '2026-12-08', // Inmaculada Concepción
  '2026-12-25'  // Navidad
];

/**
 * Verifica si una fecha es festivo en Colombia
 * @param {Date|string} date - Fecha a verificar (Date o string YYYY-MM-DD)
 * @returns {boolean} true si es festivo
 */
export function isColombianHoliday(date) {
  let dateStr;
  
  if (date instanceof Date) {
    dateStr = date.toISOString().split('T')[0];
  } else {
    dateStr = date;
  }
  
  return COLOMBIAN_HOLIDAYS.includes(dateStr);
}

/**
 * Verifica si una fecha es fin de semana (domingo)
 * @param {Date} date - Fecha a verificar
 * @returns {boolean} true si es domingo
 */
export function isSunday(date) {
  return date.getDay() === 0;
}

/**
 * Verifica si un día es efectivo para entrenar
 * (no es domingo ni festivo)
 * @param {Date} date - Fecha a verificar
 * @returns {boolean} true si es día de entreno posible
 */
export function isTrainingDay(date) {
  return !isSunday(date) && !isColombianHoliday(date);
}

/**
 * Calcula cuántos días efectivos de entrenamiento hay en un rango de fechas
 * (excluyendo domingos y festivos colombianos)
 * @param {Date} startDate - Fecha de inicio (inclusive)
 * @param {Date} endDate - Fecha de fin (inclusive)
 * @returns {number} Cantidad de días efectivos
 */
export function calculateEffectiveDays(startDate, endDate) {
  let count = 0;
  const current = new Date(startDate);
  current.setHours(0, 0, 0, 0);

  const end = new Date(endDate);
  end.setHours(0, 0, 0, 0);

  while (current <= end) {
    if (isTrainingDay(current)) {
      count++;
    }
    current.setDate(current.getDate() + 1);
  }

  return count;
}

/**
 * Obtiene el rango de fechas del mes actual
 * @returns {Object} { startOfMonth, endOfMonth }
 */
export function getCurrentMonthRange() {
  const today = new Date();
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  startOfMonth.setHours(0, 0, 0, 0);

  const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  endOfMonth.setHours(23, 59, 59, 999);

  return { startOfMonth, endOfMonth };
}

/**
 * Obtiene el rango de fechas de la semana actual (domingo-sábado)
 * @returns {Object} { startOfWeek, endOfWeek }
 */
export function getCurrentWeekRange() {
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay()); // Domingo
  startOfWeek.setHours(0, 0, 0, 0);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6); // Sábado
  endOfWeek.setHours(23, 59, 59, 999);

  return { startOfWeek, endOfWeek };
}

/**
 * Calcula el porcentaje de consistencia
 * @param {number} attendances - Días asistidos
 * @param {number} possibleDays - Días posibles de entrenar
 * @returns {number} Porcentaje (0-100) redondeado
 */
export function calculateConsistencyPercentage(attendances, possibleDays) {
  if (possibleDays === 0) return 0;
  return Math.round((attendances / possibleDays) * 100);
}

/**
 * Determina el nivel de consistencia basado en porcentaje
 * @param {number} consistency - Porcentaje (0-100)
 * @returns {Object} { level, message, color }
 */
export function getLevelFromConsistency(consistency) {
  const levels = {
    'ÉLITE': { min: 85, message: '¡Eres una máquina! 🚀', color: 'text-brand-red' },
    'PRO': { min: 70, message: 'Muy consistente. Sigue así 💪', color: 'text-brand-gold' },
    'CONSISTENTE': { min: 50, message: 'Buen ritmo. Vamos adelante 🔥', color: 'text-green-500' },
    'INICIADO': { min: 25, message: 'Comienza tu viaje 🌟', color: 'text-blue-500' },
    'PRINCIPIANTE': { min: 0, message: 'Cada día es un nuevo comienzo 💚', color: 'text-gray-500' }
  };

  for (const [level, data] of Object.entries(levels)) {
    if (consistency >= data.min) {
      return { level, message: data.message, color: data.color };
    }
  }

  return { level: 'PRINCIPIANTE', message: 'Cada día es un nuevo comienzo 💚', color: 'text-gray-500' };
}
