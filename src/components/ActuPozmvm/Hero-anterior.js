"use client";
import styles from "@/styles/ActuPozmvm/Hero.module.css";

export default function Hero() {
  return (
    <header className={styles.hero}>
      <div className={styles.media} aria-hidden="true" />
      <div className={styles.container}>
        <p className={styles.kicker}>POZMVM</p>
        <h1 className={styles.title}><span className="span-doarado">Actualización</span> del <span className="span-vino">Programa</span> de <span className="span-vino">Ordenación</span> de la <span className="span-vino">Zona Metropolitana</span> del <span className="span-doarado">Valle de México</span> </h1>
      </div>
    </header>
  );
}

<span className="span-vino"></span>