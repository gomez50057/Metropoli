"use client";

import { motion, useReducedMotion } from "framer-motion";

import styles from "./About.module.css";

const About = () => {
  const reduceMotion = useReducedMotion();

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
        <img
          className={styles.floatingImage}
          src="/img/ciudad%20sostenible%20conectada.webp"
          srcSet="/img/ciudad%20sostenible%20conectada-640.webp 640w, /img/ciudad%20sostenible%20conectada.webp 1254w"
          sizes="(max-width: 652px) 92vw, (max-width: 1024px) 600px, (max-width: 1666px) 36vw, 600px"
          width={1254}
          height={1254}
          alt="Ciudad sostenible conectada: desarrollo urbano, movilidad y servicios públicos"
          loading="lazy"
          decoding="async"
        />
      </div>

      <motion.div
        className={styles.aboutTxt}
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.35 }}
      >
        <motion.h2 variants={item}>
          <span className={styles.titleLine}>¿Qué son las</span>{" "}
          <span className={styles.titleHighlight}>Zonas Metropolitanas?</span>
        </motion.h2>

        <motion.p variants={item}>
          Las zonas metropolitanas son áreas donde varios municipios convergen conformando un{" "}
          <strong>continuo urbano,</strong> compartiendo actividades económicas, sociales y de infraestructura.
        </motion.p>

        <motion.p variants={item}>
          Las zonas metropolitanas formalizan esta integración para mejorar la coordinación en temas clave como el{" "}
          <strong>desarrollo urbano, la movilidad y la gestión de servicios públicos.</strong>
        </motion.p>

        <motion.p variants={item}>
          Esto permite la colaboración entre municipios para asegurar un crecimiento ordenado, sostenible y que mejore la{" "}
          <strong>calidad de vida</strong> de sus habitantes.
        </motion.p>

      </motion.div>
    </section>
  );
};

export default About;
