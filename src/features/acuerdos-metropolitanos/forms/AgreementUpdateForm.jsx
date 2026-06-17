"use client";

import { useRef, useState } from 'react';
import ConfirmDialog from '@/components/shared/ConfirmDialog';
import { EVIDENCE_EXTENSIONS, EVIDENCE_MAX_BYTES, isEvidenceAllowed } from '../utils/fileHelpers';
import EvidenceUpload from './EvidenceUpload';
import styles from './AgreementForm.module.css';

export default function AgreementUpdateForm({ onSubmit }) {
  const [description, setDescription] = useState('');
  const [files, setFiles] = useState([]);
  const [error, setError] = useState('');
  const [confirmSave, setConfirmSave] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadResetKey, setUploadResetKey] = useState(0);
  const formRef = useRef(null);
  const pendingData = useRef(null);

  function submit(event) {
    event.preventDefault();
    setError('');

    if (!description.trim()) {
      setError('Captura la descripcion del avance.');
      return;
    }
    if ([...files].some((file) => !isEvidenceAllowed(file))) {
      setError('Hay archivos con extension no permitida.');
      return;
    }

    const formData = new FormData();
    formData.append('description', description);
    [...files].forEach((file) => formData.append('evidence', file));
    pendingData.current = formData;
    setConfirmSave(true);
  }

  async function confirmSubmit() {
    const formData = pendingData.current;
    setConfirmSave(false);
    if (!formData) return;

    setSaving(true);
    await onSubmit(formData);
    setSaving(false);
    pendingData.current = null;
    setDescription('');
    setFiles([]);
    setUploadResetKey((key) => key + 1);
    formRef.current?.reset();
  }

  return (
    <form ref={formRef} className={styles.form} onSubmit={submit}>
      <h2>Nueva actualizacion</h2>
      <div className={styles.formGroup}>
        <label htmlFor="update-description">Descripcion</label>
        <textarea
          id="update-description"
          rows="5"
          maxLength="5000"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        />
        <span className={styles.counter}>{description.length}/5000</span>
      </div>
      <EvidenceUpload
        id="update-evidence"
        acceptedExtensions={EVIDENCE_EXTENSIONS}
        maxSize={EVIDENCE_MAX_BYTES}
        clearKey={uploadResetKey}
        onChange={setFiles}
      />
      {error && <div className={styles.error}>{error}</div>}
      <button type="submit" disabled={saving}>{saving ? 'Guardando...' : 'Guardar actualizacion'}</button>
      <ConfirmDialog
        isOpen={confirmSave}
        title="Guardar actualizacion"
        message="Estas seguro de que quieres guardar esta actualizacion?"
        confirmText="Si, guardar"
        onCancel={() => setConfirmSave(false)}
        onConfirm={confirmSubmit}
      />
    </form>
  );
}
