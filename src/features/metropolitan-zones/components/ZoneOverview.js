import Image from "next/image";
import Link from "next/link";
import ZoneMembersSection from "@/components/shared/ZoneMembersSection";
import { getPreposicion, getTextoObjetivo } from "@/data/home";
import { renderParagraphsWithStyles } from "@/data/blogData";
import { zoneProfiles } from "../data/zoneProfiles";
import styles from "./ZoneOverview.module.css";

function ArrowIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 12h16m-6-6 6 6-6 6" /></svg>;
}

function PinIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></svg>;
}

export default function ZoneOverview({ zone, children }) {
  const profile = zoneProfiles[zone];
  const total = profile.entities.reduce((sum, entity) => sum + entity.count, 0);
  const isInterstate = profile.entities.length > 1;
  const unit = isInterstate ? "Municipios y alcaldías" : "Municipios";

  return (
    <div className={styles.page}>
      <div className={styles.topline}>
        <Link href="/" className={styles.backLink}>Inicio <span aria-hidden="true">/</span> Zonas Metropolitanas</Link>
        <nav className={styles.zoneNav} aria-label="Explorar zonas metropolitanas">
          {Object.entries(zoneProfiles).map(([key, item]) => (
            <Link key={key} href={item.href} aria-current={key === zone ? "page" : undefined}>{item.name}</Link>
          ))}
        </nav>
      </div>

      <section className={styles.hero} aria-labelledby="zone-title">
        <div className={styles.heroCopy}>
          <h1 id="zone-title"><span className={styles.headingPrefix}>Zona Metropolitana {getPreposicion(zone)}</span> <span className={styles.zoneName}>{profile.name}</span></h1>
          <p className={styles.heroLead}>{profile.intro}</p>
          <div className={styles.heroActions}>
            <a href="#planes-y-proyectos" className={styles.primaryButton}>Explorar iniciativas <ArrowIcon /></a>
            <a href="#territorio" className={styles.secondaryButton}>Conocer el territorio <span aria-hidden="true">↓</span></a>
          </div>
          <p className={styles.location}><PinIcon />{profile.location}</p>
        </div>
        <figure className={styles.heroPhoto}>
          <Image src={encodeURI(profile.image)} alt={profile.imageAlt} fill sizes="(max-width: 800px) 92vw, 46vw" preload className={styles.photo} />
          <figcaption><span className={styles.photoKicker}>Una mirada al territorio</span>{profile.caption}</figcaption>
          <span className={styles.photoCorner} aria-hidden="true"><PinIcon /></span>
        </figure>
      </section>

      <dl className={styles.stats} aria-label="La zona en cifras">
        <div><dt>{unit}</dt><dd>{String(total).padStart(2, "0")}<span className={styles.statMark} aria-hidden="true">↗</span></dd></div>
        <div><dt>{isInterstate ? "Entidades federativas" : "Entidad federativa"}</dt><dd>{String(profile.entities.length).padStart(2, "0")}</dd></div>
        <div><dt>{profile.scopeLabel}</dt><dd className={styles.scopeValue}>{profile.scope}</dd></div>
      </dl>

      <section id="territorio" className={styles.territory} aria-labelledby="territory-title">
        <div className={styles.territoryCopy}>
          <p className={styles.eyebrow}>01 / Nuestro territorio</p>
          <h2 id="territory-title">Más que límites,<br /><em>un futuro compartido.</em></h2>
          <div className={styles.description}>{renderParagraphsWithStyles(getTextoObjetivo(zone))}</div>
          <p className={styles.focus}><span aria-hidden="true" />{profile.focus}</p>
        </div>

        <div className={styles.territoryCard}>
          <div className={styles.territoryCardHeading}><span className={styles.smallPin}><PinIcon /></span><div><p>Así se integra</p><h3>{isInterstate ? "Cuatro entidades conectadas" : `${total} municipios, una metrópoli`}</h3></div></div>
          {isInterstate ? (
            <>
              <p className={styles.chartCaption}>Distribución de los {total} municipios y alcaldías por entidad.</p>
              <div className={styles.distribution} role="img" aria-label={profile.entities.map((entity) => `${entity.name}: ${entity.count}`).join("; ")}>
                {profile.entities.map((entity) => <span key={entity.name} style={{ width: `${entity.count / total * 100}%`, backgroundColor: entity.color }} />)}
              </div>
              <ul className={styles.entityList}>{profile.entities.map((entity) => (
                <li key={entity.name}><span className={styles.legendDot} style={{ backgroundColor: entity.color }} /><span>{entity.name}</span><strong>{entity.count}</strong></li>
              ))}</ul>
            </>
          ) : (
            <ol className={styles.municipalityList}>{profile.municipalities.map((municipality, index) => (
              <li key={municipality}><span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>{municipality}</li>
            ))}</ol>
          )}
          <p className={styles.territoryNote}>La coordinación empieza por reconocer lo que compartimos.</p>
        </div>
      </section>

      <section id="planes-y-proyectos" className={styles.projects} aria-labelledby="projects-title">
        <div className={styles.sectionHeading}><div><p className={styles.eyebrow}>02 / Planeación y comunidad</p><h2 id="projects-title">Conoce lo que <em>nos mueve.</em></h2></div><p>Acércate a los instrumentos, experiencias y espacios de participación metropolitana.</p></div>
        <div className={styles.projectGrid}>{profile.projects.map((project, index) => (
          <Link href={project.href} key={project.href} className={styles.projectCard}>
            <div className={styles.projectTop}><span>{project.tag}</span><span className={styles.projectNumber}>0{index + 1}</span></div>
            <h3>{project.title}</h3><p>{project.description}</p><span className={styles.projectAction}>Conocer más <ArrowIcon /></span>
          </Link>
        ))}</div>
      </section>

      {children && <section className={styles.commissions} aria-labelledby="commissions-title"><div className={styles.sectionHeading}><div><p className={styles.eyebrow}>03 / Trabajo conjunto</p><h2 id="commissions-title">Comisiones <em>metropolitanas.</em></h2></div><p>Espacios de coordinación para atender los temas que conectan a la metrópoli.</p></div>{children}</section>}

      <ZoneMembersSection zone={zone} className={styles.membersSection} />

      <aside className={styles.bottomBanner}><div><p className={styles.eyebrow}>Sigue explorando</p><h2>La metrópoli también <em>se vive contigo.</em></h2></div><Link href="/#mapa-interactivo">Explorar el mapa interactivo <ArrowIcon /></Link></aside>
    </div>
  );
}
