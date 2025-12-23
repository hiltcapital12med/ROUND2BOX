// UBICACIÓN: /src/components/features/agenda/AgendaView.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { getDailySlots, CLASS_CAPACITY, isColombianHoliday, COLOMBIAN_HOLIDAYS } from '../../../utils/agendaConfig';
import { db } from '../../../services/firebase';
import { doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { recordAttendance } from '../../../services/attendanceService';
import { Calendar, Clock, CheckCircle, XCircle, Users, Warning } from '@phosphor-icons/react';
import ClassSlotCard from './ClassSlotCard';

export default function AgendaView() {
  const { user, role } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [slots, setSlots] = useState([]);
  const [bookings, setBookings] = useState({});
  const [loading, setLoading] = useState(true);
  const [classCapacity, setClassCapacity] = useState(4);

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
    
    // Cargar configuración del sistema (incluyendo capacidad)
    try {
      const configRef = doc(db, 'system', `schedule_${dateKey}`);
      const configSnap = await getDoc(configRef);
      if (configSnap.exists()) {
        setClassCapacity(configSnap.data().capacity || 4);
      }
    } catch (error) {
      console.log('No hay configuración personalizada, usando capacidad por defecto');
    }

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
      // Obtener datos actuales del documento
      const snap = await getDoc(scheduleRef);
      const currentData = snap.exists() ? snap.data() : {};
      
      // 🔴 VALIDACIÓN: Verificar si el usuario ya tiene una clase ese día
      let userAlreadyHasClassToday = false;
      for (const [time, attendees] of Object.entries(currentData)) {
        if (attendees && Array.isArray(attendees)) {
          const isUserBooked = attendees.some(a => a.uid === user.uid);
          if (isUserBooked) {
            userAlreadyHasClassToday = true;
            break;
          }
        }
      }
      
      if (userAlreadyHasClassToday) {
        alert("⚠️ Solo puedes agendar 1 clase por día. Ya tienes una clase reservada para hoy.");
        return;
      }
      
      // Obtener lista actual de reservas para ese horario
      const currentList = currentData[slotTime] || [];
      
      // Crear nueva reserva
      const newBooking = {
        uid: user.uid,
        name: user.displayName,
        photo: user.photoURL,
        status: 'booked'
      };
      
      // Verificar que el usuario no esté ya inscrito en esta clase específica
      const alreadyBooked = currentList.some(b => b.uid === user.uid);
      if (alreadyBooked) {
        alert("Ya estás inscrito en esta clase.");
        return;
      }
      
      // Verificar capacidad
      if (currentList.length >= classCapacity) {
        alert("La clase está llena.");
        return;
      }
      
      // Actualizar con el nuevo booking
      const updatedList = [...currentList, newBooking];
      
      await setDoc(scheduleRef, {
        [slotTime]: updatedList
      }, { merge: true });
      
      loadSchedule();
    } catch (error) {
      console.error("Error reservando:", error);
      alert("Error al reservar. Intenta de nuevo.");
    }
  };

  const handleCancel = async (slotTime) => {
    const dateKey = selectedDate.toISOString().split('T')[0];
    const scheduleRef = doc(db, "schedule", dateKey);
    
    try {
      const snap = await getDoc(scheduleRef);
      if (!snap.exists()) {
        alert("No hay reservas para este día.");
        return;
      }

      const currentList = snap.data()[slotTime] || [];
      const newList = currentList.filter(u => u.uid !== user.uid);

      await updateDoc(scheduleRef, {
        [slotTime]: newList
      });
      
      loadSchedule();
    } catch (error) {
      console.error("Error cancelando:", error);
      alert("Error al cancelar la reserva.");
    }
  };

  const toggleAttendance = async (slotTime, studentUid, currentStatus) => {
    const dateKey = selectedDate.toISOString().split('T')[0];
    const scheduleRef = doc(db, "schedule", dateKey);
    
    try {
      const snap = await getDoc(scheduleRef);
      if (!snap.exists()) {
        alert("No hay datos de reservas para este día.");
        return;
      }

      const currentList = snap.data()[slotTime] || [];
      const isAttended = currentStatus !== 'attended';
      
      const updatedList = currentList.map(student => {
        if (student.uid === studentUid) {
          return { ...student, status: isAttended ? 'attended' : 'booked' };
        }
        return student;
      });

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
      alert("Error al actualizar asistencia.");
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
            <div className="space-y-2">
                {slots.map((slot) => {
                    const attendees = bookings[slot.time] || [];
                    const isBooked = attendees.some(a => a.uid === user.uid);
                    const isFull = attendees.length >= classCapacity;
                    
                    return (
                        <ClassSlotCard
                            key={slot.id}
                            slot={slot}
                            attendees={attendees}
                            isBooked={isBooked}
                            isFull={isFull}
                            selectedDate={selectedDate}
                            role={role}
                            onCancel={handleCancel}
                            onBook={handleBooking}
                            onToggleAttendance={toggleAttendance}
                            capacity={classCapacity}
                        />
                    );
                })}
            </div>
        )}
      </div>
    </div>
  );
}
