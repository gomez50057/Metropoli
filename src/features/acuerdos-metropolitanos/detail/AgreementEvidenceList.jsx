"use client";

import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import UploadFileOutlinedIcon from '@mui/icons-material/UploadFileOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { canPreviewFile } from '../utils/fileHelpers';
import styles from './AgreementDetail.module.css';

export default function AgreementEvidenceList({ files = [], canManageFiles, onDelete, onReplace, onDownload, onPreview }) {
  return (
    <section className={styles.panel}>
      <h2>Documento inicial</h2>
      <ul>
        {files.map((file) => (
          <li className={styles.fileRow} key={file.id || file.url}>
            <span className={styles.fileName}>{file.name || file.filename || file.original_name}</span>
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
                      accept=".pdf,application/pdf"
                      className={styles.fileInput}
                      aria-label={`Reemplazar ${file.name || file.original_name || 'documento'}`}
                      onChange={(event) => {
                        const replacement = event.target.files?.[0];
                        if (replacement) onReplace(file, replacement);
                        event.target.value = '';
                      }}
                    />
                  </label>
                  <button type="button" className={styles.linkButton} onClick={() => onDelete(file)}>
                    <DeleteOutlineIcon fontSize="small" /> Eliminar
                  </button>
                </>
              )}
            </span>
          </li>
        ))}
        {!files.length && <li>Sin documentos.</li>}
      </ul>
    </section>
  );
}
