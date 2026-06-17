"use client";

import { formatDate } from '../utils/formatDate';
import styles from './AgreementsDashboard.module.css';

export default function InstanceDynamicPanel({ updates = [] }) {
  return (
    <section className={styles.panel}>
      <h2>Últimas actualizaciones</h2>
      <ul>
        {updates.map((update) => (
          <li key={update.id}>
            <span>{update.folio} - {update.instance_name || 'Sin instancia'} - {formatDate(update.created_at)}</span>
            <strong>{update.validation_status}</strong>
          </li>
        ))}
        {!updates.length && <li><span>Sin actualizaciones</span><strong>0</strong></li>}
      </ul>
    </section>
  );
}
