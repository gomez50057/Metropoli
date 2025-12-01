"use client";

import { useEffect, useState } from 'react';
import {
  getTextoDescripcion,
  getTituloZona,
  getTextoObjetivo,
  getImages,
  getPreposicion
} from '../../utils/home';
import './About.css';

const About = () => {
  const [zonaSeleccionada, setZonaSeleccionada] = useState('');

  useEffect(() => {
    const getZonaFromLocalStorage = () => {
      const zonaMetropolitana = localStorage.getItem('selectedZonaMetropolitana');
      setZonaSeleccionada(zonaMetropolitana || ''); // Actualiza el estado
    };

    // Cargar la zona seleccionada al montar el componente
    getZonaFromLocalStorage();

    // Escuchar el evento personalizado 'zonaChanged'
    window.addEventListener('zonaChanged', getZonaFromLocalStorage);

    // Limpieza del event listener cuando el componente se desmonte
    return () => {
      window.removeEventListener('zonaChanged', getZonaFromLocalStorage);
    };
  }, []);

  const images = getImages(zonaSeleccionada);

  return (
    <section id='about' className="about-container">
      <div className="about_giro">
        <div className="gallery">
          {images.map((src, index) => (
            <img key={index} src={src} alt={`gallery ${index + 1}`} />
          ))}
        </div>
      </div>
      <div className="about_txt">
        <h2>¿Qué son las <span className="span-doarado">Zonas Metropolitanas</span> ?</h2>
        <p>Las zonas metropolitanas son áreas donde varios municipios convergen conformando un continuo urbano, compartiendo actividades económicas, sociales y de infraestructura. Las Zonas Metropolitanas formalizan esta integración para mejorar la coordinación en temas clave como el desarrollo urbano, la movilidad y la gestión de servicios públicos. Esto permite la colaboración entre municipios para asegurar un crecimiento ordenado, sostenible y que mejore la calidad de vida de sus habitantes.</p>
        <h2>Zona Metropolitana {getPreposicion(zonaSeleccionada)} <span className="span-doarado">{getTituloZona(zonaSeleccionada)}</span></h2>
        <p className="white-space-pre-line">{getTextoObjetivo(zonaSeleccionada)}</p>
      </div>
    </section>
  );
};

export default About;
