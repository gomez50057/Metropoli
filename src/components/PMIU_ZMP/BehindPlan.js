"use client";

import styles from "@/styles/PMIU_ZMP/BehindPlan.module.css";

export default function BehindPlan() {
  return (
    <section className={styles.container}>

      <div className={styles.imageWrapper}>
        <img
          src="/img/PMIU_ZMP/behind-plan.png"
          alt="Personas revisando documentos"
          className={styles.image}
        />
      </div>

      <div className={styles.textWrapper}>
        <h2>¿Qué es la <span className="span-doarado">Imagen Urbana?</span></h2>
        <p className={styles.paragraph}>
          &quot;La imagen urbana se define como la percepción colectiva que los individuos
          construyen del entorno urbano a partir de la experiencia visual, espacial y
          simbólica del mismo.&quot;
          <span className={styles.cardLabel}>Kevin Lynch (1960), The Image of the City.</span>
        </p>
      </div>

      <div className={styles.textWrapper}>
        <h2>Lo que <span className="span-doarado">pasa detrás</span> del <span className="span-doarado">Plan</span></h2>
        <p className={styles.subTitule}><span>Fase de diagnóstico:</span> Escuchamos y analizamos a la Metropoli.</p>
        <p className={styles.paragraph}>
          Realizamos la recopilación de información y percepciones sobre las características arquitectónicas, urbanísticas y socioeconómicas de la Zona Metropolitana de Pachuca.
          El objetivo es conocer la visión de la ciudadanía y analizar los modelos culturales, arquitectónicos y naturales existentes, con el fin de identificar las áreas que requieren atención e intervención.
        </p>
      </div>

    </section>
  );
}
