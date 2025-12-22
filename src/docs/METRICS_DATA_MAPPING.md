// UBICACIÓN: /src/docs/METRICS_DATA_MAPPING.md
# 📊 Mapeo de Métricas a Fuentes de Datos

## 📍 Ubicación: Dashboard de Atletas (Home)

### Vista General
```
┌─────────────────────────────────────────────────────────┐
│                    HOME - ATLETA                        │
├─────────────────────────────────────────────────────────┤
│  Hola, [Nombre]                                         │
│  Racha de [N] días activa. No pares.                   │
├─────────────────────────────────────────────────────────┤
│                   [PROGRESS RING]                       │
│              (Rueda de Progreso Semanal)               │
├─────────────────────────────────────────────────────────┤
│         [Próxima Clase] • HOY 18:00 • Acción           │
├─────────────────────────────────────────────────────────┤
│  [Métrica 1]  │  [Métrica 2]  │  [Métrica 3]           │
│  Asistencias  │  Obj. Semanal │  Peso Actual           │
│  del Mes      │      (%)      │                        │
└─────────────────────────────────────────────────────────┘
```

---

## 📊 Mapeo Detallado de Métricas

### **Métrica 1: Asistencias del Mes**

**Ubicación en UI:** Esquina inferior izquierda (icono CalendarCheck)

**Valor Mostrado:** Número entero (ej: 12)

**Hook que la proporciona:** `useMonthlyStats()`

**Fuente de Datos en Firebase:**
```
users/{userId}/attendance/
├── 2025-12-01 → { date: "2025-12-01", attended: true, classTime: "18:30" }
├── 2025-12-03 → { date: "2025-12-03", attended: true, classTime: "07:00" }
├── 2025-12-05 → { date: "2025-12-05", attended: false, classTime: "18:30" }
└── ... (más registros)
```

**Cálculo:**
```javascript
// En useMonthlyStats.js
1. Obtener rango del mes actual (1-30/31)
2. Sumar todos los documentos donde: 
   - date está entre [startOfMonth, endOfMonth]
   - attended === true
3. Retornar monthlyAttendances
```

**Valor por Defecto:** 0 (si no hay datos)

**Tiempo de Actualización:** Al cargar la página o cambiar de mes

**Estados Posibles:**
- ✅ Número (1-31): Datos cargados
- ⏳ `--`: Cargando datos
- ⚠️ `0`: Sin asistencias registradas

---

### **Métrica 2: Objetivo Semanal (%)**

**Ubicación en UI:** Centro (icono Target)

**Valor Mostrado:** Porcentaje (ej: 85%)

**Hook que la proporciona:** `useWeeklyStats()`

**Fuente de Datos en Firebase:**
```
users/{userId}/attendance/
├── 2025-12-15 → { attended: true }
├── 2025-12-16 → { attended: true }
├── 2025-12-17 → { attended: false }
└── ... (hasta el último sábado)
```

**Cálculo:**
```javascript
// En useWeeklyStats.js
1. Obtener rango de esta semana (domingo-sábado)
2. Contar asistencias donde attended === true
3. Calcular clases posibles (lunes-sábado, sin festivos)
4. weeklyConsistency = (asistencias / posibles) * 100
5. Redondear a entero
```

**Fórmula:**
```
Obj. Semanal (%) = (Asistencias Esta Semana / Clases Posibles) × 100
```

**Clases Posibles por Semana:**
- Máximo teórico: 6 clases (lunes-sábado)
- Se excluyen: Domingos + 40+ festivos colombianos
- En semanas con festivos: 5 o menos clases

**Valor por Defecto:** 0% (si no hay clases o datos)

**Tiempo de Actualización:** Al cargar la página o cada domingo a medianoche

**Estados Posibles:**
- ✅ Porcentaje (0-100%): Datos cargados
- ⏳ `--`: Cargando datos

**Determinación de Nivel (basado en este %):**
```javascript
  0-24%  → PRINCIPIANTE
 25-49%  → INICIADO
 50-69%  → CONSISTENTE
 70-84%  → PRO
 85-100% → ÉLITE
```

---

### **Métrica 3: Peso Actual**

**Ubicación en UI:** Esquina inferior derecha (icono User)

**Valor Mostrado:** 
- Peso en kg (ej: 75.5)
- Subtítulo con IMC (ej: IMC: 24.8)

**Hook que la proporciona:** `useUserStats()`

**Fuente de Datos en Firebase:**
```
users/{userId}
├── medical: {
│   ├── height: "180" (cm, string)
│   ├── weight: "75.5" (kg, string)
│   ├── birthdate: "1990-01-15"
│   └── updatedAt: timestamp
│
└── stats: {
    ├── weight: 75.5 (kg, número)
    ├── bmi: 23.3 (número)
    └── lastUpdated: timestamp
}
```

**Cálculo del IMC:**
```javascript
// En MedicalForm.js (cuando se guarda)
IMC = weight(kg) / (height(cm) / 100)²
```

**Valor por Defecto:** "Sin datos" (si no hay peso registrado)

**Tiempo de Actualización:** Inmediato cuando se completa el formulario médico

**Estados Posibles:**
- ✅ Número + IMC: Datos cargados
- ⏳ `--`: Cargando datos
- ⚠️ "Sin datos": Usuario no ha completado perfil médico

