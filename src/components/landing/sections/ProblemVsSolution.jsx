import React from 'react';

export default function ProblemVsSolution() {
  const comparisons = [
    {
      problem: {
        label: 'Gimnasios Convencionales',
        text: 'Entrenar solo, rodeado de espejo y nÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âºmeros',
        icon: 'ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸ÃƒÂ¢Ã¢â€šÂ¬Ã‹Å“Ãƒâ€šÃ‚Â¤'
      },
      solution: {
        label: 'Centro de IntegraciÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â³n',
        text: 'Entrenas con propÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â³sito y rodeado de aliados',
        icon: 'ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸Ãƒâ€šÃ‚Â¤Ãƒâ€šÃ‚Â'
      }
    },
    {
      problem: {
        label: 'Competencia Cruda',
        text: 'Ego y vanidad antes que salud mental',
        icon: 'ÃƒÆ’Ã‚Â¢Ãƒâ€¦Ã‚Â¡ÃƒÂ¢Ã¢â€šÂ¬Ã‚ÂÃƒÆ’Ã‚Â¯Ãƒâ€šÃ‚Â¸Ãƒâ€šÃ‚Â'
      },
      solution: {
        label: 'EducaciÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â³n y Respeto',
        text: 'El boxeo como herramienta de autoconocimiento',
        icon: 'ÃƒÆ’Ã‚Â¢Ãƒâ€šÃ‚ÂÃƒâ€šÃ‚Â¤ÃƒÆ’Ã‚Â¯Ãƒâ€šÃ‚Â¸Ãƒâ€šÃ‚Â'
      }
    },
    {
      problem: {
        label: 'Sin ConexiÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â³n Real',
        text: 'Gente que va y viene; no hay tribu',
        icon: 'ÃƒÆ’Ã‚Â¢Ãƒâ€¦Ã‚Â Ãƒâ€¹Ã…â€œ'
      },
      solution: {
        label: 'Comunidad que Crece',
        text: 'Tu tribu te espera; todos juntos, todos crecemos',
        icon: 'ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒâ€¹Ã¢â‚¬Â '
      }
    }
  ];

  return (
    <section className="problem-solution-section">
      <div className="section-container">
        <h2 className="section-title">ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¿QuÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â© Diferencia a Round2Box?</h2>
        
        <div className="comparison-grid">
          {comparisons.map((item, index) => (
            <div key={index} className="comparison-row">
              <div className="comparison-card problem-card">
                <div className="card-icon">{item.problem.icon}</div>
                <h3 className="card-label">{item.problem.label}</h3>
                <p className="card-text">{item.problem.text}</p>
              </div>
              
              <div className="vs-divider">VS</div>
              
              <div className="comparison-card solution-card">
                <div className="card-icon">{item.solution.icon}</div>
                <h3 className="card-label">{item.solution.label}</h3>
                <p className="card-text">{item.solution.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

