import React from 'react';
import Team from '@/features/teams/components/Team';
import { COMZMsHgo } from '@/data/teamsZmHgo';


const COMZMsHgoTeam = () => {

  return (
    <Team 
      teamName="Comisiones de Ordenamiento Metropolitano" 
      teamMembers={COMZMsHgo}
      isTecnicoTeam={true} 
    />
  );
}

export default COMZMsHgoTeam;
