// UBICACIÓN: /src/components/features/profile/MedicalForm.jsx
import React, { useState, useEffect } from 'react';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../../../services/firebase';
import { useAuth } from '../../../context/AuthContext';
import { Heartbeat, Ruler, Barbell, Calendar, Info } from '@phosphor-icons/react';

export default function MedicalForm() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  // Estado del formulario
  const [formData, setFormData] = useState({
    height: '',   // cm
    weight: '',   // kg
    birthdate: '',
    gender: 'male',
    history: '',  // Nuevo campo para alergias/cirugías
    bmi: null     // El IMC calculado
  });

  // Cargar datos existentes
  useEffect(() => {
    const loadData = async () => {
      if (!user) return;
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        // Cargamos los datos médicos y el IMC si ya existe
        if (data.medical) {
          setFormData({
            ...data.medical,
            bmi: data.stats?.bmi || null // Recuperamos el IMC de las estadísticas
          });
        }
      }
    };
    loadData();
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Lógica de Negocio (Simulando Backend)
  const calculateBMI = (weight, heightCm) => {
    const heightM = parseFloat(heightCm) / 100;
    const weightKg = parseFloat(weight);
    if (!heightM || !weightKg) return null;
    return (weightKg / (heightM * heightM)).toFixed(1);
  };

  // Función para obtener color según el IMC (Semáforo de salud)
  const getBMIColor = (bmi) => {
    if (!bmi) return 'text-gray-500';
    if (bmi < 18.5) return 'text-blue-400'; // Bajo peso
    if (bmi < 24.9) return 'text-green-500'; // Normal
    if (bmi < 29.9) return 'text-yellow-500'; // Sobrepeso
    return 'text-brand-red'; // Obesidad
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      // 1. Realizamos el cálculo matemático
      const calculatedBMI = calculateBMI(formData.weight, formData.height);
      
      // 2. Preparamos los datos limpios para enviar a Firebase
      const medicalData = {
        height: formData.height,
        weight: formData.weight,
        birthdate: formData.birthdate,
        gender: formData.gender,
        history: formData.history || '', // Guardamos texto vacío si no escriben nada
        updatedAt: new Date()
      };

      // 3. Guardamos en Firestore
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        medical: medicalData,
        // Guardamos el IMC en la sección de estadísticas para usarlo en gráficas luego
        stats: {
          bmi: calculatedBMI, 
          weight: formData.weight
        }
      });

      // Actualizamos el estado local para que el usuario vea el cambio inmediato
      setFormData(prev => ({ ...prev, bmi: calculatedBMI }));

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error("Error guardando ficha:", error);
      alert("Error al guardar. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  // Clases de estilo reutilizables
  const inputClass = "w-full bg-brand-charcoal border border-white/10 text-white p-4 rounded-xl focus:outline-none focus:border-brand-gold/50 focus:ring-1 focus:ring-brand-gold/50 transition-all placeholder-gray-600";
  const labelClass = "block text-brand-gold text-xs font-bold uppercase tracking-widest mb-2 ml-1";

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in-up">
      
      {/* HEADER AMIGABLE */}
      <div className="bg-brand-charcoal border border-white/5 p-4 rounded-xl flex items-start gap-3">
        <Heartbeat size={32} className="text-brand-red flex-shrink-0" weight="duotone" />
        <div>
          <h3 className="text-white font-bold text-sm">Tu Perfil Atlético</h3>
          <p className="text-gray-400 text-xs">Ayúdanos a calibrar tu entrenamiento.</p>
        </div>
      </div>

      {/* VISUALIZADOR DE IMC (Solo aparece si ya hay datos) */}
      {formData.bmi && (
        <div className="bg-black/40 border border-brand-gold/20 p-4 rounded-xl flex justify-between items-center">
            <div>
                <span className="text-gray-400 text-xs uppercase tracking-wider block">Tu IMC Actual</span>
                <span className={`text-2xl font-black ${getBMIColor(formData.bmi)}`}>
                    {formData.bmi}
                </span>
            </div>
            <div className="text-right">
                <span className="text-[10px] text-gray-500 block">Calculado automáticamente</span>
                <span className="text-xs text-brand-gold font-bold">
                    {formData.bmi < 24.9 && formData.bmi > 18.5 ? 'Rango Saludable' : 'Requiere Ajuste'}
                </span>
            </div>
        </div>
      )}

      {/* INPUTS PRINCIPALES */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}><Barbell size={16} className="inline mr-1"/> Peso (kg)</label>
          <input 
            type="number" name="weight" step="0.1" 
            value={formData.weight} onChange={handleChange} 
            className={inputClass} placeholder="Ej: 75.5" required
          />
        </div>
        <div>
          <label className={labelClass}><Ruler size={16} className="inline mr-1"/> Altura (cm)</label>
          <input 
            type="number" name="height" 
            value={formData.height} onChange={handleChange} 
            className={inputClass} placeholder="Ej: 178" required
          />
        </div>
      </div>

      <div>
        <label className={labelClass}><Calendar size={16} className="inline mr-1"/> Fecha Nacimiento</label>
        <input 
          type="date" name="birthdate" 
          value={formData.birthdate} onChange={handleChange} 
          className={`${inputClass} text-gray-400`} required
        />
      </div>

      {/* GÉNERO */}
      <div>
        <label className={labelClass}>Género Biológico</label>
        <div className="grid grid-cols-2 gap-4">
            <button 
                type="button"
                onClick={() => setFormData({...formData, gender: 'male'})}
                className={`p-3 rounded-xl border transition-all ${formData.gender === 'male' ? 'bg-brand-gold text-black border-brand-gold font-bold' : 'bg-brand-charcoal text-gray-400 border-white/10'}`}
            >
                Masculino
            </button>
            <button 
                type="button"
                onClick={() => setFormData({...formData, gender: 'female'})}
                className={`p-3 rounded-xl border transition-all ${formData.gender === 'female' ? 'bg-brand-gold text-black border-brand-gold font-bold' : 'bg-brand-charcoal text-gray-400 border-white/10'}`}
            >
                Femenino
            </button>
        </div>
      </div>

      {/* NUEVO CAMPO: ANTECEDENTES (Amigable y Opcional) */}
      <div>
        <label className={labelClass}>
            <Info size={16} className="inline mr-1 text-brand-gold"/> 
            Observaciones para el Coach
            <span className="ml-2 text-[10px] text-gray-500 normal-case font-normal">(Opcional)</span>
        </label>
        <textarea 
            name="history"
            value={formData.history}
            onChange={handleChange}
            rows="3"
            className={inputClass}
            placeholder="Ej: Cirugía de rodilla en 2020, alergia al látex, o alguna lesión antigua que debamos cuidar..."
        ></textarea>
      </div>

      {/* BOTÓN ACTUALIZAR */}
      <button 
        type="submit" 
        disabled={loading}
        className="w-full bg-brand-red text-white font-black py-4 rounded-xl shadow-lg shadow-brand-red/20 hover:scale-[1.02] active:scale-95 transition-all flex justify-center items-center gap-2 group"
      >
        {loading ? (
           <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
        ) : (
           <>
             ACTUALIZAR FICHA 
             <Heartbeat weight="fill" className="group-hover:animate-pulse"/>
           </>
        )}
      </button>

      {success && (
        <div className="bg-green-500/10 border border-green-500/50 text-green-500 p-3 rounded-xl text-center text-sm font-bold animate-bounce">
          ¡Datos sincronizados! Tu plan se ajustará en breve.
        </div>
      )}

    </form>
  );
}
