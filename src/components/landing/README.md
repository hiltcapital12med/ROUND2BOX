# Landing Page Round2Box - Guía de Integración

## 📁 Estructura de Archivos

```
src/components/landing/
├── LandingPage.jsx                    # Componente principal
├── LandingPageRoute.jsx               # Wrapper para enrutamiento
├── sections/
│   ├── HeroSection.jsx               # Hero con CTA
│   ├── ProblemVsSolution.jsx         # Comparativa visual
│   ├── AngelFactor.jsx               # Sección sobre Ángel
│   ├── AppFeatures.jsx               # Funcionalidades app
│   ├── SocialProof.jsx               # Testimonios
│   ├── FinalCTA.jsx                  # Cierre
│   └── Footer.jsx                    # Footer minimalista
└── styles/
    └── landing.css                   # Estilos completos
```

## 🚀 Cómo Usar

### 1. Importar en App.jsx

```jsx
import LandingPage from './components/landing/LandingPage';

function App() {
  return (
    <div>
      <LandingPage />
    </div>
  );
}
```

### 2. O usar con React Router

```jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPageRoute from './components/landing/LandingPageRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPageRoute />} />
        {/* otros routes */}
      </Routes>
    </Router>
  );
}
```

## 🎨 Personalización

### Colores

Todos los colores están definidos como CSS Variables en `landing.css`:

```css
--charcoal: #1A1A1A;
--orange-burnt: #D97706;
--blue-electric: #0EA5E9;
--white-bone: #F9F7F4;
```

Modifica estos valores para cambiar la paleta completa.

### Tipografía

Las fuentes están declaradas en CSS:

```css
--font-heading: 'Montserrat', sans-serif;
--font-body: 'Inter', sans-serif;
```

Asegúrate de que estas fuentes estén importadas en tu `index.html` o `main.jsx`.

### Imágenes

Reemplaza los placeholders con las imágenes reales:

- Hero: `src/assets/images/hero-community.jpg`
- Ángel: `src/assets/images/angel-coaching.jpg`
- Testimonios: `src/assets/images/testimonials/[nombre].jpg`

Actualiza las rutas en los componentes:

```jsx
<img src="/path/to/image.jpg" alt="Descripción" />
```

## 📱 Responsive Design

La landing page está optimizada para:

- **Desktop**: 1920px, 1440px, 1024px
- **Tablet**: 768px
- **Mobile**: 480px, 320px

Media queries incluidos en `landing.css`.

## ⚙️ Funcionalidades Interactivas

### Botones CTA

```jsx
<button className="cta-primary">Únete a la Comunidad</button>
<button className="cta-secondary">Conoce Nuestro Método</button>
```

Para agregar acciones:

```jsx
<button className="cta-primary" onClick={() => navigate('/signup')}>
  Únete a la Comunidad
</button>
```

### Scroll Suave

Agregar anchor links:

```jsx
<a href="#features">Ver Funcionalidades</a>
```

Actualizar componentes con IDs:

```jsx
<section id="features">
  <AppFeatures />
</section>
```

## 🔧 Mejoras Futuras

- [ ] Integrar imágenes reales
- [ ] Agregar formulario de suscripción
- [ ] Implementar analytics (Google Analytics)
- [ ] Agregar formulario de contacto modal
- [ ] Implementar dark mode toggle
- [ ] Optimizar imágenes para SEO
- [ ] Agregar video intro de Ángel

## 📊 SEO

Agregar en `index.html` o `main.jsx`:

```html
<meta name="description" content="Round2Box - Centro de Integración Humana. Boxeo, comunidad y educación en una sola plataforma.">
<meta name="keywords" content="boxeo, comunidad, salud mental, disciplina, training">
<meta name="og:title" content="Round2Box - Tu Esquina en un Mundo Solitario">
<meta name="og:description" content="Centro de Integración Humana con Ángel Rodríguez">
```

## 🐛 Troubleshooting

### Las fuentes no se ven

Asegúrate de tener Montserrat e Inter importadas. Agregar a `index.html`:

```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Montserrat:wght@600;700&display=swap" rel="stylesheet">
```

### Los estilos no se aplican

Verifica que `landing.css` esté importado en `LandingPage.jsx`:

```jsx
import './styles/landing.css';
```

### Las imágenes placeholder no se ven

Los placeholders usan degradados CSS. Para usar imágenes reales, reemplaza:

```jsx
// De esto:
<div className="hero-image-placeholder">...</div>

// A esto:
<img src="/images/hero.jpg" alt="Comunidad Round2Box" />
```

## 📞 Integración con Formularios

Para agregar funcionalidad a los CTAs, actualiza `FinalCTA.jsx`:

```jsx
import { useState } from 'react';

export default function FinalCTA() {
  const [showModal, setShowModal] = useState(false);
  
  return (
    <>
      <button onClick={() => setShowModal(true)}>
        Únete a la Comunidad
      </button>
      
      {showModal && <SignupModal onClose={() => setShowModal(false)} />}
    </>
  );
}
```

## 🎬 Animaciones Adicionales

Agregar scroll reveal con Intersection Observer:

```jsx
import { useEffect, useRef } from 'react';

export default function SectionWithAnimation() {
  const ref = useRef();
  
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
    
    if (ref.current) observer.observe(ref.current);
    
    return () => observer.disconnect();
  }, []);
  
  return <section ref={ref} className="fade-in">...</section>;
}
```

---

**Landing Page creada con ❤️ y pasión para Round2Box**
