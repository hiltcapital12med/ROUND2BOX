// UBICACIÓN: /src/components/auth/RoleSelector.jsx
import React, { useState } from 'react';
import { Barbell, Lightbulb } from '@phosphor-icons/react';

export default function RoleSelector({ onRoleSelect, loading }) {
  const [selectedRole, setSelectedRole] = useState(null);

  const handleSelect = (role) => {
    setSelectedRole(role);
    onRoleSelect(role);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-brand-dark via-brand-charcoal to-black p-6 relative overflow-hidden">
      
      {/* Elementos decorativos de fondo */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-brand-red opacity-5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-brand-gold opacity-5 rounded-full blur-3xl"></div>

      {/* TARJETA DE SELECCIÓN */}
      <div className="relative z-10 w-full max-w-lg bg-brand-charcoal/80 backdrop-blur-lg border border-brand-gold/20 p-8 rounded-3xl shadow-2xl shadow-black/50">
        
        {/* CABECERA */}
        <div className="text-center mb-12">
          {/* Logo */}
          <div className="h-16 mx-auto mb-6 flex items-center justify-center">
            <span className="text-brand-red font-black text-4xl tracking-tighter italic drop-shadow-lg">ROUND2</span>
            <div className="w-3 h-3 bg-brand-gold rounded-full -ml-2 mt-2"></div>
          </div>
          
          <h1 className="text-white text-2xl font-bold tracking-tight mb-2">¿Vienes a entrenar?</h1>
          <p className="text-gray-400 text-sm">Cuéntanos tu rol para personalizamos tu experiencia</p>
        </div>

        {/* OPCIONES DE ROL */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          
          {/* OPCIÓN 1: ATLETA */}
          <button
            onClick={() => handleSelect('user')}
            disabled={loading}
            className={`relative group p-6 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center justify-center gap-4 ${
              selectedRole === 'user' 
                ? 'border-brand-red bg-brand-red/10 shadow-lg shadow-brand-red/20' 
                : 'border-white/20 bg-white/5 hover:border-brand-gold/50 hover:bg-white/10'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {/* Icono */}
            <div className={`text-4xl transition-colors ${selectedRole === 'user' ? 'text-brand-red' : 'text-brand-gold'}`}>
              <Barbell size={48} weight="duotone" />
            </div>
            
            {/* Texto */}
            <div className="text-center">
              <h3 className="text-white font-bold text-lg">ATLETA</h3>
              <p className="text-white/60 text-xs mt-1">Entrenar y mejorar</p>
            </div>

            {/* Indicador de selección */}
            {selectedRole === 'user' && (
              <div className="absolute top-3 right-3 w-3 h-3 bg-brand-red rounded-full animate-pulse"></div>
            )}
          </button>

          {/* OPCIÓN 2: COACH */}
          <button
            onClick={() => handleSelect('trainer')}
            disabled={loading}
            className={`relative group p-6 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center justify-center gap-4 ${
              selectedRole === 'trainer' 
                ? 'border-brand-gold bg-brand-gold/10 shadow-lg shadow-brand-gold/20' 
                : 'border-white/20 bg-white/5 hover:border-brand-gold/50 hover:bg-white/10'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {/* Icono */}
            <div className={`text-4xl transition-colors ${selectedRole === 'trainer' ? 'text-brand-gold' : 'text-brand-gold'}`}>
              <Lightbulb size={48} weight="duotone" />
            </div>
            
            {/* Texto */}
            <div className="text-center">
              <h3 className="text-white font-bold text-lg">COACH</h3>
              <p className="text-white/60 text-xs mt-1">Entrenar y enseñar</p>
            </div>

            {/* Indicador de selección */}
            {selectedRole === 'trainer' && (
              <div className="absolute top-3 right-3 w-3 h-3 bg-brand-gold rounded-full animate-pulse"></div>
            )}
          </button>
        </div>

        {/* BOTÓN DE CONFIRMAR */}
        <button
          onClick={() => selectedRole && handleSelect(selectedRole)}
          disabled={!selectedRole || loading}
          className="w-full group relative flex items-center justify-center gap-2 bg-brand-red text-white px-6 py-4 rounded-xl font-bold transition-all duration-300 hover:bg-red-700 hover:shadow-gold-glow hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-brand-red disabled:hover:translate-y-0 overflow-hidden"
        >
          {/* Destello dorado */}
          <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-brand-gold/20 to-transparent -translate-x-[100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out disabled:hidden"></div>
          
          {loading ? (
            <span className="animate-pulse">Cargando...</span>
          ) : (
            <span className="tracking-wide">Continuar como {selectedRole === 'user' ? 'Atleta' : selectedRole === 'trainer' ? 'Coach' : 'Usuario'}</span>
          )}
        </button>

        <p className="text-center text-brand-gold/50 text-xs mt-8">
          Round2 Training System v1.0
        </p>
      </div>
    </div>
  );
}
