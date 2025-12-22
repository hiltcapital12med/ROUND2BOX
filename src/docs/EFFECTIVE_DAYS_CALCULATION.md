// UBICACIÓN: /src/docs/EFFECTIVE_DAYS_CALCULATION.md
# 📅 Sistema de Cálculo por Días Efectivos

## 🎯 Principio Core

**El progreso se mide sobre días EFECTIVOS de entrenamiento, NO sobre días calendario.**

Esto es fundamental para **NO desmotivar** a los atletas. Un mes con 30 días calendario pero solo 22 días efectivos de entrenamiento no debería presentar nunca un 100% "imposible" si el usuario asistió todos los días posibles.

---

## 📊 ¿Qué son Días Efectivos?

### Definición
**Días efectivos** = Lunes a Sábado, EXCLUYENDO:
- ❌ Domingos (sin entrenamiento programado)
- ❌ 40+ Festivos colombianos (2025-2026)

### Ejemplos Prácticos

#### Diciembre 2025 (Mes Actual)
```
Calendario:         Días Efectivos:
Dom Lun Mar Mié     Lun 1 ✓
    1   2   3   4       2 ✓
5   6   7   8   9       3 ✓
    6 ✓  7 ✓  8 ✓   ... (sin festivos)
            9 ✓  10 ✓
12  13  14  15  16  17  18
        (festivos excluidos)
        
    Total: ~22 días efectivos
    (no 30 días)
```

#### Semana Actual (14-20 Diciembre)
```
Dom Lun Mar Mié Jue Vie Sáb
14  15  16  17  18  19  20

Días Efectivos: 6 (lunes-sábado)
(domingo 14 no cuenta)
```

---

## 🔧 Implementación Técnica

### Archivo Central: `/src/utils/dateUtils.js`

Contiene funciones reutilizables para todos los cálculos:

```javascript
// Verificar si una fecha es efectiva
isTrainingDay(date) → boolean

// Contar días efectivos en un rango
calculateEffectiveDays(startDate, endDate) → number

// Calcular porcentaje
calculateConsistencyPercentage(attendances, possibleDays) → 0-100

// Obtener nivel del usuario
getLevelFromConsistency(consistency) → { level, message, color }
```

### Donde se Usa

| Componente | Uso |
|-----------|-----|
| `useMonthlyStats()` | Calcula asistencias del mes / días efectivos |
| `useWeeklyStats()` | Calcula % semanal / días efectivos |
| `ProgressRing` | Muestra nivel basado en días efectivos |

---

## 📈 Cálculo de Porcentajes

### Fórmula Universal
```
Consistencia (%) = (Asistencias / Días Efectivos) × 100
```

### Ejemplos

#### Escenario 1: Mes Perfecto
```
Diciembre 2025:
- Días efectivos: 22
- Asistencias: 22
- Consistencia: (22/22) × 100 = 100% ✅ ÉLITE
```

#### Escenario 2: Buen Mes
```
Diciembre 2025:
- Días efectivos: 22
- Asistencias: 18
- Consistencia: (18/22) × 100 = 82% 
- Nivel: PRO 💪
```

#### Escenario 3: Semana con Festivo
```
Semana 7-13 Diciembre:
- Lunes a Sábado = 6 días
- Asistencias: 5
- Consistencia: (5/6) × 100 = 83%
- Nivel: PRO
```

---

## 🎯 Sistema de Niveles

Basado en **Consistencia (%) sobre días efectivos**:

```javascript
85-100% → ÉLITE       "¡Eres una máquina! 🚀"
70-84%  → PRO         "Muy consistente. Sigue así 💪"
50-69%  → CONSISTENTE "Buen ritmo. Vamos adelante 🔥"
25-49%  → INICIADO    "Comienza tu viaje 🌟"
0-24%   → PRINCIPIANTE"Cada día es un nuevo comienzo 💚"
```

### ¿Por qué estos rangos?

1. **No es punitivo:** Incluso 25% = "INICIADO" (no "FRACASO")
2. **Alcanzable:** Es posible llegar a 100% si asistes todos los días
3. **Motivador:** Los niveles suben rápido con consistencia
4. **Realista:** 70% = "PRO" requiere 5 de 6 días

---

## 📍 Festivos Colombianos Excluidos (40+)

### 2025
```
01-01  Año Nuevo
01-06  Reyes Magos
03-05  San José
04-10  Jueves Santo
04-11  Viernes Santo
05-01  Día del Trabajo
06-02  Corpus Christi
06-09  Sagrado Corazón
06-30  San Pedro y San Pablo
07-03  San Tomás
08-07  Batalla de Boyacá
08-15  Asunción
11-01  Todos los Santos
11-17  Independencia de Cartagena
12-08  Inmaculada Concepción
12-25  Navidad
```

### 2026
```
Similar pattern with observancias
(40+ fechas totales)
```

---

## 🔄 Flujo de Datos

