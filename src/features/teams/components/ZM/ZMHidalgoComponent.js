import React from 'react';
import { getTituloZona } from '@/data/home';
import CEMZMsHgoTeam from '../CEMZMsHgoTeam';
import COMZMsHgoTeam from '../COMZMsHgoTeam';
import PresiZMsHgo from '../PresiZMsHgo';
import teamStyles from '../Team.module.css';

const ZMHidalgoComponent = ({ zona }) => {
  const tituloZona = getTituloZona(zona);
  return (
    <div>
      <CEMZMsHgoTeam tituloZona={tituloZona} />
      <COMZMsHgoTeam />
      <PresiZMsHgo buscaZona={zona} /> 
      <h2 className={teamStyles["team-title"]} style={{ margin: '35px 0' }}>  Servidores Públicos Municipales</h2>
      <h3 className={teamStyles["team-Subtitle"]}>Síndicos, Tesoreros y Directores de Planeación, Desarrollo Urbano y Obras Públicas.</h3>
    </div>
  );
};

export default ZMHidalgoComponent;
