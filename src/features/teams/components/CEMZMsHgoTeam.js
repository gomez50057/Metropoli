import React from 'react';
import Team from '@/features/teams/components/Team';
import { CEMZMsHgo } from '@/data/teamsZmHgo';


const CEMZMsHgoTeam = ({ tituloZona }) => {

  return (
    <Team 
    teamName={`Comisión de Ordenamiento Metropolitano de la ZM de ${tituloZona}`}
      teamSubName="Presidencia Conjunta"
      teamMembers={CEMZMsHgo}
      isTecnicoTeam={true} 
    />
  );
}

export default CEMZMsHgoTeam;
