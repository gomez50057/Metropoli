"use client";

import { formatDate } from '../utils/formatDate';
import AgreementStatusBadge from '../list/AgreementStatusBadge';
import AgreementOriginalEditForm from '../forms/AgreementOriginalEditForm';
import styles from './AgreementDetail.module.css';

export default function AgreementOriginalInfo({ agreement, showGlobalStatus, canEdit, onSave }) {
  return (
    <section className={styles.panel}>
      <div className={styles.panelHeader}>
        <h2>Datos generales</h2>
        {canEdit && <AgreementOriginalEditForm agreement={agreement} onSave={onSave} />}
      </div>
      <dl>
        <div><dt>Fecha</dt><dd>{formatDate(agreement?.date || agreement?.fecha)}</dd></div>
        <div><dt>Fecha de entrega</dt><dd>{formatDate(agreement?.committed_date)}</dd></div>
        <div><dt>Zona</dt><dd>{agreement?.zone_name || agreement?.zone || '-'}</dd></div>
        <div><dt>Instancias</dt><dd>{agreement?.instances_display || agreement?.instances?.join(', ') || '-'}</dd></div>
        {showGlobalStatus && <div><dt>Responsables</dt><dd>{agreement?.responsibles_display || '-'}</dd></div>}
        <div><dt>Tema</dt><dd>{agreement?.topic_name || agreement?.topic || '-'}</dd></div>
        {showGlobalStatus && <div><dt>Estatus global</dt><dd><AgreementStatusBadge status={agreement?.status} label={agreement?.status_display} /></dd></div>}
      </dl>
    </section>
  );
}
