import { useState, useEffect } from 'react';
import { db } from '../services/firebase';
import { doc, getDoc } from 'firebase/firestore';

export const useNextClassForAthlete = (userId) => {
  const [nextClass, setNextClass] = useState(null);
  const [trainer, setTrainer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadNextClass = async () => {
      try {
        if (!userId) {
          setLoading(false);
          return;
        }

        const today = new Date();
        const dateKey = today.toISOString().split('T')[0];

        // Obtener reservas del día
        const scheduleRef = doc(db, 'schedule', dateKey);
        const scheduleSnap = await getDoc(scheduleRef);

        if (!scheduleSnap.exists()) {
          setLoading(false);
          return;
        }

        const scheduleData = scheduleSnap.data();

        // Buscar la clase del usuario en el horario de hoy
        let foundClass = null;
        for (const [time, reservations] of Object.entries(scheduleData)) {
          if (Array.isArray(reservations)) {
            const userReservation = reservations.find(r => r.uid === userId);
            if (userReservation) {
              foundClass = {
                time: time,
                dateKey: dateKey
              };
              break;
            }
          }
        }

        if (foundClass) {
          // Obtener entrenador asignado
          const configRef = doc(db, 'system', `schedule_${foundClass.dateKey}`);
          const configSnap = await getDoc(configRef);
          
          if (configSnap.exists()) {
            const config = configSnap.data();
            const trainerId = config.trainers?.[foundClass.time];

            if (trainerId) {
              const trainerRef = doc(db, 'users', trainerId);
              const trainerSnap = await getDoc(trainerRef);
              
              if (trainerSnap.exists()) {
                setTrainer({
                  id: trainerId,
                  name: trainerSnap.data().name
                });
              }
            }
          }

          setNextClass(foundClass);
        }
      } catch (error) {
        console.error('Error cargando próxima clase:', error);
      } finally {
        setLoading(false);
      }
    };

    loadNextClass();
  }, [userId]);

  return { nextClass, trainer, loading };
};
