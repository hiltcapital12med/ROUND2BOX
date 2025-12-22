// UBICACIÓN: /src/utils/agendaConfig.js

// Capacidad máxima por clase
export const CLASS_CAPACITY = 4;

// Festivos en Colombia (formato YYYY-MM-DD)
export const COLOMBIAN_HOLIDAYS = [
  // 2025
  '2025-01-01', // Año Nuevo
  '2025-01-06', // Reyes Magos
  '2025-03-19', // San José
  '2025-04-17', // Jueves Santo
  '2025-04-18', // Viernes Santo
  '2025-05-01', // Día del Trabajo
  '2025-06-02', // Corpus Christi
  '2025-06-23', // Sagrado Corazón
  '2025-06-29', // San Pedro y San Pablo
  '2025-07-01', // Conmemoración
  '2025-07-07', // San Fermín
  '2025-08-07', // Batalla de Boyacá
  '2025-08-15', // Asunción
  '2025-11-03', // Todos los Santos
  '2025-11-17', // Independencia de Cartagena
  '2025-12-08', // Inmaculada Concepción
  '2025-12-25', // Navidad
  // 2026
  '2026-01-01', // Año Nuevo
  '2026-01-12', // Reyes Magos
  '2026-03-30', // Jueves Santo
  '2026-03-31', // Viernes Santo
  '2026-05-01', // Día del Trabajo
  '2026-05-14', // Corpus Christi
  '2026-06-01', // Sagrado Corazón
  '2026-06-29', // San Pedro y San Pablo
  '2026-07-01', // Conmemoración
  '2026-07-06', // San Fermín
  '2026-08-07', // Batalla de Boyacá
  '2026-08-17', // Asunción
  '2026-11-02', // Todos los Santos
  '2026-11-16', // Independencia de Cartagena
  '2026-12-08', // Inmaculada Concepción
  '2026-12-25', // Navidad
];

export const SCHEDULES = {
  // Lunes a Viernes (1 = Lunes, 5 = Viernes)
  weekdays: [
    { id: 'am1', time: '06:30', label: 'Morning Box', type: 'am' },
    { id: 'am2', time: '07:30', label: 'Morning Box', type: 'am' },
    { id: 'am3', time: '08:30', label: 'Morning Box', type: 'am' },
    { id: 'am4', time: '09:30', label: 'Morning Box', type: 'am' },
    // Tarde
    { id: 'pm1', time: '16:30', label: 'Afternoon Power', type: 'pm' },
    { id: 'pm2', time: '17:30', label: 'Afternoon Power', type: 'pm' },
    { id: 'pm3', time: '18:30', label: 'Afternoon Power', type: 'pm' },
    { id: 'pm4', time: '19:30', label: 'Afternoon Power', type: 'pm' },
  ],
  // Sábados (6 = Sábado)
  saturday: [
    { id: 'sat1', time: '07:00', label: 'Weekend Warrior', type: 'am' },
    { id: 'sat2', time: '08:00', label: 'Weekend Warrior', type: 'am' },
  ]
};

/**
 * Verificar si una fecha es festivo en Colombia
 */
export const isColombianHoliday = (date) => {
  const dateStr = date.toISOString().split('T')[0];
  return COLOMBIAN_HOLIDAYS.includes(dateStr);
};

/**
 * Obtener los slots de clase para un día específico
 * Retorna array vacío si es domingo o festivo
 */
export const getDailySlots = (date) => {
  const day = date.getDay(); // 0 = Domingo, 6 = Sábado
  
  // Domingo cerrado
  if (day === 0) return [];
  
  // Festivos colombianos cerrado
  if (isColombianHoliday(date)) return [];
  
  // Sábado
  if (day === 6) return SCHEDULES.saturday;
  
  // Lunes a Viernes
  return SCHEDULES.weekdays;
};
