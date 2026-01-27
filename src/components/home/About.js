"use client";

import { useEffect, useState } from "react";
import { renderTextWithStyles } from "@/utils/blogData";
import { getTituloZona, getTextoObjetivo, getImages, getPreposicion } from "@/utils/home";

import styles from "./About.module.css"; // ✅ SOLO module

const About = () => {
  const [zonaSeleccionada, setZonaSeleccionada] = useState("");

  useEffect(() => {
    const getZonaFromLocalStorage = () => {
      const zonaMetropolitana = localStorage.getItem("selectedZonaMetropolitana");
      setZonaSeleccionada(zonaMetropolitana || "");
    };

    getZonaFromLocalStorage();
    window.addEventListener("zonaChanged", getZonaFromLocalStorage);
    return () => window.removeEventListener("zonaChanged", getZonaFromLocalStorage);
  }, []);

  const images = getImages(zonaSeleccionada);

  return (
    <section id="about" className={styles.aboutContainer}>
      <div className={styles.aboutGiro}>
        <div className={styles.gallery}>
          {images.map((src, index) => (
            <img key={index} src={src} alt={`gallery ${index + 1}`} />
          ))}
        </div>
      </div>

      <div className={styles.aboutTxt}>
        <h2> ¿Qué son las <span className="span-doarado">Zonas Metropolitanas?</span></h2>

        <p> Las zonas metropolitanas son áreas donde varios municipios convergen conformando un continuo urbano, compartiendo actividades económicas, sociales y de infraestructura. Las Zonas Metropolitanas formalizan esta integración para mejorar la coordinación en temas clave como el desarrollo urbano, la movilidad y la gestión de servicios públicos. Esto permite la colaboración entre municipios para asegurar un crecimiento ordenado, sostenible y que mejore la calidad de vida de sus habitantes.</p>

        <h2>
          Zona Metropolitana {getPreposicion(zonaSeleccionada)}{" "}
          <span className="span-doarado">{getTituloZona(zonaSeleccionada)}</span>
        </h2>

        <p className={styles.whiteSpacePreLine}>
          {renderTextWithStyles(getTextoObjetivo(zonaSeleccionada) || "")}
        </p>
      </div>
    </section>
  );
};

export default About;