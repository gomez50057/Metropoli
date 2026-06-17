import React from 'react';
import EstatalMetro from '@/features/talleres-pmiu-zmp/components/EstatalMetro';

import CDMXTeam from '@/features/talleres-pmiu-zmp/components/CDMXTeam';
import EDOMEXTeam from '@/features/talleres-pmiu-zmp/components/EDOMEXTeam';
import HGOTeam from '@/features/talleres-pmiu-zmp/components/HGOTeam';

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

