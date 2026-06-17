"use client";

import AgreementAuditLog from './AgreementAuditLog';
import styles from './AgreementDetail.module.css';

export default function AgreementHistory({ auditLogs = [], internalComments = [] }) {
  return (
    <div className={styles.grid}>
      <section className={styles.panel}>
        <h2>Comentarios internos</h2>
        <ul>
          {internalComments.map((comment) => (
            <li key={comment.id}>
              <strong>{comment.created_by_username || 'Usuario'}</strong>
              <p>{comment.comment}</p>
            </li>
          ))}
          {!internalComments.length && <li>Sin comentarios visibles.</li>}
        </ul>
      </section>
      <AgreementAuditLog items={auditLogs} />
    </div>
  );
}
