"use client";

import Link from 'next/link';
import { formatDate } from '../utils/formatDate';
import AgreementStatusBadge from './AgreementStatusBadge';
import AttentionSemaphore from './AttentionSemaphore';
import styles from './AgreementsList.module.css';

export default function AgreementsTable({ agreements }) {
  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Folio</th>
            <th>Fecha</th>
            <th>Fecha comprometida</th>
            <th>Zona</th>
            <th>Instancias</th>
            <th>Estatus</th>
            <th>Semáforo</th>
            <th>Última actualización</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          {agreements.map((agreement) => (
            <tr key={agreement.id}>
              <td>{agreement.folio}</td>
              <td>{formatDate(agreement.date || agreement.fecha)}</td>
              <td>{formatDate(agreement.committed_date)}</td>
              <td>{agreement.zone_name || agreement.zone}</td>
              <td>{agreement.instances_display || agreement.instances?.join(', ')}</td>
              <td><AgreementStatusBadge status={agreement.status} label={agreement.status_display} /></td>
              <td><AttentionSemaphore value={agreement.semaphore} /></td>
              <td>{formatDate(agreement.last_update_date)}</td>
              <td>
                <Link href={`/acuerdos-metropolitanos/acuerdos/${agreement.id}`}>Ver</Link>
              </td>
            </tr>
          ))}
          {!agreements.length && (
            <tr>
              <td colSpan="9" className={styles.empty}>Sin acuerdos para mostrar.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
