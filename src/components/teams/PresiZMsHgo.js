import React from 'react';
import Team from '@/components/teams/Team';
import { PresidentesZMTulanciongo, PresidentesZMTula, PresidentesZMPachuca } from '@/utils/teamsZmHgo';

const getPresidentesByZona = (zonaSeleccionada) => {
  switch (zonaSeleccionada) {
    case 'ZMP':
      return PresidentesZMPachuca;
    case 'ZMTula':
      return PresidentesZMTula;
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
