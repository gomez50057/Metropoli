"use client";

import styles from "./PimusDobleSeccion.module.css";

function renderTextWithBreaks(text) {
  return String(text)
    .split(/\n{2,}/)
    .map((block, pIndex) => {
      const lines = block.split(/\n/);
      return (
        <p key={pIndex}>
          {lines.map((line, lIndex) => (
            <span key={lIndex}>
              {line}
              {lIndex < lines.length - 1 && <br />}
            </span>
          ))}
        </p>
      );
    });
}

export default function PimusDobleSeccion({
  // Placeholders (cámbialos por tus rutas reales)
  topOuterImg = "/img/PIMUS_ZMP/PimusDobleSeccion/topOuterImg.jpg",
  topInnerImg = "/img/PIMUS_ZMP/PimusDobleSeccion/topInnerImg.jpg",
  bottomInnerImg = "/img/PIMUS_ZMP/PimusDobleSeccion/bottomInnerImg.jpg",
  bottomOuterImg = "/img/PIMUS_ZMP/PimusDobleSeccion/bottomOuterImg.jpg",
}) {
  return (
    <section className={styles.wrap}>
      {/* -------- Sección superior: [Imagen exterior] [Card con borde + imagen interna a la derecha] -------- */}
      <div className={`${styles.row} ${styles.rowTop}`}>
        <figure className={styles.outerImgBox}>
          <img
            className={styles.outerImg}
            src={topOuterImg}
            alt=""
            loading="lazy"
            decoding="async"
          />
        </figure>

        <article className={`${styles.card} ${styles.hasRightImg}`}>
          <div className={`${styles.sideImg} ${styles.sideRight}`}>
            <img src={topInnerImg} alt="" loading="lazy" decoding="async" />
          </div>

          <header className={styles.cardHeader}>
            <h3 className={styles.cardTitle}><span className="span-doarado">Un Plan para Movernos Mejor</span> - ¿Por qué un<span className="span-vino"> PIMUS ZMP?</span></h3>
          </header>

          <div className={styles.cardBody}>
            <p>Conscientes de los desafíos que enfrentan las y los habitantes de la <span className={styles.resaltar}>Zona Metropolitana de Pachuca</span> — <span className={styles.resaltar}>congestión vehicular, contaminación y largos tiempos de traslado diarios</span>— se impulsa una <span className={styles.resaltar}>Política Pública de Movilidad</span>orientada a la sostenibilidad, la accesibilidad y la eficiencia del transporte urbano. En este marco nace el <span className={styles.resaltar}>Plan Integral de Movilidad Urbana Sustentable (PIMUS)</span>, cuyo objetivo es <span className={styles.resaltar}>mejorar y transformar la movilidad metropolitana</span> mediante la creación y optimización de rutas, la identificación de nuevas necesidades viales, la organización de los flujos de tránsito y el fortalecimiento de la circulación entre vehículos, para lograr <span className={styles.resaltar}>traslados más seguros, ágiles y ordenados.</span></p>
          </div>
        </article>
      </div>

      {/* -------- Sección inferior: [Card con borde + imagen interna a la izquierda] [Imagen exterior] -------- */}
      <div className={`${styles.row} ${styles.rowBottom}`}>
        <article className={`${styles.card} ${styles.hasLeftImg}`}>
          <div className={`${styles.sideImg} ${styles.sideLeft}`}>
            <img src={bottomInnerImg} alt="" loading="lazy" decoding="async" />
          </div>

          <header className={styles.cardHeader}>
            <h3 className={`${styles.cardTitle} ${styles.titleRight}`}><span className="span-doarado">Red Metropolitana: </span><span className="span-vino">Transporte Público, bici y Peatón</span></h3>
          </header>

          <div className={styles.cardBody}>
            <p>El <span className={styles.resaltar}>Plan Integral de Movilidad Urbana Sustentable</span> de la <span className={styles.resaltar}>Zona Metropolitana de Pachuca</span> tiene un alcance regional, técnico y estratégico, orientado a <span className={styles.resaltar}>transformar</span> la manera en que se <span className={styles.resaltar}>planifican, gestionan y utilizan</span> los sistemas de transporte y movilidad en los municipios que integran la metrópoli.</p>

            <p>El alcance territorial del plan comprende a los municipios que forman parte de la Zona Metropolitana de Pachuca, considerando sus <span className={styles.resaltar}>interconexiones urbanas, económicas y funcionales</span>. En este sentido, el PIMUS busca <span className={styles.resaltar}>coordinar acciones y proyectos entre municipios</span>, estableciendo una <span className={styles.resaltar}>red metropolitana</span> de <span className={styles.resaltar}>transporte público, infraestructura ciclista, espacios peatonales y sistemas de movilidad integrados.</span></p>
          </div>
        </article>

        <figure className={styles.outerImgBox}>
          <img
            className={styles.outerImg}
            src={bottomOuterImg}
            alt=""
            loading="lazy"
            decoding="async"
          />
        </figure>
      </div>
    </section>
  );
}
