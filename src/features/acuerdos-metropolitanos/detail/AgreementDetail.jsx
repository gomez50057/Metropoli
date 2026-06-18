"use client";

import { useEffect, useState } from 'react';
import FolderZipOutlinedIcon from '@mui/icons-material/FolderZipOutlined';
import PictureAsPdfOutlinedIcon from '@mui/icons-material/PictureAsPdfOutlined';
import ConfirmDialog from '@/components/shared/ConfirmDialog';
import StatusMessage from '@/components/shared/StatusMessage';
import { useSession } from '../auth/SessionProvider';
import {
  createInternalComment,
  createAgreementUpdate,
  deleteAgreementDocument,
  deleteUpdateEvidence,
  downloadAgreementReport,
  downloadAgreementReportPackage,
  downloadProtectedFile,
  getAgreementHistory,
  previewProtectedFile,
  rejectUpdate,
  replaceAgreementDocument,
  replaceUpdateEvidence,
  updateAgreement,
  updateAgreementUpdate,
  updateInternalComment,
  validateUpdate,
} from '../services/agreementsApi';
import { canCreateUpdates, canManageAgreements, isAdministrator } from '../utils/permissions';
import { EVIDENCE_EXTENSIONS, fileExtension, isInitialPdf } from '../utils/fileHelpers';
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
  const [historyPagination, setHistoryPagination] = useState({ page: 1, has_next: false });
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [confirmAction, setConfirmAction] = useState(null);
  const [downloadingReport, setDownloadingReport] = useState(false);
  const [downloadingPackage, setDownloadingPackage] = useState(false);
  const canAddUpdate = canCreateUpdates(user?.role);
  const canReview = canManageAgreements(user?.role);
  const canManageFiles = isAdministrator(user?.role);

  useEffect(() => {
    let active = true;

    getAgreementHistory(id)
      .then((history) => {
        if (active) {
          setAgreement(history.agreement);
          setUpdates(history.updates || []);
          setAuditLogs(history.audit_logs || []);
          setInternalComments(history.internal_comments || []);
          setHistoryPagination(history.pagination || { page: 1, has_next: false });
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
      setUpdates((current) => [
        created,
        ...current.map((item) => (user?.role === 'INSTANCIA' ? { ...item, can_edit: false } : item)),
      ]);
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

  function requestFileDelete(file, kind) {
    setConfirmAction({
      title: 'Eliminar archivo',
      message: `Se eliminará definitivamente "${file.name || file.original_name || 'el archivo'}".`,
      confirmText: 'Sí, eliminar',
      danger: true,
      run: async () => {
        try {
          if (kind === 'document') {
            await deleteAgreementDocument(file.id);
            setAgreement((current) => ({
              ...current,
              documents: (current?.documents || []).filter((item) => item.id !== file.id),
            }));
          } else {
            await deleteUpdateEvidence(file.id);
            setUpdates((current) => current.map((update) => ({
              ...update,
              evidence: (update.evidence || []).filter((item) => item.id !== file.id),
            })));
          }
          setMessage('Archivo eliminado correctamente.');
        } catch {
          setError('No se pudo eliminar el archivo.');
        }
      },
    });
  }

  function requestFileReplace(file, replacement, kind) {
    const valid = kind === 'document'
      ? isInitialPdf(replacement)
      : EVIDENCE_EXTENSIONS.includes(fileExtension(replacement));
    if (!valid) {
      setError(kind === 'document'
        ? 'El documento inicial debe ser PDF y no superar 25 MB.'
        : 'El tipo de archivo no está permitido.');
      return;
    }

    setConfirmAction({
      title: 'Reemplazar archivo',
      message: `¿Estás seguro de que quieres reemplazar "${file.name || file.original_name || 'el archivo'}" por "${replacement.name}"?`,
      confirmText: 'Sí, reemplazar',
      run: async () => {
        try {
          if (kind === 'document') {
            const updated = await replaceAgreementDocument(file.id, replacement);
            setAgreement((current) => ({
              ...current,
              documents: (current?.documents || []).map((item) => (item.id === file.id ? updated : item)),
            }));
          } else {
            const updated = await replaceUpdateEvidence(file.id, replacement);
            setUpdates((current) => current.map((item) => ({
              ...item,
              evidence: (item.evidence || []).map((evidence) => (evidence.id === file.id ? updated : evidence)),
            })));
          }
          setMessage('Archivo reemplazado correctamente.');
        } catch {
          setError('No se pudo reemplazar el archivo.');
        }
      },
    });
  }

  async function loadMoreHistory() {
    setLoadingMore(true);
    setError('');
    try {
      const history = await getAgreementHistory(id, { page: historyPagination.page + 1 });
      const mergeUnique = (current, incoming) => {
        const ids = new Set(current.map((item) => item.id));
        return [...current, ...incoming.filter((item) => !ids.has(item.id))];
      };
      setUpdates((current) => mergeUnique(current, history.updates || []));
      setAuditLogs((current) => mergeUnique(current, history.audit_logs || []));
      setInternalComments((current) => mergeUnique(current, history.internal_comments || []));
      setHistoryPagination(history.pagination || { page: historyPagination.page + 1, has_next: false });
    } catch {
      setError('No se pudo cargar más historial.');
    } finally {
      setLoadingMore(false);
    }
  }

  async function downloadReport() {
    setError('');
    setDownloadingReport(true);
    try {
      await downloadAgreementReport(id, agreement?.folio);
      setMessage('Reporte PDF descargado.');
    } catch {
      setError('No se pudo descargar el reporte PDF.');
    } finally {
      setDownloadingReport(false);
    }
  }

  async function downloadReportPackage() {
    setError('');
    setDownloadingPackage(true);
    try {
      await downloadAgreementReportPackage(id, agreement?.folio);
      setMessage('Reporte con anexos descargado.');
    } catch {
      setError('No se pudo descargar el reporte con anexos.');
    } finally {
      setDownloadingPackage(false);
    }
  }

  return (
    <section className={styles.page}>
      <StatusMessage message={message} onDismiss={() => setMessage('')} />
      <AgreementExpedient
        agreement={agreement}
        canManageFiles={canManageFiles}
        onDelete={(file) => requestFileDelete(file, 'document')}
        onReplace={(file, replacement) => requestFileReplace(file, replacement, 'document')}
        onDownload={downloadFile}
        onPreview={previewFile}
      />
      {error && <div className={styles.alert}>{error}</div>}
      {canReview && (
        <div className={styles.primaryActions}>
          <AgreementOriginalEditForm agreement={agreement} onSave={editAgreement} />
          <button
            type="button"
            className={styles.reportButton}
            disabled={!agreement || downloadingReport}
            onClick={downloadReport}
          >
            <PictureAsPdfOutlinedIcon />
            {downloadingReport ? 'Generando reporte...' : 'Descargar reporte PDF'}
          </button>
          <button
            type="button"
            className={styles.reportButton}
            disabled={!agreement || downloadingPackage}
            onClick={downloadReportPackage}
          >
            <FolderZipOutlinedIcon />
            {downloadingPackage ? 'Preparando anexos...' : 'Descargar PDF con anexos'}
          </button>
        </div>
      )}
      {canAddUpdate && <AgreementUpdateForm onSubmit={submitUpdate} />}
      <AgreementUpdatesTimeline
        updates={updates}
        canReview={canReview}
        canManageFiles={canManageFiles}
        onReview={requestReview}
        onEdit={requestEdit}
        onDeleteEvidence={(file) => requestFileDelete(file, 'update')}
        onReplaceEvidence={(file, replacement) => requestFileReplace(file, replacement, 'update')}
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
      {historyPagination.has_next && (
        <button
          type="button"
          className={styles.expandButton}
          disabled={loadingMore}
          onClick={loadMoreHistory}
        >
          {loadingMore ? 'Cargando historial...' : 'Cargar más historial'}
        </button>
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
