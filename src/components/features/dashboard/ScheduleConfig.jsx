import React, { useState, useEffect } from 'react';
import { db } from '../../../services/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { SCHEDULES } from '../../../utils/agendaConfig';
import { Eye, EyeSlash, CheckCircle } from '@phosphor-icons/react';

export default function ScheduleConfig() {
  const [config, setConfig] = useState({
    weekdaysEnabled: {},
    saturdayEnabled: {},
    capacity: 4
  });
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
        // Inicializar todas las clases como habilitadas
        const initialConfig = {
          weekdaysEnabled: {},
          saturdayEnabled: {},
          capacity: 4
        };
        
        SCHEDULES.weekdays.forEach(slot => {
          initialConfig.weekdaysEnabled[slot.id] = true;
        });
        
        SCHEDULES.saturday.forEach(slot => {
          initialConfig.saturdayEnabled[slot.id] = true;
        });
        
        setConfig(initialConfig);
      }
    } catch (error) {
      console.error('Error cargando configuración:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleClass = (type, id) => {
    setConfig(prev => {
      const key = type === 'weekday' ? 'weekdaysEnabled' : 'saturdayEnabled';
      return {
        ...prev,
        [key]: {
          ...prev[key],
          [id]: !prev[key][id]
        }
      };
    });
    setSaved(false);
  };

  const handleSaveConfig = async () => {
    try {
      setLoading(true);
      const configRef = doc(db, 'system', 'config');
      await setDoc(configRef, config, { merge: true });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Error guardando configuración:', error);
      alert('Error al guardar la configuración');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !config.capacity) {
    return <div className="text-white/60 text-center py-4">Cargando...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div>
        <h3 className="text-lg font-bold text-white mb-2">Configurar Horarios</h3>
        <p className="text-white/60 text-sm">Haz visible u oculta los horarios de clase con un clic</p>
      </div>

      {/* Capacidad */}
      <div className="bg-black/40 p-4 rounded-lg border border-white/10">
        <label className="block text-white font-bold text-sm mb-2">Capacidad máxima por clase</label>
        <input 
          type="number" 
          min="1"
          max="20"
          value={config.capacity}
          onChange={(e) => { 
            setConfig({...config, capacity: parseInt(e.target.value)});
            setSaved(false);
          }}
          className="w-full px-3 py-2 bg-black/30 border border-white/10 rounded-lg text-white"
        />
      </div>

      {/* Horarios Lunes a Viernes */}
      <div className="space-y-3">
        <h4 className="text-white font-bold text-sm">📅 Lunes a Viernes</h4>
        <div className="grid grid-cols-1 gap-2">
          {SCHEDULES.weekdays.map(slot => (
            <div 
              key={slot.id}
              onClick={() => handleToggleClass('weekday', slot.id)}
              className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                config.weekdaysEnabled?.[slot.id] 
                  ? 'bg-brand-neon/10 border-brand-neon' 
                  : 'bg-black/40 border-white/10 opacity-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`text-xl ${config.weekdaysEnabled?.[slot.id] ? 'text-brand-neon' : 'text-white/40'}`}>
                    {config.weekdaysEnabled?.[slot.id] ? '✓' : '✗'}
                  </div>
                  <div>
                    <p className="text-white font-bold">{slot.time}</p>
                    <p className="text-white/60 text-xs">{slot.label}</p>
                  </div>
                </div>
                <div>
                  {config.weekdaysEnabled?.[slot.id] ? (
                    <Eye size={20} className="text-brand-neon" weight="fill" />
                  ) : (
                    <EyeSlash size={20} className="text-white/40" weight="fill" />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Horarios Sábado */}
      <div className="space-y-3">
        <h4 className="text-white font-bold text-sm">🏋️ Sábado</h4>
        <div className="grid grid-cols-1 gap-2">
          {SCHEDULES.saturday.map(slot => (
            <div 
              key={slot.id}
              onClick={() => handleToggleClass('saturday', slot.id)}
              className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                config.saturdayEnabled?.[slot.id] 
                  ? 'bg-brand-neon/10 border-brand-neon' 
                  : 'bg-black/40 border-white/10 opacity-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`text-xl ${config.saturdayEnabled?.[slot.id] ? 'text-brand-neon' : 'text-white/40'}`}>
                    {config.saturdayEnabled?.[slot.id] ? '✓' : '✗'}
                  </div>
                  <div>
                    <p className="text-white font-bold">{slot.time}</p>
                    <p className="text-white/60 text-xs">{slot.label}</p>
                  </div>
                </div>
                <div>
                  {config.saturdayEnabled?.[slot.id] ? (
                    <Eye size={20} className="text-brand-neon" weight="fill" />
                  ) : (
                    <EyeSlash size={20} className="text-white/40" weight="fill" />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
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
        disabled={loading}
        className="w-full px-4 py-3 bg-brand-gold text-black rounded-lg hover:bg-yellow-500 font-bold transition-all disabled:opacity-50"
      >
        💾 Guardar Configuración
      </button>

      {/* Resumen */}
      <div className="bg-black/40 rounded-lg p-3 border border-white/10 text-xs text-white/70">
        <p>
          Clases habilitadas: 
          <span className="text-brand-neon font-bold ml-1">
            {Object.values(config.weekdaysEnabled || {}).filter(Boolean).length} (L-V) + 
            {Object.values(config.saturdayEnabled || {}).filter(Boolean).length} (Sábado)
          </span>
        </p>
      </div>
    </div>
  );
}
