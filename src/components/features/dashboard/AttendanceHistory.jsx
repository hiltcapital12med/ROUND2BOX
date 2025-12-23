import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { db } from '../../../services/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { CheckCircle, XCircle, Calendar } from '@phosphor-icons/react';

export default function AttendanceHistory() {
  const { user } = useAuth();
  const [attendanceHistory, setAttendanceHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, attended, missed

  useEffect(() => {
    loadAttendanceHistory();
  }, [user]);

  const loadAttendanceHistory = async () => {
    try {
      setLoading(true);
      
      if (!user) return;

      // Obtener registros de asistencia del usuario
      const attendanceRef = collection(db, 'users', user.uid, 'attendance');
      const snapshot = await getDocs(attendanceRef);

      const records = [];
      snapshot.forEach(doc => {
        const data = doc.data();
        records.push({
          date: data.date,
          classTime: data.classTime,
          attended: data.attended === true,
          timestamp: data.timestamp
        });
      });

      // Ordenar por fecha (más reciente primero)
      records.sort((a, b) => new Date(b.date) - new Date(a.date));

      setAttendanceHistory(records);
    } catch (error) {
      console.error('Error loading attendance history:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredHistory = attendanceHistory.filter(record => {
    if (filter === 'attended') return record.attended;
    if (filter === 'missed') return !record.attended;
    return true;
  });

  const stats = {
    total: attendanceHistory.length,
    attended: attendanceHistory.filter(r => r.attended).length,
    missed: attendanceHistory.filter(r => !r.attended).length
  };

  return (
    <div className="space-y-4">
      {/* Encabezado */}
      <div>
        <h3 className="text-lg font-bold text-white mb-2">📋 Historial de Asistencia</h3>
        <p className="text-white/60 text-sm">Seguimiento de todas tus clases</p>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white/5 border border-white/10 rounded-lg p-3 text-center">
          <p className="text-2xl font-bold text-white">{stats.total}</p>
          <p className="text-xs text-white/60 mt-1">Total</p>
        </div>
        <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 text-center">
          <p className="text-2xl font-bold text-green-400">{stats.attended}</p>
          <p className="text-xs text-green-400/80 mt-1">Asistencias</p>
        </div>
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-center">
          <p className="text-2xl font-bold text-red-400">{stats.missed}</p>
          <p className="text-xs text-red-400/80 mt-1">No asistencias</p>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1 rounded-full text-sm font-bold transition ${
            filter === 'all'
              ? 'bg-white text-black'
              : 'bg-white/10 text-white hover:bg-white/20'
          }`}
        >
          Todos
        </button>
        <button
          onClick={() => setFilter('attended')}
          className={`px-3 py-1 rounded-full text-sm font-bold transition ${
            filter === 'attended'
              ? 'bg-green-500 text-white'
              : 'bg-white/10 text-white hover:bg-white/20'
          }`}
        >
          ✓ Asistió
        </button>
        <button
          onClick={() => setFilter('missed')}
          className={`px-3 py-1 rounded-full text-sm font-bold transition ${
            filter === 'missed'
              ? 'bg-red-500 text-white'
              : 'bg-white/10 text-white hover:bg-white/20'
          }`}
        >
          Faltó
        </button>
      </div>

      {/* Historial */}
      {loading ? (
        <div className="text-white/60 text-center py-8">Cargando historial...</div>
      ) : filteredHistory.length === 0 ? (
        <div className="text-white/60 text-center py-8">
          {attendanceHistory.length === 0
            ? 'No tienes registros de asistencia aún'
            : `No hay registros con el filtro seleccionado`}
        </div>
      ) : (
        <div className="space-y-2 max-h-[400px] overflow-y-auto">
          {filteredHistory.map((record, idx) => (
            <div
              key={idx}
              className={`flex items-center gap-3 p-3 rounded-lg border ${
                record.attended
                  ? 'bg-green-500/10 border-green-500/30'
                  : 'bg-red-500/10 border-red-500/30'
              }`}
            >
              <div className="flex-shrink-0">
                {record.attended ? (
                  <CheckCircle size={24} className="text-green-400" weight="fill" />
                ) : (
                  <XCircle size={24} className="text-red-400" weight="fill" />
                )}
              </div>
              <div className="flex-grow">
                <div className="flex items-center gap-2 mb-1">
                  <Calendar size={14} className="text-white/60" />
                  <p className="text-sm font-semibold text-white">
                    {format(parseISO(record.date), 'EEEE, d \'de\' MMMM', { locale: es })}
                  </p>
                </div>
                <p className="text-xs text-white/60">
                  Clase: {record.classTime}h
                </p>
              </div>
              <div className="flex-shrink-0">
                <span className={`text-xs px-2 py-1 rounded-full font-bold ${
                  record.attended
                    ? 'bg-green-500 text-white'
                    : 'bg-red-500 text-white'
                }`}>
                  {record.attended ? 'Asistió' : 'Faltó'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
