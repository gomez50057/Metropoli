import Link from 'next/link';
import { getPreposicion, getTituloZona } from '@/data/home';
import styles from './ZoneMembersSection.module.css';

export default function ZoneMembersSection({ zone, className = '' }) {
  const zoneName = `Zona Metropolitana ${getPreposicion(zone)} ${getTituloZona(zone)}`;

  return (
    <section className={`${styles.section} ${className}`} aria-label={`Integrantes de la ${zoneName}`}>
      <svg className={styles.landscape} viewBox="0 0 1200 100" aria-hidden="true">
        <path d="M0 100C180 100 280 36 470 48S765 108 900 90 1080 10 1200 12V100Z" fill="#e5d6b9" opacity=".45" />
        <path d="M200 100C390 84 456 64 610 76S865 114 1010 70 1145 34 1200 30V100Z" fill="#f1e8d8" opacity=".7" />
        <path d="M400 100C480 62 535 28 610 28S735 64 800 64S940 76 1020 42S1140 12 1200 12" fill="none" stroke="#b99a60" strokeWidth="2" />
        <g fill="#fcfaf5" stroke="#bc9d65" strokeWidth="3">
          <circle cx="610" cy="28" r="7" />
          <circle cx="800" cy="64" r="7" />
          <circle cx="1020" cy="42" r="7" />
        </g>
      </svg>
      <div className={styles.icon} aria-hidden="true">
        <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="24" cy="15" r="6" />
          <path d="M14 38v-4a10 10 0 0 1 20 0v4H14Z" />
          <path d="M12 12a5 5 0 0 0 0 10M36 12a5 5 0 0 1 0 10M10 27a8 8 0 0 0-5 7v3h4M38 27a8 8 0 0 1 5 7v3h-4" />
        </svg>
      </div>
      <div className={styles.copy}>
        <p className={styles.eyebrow}>Coordinación metropolitana</p>
        <h2>Conoce a sus <em>integrantes.</em></h2>
        <p>Consulta quiénes participan en la planeación y el desarrollo de la <strong>{zoneName}.</strong></p>
      </div>
      <Link href={`/integrantes?zona=${zone}`} className={styles.link} aria-label={`Ver integrantes de la ${zoneName}`}>
        Ver integrantes
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 12h16m-6-6 6 6-6 6" /></svg>
      </Link>
    </section>
  );
}
