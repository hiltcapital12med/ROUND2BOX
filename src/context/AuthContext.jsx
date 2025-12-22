// UBICACIÓN: /src/context/AuthContext.jsx
import React from 'react';
import { createContext, useContext, useState, useEffect } from 'react';
import { 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged 
} from "firebase/auth";
import { auth, db } from '../services/firebase'; 
import { doc, getDoc, setDoc } from "firebase/firestore";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null); 
  const [loading, setLoading] = useState(true);
  
  // NUEVO: Variable global para errores de autenticación
  const [authError, setAuthError] = useState(null);

  // Función para limpiar errores manualmente desde la UI
  const clearError = () => setAuthError(null);

  const loginWithGoogle = async (requestedRole) => {
    setAuthError(null); // Limpiamos errores viejos al empezar
    const provider = new GoogleAuthProvider();
    
    try {
      const result = await signInWithPopup(auth, provider);
      const firebaseUser = result.user;

      // Verificación en BD
      const userRef = doc(db, "users", firebaseUser.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const realRole = userSnap.data().role || 'user';

        // 🛑 VALIDACIÓN ESTRICTA
        if (realRole !== requestedRole) {
          await signOut(auth);
          setUser(null);
          setRole(null);
          
          // Mapeamos roles a español
          const roleNames = {
            user: 'Atleta',
            trainer: 'Entrenador',
            admin: 'Administrador'
          };
          
          // GUARDAMOS EL ERROR EN EL ESTADO GLOBAL
          setAuthError(`ACCESO DENEGADO: Esta cuenta es de '${roleNames[realRole]}', no de '${roleNames[requestedRole]}'.`);
          return; // Cortamos aquí
        }

        setRole(realRole);
      } else {
        // Registro nuevo
        const roleToAssign = requestedRole || 'user';
        await setDoc(userRef, {
          email: firebaseUser.email,
          name: firebaseUser.displayName,
          photo: firebaseUser.photoURL,
          role: roleToAssign, 
          createdAt: new Date(),
          medical: {}, 
          stats: {}
        });
        setRole(roleToAssign);
      }
      
      setUser(firebaseUser);

    } catch (error) {
      console.error("Error Auth:", error);
      // Si el error no fue nuestro bloqueo personalizado, guardamos el de Firebase
      if (!authError) setAuthError(error.message.replace("Firebase: ", ""));
    }
  };

  const logout = () => {
    signOut(auth);
    setRole(null);
    setUser(null);
    setAuthError(null);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const userRef = doc(db, "users", currentUser.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setRole(userSnap.data().role);
          setUser(currentUser);
        } else {
            // Usuario fantasma (en Auth pero no en BD), limpiar
            signOut(auth);
            setUser(null);
        }
      } else {
        setUser(null);
        setRole(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, role, loading, authError, loginWithGoogle, logout, clearError }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);