"use client";

import { formatDate } from '../utils/formatDate';
import styles from './AgreementDetail.module.css';

export default function AgreementAuditLog({ items = [] }) {
  return (
    <section className={styles.panel}>
      <h2>Bitacora</h2>
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            <strong>{item.action}</strong>
            <p>{item.description || item.message || 'Sin descripcion'} - {item.actor_username || 'Sistema'} - {formatDate(item.created_at)}</p>
          </li>
        ))}
        {!items.length && <li>Sin bitacora visible.</li>}
      </ul>
    </section>
  );
}
