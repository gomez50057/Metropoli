"use client";

import { useEffect, useMemo, useState } from 'react';
import { getZones } from '../services/agreementsApi';
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
  const [zones, setZones] = useState([]);
  const [zone, setZone] = useState('');
  const [instance, setInstance] = useState('');
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    Promise.all([getZones(), getMinutes()])
      .then(([zoneData, minuteData]) => {
        if (!active) return;
        setZones(Array.isArray(zoneData) ? zoneData : zoneData?.results || []);
        setMinutes(Array.isArray(minuteData) ? minuteData : minuteData?.results || []);
      })
      .catch(() => {
        if (active) setError('No se pudieron cargar las minutas o zonas.');
      });
    return () => {
      active = false;
    };
  }, []);

  const zoneMinutes = useMemo(() => minutes.filter((minute) => minute.zone === zone), [minutes, zone]);
  const instanceCodes = useMemo(() => [...new Set(zoneMinutes.map((minute) => minute.instance_code).filter(Boolean))].sort(), [zoneMinutes]);
  const filtered = useMemo(() => {
    const needle = search.trim().toLowerCase();
    if (!zone) return [];
    return zoneMinutes.filter((minute) => {
      const matchesInstance = !instance || minute.instance_code === instance || minute.group === instance;
      const matchesSearch = !needle || `${minute.document_type} ${minute.name} ${minute.instance_name}`.toLowerCase().includes(needle);
      return matchesInstance && matchesSearch;
    });
  }, [zone, zoneMinutes, search, instance]);
  const grouped = Object.entries(groupByInstance(filtered)).sort(([a], [b]) => a.localeCompare(b));

  return (
    <section className={styles.page}>
      <div className={styles.heading}>
        <div>
          <h1>Minutas y actas por comisión</h1>
          <p>Consulta de documentos publicados por comisión metropolitana.</p>
        </div>
      </div>
      <MinutesFilters
        zone={zone}
        zones={zones}
        onZoneChange={(nextZone) => {
          setZone(nextZone);
          setInstance('');
          setSearch('');
        }}
        value={instance}
        instances={instanceCodes}
        onChange={setInstance}
        search={search}
        onSearch={setSearch}
      />
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
        {!zone && <div className={styles.empty}>Selecciona una zona metropolitana para consultar minutas.</div>}
        {zone && !filtered.length && <div className={styles.empty}>Sin minutas para mostrar.</div>}
      </div>
    </section>
  );
}
