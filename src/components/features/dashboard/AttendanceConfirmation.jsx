import React, { useEffect, useState } from 'react';
import { db } from '../../../services/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { CheckCircle } from '@phosphor-icons/react';

const CONGRATULATIONS_MESSAGES = [
  {
    title: "¡Excelente compromiso!",
    message: "Tu constancia es lo que nos mantiene unidos como comunidad"
  },
  {
    title: "¡Presencia confirmada!",
    message: "Gracias por ser parte de Round2Box hoy"
  },
  {
    title: "¡Lo hiciste!",
    message: "Tu disciplina y buena energía trasforman nuestro espacio"
  },
  {
    title: "¡Qué orgullo!",
    message: "Hoy elegiste pertenecer. Eso es lo más importante"
  },
  {
    title: "¡Increíble!",
    message: "Tu esfuerzo hoy es inspiración para todos aquí"
  }
];

export default function AttendanceConfirmation({ userId, nextClass }) {
  const [attended, setAttended] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const checkAttendance = async () => {
      try {
        if (!userId || !nextClass) return;

        const today = new Date().toISOString().split('T')[0];
        const attendanceRef = doc(db, 'users', userId, 'attendance', today);
        const attendanceSnap = await getDoc(attendanceRef);

        if (attendanceSnap.exists() && attendanceSnap.data().attended === true) {
          setAttended(true);
          // Seleccionar mensaje aleatorio de felicitación
          const randomMsg = CONGRATULATIONS_MESSAGES[
            Math.floor(Math.random() * CONGRATULATIONS_MESSAGES.length)
          ];
          setMessage(randomMsg);
        }
      } catch (error) {
        console.error('Error verificando asistencia:', error);
      }
    };

    checkAttendance();
  }, [userId, nextClass]);

  if (!attended || !message) return null;

  return (
    <div className="mb-8 animate-fade-in-up">
      <div className="relative bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/50 rounded-2xl p-6 overflow-hidden">
        {/* Efecto de brillo */}
        <div className="absolute inset-0 bg-gradient-to-r from-green-500/0 via-green-500/10 to-green-500/0 translate-x-[-100%] animate-pulse"></div>

        <div className="relative z-10 flex items-start gap-4">
          <CheckCircle size={32} className="text-green-400 flex-shrink-0 mt-1" weight="fill" />
          
          <div>
            <h2 className="text-xl font-bold text-green-300 mb-1">
              {message.title}
            </h2>
            <p className="text-green-300/80 text-sm">
              {message.message}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
