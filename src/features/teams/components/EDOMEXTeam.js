import React from 'react';
import Team from '@/features/teams/components/Team';
import { edomexTeamMembers } from '@/data/utils';

const EDOMEXTeam = () => {
  return (
    <Team 
      teamName="Gobierno del Estado de México"
      teamMembers={edomexTeamMembers}
      isTecnicoTeam={false} 
    />
  );
}

export default EDOMEXTeam;
