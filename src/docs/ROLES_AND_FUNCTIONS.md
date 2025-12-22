// ROLES Y FUNCIONALIDADES - PROGRESO SEMANAL

## 🎯 Asignación de Roles y Responsabilidades

### 👤 **ATLETA (role: 'user')**

**Lo que VE:**
- ✅ La rueda con su progreso semanal personal
- ✅ Porcentaje de consistencia
- ✅ Número de clases a las que asistió
- ✅ Racha actual de días consecutivos
- ✅ Nivel (PRINCIPIANTE, INICIADO, CONSISTENTE, PRO, ÉLITE)
- ✅ Mensaje motivador

**Lo que PUEDE HACER:**
- ✅ Ver su progreso
- ✅ Reservar clases
- ✅ Cancelar sus reservas
- ✅ Ver su información médica

**Lo que NO PUEDE HACER:**
- ❌ Registrar su propia asistencia
- ❌ Ver el progreso de otros atletas
- ❌ Marcar asistencia de otros

**Beneficio:**
```
La rueda motiva sin ser punitiva. Si faltas a una clase, 
tu porcentaje baja gradualmente, pero no te machaca.
```

---

### 👨‍🏫 **ENTRENADOR (role: 'trainer')**

**Lo que VE:**
- ✅ Lista de clases con atletas inscritos
- ✅ Tarjeta de progreso de cada atleta (mini)
- ✅ Botón para marcar asistencia (✓)
- ✅ La rueda de su propio progreso (si es atleta activo)

**Lo que PUEDE HACER:**
- ✅ Ver lista de asistencia de cada clase
- ✅ Marcar atletas como "attended" (asistió)
- ✅ Desmarcar si fue error
- ✅ **REGISTRAR automáticamente la asistencia en el sistema**
- ✅ Ver progreso de sus atletas

**Lo que NO PUEDE HACER:**
- ❌ Ver datos médicos detallados
- ❌ Modificar datos de otros trainers

**Beneficio:**
```
Al marcar asistencia, automáticamente se actualiza 
el progreso del atleta. No necesita hacer nada más.
```

---

### 🛡️ **ADMINISTRADOR (role: 'admin')**

**Lo que VE:**
- ✅ Todo lo que ve el trainer
- ✅ Dashboard completo del negocio
- ✅ Análisis de consistencia de todos los atletas
- ✅ Reportes de asistencia

**Lo que PUEDE HACER:**
- ✅ Todo lo que puede hacer un trainer
- ✅ Ver datos de todos los atletas
- ✅ Crear/editar/eliminar clases
- ✅ Ver reportes y analytics
- ✅ Exportar datos

**Lo que NO PUEDE HACER:**
- ❌ Acceso a passwords
- ❌ Modificar datos médicos de otros

**Beneficio:**
```
Control total del negocio con insights de 
consistencia y retención de atletas.
```

---

## 🔄 **Flujo de Datos**

```
1. RESERVA DE CLASE
   Atleta → Hace clic en "Reservar Lugar"
            ↓
   Datos guardados en: schedule/{date}/{time}

2. ENTRENADOR MARCA ASISTENCIA
   Trainer → Ve lista en AgendaView
             ↓
             Hace clic en ✓ del atleta
             ↓
             updateDoc() en schedule (marca como "attended")
             ↓
             recordAttendance() → users/{uid}/attendance/{date}
             ↓
   Automáticamente: La rueda se actualiza en tiempo real

3. ATLETA VE SU PROGRESO
   Atleta → Abre "Home"
            ↓
            ProgressRing carga datos de attendance
            ↓
            Calcula consistencia semanal
            ↓
            Muestra nivel y mensaje motivador
```

---

## 🛠️ **Implementación Técnica**

### **AgendaView (Trainer/Admin)**

```jsx
// Cuando el trainer marca asistencia:
const toggleAttendance = async (slotTime, studentUid, currentStatus) => {
  // 1. Actualizar en schedule (lo que ya estaba)
  await updateDoc(scheduleRef, { [slotTime]: updatedList });
  
  // 2. NUEVO: Registrar en attendance (progreso)
  if (isAttended && (role === 'trainer' || role === 'admin')) {
    await recordAttendance(studentUid, dateKey, slotTime, true);
  }
};
```

