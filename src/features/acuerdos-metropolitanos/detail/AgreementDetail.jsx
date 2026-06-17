"use client";

import { useEffect, useState } from 'react';
import ConfirmDialog from '@/components/shared/ConfirmDialog';
import { useSession } from '../auth/SessionProvider';
import {
  createAgreementUpdate,
  downloadProtectedFile,
  getAgreementHistory,
  rejectUpdate,
  updateAgreementUpdate,
  validateUpdate,
} from '../services/agreementsApi';
import { canCreateUpdates, canManageAgreements } from '../utils/permissions';
import AgreementUpdateForm from '../forms/AgreementUpdateForm';
import AgreementExpedient from './AgreementExpedient';
import AgreementHistory from './AgreementHistory';
import AgreementUpdatesTimeline from './AgreementUpdatesTimeline';
import styles from './AgreementDetail.module.css';

export default function AgreementDetail({ id }) {
  const { user } = useSession();
  const [agreement, setAgreement] = useState(null);
  const [updates, setUpdates] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [internalComments, setInternalComments] = useState([]);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [confirmAction, setConfirmAction] = useState(null);
  const canAddUpdate = canCreateUpdates(user?.role);
  const canReview = canManageAgreements(user?.role);

  useEffect(() => {
    let active = true;

    getAgreementHistory(id)
      .then((history) => {
        if (active) {
          setAgreement(history.agreement);
          setUpdates(history.updates || []);
          setAuditLogs(history.audit_logs || []);
          setInternalComments(history.internal_comments || []);
        }
      })
      .catch(() => {
        if (active) setError('No se pudo cargar el expediente.');
      });

    return () => {
      active = false;
    };
  }, [id]);

  async function submitUpdate(formData) {
    setError('');
    setMessage('');

    try {
      const created = await createAgreementUpdate(id, formData);
      setUpdates((current) => [created, ...current]);
      setMessage('Actualizacion registrada.');
    } catch {
      setError('No se pudo registrar la actualizacion.');
    }
  }

  async function reviewUpdate(updateId, action) {
    setError('');
    setMessage('');

    try {
      const updated = action === 'validate'
        ? await validateUpdate(updateId)
        : await rejectUpdate(updateId, window.prompt('Observaciones de rechazo') || '');
      setUpdates((current) => current.map((item) => (item.id === updateId ? updated : item)));
      setMessage(action === 'validate' ? 'Actualizacion validada.' : 'Actualizacion rechazada.');
    } catch {
      setError('No se pudo revisar la actualizacion.');
    }
  }

  async function editUpdate(update) {
    const description = window.prompt('Editar descripcion del avance', update.description);
    if (!description || description === update.description) return;

    try {
      const updated = await updateAgreementUpdate(update.id, { description });
      setUpdates((current) => current.map((item) => (item.id === update.id ? updated : item)));
      setMessage('Actualizacion editada.');
    } catch {
      setError('No se pudo editar esta actualizacion.');
    }
  }

  function requestReview(updateId, action) {
    setConfirmAction({
      title: action === 'validate' ? 'Validar actualizacion' : 'Rechazar actualizacion',
      message: action === 'validate'
        ? 'Estas seguro de que quieres validar esta actualizacion?'
        : 'Estas seguro de que quieres rechazar esta actualizacion?',
      confirmText: action === 'validate' ? 'Si, validar' : 'Si, rechazar',
      danger: action === 'reject',
      run: () => reviewUpdate(updateId, action),
    });
  }

  function requestEdit(update) {
    setConfirmAction({
      title: 'Editar actualizacion',
      message: 'Estas seguro de que quieres editar esta actualizacion?',
      confirmText: 'Si, editar',
      run: () => editUpdate(update),
    });
  }

  function runConfirmedAction() {
    const action = confirmAction;
    setConfirmAction(null);
    action?.run();
  }

  function downloadFile(file) {
    downloadProtectedFile(file.download_url || file.url, file.name || file.filename || 'archivo');
  }

  return (
    <section className={styles.page}>
      <AgreementExpedient agreement={agreement} onDownload={downloadFile} />
      {error && <div className={styles.alert}>{error}</div>}
      {message && <div className={styles.success}>{message}</div>}
      {canAddUpdate && <AgreementUpdateForm onSubmit={submitUpdate} />}
      <AgreementUpdatesTimeline
        updates={updates}
        canReview={canReview}
        canEdit={canAddUpdate}
        onReview={requestReview}
        onEdit={requestEdit}
        onDownload={downloadFile}
      />
      {canReview && <AgreementHistory auditLogs={auditLogs} internalComments={internalComments} />}
      <ConfirmDialog
        isOpen={Boolean(confirmAction)}
        title={confirmAction?.title}
        message={confirmAction?.message}
        confirmText={confirmAction?.confirmText}
        danger={confirmAction?.danger}
        onCancel={() => setConfirmAction(null)}
        onConfirm={runConfirmedAction}
      />
    </section>
  );
}
