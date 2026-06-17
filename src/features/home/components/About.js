"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

import { renderTextWithStyles } from "@/data/blogData";
import { getTituloZona, getTextoObjetivo, getImages, getPreposicion } from "@/data/home";

import styles from "./About.module.css";
import OrbitGallery from "@/features/home/components/OrbitGallery/OrbitGallery";

const About = () => {
  const [zonaSeleccionada, setZonaSeleccionada] = useState("");
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const getZonaFromLocalStorage = () => {
      const zonaMetropolitana = localStorage.getItem("selectedZonaMetropolitana");
      setZonaSeleccionada(zonaMetropolitana || "");
    };

    getZonaFromLocalStorage();
    window.addEventListener("zonaChanged", getZonaFromLocalStorage);
    return () => window.removeEventListener("zonaChanged", getZonaFromLocalStorage);
  }, []);

  const images = useMemo(() => getImages(zonaSeleccionada) || [], [zonaSeleccionada]);

  const zoneTitle = useMemo(
    () => `Zona Metropolitana ${getPreposicion(zonaSeleccionada)} ${getTituloZona(zonaSeleccionada)}`,
    [zonaSeleccionada]
  );

  const objetivo = useMemo(() => getTextoObjetivo(zonaSeleccionada) || "", [zonaSeleccionada]);

  // Variants (stagger suave)
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: reduceMotion
        ? { duration: 0 }
        : { staggerChildren: 0.06, delayChildren: 0.10 },
    },
  };

  const item = {
    hidden: reduceMotion
      ? { opacity: 1 }
      : { opacity: 0, y: 100 },
    show: reduceMotion
      ? { opacity: 1 }
      : {
        opacity: 1,
        y: 0,
        transition: {
          duration: 1,
          ease: [0.22, 1, 0.36, 1],
        },
      },
  };

  return (
    <section id="about" className={styles.aboutContainer}>
      <div className={styles.aboutGiro}>
        <OrbitGallery images={images} orbitCount={5} intervalMs={3500} />
      </div>

      <motion.div
        className={styles.aboutTxt}
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.35 }}
      >
        <motion.h2 variants={item}>
          ¿Qué son las <span className="span-doarado">Zonas Metropolitanas?</span>
        </motion.h2>

        <motion.p variants={item}>
          Las zonas metropolitanas son áreas donde varios municipios convergen conformando un continuo urbano,
          compartiendo actividades económicas, sociales y de infraestructura. Las Zonas Metropolitanas formalizan esta
          integración para mejorar la coordinación en temas clave como el desarrollo urbano, la movilidad y la gestión
          de servicios públicos. Esto permite la colaboración entre municipios para asegurar un crecimiento ordenado,
          sostenible y que mejore la calidad de vida de sus habitantes.
        </motion.p>

        <motion.h2 variants={item}>
          Zona Metropolitana {getPreposicion(zonaSeleccionada)}{" "}
          <span className="span-doarado">{getTituloZona(zonaSeleccionada)}</span>
        </motion.h2>

        <motion.p
          key={zonaSeleccionada || "default"}
          className={styles.whiteSpacePreLine}
          initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 6 }}
          animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
          transition={
            reduceMotion
              ? { duration: 0 }
              : {
                type: "spring",     
                stiffness: 90,
                damping: 18,
                mass: 0.9,
              }
          }
        >
          {renderTextWithStyles(objetivo)}
        </motion.p>
      </motion.div>
    </section>
  );
};

export default About;