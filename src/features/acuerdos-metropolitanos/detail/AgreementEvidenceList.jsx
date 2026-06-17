"use client";

import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { canPreviewFile } from '../utils/fileHelpers';
import styles from './AgreementDetail.module.css';

export default function AgreementEvidenceList({ files = [], onDownload, onPreview }) {
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
            </span>
          </li>
        ))}
        {!files.length && <li>Sin documentos.</li>}
      </ul>
    </section>
  );
}
