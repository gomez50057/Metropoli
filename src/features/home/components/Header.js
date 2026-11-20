"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import styles from "./Header.module.css";

const HeaderAnimation = dynamic(() => import("@/components/shared/HeaderAnimation"), { ssr: false });

const DEFAULT_ZONA = "ZMVM";
const AVAILABLE_ZONES = ["ZMVM", "ZMP", "ZMTulancingo"];

const Header = () => {
  const imgBasePath = "/img/";
  const imgZmSelect = "/img/ZM%20elige/";

  const [zonaActiva, setZonaActiva] = useState(DEFAULT_ZONA);

  const txtRef = useRef(null);
  const imgRef = useRef(null);

  useEffect(() => {
    // Animación de entrada
    if (txtRef.current) txtRef.current.classList.add(styles.fadeIn);
    if (imgRef.current) imgRef.current.classList.add(styles.fadeIn);

    // Zona por defecto / persistencia
    const stored = localStorage.getItem("selectedZonaMetropolitana");
    const zonaInicial = AVAILABLE_ZONES.includes(stored) ? stored : DEFAULT_ZONA;

    const syncZona = () => {
      const selected = localStorage.getItem("selectedZonaMetropolitana");
      setZonaActiva(AVAILABLE_ZONES.includes(selected) ? selected : DEFAULT_ZONA);
    };

    syncZona();
    window.addEventListener("zonaChanged", syncZona);

    // Si no había nada guardado, lo guardamos
    if (stored !== zonaInicial) {
      localStorage.setItem("selectedZonaMetropolitana", zonaInicial);
    }

    // Notificar al resto de componentes
    window.dispatchEvent(new Event("zonaChanged"));
    return () => window.removeEventListener("zonaChanged", syncZona);
  }, []);

  const setZonaAndScroll = (zona) => {
    setZonaActiva(zona);
    localStorage.setItem("selectedZonaMetropolitana", zona);
    window.dispatchEvent(new Event("zonaChanged"));
    document.getElementById("mapa-interactivo")?.scrollIntoView({ behavior: "smooth" });
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
              <img
                src={`${imgZmSelect}ZMP.webp`}
                srcSet={`${imgZmSelect}ZMP-256.webp 256w, ${imgZmSelect}ZMP.webp 512w`}
                sizes="(max-width: 1257px) 88px, (max-width: 1828px) 7vw, 128px"
                width={512}
                height={512}
                decoding="async"
                alt="ZM Pachuca"
              />
              <span className={styles.tooltip}>ZM de Pachuca</span>
            </button>

            <button
              className={circleClass("ZMTulancingo")}
              onClick={() => setZonaAndScroll("ZMTulancingo")}
              aria-label="Zona Metropolitana de Tulancingo"
              aria-pressed={zonaActiva === "ZMTulancingo"}
              type="button"
            >
              <img
                src={`${imgZmSelect}ZMTulancingo-256.webp`}
                srcSet={`${imgZmSelect}ZMTulancingo-256.webp 256w, ${imgZmSelect}ZMTulancingo.jpg 1200w`}
                sizes="(max-width: 1257px) 88px, (max-width: 1828px) 7vw, 128px"
                decoding="async"
                alt="ZM Tulancingo"
              />
              <span className={styles.tooltip}>ZM de Tulancingo</span>
            </button>

            <button
              className={circleClass("ZMVM")}
              onClick={() => setZonaAndScroll("ZMVM")}
              aria-label="Zona Metropolitana del Valle de México"
              aria-pressed={zonaActiva === "ZMVM"}
              type="button"
            >
              <img
                src={`${imgZmSelect}ZMVM-256.webp`}
                srcSet={`${imgZmSelect}ZMVM-256.webp 256w, ${imgZmSelect}ZMVM.jpg 1200w`}
                sizes="(max-width: 1257px) 88px, (max-width: 1828px) 7vw, 128px"
                decoding="async"
                alt="ZM del Valle de México"
              />
              <span className={styles.tooltip}>ZM del Valle de México</span>
            </button>
          </div>
        </div>

        <div className={styles.headerImg} ref={imgRef}>
          <img
            src={`${imgBasePath}headerimg.webp`}
            srcSet={`${imgBasePath}headerimg-640.webp 640w, ${imgBasePath}headerimg.webp 1385w`}
            sizes="(max-width: 577px) 90vw, (max-width: 768px) 520px, (max-width: 1024px) 40vw, 48vw"
            width={1385}
            height={1145}
            loading="eager"
            fetchPriority="high"
            decoding="async"
            alt="Imagen representativa"
            className={styles.floatingImg}
          />
        </div>
      </div>
    </section>
  );
};

export default Header;
