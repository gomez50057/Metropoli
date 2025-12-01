import React from 'react';
import Team from '@/components/teams/Team';
import { tecnicoTeamMembersZMVM } from '@/utils/utils';

const HGOTeam = () => {
  return (
    <Team 
      teamSubName="Secretariado Técnico Conjunto"
      teamMembers={tecnicoTeamMembersZMVM}
      isTecnicoTeam={true} 
    />
  );
}

export default HGOTeam;
