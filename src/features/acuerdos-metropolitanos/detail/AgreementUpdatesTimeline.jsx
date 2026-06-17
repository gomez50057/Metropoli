"use client";

import { formatDate } from '../utils/formatDate';
import styles from './AgreementDetail.module.css';

export default function AgreementUpdatesTimeline({ updates = [], canReview, canEdit, onReview, onEdit, onDownload }) {
  return (
    <section className={styles.panel}>
      <h2>Historial de actualizaciones</h2>
      <ol className={styles.timeline}>
        {updates.map((update) => (
          <li key={update.id}>
            <strong>{formatDate(update.created_at || update.date)}</strong>
            <p>{update.description}</p>
            <span>{update.instance_name || 'Sin instancia'} - {update.validation_status || update.status}</span>
            {(update.review_observations || update.observations) && <p>{update.review_observations || update.observations}</p>}
            {!!update.evidence?.length && (
              <ul>
                {update.evidence.map((file) => (
                  <li key={file.id}>
                    <button type="button" className={styles.linkButton} onClick={() => onDownload(file)}>
                      {file.name || file.original_name}
                    </button>
                  </li>
                ))}
              </ul>
            )}
            <div className={styles.reviewActions}>
              {canEdit && <button type="button" onClick={() => onEdit(update)}>Editar</button>}
              {canReview && update.validation_status === 'PENDIENTE' && (
                <>
                  <button type="button" onClick={() => onReview(update.id, 'validate')}>Validar</button>
                  <button type="button" onClick={() => onReview(update.id, 'reject')}>Rechazar</button>
                </>
              )}
            </div>
          </li>
        ))}
        {!updates.length && <li>Sin actualizaciones registradas.</li>}
      </ol>
    </section>
  );
}
