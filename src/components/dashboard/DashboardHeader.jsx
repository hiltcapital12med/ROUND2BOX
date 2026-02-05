import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { CalendarCheck, User, House } from '@phosphor-icons/react';

export default function DashboardHeader({ title, subtitle, stats = [], onNavigate }) {
  const { user } = useAuth();
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    const date = new Date();
    const formatter = new Intl.DateTimeFormat('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    setCurrentDate(formatter.format(date));
  }, []);

  // Extraer inicial del nombre
  const getInitial = (name) => {
    return name?.charAt(0).toUpperCase() || 'ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸ÃƒÂ¢Ã¢â€šÂ¬Ã‹Å“Ãƒâ€¦Ã‚Â ';
  };

  // Emoji basado en rol
  const getEmoji = () => {
    if (user?.role === 'athlete') return 'ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸Ãƒâ€šÃ‚Â¥Ãƒâ€¦Ã‚Â ';
    if (user?.role === 'trainer') return 'ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢Ãƒâ€šÃ‚Âª';
    if (user?.role === 'admin') return 'ÃƒÆ’Ã‚Â¢Ãƒâ€¦Ã‚Â¡Ãƒâ€šÃ‚Â¡';
    return 'ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸ÃƒÂ¢Ã¢â€šÂ¬Ã‹Å“Ãƒâ€¦Ã‚Â ';
  };

  return (
    <>
      <div className="dashboard-header">
        <div className="dashboard-header-left">
          <div className="dashboard-avatar">
            {getEmoji()}
          </div>
          <div className="dashboard-greeting">
            <h1 className="dashboard-greeting-title">
              ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¡Hola, {user?.displayName?.split(' ')[0] || 'Guerrero'}!
            </h1>
            <p className="dashboard-greeting-subtitle">{subtitle || title}</p>
            <p className="dashboard-greeting-date">{currentDate}</p>
          </div>
        </div>

        <div className="dashboard-header-right">
          {stats && stats.map((stat, index) => (
            <div key={index} className="dashboard-stat-quick">
              <p className="dashboard-stat-value">{stat.value}</p>
              <p className="dashboard-stat-label">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Access Navigation */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
        <button
          onClick={() => onNavigate && onNavigate('home')}
          style={{
            background: 'linear-gradient(135deg, #E30613, #FF4444)',
            color: 'white',
            border: 'none',
            borderRadius: '1rem',
            padding: '1rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.9rem',
            fontWeight: '700',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            boxShadow: 'var(--dashboard-shadow-md)'
          }}
          onMouseEnter={(e) => {
            e.target.style.boxShadow = 'var(--dashboard-shadow-lg)';
            e.target.style.transform = 'translateY(-4px)';
          }}
          onMouseLeave={(e) => {
            e.target.style.boxShadow = 'var(--dashboard-shadow-md)';
            e.target.style.transform = 'translateY(0)';
          }}
          className="quick-nav-btn"
        >
          <House size={24} weight="fill" />
          <span>Principal</span>
        </button>

        <button
          onClick={() => onNavigate && onNavigate('agenda')}
          style={{
            background: 'transparent',
            color: '#E30613',
            border: '2px solid #E30613',
            borderRadius: '1rem',
            padding: '1rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.9rem',
            fontWeight: '700',
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
          }}
          className="quick-nav-btn"
        >
          <CalendarCheck size={24} weight="duotone" />
          <span>Agenda</span>
        </button>

        <button
          onClick={() => onNavigate && onNavigate('profile')}
          style={{
            background: 'transparent',
            color: '#1A1A1A',
            border: '2px solid #E8E8E8',
            borderRadius: '1rem',
            padding: '1rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.9rem',
            fontWeight: '700',
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
          }}
          className="quick-nav-btn"
        >
          <User size={24} weight="duotone" />
          <span>Perfil</span>
        </button>
      </div>
    </>
  );
}

