"use client";

import { useEffect, useMemo, useState } from 'react';
import { getMinutes } from '../services/minutesApi';
import MinutesAccordion from './MinutesAccordion';
import MinutesFilters from './MinutesFilters';
import styles from './MinutesByInstance.module.css';

function groupByInstance(minutes) {
  return minutes.reduce((groups, minute) => {
    const key = minute.instance_name || minute.instance_code || 'Sin instancia';
    groups[key] = [...(groups[key] || []), minute];
    return groups;
  }, {});
}

export default function MinutesByInstance() {
  const [minutes, setMinutes] = useState([]);
  const [instance, setInstance] = useState('');
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    getMinutes()
      .then((data) => {
        if (active) setMinutes(Array.isArray(data) ? data : data?.results || []);
      })
      .catch(() => {
        if (active) setError('No se pudieron cargar las minutas.');
      });
    return () => {
      active = false;
    };
  }, []);

  const instanceCodes = useMemo(() => [...new Set(minutes.map((minute) => minute.instance_code).filter(Boolean))].sort(), [minutes]);
  const filtered = useMemo(() => {
    const needle = search.trim().toLowerCase();
    return minutes.filter((minute) => {
      const matchesInstance = !instance || minute.instance_code === instance || minute.group === instance;
      const matchesSearch = !needle || `${minute.document_type} ${minute.name} ${minute.instance_name}`.toLowerCase().includes(needle);
      return matchesInstance && matchesSearch;
    });
  }, [minutes, search, instance]);
  const grouped = Object.entries(groupByInstance(filtered)).sort(([a], [b]) => a.localeCompare(b));

  return (
    <section className={styles.page}>
      <div className={styles.heading}>
        <div>
          <h1>Minutas y actas por comisión</h1>
          <p>Consulta de documentos publicados por comisión metropolitana.</p>
        </div>
      </div>
      <MinutesFilters value={instance} instances={instanceCodes} onChange={setInstance} search={search} onSearch={setSearch} />
      {error && <div className={styles.alert}>{error}</div>}
      <div className={styles.grid}>
        {grouped.map(([title, items], index) => (
          <MinutesAccordion
            key={title}
            title={title}
            items={items}
            defaultOpen={index === 0}
          />
        ))}
        {!filtered.length && <div className={styles.empty}>Sin minutas para mostrar.</div>}
      </div>
    </section>
  );
}
