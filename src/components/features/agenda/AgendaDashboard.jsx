// UBICACIÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œN: /src/components/features/agenda/AgendaDashboard.jsx
// Dashboard de agenda simplificado - usa el layout de AppLayout

import React from 'react';
import { useAuth } from '../../../context/AuthContext';
import AgendaView from './AgendaView';

export default function AgendaDashboard() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-800">Por favor inicia sesiÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â³n</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AgendaView />
    </div>
  );
}

