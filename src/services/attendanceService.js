// UBICACIÓN: /src/services/attendanceService.js
// Servicio para gestionar la asistencia semanal del usuario

import { db } from './firebase';
import { doc, setDoc, collection, writeBatch } from 'firebase/firestore';

/**
 * Registrar asistencia cuando el usuario se presenta a una clase
 * @param {string} userId - UID del usuario
 * @param {string} date - Fecha en formato YYYY-MM-DD
 * @param {string} classTime - Hora de la clase (ej: 18:30)
 * @param {boolean} attended - Si asistió o no
 */
export const recordAttendance = async (userId, date, classTime, attended = true) => {
  try {
    const attendanceRef = doc(
      collection(db, 'users', userId, 'attendance'),
      date
    );

    await setDoc(attendanceRef, {
      date,
      classTime,
      attended,
      timestamp: new Date()
    }, { merge: true });

    console.log(`✅ Asistencia registrada para ${date}`);
    return true;
  } catch (error) {
    console.error('Error registrando asistencia:', error);
    return false;
  }
};

/**
 * Registrar múltiples asistencias (para importar datos históricos)
 * @param {string} userId - UID del usuario
 * @param {Array} attendances - Array de asistencias
 */
export const recordBulkAttendances = async (userId, attendances) => {
  try {
    const batch = writeBatch(db);

    attendances.forEach((attendance) => {
      const { date, classTime, attended } = attendance;
      const attendanceRef = doc(
        collection(db, 'users', userId, 'attendance'),
        date
      );

      batch.set(attendanceRef, {
        date,
        classTime,
        attended: attended ?? true,
        timestamp: new Date()
      }, { merge: true });
    });

    await batch.commit();
    console.log(`✅ ${attendances.length} registros de asistencia guardados`);
    return true;
  } catch (error) {
    console.error('Error registrando asistencias en lote:', error);
    return false;
  }
};

/**
 * Obtener la estructura de colección para un usuario
 * Útil para inicializar la estructura en Firebase
 */
export const initializeUserAttendanceStructure = async (userId) => {
  try {
    // Crear un documento raíz si no existe
    const userRef = doc(db, 'users', userId);
    await setDoc(userRef, {
      createdAt: new Date(),
      lastUpdated: new Date()
    }, { merge: true });

    console.log('✅ Estructura de usuario inicializada');
    return true;
  } catch (error) {
    console.error('Error inicializando estructura:', error);
    return false;
  }
};
