"use client";

import styles from './AgreementsList.module.css';

const states = {
  verde: { label: 'Verde', description: 'Avance reciente', className: styles.green },
  amarillo: { label: 'Amarillo', description: 'Sin actualización reciente', className: styles.yellow },
  rojo: { label: 'Rojo', description: 'Mucho tiempo sin avances', className: styles.red },
  gris: { label: 'Gris', description: 'Cancelado', className: styles.gray },
  terminado: { label: 'Atendido', description: 'Acuerdo atendido', className: styles.closed },
};

export default function AttentionSemaphore({ value }) {
  const normalized = String(value || 'gris').toLowerCase();
  const state = states[normalized] || states.gris;

  return (
    <span className={styles.semaphore} title={`${state.label}: ${state.description}`}>
      <span className={`${styles.dot} ${state.className}`} aria-hidden="true" />
      <span className={styles.semaphoreText}>
        <strong>{state.label}</strong>
        <small>{state.description}</small>
      </span>
    </span>
  );
}
