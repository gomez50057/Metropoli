"use client";

import { useState } from 'react';
import { formatDate } from '../utils/formatDate';
import { agreementStatusLabel } from '../constants/statuses';
import styles from './AgreementDetail.module.css';

const ACTION_LABELS = {
  agreement_updated: 'Acuerdo original editado',
  status_changed: 'Estatus actualizado',
};

export default function AgreementAuditLog({ items = [] }) {
  const [expanded, setExpanded] = useState(false);
  const visibleItems = expanded ? items : items.slice(0, 4);

  return (
    <section className={styles.panel}>
      <h2>Bitácora</h2>
      <ul>
        {visibleItems.map((item) => (
          <li key={item.id}>
            <strong>{ACTION_LABELS[item.action] || item.action}</strong>
            <p>
              {item.action === 'status_changed'
                ? `De ${agreementStatusLabel(item.metadata?.from)} a ${agreementStatusLabel(item.metadata?.to)}`
                : item.description || item.message || (item.action === 'agreement_updated'
                  ? 'Se actualizaron los datos del acuerdo original.'
                  : 'Sin descripción')}
              {' - '}{item.actor_username || 'Sistema'} - {formatDate(item.created_at)}
            </p>
          </li>
        ))}
        {!items.length && <li>Sin bitácora visible.</li>}
      </ul>
      {items.length > 4 && (
        <button
          type="button"
          className={styles.expandButton}
          aria-expanded={expanded}
          onClick={() => setExpanded((value) => !value)}
        >
          {expanded ? 'Ver menos' : `Ver más (${items.length - 4})`}
        </button>
      )}
    </section>
  );
}
