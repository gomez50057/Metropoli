"use client";

import styles from './AgreementsDashboard.module.css';

export default function StatusSummary({ summary }) {
  return (
    <section className={styles.panel}>
      <h2>Resumen de atención</h2>
      <ul>
        <li><span>Observaciones pendientes de revisión</span><strong>{summary?.rejected_with_observations ?? 0}</strong></li>
      </ul>
    </section>
  );
}
