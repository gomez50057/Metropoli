import React from 'react';
import Team from '@/features/teams/components/Team';
import { hgoTeamMembers } from '@/data/utils';

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
