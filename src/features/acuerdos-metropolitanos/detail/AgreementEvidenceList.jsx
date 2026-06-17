"use client";

import styles from './AgreementDetail.module.css';

export default function AgreementEvidenceList({ files = [], onDownload }) {
  return (
    <section className={styles.panel}>
      <h2>Documentos iniciales</h2>
      <ul>
        {files.map((file) => (
          <li key={file.id || file.url}>
            <button type="button" className={styles.linkButton} onClick={() => onDownload(file)}>
              {file.name || file.filename || file.original_name}
            </button>
          </li>
        ))}
        {!files.length && <li>Sin documentos.</li>}
      </ul>
    </section>
  );
}
