// src/utils/healthUtils.js

export const HealthEngine = {
    /**
     * Calcula el IMC (Índice de Masa Corporal)
     * @param {number} weight - Peso en kg
     * @param {number} height - Altura en metros (ej. 1.75)
     */
    calculateIMC: (weight, height) => {
        if (!weight || !height) return 0;
        const imc = (weight / (height * height)).toFixed(1);
        return parseFloat(imc);
    },

    /**
     * Estima % Grasa Corporal (Fórmula Deurenberg)
     * @param {number} imc - Índice de masa corporal
     * @param {number} age - Edad en años
     * @param {string} gender - 'male' | 'female'
     */
    estimateBodyFat: (imc, age, gender) => {
        // Factor de género: 1 para hombres, 0 para mujeres
        const genderFactor = gender === 'male' ? 1 : 0;
        // Fórmula: (1.20 x IMC) + (0.23 x Edad) - (10.8 x género) - 5.4
        let fatPercentage = (1.20 * imc) + (0.23 * age) - (10.8 * genderFactor) - 5.4;
        
        // Ajuste mínimo biológico
        return Math.max(fatPercentage, 5).toFixed(1);
    },

    /**
     * Devuelve el estado y color de la UI según el IMC
     * Basado en colores de Round2 (Semáforo modificado)
     */
    getIMCStatus: (imc) => {
        if (imc < 18.5) return { status: 'Bajo Peso', color: 'text-blue-500', bg: 'bg-blue-100' };
        if (imc < 24.9) return { status: 'Normal', color: 'text-green-600', bg: 'bg-green-100' };
        if (imc < 29.9) return { status: 'Sobrepeso', color: 'text-yellow-600', bg: 'bg-yellow-100' };
        return { status: 'Obesidad', color: 'text-brand', bg: 'bg-red-100' }; // Rojo Round2
    }
};

// Ejemplo de uso en tu componente:
// const imc = HealthEngine.calculateIMC(80, 1.80); // 24.7
// const fat = HealthEngine.estimateBodyFat(24.7, 30, 'male'); // ~18.3%