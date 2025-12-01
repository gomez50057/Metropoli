"use client";

import { useEffect, useRef } from 'react';
import dynamic from "next/dynamic";
import styles from './Header.module.css';

// Deshabilita SSR para HeaderAnimation
const HeaderAnimation = dynamic(() => import("../shared/HeaderAnimation"), { ssr: false });

const Header = () => {
  const imgBasePath = "/img/";
  const imgZmSelect = "/img/ZM elige/";

  const txtRef = useRef(null);
  const imgRef = useRef(null);

  useEffect(() => {
    if (txtRef.current) {
      txtRef.current.classList.add(styles.fadeIn);
    }
    if (imgRef.current) {
      imgRef.current.classList.add(styles.fadeIn);
    }
  }, []);

  const setZonaAndScroll = (zona) => {
    localStorage.setItem('selectedZonaMetropolitana', zona);
    const event = new Event('zonaChanged');
    window.dispatchEvent(event);
    window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
  };

  return (
    <section id="header" className={styles.headerContainer}>
      <div className={styles.backgroundSvg} />

      <div className={styles.contentHeader}>
        <div className={styles.headerTxt} ref={txtRef}>
          <HeaderAnimation />
        </div>

        <div className={styles.zonasMetro}>
          <p>¡Elige una Zona Metropolitana! </p>

          <div className={styles.contentCirculeZm}>
            <button className={styles.circuleZm} onClick={() => setZonaAndScroll('ZMP')} aria-label="Zona Metropolitana de Pachuca">
              <img src={`${imgZmSelect}ZMP.jpg`} alt="ZM Pachuca" />
              <span className={styles.tooltip}>ZM de Pachuca</span>
            </button>

            <button className={styles.circuleZm} onClick={() => setZonaAndScroll('ZMTula')} aria-label="Zona Metropolitana de Tula">
              <img src={`${imgZmSelect}ZMTula.webp`} alt="ZM Tula" />
              <span className={styles.tooltip}>ZM de Tula</span>
            </button>

            <button className={styles.circuleZm} onClick={() => setZonaAndScroll('ZMTulancingo')} aria-label="Zona Metropolitana de Tulancingo">
              <img src={`${imgZmSelect}ZMTulancingo.jpg`} alt="ZM Tulancingo" />
              <span className={styles.tooltip}>ZM de Tulancingo</span>
            </button>

            <button className={styles.circuleZm} onClick={() => setZonaAndScroll('ZMVM')} aria-label="Zona Metropolitana del Valle de México">
              <img src={`${imgZmSelect}ZMVM.jpg`} alt="ZM del Valle de México" />
              <span className={styles.tooltip}>ZM del Valle de México</span>
            </button>
          </div>
        </div>

        <div className={styles.headerImg} ref={imgRef}>
          <img src={`${imgBasePath}headerimg.png`} alt="Imagen representativa" className={styles.floatingImg} />
        </div>
      </div>
    </section>
  );
};

export default Header;
