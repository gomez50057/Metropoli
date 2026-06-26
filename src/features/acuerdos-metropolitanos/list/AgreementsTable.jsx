"use client";

import Link from 'next/link';
import { formatDate } from '../utils/formatDate';
import AgreementStatusBadge from './AgreementStatusBadge';
import styles from './AgreementsList.module.css';

function getVisibleStatus(agreement, showGlobalStatus) {
  if (showGlobalStatus) {
    return { status: agreement.status, label: agreement.status_display };
  }

  const ownStatus = agreement.responsible_statuses?.[0];
  return { status: ownStatus?.status, label: ownStatus?.status_display };
}

export default function AgreementsTable({ agreements, showGlobalStatus, loading }) {
  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Folio</th>
            <th>Descripción</th>
            <th>Fecha</th>
            <th>Fecha de entrega</th>
            <th>Zona</th>
            <th>Responsables</th>
            <th>{showGlobalStatus ? 'Estatus global' : 'Estatus'}</th>
            <th>Última actualización</th>
            <th>Seguimiento</th>
          </tr>
        </thead>
        <tbody>
          {agreements.map((agreement) => {
            const visibleStatus = getVisibleStatus(agreement, showGlobalStatus);

            return (
              <tr key={agreement.id}>
                <td>{agreement.folio}</td>
                <td>{agreement.description || '-'}</td>
                <td>{formatDate(agreement.date || agreement.fecha)}</td>
                <td>{formatDate(agreement.committed_date)}</td>
                <td>{agreement.zone_name || agreement.zone}</td>
                <td>{agreement.responsibles_display || '-'}</td>
                <td><AgreementStatusBadge status={visibleStatus.status} label={visibleStatus.label} /></td>
                <td>{formatDate(agreement.last_update_date)}</td>
                <td>
                  <Link href={`/acuerdos-metropolitanos/acuerdos/${agreement.id}`}>Ver</Link>
                </td>
              </tr>
            );
          })}
          {loading && (
            <tr>
              <td colSpan="9" className={styles.empty}>Verificando acuerdos registrados...</td>
            </tr>
          )}
          {!loading && !agreements.length && (
            <tr>
              <td colSpan="9" className={styles.empty}>Sin acuerdos para mostrar.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
