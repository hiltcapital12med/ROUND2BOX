import React from 'react';

export default function SocialProof() {
  const testimonials = [
    {
      name: 'MarÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â­a',
      age: 28,
      role: 'Atleta, Emprendedora',
      text: 'LleguÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â© pensando que esto era solo ejercicio. DescubrÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â­ una familia. Por primera vez en aÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â±os me siento parte de algo real. No estoy sola.',
      rating: 5
    },
    {
      name: 'Carlos',
      age: 35,
      role: 'Ejecutivo, Padre',
      text: 'Entre el trabajo y la familia no tenÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â­a tiempo para mÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â­. AquÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â­ una hora es sagrada. Salgo diferente. La energÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â­a que dejo en el ring no es violencia, es sanaciÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â³n.',
      rating: 5
    },
    {
      name: 'SofÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â­a',
      age: 22,
      role: 'Estudiante, Deportista',
      text: 'ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Ângel no solo nos enseÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â±a tÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â©cnica. Nos enseÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â±a a creer en nosotros mismos. La comunidad aquÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â­ se anima sin competir. Es lo opuesto a todo lo que vivÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â­ en otros lugares.',
      rating: 5
    }
  ];

  const renderStars = (count) => {
    return Array(count).fill('ÃƒÆ’Ã‚Â¢Ãƒâ€šÃ‚Â­Ãƒâ€šÃ‚Â').join('');
  };

  return (
    <section className="social-proof-section">
      <div className="section-container">
        <h2 className="section-title">Lo Que Dicen Quienes Entrenan AquÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â­</h2>
        
        <p className="section-intro">
          No hablamos de kilos perdidos ni mÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âºsculos ganados. 
          Hablamos de cÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â³mo se sienten. De cÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â³mo la comunidad 
          les cambiÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â³ la perspectiva. De amistad real.
        </p>
        
        <div className="testimonials-grid">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="testimonial-card">
              <p className="testimonial-text">"{testimonial.text}"</p>
              
              <div className="testimonial-footer">
                <div className="testimonial-avatar">
                  {testimonial.name.charAt(0)}
                </div>
                
                <div className="testimonial-info">
                  <p className="testimonial-name">{testimonial.name}, {testimonial.age}</p>
                  <p className="testimonial-role">{testimonial.role}</p>
                  <div className="testimonial-rating">
                    {renderStars(testimonial.rating)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

