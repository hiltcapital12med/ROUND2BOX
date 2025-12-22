import { useEffect, useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../../../services/firebase';
import { format, startOfDay, endOfDay } from 'date-fns';

export default function DailyReport() {
  const [dailyData, setDailyData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadDailyReport();
  }, [selectedDate]);

  const loadDailyReport = async () => {
    try {
      setLoading(true);
      const dateObj = new Date(selectedDate);
      const start = startOfDay(dateObj);
      const end = endOfDay(dateObj);

      // Obtener todas las reservas del día
      const scheduleRef = collection(db, 'schedule');
      const q = query(
        scheduleRef,
        where('date', '>=', start),
        where('date', '<=', end)
      );

      const snapshot = await getDocs(q);
      const data = [];

      for (const doc of snapshot.docs) {
        const schedule = doc.data();
        
        // Obtener info del usuario
        const usersRef = collection(db, 'users');
        const userQuery = query(usersRef, where('__name__', '==', schedule.userId));
        const userSnapshot = await getDocs(userQuery);
        
        let userName = 'Usuario Desconocido';
        if (!userSnapshot.empty) {
          userName = userSnapshot.docs[0].data().name || 'Sin nombre';
        }

        data.push({
          time: schedule.time,
          userName: userName,
          userId: schedule.userId,
          capacity: schedule.capacity || 0,
          reservations: schedule.reservations?.length || 0,
        });
      }

      // Ordenar por hora
      data.sort((a, b) => {
        const timeA = parseInt(a.time.split(':')[0]);
        const timeB = parseInt(b.time.split(':')[0]);
        return timeA - timeB;
      });

      setDailyData(data);
    } catch (error) {
      console.error('Error loading daily report:', error);
      setDailyData([]);
    } finally {
      setLoading(false);
    }
  };

  // Agrupar por hora
  const groupedByTime = {};
  dailyData.forEach(item => {
    if (!groupedByTime[item.time]) {
      groupedByTime[item.time] = [];
    }
    groupedByTime[item.time].push(item);
  });

  return (
    <div className="space-y-4">
      <div className="flex gap-4 items-center">
        <label className="text-white text-sm">Selecciona fecha:</label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="px-3 py-2 bg-black/40 border border-white/20 rounded-lg text-white"
        />
      </div>

      {loading ? (
        <div className="text-white/60 text-center py-4">Cargando...</div>
      ) : dailyData.length === 0 ? (
        <div className="text-white/60 text-center py-4">No hay reservas para este día</div>
      ) : (
        <div className="space-y-3 max-h-[400px] overflow-y-auto">
          {Object.entries(groupedByTime).map(([time, items]) => (
            <div key={time} className="bg-black/40 rounded-lg p-4 border border-white/10">
              <div className="text-lg font-bold text-brand-neon mb-3">
                {time} - {items.length} reserva{items.length !== 1 ? 's' : ''}
              </div>
              <div className="space-y-2">
                {items.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center bg-black/40 p-3 rounded-lg border-l-2 border-brand-neon"
                  >
                    <div>
                      <p className="text-white font-semibold">{item.userName}</p>
                      <p className="text-white/60 text-sm">{item.userId}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-brand-neon font-bold">
                        {item.reservations}/{item.capacity}
                      </p>
                      <p className="text-white/60 text-sm">ocupación</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {dailyData.length > 0 && (
        <div className="mt-4 p-4 bg-black/40 rounded-lg border border-white/10">
          <p className="text-white/80">
            <span className="font-bold text-brand-neon">{dailyData.length}</span> clases totales
          </p>
          <p className="text-white/80">
            Ocupación promedio: 
            <span className="font-bold text-brand-neon ml-2">
              {(
                dailyData.reduce((sum, d) => sum + (d.reservations / d.capacity || 0), 0) / 
                dailyData.length * 100
              ).toFixed(1)}%
            </span>
          </p>
        </div>
      )}
    </div>
  );
}
