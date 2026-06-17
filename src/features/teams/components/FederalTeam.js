import React from 'react';
import Team from '@/features/teams/components/Team';
import { federalTeamMembers } from '@/data/utils';

const FederalTeam = () => {
  return (
    <Team 
      teamName="Gobierno Federal"
      teamMembers={federalTeamMembers}
      isTecnicoTeam={false} 
    />
  );
}

export default FederalTeam;
