"use client";

import { AGREEMENT_STATUSES } from '../constants/statuses';
import AgreementSearch from './AgreementSearch';
import styles from './AgreementsList.module.css';

export default function AgreementFilters({ filters, onChange }) {
  return (
    <div className={styles.filters}>
      <AgreementSearch value={filters.search} onChange={onChange} />
      <input name="year" type="number" placeholder="Anio" value={filters.year} onChange={onChange} />
      <select name="status" value={filters.status} onChange={onChange}>
        <option value="">Todos los estatus</option>
        {AGREEMENT_STATUSES.map((status) => (
          <option key={status.value} value={status.value}>{status.label}</option>
        ))}
      </select>
      <select name="without_recent_update" value={filters.without_recent_update} onChange={onChange}>
        <option value="">Todos los semaforos</option>
        <option value="true">Sin actualizacion reciente</option>
      </select>
    </div>
  );
}
