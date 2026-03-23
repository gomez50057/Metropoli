import styles from "./PimusZmpAbout.module.css";
// import OpinionButton from "@/components/shared/botones/OpinionButton";

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
            La <span className={styles.leadBold}>Zona Metropolitana de Pachuca</span> está conformada por los municipios de <span className={styles.leadBold}>Pachuca de Soto, Mineral de la Reforma, Epazoyucan, Mineral del Monte, San Agustín Tlaxiaca, Zapotlán de Juárez y Zempoala.</span> En este ámbito, el PIMUS-ZMP establece una ruta de acción común orientada a <span className={styles.leadBold}>fortalecer la infraestructura y los servicios de movilidad,</span> promoviendo traslados seguros, incluyentes, resilientes y sustentables, mediante la coordinación intermunicipal y una visión integral del territorio.
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

        <div className={styles.engagementBadge}>
          <h3 className={styles.tituloBtn}>
            <span className="span-doarado">Próximamente</span> disponible el{" "}
            <span className="span-doarado">PIMUS</span>
          </h3>

          <p className={styles.descriptionBtn}>
            Muy pronto podrás consultar y descargar el PIMUS desde este espacio.
          </p>

          {/* <OpinionButton
            mode="link"
            href="https://forms.gle/CNPGfARzoP1sy4nZ7"
          /> */}
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
