// UBICACIÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œN: /src/components/features/profile/ProfileDashboard.jsx
// Dashboard de perfil simplificado - usa el layout de AppLayout

import React from 'react';
import { useAuth } from '../../../context/AuthContext';
import ProfileHeader from './ProfileHeader';
import MedicalForm from './MedicalForm';

export default function ProfileDashboard() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-800">Por favor inicia sesiÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â³n</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      {/* SECCIÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œN: CABECERA DE PERFIL */}
      <section className="rounded-2xl p-4 sm:p-6 border border-brand-gray200/20 shadow-xl shadow-black/20">
        <ProfileHeader />
      </section>

      {/* SECCIÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œN: FICHA MÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â°DICA */}
      <section className="rounded-2xl p-4 sm:p-6 border border-brand-gray200/20 shadow-xl shadow-black/20">
        <h2 className="text-sm sm:text-base font-bold text-gray-800 mb-5 sm:mb-6 flex items-center gap-2">
          <span className="w-1 h-5 sm:h-6 bg-brand-accent rounded-full"></span>
          Ficha MÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â©dica
        </h2>
        <MedicalForm />
      </section>

    </div>
  );
}

