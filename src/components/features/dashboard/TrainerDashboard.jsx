// UBICACIÓN: /src/components/features/dashboard/TrainerDashboard.jsx
// Dashboard de inicio para entrenadores - Estética unificada con paleta de colores actualizada

import React from 'react';
import { useAuth } from '../../../context/AuthContext';
import { CalendarCheck, Target, User, Plus, Lightning, Bell, BookmarkSimple } from '@phosphor-icons/react';
import DashboardHeader from '../../dashboard/DashboardHeader';

export default function TrainerDashboard({ onNavigate }) {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-800">Por favor inicia sesión</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container" style={{ paddingBottom: '120px' }}>
      <div className="dashboard-inner">
        {/* HEADER CON SALUDO PERSONALIZADO */}
        <DashboardHeader
          title="Tu Panel de Control"
          subtitle="Gestiona tus clases y atletas"
          stats={[
            { value: '8', label: 'Atletas Activos' },
            { value: '12', label: 'Clases Semana' }
          ]}
          onNavigate={onNavigate}
        />

        <div className="space-y-8">
          {/* SECCIÓN 1: ESTADÍSTICAS GENERALES */}
          <section>
            <div className="dashboard-card">
              <div className="dashboard-card-header">
                <h2 className="dashboard-card-title">
                  <span className="dashboard-card-title-accent"></span>
                  Estadísticas Generales
                </h2>
                <span className="dashboard-card-label">Datos Actuales</span>
              </div>
              <div className="dashboard-metrics-grid">
                {/* Atletas Activos */}
                <div className="dashboard-metric-item">
                  <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
                    <User size={32} className="text-brand-accent" weight="duotone" />
                  </div>
                  <p className="dashboard-metric-value">8</p>
                  <p className="dashboard-metric-label">Atletas Activos</p>
                  <p style={{ fontSize: '0.75rem', color: '#5A5A5A', marginTop: '0.5rem' }}>A tu cargo</p>
                </div>

                {/* Clases Semana */}
                <div className="dashboard-metric-item">
                  <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
                    <CalendarCheck size={32} className="text-brand-secondary" weight="duotone" />
                  </div>
                  <p className="dashboard-metric-value">12</p>
                  <p className="dashboard-metric-label">Clases Semana</p>
                  <p style={{ fontSize: '0.75rem', color: '#5A5A5A', marginTop: '0.5rem' }}>Programadas</p>
                </div>

                {/* Asistencia Promedio */}
                <div className="dashboard-metric-item">
                  <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
                    <Target size={32} className="text-brand-primary" weight="duotone" />
                  </div>
                  <p className="dashboard-metric-value">87%</p>
                  <p className="dashboard-metric-label">Asistencia</p>
                  <p style={{ fontSize: '0.75rem', color: '#5A5A5A', marginTop: '0.5rem' }}>Promedio General</p>
                </div>
              </div>
            </div>
          </section>

          {/* SECCIÓN 2: ACCIONES RÁPIDAS */}
          <section>
            <div className="dashboard-card">
              <div className="dashboard-card-header">
                <h2 className="dashboard-card-title">
                  <span className="dashboard-card-title-accent"></span>
                  Acciones Rápidas
                </h2>
                <span className="dashboard-card-label">Gestiona Fácil</span>
              </div>
              
              <div className="space-y-3">
                {/* Crear Nueva Clase - CTA Principal */}
                <button style={{
                  width: '100%',
                  background: 'linear-gradient(135deg, #d8315b, #e85a7f)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '1rem',
                  padding: '1.25rem 1.5rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 15px rgba(216, 49, 91, 0.3)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 6px 20px rgba(216, 49, 91, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 15px rgba(216, 49, 91, 0.3)';
                }}>
                  <span>Crear Nueva Clase</span>
                  <Lightning size={20} weight="fill" />
                </button>

                {/* Ver Atletas Activos */}
                <button style={{
                  width: '100%',
                  background: 'linear-gradient(135deg, rgba(62, 146, 204, 0.1), rgba(62, 146, 204, 0.05))',
                  color: '#3e92cc',
                  border: '2px solid rgba(62, 146, 204, 0.3)',
                  borderRadius: '1rem',
                  padding: '1.25rem 1.5rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.borderColor = 'rgba(62, 146, 204, 0.6)';
                  e.target.style.background = 'linear-gradient(135deg, rgba(62, 146, 204, 0.15), rgba(62, 146, 204, 0.08))';
                }}
                onMouseLeave={(e) => {
                  e.target.style.borderColor = 'rgba(62, 146, 204, 0.3)';
                  e.target.style.background = 'linear-gradient(135deg, rgba(62, 146, 204, 0.1), rgba(62, 146, 204, 0.05))';
                }}>
                  <span>Ver Mis Atletas Activos</span>
                  <User size={20} weight="duotone" />
                </button>

                {/* Enviar Notificación a Atletas */}
                <button style={{
                  width: '100%',
                  background: 'linear-gradient(135deg, rgba(10, 36, 99, 0.1), rgba(10, 36, 99, 0.05))',
                  color: '#0a2463',
                  border: '2px solid rgba(10, 36, 99, 0.3)',
                  borderRadius: '1rem',
                  padding: '1.25rem 1.5rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.borderColor = 'rgba(10, 36, 99, 0.6)';
                  e.target.style.background = 'linear-gradient(135deg, rgba(10, 36, 99, 0.15), rgba(10, 36, 99, 0.08))';
                }}
                onMouseLeave={(e) => {
                  e.target.style.borderColor = 'rgba(10, 36, 99, 0.3)';
                  e.target.style.background = 'linear-gradient(135deg, rgba(10, 36, 99, 0.1), rgba(10, 36, 99, 0.05))';
                }}>
                  <span>Enviar Notificación</span>
                  <Bell size={20} weight="duotone" />
                </button>

                {/* Revisar Disponibilidad */}
                <button style={{
                  width: '100%',
                  background: 'linear-gradient(135deg, rgba(245, 245, 245, 0.5), rgba(245, 245, 245, 0.3))',
                  color: '#666',
                  border: '2px solid rgba(200, 200, 200, 0.3)',
                  borderRadius: '1rem',
                  padding: '1.25rem 1.5rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.borderColor = 'rgba(200, 200, 200, 0.6)';
                  e.target.style.background = 'linear-gradient(135deg, rgba(245, 245, 245, 0.7), rgba(245, 245, 245, 0.5))';
                }}
                onMouseLeave={(e) => {
                  e.target.style.borderColor = 'rgba(200, 200, 200, 0.3)';
                  e.target.style.background = 'linear-gradient(135deg, rgba(245, 245, 245, 0.5), rgba(245, 245, 245, 0.3))';
                }}>
                  <span>Mi Disponibilidad</span>
                  <BookmarkSimple size={20} weight="duotone" />
                </button>
              </div>
            </div>
          </section>

          {/* SECCIÓN 3: INFORMACIÓN RÁPIDA */}
          <section>
            <div className="dashboard-card">
              <div className="dashboard-card-header">
                <h2 className="dashboard-card-title">
                  <span className="dashboard-card-title-accent"></span>
                  Recordatorio Importante
                </h2>
              </div>
              <div style={{
                padding: '1.5rem',
                borderRadius: '0.75rem',
                background: 'linear-gradient(135deg, rgba(62, 146, 204, 0.1), rgba(10, 36, 99, 0.05))',
                border: '1px solid rgba(62, 146, 204, 0.3)',
                color: '#444'
              }}>
                <p style={{ fontSize: '0.9rem', lineHeight: '1.6', margin: 0 }}>
                  ✓ Actualiza tu perfil con tu disponibilidad semanal para que los atletas puedan conocer tus horarios de atención.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

