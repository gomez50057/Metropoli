"use client";

import Link from 'next/link';
import { formatDate } from '../utils/formatDate';
import AgreementStatusBadge from './AgreementStatusBadge';
import styles from './AgreementsList.module.css';

export default function AgreementsTable({ agreements, showGlobalStatus, loading }) {
  const colSpan = showGlobalStatus ? 9 : 8;

  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Folio</th>
            <th>Descripcion</th>
            <th>Fecha</th>
            <th>Fecha de entrega</th>
            <th>Zona</th>
            <th>Responsables</th>
            {showGlobalStatus && <th>Estatus</th>}
            <th>Ultima actualizacion</th>
            <th>Seguimiento</th>
          </tr>
        </thead>
        <tbody>
          {agreements.map((agreement) => (
            <tr key={agreement.id}>
              <td>{agreement.folio}</td>
              <td>{agreement.description || '-'}</td>
              <td>{formatDate(agreement.date || agreement.fecha)}</td>
              <td>{formatDate(agreement.committed_date)}</td>
              <td>{agreement.zone_name || agreement.zone}</td>
              <td>{agreement.responsibles_display || '-'}</td>
              {showGlobalStatus && (
                <td><AgreementStatusBadge status={agreement.status} label={agreement.status_display} /></td>
              )}
              <td>{formatDate(agreement.last_update_date)}</td>
              <td>
                <Link href={`/acuerdos-metropolitanos/acuerdos/${agreement.id}`}>Ver</Link>
              </td>
            </tr>
          ))}
          {loading && (
            <tr>
              <td colSpan={colSpan} className={styles.loadingState}>Analizando acuerdos registrados...</td>
            </tr>
          )}
          {!loading && !agreements.length && (
            <tr>
              <td colSpan={colSpan} className={styles.emptyState}>Por el momento no hay acuerdos, revisa mas tarde.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
