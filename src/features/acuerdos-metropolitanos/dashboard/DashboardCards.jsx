"use client";

import styles from './AgreementsDashboard.module.css';

const cards = [
  ['total', 'Total'],
  ['in_process', 'En proceso'],
  ['finished', 'Atendidos'],
  ['cancelled', 'Cancelados'],
  ['pending_validation', 'Pendientes'],
  ['without_recent_update', 'Sin actualización'],
];

export default function DashboardCards({ summary }) {
  return (
    <div className={styles.metrics}>
      {cards.map(([key, label]) => (
        <article key={key} className={styles.metric}>
          <span>{label}</span>
          <strong>{summary?.[key] ?? 0}</strong>
        </article>
      ))}
    </div>
  );
}
