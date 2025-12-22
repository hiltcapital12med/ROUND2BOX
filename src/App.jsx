// UBICACIÓN: /src/App.jsx
import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import AppLayout from './components/layout/AppLayout';
import { CalendarCheck, Target, User, Megaphone, ShieldCheck, ArrowLeft } from '@phosphor-icons/react';
import MedicalForm from './components/features/profile/MedicalForm';
import ProfileHeader from './components/features/profile/ProfileHeader';
import AgendaView from './components/features/agenda/AgendaView';
import NotificationManager from './components/features/notifications/NotificationManager';
import ProgressRing from './components/features/dashboard/ProgressRing';
import AthleteHomeDashboard from './components/features/dashboard/AthleteHomeDashboard';

// --- PANTALLA DE LOGIN (Con Error Global) ---
function LoginScreen() {
  const { loginWithGoogle, authError, clearError } = useAuth(); // Importamos authError y clearError
  const [step, setStep] = useState(1); 
  const [selectedRole, setSelectedRole] = useState(null); 

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    clearError(); // Limpiamos errores anteriores al cambiar de opción
    setStep(2);
  };

  const handleLogin = () => {
    if (selectedRole) {
      loginWithGoogle(selectedRole);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-brand-dark via-brand-charcoal to-black p-6 relative overflow-hidden">
      
      {/* Elementos decorativos de fondo */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-brand-red/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-brand-gold/10 rounded-full blur-3xl"></div>

      <div className="relative z-10 w-full max-w-md">
        
        {/* CABECERA */}
        <div className="text-center mb-8 animate-fade-in-down">
          <div className="h-16 mx-auto mb-4 flex items-center justify-center">
            <span className="text-brand-red font-black text-4xl tracking-tighter italic drop-shadow-lg">ROUND2</span>
            <div className="w-3 h-3 bg-brand-gold rounded-full -ml-2 mt-2"></div>
          </div>
          <h1 className="text-white text-2xl font-bold tracking-tight">
            {step === 1 ? "¿Cuál es tu perfil?" : "Confirma tu identidad"}
          </h1>
          <p className="text-gray-400 text-sm mt-2">
            {step === 1 ? "Selecciona tu rol para ingresar al ring." : `Ingresando como ${selectedRole === 'user' ? 'Atleta' : selectedRole === 'trainer' ? 'Entrenador' : 'Admin'}`}
          </p>
        </div>

        {/* ⚠️ ALERTA DE ERROR GLOBAL ⚠️ */}
        {/* Ahora leemos directamente 'authError' del contexto */}
        {authError && (
          <div className="mb-6 bg-red-900/80 border border-brand-red text-white p-4 rounded-xl text-center text-sm font-bold animate-bounce shadow-lg shadow-red-900/40 backdrop-blur-sm">
            ⚠️ {authError}
          </div>
        )}

        {/* PASO 1: SELECCIÓN DE ROL */}
        {step === 1 && (
          <div className="grid gap-4 animate-fade-in-up">
            <button 
              onClick={() => handleRoleSelect('user')}
              className="group bg-brand-charcoal hover:bg-white/5 border border-white/10 hover:border-brand-red p-4 rounded-2xl flex items-center gap-4 transition-all"
            >
              <div className="w-12 h-12 rounded-full bg-brand-charcoal border border-white/10 flex items-center justify-center group-hover:bg-brand-red group-hover:text-white transition-colors">
                <User size={24} weight="duotone" className="text-gray-400 group-hover:text-white" />
              </div>
              <div className="text-left">
                <span className="block text-white font-bold text-lg">Soy Atleta</span>
                <span className="text-gray-500 text-xs">Quiero entrenar y medir mi progreso.</span>
              </div>
            </button>

            <button 
              onClick={() => handleRoleSelect('trainer')}
              className="group bg-brand-charcoal hover:bg-white/5 border border-white/10 hover:border-brand-gold p-4 rounded-2xl flex items-center gap-4 transition-all"
            >
              <div className="w-12 h-12 rounded-full bg-brand-charcoal border border-white/10 flex items-center justify-center group-hover:bg-brand-gold group-hover:text-black transition-colors">
                <Megaphone size={24} weight="duotone" className="text-gray-400 group-hover:text-black" />
              </div>
              <div className="text-left">
                <span className="block text-white font-bold text-lg">Soy Entrenador</span>
                <span className="text-gray-500 text-xs">Gestiono clases y alumnos.</span>
              </div>
            </button>

             <button 
              onClick={() => handleRoleSelect('admin')}
              className="group bg-brand-charcoal hover:bg-white/5 border border-white/10 hover:border-blue-500 p-4 rounded-2xl flex items-center gap-4 transition-all"
            >
              <div className="w-12 h-12 rounded-full bg-brand-charcoal border border-white/10 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <ShieldCheck size={24} weight="duotone" className="text-gray-400 group-hover:text-white" />
              </div>
              <div className="text-left">
                <span className="block text-white font-bold text-lg">Soy Administrador</span>
                <span className="text-gray-500 text-xs">Gestión total del sistema.</span>
              </div>
            </button>
          </div>
        )}

        {/* PASO 2: LOGIN CON GOOGLE */}
        {step === 2 && (
          <div className="animate-fade-in-up">
            <div className="bg-brand-charcoal/50 border border-brand-gold/20 p-6 rounded-3xl text-center shadow-2xl">
              
              <div className="w-20 h-20 mx-auto bg-brand-charcoal rounded-full border-2 border-brand-gold flex items-center justify-center mb-6 shadow-gold-glow">
                {selectedRole === 'user' && <User size={40} className="text-white" weight="fill" />}
                {selectedRole === 'trainer' && <Megaphone size={40} className="text-white" weight="fill" />}
                {selectedRole === 'admin' && <ShieldCheck size={40} className="text-white" weight="fill" />}
              </div>

              <button 
                onClick={handleLogin}
                className="w-full flex items-center justify-center gap-3 bg-brand-red text-white px-6 py-4 rounded-xl font-bold transition-all hover:bg-red-700 hover:scale-[1.02] shadow-lg mb-4 group overflow-hidden relative"
              >
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-brand-gold/20 to-transparent -translate-x-[100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                <svg className="w-6 h-6 relative z-10" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M21.35,11.1H12.18V13.83H18.69C18.36,17.64 15.19,19.27 12.19,19.27C8.36,19.27 5,16.25 5,12C5,7.9 8.2,4.73 12.2,4.73C15.29,4.73 17.1,6.7 17.1,6.7L19,4.72C19,4.72 16.56,2 12.1,2C6.42,2 2.03,6.8 2.03,12C2.03,17.05 6.16,22 12.25,22C17.6,22 21.5,18.33 21.5,12.91C21.5,11.76 21.35,11.1 21.35,11.1V11.1Z" />
                </svg>
                <span className="relative z-10">Continuar con Google</span>
              </button>

              <button 
                onClick={() => { setStep(1); clearError(); }}
                className="text-gray-500 text-sm hover:text-white flex items-center justify-center gap-2 mx-auto transition-colors"
              >
                <ArrowLeft size={16} /> Cambiar rol
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

// --- LA APP PRINCIPAL (Con el nuevo diseño) ---
function MainApp() {
  const { user, role, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('home'); // Estado: ¿Qué pestaña veo?

  return (
    <AppLayout 
      activeTab={activeTab} 
      onTabChange={setActiveTab} 
      onLogout={logout}
    >
      {/* COMPONENTE GESTOR DE NOTIFICACIONES */}
      <NotificationManager upcomingClasses={[]} />

      {/* CONTENIDO CAMBIANTE SEGÚN LA PESTAÑA */}
      
      {activeTab === 'home' && (
        (
          role === 'trainer' ? (
            // --- DASHBOARD COACH ---
            <div className="flex flex-col h-full">
              {/* ENCABEZADO COACH */}
              <div className="mb-8 animate-fade-in-down">
                <h1 className="text-3xl font-black text-white leading-none relative z-10">
                  Hola, <span className="text-brand-gold">{user.displayName?.split(' ')[0]}</span>
                </h1>
                <p className="text-white/70 text-sm font-medium mt-2 flex items-center gap-2">
                  <span className="inline-block w-2 h-2 bg-brand-gold rounded-full animate-pulse"></span>
                  Coach • Entrenador
                </p>
              </div>

              {/* ESTADÍSTICAS DEL COACH */}
              <div className="grid grid-cols-3 gap-4 mb-8 animate-fade-in">
                {/* Atletas Activos */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center hover:bg-white/10 transition-colors">
                  <User size={24} className="text-brand-gold mx-auto mb-2" weight="duotone" />
                  <span className="block text-2xl font-bold text-white">8</span>
                  <span className="text-xs text-white/60">Atletas Activos</span>
                </div>
                {/* Clases Semana */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center hover:bg-white/10 transition-colors">
                  <CalendarCheck size={24} className="text-brand-red mx-auto mb-2" weight="duotone" />
                  <span className="block text-2xl font-bold text-white">12</span>
                  <span className="text-xs text-white/60">Clases/Semana</span>
                </div>
                {/* Asistencia Promedio */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center hover:bg-white/10 transition-colors">
                  <Target size={24} className="text-brand-gold mx-auto mb-2" weight="duotone" />
                  <span className="block text-2xl font-bold text-white">87%</span>
                  <span className="text-xs text-white/60">Asistencia Prom</span>
                </div>
              </div>

              {/* ACCIONES RÁPIDAS DEL COACH */}
              <div className="space-y-4 flex-grow animate-fade-in-up">
                {/* Crear Nueva Clase */}
                <button className="w-full group relative bg-gradient-to-br from-brand-charcoal to-brand-dark border border-brand-gold/30 rounded-2xl p-6 overflow-hidden transition-all hover:border-brand-red/50">
                  <div className="absolute inset-0 bg-gradient-to-r from-brand-red/0 via-brand-red/10 to-brand-red/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                  <div className="relative z-10 flex justify-between items-center">
                    <div className="text-left">
                      <h3 className="text-white font-bold">Crear Nueva Clase</h3>
                      <p className="text-white/60 text-sm">Programar sesión de entrenamiento</p>
                    </div>
                    <svg className="w-6 h-6 text-brand-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                </button>

                {/* Ver Atletas */}
                <button className="w-full group relative bg-gradient-to-br from-brand-charcoal to-brand-dark border border-brand-gold/30 rounded-2xl p-6 overflow-hidden transition-all hover:border-brand-gold/50">
                  <div className="absolute inset-0 bg-gradient-to-r from-brand-gold/0 via-brand-gold/10 to-brand-gold/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                  <div className="relative z-10 flex justify-between items-center">
                    <div className="text-left">
                      <h3 className="text-white font-bold">Mis Atletas</h3>
                      <p className="text-white/60 text-sm">Ver desempeño y datos médicos</p>
                    </div>
                    <svg className="w-6 h-6 text-brand-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                </button>

                {/* Enviar Notificación */}
                <button className="w-full group relative bg-gradient-to-br from-brand-charcoal to-brand-dark border border-white/10 rounded-2xl p-6 overflow-hidden transition-all hover:border-white/30">
                  <div className="relative z-10 flex justify-between items-center">
                    <div className="text-left">
                      <h3 className="text-white font-bold">Enviar Notificación</h3>
                      <p className="text-white/60 text-sm">Alertar a atletas inactivos</p>
                    </div>
                    <svg className="w-6 h-6 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                  </div>
                </button>
              </div>
            </div>
          ) : (
            // --- DASHBOARD ATLETA (original) ---
            <AthleteHomeDashboard />
          )
        )
      )}

      {activeTab === 'agenda' && (
        <div className="h-full flex flex-col">
            <div className="mb-4 px-4">
                <h2 className="text-2xl font-bold text-white">Agenda Semanal</h2>
                <p className="text-gray-400 text-sm">Organiza tus rounds.</p>
            </div>
            {/* COMPONENTE DE AGENDA */}
            <AgendaView />
        </div>
      )}

      {activeTab === 'profile' && (
        <div>
        <div className="pb-8">
            
            {/* 1. NUEVA CABECERA EDITABLE */}
            <ProfileHeader />

            {/* 2. FORMULARIO MÉDICO (Ya lo teníamos) */}
            <MedicalForm />
            
            {/* 3. BOTÓN CERRAR SESIÓN */}
            <div className="mt-12 border-t border-white/5 pt-6">
              <button onClick={logout} className="w-full text-gray-500 hover:text-white text-sm font-medium transition-colors flex items-center justify-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm-24-88a8,8,0,0,1,8-8h32V88a8,8,0,0,1,16,0v48a8,8,0,0,1-8,8H112A8,8,0,0,1,104,128Z"></path></svg>
                  Cerrar Sesión de Dispositivo
              </button>
            </div>
        </div>
        </div>
      )}

    </AppLayout>
  );
}

// --- COMPONENTE RAÍZ ---
function AppContent() {
  const { user, loading } = useAuth();
  
  // Mientras está cargando, mostramos un pantalla de espera
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="text-red-600 font-black text-4xl tracking-tighter italic mb-4">ROUND2</div>
          <p className="text-gray-500">Cargando...</p>
        </div>
      </div>
    );
  }
  
  return user ? <MainApp /> : <LoginScreen />;
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}