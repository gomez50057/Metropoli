"use client";

import styles from './AgreementsList.module.css';

const classes = {
  verde: styles.green,
  amarillo: styles.yellow,
  rojo: styles.red,
  gris: styles.gray,
  terminado: styles.closed,
};

export default function AttentionSemaphore({ value }) {
  const normalized = String(value || 'gris').toLowerCase();
  const label = normalized === 'terminado' ? 'Terminado' : `Semaforo ${normalized}`;

  return (
    <span className={styles.semaphore} title={label}>
      <span className={`${styles.dot} ${classes[normalized] || styles.gray}`} aria-hidden="true" />
      <span>{label}</span>
    </span>
  );
}
