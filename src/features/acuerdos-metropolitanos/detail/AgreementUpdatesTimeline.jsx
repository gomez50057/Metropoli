"use client";

import { useMemo, useState } from 'react';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import UploadFileOutlinedIcon from '@mui/icons-material/UploadFileOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { formatDate } from '../utils/formatDate';
import { UPLOAD_ACCEPT, canPreviewFile } from '../utils/fileHelpers';
import styles from './AgreementDetail.module.css';

export default function AgreementUpdatesTimeline({
  updates = [],
  canReview,
  canManageFiles,
  hideUserControls = false,
  onReview,
  onEdit,
  onDeleteEvidence,
  onReplaceEvidence,
  onUploadEvidence,
  onDownload,
  onPreview,
}) {
  const [expanded, setExpanded] = useState(false);
  const [userFilter, setUserFilter] = useState('');
  const users = useMemo(() => (
    hideUserControls ? [] : [...new Set(updates.map((update) => update.created_by_username).filter(Boolean))].sort()
  ), [hideUserControls, updates]);
  const filteredUpdates = !hideUserControls && userFilter
    ? updates.filter((update) => update.created_by_username === userFilter)
    : updates;
  const visibleUpdates = expanded ? filteredUpdates : filteredUpdates.slice(0, 4);

  return (
    <section className={styles.panel}>
      <div className={styles.panelHeader}>
        <h2>Historial de actualizaciones</h2>
        {!hideUserControls && (
          <select
            className={styles.inlineFilter}
            value={userFilter}
            onChange={(event) => {
              setUserFilter(event.target.value);
              setExpanded(false);
            }}
            aria-label="Filtrar historial por usuario"
          >
            <option value="">Todos los usuarios</option>
            {users.map((username) => (
              <option key={username} value={username}>{username}</option>
            ))}
          </select>
        )}
      </div>
      <ol className={styles.timeline}>
        {visibleUpdates.map((update) => (
          <li key={update.id}>
            <dl className={styles.updateDetails}>
              <div><dt>Fecha:</dt><dd>{formatDate(update.created_at || update.date)}</dd></div>
              <div><dt>Instancia:</dt><dd>{update.instance_name || 'Sin instancia'}</dd></div>
              {!hideUserControls && <div><dt>Usuario que lo aportó:</dt><dd>{update.created_by_username || '-'}</dd></div>}
              <div><dt>Validación de información:</dt><dd>{update.validation_status || update.status || 'Sin estatus'}</dd></div>
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
                        {(canManageFiles || update.can_edit) && (
                          <>
                            <label className={styles.linkButton}>
                              <UploadFileOutlinedIcon fontSize="small" /> Reemplazar
                              <input
                                type="file"
                                accept={UPLOAD_ACCEPT}
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
              {update.can_edit && (
                <label className={styles.linkButton}>
                  <UploadFileOutlinedIcon fontSize="small" /> Agregar evidencia
                  <input
                    type="file"
                    multiple
                    accept={UPLOAD_ACCEPT}
                    className={styles.fileInput}
                    aria-label="Agregar evidencia"
                    onChange={(event) => {
                      onUploadEvidence(update, event.target.files);
                      event.target.value = '';
                    }}
                  />
                </label>
              )}
              {canReview && update.validation_status === 'PENDIENTE' && (
                <>
                  <button type="button" onClick={() => onReview(update.id, 'validate')}>Validar</button>
                  <button type="button" onClick={() => onReview(update.id, 'reject')}>Rechazar</button>
                </>
              )}
            </div>
          </li>
        ))}
        {!filteredUpdates.length && <li className={styles.timelineEmpty}>Sin actualizaciones registradas.</li>}
      </ol>
      {filteredUpdates.length > 4 && (
        <button
          type="button"
          className={styles.expandButton}
          aria-expanded={expanded}
          onClick={() => setExpanded((value) => !value)}
        >
          {expanded ? 'Ver menos' : `Ver más (${filteredUpdates.length - 4})`}
        </button>
      )}
    </section>
  );
}
