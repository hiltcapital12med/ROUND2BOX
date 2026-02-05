import React from 'react';

export default function AppFeatures() {
  const features = [
    {
      title: 'Seguimiento Inteligente',
      description: 'Ve tu progreso en tiempo real: velocidad, tÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â©cnica, resistencia y estado emocional post-entreno. Datos que importan, no nÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âºmeros vacios.',
      icon: 'ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒâ€¹Ã¢â‚¬Â '
    },
    {
      title: 'Comunidad Conectada',
      description: 'Choca guantes virtuales, celebra logros, comparte tu energÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â­a. Round2Box es donde la tribu se reÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âºne sin importar la hora o el lugar.',
      icon: 'ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸Ãƒâ€šÃ‚Â¤Ãƒâ€šÃ‚Â'
    },
    {
      title: 'Entrenamientos Personalizados',
      description: 'Planes diseÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â±ados por ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Ângel y su equipo, adaptados a tu nivel y tus objetivos reales: salud, disciplina, pertenencia.',
      icon: 'ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸Ãƒâ€¦Ã‚Â½Ãƒâ€šÃ‚Â¯'
    }
  ];

  return (
    <section className="app-features-section">
      <div className="section-container">
        <h2 className="section-title">Tu Herramienta de Crecimiento Integral</h2>
        
        <p className="section-intro">
          Nuestra app no solo cronometra entrenamientos. Es tu compaÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â±era en 
          el viaje hacia ser la mejor versiÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â³n de ti. Conecta con tu comunidad, 
          sigue tu progreso real y celebra cada pequeÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â±a victoria juntos.
        </p>
        
        <div className="mockups-grid">
          <div className="mockup-card">
            <div className="mockup-phone">
              <div className="mockup-content">
                <p>Pantalla 1</p>
                <p className="small">Hero de la App</p>
              </div>
            </div>
          </div>
          
          <div className="mockup-card">
            <div className="mockup-phone">
              <div className="mockup-content">
                <p>Pantalla 2</p>
                <p className="small">Dashboard</p>
              </div>
            </div>
          </div>
          
          <div className="mockup-card">
            <div className="mockup-phone">
              <div className="mockup-content">
                <p>Pantalla 3</p>
                <p className="small">Feed Comunidad</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

