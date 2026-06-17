import React from 'react';
import Team from '@/features/teams/components/Team';
import { cdmxTeamMembers } from '@/data/utils';

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
