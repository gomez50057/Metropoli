import React from 'react';
import Team from '@/components/teams/Team';
import { federalTeamMembers } from '@/utils/utils';

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
