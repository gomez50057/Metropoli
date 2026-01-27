"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import styles from "./Header.module.css";

const HeaderAnimation = dynamic(() => import("../shared/HeaderAnimation"), { ssr: false });

const DEFAULT_ZONA = "ZMVM";

const Header = () => {
  const imgBasePath = "/img/";
  const imgZmSelect = "/img/ZM elige/";

  const [zonaActiva, setZonaActiva] = useState(DEFAULT_ZONA);

  const txtRef = useRef(null);
  const imgRef = useRef(null);

  useEffect(() => {
    // Animación de entrada
    if (txtRef.current) txtRef.current.classList.add(styles.fadeIn);
    if (imgRef.current) imgRef.current.classList.add(styles.fadeIn);

    // Zona por defecto / persistencia
    const stored = localStorage.getItem("selectedZonaMetropolitana");
    const zonaInicial = stored || DEFAULT_ZONA;

    setZonaActiva(zonaInicial);

    // Si no había nada guardado, lo guardamos
    if (!stored) {
      localStorage.setItem("selectedZonaMetropolitana", zonaInicial);
    }

    // Notificar al resto de componentes
    window.dispatchEvent(new Event("zonaChanged"));
  }, []);

  const setZonaAndScroll = (zona) => {
    setZonaActiva(zona);
    localStorage.setItem("selectedZonaMetropolitana", zona);
    window.dispatchEvent(new Event("zonaChanged"));
    window.scrollTo({ top: window.innerHeight, behavior: "smooth" });
  };

  const circleClass = (zona) =>
    `${styles.circuleZm} ${zonaActiva === zona ? styles.circuleZmActive : ""}`;

  return (
    <section id="header" className={styles.headerContainer}>
      <div className={styles.backgroundSvg} />

      <div className={styles.contentHeader}>
        <div className={styles.headerTxt} ref={txtRef}>
          <HeaderAnimation />
        </div>

        <div className={styles.zonasMetro}>
          <p>¡Elige una Zona Metropolitana!</p>

          <div className={styles.contentCirculeZm}>
            <button
              className={circleClass("ZMP")}
              onClick={() => setZonaAndScroll("ZMP")}
              aria-label="Zona Metropolitana de Pachuca"
              aria-pressed={zonaActiva === "ZMP"}
              type="button"
            >
              <img src={`${imgZmSelect}ZMP.jpg`} alt="ZM Pachuca" />
              <span className={styles.tooltip}>ZM de Pachuca</span>
            </button>

            <button
              className={circleClass("ZMTula")}
              onClick={() => setZonaAndScroll("ZMTula")}
              aria-label="Zona Metropolitana de Tula"
              aria-pressed={zonaActiva === "ZMTula"}
              type="button"
            >
              <img src={`${imgZmSelect}ZMTula.webp`} alt="ZM Tula" />
              <span className={styles.tooltip}>ZM de Tula</span>
            </button>

            <button
              className={circleClass("ZMTulancingo")}
              onClick={() => setZonaAndScroll("ZMTulancingo")}
              aria-label="Zona Metropolitana de Tulancingo"
              aria-pressed={zonaActiva === "ZMTulancingo"}
              type="button"
            >
              <img src={`${imgZmSelect}ZMTulancingo.jpg`} alt="ZM Tulancingo" />
              <span className={styles.tooltip}>ZM de Tulancingo</span>
            </button>

            <button
              className={circleClass("ZMVM")}
              onClick={() => setZonaAndScroll("ZMVM")}
              aria-label="Zona Metropolitana del Valle de México"
              aria-pressed={zonaActiva === "ZMVM"}
              type="button"
            >
              <img src={`${imgZmSelect}ZMVM.jpg`} alt="ZM del Valle de México" />
              <span className={styles.tooltip}>ZM del Valle de México</span>
            </button>
          </div>
        </div>

        <div className={styles.headerImg} ref={imgRef}>
          <img
            src={`${imgBasePath}headerimg.png`}
            alt="Imagen representativa"
            className={styles.floatingImg}
          />
        </div>
      </div>
    </section>
  );
};

export default Header;