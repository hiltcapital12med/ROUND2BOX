import React, { useState, useEffect } from 'react';
import { db } from '../../../services/firebase';
import { doc, getDoc, setDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { SCHEDULES } from '../../../utils/agendaConfig';
import { Eye, EyeSlash, CheckCircle, CaretLeft, CaretRight, User } from '@phosphor-icons/react';
import { format, addDays, startOfWeek, isSameDay, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

export default function ScheduleConfig({ onClose }) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [config, setConfig] = useState({});
  const [trainers, setTrainers] = useState([]);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    loadConfig();
    loadTrainers();
  }, []);

  const loadTrainers = async () => {
    try {
      const trainersSnapshot = await getDocs(
        query(collection(db, 'users'), where('role', '==', 'trainer'))
      );
      const trainersData = trainersSnapshot.docs.map(doc => ({ 
        id: doc.id, 
        name: doc.data().name,
        email: doc.data().email
      }));
      setTrainers(trainersData);
    } catch (error) {
      console.error('Error cargando entrenadores:', error);
    }
  };

  const loadConfig = async () => {
    try {
      const configRef = doc(db, 'system', 'config');
      const configSnap = await getDoc(configRef);
      
      let loadedConfig = {};
      
      if (configSnap.exists()) {
        const allSchedules = configSnap.data();
        // Parsear el config para obtener la estructura correcta
        for (const [key, value] of Object.entries(allSchedules)) {
          if (key.startsWith('schedule_')) {
            const dateKey = key.replace('schedule_', '');
            loadedConfig[dateKey] = value;
          }
        }
      }
      
      setConfig(loadedConfig);
    } catch (error) {
      console.error('Error cargando configuración:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDateKey = (date) => format(date, 'yyyy-MM-dd');
  
  const getDayConfig = (date) => {
    const key = getDateKey(date);
    return config[key] || { enabled: {}, capacity: 4 };
  };

  const handleToggleClass = (scheduleId) => {
    const dateKey = getDateKey(selectedDate);
    const dayConfig = getDayConfig(selectedDate);
    
    setConfig(prev => ({
      ...prev,
      [dateKey]: {
        ...dayConfig,
        enabled: {
          ...dayConfig.enabled,
          [scheduleId]: !dayConfig.enabled?.[scheduleId]
        }
      }
    }));
    setSaved(false);
  };

  const handleCapacityChange = (capacity) => {
    const dateKey = getDateKey(selectedDate);
    const dayConfig = getDayConfig(selectedDate);
    
    setConfig(prev => ({
      ...prev,
      [dateKey]: {
        ...dayConfig,
        capacity: parseInt(capacity)
      }
    }));
    setSaved(false);
  };

  const handleAssignTrainer = (scheduleId, trainerId) => {
    const dateKey = getDateKey(selectedDate);
    const dayConfig = getDayConfig(selectedDate);
    
    setConfig(prev => ({
      ...prev,
      [dateKey]: {
        ...dayConfig,
        trainers: {
          ...dayConfig.trainers,
          [scheduleId]: trainerId
        }
      }
    }));
    setSaved(false);
  };

  const getTrainerName = (trainerId) => {
    const trainer = trainers.find(t => t.id === trainerId);
    return trainer ? trainer.name : 'Sin asignar';
  };

  const handleSaveConfig = async () => {
    try {
      setLoading(true);
      
      // Guardar cada fecha como un documento separado en system/
      for (const [dateKey, dayConfig] of Object.entries(config)) {
        if (dateKey && dayConfig && typeof dayConfig === 'object') {
          const docRef = doc(db, 'system', `schedule_${dateKey}`);
          await setDoc(docRef, {
            date: dateKey,
            enabled: dayConfig.enabled || {},
            trainers: dayConfig.trainers || {},
            capacity: dayConfig.capacity || 4
          });
        }
      }
      
      setSaved(true);
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error) {
      console.error('Error guardando configuración:', error);
      alert('Error al guardar la configuración: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const dayConfig = getDayConfig(selectedDate);
  const dayOfWeek = selectedDate.getDay();
  const schedules = dayOfWeek === 6 ? SCHEDULES.saturday : SCHEDULES.weekdays;
  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  if (loading && Object.keys(config).length === 0) {
    return <div className="text-white/60 text-center py-4">Cargando...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div>
        <h3 className="text-lg font-bold text-white mb-2">Configurar Horarios</h3>
        <p className="text-white/60 text-sm">Planifica los horarios disponibles día a día</p>
      </div>

      {/* Selector de Semana */}
      <div className="bg-black/40 rounded-lg p-4 border border-white/10">
        <div className="flex justify-between items-center mb-3">
          <h4 className="text-white font-bold text-sm">Selecciona semana</h4>
          <div className="flex gap-2">
            <button 
              onClick={() => setSelectedDate(addDays(selectedDate, -7))}
              className="p-1 hover:bg-white/10 rounded"
            >
              <CaretLeft size={16} className="text-white" weight="fill" />
            </button>
            <button 
              onClick={() => setSelectedDate(addDays(selectedDate, 7))}
              className="p-1 hover:bg-white/10 rounded"
            >
              <CaretRight size={16} className="text-white" weight="fill" />
            </button>
          </div>
        </div>
        
        {/* Días de la semana */}
        <div className="grid grid-cols-7 gap-1">
          {weekDays.map((day) => (
            <button
              key={getDateKey(day)}
              onClick={() => setSelectedDate(day)}
              className={`p-2 rounded text-xs font-bold transition-all ${
                isSameDay(day, selectedDate)
                  ? 'bg-brand-neon text-black'
                  : 'bg-black/40 text-white hover:bg-black/60'
              }`}
            >
              <div>{format(day, 'EEE', { locale: es }).toUpperCase().substring(0, 1)}</div>
              <div className="text-xs">{format(day, 'd')}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Información del Día Seleccionado */}
      <div className="bg-brand-neon/10 rounded-lg p-4 border border-brand-neon/30">
        <p className="text-white font-bold">
          📅 {format(selectedDate, 'EEEE, d \'de\' MMMM \'de\' yyyy', { locale: es })}
        </p>
        <p className="text-white/60 text-sm mt-1">
          {dayOfWeek === 0 ? '❌ Domingo - Cerrado' : 
           dayOfWeek === 6 ? '🏋️ Sábado' : 
           '📆 Lunes a Viernes'}
        </p>
      </div>

      {/* Capacidad para este día */}
      <div className="bg-black/40 p-4 rounded-lg border border-white/10">
        <label className="block text-white font-bold text-sm mb-2">Capacidad máxima para este día</label>
        <input 
          type="number" 
          min="1"
          max="20"
          value={dayConfig.capacity || 4}
          onChange={(e) => handleCapacityChange(e.target.value)}
          className="w-full px-3 py-2 bg-black/30 border border-white/10 rounded-lg text-white"
        />
      </div>

      {/* Horarios del día */}
      <div className="space-y-3">
        <h4 className="text-white font-bold text-sm">
          {dayOfWeek === 0 ? 'No hay horarios (domingo cerrado)' : 'Horarios disponibles'}
        </h4>
        
        {dayOfWeek !== 0 ? (
          <div className="grid grid-cols-1 gap-3">
            {schedules.map(slot => (
              <div 
                key={slot.id}
                className={`p-4 rounded-lg border-2 transition-all ${
                  dayConfig.enabled?.[slot.id] 
                    ? 'bg-brand-neon/10 border-brand-neon' 
                    : 'bg-black/40 border-white/10 opacity-50'
                }`}
              >
                {/* Header - Toggle */}
                <div 
                  onClick={() => handleToggleClass(slot.id)}
                  className="flex items-center justify-between mb-2 cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className={`text-xl ${dayConfig.enabled?.[slot.id] ? 'text-brand-neon' : 'text-white/40'}`}>
                      {dayConfig.enabled?.[slot.id] ? '✓' : '✗'}
                    </div>
                    <div>
                      <p className="text-white font-bold">{slot.time}</p>
                      <p className="text-white/60 text-xs">{slot.label}</p>
                    </div>
                  </div>
                  <div>
                    {dayConfig.enabled?.[slot.id] ? (
                      <Eye size={20} className="text-brand-neon" weight="fill" />
                    ) : (
                      <EyeSlash size={20} className="text-white/40" weight="fill" />
                    )}
                  </div>
                </div>

                {/* Asignación de Entrenador */}
                {dayConfig.enabled?.[slot.id] && (
                  <div className="ml-8 bg-black/30 p-3 rounded border border-white/10">
                    <label className="block text-white/80 text-xs font-bold mb-2 flex items-center gap-1">
                      <User size={14} /> Entrenador
                    </label>
                    <select
                      value={dayConfig.trainers?.[slot.id] || ''}
                      onChange={(e) => handleAssignTrainer(slot.id, e.target.value)}
                      className="w-full px-2 py-1 bg-black/40 border border-white/20 rounded text-white text-sm"
                    >
                      <option value="">Sin asignar</option>
                      {trainers.map(trainer => (
                        <option key={trainer.id} value={trainer.id}>
                          {trainer.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-white/60 text-center py-4">El domingo el gimnasio está cerrado</p>
        )}
      </div>

      {/* Estado de guardado */}
      {saved && (
        <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-3 flex items-center gap-2">
          <CheckCircle size={20} className="text-green-400" weight="fill" />
          <span className="text-green-300 text-sm font-bold">✓ Configuración guardada exitosamente</span>
        </div>
      )}

      {/* Botón guardar */}
      <button 
        onClick={handleSaveConfig}
        disabled={loading || saved}
        className="w-full px-4 py-3 bg-brand-gold text-black rounded-lg hover:bg-yellow-500 font-bold transition-all disabled:opacity-50"
      >
        💾 Guardar Cambios
      </button>

      {/* Resumen */}
      <div className="bg-black/40 rounded-lg p-3 border border-white/10 text-xs text-white/70">
        <p>
          Clases habilitadas hoy: 
          <span className="text-brand-neon font-bold ml-1">
            {Object.values(dayConfig.enabled || {}).filter(Boolean).length} / {schedules.length}
          </span>
        </p>
      </div>
    </div>
  );
}
