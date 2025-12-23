import React, { useState, useEffect } from 'react';
import { Heart, ArrowRight } from '@phosphor-icons/react';

const MOTIVATIONAL_MESSAGES = [
  {
    text: "Aquí no estamos solos. Estamos en comunidad.",
    subtitle: "Tu presencia importa más de lo que crees"
  },
  {
    text: "En Round2Box somos familia.",
    subtitle: "Juntos somos más fuertes"
  },
  {
    text: "La disciplina nos une. La energía nos transforma.",
    subtitle: "Cada clase es un paso hacia la mejor versión de ti"
  },
  {
    text: "No venimos a vernos bien, venimos a sentirnos bien.",
    subtitle: "Eso es lo que nos hace diferentes"
  },
  {
    text: "Cada sudor es amistad. Cada esfuerzo es pertenencia.",
    subtitle: "Aquí nadie se queda atrás"
  },
  {
    text: "La comunidad te está esperando.",
    subtitle: "Tu lugar ya está reservado"
  },
  {
    text: "Más que un gimnasio, somos un espacio de integración.",
    subtitle: "Donde los lazos se fortalecen"
  },
  {
    text: "Hoy tienes la oportunidad de sentirte parte de algo.",
    subtitle: "No la dejes pasar"
  },
  {
    text: "La buena energía es contagiosa.",
    subtitle: "Trae la tuya y lleva la de los demás"
  },
  {
    text: "En un mundo digital y aislado, aquí estamos presentes.",
    subtitle: "Reales, conectados, unidos"
  },
  {
    text: "Disciplina con corazón. Eso es Round2Box.",
    subtitle: "Te estamos esperando"
  },
  {
    text: "Cada clase es una oportunidad de pertenecer.",
    subtitle: "Eres parte de nuestra historia"
  }
];

export default function MotivationalMessage() {
  const [currentMessage, setCurrentMessage] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);

  // Inicializar con mensaje aleatorio
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * MOTIVATIONAL_MESSAGES.length);
    setCurrentMessage(randomIndex);
  }, []);

  const handleNextMessage = () => {
    setIsFlipping(true);
    setTimeout(() => {
      setCurrentMessage((prev) => (prev + 1) % MOTIVATIONAL_MESSAGES.length);
      setIsFlipping(false);
    }, 300);
  };

  const message = MOTIVATIONAL_MESSAGES[currentMessage];

  return (
    <div className="flex-shrink-0">
      <button
        onClick={handleNextMessage}
        className={`relative w-20 h-20 rounded-full shadow-lg shadow-brand-red/30 hover:scale-110 transition-all duration-300 flex items-center justify-center group overflow-hidden ${
          isFlipping ? 'scale-95 opacity-75' : 'scale-100 opacity-100'
        }`}
        title={message.text}
      >
        {/* Fondo animado */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-red to-red-700 group-hover:from-brand-red group-hover:to-red-600"></div>
        
        {/* Efecto de luz */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent to-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        
        {/* Icono */}
        <div className="relative z-10 flex flex-col items-center justify-center gap-1">
          <Heart size={28} className="text-white animate-pulse" weight="fill" />
          <span className="text-xs font-bold text-white/80 uppercase tracking-wide">Hoy</span>
        </div>

        {/* Tooltip con el mensaje */}
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
          <div className="bg-black/90 backdrop-blur-sm border border-brand-red/50 rounded-lg px-4 py-2 whitespace-nowrap text-center">
            <p className="text-xs text-white/80 font-light italic">
              {message.text.substring(0, 30)}...
            </p>
          </div>
          {/* Flecha del tooltip */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-black/90"></div>
        </div>
      </button>

      {/* Información del mensaje debajo del botón */}
      <div className="mt-4 text-center">
        <p className="text-sm text-white/70 italic leading-relaxed max-w-xs mx-auto">
          "{message.text}"
        </p>
        <p className="text-xs text-white/50 mt-2">
          {message.subtitle}
        </p>
        <button
          onClick={handleNextMessage}
          className="inline-flex items-center gap-1 text-xs text-brand-red hover:text-brand-gold transition-colors mt-3 font-semibold uppercase tracking-wide"
        >
          Siguiente <ArrowRight size={12} weight="bold" />
        </button>
      </div>
    </div>
  );
}
