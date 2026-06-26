"use client";

import Select from 'react-select';
import { AGREEMENT_STATUSES } from '../constants/statuses';
import AgreementSearch from './AgreementSearch';
import styles from './AgreementsList.module.css';

const YEARS = Array.from(
  { length: new Date().getFullYear() - 2022 },
  (_, index) => new Date().getFullYear() - index
);

export default function AgreementFilters({
  filters,
  zones,
  responsibles,
  topics,
  showGlobalStatus,
  onChange,
  onResponsibleChange,
  onClear,
}) {
  const responsibleOptions = responsibles.map((item) => ({
    value: String(item.id),
    label: item.name,
  }));
  const selectedResponsibles = responsibleOptions.filter((item) => filters.responsible.includes(item.value));

  return (
    <div className={styles.filters}>
      <AgreementSearch value={filters.search} onChange={onChange} />
      <select name="year" aria-label="Año" value={filters.year} onChange={onChange}>
        <option value="">Todos los años</option>
        {YEARS.map((year) => <option key={year} value={year}>{year}</option>)}
      </select>
      <select name="zone" aria-label="Zona metropolitana" value={filters.zone} onChange={onChange}>
        <option value="">Todas las zonas</option>
        {zones.map((zone) => <option key={zone.id} value={zone.code}>{zone.name}</option>)}
      </select>
      <Select
        inputId="responsible-filter"
        className={styles.reactSelect}
        classNamePrefix="react-select"
        options={responsibleOptions}
        value={selectedResponsibles}
        onChange={(options) => onResponsibleChange((options || []).map((item) => item.value))}
        placeholder="Todos los responsables"
        noOptionsMessage={() => 'Sin responsables'}
        isMulti
        isClearable
      />
      <select name="topic" aria-label="Tema" value={filters.topic} onChange={onChange}>
        <option value="">Todos los temas</option>
        {topics.map((topic) => <option key={topic.id} value={topic.id}>{topic.name}</option>)}
      </select>
      {showGlobalStatus && (
        <select name="status" value={filters.status} onChange={onChange}>
          <option value="">Todos los estatus</option>
          {AGREEMENT_STATUSES.map((status) => (
            <option key={status.value} value={status.value}>{status.label}</option>
          ))}
        </select>
      )}
      <select name="validation_status" aria-label="Estado de actualización" value={filters.validation_status} onChange={onChange}>
        <option value="">Todas las actualizaciones</option>
        <option value="PENDIENTE">Con actualización pendiente</option>
        <option value="VALIDADA">Con actualización validada</option>
        <option value="RECHAZADA">Con actualización rechazada</option>
      </select>
      <input name="date" type="date" aria-label="Fecha del acuerdo" value={filters.date} onChange={onChange} />
      <button type="button" className={styles.clearFilters} onClick={onClear}>Limpiar filtros</button>
    </div>
  );
}
