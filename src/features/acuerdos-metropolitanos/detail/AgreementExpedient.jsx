"use client";

import AgreementEvidenceList from './AgreementEvidenceList';
import AgreementOriginalInfo from './AgreementOriginalInfo';
import styles from './AgreementDetail.module.css';

export default function AgreementExpedient({ agreement, onDownload, onPreview }) {
  const documents = agreement?.documents || agreement?.evidence || [];

  return (
    <>
      <div className={styles.heading}>
        <h1>{agreement?.folio || 'Expediente'}</h1>
        <p>{agreement?.description || agreement?.descripcion}</p>
      </div>
      <div className={styles.grid}>
        <AgreementOriginalInfo agreement={agreement} />
        <AgreementEvidenceList files={documents} onDownload={onDownload} onPreview={onPreview} />
      </div>
    </>
  );
}
