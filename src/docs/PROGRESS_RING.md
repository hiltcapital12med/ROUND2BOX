// RUEDA DE PROGRESO DINÁMICO - DOCUMENTACIÓN

## 🎯 ¿Cómo funciona la nueva rueda?

### Concepto Principal
La rueda ahora muestra tu **consistencia semanal** de forma **motivadora y no punitiva**.

Se actualiza cada lunes con el progreso de la semana anterior (domingo-sábado).

---

## 📊 Niveles de Consistencia

| Consistencia | Nivel | Emoji | Mensaje |
|--------------|-------|-------|---------|
| 85%+ | 🏆 ÉLITE | ⭐ | ¡Increíble consistencia! 🔥 |
| 70-84% | 💪 PRO | 💪 | Vas muy bien esta semana 💪 |
| 50-69% | ⚡ CONSISTENTE | ⚡ | Buen ritmo, sigue adelante ⚡ |
| 25-49% | 🏃 INICIADO | 🏃 | Cada paso cuenta 🏃 |
| 0-24% | 🚀 PRINCIPIANTE | 🚀 | Tu viaje comienza hoy 🚀 |

**Nota**: Los porcentajes son sobre clases DISPONIBLES, no punitivos.
- Si la semana tenía 7 clases disponibles y fuiste a 5 = 71% ✅
- Si fuiste a 4 = 57% (aún CONSISTENTE, no es malo)

---

## 🔥 Sistema de Racha

Además del porcentaje, la rueda muestra tu **racha actual**:

```
🔥 3 días consecutivos
```

Esto motiva a mantener la consistencia día a día.

---

## 📱 Qué se Muestra en la Rueda

```
        ÉLITE
         80%
     5/7 clases
   🔥 3 días consecutivos

   Vas muy bien esta semana 💪
```

---

## 🔗 Estructura de Datos en Firebase

Para que la rueda funcione, necesitamos registrar la asistencia:

```
users/
├── {userId}/
│   ├── attendance/
│   │   ├── 2025-12-15 → { date: "2025-12-15", classTime: "18:30", attended: true }
│   │   ├── 2025-12-16 → { date: "2025-12-16", classTime: "07:00", attended: false }
│   │   ├── 2025-12-17 → { date: "2025-12-17", classTime: "18:30", attended: true }
│   │   └── ...
```

---

## 🛠️ Cómo Registrar Asistencia

### Opción 1: Manual (Cuando el usuario se presenta)

```javascript
import { recordAttendance } from '../services/attendanceService';

// Al entrenador marcar asistencia
await recordAttendance(
  user.uid,                    // ID del usuario
  '2025-12-19',               // Fecha
  '18:30',                    // Hora de clase
  true                        // ¿Asistió?
);
```

### Opción 2: Automático (Desde AgendaView)

Cuando el entrenador marca asistencia en la lista, registrar automáticamente.

Modifica [src/components/features/agenda/AgendaView.jsx](src/components/features/agenda/AgendaView.jsx):

```jsx
import { recordAttendance } from '../../../services/attendanceService';

const toggleAttendance = async (slotTime, studentUid, currentStatus) => {
  // ... código existente ...
  
  // AGREGAR ESTO:
  const isAttended = currentStatus !== 'attended';
  if (isAttended) {
    await recordAttendance(studentUid, dateKey, slotTime, true);
  }
};
```

### Opción 3: Importar datos históricos

Si tienes un archivo CSV con asistencias pasadas:

```javascript
import { recordBulkAttendances } from '../services/attendanceService';

const attendances = [
  { date: '2025-12-10', classTime: '18:30', attended: true },
  { date: '2025-12-11', classTime: '07:00', attended: true },
  { date: '2025-12-12', classTime: '18:30', attended: false },
  // ... más registros
];

await recordBulkAttendances(user.uid, attendances);
```

---

## ⚙️ Cálculo del Progreso

```javascript
1. Obtener rango de semana (domingo a sábado)
2. Contar clases DISPONIBLES (sin domingos ni festivos)
3. Contar clases A LAS QUE ASISTIÓ
4. Calcular porcentaje: (asistencias / disponibles) * 100
5. Asignar nivel según porcentaje
6. Calcular racha (días consecutivos)
```

---

## 🎨 Personalización

### Cambiar los porcentajes de niveles

En [src/components/features/dashboard/ProgressRing.jsx](src/components/features/dashboard/ProgressRing.jsx):

```javascript
const getLevelAndMessage = (consistency, streak) => {
  if (consistency >= 85) {        // ← Cambiar este número
    return { level: 'ÉLITE', message: '...' };
  } else if (consistency >= 70) { // ← O este
    return { level: 'PRO', message: '...' };
  }
  // ...
};
```

### Cambiar los mensajes

```javascript
return {
  level: 'ÉLITE',
  message: '¡Tu dedicación es inspiradora! 🌟'  // ← Cambiar aquí
};
```

### Agregar más niveles

```javascript
if (consistency >= 95) {
  return { level: 'LEYENDA', message: '¡Eres una leyenda! 👑' };
} else if (consistency >= 85) {
  return { level: 'ÉLITE', message: '...' };
}
// ...
```

---

## 🔄 Cómo Actualiza

- **Automático**: Se recalcula cada vez que se abre la app
- **Real-time**: Cuando se registra una asistencia
- **Semanal**: El lunes muestra la semana anterior completada

---

## 📈 Datos que se Usan

La rueda lee de:
1. **Clases disponibles** - Lunes a sábado (sin domingos ni festivos)
2. **Asistencias registradas** - Collection `users/{uid}/attendance`
3. **Racha actual** - Días consecutivos más recientes

---

## 🎯 Casos de Uso

### Usuario nuevo (Primera semana)
```
        PRINCIPIANTE
           25%
        1/7 clases
      
    Tu viaje comienza hoy 🚀
```
→ Motivador, no desalentador

### Usuario consistente (Buena semana)
```
            PRO
            72%
         5/7 clases
       🔥 5 días consecutivos
    
    Vas muy bien esta semana 💪
```
→ Reconoce el esfuerzo

### Usuario élite (Excelente)
```
           ÉLITE
            88%
         6/7 clases
      🔥 10 días consecutivos
    
    ¡Increíble consistencia! 🔥
```
→ Celebra el logro

---

## 🚀 Integración Completa

Para que todo funcione:

1. ✅ La rueda está implementada
2. ⏳ Necesitas registrar asistencias en Firebase
3. ⏳ Opcional: Integrar con el formulario de asistencia del entrenador

---

## 🐛 Troubleshooting

### La rueda muestra "PRINCIPIANTE" siempre
- Verifica que hay datos en `users/{uid}/attendance` en Firebase
- Usa el servicio `recordAttendance()` para agregar registros

### El porcentaje no se actualiza
- Abre DevTools (F12) y revisa la consola
- Haz clic fuera de la app y vuelve a entrar (recarga)

### La racha no aparece
- Necesitas al menos 1 día con asistencia registrada
- Los datos deben estar ordenados por fecha

---

## 📚 Archivos Relacionados

- [ProgressRing.jsx](src/components/features/dashboard/ProgressRing.jsx) - Componente visual
- [attendanceService.js](src/services/attendanceService.js) - Servicio de datos
- [AgendaView.jsx](src/components/features/agenda/AgendaView.jsx) - Donde registrar asistencia

---

¡La rueda ahora es dinámicamente motivadora! 🚀
