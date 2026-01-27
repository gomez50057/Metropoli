import React from 'react';
import Team from '@/components/teams/Team';
import { morelosTeamMembers } from '@/utils/utils';

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
