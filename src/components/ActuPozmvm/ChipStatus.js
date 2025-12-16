import styles from "@/styles/ActuPozmvm/ChipStatus.module.css";

const PHASES = [
  "Fase 1: Preparativos; Fundamentación y Consulta Indígena (Etapa Preparativa)",
  "Fase 2: Diagnóstico; Pronóstico; Imagen Objetivo y Consulta Indígena (Etapa Informativa)",
  "Fase 3: Modelo de Ordenamiento Territorial y Consulta Indígena (Etapa Deliberativa)",
  "Fase 4: Instrumentación; Monitoreo y evaluación; Anteproyecto del Programa y Ficha Síntesis",
];

export default function ChipStatus({ currentPhase = 1 }) {
  const safeCurrent = Math.max(1, Math.min(currentPhase, PHASES.length));

  return (
    <section className={styles.section}>
      <h2 className={styles.titule}>Estatus <span className="span-doarado">actual</span></h2>

      <div className={styles.status}>
        {PHASES.map((text, idx) => {
          const phaseNumber = idx + 1;
          const isCurrent = phaseNumber === safeCurrent;

          return (
            <div key={phaseNumber} className={styles.chipWrap}>
              {isCurrent && (
                <span className={styles.tooltip} role="status" aria-live="polite">
                  Fase actual en curso
                </span>
              )}

              <span
                className={`${styles.chip} ${isCurrent ? styles.chipActive : ""}`}
                aria-current={isCurrent ? "step" : undefined}
              >
                {text}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
