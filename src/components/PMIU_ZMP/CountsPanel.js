"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import styles from "./CountsPanel.module.css";

function useCountUpOnView(target, { threshold = 12, rootMargin = "0px 0px -10% 0px" } = {}) {
  const safeTarget = Number.isFinite(target) ? Math.max(0, Math.floor(target)) : 0;

  const ref = useRef(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [value, setValue] = useState(safeTarget ? 1 : 0);

  // Detecta entrada a viewport (solo 1 vez)
  useEffect(() => {
    if (hasStarted) return;

    const el = ref.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setHasStarted(true);
          obs.disconnect();
        }
      },
      { root: null, rootMargin, threshold: 0.2 }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, [hasStarted, rootMargin]);

  // Animación (solo cuando ya inició)
  useEffect(() => {
    if (!hasStarted) return;

    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduce) {
      setValue(safeTarget);
      return;
    }

    if (safeTarget <= 1) {
      setValue(safeTarget);
      return;
    }

    let rafId = 0;
    let last = 0;
    let current = 1;

    const FAST_MS = 20;
    const SLOW_MS = 120;

    const tick = (t) => {
      if (!last) last = t;

      const diff = t - last;
      const remaining = safeTarget - current;
      const stepMs = remaining <= threshold ? SLOW_MS : FAST_MS;

      if (diff >= stepMs) {
        const jump =
          remaining > 60 ? 7 :
            remaining > 30 ? 4 :
              remaining > threshold ? 2 : 1;

        current = Math.min(safeTarget, current + jump);
        setValue(current);
        last = t;
      }

      if (current < safeTarget) {
        rafId = requestAnimationFrame(tick);
      }
    };

    setValue(1);
    rafId = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(rafId);
  }, [hasStarted, safeTarget, threshold]);

  return { ref, value, started: hasStarted };
}

export default function CountsPanel() {
  const counts = [
    { key: "zapotlan", label: "Zapotlán de Juárez", total: 44 },
    { key: "pachuca", label: 'Pachuca de Soto', total: 128 },
    { key: "mdlr", label: "Mineral de la Reforma", total: 107 },
    { key: "mdm", label: "Mineral del Monte", total: 63 },
    { key: "epaz", label: "Epazoyucan", total: 28 },
    { key: "zempoala", label: "Zempoala", total: 87 },
    { key: "satl", label: "San Agustín Tlaxiaca", total: 37 }, 
  ];

  const totalGeneral = useMemo(
    () => counts.reduce((acc, c) => acc + (Number.isFinite(c.total) ? c.total : 0), 0),
    [counts]
  );

  const totalGeneralCounter = useCountUpOnView(totalGeneral, { threshold: 10 });

  return (
    <section className={styles.wrap}>
      <header className={styles.header}>
        <div className={styles.headerText}>
          <h2 className={styles.title}>
            <span className="span-doarado">Tu voz cuenta </span>en la{" "}
            <span>Zona Metropolitana </span>
          </h2>
          <p className={styles.subtitle}>Respuestas por municipio en los talleres de consulta ciudadana.</p>
        </div>
      </header>

      <div className={styles.kpiRow}>
        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>Total general</span>
          <span ref={totalGeneralCounter.ref} className={styles.kpiValue}>
            {totalGeneralCounter.value}
          </span>
        </div>
      </div>

      <div className={styles.grid}>
        {counts.map((c) => (
          <CountCard key={c.key} c={c} />
        ))}
      </div>
    </section>
  );
}

function CountCard({ c }) {
  const counter = useCountUpOnView(c.total, { threshold: 8 });

  return (
    <article className={styles.card}>
      <h3 className={styles.cardTitle}>{c.label}</h3>

      <div className={styles.totalWrap}>
        <span ref={counter.ref} className={styles.total}>
          {counter.value}
        </span>
        <span className={styles.totalUnit}>respuestas</span>
      </div>
    </article>
  );
}

