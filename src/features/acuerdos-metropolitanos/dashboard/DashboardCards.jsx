"use client";

import styles from './AgreementsDashboard.module.css';

const cards = [
  ['total', 'Total'],
  ['in_process', 'En proceso'],
  ['finished', 'Atendidos'],
  ['cancelled', 'Cancelados'],
];

export default function DashboardCards({ summary, showPendingValidation }) {
  const visibleCards = showPendingValidation
    ? [...cards, ['pending_validation', 'Actualizaciones pendientes']]
    : cards;

  return (
    <div className={styles.metrics}>
      {visibleCards.map(([key, label]) => (
        <article key={key} className={styles.metric}>
          <span>{label}</span>
          <strong>{summary?.[key] ?? 0}</strong>
        </article>
      ))}
    </div>
  );
}
