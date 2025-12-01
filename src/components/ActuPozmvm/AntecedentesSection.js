"use client";

import { LazyMotion, domAnimation, m, MotionConfig, useReducedMotion } from "framer-motion";
import styles from "@/styles/ActuPozmvm/AntecedentesSection.module.css";

export default function AntecedentesSection() {
  const prefersReduced = useReducedMotion();

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08, when: "beforeChildren" },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 12 },
    show: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 70, damping: 16 },
    },
  };

  const hoverFx = prefersReduced
    ? {}
    : { y: -2, scale: 1.01, transition: { type: "spring", stiffness: 240, damping: 18 } };

  return (
    <LazyMotion features={domAnimation}>
      <MotionConfig reducedMotion="user">
        <section className={styles.section}>
          <m.h2
            className={styles.titule}
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
          >
            Antecedentes
          </m.h2>

          <m.ul
            className={styles.list}
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
          >
            <m.li
              className={styles.item}
              variants={item}
              whileHover={hoverFx}
              whileFocus={hoverFx}
              tabIndex={0}
            >
              <span className={styles.srOnly}>Punto 01: </span>
              El Programa de Ordenación de la Zona Metropolitana del Valle de México vigente, fue publicado en 1998.
            </m.li>

            <m.li
              className={styles.item}
              variants={item}
              whileHover={hoverFx}
              whileFocus={hoverFx}
              tabIndex={0}
            >
              <span className={styles.srOnly}>Punto 02: </span>
              En 2012 y 2015, se llevó a cabo un intento de actualización del Programa de Ordenación de la Zona Metropolitana del Valle de México.
            </m.li>

            <m.li
              className={styles.item}
              variants={item}
              whileHover={hoverFx}
              whileFocus={hoverFx}
              tabIndex={0}
            >
              <span className={styles.srOnly}>Punto 03: </span>
              Actualmente, la ZMVM enfrenta nuevas dinámicas territoriales, sociales, económicas y ambientales, por lo que es necesario actualizar este instrumento que responda de manera adecuada a estos desafíos
            </m.li>
          </m.ul>
        </section>
      </MotionConfig>
    </LazyMotion>
  );
}
