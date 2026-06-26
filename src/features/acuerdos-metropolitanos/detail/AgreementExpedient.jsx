"use client";

import AgreementEvidenceList from './AgreementEvidenceList';
import AgreementOriginalInfo from './AgreementOriginalInfo';
import { AGREEMENT_DOCUMENT_ACCEPT } from '../utils/fileHelpers';
import styles from './AgreementDetail.module.css';

export default function AgreementExpedient({
  agreement,
  canManageFiles,
  onDelete,
  onReplace,
  onDownload,
  onPreview,
  onDeleteOther,
  onReplaceOther,
  onDownloadOther,
  onPreviewOther,
  showGlobalStatus,
  canEditAgreement,
  onSaveAgreement,
}) {
  const documents = agreement?.documents || agreement?.evidence || [];
  const otherFiles = agreement?.other_files || [];

  return (
    <>
      <div className={styles.heading}>
        <h1>{agreement?.folio || 'Expediente'}</h1>
        <p>{agreement?.description || agreement?.descripcion}</p>
      </div>
      <div className={styles.grid}>
        <AgreementOriginalInfo
          agreement={agreement}
          showGlobalStatus={showGlobalStatus}
          canEdit={canEditAgreement}
          onSave={onSaveAgreement}
        />
        <AgreementEvidenceList
          title="Documento inicial"
          files={documents}
          canManageFiles={canManageFiles}
          onDelete={onDelete}
          onReplace={onReplace}
          onDownload={onDownload}
          onPreview={onPreview}
          accept={AGREEMENT_DOCUMENT_ACCEPT}
        />
        <AgreementEvidenceList
          title="Otros archivos"
          emptyText="Sin otros archivos."
          files={otherFiles}
          canManageFiles={canManageFiles}
          onDelete={onDeleteOther}
          onReplace={onReplaceOther}
          onDownload={onDownloadOther}
          onPreview={onPreviewOther}
        />
      </div>
    </>
  );
}
