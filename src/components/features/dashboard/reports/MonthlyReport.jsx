import { useEffect, useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../../../services/firebase';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { startOfMonth, endOfMonth, eachWeekOfInterval, startOfDay, endOfDay, format } from 'date-fns';
import { es } from 'date-fns/locale';

export default function MonthlyReport() {
  const [monthlyData, setMonthlyData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadMonthlyReport();
  }, []);

  const loadMonthlyReport = async () => {
    try {
      setLoading(true);
      const today = new Date();
      const start = startOfMonth(today);
      const end = endOfMonth(today);
      
      // Agrupar por semanas
      const weeks = eachWeekOfInterval(
        { start, end },
        { weekStartsOn: 1 }
      );

      const chartData = [];
      let totalReservations = 0;

      for (const weekStart of weeks) {
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekEnd.getDate() + 6);

        const dayStart = startOfDay(weekStart);
        const dayEnd = endOfDay(weekEnd > end ? end : weekEnd);

        const scheduleRef = collection(db, 'schedule');
        const q = query(
          scheduleRef,
          where('date', '>=', dayStart),
          where('date', '<=', dayEnd)
        );

        const snapshot = await getDocs(q);
        const reservations = snapshot.docs.reduce(
          (sum, doc) => sum + (doc.data().reservations?.length || 0),
          0
        );

        totalReservations += reservations;

        chartData.push({
          week: `Sem ${format(weekStart, 'w', { locale: es })}`,
          date: `${format(weekStart, 'd/M')} - ${format(weekEnd > end ? end : weekEnd, 'd/M')}`,
          reservations: reservations,
          classes: snapshot.docs.length,
        });
      }

      setMonthlyData(chartData);
    } catch (error) {
      console.error('Error loading monthly report:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalReservations = monthlyData.reduce((sum, d) => sum + d.reservations, 0);
  const totalClasses = monthlyData.reduce((sum, d) => sum + d.classes, 0);
  const avgPerWeek = monthlyData.length > 0 ? (totalReservations / monthlyData.length).toFixed(1) : 0;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-white">Reporte Mensual</h3>

      {loading ? (
        <div className="text-white/60 text-center py-8">Cargando...</div>
      ) : monthlyData.length === 0 ? (
        <div className="text-white/60 text-center py-8">Sin datos de este mes</div>
      ) : (
        <>
          <div className="bg-black/40 rounded-lg p-4 border border-white/10">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis
                  dataKey="week"
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
                <Bar
                  dataKey="reservations"
                  fill="#00FF00"
                  radius={[8, 8, 0, 0]}
                  name="Reservas"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="bg-black/40 rounded-lg p-4 border border-white/10">
              <p className="text-white/60 text-sm">Total Reservas</p>
              <p className="text-2xl font-bold text-brand-neon">{totalReservations}</p>
            </div>
            <div className="bg-black/40 rounded-lg p-4 border border-white/10">
              <p className="text-white/60 text-sm">Promedio/Semana</p>
              <p className="text-2xl font-bold text-brand-neon">{avgPerWeek}</p>
            </div>
            <div className="bg-black/40 rounded-lg p-4 border border-white/10">
              <p className="text-white/60 text-sm">Total Clases</p>
              <p className="text-2xl font-bold text-brand-neon">{totalClasses}</p>
            </div>
          </div>

          <div className="bg-black/40 rounded-lg p-4 border border-white/10 space-y-2 max-h-[200px] overflow-y-auto">
            <p className="text-white font-bold mb-3">Detalles por semana</p>
            {monthlyData.map((week, idx) => (
              <div key={idx} className="border-b border-white/10 pb-2 last:border-b-0">
                <div className="flex justify-between items-start text-sm mb-1">
                  <span className="text-white font-semibold">{week.week}</span>
                  <span className="text-brand-neon font-semibold">{week.reservations} reservas</span>
                </div>
                <div className="text-white/60 text-xs">{week.date}</div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
