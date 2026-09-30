import Image from "next/image";
import styles from "@/features/actualizacion-pozmvm/styles/ParticipacionSection.module.css";

export default function ParticipacionSection() {
  return (
    <section
      id="participacion-ciudadana"
      className={styles.section}
      aria-labelledby="participacion-title"
    >
      <div className={styles.banner}>
        <div className={styles.content}>
          <div className={styles.badge}>
            <span className={styles.badgeIcon}>
              <svg
                viewBox="0 0 48 48"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                focusable="false"
              >
                <circle cx="24" cy="15" r="5.5" />
                <circle cx="9.5" cy="16" r="3.5" />
                <circle cx="38.5" cy="16" r="3.5" />
                <path d="M14 39v-4a10 10 0 0 1 20 0v4H14Z" />
                <path d="M3 33v-2a7 7 0 0 1 10-6.3M45 33v-2a7 7 0 0 0-10-6.3" />
              </svg>
            </span>
            <span>Participación ciudadana</span>
          </div>

          <h2 id="participacion-title" className={styles.title}>
            ¡SÉ PARTE DE LA{" "}
            <span className={styles.titleLastLine}>CONSULTA PÚBLICA!</span>
          </h2>

          <p className={styles.dates}>
            <svg
              viewBox="0 0 32 32"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              focusable="false"
            >
              <rect x="3" y="6" width="26" height="23" rx="1.5" />
              <path d="M9 3v6M23 3v6M3 12h26M8 17h1m6 0h1m6 0h1M8 22h1m6 0h1m6 0h1M8 26h1m6 0h1" />
            </svg>
            <span>
              Del <strong><time dateTime="2026-09-24">24 de septiembre</time></strong>
              <br />
              al <strong><time dateTime="2026-10-24">24 de octubre de 2026</time></strong>
            </span>
          </p>

          <div className={styles.description}>
            <p>
              <strong className={styles.intro}>
                Se llevará a cabo el proceso de Consulta Pública de la Actualización
                del POZMVM.
              </strong>{" "}
              Durante este periodo se realizarán diversos mecanismos de participación
              ciudadana, mediante los cuales{" "}
              <strong><em>
                podrás conocer el contenido del Programa y compartir tus opiniones,
                propuestas y aportaciones.
              </em></strong>
            </p>
          </div>

          <a
            className={styles.button}
            href="/pdf/POZMVM_Consulta_Publica_2026.pdf"
            target="_blank"
            rel="noopener noreferrer"
          >
            Conoce y participa
            <svg
              viewBox="0 0 40 32"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              focusable="false"
            >
              <path d="M3 16h33M26 6l10 10-10 10" />
            </svg>
          </a>
        </div>

        <div className={styles.map}>
          <Image
            src="/img/pozmvm/participacion-mapa-sin-fondo.png"
            alt="Mapa de los municipios del POZMVM en Hidalgo, Estado de México, Ciudad de México y Morelos."
            width={1117}
            height={1408}
            sizes="(max-width: 760px) 90vw, 38vw"
            className={styles.mapImage}
          />
        </div>
      </div>
    </section>
  );
}
