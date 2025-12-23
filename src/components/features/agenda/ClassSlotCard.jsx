import React from 'react';
import { CheckCircle, Clock, Users, Warning } from '@phosphor-icons/react';
import { useTrainerForClass } from '../../../hooks/useTrainerForClass';

export default function ClassSlotCard({ 
  slot, 
  attendees, 
  isBooked, 
  isFull, 
  selectedDate, 
  role, 
  onCancel, 
  onBook, 
  onToggleAttendance,
  capacity = 4
}) {
  // Hook seguro dentro del componente (no en un loop)
  const { trainer, loading: trainerLoading } = useTrainerForClass(selectedDate, slot.id);

  return (
    <div key={slot.id} className={`relative rounded-2xl border p-5 transition-all ${
      isBooked 
      ? 'bg-brand-charcoal border-brand-gold shadow-gold-glow'
      : 'bg-brand-charcoal border-white/5'
    }`}>
      
      {/* ALERTAS DE CAPACIDAD */}
      {isFull && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500 rounded-lg flex items-center gap-2 animate-pulse">
          <Warning size={16} className="text-red-500 flex-shrink-0" />
          <span className="text-xs text-red-400 font-bold">¡Clase llena! Máximo {capacity} participantes</span>
        </div>
      )}

      {!isFull && attendees.length >= capacity - 1 && (
        <div className="mb-4 p-3 bg-yellow-500/10 border border-yellow-500 rounded-lg flex items-center gap-2">
          <Warning size={16} className="text-yellow-500 flex-shrink-0" />
          <span className="text-xs text-yellow-400 font-bold">¡Última plaza disponible!</span>
        </div>
      )}

      {/* ENCABEZADO: HORA Y NOMBRE */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Clock size={18} className="text-brand-gold" />
            <span className="text-2xl font-black text-white">{slot.time}</span>
          </div>
          <span className="text-sm text-gray-400 uppercase tracking-wider">{slot.label}</span>
        </div>
        
        {/* INDICADOR DE CUPOS */}
        <div className="text-right">
          <div className="flex items-center justify-end gap-1 text-xs font-bold text-gray-400 mb-1">
            <Users size={14} />
            <span>{attendees.length}/{capacity}</span>
          </div>
          <div className="w-20 h-1.5 bg-gray-700 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full ${isFull ? 'bg-brand-red' : 'bg-brand-gold'}`} 
              style={{ width: `${(attendees.length / capacity) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* ENTRENADOR ASIGNADO */}
      <div className="mb-4 p-3 bg-brand-gold/10 border border-brand-gold/30 rounded-lg">
        <p className="text-xs text-brand-gold/80 uppercase font-bold mb-1">👨‍🏫 Entrenador</p>
        {trainerLoading ? (
          <p className="text-sm text-gray-400">Cargando...</p>
        ) : trainer ? (
          <p className="text-sm font-bold text-white">{trainer.name}</p>
        ) : (
          <p className="text-sm text-gray-500">Por asignar</p>
        )}
      </div>

      {/* ZONA DE ACCIÓN: ATLETA */}
      {role === 'user' && (
        <div className="mt-2">
          {isBooked ? (
            <button 
              onClick={() => onCancel(slot.time)}
              className="w-full py-3 rounded-xl border border-red-500 text-red-500 font-bold text-sm hover:bg-red-500/10 transition"
            >
              Cancelar Reserva
            </button>
          ) : isFull ? (
            <button disabled className="w-full py-3 rounded-xl bg-gray-600 text-gray-400 font-bold text-sm cursor-not-allowed">
              Clase Llena
            </button>
          ) : (
            <button 
              onClick={() => onBook(slot.time)}
              className="w-full py-3 rounded-xl bg-brand-gold text-black font-bold text-sm hover:bg-brand-gold/90 transition shadow-lg shadow-brand-gold/20"
            >
              Reservar
            </button>
          )}
        </div>
      )}

      {/* ZONA DE ACCIÓN: ENTRENADOR (ADMIN) */}
      {(role === 'trainer' || role === 'admin') && (
        <div className="mt-4 pt-4 border-t border-white/10">
          <h4 className="text-xs text-brand-gold uppercase font-bold mb-3">Lista de Asistencia ({attendees.length}/{capacity})</h4>
          {attendees.length === 0 ? (
            <p className="text-gray-500 text-xs italic">Nadie inscrito aún.</p>
          ) : (
            <div className="space-y-2">
              {attendees.map((student) => (
                <div key={student.uid} className="flex items-center justify-between bg-black/20 p-2 rounded-lg">
                  <div className="flex items-center gap-2">
                    <img src={student.photo || 'https://via.placeholder.com/30'} className="w-6 h-6 rounded-full" />
                    <span className={`text-sm ${student.status === 'attended' ? 'text-white' : 'text-gray-400'}`}>
                      {student.name}
                    </span>
                  </div>
                  <button 
                    onClick={() => onToggleAttendance(slot.time, student.uid, student.status)}
                    className={`p-1.5 rounded-full transition ${
                      student.status === 'attended' 
                      ? 'bg-green-500 text-white shadow-[0_0_10px_rgba(34,197,94,0.5)]' 
                      : 'bg-gray-700 text-gray-500'
                    }`}
                  >
                    <CheckCircle weight="fill" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
