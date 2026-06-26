"use client";

import { AGREEMENT_STATUSES } from '../constants/statuses';
import AgreementStatusBadge from '../list/AgreementStatusBadge';
import styles from './AgreementDetail.module.css';

export default function AgreementResponsibleStatuses({ statuses = [], canEdit, onChange }) {
  if (!statuses.length) return null;

  return (
    <section className={styles.panel}>
      <h2>Estatus por responsable</h2>
      <ul className={styles.statusList}>
        {statuses.map((item) => (
          <li key={item.id} className={styles.statusItem}>
            <span>{item.responsible_name}</span>
            {canEdit ? (
              <select
                value={item.status}
                onChange={(event) => onChange(item, event.target.value)}
                aria-label={`Estatus de ${item.responsible_name}`}
              >
                {AGREEMENT_STATUSES.map((status) => (
                  <option key={status.value} value={status.value}>{status.label}</option>
                ))}
              </select>
            ) : (
              <AgreementStatusBadge status={item.status} label={item.status_display} />
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
