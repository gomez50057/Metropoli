"use client";

import styles from './AgreementsList.module.css';

function statusClass(status) {
  const value = String(status || '').toLowerCase();
  if (value.includes('termin')) return styles.done;
  if (value.includes('cancel')) return styles.cancelled;
  return styles.progress;
}

export default function AgreementStatusBadge({ status, label }) {
  return <span className={`${styles.badge} ${statusClass(status || label)}`}>{label || status}</span>;
}
