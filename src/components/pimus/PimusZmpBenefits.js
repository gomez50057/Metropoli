import styles from "./PimusZmpBenefits.module.css";

const defaultBenefits = [
  {
    title: "Transporte moderno y accesible",
    text:
      "Impulsa la modernización del transporte público para hacerlo más accesible y digno, con rutas mejor conectadas y menores tiempos de traslado.",
  },
  {
    title: "Menos contaminación, mejor aire",
    text:
      "Reduce la contaminación ambiental, mejora la calidad del aire y favorece una movilidad más saludable para la población.",
  },
  {
    title: "Movilidad incluyente",
    text:
      "Garantiza el derecho a moverse de forma segura y cómoda, priorizando a niñas y niños, adultos mayores y personas con discapacidad.",
  },
  {
    title: "Impulso económico metropolitano",
    text:
      "Una movilidad eficiente fortalece la productividad, el comercio local y la competitividad urbana en toda la metrópoli.",
  },
  {
    title: "Desarrollo sustentable a futuro",
    text:
      "Sienta bases para un crecimiento urbano equilibrado, con decisiones públicas centradas en sostenibilidad y calidad de vida.",
  },
];

export default function PimusZmpBenefits({
  items = defaultBenefits,

  className = "",
}) {
  return (
    <section
      className={`${styles.section} ${className}`}
      aria-labelledby="benefits-title"
    >
      <div className={styles.bgBlanco}></div>

      <header className={styles.header}>
        <h2 id="benefits-title" className={styles.title}>
          Lo que el <span className={styles.spanVino}>PIMUS</span>{" "}
          <span className={styles.spanDorado}>trae para ti</span>
        </h2>
        <p className={styles.subtitle}>Por una movilidad más segura, incluyente y eficiente.</p>
      </header>

      <div className={styles.grid} role="list">
        {items.map((b, i) => (
          <article
            key={`${b.title}-${i}`}
            className={styles.card}
            role="listitem"
          >
            <h3 className={styles.cardTitle}>{b.title}</h3>
            <p className={styles.cardText}>{b.text}</p>
          </article>
        ))}
      </div>
      
      <footer className={styles.footer}>
        <p className={styles.footerText}>Este plan se alinea con los{" "}
          <strong>Objetivos de Desarrollo Sostenible (ODS)</strong> y las políticas
          nacionales de movilidad urbana.</p>
      </footer>
    </section>
  );
}
