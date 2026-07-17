import Image from "next/image";
import styles from "@/features/actualizacion-pozmvm/styles/FeaturedNews.module.css";

const imageSrc = "/img/noticias/ZMVM/Así se vivió la Consulta Indígena en Hidalgo_22052026.jpeg";
const articleHref = "/noticias/asi-se-vivio-la-consulta-indigena-en-hidalgo";

function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <rect x="3.5" y="5" width="17" height="15.5" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path d="M7 3.5v4M17 3.5v4M3.5 9.5h17" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M7.5 13h.01M12 13h.01M16.5 13h.01M7.5 16.5h.01M12 16.5h.01" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M4 12h15M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function LeafIcon() {
  return (
    <svg viewBox="0 0 40 40" aria-hidden="true" focusable="false">
      <path d="M20 35V21M20 21C12 20 8 15 8 8c7 0 12 4 12 13ZM20 26c8-1 12-6 12-13-7 0-12 4-12 13Z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M15 35h10" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function PeopleIcon() {
  return (
    <svg viewBox="0 0 40 40" aria-hidden="true" focusable="false">
      <circle cx="20" cy="13" r="4" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="9.5" cy="17" r="3.2" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="30.5" cy="17" r="3.2" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path d="M12 31c0-5 3.3-8 8-8s8 3 8 8M3.5 30c0-3.8 2.2-6 6-6 1.4 0 2.6.3 3.6 1M36.5 30c0-3.8-2.2-6-6-6-1.4 0-2.6.3-3.6 1" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function MountainIcon() {
  return (
    <svg viewBox="0 0 40 40" aria-hidden="true" focusable="false">
      <path d="m4 31 11.5-17L22 22l3-4 11 13H4Z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="m12 19 3.5-5 2.8 4M25 18l2-3 2 3" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function CornIcon() {
  return (
    <svg viewBox="0 0 40 40" aria-hidden="true" focusable="false">
      <path d="M20 5c-3.1 1.6-4.4 4.8-4 9.6.3 3.9 1.8 6.7 4 8.5 2.2-1.8 3.7-4.6 4-8.5.4-4.8-.9-8-4-9.6Z" fill="none" stroke="#c18a2f" strokeWidth="1.55" strokeLinejoin="round" />
      <path d="M18.4 9.2h3.2M18 12.5h4M18 15.8h4M18.7 19.1h2.6M20 7.5v13.8" fill="none" stroke="#c18a2f" strokeWidth="1.25" strokeLinecap="round" />
      <path d="M20 34V21M20 29c-5.5.2-9.2-2.7-10.4-8.3 5.4-.3 9.3 2.4 10.4 8.3ZM20 29c5.5.2 9.2-2.7 10.4-8.3-5.4-.3-9.3 2.4-10.4 8.3Z" fill="none" stroke="#21462d" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function WaterIcon() {
  return (
    <svg viewBox="0 0 40 40" aria-hidden="true" focusable="false">
      <path d="M5 13c3 0 3-2 6-2s3 2 6 2 3-2 6-2 3 2 6 2 3-2 6-2" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M5 20c3 0 3-2 6-2s3 2 6 2 3-2 6-2 3 2 6 2 3-2 6-2M5 27c3 0 3-2 6-2s3 2 6 2 3-2 6-2 3 2 6 2 3-2 6-2" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

const thematicIcons = [LeafIcon, PeopleIcon, MountainIcon, CornIcon, WaterIcon];

export default function FeaturedNews() {
  return (
    <section className={styles.section} aria-labelledby="featured-news-title">
      <article className={styles.card}>
        <div className={styles.content}>
          <div className={styles.decorativePattern} aria-hidden="true" />
          <div className={styles.copy}>
            <p className={styles.eyebrow}>Noticia destacada</p>
            <h2 id="featured-news-title">Así se vivió la Consulta Indígena en Hidalgo</h2>

            <div className={styles.date}>
              <CalendarIcon />
              <span>22 de mayo, 2026</span>
              <span className={styles.dateRule} aria-hidden="true" />
            </div>

            <p className={styles.description}>
              Comunidades indígenas del municipio de Tula de Allende participaron en la Actualización del POZMVM.
            </p>

            <a className={styles.readMore} href={articleHref} target="_blank" rel="noopener noreferrer">
              <span>Leer más</span>
              <ArrowIcon />
            </a>

            <div className={styles.thematicIcons} aria-label="Temas de la noticia">
              {thematicIcons.map((Icon, index) => (
                <Icon key={index} />
              ))}
            </div>
          </div>
        </div>

        <div className={styles.imageWrap}>
          <Image
            className={styles.image}
            src={imageSrc}
            alt="Personas participando en la Consulta Indígena en Hidalgo"
            fill
            sizes="(max-width: 639px) 100vw, 52vw"
            priority
          />
        </div>
      </article>
    </section>
  );
}
