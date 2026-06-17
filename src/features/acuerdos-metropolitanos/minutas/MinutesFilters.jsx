"use client";

import styles from './MinutesByInstance.module.css';

export default function MinutesFilters({ value, instances, onChange, search, onSearch }) {
  return (
    <div className={styles.filters}>
      <input
        aria-label="Buscar por tipo de documento, archivo o comision"
        name="search"
        placeholder="Buscar minuta, acta o comision"
        value={search}
        onChange={(event) => onSearch(event.target.value)}
      />
      <select aria-label="Filtrar por comision" name="instance" value={value} onChange={(event) => onChange(event.target.value)}>
        <option value="">Todas las comisiones</option>
        {instances.map((item) => (
          <option key={item} value={item}>{item}</option>
        ))}
      </select>
    </div>
  );
}
