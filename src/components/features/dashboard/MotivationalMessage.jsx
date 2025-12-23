import React, { useState, useEffect } from 'react';
import { Heart } from '@phosphor-icons/react';

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

  // Obtener mensaje del día basado en la fecha (mismo mensaje cada 24 horas)
  useEffect(() => {
    const today = new Date();
    const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 86400000);
    const messageIndex = dayOfYear % MOTIVATIONAL_MESSAGES.length;
    setCurrentMessage(messageIndex);
  }, []);

  const message = MOTIVATIONAL_MESSAGES[currentMessage];

  return (
    <div className="flex-shrink-0 flex flex-col items-center">
      {/* Icono */}
      <div className="mb-4">
        <div className="bg-red-500/20 border border-red-500/40 rounded-full p-3 flex items-center justify-center">
          <Heart size={32} className="text-red-400 animate-pulse" weight="fill" />
        </div>
      </div>

      {/* Información del mensaje */}
      <div className="text-center">
        <p className="text-sm text-white/70 italic leading-relaxed max-w-xs mx-auto">
          "{message.text}"
        </p>
        <p className="text-xs text-white/50 mt-2">
          {message.subtitle}
        </p>
      </div>
    </div>
  );
}
