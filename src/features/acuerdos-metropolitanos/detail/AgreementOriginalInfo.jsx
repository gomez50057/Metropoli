"use client";

import { formatDate } from '../utils/formatDate';
import AttentionSemaphore from '../list/AttentionSemaphore';
import AgreementStatusBadge from '../list/AgreementStatusBadge';
import styles from './AgreementDetail.module.css';

export default function AgreementOriginalInfo({ agreement }) {
  return (
    <section className={styles.panel}>
      <h2>Datos generales</h2>
      <dl>
        <div><dt>Fecha</dt><dd>{formatDate(agreement?.date || agreement?.fecha)}</dd></div>
        <div><dt>Zona</dt><dd>{agreement?.zone_name || agreement?.zone || '-'}</dd></div>
        <div><dt>Instancias</dt><dd>{agreement?.instances_display || agreement?.instances?.join(', ') || '-'}</dd></div>
        <div><dt>Tema</dt><dd>{agreement?.topic_name || agreement?.topic || '-'}</dd></div>
        <div><dt>Responsable</dt><dd>{agreement?.responsible_name || agreement?.responsible || '-'}</dd></div>
        <div><dt>Estatus</dt><dd><AgreementStatusBadge status={agreement?.status} label={agreement?.status_display} /></dd></div>
        <div><dt>Semaforo</dt><dd><AttentionSemaphore value={agreement?.semaphore} /></dd></div>
      </dl>
    </section>
  );
}
