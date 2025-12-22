import React, { useState, useEffect } from 'react';
import { db } from '../../../services/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { SCHEDULES } from '../../../utils/agendaConfig';
import { Eye, EyeSlash, CheckCircle, CaretLeft, CaretRight } from '@phosphor-icons/react';
import { format, addDays, startOfWeek, isSameDay, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

export default function ScheduleConfig({ onClose }) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [config, setConfig] = useState({});
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      const configRef = doc(db, 'system', 'config');
      const configSnap = await getDoc(configRef);
      
      if (configSnap.exists()) {
        setConfig(configSnap.data());
      } else {
        // Inicializar config vacío
        setConfig({});
      }
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

  const handleSaveConfig = async () => {
    try {
      setLoading(true);
      
      // Guardar todos los cambios
      for (const [dateKey, dayConfig] of Object.entries(config)) {
        const configRef = doc(db, 'system', dateKey);
        await setDoc(configRef, dayConfig, { merge: true });
      }
      
      setSaved(true);
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error) {
      console.error('Error guardando configuración:', error);
      alert('Error al guardar la configuración');
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
          <div className="grid grid-cols-1 gap-2">
            {schedules.map(slot => (
              <div 
                key={slot.id}
                onClick={() => handleToggleClass(slot.id)}
                className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                  dayConfig.enabled?.[slot.id] 
                    ? 'bg-brand-neon/10 border-brand-neon' 
                    : 'bg-black/40 border-white/10 opacity-50'
                }`}
              >
                <div className="flex items-center justify-between">
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