---

## 🔄 Flujo de Sincronización de Datos

### **Cuando el usuario registra asistencia:**
```
1. Trainer marca asistencia en AgendaView
2. ✓ Actualiza schedule/{date}/{time}
3. ✓ Llama recordAttendance() → users/{uid}/attendance/{date}
4. ✓ useMonthlyStats() detecta cambio (próxima carga)
5. ✓ useWeeklyStats() detecta cambio (próxima carga)
6. ✓ Métricas se actualizan en pantalla
```

### **Cuando el usuario actualiza datos médicos:**
```
1. Atleta completa MedicalForm
2. ✓ Calcula IMC
3. ✓ Guarda en users/{uid}/medical + users/{uid}/stats
4. ✓ useUserStats() detecta cambio
5. ✓ Métrica 3 (Peso) se actualiza inmediatamente
```

---

## 📱 Componentes Involucrados

### **Definición de Hooks**
| Hook | Ubicación | Proporciona |
|------|-----------|-------------|
| `useMonthlyStats()` | `/src/hooks/useMonthlyStats.js` | Métrica 1 |
| `useWeeklyStats()` | `/src/hooks/useWeeklyStats.js` | Métrica 2 |
| `useUserStats()` | `/src/hooks/useUserStats.js` | Métrica 3 |

### **Consumidor de Hooks**
| Componente | Ubicación | Usa Hooks |
|-----------|-----------|-----------|
| `AthleteHomeDashboard` | `/src/components/features/dashboard/AthleteHomeDashboard.jsx` | Los 3 |

### **Proveedores de Datos**
| Componente | Guarda Datos En | Métrica Afectada |
|-----------|-----------------|------------------|
| `MedicalForm` | `users/{uid}/medical` + `users/{uid}/stats` | Métrica 3 |
| `AgendaView` | `users/{uid}/attendance/{date}` | Métricas 1 y 2 |

---

## 🧪 Validación de Coherencia

### **Puntos de Verificación**

#### ✅ Métrica 1: Asistencias del Mes
```javascript
// Verificar en Firebase Console
// users/{userId}/attendance/ contiene documentos con attended: true
// En el mes actual debe haber al menos 1 registro

// Regla de Coherencia:
monthlyAttendances = COUNT(attendance docs donde attended === true AND date en mes actual)
```

#### ✅ Métrica 2: Objetivo Semanal (%)
```javascript
// Verificar cálculo
// Debe estar entre 0-100%
// Si es 100%, debe haber asistencia cada día lunes-sábado

// Regla de Coherencia:
if (weeklyAttendances === weeklyPossibleClasses) 
  → weeklyConsistency DEBE ser 100%
```

#### ✅ Métrica 3: Peso Actual
```javascript
// Verificar coherencia entre medical y stats
medical.weight = "75.5" (string)
stats.weight = 75.5 (number)

// Regla de Coherencia:
parseFloat(medical.weight) === stats.weight
// Siempre debe cumplirse

// IMC debe ser válido
stats.bmi = calculateBMI(stats.weight, medical.height)
```

---

## 🔧 Cómo Verificar Manualmente

### **1. Verificar Asistencias del Mes**
```bash
# En Firebase Console
Firestore → users/{tu-uid} → attendance → Contar docs en diciembre 2025
```

### **2. Verificar Objetivo Semanal**
```bash
# Hoy es 19 de diciembre
# Semana actual: 14 (dom) - 20 (sábado)
# Contar attended: true en esa fecha
```

### **3. Verificar Peso Actual**
```bash
# En Firebase Console
Firestore → users/{tu-uid}
Buscar:
  - medical.weight
  - stats.weight
  - stats.bmi
```

---

## 🚨 Problemas y Soluciones

### **"Las métricas muestran '--' permanentemente"**
**Causa:** Los hooks están en estado de carga infinito
**Solución:**
1. Revisar la consola del navegador (F12)
2. Verificar que Firebase esté inicializado
3. Verificar permisos en Firestore Rules

### **"Métrica 1 muestra 0 pero registré asistencias"**
**Causa:** Asistencias en meses anteriores, no en mes actual
**Solución:** 
- Registrar nueva asistencia en mes actual
- Esperar a que el componente re-renderice

### **"Métrica 2 no suma correctamente"**
**Causa:** No excluye correctamente festivos o domingos
**Solución:**
- Verificar array COLOMBIAN_HOLIDAYS en ambos hooks
- Asegurar que dayOfWeek === 0 se excluya (domingo)

### **"Métrica 3 muestra 'Sin datos' pero agregué peso"**
**Causa:** 
1. El peso no se guardó correctamente
2. useUserStats() aún está cargando
**Solución:**
- Verificar que both `medical.weight` y `stats.weight` existan
- Recargar página

---

## 📈 Próximas Mejoras

- [ ] Añadir histórico de peso con gráfica
- [ ] Detectar tendencias de asistencia
- [ ] Predicción de cumplimiento de objetivo
- [ ] Notificaciones cuando baja el % semanal
- [ ] Exportar estadísticas del mes

---

**Última actualización:** 19 de Diciembre, 2025
**Estado:** ✅ Todas las métricas enlazadas a Firebase
**Versión:** 1.0
