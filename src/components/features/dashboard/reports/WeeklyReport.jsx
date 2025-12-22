import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../../../services/firebase';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { startOfWeek, endOfWeek, eachDayOfInterval, startOfDay, endOfDay, format } from 'date-fns';
import { es } from 'date-fns/locale';

export default function WeeklyReport() {
  const [weeklyData, setWeeklyData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadWeeklyReport();
  }, []);

  const loadWeeklyReport = async () => {
    try {
      setLoading(true);
      const today = new Date();
      const start = startOfWeek(today, { weekStartsOn: 1 });
      const end = endOfWeek(today, { weekStartsOn: 1 });
      
      const days = eachDayOfInterval({ start, end });
      const chartData = [];

      for (const day of days) {
        const dayStart = startOfDay(day);
        const dayEnd = endOfDay(day);

        const scheduleRef = collection(db, 'schedule');
        const q = query(
          scheduleRef,
          where('date', '>=', dayStart),
          where('date', '<=', dayEnd)
        );

        const snapshot = await getDocs(q);
        const totalReservations = snapshot.docs.reduce(
          (sum, doc) => sum + (doc.data().reservations?.length || 0),
          0
        );

        chartData.push({
          day: format(day, 'EEE', { locale: es }).substring(0, 3),
          fullDate: format(day, 'd/M'),
          reservations: totalReservations,
          classes: snapshot.docs.length,
        });
      }

      setWeeklyData(chartData);
    } catch (error) {
      console.error('Error loading weekly report:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalReservations = weeklyData.reduce((sum, d) => sum + d.reservations, 0);
  const avgReservations = weeklyData.length > 0 ? (totalReservations / weeklyData.length).toFixed(1) : 0;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-white">Reporte Semanal</h3>

      {loading ? (
        <div className="text-white/60 text-center py-8">Cargando...</div>
      ) : weeklyData.length === 0 ? (
        <div className="text-white/60 text-center py-8">Sin datos de esta semana</div>
      ) : (
        <>
          <div className="bg-black/40 rounded-lg p-4 border border-white/10">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis
                  dataKey="day"
                  stroke="rgba(255,255,255,0.6)"
                  style={{ fontSize: '12px' }}
                />
                <YAxis stroke="rgba(255,255,255,0.6)" style={{ fontSize: '12px' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1a1a1a',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '8px',
                  }}
                  labelStyle={{ color: '#fff' }}
                  formatter={(value) => [`${value} reservas`, 'Asistencia']}
                />
                <Line
                  type="monotone"
                  dataKey="reservations"
                  stroke="#00FF00"
                  strokeWidth={2}
                  dot={{ fill: '#00FF00', r: 5 }}
                  activeDot={{ r: 7 }}
                  name="Reservas"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="bg-black/40 rounded-lg p-4 border border-white/10">
              <p className="text-white/60 text-sm">Total Reservas</p>
              <p className="text-2xl font-bold text-brand-neon">{totalReservations}</p>
            </div>
            <div className="bg-black/40 rounded-lg p-4 border border-white/10">
              <p className="text-white/60 text-sm">Promedio/Día</p>
              <p className="text-2xl font-bold text-brand-neon">{avgReservations}</p>
            </div>
            <div className="bg-black/40 rounded-lg p-4 border border-white/10">
              <p className="text-white/60 text-sm">Clases</p>
              <p className="text-2xl font-bold text-brand-neon">
                {weeklyData.reduce((sum, d) => sum + d.classes, 0)}
              </p>
            </div>
          </div>

          <div className="bg-black/40 rounded-lg p-4 border border-white/10 space-y-2 max-h-[200px] overflow-y-auto">
            <p className="text-white font-bold mb-3">Detalles por día</p>
            {weeklyData.map((day, idx) => (
              <div key={idx} className="flex justify-between items-center text-sm">
                <span className="text-white/80">{day.day} ({day.fullDate})</span>
                <div className="flex gap-4">
                  <span className="text-brand-neon font-semibold">{day.reservations} reservas</span>
                  <span className="text-white/60">{day.classes} clases</span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