### **ProgressRing (Atleta)**

```jsx
// Lee automáticamente de users/{uid}/attendance
const calculateWeeklyProgress = async () => {
  const querySnapshot = await getDocs(userAttendanceRef);
  
  // Cuenta solo asistencias de esta semana
  let weeklyAttendances = 0;
  querySnapshot.docs.forEach((doc) => {
    if (attendanceDate >= startOfWeek && doc.data().attended) {
      weeklyAttendances++;
    }
  });
  
  // Calcula porcentaje
  const consistency = (weeklyAttendances / possibleClasses) * 100;
};
```

---

## 📊 **Estructura en Firebase**

```
users/
├── {userId}/
│   ├── profile/
│   │   ├── name
│   │   ├── email
│   │   └── role (user | trainer | admin)
│   │
│   └── attendance/
│       ├── 2025-12-15 → {date: "2025-12-15", attended: true, classTime: "18:30"}
│       ├── 2025-12-16 → {date: "2025-12-16", attended: true, classTime: "07:00"}
│       ├── 2025-12-17 → {date: "2025-12-17", attended: false}
│       └── ...

schedule/
├── 2025-12-19 → {
│   "18:30": [
│       {uid: "user1", name: "Juan", status: "attended", ...},
│       {uid: "user2", name: "Maria", status: "booked", ...}
│   ]
│ }
```

---

## 🔐 **Control de Acceso**

### Registro de Asistencia
```javascript
// Solo trainers y admins pueden registrar
if (isAttended && (role === 'trainer' || role === 'admin')) {
  await recordAttendance(studentUid, dateKey, slotTime, true);
}
```

### Lectura de Progreso
```javascript
// Cada usuario solo ve su propio progreso
const userAttendanceRef = collection(db, 'users', user.uid, 'attendance');
// No puede acceder a users/{otroUsuario}/attendance
```

### Vista de AgendaView
```javascript
// Trainer ve lista de asistencia
{(role === 'trainer' || role === 'admin') && (
  <div className="mt-4 pt-4 border-t border-white/10">
    <h4>Lista de Asistencia</h4>
    {/* Mostrar estudiantes */}
  </div>
)}
```

---

## 🚀 **Integración Completa**

### Checklist de Roles:

**ATLETA:**
- [x] Ve su rueda de progreso
- [x] Ve porcentaje y racha
- [x] Ve mensaje motivador
- [x] Recibe notificaciones de progreso
- [ ] Puede registrar su propia asistencia (NO, por diseño)

**TRAINER:**
- [x] Ve lista de asistencia
- [x] Puede marcar asistencia
- [x] Registra automáticamente en attendance
- [x] Ve progreso de sus atletas
- [x] Puede ver tarjetas de progreso mini

**ADMIN:**
- [x] Todo lo del trainer
- [x] Dashboard completo
- [x] Reportes de asistencia
- [x] Control total

---

## 📝 **Caso de Uso Real**

### Martes 19 de Diciembre

**Entrenador:**
1. Abre la app
2. Ve la clase de 18:30 con 3 atletas
3. Hace clic en ✓ al lado de "Juan"
4. Sistema automáticamente:
   - Marca como "attended" en schedule
   - Registra en users/juan/attendance/2025-12-19
   - Actualiza rueda de Juan (ahora 3/7 = 43%)

**Juan (Atleta):**
1. Abre la app más tarde
2. Ve su rueda: 43% (CONSISTENTE)
3. Ve "Buen ritmo, sigue adelante ⚡"
4. Se motiva a entrenar mañana

---

## 🎯 **Beneficios por Rol**

| Rol | Beneficio |
|-----|-----------|
| **Atleta** | Motivación sin culpa, rastreo transparente |
| **Trainer** | Una sola acción registra todo, ahorra tiempo |
| **Admin** | Insights de retención, métricas claras |

---

¡Sistema funcional y respetador de roles! 🚀
