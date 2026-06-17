import React from 'react';
import EstatalMetro from '@/features/teams/components/EstatalMetro';
import Tecnico from '@/features/teams/components/Tecnico';
// import FederalTeam from '@/features/teams/components/FederalTeam';
import CDMXTeam from '@/features/teams/components/CDMXTeam';
import EDOMEXTeam from '@/features/teams/components/EDOMEXTeam';
import HGOTeam from '@/features/teams/components/HGOTeam';
// import MorelosTeam from '@/features/teams/components/MorelosTeam';

const ZMVMComponent = () => {
  return (
    <div>
      <EstatalMetro />
      <Tecnico />
      {/* <FederalTeam /> */}
      <HGOTeam />
      <CDMXTeam />
      <EDOMEXTeam />
      {/* <MorelosTeam /> */}
    </div>
  );
};

export default ZMVMComponent;

