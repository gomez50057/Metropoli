import React from 'react';
import Team from '@/components/teams/Team';
import { cdmxTeamMembers } from '@/utils/utils';

const CDMXTeam = () => {
  return (
    <Team 
      teamName="Gobierno de la Ciudad de México"
      teamMembers={cdmxTeamMembers}
      isTecnicoTeam={false} 
    />
  );
}

export default CDMXTeam;
