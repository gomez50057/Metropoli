"use client";

import React, { useState, useEffect } from 'react';
import ZMVMComponent from './ZM/ZMVMComponent';
import ZMHidalgoComponent from './ZM/ZMHidalgoComponent';
import styles from './ZonasMetropolitanas.module.css';

// Función para obtener la zona seleccionada desde el localStorage o usar un valor predeterminado
const getZonaFromLocalStorage = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('selectedZonaMetropolitana') || 'ZMVM';
  }
  return 'ZMVM';
};

const ZonasMetropolitanas = () => {
  const [zonaSeleccionada, setZonaSeleccionada] = useState('ZMVM'); // Estado para la zona seleccionada
  const [fade, setFade] = useState('fade-in'); // Estado para el efecto de fade

  // Cargar la zona seleccionada al montar el componente
  useEffect(() => {
    const selectedZonaMetropolitana = getZonaFromLocalStorage();
    setZonaSeleccionada(selectedZonaMetropolitana); // Establece el valor inicial a partir de selectedZonaMetropolitana
  }, []);

  // Función para cambiar de zona
  const handleZonaChange = (zona) => {
    setFade('fade-out');
    setTimeout(() => {
      setZonaSeleccionada(zona);
      setFade('fade-in');
      localStorage.setItem('selectedZonaMetropolitana', zona); // Guardar la zona seleccionada en localStorage
    }, 300); // Retraso para la animación
  };

  return (
    <div className={styles.zonasContainer}>

      {/* Selector de Zonas */}
      <div className={styles.selector}>
        <button
          className={`${zonaSeleccionada === 'ZMVM' ? styles.active : ''}`}
          onClick={() => handleZonaChange('ZMVM')}
        >
          ZMVM
        </button>
        <button
          className={`${zonaSeleccionada === 'ZMP' ? styles.active : ''}`}
          onClick={() => handleZonaChange('ZMP')}
        >
          ZMPachuca
        </button>
        <button
          className={`${zonaSeleccionada === 'ZMTula' ? styles.active : ''}`}
          onClick={() => handleZonaChange('ZMTula')}
        >
          ZMTula
        </button>
        <button
          className={`${zonaSeleccionada === 'ZMTulancingo' ? styles.active : ''}`}
          onClick={() => handleZonaChange('ZMTulancingo')}
        >
          ZMTulancingo
        </button>
      </div>

      {/* Renderizado Condicional del Componente basado en la Zona Seleccionada */}
      <div className={`${styles.zonaContent} ${styles[fade]}`}>
        {zonaSeleccionada === 'ZMVM' ? (
          <ZMVMComponent />
        ) : (
          <ZMHidalgoComponent zona={zonaSeleccionada} />
        )}
      </div>
    </div>
  );
};

export default ZonasMetropolitanas;
