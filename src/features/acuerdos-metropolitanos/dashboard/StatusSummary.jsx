"use client";

import styles from './AgreementsDashboard.module.css';

export default function StatusSummary({ summary }) {
  return (
    <section className={styles.panel}>
      <h2>Resumen de atencion</h2>
      <ul>
        <li><span>Pendientes de validacion</span><strong>{summary?.pending_validation ?? 0}</strong></li>
        <li><span>Rechazadas con observaciones</span><strong>{summary?.rejected_with_observations ?? 0}</strong></li>
        <li><span>Evidencias cargadas</span><strong>{summary?.evidences_loaded ?? 0}</strong></li>
        <li><span>Sin actualizacion reciente</span><strong>{summary?.without_recent_update ?? 0}</strong></li>
      </ul>
    </section>
  );
}
