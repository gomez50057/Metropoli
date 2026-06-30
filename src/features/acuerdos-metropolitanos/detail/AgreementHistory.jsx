"use client";

import { useState } from 'react';
import AddCommentOutlinedIcon from '@mui/icons-material/AddCommentOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { formatDateTime } from '../utils/formatDate';
import AgreementAuditLog from './AgreementAuditLog';
import styles from './AgreementDetail.module.css';

export default function AgreementHistory({
  auditLogs = [],
  internalComments = [],
  currentUserId,
  onAddComment,
  onEditComment,
}) {
  const [comment, setComment] = useState('');
  const [composing, setComposing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editingValue, setEditingValue] = useState('');
  const [saving, setSaving] = useState(false);
  const [commentsExpanded, setCommentsExpanded] = useState(false);
  const visibleComments = commentsExpanded ? internalComments : internalComments.slice(0, 4);
  const latestOwnComment = internalComments.find(
    (item) => String(item.created_by) === String(currentUserId)
  );

  async function submit(event) {
    event.preventDefault();
    const value = comment.trim();
    if (!value) return;

    setSaving(true);
    const saved = await onAddComment(value);
    setSaving(false);
    if (saved) {
      setComment('');
      setComposing(false);
    }
  }

  async function saveEdit(event) {
    event.preventDefault();
    const value = editingValue.trim();
    if (!value) return;

    setSaving(true);
    const saved = await onEditComment(editingId, value);
    setSaving(false);
    if (saved) {
      setEditingId(null);
      setEditingValue('');
    }
  }

  return (
    <div className={styles.grid}>
      <section className={styles.panel}>
        <div className={styles.panelHeader}>
          <h2>Comentarios internos</h2>
          {!composing && (
            <button type="button" className={styles.addCommentButton} onClick={() => setComposing(true)}>
              <AddCommentOutlinedIcon fontSize="small" />
              Agregar comentario
            </button>
          )}
        </div>
        <p className={styles.panelHint}>Notas de trabajo no visibles para seguimiento.</p>
        {composing && <form className={styles.commentForm} onSubmit={submit}>
          <label htmlFor="internal-comment">Nuevo comentario</label>
          <textarea
            id="internal-comment"
            rows="3"
            maxLength="2000"
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            placeholder="Escribe una nota interna"
          />
          <div className={styles.commentActions}>
            <button type="button" onClick={() => {
              setComment('');
              setComposing(false);
            }}>
              Cancelar
            </button>
            <button type="submit" disabled={saving || !comment.trim()}>
              {saving ? 'Publicando...' : 'Publicar comentario'}
            </button>
          </div>
        </form>}
        <ul>
          {visibleComments.map((comment) => (
            <li key={comment.id}>
              <div className={styles.commentHeader}>
                <div>
                  <strong>{comment.created_by_username || 'Usuario'}</strong>
                  <small>{formatDateTime(comment.created_at)}</small>
                </div>
                {latestOwnComment?.id === comment.id && editingId !== comment.id && (
                  <button
                    type="button"
                    className={styles.editCommentButton}
                    onClick={() => {
                      setEditingId(comment.id);
                      setEditingValue(comment.comment);
                    }}
                    title="Editar comentario"
                  >
                    <EditOutlinedIcon fontSize="small" />
                  </button>
                )}
              </div>
              {editingId === comment.id ? (
                <form className={styles.commentForm} onSubmit={saveEdit}>
                  <textarea
                    rows="3"
                    maxLength="2000"
                    value={editingValue}
                    onChange={(event) => setEditingValue(event.target.value)}
                    autoFocus
                  />
                  <div className={styles.commentActions}>
                    <button type="button" onClick={() => setEditingId(null)}>Cancelar</button>
                    <button type="submit" disabled={saving || !editingValue.trim()}>
                      {saving ? 'Guardando...' : 'Guardar cambios'}
                    </button>
                  </div>
                </form>
              ) : (
                <p>{comment.comment}</p>
              )}
            </li>
          ))}
          {!internalComments.length && <li>Sin comentarios visibles.</li>}
        </ul>
        {internalComments.length > 4 && (
          <button
            type="button"
            className={styles.expandButton}
            aria-expanded={commentsExpanded}
            onClick={() => setCommentsExpanded((value) => !value)}
          >
            {commentsExpanded ? 'Ver menos' : `Ver más (${internalComments.length - 4})`}
          </button>
        )}
      </section>
      <AgreementAuditLog items={auditLogs} />
    </div>
  );
}
