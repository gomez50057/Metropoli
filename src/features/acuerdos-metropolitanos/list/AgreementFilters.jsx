"use client";

import { AGREEMENT_STATUSES } from '../constants/statuses';
import AgreementSearch from './AgreementSearch';
import styles from './AgreementsList.module.css';

export default function AgreementFilters({ filters, onChange }) {
  return (
    <div className={styles.filters}>
      <AgreementSearch value={filters.search} onChange={onChange} />
      <input name="year" type="number" placeholder="Año" value={filters.year} onChange={onChange} />
      <input name="committed_date" type="date" aria-label="Fecha comprometida" value={filters.committed_date} onChange={onChange} />
      <select name="status" value={filters.status} onChange={onChange}>
        <option value="">Todos los estatus</option>
        {AGREEMENT_STATUSES.map((status) => (
          <option key={status.value} value={status.value}>{status.label}</option>
        ))}
      </select>
      <select name="semaphore" value={filters.semaphore} onChange={onChange}>
        <option value="">Todos los semáforos</option>
        <option value="verde">Verde - hasta 15 días</option>
        <option value="amarillo">Amarillo - de 16 a 30 días</option>
        <option value="rojo">Rojo - más de 30 días</option>
        <option value="gris">Gris - cancelado</option>
        <option value="atendido">Atendido - estado cerrado</option>
      </select>
    </div>
  );
}
