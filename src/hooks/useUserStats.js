// UBICACIÓN: /src/hooks/useUserStats.js
// Hook personalizado para cargar estadísticas del usuario desde Firebase

import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { useAuth } from '../context/AuthContext';

export function useUserStats() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    weight: null,
    height: null,
    bmi: null,
    gender: null,
    birthdate: null,
    loading: true,
    error: null
  });

  useEffect(() => {
    const loadStats = async () => {
      if (!user) {
        setStats(prev => ({ ...prev, loading: false }));
        return;
      }

      try {
        setStats(prev => ({ ...prev, loading: true, error: null }));
        
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const userData = userSnap.data();
          const weight = userData.stats?.weight || null;
          const height = userData.medical?.height || null;
          const bmi = userData.stats?.bmi || null;
          const gender = userData.medical?.gender || null;
          const birthdate = userData.medical?.birthdate || null;

          setStats({
            weight,
            height,
            bmi,
            gender,
            birthdate,
            loading: false,
            error: null
          });

          console.log('✅ Estadísticas cargadas:', { weight, bmi });
        } else {
          setStats(prev => ({ 
            ...prev, 
            loading: false, 
            error: 'Usuario no encontrado' 
          }));
        }
      } catch (error) {
        console.error('Error cargando estadísticas:', error);
        setStats(prev => ({ 
          ...prev, 
          loading: false, 
          error: error.message 
        }));
      }
    };

    loadStats();
  }, [user]);

  return stats;
}
