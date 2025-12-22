// UBICACIÓN: /src/components/features/agenda/AgendaView.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { getDailySlots, CLASS_CAPACITY, isColombianHoliday, COLOMBIAN_HOLIDAYS } from '../../../utils/agendaConfig';
import { db } from '../../../services/firebase';
import { doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { recordAttendance } from '../../../services/attendanceService';
import { Calendar, Clock, CheckCircle, XCircle, Users, Warning } from '@phosphor-icons/react';

export default function AgendaView() {
  const { user, role } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [slots, setSlots] = useState([]);
  const [bookings, setBookings] = useState({});
  const [loading, setLoading] = useState(true);

  const generateDays = () => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      days.push(d);
    }
    return days;
  };
  const weekDays = generateDays();

  useEffect(() => {
    loadSchedule();
  }, [selectedDate]);

  const loadSchedule = async () => {
    setLoading(true);
    const dailySlots = getDailySlots(selectedDate);
    setSlots(dailySlots);

    const dateKey = selectedDate.toISOString().split('T')[0];
    const scheduleRef = doc(db, "schedule", dateKey);
    const snap = await getDoc(scheduleRef);

    if (snap.exists()) {
      setBookings(snap.data());
    } else {
      setBookings({});
    }
    setLoading(false);
  };

  const handleBooking = async (slotTime) => {
    const dateKey = selectedDate.toISOString().split('T')[0];
    const scheduleRef = doc(db, "schedule", dateKey);
    
    try {
      await setDoc(scheduleRef, {
        [slotTime]: arrayUnion({
            uid: user.uid,
            name: user.displayName,
            photo: user.photoURL,
            status: 'booked'
        })
      }, { merge: true });
      loadSchedule();
    } catch (error) {
      console.error("Error reservando:", error);
      alert("Error al reservar.");
    }
  };

  const handleCancel = async (slotTime) => {
    const dateKey = selectedDate.toISOString().split('T')[0];
    const scheduleRef = doc(db, "schedule", dateKey);
    
    const currentList = bookings[slotTime] || [];
    const newList = currentList.filter(u => u.uid !== user.uid);

    await updateDoc(scheduleRef, {
        [slotTime]: newList
    });
    loadSchedule();
  };

  const toggleAttendance = async (slotTime, studentUid, currentStatus) => {
    const dateKey = selectedDate.toISOString().split('T')[0];
    const scheduleRef = doc(db, "schedule", dateKey);
    
    const currentList = bookings[slotTime] || [];
    const isAttended = currentStatus !== 'attended';
    
    const updatedList = currentList.map(student => {
        if (student.uid === studentUid) {
            return { ...student, status: isAttended ? 'attended' : 'booked' };
        }
        return student;
    });

    try {
      await updateDoc(scheduleRef, { [slotTime]: updatedList });
      
      // ✅ REGISTRAR ASISTENCIA EN EL SERVICIO DE PROGRESO
      // Solo los trainers/admin pueden registrar, y solo si marca como "attended"
      if (isAttended && (role === 'trainer' || role === 'admin')) {
        await recordAttendance(studentUid, dateKey, slotTime, true);
        console.log(`✅ Asistencia registrada para ${studentUid} el ${dateKey}`);
      }
      
      loadSchedule();
    } catch (error) {
      console.error('Error actualizando asistencia:', error);
    }
  };

  return (
    <div className="pb-20">
      {/* 1. SELECTOR DE DÍAS (Horizontal) */}
      <div className="flex overflow-x-auto gap-3 p-4 pb-2 mb-4 scrollbar-hide">
        {weekDays.map((date, idx) => {
            const isSelected = date.toDateString() === selectedDate.toDateString();
            const dayName = date.toLocaleDateString('es-ES', { weekday: 'short' });
            const dayNum = date.getDate();
            
            return (
                <button 
                    key={idx}
                    onClick={() => setSelectedDate(date)}
                    className={`flex flex-col items-center justify-center min-w-[60px] h-[70px] rounded-xl border transition-all ${
                        isSelected 
                        ? 'bg-brand-red text-white border-brand-red shadow-lg shadow-brand-red/30' 
                        : 'bg-brand-charcoal text-gray-400 border-white/10 hover:border-brand-gold/50'
                    }`}
                >
                    <span className="text-xs uppercase font-bold">{dayName}</span>
                    <span className="text-xl font-black">{dayNum}</span>
                </button>
            );
        })}
      </div>

      {/* 2. LISTA DE CLASES */}
      <div className="px-4 space-y-4 animate-fade-in-up">
        {slots.length === 0 ? (
            <div className="text-center text-gray-500 py-10">
                {isColombianHoliday(selectedDate) ? (
                    <div className="space-y-2">
                        <p className="text-lg font-bold text-brand-gold">🎉 ¡Festivo en Colombia!</p>
                        <p>Hoy no hay entrenamiento. ¡Disfruta el descanso!</p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        <p className="text-lg font-bold text-gray-400">😴 Día de Descanso</p>
                        <p>Hoy es domingo. ¡Recupera energías!</p>
                    </div>
                )}
            </div>
        ) : (
            slots.map((slot) => {
                const attendees = bookings[slot.time] || [];
                const isBooked = attendees.some(a => a.uid === user.uid);
                const isFull = attendees.length >= CLASS_CAPACITY;
                
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
                                <span className="text-xs text-red-400 font-bold">¡Clase llena! Máximo {CLASS_CAPACITY} participantes</span>
                            </div>
                        )}

                        {!isFull && attendees.length >= CLASS_CAPACITY - 1 && (
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
                                    <span>{attendees.length}/{CLASS_CAPACITY}</span>
                                </div>
                                <div className="w-20 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                                    <div 
                                        className={`h-full rounded-full ${isFull ? 'bg-brand-red' : 'bg-brand-gold'}`} 
                                        style={{ width: `${(attendees.length / CLASS_CAPACITY) * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>

                        {/* ZONA DE ACCIÓN: ATLETA */}
                        {role === 'user' && (
                            <div className="mt-2">
                                {isBooked ? (
                                    <button 
                                        onClick={() => handleCancel(slot.time)}
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
                                        onClick={() => handleBooking(slot.time)}
                                        className="w-full py-3 rounded-xl bg-brand-red text-white font-bold text-sm shadow-lg shadow-brand-red/20 hover:scale-[1.02] transition"
                                    >
                                        Reservar Lugar
                                    </button>
                                )}
                            </div>
                        )}

                        {/* ZONA DE ACCIÓN: ENTRENADOR (ADMIN) */}
                        {(role === 'trainer' || role === 'admin') && (
                            <div className="mt-4 pt-4 border-t border-white/10">
                                <h4 className="text-xs text-brand-gold uppercase font-bold mb-3">Lista de Asistencia ({attendees.length}/{CLASS_CAPACITY})</h4>
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
                                                    onClick={() => toggleAttendance(slot.time, student.uid, student.status)}
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
            })
        )}
      </div>
    </div>
  );
}
