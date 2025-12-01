import React from 'react';
import EstatalMetro from '@/components/teams/EstatalMetro';
import Tecnico from '@/components/teams/Tecnico';
// import FederalTeam from '@/components/teams/FederalTeam';
import CDMXTeam from '@/components/teams/CDMXTeam';
import EDOMEXTeam from '@/components/teams/EDOMEXTeam';
import HGOTeam from '@/components/teams/HGOTeam';

const ZMVMComponent = () => {
  return (
    <div>
      <EstatalMetro />
      <Tecnico />
      {/* <FederalTeam /> */}
      <HGOTeam />
      <CDMXTeam />
      <EDOMEXTeam />
    </div>
  );
};

export default ZMVMComponent;

