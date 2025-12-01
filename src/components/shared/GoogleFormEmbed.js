'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from './GoogleFormEmbed.module.css';

const GoogleFormEmbed = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className={`${styles.slider} ${isVisible ? styles.slideIn : ''}`}>
      <video autoPlay loop muted className={styles.videoBackground}>
        <source src="/img/GoogleFormEmbed.mp4" type="video/mp4" />
        Tu navegador no soporta videos.
      </video>
      <div className={styles.overlay}></div>
      <div className={styles.content}>
        <Link
          href="https://docs.google.com/forms/d/e/1FAIpQLSfTlloGpmaaKJsAJMnqqQ2sEND3Hn2l5rBEPXvgHIoshzK9hQ/viewform?usp=sharing"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.button}
        >
          Formulario de POZMVM
        </Link>
      </div>
    </div>
  );
};

export default GoogleFormEmbed;
