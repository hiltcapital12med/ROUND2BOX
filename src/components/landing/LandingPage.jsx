import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, ArrowRight, CheckCircle, Flame, Users, Target, Brain } from '@phosphor-icons/react';
import './styles/enhanced-modern.css';

function useScrollReveal(threshold = 0.15) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, isVisible];
}

function HeroSection() {
  const navigate = useNavigate();
  const [ref, isVisible] = useScrollReveal();

  return (
    <section ref={ref} className={`hero-modern ${isVisible ? 'reveal-active' : ''}`}>
      <div className="hero-container">
        <div className="hero-content">
          <div className="micro-intro">
            <span className="pulse-badge">ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸ÃƒÂ¢Ã¢â€šÂ¬Ã‚ÂÃƒâ€šÃ‚Â´ No es un gimnasio. Es una esquina.</span>
          </div>

          <h1 className="hero-headline">
            Tu esquina <br />
            <span className="hero-highlight">en un mundo</span>
            <br />
            solitario
          </h1>

          <p className="hero-subheading">
            En Round2Box entrenas con aliados. AquÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â­ el boxeo es tu espejo, la comunidad es tu brÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âºjula.
          </p>

          <div className="hero-cta-group">
            <button onClick={() => navigate('/auth/signup')} className="cta-primary-hero">
              <span>Quiero mi primer entrenamiento gratis</span>
              <ArrowRight size={20} weight="bold" />
            </button>
            <button className="cta-secondary-hero">
              Ver la comunidad en acciÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â³n
            </button>
          </div>

          <div className="trust-metrics">
            <div className="metric-item">
              <span className="metric-number">+500</span>
              <span className="metric-label">Atletas en tribu</span>
            </div>
            <div className="metric-item">
              <span className="metric-number">97%</span>
              <span className="metric-label">Vuelven la semana prÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â³xima</span>
            </div>
          </div>
        </div>

        <div className="hero-visual">
          <div className="visual-box">
            <div className="visual-placeholder">
              <Flame size={64} className="icon-accent" weight="fill" />
              <p>Tu momento de poder</p>
              <small>Foto/Video candid de atletas en entrenamiento</small>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ContrastSection() {
  const [ref, isVisible] = useScrollReveal();
  const [activeCard, setActiveCard] = useState('vs');

  return (
    <section ref={ref} className={`contrast-modern ${isVisible ? 'reveal-active' : ''}`}>
      <div className="contrast-container">
        <div className="contrast-header">
          <h2 className="contrast-title">La diferencia no es el entrenamiento.</h2>
          <p className="contrast-subtitle">Es con quiÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â©n lo haces.</p>
        </div>

        <div className="contrast-grid">
          <div 
            className={`contrast-card card-left ${activeCard === 'solo' ? 'active' : ''}`}
            onMouseEnter={() => setActiveCard('solo')}
          >
            <div className="card-icon sad">
              <span>ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸Ãƒâ€¹Ã…â€œÃƒÂ¢Ã¢â€šÂ¬Ã‚Â</span>
            </div>
            <h3 className="card-title">Entrenar Solo</h3>
            <ul className="card-list">
              <li><span className="x-mark">ÃƒÆ’Ã‚Â¢Ãƒâ€¦Ã¢â‚¬Å“ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¢</span> Espejo y silencio</li>
              <li><span className="x-mark">ÃƒÆ’Ã‚Â¢Ãƒâ€¦Ã¢â‚¬Å“ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¢</span> Dolor sin razÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â³n</li>
              <li><span className="x-mark">ÃƒÆ’Ã‚Â¢Ãƒâ€¦Ã¢â‚¬Å“ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¢</span> MotivaciÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â³n que desvanece</li>
              <li><span className="x-mark">ÃƒÆ’Ã‚Â¢Ãƒâ€¦Ã¢â‚¬Å“ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¢</span> Regresas 1-2 meses</li>
              <li><span className="x-mark">ÃƒÆ’Ã‚Â¢Ãƒâ€¦Ã¢â‚¬Å“ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¢</span> Sin propÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â³sito claro</li>
            </ul>
          </div>

          <div className="contrast-divider">
            <span className="divider-text">VS</span>
          </div>

          <div 
            className={`contrast-card card-right ${activeCard === 'tribu' ? 'active' : ''}`}
            onMouseEnter={() => setActiveCard('tribu')}
          >
            <div className="card-icon happy">
              <span>ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸ÃƒÂ¢Ã¢â€šÂ¬Ã‚ÂÃƒâ€šÃ‚Â¥</span>
            </div>
            <h3 className="card-title">Round2Box</h3>
            <ul className="card-list">
              <li><span className="check-mark">ÃƒÆ’Ã‚Â¢Ãƒâ€¦Ã¢â‚¬Å“ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œ</span> Aliados en tu esquina</li>
              <li><span className="check-mark">ÃƒÆ’Ã‚Â¢Ãƒâ€¦Ã¢â‚¬Å“ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œ</span> Dolor con significado</li>
              <li><span className="check-mark">ÃƒÆ’Ã‚Â¢Ãƒâ€¦Ã¢â‚¬Å“ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œ</span> Tribu que te sostiene</li>
              <li><span className="check-mark">ÃƒÆ’Ã‚Â¢Ãƒâ€¦Ã¢â‚¬Å“ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œ</span> Regresas todas las semanas</li>
              <li><span className="check-mark">ÃƒÆ’Ã‚Â¢Ãƒâ€¦Ã¢â‚¬Å“ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œ</span> Trasformas tu vida</li>
            </ul>
          </div>
        </div>

        <div className="contrast-cta">
          <button className="cta-secondary-contrast">
            Descubre cÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â³mo es una clase real
          </button>
        </div>
      </div>
    </section>
  );
}

function PillarsSection() {
  const [ref, isVisible] = useScrollReveal();

  const pillars = [
    {
      icon: Brain,
      title: "Autoconocimiento",
      description: "El boxeo es un espejo. Cada golpe es honestidad contigo mismo.",
      cta: "Tu mente, tu fuerza"
    },
    {
      icon: Users,
      title: "Comunidad Real",
      description: "No estÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¡s solo en tu esquina. Tu tribu te sostiene antes, durante y despuÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â©s.",
      cta: "Encuentra tu gente"
    },
    {
      icon: Target,
      title: "Disciplina Emocional",
      description: "Aprendes a transformar miedo en fuerza. Rabia en propÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â³sito.",
      cta: "Entrena tu mente"
    }
  ];

  return (
    <section ref={ref} className={`pillars-modern ${isVisible ? 'reveal-active' : ''}`}>
      <div className="pillars-container">
        <h2 className="section-heading">Los pilares que nos definen</h2>
        
        <div className="pillars-grid">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div key={idx} className="pillar-card">
                <div className="pillar-icon-wrapper">
                  <Icon size={48} weight="duotone" className="pillar-icon" />
                </div>
                <h3 className="pillar-title">{pillar.title}</h3>
                <p className="pillar-description">{pillar.description}</p>
                <a href="#contact" className="pillar-cta">{pillar.cta} ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢</a>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function FounderSection() {
  const [ref, isVisible] = useScrollReveal();

  return (
    <section ref={ref} className={`founder-modern ${isVisible ? 'reveal-active' : ''}`}>
      <div className="founder-container">
        <div className="founder-content">
          <span className="founder-badge">Fundador & VisiÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â³n</span>
          <h2 className="founder-title">ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Ângel RodrÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â­guez</h2>
          <p className="founder-subtitle">De boxeador profesional a Coach Visionario</p>

          <p className="founder-story">
            "EntrenÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â© para ganar. Pero descubrÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â­ que el verdadero poder estÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¡ en transformar. 
            Round2Box no nace de un tÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â­tulo de campeonato, sino del momento en que entendÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â­ que 
            el boxeo es el mejor maestro de vida emocional que existe."
          </p>

          <div className="founder-highlights">
            <div className="highlight">
              <Heart size={24} weight="fill" className="heart-icon" />
              <span>10+ aÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â±os en boxeo profesional</span>
            </div>
            <div className="highlight">
              <Heart size={24} weight="fill" className="heart-icon" />
              <span>Especialista en salud mental emocional</span>
            </div>
            <div className="highlight">
              <Heart size={24} weight="fill" className="heart-icon" />
              <span>Mentor de 500+ atletas en tribu</span>
            </div>
          </div>

          <button className="cta-secondary-founder">
            Conoce mÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¡s sobre ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Ângel
          </button>
        </div>

        <div className="founder-visual">
          <div className="founder-image-placeholder">
            <div className="placeholder-content">
              <span className="large-icon">ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢Ãƒâ€šÃ‚Âª</span>
              <p>Foto profesional de ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Ângel</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProgressSection() {
  const [ref, isVisible] = useScrollReveal();
  const [activeTab, setActiveTab] = useState('weekly');

  const weeklyData = {
    classes: [
      { day: 'Lun', completed: true },
      { day: 'Mar', completed: true },
      { day: 'MiÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â©', completed: true },
      { day: 'Jue', completed: false },
      { day: 'Vie', completed: true },
      { day: 'Sab', completed: true },
      { day: 'Dom', completed: false }
    ],
    total: 5,
    goal: 6
  };

  const metrics = [
    { label: 'Sesiones este mes', value: '16', icon: 'ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸Ãƒâ€šÃ‚Â¥Ãƒâ€¦Ã‚Â ' },
    { label: 'Racha actual', value: '5 dÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â­as', icon: 'ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸ÃƒÂ¢Ã¢â€šÂ¬Ã‚ÂÃƒâ€šÃ‚Â¥' },
    { label: 'CalorÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â­as quemadas', value: '2,850', icon: 'ÃƒÆ’Ã‚Â¢Ãƒâ€¦Ã‚Â¡Ãƒâ€šÃ‚Â¡' },
    { label: 'Peso levantado', value: '12.5 ton', icon: 'ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢Ãƒâ€šÃ‚Âª' }
  ];

  return (
    <section ref={ref} className={`progress-modern ${isVisible ? 'reveal-active' : ''}`}>
      <div className="progress-container">
        <div className="progress-header">
          <h2 className="section-heading">Tu progreso es visible</h2>
          <p className="section-subtitle">Adelanto de la App que estamos desarrollando</p>
        </div>

        <div className="progress-tabs">
          <button 
            className={`tab-btn ${activeTab === 'weekly' ? 'active' : ''}`}
            onClick={() => setActiveTab('weekly')}
          >
            Esta Semana
          </button>
          <button 
            className={`tab-btn ${activeTab === 'monthly' ? 'active' : ''}`}
            onClick={() => setActiveTab('monthly')}
          >
            Este Mes
          </button>
          <button 
            className={`tab-btn ${activeTab === 'goals' ? 'active' : ''}`}
            onClick={() => setActiveTab('goals')}
          >
            Objetivos
          </button>
        </div>

        <div className="progress-content">
          {activeTab === 'weekly' && (
            <div className="weekly-view glass-card">
              <h3 className="progress-subtitle">Clases completadas</h3>
              <div className="weekly-grid">
                {weeklyData.classes.map((day, idx) => (
                  <div key={idx} className={`day-box ${day.completed ? 'completed' : 'missed'}`}>
                    <span className="day-label">{day.day}</span>
                    {day.completed ? (
                      <CheckCircle size={24} weight="fill" className="check-icon" />
                    ) : (
                      <span className="miss-icon">ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬ÂÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¹</span>
                    )}
                  </div>
                ))}
              </div>
              <p className="progress-stat">
                <strong>{weeklyData.total} de {weeklyData.goal}</strong> clases completadas
              </p>
            </div>
          )}

          {activeTab === 'monthly' && (
            <div className="monthly-view glass-card">
              <h3 className="progress-subtitle">MÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â©tricas del mes</h3>
              <div className="metrics-grid">
                {metrics.map((metric, idx) => (
                  <div key={idx} className="metric-card">
                    <span className="metric-icon">{metric.icon}</span>
                    <span className="metric-value">{metric.value}</span>
                    <span className="metric-label">{metric.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'goals' && (
            <div className="goals-view glass-card">
              <h3 className="progress-subtitle">Tus objetivos</h3>
              <div className="goals-list">
                <div className="goal-item">
                  <div className="goal-header">
                    <span className="goal-name">Alcanzar 8 clases/semana</span>
                    <span className="goal-percent">75%</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: '75%' }}></div>
                  </div>
                </div>

                <div className="goal-item">
                  <div className="goal-header">
                    <span className="goal-name">Mejorar resistencia cardÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â­aca</span>
                    <span className="goal-percent">60%</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: '60%' }}></div>
                  </div>
                </div>

                <div className="goal-item">
                  <div className="goal-header">
                    <span className="goal-name">Dominar tÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â©cnica de gancho</span>
                    <span className="goal-percent">45%</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: '45%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="progress-cta">
          <p className="cta-text">Esto solo es el principio. Espera el acceso a la app completa.</p>
          <button className="cta-app">
            AvÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â­same cuando estÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â© lista
          </button>
        </div>
      </div>
    </section>
  );
}

function FinalCTASection() {
  const [ref, isVisible] = useScrollReveal();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setTimeout(() => {
        setEmail('');
        setSubmitted(false);
      }, 3000);
    }
  };

  return (
    <section ref={ref} className={`final-cta-modern ${isVisible ? 'reveal-active' : ''}`}>
      <div className="final-cta-container">
        <h2 className="final-headline">
          Tu esquina te estÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¡ esperando.
        </h2>
        <p className="final-subheading">
          No entrenamos solos. AquÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â­ encuentra tu tribu.
        </p>

        <form onSubmit={handleSubmit} className="final-form">
          <div className="form-group">
            <input
              type="email"
              placeholder="Tu email..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
              required
            />
            <button type="submit" className="cta-submit">
              Agenda tu primer entrenamiento
              <ArrowRight size={20} weight="bold" />
            </button>
          </div>
          {submitted && (
            <p className="form-success">ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¡Chequea tu email! Te enviaremos la agenda.</p>
          )}
        </form>

        <p className="final-guarantee">
          <strong>GarantÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â­a:</strong> Si no te enamoraste de la tribu en tu primera clase, 
          te devolvemos el dinero. Sin preguntas.
        </p>
      </div>
    </section>
  );
}

function FooterModern() {
  return (
    <footer className="footer-modern">
      <div className="footer-container">
        <div className="footer-branding">
          <h3 className="footer-logo">Round2Box</h3>
          <p className="footer-tagline">Tu esquina en un mundo solitario</p>
        </div>

        <div className="footer-links">
          <a href="#about">Sobre nosotros</a>
          <a href="#contact">Contacto</a>
          <a href="#classes">Clases</a>
          <a href="#community">Comunidad</a>
        </div>

        <div className="footer-social">
          <p className="social-label">SÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â­guenos</p>
          <div className="social-links">
            <a href="#" target="_blank" rel="noopener noreferrer">Instagram</a>
            <a href="#" target="_blank" rel="noopener noreferrer">TikTok</a>
            <a href="#" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          </div>
        </div>

        <p className="footer-copyright">
          ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â© 2026 Round2Box. Hecho con ÃƒÆ’Ã‚Â¢Ãƒâ€šÃ‚ÂÃƒâ€šÃ‚Â¤ÃƒÆ’Ã‚Â¯Ãƒâ€šÃ‚Â¸Ãƒâ€šÃ‚Â y disciplina emocional.
        </p>
      </div>
    </footer>
  );
}

export default function LandingPage() {
  return (
    <div className="enhanced-landing-container">
      <HeroSection />
      <ContrastSection />
      <PillarsSection />
      <FounderSection />
      <ProgressSection />
      <FinalCTASection />
      <FooterModern />
    </div>
  );
}

