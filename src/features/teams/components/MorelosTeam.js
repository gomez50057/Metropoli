import React from 'react';
import Team from '@/features/teams/components/Team';
import { morelosTeamMembers } from '@/data/utils';

const MorelosTeam = () => {
  return (
    <Team 
      teamName="Gobierno del Estado de Morelos"
      teamMembers={morelosTeamMembers}
      isTecnicoTeam={false} 
    />
  );
}

export default MorelosTeam;
