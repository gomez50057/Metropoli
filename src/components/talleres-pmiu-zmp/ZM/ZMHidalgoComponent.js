import React from 'react';
import { getTituloZona } from '../../../utils/home';
import CEMZMsHgoTeam from '../CEMZMsHgoTeam';
import COMZMsHgoTeam from '../COMZMsHgoTeam';

const ZMHidalgoComponent = ({ zona }) => {
  const tituloZona = getTituloZona(zona);
  return (
    <div>
      <CEMZMsHgoTeam tituloZona={tituloZona} />
      <COMZMsHgoTeam />
     
    </div>
  );
};

export default ZMHidalgoComponent;
