import React from 'react';
import Team from '@/features/teams/components/Team';
import { estatalTeamMembers } from '@/data/utils';

const EstatalMetro = () => {
  return (
    <Team 
      teamName="Consejo de Desarrollo Metropolitano del Valle de México"
      teamSubName="Presidencia Conjunta del CDMVM"
      teamMembers={estatalTeamMembers}
      isTecnicoTeam={true} 
    />
  );
}

export default EstatalMetro;
