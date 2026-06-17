"use client";

import styles from './ConfirmDialog.module.css';

export default function ConfirmDialog({
  isOpen,
  title = 'Confirmar accion',
  message = 'Esta accion no se puede deshacer.',
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  danger = false,
  inputLabel,
  inputValue = '',
  inputError = '',
  inputRequired = false,
  onInputChange,
  onConfirm,
  onCancel,
}) {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true" aria-labelledby="confirm-dialog-title">
      <div className={styles.dialog}>
        <h2 id="confirm-dialog-title">{title}</h2>
        <p>{message}</p>
        {inputLabel && (
          <label className={styles.field}>
            <span>{inputLabel}</span>
            <textarea
              rows="5"
              value={inputValue}
              onChange={(event) => onInputChange?.(event.target.value)}
              autoFocus
            />
            {inputError && <small role="alert">{inputError}</small>}
          </label>
        )}
        <div className={styles.actions}>
          <button type="button" className={styles.cancel} onClick={onCancel}>
            {cancelText}
          </button>
          <button
            type="button"
            className={danger ? styles.danger : styles.confirm}
            disabled={inputRequired && !inputValue.trim()}
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
