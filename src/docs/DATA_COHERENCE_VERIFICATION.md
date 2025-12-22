// UBICACIÓN: /src/docs/DATA_COHERENCE_VERIFICATION.md
# 📋 Verificación de Coherencia de Datos - Round2Box

## 🔍 Estructura de Almacenamiento en Firebase

### 1. **Datos Médicos y Estadísticas del Usuario**
```
users/{userId}
├── email: string
├── name: string
├── photoURL: string
├── role: "user" | "trainer" | "admin"
├── createdAt: timestamp
│
├── medical: {
│   ├── height: string (cm)
│   ├── weight: string (kg)
│   ├── birthdate: string (YYYY-MM-DD)
│   ├── gender: string (male/female/other)
│   ├── history: string (alergias, cirugías, etc)
│   └── updatedAt: timestamp
│
├── stats: {
│   ├── weight: number (kg) ← COPIA DINÁMICA DE medical.weight
│   ├── bmi: number (calculado)
│   └── lastUpdated: timestamp
│
└── attendance: {
    ├── {date}: {
    │   ├── date: string (YYYY-MM-DD)
    │   ├── classTime: string (HH:MM)
    │   ├── attended: boolean
    │   └── timestamp: timestamp
    └── ...
}
```

## ✅ Puntos de Coherencia

### Punto 1: Peso en Múltiples Ubicaciones
**Problema:** El peso se almacena en dos lugares:
- `users/{uid}/medical/weight` (STRING - para el formulario)
- `users/{uid}/stats/weight` (NUMBER - para cálculos)

**Solución:** 
- ✅ Al guardar en MedicalForm, se actualiza AMBAS ubicaciones
- ✅ useUserStats() lee de stats.weight (numérico, más rápido)
- ✅ Validación: El valor en stats SIEMPRE debe ser parseFloat(medical.weight)

### Punto 2: Peso en Pantalla de Inicio
**Antes:** Hardcodeado como `75.5 kg`
**Ahora:** Dinámico con `useUserStats()`

**Flujo:**
1. Usuario ingresa peso en MedicalForm
2. Se guarda en `users/{uid}/stats/weight`
3. useUserStats() lee ese valor
4. AthleteHomeDashboard muestra el peso dinámico

### Punto 3: IMC (Índice de Masa Corporal)
**Fórmula:** IMC = peso(kg) / altura(m)²
**Almacenamiento:** `users/{uid}/stats/bmi`
**Actualización:** Se recalcula cada vez que se modifica weight o height en MedicalForm

## 🔄 Flujo de Sincronización

### Cuando el usuario completa el formulario médico:
```javascript
// MedicalForm.jsx → handleSubmit()
1. Calcula IMC: bmi = weight / (height/100)²
2. Guarda en Firestore:
   - medical: { height, weight (string), birthdate, gender, history, updatedAt }
   - stats: { weight (number), bmi, lastUpdated }
3. En app:
   - useUserStats() detecta cambio
   - Re-render de AthleteHomeDashboard
   - Muestra peso actualizado
```

## 🧪 Verificación Manual

### Para verificar que los datos son coherentes:

1. **Abre Firebase Console:**
   - Ve a Firestore Database
   - Busca `users/{tu-uid}`

2. **Verifica que existan AMBOS campos:**
   ```
   ✅ medical.weight = "75.5" (string)
   ✅ stats.weight = 75.5 (number)
   ✅ stats.bmi = calculado correctamente
   ```

3. **En la App:**
   - Ve a Perfil → Llena formulario médico
   - Presiona "Guardar"
   - Ve a Home
   - Verifica que el peso se refleje en la métrica 3

## 🚨 Problemas Comunes

### "El peso muestra '--' en la pantalla"
**Causa:** El usuario no ha completado el formulario médico
**Solución:** Completar el formulario de perfil primero

### "El peso dice 'Sin datos'"
**Causa:** No hay valor en `users/{uid}/stats/weight`
**Solución:** 
- Limpiar localStorage
- Recargar la app
- Volver a completar el formulario médico

### "El IMC no se calcula"
**Causa:** Falta altura o peso
**Solución:** Asegurar que AMBOS campos estén completos en el formulario

### "El peso se ve diferente en perfil vs inicio"
**Causa:** Una lectura viene de `medical.weight` (string) y otra de `stats.weight` (number)
**Solución:** Siempre usar useUserStats() que normaliza el tipo

## 📊 Listado de Componentes que Usan Peso

| Componente | Ubicación | Cómo lo obtiene |
|-----------|-----------|-----------------|
| AthleteHomeDashboard | Home | useUserStats() |
| MedicalForm | Perfil | Formulario local |
| ProgressRing | Home (inferior) | No usa peso |
| AthleteProgressCard | Trainer View | Podría agregarse |

## 🔧 Cómo Agregar Nuevo Campo

Si necesitas agregar otro valor biomédico (ej: presión, frecuencia cardíaca):

1. Agrega a `medical` en MedicalForm
2. Si necesitas valor numérico para cálculos, duplica en `stats`
3. Actualiza useUserStats() para incluir el nuevo campo
4. Usa el hook en componentes que lo necesiten

---

**Última actualización:** 19 de Diciembre, 2025
**Estado:** ✅ Coherencia verificada
