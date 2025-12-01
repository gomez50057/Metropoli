import React from 'react';
import Team from '@/components/teams/Team';
import { hgoTeamMembers } from '@/utils/utils';

const HGOTeam = () => {
  return (
    <Team 
      teamName="Gobierno del Estado de Hidalgo"
      teamMembers={hgoTeamMembers}
      isTecnicoTeam={false} 

    />
  );
}

export default HGOTeam;
