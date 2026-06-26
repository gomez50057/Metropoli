"use client";

import { useState } from 'react';
import { formatDate } from '../utils/formatDate';
import { agreementStatusLabel } from '../constants/statuses';
import styles from './AgreementDetail.module.css';

const ACTION_LABELS = {
  agreement_created: 'Acuerdo registrado',
  agreement_deleted: 'Acuerdo eliminado',
  agreement_document_deleted: 'Documento del acuerdo eliminado',
  agreement_document_replaced: 'Documento del acuerdo reemplazado',
  agreement_document_uploaded: 'Documento del acuerdo cargado',
  agreement_other_file_deleted: 'Archivo adicional eliminado',
  agreement_other_file_replaced: 'Archivo adicional reemplazado',
  agreement_other_file_uploaded: 'Archivo adicional cargado',
  agreement_report_package: 'Reporte con anexos descargado',
  agreement_report_pdf: 'Reporte PDF descargado',
  agreement_updated: 'Acuerdo original editado',
  export_csv: 'Exportación CSV descargada',
  export_xlsx: 'Exportación Excel descargada',
  file_downloaded: 'Archivo descargado',
  internal_comment: 'Comentario interno agregado',
  internal_comment_updated: 'Comentario interno editado',
  login: 'Inicio de sesión',
  logout: 'Cierre de sesión',
  status_changed: 'Estatus actualizado',
  responsible_status_changed: 'Estatus por responsable actualizado',
  token_refreshed: 'Sesión renovada',
  update_created: 'Actualización registrada',
  update_evidence_deleted: 'Evidencia de actualización eliminada',
  update_evidence_replaced: 'Evidencia de actualización reemplazada',
  update_evidence_uploaded: 'Evidencia de actualización cargada',
  update_rejected: 'Actualización rechazada',
  update_updated: 'Actualización editada',
  update_validated: 'Actualización validada',
};

const ACTION_DESCRIPTIONS = {
  agreement_created: 'Se registró el acuerdo en el sistema.',
  agreement_deleted: 'Se desactivó el acuerdo.',
  agreement_document_deleted: 'Se eliminó el documento principal del acuerdo.',
  agreement_document_replaced: 'Se reemplazó el documento principal del acuerdo.',
  agreement_document_uploaded: 'Se cargó el documento principal del acuerdo.',
  agreement_other_file_deleted: 'Se eliminó un archivo adicional del expediente.',
  agreement_other_file_replaced: 'Se reemplazó un archivo adicional del expediente.',
  agreement_other_file_uploaded: 'Se cargó un archivo adicional al expediente.',
  agreement_report_package: 'Se descargó el reporte con anexos.',
  agreement_report_pdf: 'Se descargó el reporte PDF.',
  agreement_updated: 'Se actualizaron los datos del acuerdo original.',
  export_csv: 'Se descargó la exportación en CSV.',
  export_xlsx: 'Se descargó la exportación en Excel.',
  file_downloaded: 'Se descargó un archivo del expediente.',
  internal_comment: 'Se agregó un comentario interno.',
  internal_comment_updated: 'Se editó un comentario interno.',
  login: 'El usuario inició sesión.',
  logout: 'El usuario cerró sesión.',
  token_refreshed: 'La sesión del usuario fue renovada.',
  update_created: 'Se registró una actualización de seguimiento.',
  update_evidence_deleted: 'Se eliminó una evidencia de actualización.',
  update_evidence_replaced: 'Se reemplazó una evidencia de actualización.',
  update_evidence_uploaded: 'Se cargó una evidencia de actualización.',
  update_rejected: 'Se rechazó una actualización de seguimiento.',
  update_updated: 'Se editó una actualización de seguimiento.',
  update_validated: 'Se validó una actualización de seguimiento.',
};

function actionLabel(action) {
  return ACTION_LABELS[action] || String(action || '')
    .replaceAll('_', ' ')
    .replace(/^\w/, (letter) => letter.toUpperCase());
}

function auditDescription(item) {
  if (item.action === 'status_changed') {
    return `De ${agreementStatusLabel(item.metadata?.from)} a ${agreementStatusLabel(item.metadata?.to)}`;
  }

  if (item.action === 'responsible_status_changed') {
    const responsible = item.metadata?.responsible_name || `Responsable ${item.metadata?.responsible || ''}`.trim();
    return `${responsible}: de ${agreementStatusLabel(item.metadata?.from)} a ${agreementStatusLabel(item.metadata?.to)}`;
  }

  return item.description || item.message || ACTION_DESCRIPTIONS[item.action] || 'Sin descripción';
}

export default function AgreementAuditLog({ items = [] }) {
  const [expanded, setExpanded] = useState(false);
  const visibleItems = expanded ? items : items.slice(0, 4);

  return (
    <section className={styles.panel}>
      <h2>Bitácora</h2>
      <ul>
        {visibleItems.map((item) => (
          <li key={item.id}>
            <strong>{actionLabel(item.action)}</strong>
            <p>
              {auditDescription(item)}
              {' - '}{item.actor_username || 'Sistema'} - {formatDate(item.created_at)}
            </p>
          </li>
        ))}
        {!items.length && <li>Sin bitácora visible.</li>}
      </ul>
      {items.length > 4 && (
        <button
          type="button"
          className={styles.expandButton}
          aria-expanded={expanded}
          onClick={() => setExpanded((value) => !value)}
        >
          {expanded ? 'Ver menos' : `Ver más (${items.length - 4})`}
        </button>
      )}
    </section>
  );
}
