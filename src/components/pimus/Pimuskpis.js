import styles from "./Pimuskpis.module.css";

export default function Pimuskpis({
  kpis = [
    { value: "13,600+ km", label: "Recorre el sistema Tuzobús en un sólo día." },
    { value: "11%", label: "De hogares de la ZMP cuentan con una bicicleta." },
    { value: "38.5%", label: "De hogares de la ZMP cuentan con un automóvil." },
    { value: "49.2 millones de litros", label: "Consumen los carros particulares en la ZMP; el Tuzobús 1.3 millones." },
    { value: "192,698", label: "Viajes se realizan a diario en la hora pico dentro de la ZMP." },
  ],
}) {
  return (
    <section className={styles.section} aria-labelledby="pimus-title">
      <h2 id="pimus-title" className={styles.title}>
        Así se <span className={styles.spanVino}>mueve</span> la <span className={styles.spanDorado}>ZMP</span> <span className={styles.spanVino}>hoy</span>
      </h2>
      <p className={styles.subtitle}>
        Algunos datos clave sobre cómo nos movemos en la Zona Metropolitana de Pachuca.
      </p>

      <div className={styles.kpis}>
        {kpis.map((k, i) => (
          <div key={i} className={styles.kpi}>
            <strong className={styles.kpiValue}>{k.value}</strong>
            <span className={styles.kpiLabel}>{k.label}</span>
          </div>
        ))}
      </div>
    </section>        
  );
}
