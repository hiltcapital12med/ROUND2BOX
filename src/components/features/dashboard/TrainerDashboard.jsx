// UBICACIÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œN: /src/components/features/dashboard/TrainerDashboard.jsx
// Dashboard de inicio para entrenadores - EstÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â©tica unificada con Landing Page

import React from 'react';
import { useAuth } from '../../../context/AuthContext';
import { CalendarCheck, Target, User, Plus, Lightning, Bell, BookmarkSimple } from '@phosphor-icons/react';
import DashboardHeader from '../../dashboard/DashboardHeader';

export default function TrainerDashboard({ onNavigate }) {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-800">Por favor inicia sesiÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â³n</p>
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
          {/* SECCIÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œN 1: ESTADÃƒÆ’Ã†â€™Ãƒâ€šÃ‚ÂSTICAS GENERALES */}
          <section>
            <div className="dashboard-card">
              <div className="dashboard-card-header">
                <h2 className="dashboard-card-title">
                  <span className="dashboard-card-title-accent"></span>
                  EstadÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â­sticas Generales
                </h2>
                <span className="dashboard-card-label">Datos Actuales</span>
              </div>
              <div className="dashboard-metrics-grid">
                {/* Atletas Activos */}
                <div className="dashboard-metric-item">
                  <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
                    <User size={32} className="text-[#E30613]" weight="duotone" />
                  </div>
                  <p className="dashboard-metric-value">8</p>
                  <p className="dashboard-metric-label">Atletas Activos</p>
                  <p style={{ fontSize: '0.75rem', color: '#5A5A5A', marginTop: '0.5rem' }}>A tu cargo</p>
                </div>

                {/* Clases Semana */}
                <div className="dashboard-metric-item">
                  <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
                    <CalendarCheck size={32} className="text-[#E30613]" weight="duotone" />
                  </div>
                  <p className="dashboard-metric-value">12</p>
                  <p className="dashboard-metric-label">Clases Semana</p>
                  <p style={{ fontSize: '0.75rem', color: '#5A5A5A', marginTop: '0.5rem' }}>Programadas</p>
                </div>

                {/* Asistencia Promedio */}
                <div className="dashboard-metric-item">
                  <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
                    <Target size={32} className="text-[#E30613]" weight="duotone" />
                  </div>
                  <p className="dashboard-metric-value">87%</p>
                  <p className="dashboard-metric-label">Asistencia</p>
                  <p style={{ fontSize: '0.75rem', color: '#5A5A5A', marginTop: '0.5rem' }}>Promedio General</p>
                </div>
              </div>
            </div>
          </section>

          {/* SECCIÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œN 2: ACCIONES RÃƒÆ’Ã†â€™Ãƒâ€šÃ‚ÂPIDAS */}
          <section>
            <div className="dashboard-card">
              <div className="dashboard-card-header">
                <h2 className="dashboard-card-title">
                  <span className="dashboard-card-title-accent"></span>
                  Acciones RÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¡pidas
                </h2>
                <span className="dashboard-card-label">Gestiona FÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¡cil</span>
              </div>
              
              <div className="space-y-3">
                {/* Crear Nueva Clase - CTA Principal */}
                <button style={{
                  width: '100%',
                  background: 'linear-gradient(135deg, #E30613, #FF4444)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '1rem',
                  padding: '1.25rem 1.5rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '1rem',
                  fontWeight: '800',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  boxShadow: 'var(--dashboard-shadow-lg)'
                }} 
                onMouseEnter={(e) => e.target.style.boxShadow = 'var(--dashboard-shadow-xl)'}
                onMouseLeave={(e) => e.target.style.boxShadow = 'var(--dashboard-shadow-lg)'}
                className="hover:scale-105">
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontWeight: '900', marginBottom: '0.25rem' }}>Crear Nueva Clase</div>
                    <div style={{ fontSize: '0.85rem', opacity: 0.9, fontWeight: '500' }}>Programar sesiÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â³n</div>
                  </div>
                  <Plus size={24} weight="bold" />
                </button>

                {/* Ver Atletas */}
                <button style={{
                  width: '100%',
                  background: 'transparent',
                  color: '#E30613',
                  border: '2px solid #E30613',
                  borderRadius: '1rem',
                  padding: '1.25rem 1.5rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '1rem',
                  fontWeight: '800',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(227, 6, 19, 0.08)';
                  e.target.style.boxShadow = 'var(--dashboard-shadow-md)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'transparent';
                  e.target.style.boxShadow = 'none';
                }}>
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontWeight: '900', marginBottom: '0.25rem', color: '#1A1A1A' }}>Mis Atletas</div>
                    <div style={{ fontSize: '0.85rem', color: '#5A5A5A', fontWeight: '500' }}>Ver desempeÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â±o</div>
                  </div>
                  <Lightning size={24} weight="fill" />
                </button>

                {/* Enviar NotificaciÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â³n */}
                <button style={{
                  width: '100%',
                  background: 'transparent',
                  color: '#1A1A1A',
                  border: '2px solid #E8E8E8',
                  borderRadius: '1rem',
                  padding: '1.25rem 1.5rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '1rem',
                  fontWeight: '800',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}
                onMouseEnter={(e) => {
                  e.target.style.borderColor = '#E30613';
                  e.target.style.background = 'rgba(227, 6, 19, 0.05)';
                  e.target.style.boxShadow = 'var(--dashboard-shadow-sm)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.borderColor = '#E8E8E8';
                  e.target.style.background = 'transparent';
                  e.target.style.boxShadow = 'none';
                }}>
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontWeight: '900', marginBottom: '0.25rem' }}>Enviar NotificaciÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â³n</div>
                    <div style={{ fontSize: '0.85rem', color: '#5A5A5A', fontWeight: '500' }}>Alertar atletas</div>
                  </div>
                  <Bell size={24} weight="duotone" style={{ color: '#999999' }} />
                </button>

                {/* Ver Reportes */}
                <button style={{
                  width: '100%',
                  background: 'transparent',
                  color: '#1A1A1A',
                  border: '2px solid #E8E8E8',
                  borderRadius: '1rem',
                  padding: '1.25rem 1.5rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '1rem',
                  fontWeight: '800',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}
                onMouseEnter={(e) => {
                  e.target.style.borderColor = '#E30613';
                  e.target.style.background = 'rgba(227, 6, 19, 0.05)';
                  e.target.style.boxShadow = 'var(--dashboard-shadow-sm)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.borderColor = '#E8E8E8';
                  e.target.style.background = 'transparent';
                  e.target.style.boxShadow = 'none';
                }}>
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontWeight: '900', marginBottom: '0.25rem' }}>Ver Reportes</div>
                    <div style={{ fontSize: '0.85rem', color: '#5A5A5A', fontWeight: '500' }}>AnÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¡lisis semanal</div>
                  </div>
                  <BookmarkSimple size={24} weight="duotone" style={{ color: '#999999' }} />
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

