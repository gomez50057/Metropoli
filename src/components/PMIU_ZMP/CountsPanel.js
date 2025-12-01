"use client";

import { useEffect, useMemo, useState } from "react";
import styles from "./CountsPanel.module.css";

const REFRESH_MS = 3 * 60 * 60 * 1000; // 3 horas

export default function CountsPanel() {
  const [counts, setCounts] = useState([]);
  const [updatedAt, setUpdatedAt] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const normalize = (json) => {
    if (json && Array.isArray(json.counts)) {
      return { counts: json.counts, updatedAt: json.updatedAt || null };
    }
    if (Array.isArray(json)) {
      return { counts: json, updatedAt: null };
    }
    return { counts: [], updatedAt: null };
  };

  const load = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`/api/counts?ts=${Date.now()}`, {
        cache: "no-store",
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const json = await res.json();
      const norm = normalize(json);

      setCounts(norm.counts);
      setUpdatedAt(norm.updatedAt);
    } catch (e) {
      setError(String(e));
      setCounts([]);
      setUpdatedAt(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    const id = setInterval(load, REFRESH_MS);
    return () => clearInterval(id);
  }, []);

  // total general (opcional, pero queda nice para público)
  const totalGeneral = useMemo(
    () =>
      counts.reduce((acc, c) => acc + (Number.isFinite(c.total) ? c.total : 0), 0),
    [counts]
  );

  return (
    <section className={styles.wrap} aria-busy={loading}>
      <header className={styles.header}>
        <div className={styles.headerText}>
          <h2 className={styles.title}><span className="span-doarado">Tu voz cuenta </span>en la <span>Zona Metropolitana </span></h2>
          <p className={styles.subtitle}>
            Respuestas ciudadanas registradas por municipio
          </p>
        </div>
      </header>



      {!error && loading && (
        <div className={styles.skeletonGrid}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className={styles.skeletonCard} />
          ))}
        </div>
      )}

      {!loading && !error && (
        <>
          <div className={styles.kpiRow}>
            <div className={styles.kpiCard}>
              <span className={styles.kpiLabel}>Total general</span>
              <span className={styles.kpiValue}>{totalGeneral}</span>
            </div>
          </div>

          <div className={styles.grid}>
            {counts.length === 0 ? (
              <div className={styles.empty}>
                <p className={styles.emptyTitle}>Aún no hay respuestas registradas</p>
                <p className={styles.emptyBody}>
                  Cuando lleguen nuevas participaciones, se verán aquí automáticamente.
                </p>
              </div>
            ) : (
              counts.map((c) => (
                <article key={c.key || c.label} className={styles.card}>
                  <h3 className={styles.cardTitle}>{c.label}</h3>

                  <div className={styles.totalWrap}>
                    <span className={styles.total}>{c.total ?? "—"}</span>
                    <span className={styles.totalUnit}>respuestas</span>
                  </div>

                  {c.error && (
                    <div className={styles.cardError}>{c.error}</div>
                  )}
                </article>
              ))
            )}
          </div>
        </>
      )}
    </section>
  );
}
