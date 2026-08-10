import React from 'react';
import Team from '@/features/teams/components/Team';
import { PresidentesZMTulanciongo, PresidentesZMPachuca } from '@/data/teamsZmHgo';

const getPresidentesByZona = (zonaSeleccionada) => {
  switch (zonaSeleccionada) {
    case 'ZMP':
      return PresidentesZMPachuca;
    case 'ZMTulancingo':
      return PresidentesZMTulanciongo;
    default:
      return PresidentesZMPachuca;
  }
};

const PresiZMsHgo = ({ buscaZona }) => {
  const teamMembers = getPresidentesByZona(buscaZona);
  return (
    <Team
      teamName="Presidentes Municipales"
      teamMembers={teamMembers}
      isTecnicoTeam={true}
    />
  );
}

export default PresiZMsHgo;
