import React from 'react';
import EstatalMetro from '@/components/talleres-pmiu-zmp/EstatalMetro';

import CDMXTeam from '@/components/talleres-pmiu-zmp/CDMXTeam';
import EDOMEXTeam from '@/components/talleres-pmiu-zmp/EDOMEXTeam';
import HGOTeam from '@/components/talleres-pmiu-zmp/HGOTeam';

const ZMVMComponent = () => {
  return (
    <div>
      <EstatalMetro />
      <HGOTeam />
      <CDMXTeam />
      <EDOMEXTeam />
    </div>
  );
};

export default ZMVMComponent;

