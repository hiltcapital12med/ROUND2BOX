import { useState, useEffect } from 'react';
import { db } from '../services/firebase';
import { doc, getDoc, collection, getDocs, query, where } from 'firebase/firestore';

export const useTrainerForClass = (date, time) => {
  const [trainer, setTrainer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTrainer = async () => {
      try {
        if (!date || !time) {
          setLoading(false);
          return;
        }

        const dateKey = date.toISOString().split('T')[0];
        
        // Obtener configuración del día
        const configRef = doc(db, 'system', `schedule_${dateKey}`);
        const configSnap = await getDoc(configRef);

        let trainerId = null;

        if (configSnap.exists()) {
          const config = configSnap.data();
          trainerId = config.trainers?.[time];
        }

        // Si no hay entrenador asignado, usar el primer entrenador creado como por defecto
        if (!trainerId) {
          const trainersSnapshot = await getDocs(
            query(collection(db, 'users'), where('role', '==', 'trainer'))
          );
          
          if (!trainersSnapshot.empty) {
            trainerId = trainersSnapshot.docs[0].id;
          }
        }

        // Obtener datos del entrenador
        if (trainerId) {
          const trainerRef = doc(db, 'users', trainerId);
          const trainerSnap = await getDoc(trainerRef);
          
          if (trainerSnap.exists()) {
            setTrainer({
              id: trainerId,
              name: trainerSnap.data().name,
              email: trainerSnap.data().email
            });
          }
        }
      } catch (error) {
        console.error('Error cargando entrenador:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTrainer();
  }, [date, time]);

  return { trainer, loading };
};

export default useTrainerForClass;
