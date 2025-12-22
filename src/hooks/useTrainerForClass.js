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

        if (configSnap.exists()) {
          const config = configSnap.data();
          const trainerId = config.trainers?.[time];

          if (trainerId) {
            // Obtener datos del entrenador
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
