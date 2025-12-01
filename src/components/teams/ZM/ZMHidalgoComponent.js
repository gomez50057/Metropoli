import React from 'react';
import { getTituloZona } from '../../../utils/home';
import CEMZMsHgoTeam from '../CEMZMsHgoTeam';
import COMZMsHgoTeam from '../COMZMsHgoTeam';
import PresiZMsHgo from '../PresiZMsHgo';

const ZMHidalgoComponent = ({ zona }) => {
  const tituloZona = getTituloZona(zona);
  return (
    <div>
      <CEMZMsHgoTeam tituloZona={tituloZona} />
      <COMZMsHgoTeam />
      <PresiZMsHgo buscaZona={zona} /> 
      <h2 className="team-title" style={{ margin: '35px 0' }}>  Servidores Públicos Municipales</h2>
      <h3 className="team-Subtitle">Síndicos, Tesoreros y Directores de Planeación, Desarrollo Urbano y Obras Públicas.</h3>
    </div>
  );
};

export default ZMHidalgoComponent;