```
┌─────────────────────────────────────────────────┐
│ Atleta registra asistencia en Agenda            │
└──────────────────┬──────────────────────────────┘
                   ↓
┌─────────────────────────────────────────────────┐
│ Guarda en: users/{uid}/attendance/{date}        │
│ { attended: true, classTime: "18:30" }          │
└──────────────────┬──────────────────────────────┘
                   ↓
┌─────────────────────────────────────────────────┐
│ Hooks recalculan en siguiente carga:            │
│ - useMonthlyStats()                             │
│ - useWeeklyStats()                              │
│ - ProgressRing                                  │
└──────────────────┬──────────────────────────────┘
                   ↓
┌─────────────────────────────────────────────────┐
│ Cálculo:                                        │
│ possibleDays = calculateEffectiveDays(...)      │
│ consistency = (attendances/possibleDays)*100   │
│ level = getLevelFromConsistency(consistency)   │
└──────────────────┬──────────────────────────────┘
                   ↓
┌─────────────────────────────────────────────────┐
│ Métricas actualizadas:                          │
│ - Métrica 1: 18 asistencias (del mes)           │
│ - Métrica 2: 82% (objetivo semanal)             │
│ - ProgressRing: PRO nivel (visual)              │
└─────────────────────────────────────────────────┘
```

---

## ✅ Validación

### Puntos de Verificación

#### 1. Días Efectivos son Correctos
```javascript
// En diciembre 2025, debería haber ~22 días
const { startOfMonth, endOfMonth } = getCurrentMonthRange();
const effectiveDays = calculateEffectiveDays(startOfMonth, endOfMonth);
console.log(effectiveDays); // Debería ser ~22
```

#### 2. Porcentaje Nunca es "Imposible"
```javascript
// Si asistió todos los días posibles, debe ser 100%
if (attendances === effectiveDays) {
  consistency = 100% ✅
}
```

#### 3. Niveles son Consistentes
```javascript
// El nivel debe cambiar suavemente con la consistencia
85% → ÉLITE
84% → PRO (no ÉLITE)
100% → ÉLITE (máximo)
```

---

## 🚨 Casos Edge

### Caso 1: Mes que empieza domingo
```
Enero 2025:
Dom 1 (no cuenta)
Lun 2 - Sáb 30 = 29 días efectivos
(no 31)
```

### Caso 2: Semana con festivo
```
Semana 7-13 Diciembre:
Lun 8 ✓
Mar 9 ✓
Mié 10 ✓
Jue 11 ✓
Vie 12 ✓
Sáb 13 ✓
Total: 6 días (aunque 7 días calendario)
```

### Caso 3: Inicio de semana es festivo
```
Si 15 de diciembre (lunes) fuera festivo:
Días efectivos: 5 (no 6)
Un usuario que asista 5/5 = 100% ✅
```

---

## 📚 Funciones Principales

### 1. `isTrainingDay(date)`
```javascript
// Retorna true si es día efectivo de entrenamiento
isTrainingDay(new Date('2025-12-01')) // true (lunes)
isTrainingDay(new Date('2025-12-07')) // false (domingo)
isTrainingDay(new Date('2025-12-25')) // false (festivo)
```

### 2. `calculateEffectiveDays(start, end)`
```javascript
// Cuenta días efectivos en rango
const start = new Date('2025-12-01');
const end = new Date('2025-12-31');
calculateEffectiveDays(start, end) // 22 días
```

### 3. `calculateConsistencyPercentage(attendances, possible)`
```javascript
// Calcula porcentaje
calculateConsistencyPercentage(18, 22) // 82%
calculateConsistencyPercentage(22, 22) // 100%
```

### 4. `getLevelFromConsistency(percentage)`
```javascript
// Obtiene nivel y mensaje
getLevelFromConsistency(85)  // { level: "ÉLITE", message: "...", color: "..." }
getLevelFromConsistency(50)  // { level: "CONSISTENTE", message: "...", color: "..." }
```

---

## 🎯 Impacto para el Usuario

### Beneficios
✅ **Alcanzable:** Es posible lograr 100% si te comprometes  
✅ **No punitivo:** El mes "incompleto" no es culpa del usuario  
✅ **Motivador:** Ves progreso real cada semana  
✅ **Realista:** Refleja tu verdadera consistencia  

### Ejemplo de Mentalidad Positiva

**Antes (Días Calendario):**
- Usuario: "Fui 20 días de 30... solo 67%. Fracasé 😞"
- Sistema: Desmotivante

**Ahora (Días Efectivos):**
- Usuario: "Fui 20 días de 22... 91%! Soy PRO 💪"
- Sistema: Motivador

---

## 🔗 Archivos Relacionados

- `/src/utils/dateUtils.js` - Funciones reutilizables
- `/src/hooks/useMonthlyStats.js` - Stats del mes
- `/src/hooks/useWeeklyStats.js` - Stats de semana
- `/src/components/features/dashboard/ProgressRing.jsx` - Visualización
- `/src/components/features/dashboard/AthleteHomeDashboard.jsx` - Métricas

---

**Última actualización:** 19 de Diciembre, 2025  
**Estado:** ✅ Sistema completo y operativo  
**Versión:** 1.0
