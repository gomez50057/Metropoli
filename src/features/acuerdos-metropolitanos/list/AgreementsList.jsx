"use client";

import { useEffect, useMemo, useState } from 'react';
import { useSession } from '../auth/SessionProvider';
import ExportButtons from '../exports/ExportButtons';
import {
  exportAgreements,
  getAgreements,
  getResponsibles,
  getTopics,
  getZones,
} from '../services/agreementsApi';
import { canExportAgreements, canManageAgreements } from '../utils/permissions';
import AgreementFilters from './AgreementFilters';
import AgreementsTable from './AgreementsTable';
import styles from './AgreementsList.module.css';

function normalizePage(data) {
  if (Array.isArray(data)) {
    return { results: data, count: data.length, next: null, previous: null };
  }
  return {
    results: data?.results || [],
    count: data?.count || 0,
    next: data?.next || null,
    previous: data?.previous || null,
  };
}

const EMPTY_FILTERS = {
  search: '',
  status: '',
  year: '',
  zone: '',
  responsible: [],
  topic: '',
  validation_status: '',
  date: '',
};

export default function AgreementsList() {
  const { user } = useSession();
  const [agreements, setAgreements] = useState([]);
  const [page, setPage] = useState(1);
  const [pageInfo, setPageInfo] = useState({ count: 0, next: null, previous: null });
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [zones, setZones] = useState([]);
  const [responsibles, setResponsibles] = useState([]);
  const [topics, setTopics] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const canExport = canExportAgreements(user?.role);
  const showGlobalStatus = canManageAgreements(user?.role);

  useEffect(() => {
    Promise.all([getZones(), getTopics()])
      .then(([zoneData, topicData]) => {
        setZones(zoneData);
        setTopics(topicData);
      })
      .catch(() => setError('No se pudieron cargar los catálogos de filtros.'));
  }, []);

  useEffect(() => {
    getResponsibles(filters.zone)
      .then(setResponsibles)
      .catch(() => setError('No se pudieron cargar los responsables.'));
  }, [filters.zone]);

  const params = useMemo(() => {
    const clean = {};
    Object.entries(filters).forEach(([key, value]) => {
      if (Array.isArray(value) ? value.length : value) {
        clean[key] = Array.isArray(value) ? value.join(',') : value;
      }
    });
    clean.page = page;
    return clean;
  }, [filters, page]);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setAgreements([]);

    getAgreements(params)
      .then((data) => {
        if (active) {
          const normalized = normalizePage(data);
          setAgreements(normalized.results);
          setPageInfo(normalized);
          setError('');
        }
      })
      .catch(() => {
        if (active) setError('No se pudo cargar el listado.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [params]);

  function updateFilter(event) {
    const { name, multiple, selectedOptions, value } = event.target;
    setPage(1);
    setFilters((current) => ({
      ...current,
      [name]: multiple ? Array.from(selectedOptions, (option) => option.value) : value,
      ...(name === 'zone' ? { responsible: [] } : {}),
    }));
  }

  return (
    <section className={styles.page}>
      <div className={styles.heading}>
        <div>
          <h1>Acuerdos registrados</h1>
          <p>Consulta, filtros y descarga operativa.</p>
        </div>
        {canExport && (
          <ExportButtons onExport={(format) => exportAgreements(format, params)} />
        )}
      </div>
      <AgreementFilters
        filters={filters}
        zones={zones}
        responsibles={responsibles}
        topics={topics}
        showGlobalStatus={showGlobalStatus}
        onChange={updateFilter}
        onResponsibleChange={(responsible) => {
          setPage(1);
          setFilters((current) => ({ ...current, responsible }));
        }}
        onClear={() => {
          setPage(1);
          setFilters(EMPTY_FILTERS);
        }}
      />
      {error && <div className={styles.alert}>{error}</div>}
      <AgreementsTable agreements={agreements} showGlobalStatus={showGlobalStatus} loading={loading} />
      {(pageInfo.previous || pageInfo.next) && (
        <nav className={styles.pagination} aria-label="Paginación de acuerdos">
          <button type="button" disabled={!pageInfo.previous} onClick={() => setPage((value) => value - 1)}>
            Anterior
          </button>
          <span>Página {page} · {pageInfo.count} acuerdos</span>
          <button type="button" disabled={!pageInfo.next} onClick={() => setPage((value) => value + 1)}>
            Siguiente
          </button>
        </nav>
      )}
    </section>
  );
}
