"use client";

import styles from './MinutesByInstance.module.css';

export default function MinutesFilters({ zone, zones, onZoneChange, value, instances, onChange, search, onSearch }) {
  return (
    <div className={styles.filters}>
      <select aria-label="Filtrar por zona metropolitana" name="zone" value={zone} onChange={(event) => onZoneChange(event.target.value)}>
        <option value="">Selecciona una zona metropolitana</option>
        {zones.map((item) => (
          <option key={item.code || item.value} value={item.code || item.value}>{item.name || item.label}</option>
        ))}
      </select>
      <input
        aria-label="Buscar por tipo de documento, archivo o comision"
        name="search"
        placeholder="Buscar minuta, acta o comision"
        value={search}
        onChange={(event) => onSearch(event.target.value)}
        disabled={!zone}
      />
      <select aria-label="Filtrar por comision" name="instance" value={value} onChange={(event) => onChange(event.target.value)} disabled={!zone}>
        <option value="">Todas las comisiones</option>
        {instances.map((item) => (
          <option key={item} value={item}>{item}</option>
        ))}
      </select>
    </div>
  );
}
