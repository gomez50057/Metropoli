"use client";

import { useEffect, useState } from 'react';
import ConfirmDialog from '@/components/shared/ConfirmDialog';
import StatusMessage from '@/components/shared/StatusMessage';
import { useSession } from '../auth/SessionProvider';
import {
  createInternalComment,
  createAgreementUpdate,
  downloadProtectedFile,
  getAgreementHistory,
  previewProtectedFile,
  rejectUpdate,
  updateAgreement,
  updateAgreementUpdate,
  updateInternalComment,
  validateUpdate,
} from '../services/agreementsApi';
import { canCreateUpdates, canManageAgreements } from '../utils/permissions';
import AgreementOriginalEditForm from '../forms/AgreementOriginalEditForm';
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
      setMessage('Actualización registrada.');
    } catch {
      setError('No se pudo registrar la actualización.');
    }
  }

  async function addInternalComment(comment) {
    setError('');

    try {
      const created = await createInternalComment(id, comment);
      setInternalComments((current) => [created, ...current]);
      setMessage('Comentario interno agregado.');
      return true;
    } catch {
      setError('No se pudo agregar el comentario interno.');
      return false;
    }
  }

  async function editInternalComment(commentId, comment) {
    setError('');

    try {
      const updated = await updateInternalComment(commentId, comment);
      setInternalComments((current) => current.map((item) => (item.id === commentId ? updated : item)));
      const history = await getAgreementHistory(id);
      setAuditLogs(history.audit_logs || []);
      setMessage('Comentario interno actualizado.');
      return true;
    } catch {
      setError('Solo puedes editar tu comentario más reciente.');
      return false;
    }
  }

  async function editAgreement(values) {
    setError('');
    setMessage('');

    try {
      await updateAgreement(id, {
        ...values,
        committed_date: values.committed_date || null,
        topic: values.topic || null,
      });
      const history = await getAgreementHistory(id);
      setAgreement(history.agreement);
      setUpdates(history.updates || []);
      setAuditLogs(history.audit_logs || []);
      setInternalComments(history.internal_comments || []);
      setMessage('Acuerdo original actualizado.');
      return true;
    } catch {
      setError('No se pudo actualizar el acuerdo original.');
      return false;
    }
  }

  async function reviewUpdate(updateId, action, observations = '') {
    setError('');
    setMessage('');

    try {
      const updated = action === 'validate'
        ? await validateUpdate(updateId)
        : await rejectUpdate(updateId, observations);
      setUpdates((current) => current.map((item) => (item.id === updateId ? updated : item)));
      setMessage(action === 'validate' ? 'Actualización validada.' : 'Actualización rechazada.');
    } catch {
      setError('No se pudo revisar la actualización.');
    }
  }

  async function editUpdate(update, description) {
    if (!description || description === update.description) return;

    try {
      const updated = await updateAgreementUpdate(update.id, { description });
      setUpdates((current) => current.map((item) => (item.id === update.id ? updated : item)));
      setMessage('Actualización editada.');
    } catch {
      setError('No se pudo editar esta actualización.');
    }
  }

  function requestReview(updateId, action) {
    setConfirmAction({
      title: action === 'validate' ? 'Validar actualización' : 'Rechazar actualización',
      message: action === 'validate'
        ? '¿Estás seguro de que quieres validar esta actualización?'
        : '¿Estás seguro de que quieres rechazar esta actualización?',
      confirmText: action === 'validate' ? 'Sí, validar' : 'Sí, rechazar',
      danger: action === 'reject',
      inputLabel: action === 'reject' ? 'Observaciones de rechazo' : '',
      inputValue: '',
      inputRequired: action === 'reject',
      run: (value) => reviewUpdate(updateId, action, value),
    });
  }

  function requestEdit(update) {
    setConfirmAction({
      title: 'Editar actualización',
      message: '¿Estás seguro de que quieres editar esta actualización?',
      confirmText: 'Sí, editar',
      inputLabel: 'Descripción del avance',
      inputValue: update.description,
      inputRequired: true,
      run: (value) => editUpdate(update, value),
    });
  }

  function runConfirmedAction() {
    const action = confirmAction;
    setConfirmAction(null);
    action?.run(action.inputValue?.trim());
  }

  function downloadFile(file) {
    downloadProtectedFile(file.download_url || file.url, file.name || file.filename || 'archivo');
  }

  function previewFile(file) {
    previewProtectedFile(file.download_url || file.url);
  }

  return (
    <section className={styles.page}>
      <StatusMessage message={message} onDismiss={() => setMessage('')} />
      <AgreementExpedient agreement={agreement} onDownload={downloadFile} onPreview={previewFile} />
      {error && <div className={styles.alert}>{error}</div>}
      {canReview && <AgreementOriginalEditForm agreement={agreement} onSave={editAgreement} />}
      {canAddUpdate && <AgreementUpdateForm onSubmit={submitUpdate} />}
      <AgreementUpdatesTimeline
        updates={updates}
        canReview={canReview}
        canEdit={canAddUpdate}
        onReview={requestReview}
        onEdit={requestEdit}
        onDownload={downloadFile}
        onPreview={previewFile}
      />
      {canReview && (
        <AgreementHistory
          auditLogs={auditLogs}
          internalComments={internalComments}
          currentUserId={user?.id}
          onAddComment={addInternalComment}
          onEditComment={editInternalComment}
        />
      )}
      <ConfirmDialog
        isOpen={Boolean(confirmAction)}
        title={confirmAction?.title}
        message={confirmAction?.message}
        confirmText={confirmAction?.confirmText}
        danger={confirmAction?.danger}
        inputLabel={confirmAction?.inputLabel}
        inputValue={confirmAction?.inputValue}
        inputRequired={confirmAction?.inputRequired}
        onInputChange={(inputValue) => setConfirmAction((current) => ({ ...current, inputValue }))}
        onCancel={() => setConfirmAction(null)}
        onConfirm={runConfirmedAction}
      />
    </section>
  );
}
