"use client";

import React, { useState, useEffect } from "react";
import {
  LazyMotion,
  domAnimation,
  m,
  MotionConfig,
  useReducedMotion,
  AnimatePresence,
} from "framer-motion";
import styles from "@/styles/ActuPozmvm/SplitSection.module.css";

export default function SplitSection() {
  const prefersReduced = useReducedMotion();
  const [isOpen, setIsOpen] = useState(false);

  const mapSrc = "/img/pozmvm/map.jpg";
  const mapAlt = "Mapa de la Zona Metropolitana del Valle de México (ZMVM)";

  // Variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08, when: "beforeChildren" },
    },
  };

  const fadeUp = {
    hidden: { y: 16, opacity: 0 },
    show: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 70, damping: 16 },
    },
  };

  const card = {
    hidden: { opacity: 0, scale: 0.95 },
    show: {
      opacity: 1,
      scale: 1,
      transition: { type: "spring", stiffness: 80, damping: 18 },
    },
  };

  // Hover/focus sólo si no hay reduced motion
  const hoverCard = prefersReduced
    ? {}
    : {
      scale: 1.02,
      rotate: -0.4,
      transition: { type: "spring", stiffness: 200, damping: 14 },
    };

  const openLightbox = () => setIsOpen(true);
  const closeLightbox = () => setIsOpen(false);

  // Cerrar con tecla Escape
  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        closeLightbox();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

  return (
    <LazyMotion features={domAnimation}>
      <MotionConfig reducedMotion="user">
        <section className={styles.section}>
          <m.div
            className={styles.split}
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{
              once: true,
              amount: 0.25,
              margin: "0px 0px -10% 0px",
            }}
          >
            <m.div className={styles.text} variants={fadeUp}>
              <h2 className={styles.titule}>¿Qué es el <span className="span-doarado">POZMVM?</span></h2>

              <m.p className={styles.lead} variants={fadeUp}>
                La <span className={styles.bold}>actualización del Programa de Ordenación de la Zona Metropolitana del Valle de México (POZMVM)</span> es un <span className={styles.bold}>proceso de revisión, rediseño y fortalecimiento del instrumento de planeación territorial</span>, que busca pautas para <span className={styles.bold}>ordenar el crecimiento urbano y el desarrollo de la metrópoli</span>. Su objetivo establecer estrategias generales para el desarrollo territorial del Valle de México, se concibe como el instrumento intermedio entre lo dispuesto por el Programa Nacional de Desarrollo Urbano y los Programas de Desarrollo Urbano de las diferentes entidades que integran la ZMVM (EDOMEX, CDMX, Hidalgo), a fin de impulsar una verdadera gobernanza, enfrentando los principales retos urbanos de forma inclusiva, efectiva y colaborativa.
              </m.p>

              <m.p className={styles.lead} variants={fadeUp}>
                Este proceso de actualización busca articular un <span className={styles.bold}>ordenamiento   metropolitano moderno, inclusivo y sostenible</span>, en cumplimiento con la Ley General de Asentamientos Humanos, Ordenamiento Territorial y Desarrollo Urbano (LGAHOTDU).
              </m.p>

              <m.p className={styles.lead} variants={fadeUp}>
                Su área de estudio, obedece a la <span className={styles.bold}>reciente delimitación de la   ZMVM, conformada por 84 municipios (59 en el Estado de México,   16 en la Ciudad de México, 8 en el Estado de Hidalgo y 1 en el   Estado de Morelos)</span>.
              </m.p>
            </m.div>

            <m.aside
              className={styles.media}
              variants={card}
              whileHover={hoverCard}
              whileFocus={hoverCard}
              tabIndex={0}
              aria-label="Mapa de la ZMVM, haz clic para ampliarlo"
              onClick={openLightbox}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  openLightbox();
                }
              }}
            >
              <m.img
                className={styles.mediaImg}
                src={mapSrc}
                alt={mapAlt}
                loading="lazy"
                decoding="async"
                draggable="false"
                variants={{
                  hidden: { opacity: 0 },
                  show: {
                    opacity: 1,
                    transition: { delay: 0.05 },
                  },
                }}
              />
              <m.p className={styles.caption} variants={fadeUp}>
                Mapa de la ZMVM (haz clic para ampliar)
              </m.p>
            </m.aside>
          </m.div>

          {/* Lightbox / overlay */}
          <AnimatePresence>
            {isOpen && (
              <m.div
                className={styles.overlay}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={closeLightbox}
              >
                <m.div
                  className={styles.overlayInner}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 140,
                    damping: 18,
                  }}
                  onClick={(e) => e.stopPropagation()}
                  role="dialog"
                  aria-modal="true"
                  aria-label="Mapa ampliado de la ZMVM"
                >
                  <button
                    type="button"
                    className={styles.close}
                    onClick={closeLightbox}
                    aria-label="Cerrar mapa ampliado"
                  >
                    ×
                  </button>

                  <img
                    src={mapSrc}
                    alt={mapAlt}
                    className={styles.overlayImg}
                    draggable="false"
                  />

                  <p className={styles.overlayCaption}>Mapa de la ZMVM</p>
                </m.div>
              </m.div>
            )}
          </AnimatePresence>
        </section>
      </MotionConfig>
    </LazyMotion>
  );
}
