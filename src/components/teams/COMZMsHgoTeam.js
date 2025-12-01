import React from 'react';
import Team from '@/components/teams/Team';
import { COMZMsHgo } from '@/utils/teamsZmHgo';


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
