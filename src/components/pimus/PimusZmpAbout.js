import styles from "./PimusZmpAbout.module.css";
import OpinionButton from "@/components/shared/botones/OpinionButton";

export default function PimusZmpAbout({
}) {
  return (
    <section className={styles.section} aria-labelledby="pimus-title">
      {/* texto */}
      <div className={styles.headerGrid}>
        <h2 id="pimus-title" className={styles.title}>Qué es el <span className={styles.dorado}>PIMUS ZMP</span><span className={styles.subtitle}>El plan metropolitano para movernos mejor.</span></h2>
        <div>
          <p className={styles.lead}>
            <span className={styles.leadBold}>El Plan Integral de Movilidad Urbana Sustentable de la Zona Metropolitana de Pachuca (PIMUS-ZMP)</span> es un <span className={styles.leadBold}>instrumento de planeación</span> para <span className={styles.leadBold}>mejorar la movilidad </span>de forma <span className={styles.leadBold}>sostenible, eficiente y segura</span>. Busca reducir congestión y tiempos de traslado mediante la integración de transporte peatonal, ciclista, público y privado.
          </p>
          <p className={styles.lead}>
            La <span className={styles.leadBold}>Zona Metropolitana de Pachuca </span>incluye <span className={styles.leadBold}>Pachuca de Soto, Mineral de la Reforma, Epazoyucan, Mineral del Monte, San Agustín Tlaxiaca, Zapotlán de Juárez y Zempoala</span>. El PIMUS-ZMP define una ruta común para <span className={styles.leadBold}>fortalecer infraestructura y servicios</span>, impulsando <span className={styles.leadBold}></span>traslados más seguros, incluyentes, resilientes y sustentables.
          </p>
        </div>
      </div>

      {/* Medios */}
      <div className={styles.mediaGrid}>
        {/* Card pequeña con img */}
        <div className={styles.cardSm} aria-hidden="true">
          <img
            src="/img/PIMUS_ZMP/about/card-sm.jpg"
            alt=""
            className={styles.cardImg}
            loading="lazy"
          />
        </div>

        {/* <CtaButton
          primaryTop="Participación"
          primaryBottom="Ciudadana"
          hoverText="¡Participa!"
          href="https://forms.gle/CNPGfARzoP1sy4nZ7"
          openInNewTab={true}
          prefetch={true}
          title="Participación Ciudadana"
          ariaLabel="Ir a Participación Ciudadana en nueva pestaña"
        /> */}

        <div className={styles.engagementBadge}>
          <h3 className={styles.tituloBtn}>
            <span className="span-doarado">Participa</span> en la <span className="span-doarado">Consulta</span>
          </h3>

          <p className={styles.descriptionBtn}>
            <span>Opinión ciudadana </span>
            Tu opinión es clave para fortalecer el PIMUS.
          </p>

          <OpinionButton
            mode="link"
            href="https://forms.gle/CNPGfARzoP1sy4nZ7"
          />
        </div>

        <div className={styles.cardLg} aria-hidden="true">
          <img
            src="/img/PIMUS_ZMP/about/card-lg.jpg"
            alt=""
            className={styles.cardImg}
            loading="lazy"
          />
        </div>
        <div className={styles.dot} />
      </div>
    </section>
  );
}
