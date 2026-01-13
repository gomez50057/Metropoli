"use client";

import { useMemo } from "react";
import styles from "./CountsPanel.module.css";

export default function CountsPanel() {
  const counts = [
    { key: "zapotlan", label: "Zapotlán de Juárez", total: 44 },
    { key: "pachuca", label: 'Pachuca de Soto "La Españita"', total: 128 },
    { key: "mdlr", label: "Mineral de la Reforma", total: 107 },
    { key: "mdm", label: "Mineral del Monte", total: 63 },
    { key: "epaz", label: "Epazoyucan", total: 28 },
    { key: "zempoala", label: "Zempoala", total: 87 },
  ];

  const totalGeneral = useMemo(
    () => counts.reduce((acc, c) => acc + (Number.isFinite(c.total) ? c.total : 0), 0),
    [counts]
  );

  return (
    <section className={styles.wrap}>
      <header className={styles.header}>
        <div className={styles.headerText}>
          <h2 className={styles.title}>
            <span className="span-doarado">Tu voz cuenta </span>en la{" "}
            <span>Zona Metropolitana </span>
          </h2>
          <p className={styles.subtitle}>Respuestas ciudadanas registradas por municipio</p>
        </div>
      </header>

      <div className={styles.kpiRow}>
        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>Total general</span>
          <span className={styles.kpiValue}>{totalGeneral}</span>
        </div>
      </div>

      <div className={styles.grid}>
        {counts.map((c) => (
          <article key={c.key} className={styles.card}>
            <h3 className={styles.cardTitle}>{c.label}</h3>

            <div className={styles.totalWrap}>
              <span className={styles.total}>{c.total}</span>
              <span className={styles.totalUnit}>respuestas</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
