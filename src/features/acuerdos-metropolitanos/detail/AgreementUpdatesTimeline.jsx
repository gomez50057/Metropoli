"use client";

import { useState } from 'react';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import UploadFileOutlinedIcon from '@mui/icons-material/UploadFileOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { formatDate } from '../utils/formatDate';
import { canPreviewFile, EVIDENCE_EXTENSIONS } from '../utils/fileHelpers';
import styles from './AgreementDetail.module.css';

export default function AgreementUpdatesTimeline({
  updates = [],
  canReview,
  canManageFiles,
  onReview,
  onEdit,
  onDeleteEvidence,
  onReplaceEvidence,
  onDownload,
  onPreview,
}) {
  const [expanded, setExpanded] = useState(false);
  const visibleUpdates = expanded ? updates : updates.slice(0, 4);

  return (
    <section className={styles.panel}>
      <h2>Historial de actualizaciones</h2>
      <ol className={styles.timeline}>
        {visibleUpdates.map((update) => (
          <li key={update.id}>
            <dl className={styles.updateDetails}>
              <div><dt>Fecha:</dt><dd>{formatDate(update.created_at || update.date)}</dd></div>
              <div><dt>Instancia:</dt><dd>{update.instance_name || 'Sin instancia'}</dd></div>
              <div><dt>Estatus:</dt><dd>{update.validation_status || update.status || 'Sin estatus'}</dd></div>
              <div><dt>Descripción:</dt><dd>{update.description}</dd></div>
              {(update.review_observations || update.observations) && (
                <div><dt>Observaciones:</dt><dd>{update.review_observations || update.observations}</dd></div>
              )}
            </dl>
            {!!update.evidence?.length && (
              <div className={styles.updateEvidence}>
                <strong>Evidencia(s):</strong>
                <ul>
                  {update.evidence.map((file) => (
                    <li className={styles.fileRow} key={file.id}>
                      <span className={styles.fileName}>{file.name || file.original_name}</span>
                      <span className={styles.fileActions}>
                        {canPreviewFile(file) && (
                          <button type="button" className={styles.linkButton} onClick={() => onPreview(file)}>
                            <VisibilityOutlinedIcon fontSize="small" /> Previsualizar
                          </button>
                        )}
                        <button type="button" className={styles.linkButton} onClick={() => onDownload(file)}>
                          <FileDownloadOutlinedIcon fontSize="small" /> Descargar
                        </button>
                        {canManageFiles && (
                          <>
                            <label className={styles.linkButton}>
                              <UploadFileOutlinedIcon fontSize="small" /> Reemplazar
                              <input
                                type="file"
                                accept={EVIDENCE_EXTENSIONS.map((extension) => `.${extension}`).join(',')}
                                className={styles.fileInput}
                                aria-label={`Reemplazar ${file.name || file.original_name || 'evidencia'}`}
                                onChange={(event) => {
                                  const replacement = event.target.files?.[0];
                                  if (replacement) onReplaceEvidence(file, replacement);
                                  event.target.value = '';
                                }}
                              />
                            </label>
                            <button type="button" className={styles.linkButton} onClick={() => onDeleteEvidence(file)}>
                              <DeleteOutlineIcon fontSize="small" /> Eliminar
                            </button>
                          </>
                        )}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className={styles.reviewActions}>
              {update.can_edit && <button type="button" onClick={() => onEdit(update)}>Editar</button>}
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
      {updates.length > 4 && (
        <button
          type="button"
          className={styles.expandButton}
          aria-expanded={expanded}
          onClick={() => setExpanded((value) => !value)}
        >
          {expanded ? 'Ver menos' : `Ver más (${updates.length - 4})`}
        </button>
      )}
    </section>
  );
}
