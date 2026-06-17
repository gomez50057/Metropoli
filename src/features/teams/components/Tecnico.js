import React from 'react';
import Team from '@/features/teams/components/Team';
import { tecnicoTeamMembersZMVM } from '@/data/utils';

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
