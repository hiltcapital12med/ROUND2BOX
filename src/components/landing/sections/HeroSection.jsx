import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function HeroSection() {
  const navigate = useNavigate();

  const handleSignUp = () => {
    // Rastrear en analytics
    if (window.gtag) {
      gtag('event', 'cta_click', {
        'event_category': 'engagement',
        'event_label': 'Hero - ÃƒÆ’Ã†â€™Ãƒâ€¦Ã‚Â¡nete a la Comunidad'
      });
    }
    navigate('/auth/signup');
  };

  const handleLearnMore = () => {
    // Scroll suave a la secciÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â³n de features
    const element = document.getElementById('features');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="hero-section">
      <div className="hero-container">
        <div className="hero-content">
          <h1 className="hero-h1">Tu Esquina en un Mundo Solitario</h1>
          
          <h2 className="hero-h2">
            EducaciÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â³n, amistad y comunidad.
          </h2>
          
          <p className="hero-paragraph">
            Boxeo no es violencia. Es autoconocimiento. Descubres quiÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â©n eres 
            y encuentras tu tribu.
          </p>
          
          <div className="hero-cta-group">
            <button className="cta-primary" onClick={handleSignUp}>
              ÃƒÆ’Ã†â€™Ãƒâ€¦Ã‚Â¡nete a la Comunidad
            </button>
            <button className="cta-secondary" onClick={handleLearnMore}>
              Conoce Nuestro MÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â©todo
            </button>
          </div>
        </div>
        
        <div className="hero-image">
          <div className="hero-image-placeholder">
            <div className="placeholder-content">
              <p>Foto Candid</p>
              <p className="small">Comunidad chocando guantes</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

