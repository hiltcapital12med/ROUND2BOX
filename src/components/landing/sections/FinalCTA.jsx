import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function FinalCTA() {
  const navigate = useNavigate();

  const handleJoinCommunity = () => {
    if (window.gtag) {
      gtag('event', 'cta_click', {
        'event_category': 'conversion',
        'event_label': 'FinalCTA - ÃƒÆ’Ã†â€™Ãƒâ€¦Ã‚Â¡nete a la Comunidad'
      });
    }
    navigate('/auth/signup');
  };

  const handleScheduleDemo = () => {
    if (window.gtag) {
      gtag('event', 'cta_click', {
        'event_category': 'conversion',
        'event_label': 'FinalCTA - Agenda SesiÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â³n Prueba'
      });
    }
    navigate('/contact');
  };

  return (
    <section className="final-cta-section">
      <div className="section-container">
        <h2 className="cta-headline">El Viaje Comienza AquÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â­</h2>
        
        <p className="cta-subheading">
          ÃƒÆ’Ã†â€™Ãƒâ€¦Ã‚Â¡nete a una comunidad que cree en ti. 
          Descubre quÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â© es posible cuando entrenas con propÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â³sito.
        </p>
        
        <div className="cta-buttons">
          <button className="cta-primary cta-large" onClick={handleJoinCommunity}>
            ÃƒÆ’Ã†â€™Ãƒâ€¦Ã‚Â¡nete a la Comunidad
            <span className="cta-subtitle">Acceso gratis. Primer entrenamiento incluido.</span>
          </button>
          
          <button className="cta-secondary cta-large" onClick={handleScheduleDemo}>
            Agenda una SesiÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â³n Prueba
          </button>
        </div>
      </div>
    </section>
  );
}

