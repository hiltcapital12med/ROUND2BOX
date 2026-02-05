// UBICACIÃ“N: /src/services/emailService.js
import emailjs from '@emailjs/browser';

// âš™ï¸ CONFIGURACIÃ“N: Reemplaza estos valores con los de tu cuenta EmailJS
// ObtÃ©n tu Public Key en: https://dashboard.emailjs.com/ â†’ Account â†’ API Keys
const PUBLIC_KEY = 'aEPbmH2oXjeYbsvzu';

// ObtÃ©n tu Service ID en: https://dashboard.emailjs.com/ â†’ Email Services
const SERVICE_ID = 'service_7jlvg3g';

// El Template ID es el que creaste
const TEMPLATE_ID = 'template_4rn9dp9';

// Inicializar EmailJS
emailjs.init(PUBLIC_KEY);

// Datos del gimnasio
const GYM_INFO = {
  address: 'Carrera 68 #74-23',
  phone: '+57 317 8809728',
  email: 'ayudaround2box@gmail.com'
};

// Mapeo de roles a espaÃ±ol
const ROLE_NAMES = {
  'user': 'Atleta',
  'trainer': 'Entrenador',
  'admin': 'Administrador'
};

/**
 * EnvÃ­a un correo de bienvenida al usuario registrado
 * @param {Object} user - Objeto del usuario de Firebase
 * @param {string} role - Rol del usuario (user, trainer, admin)
 * @returns {Promise<Object>} - Respuesta de EmailJS
 */
/**
 * EnvÃ­a correo de bienvenida con reintentos automÃ¡ticos
 * @param {Object} user - Objeto del usuario (puede ser string de email o objeto)
 * @param {string} role - Rol del usuario (user, trainer, admin)
 * @param {number} maxRetries - NÃºmero mÃ¡ximo de reintentos
 * @returns {Promise<Object>} - Respuesta de EmailJS
 */
export const sendWelcomeEmail = async (user, role = 'user', maxRetries = 3) => {
  const email = typeof user === 'string' ? user : user?.email;
  const name = typeof user === 'string' ? 'Atleta' : (user?.displayName || 'Atleta');

  if (!email || !email.includes('@')) {
    throw new Error('Email no vÃ¡lido');
  }

  let lastError;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const roleName = ROLE_NAMES[role] || 'Atleta';
      const templateParams = {
        email,
        name,
        role: roleName,
        gym_address: GYM_INFO.address,
        gym_phone: GYM_INFO.phone,
        gym_email: GYM_INFO.email
      };

      const response = await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams);
      return response;
    } catch (error) {
      lastError = error;
      if (attempt === maxRetries) {
        throw new Error(`Error enviando correo de bienvenida: ${error.message}`);
      }
      const waitTime = 1000 * Math.pow(2, attempt - 1);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }
  
  throw lastError || new Error('Error al enviar correo de bienvenida');
};

export default {
  sendWelcomeEmail,
  GYM_INFO
};
