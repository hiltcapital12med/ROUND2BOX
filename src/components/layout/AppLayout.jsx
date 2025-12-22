// UBICACIÓN: /src/components/layout/AppLayout.jsx
import React from 'react';
import { House, CalendarCheck, User, SignOut } from '@phosphor-icons/react';

// Este componente recibe "children" (el contenido cambiante: Home, Agenda, Perfil)
// y "activeTab" para saber qué botón pintar de rojo.
export default function AppLayout({ children, activeTab, onTabChange, onLogout }) {
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-dark via-brand-charcoal to-black pb-24 pt-20">
      
      {/* --- HEADER (BARRA SUPERIOR) --- */}
      <header className="fixed top-0 w-full bg-brand-charcoal/95 backdrop-blur-sm z-50 border-b border-brand-gold/20 px-4 h-16 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-1">
          <span className="text-brand-red font-black text-2xl tracking-tighter italic">ROUND2</span>
          <div className="w-2 h-2 bg-brand-gold rounded-full mt-2"></div>
        </div>
        
        <button onClick={onLogout} className="text-white/50 hover:text-brand-red transition-colors">
            <SignOut size={24} />
        </button>
      </header>

      {/* --- CONTENIDO PRINCIPAL (Variable) --- */}
      <main className="px-4 max-w-md mx-auto fade-in">
        {children}
      </main>

      {/* --- BOTTOM NAV (MENÚ INFERIOR) --- */}
      <nav className="fixed bottom-0 w-full bg-brand-charcoal/95 backdrop-blur-sm border-t border-brand-gold/20 pb-safe pt-2 px-6 flex justify-between items-center z-50 h-20 shadow-[0_-5px_15px_rgba(0,0,0,0.3)]">
        
        {/* Botón INICIO */}
        <button 
          onClick={() => onTabChange('home')}
          className={`flex flex-col items-center gap-1 w-16 transition-colors ${activeTab === 'home' ? 'text-brand-red' : 'text-white/40'}`}
        >
          <House size={28} weight={activeTab === 'home' ? 'fill' : 'regular'} />
          <span className="text-[10px] font-medium">Inicio</span>
        </button>

        {/* Botón AGENDA */}
        <button 
          onClick={() => onTabChange('agenda')}
          className={`flex flex-col items-center gap-1 w-16 transition-colors ${activeTab === 'agenda' ? 'text-brand-red' : 'text-white/40'}`}
        >
          <CalendarCheck size={28} weight={activeTab === 'agenda' ? 'fill' : 'regular'} />
          <span className="text-[10px] font-medium">Agenda</span>
        </button>

        {/* Botón PERFIL */}
        <button 
          onClick={() => onTabChange('profile')}
          className={`flex flex-col items-center gap-1 w-16 transition-colors ${activeTab === 'profile' ? 'text-brand-red' : 'text-white/40'}`}
        >
          <User size={28} weight={activeTab === 'profile' ? 'fill' : 'regular'} />
          <span className="text-[10px] font-medium">Perfil</span>
        </button>

      </nav>
    </div>
  );
}
