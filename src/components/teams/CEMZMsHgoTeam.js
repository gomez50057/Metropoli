import React from 'react';
import Team from '@/components/teams/Team';
import { CEMZMsHgo } from '@/utils/teamsZmHgo';


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
