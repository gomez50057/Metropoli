"use client";

import { useEffect, useMemo, useState } from 'react';
import { useSession } from '../auth/SessionProvider';
import ExportButtons from '../exports/ExportButtons';
import { exportAgreements, getAgreements } from '../services/agreementsApi';
import { canExportAgreements } from '../utils/permissions';
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

export default function AgreementsList() {
  const { user } = useSession();
  const [agreements, setAgreements] = useState([]);
  const [page, setPage] = useState(1);
  const [pageInfo, setPageInfo] = useState({ count: 0, next: null, previous: null });
  const [filters, setFilters] = useState({ search: '', status: '', year: '', committed_date: '', semaphore: '' });
  const [error, setError] = useState('');
  const canExport = canExportAgreements(user?.role);

  const params = useMemo(() => {
    const clean = {};
    Object.entries(filters).forEach(([key, value]) => {
      if (value) clean[key] = value;
    });
    clean.page = page;
    return clean;
  }, [filters, page]);

  useEffect(() => {
    let active = true;

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
      });

    return () => {
      active = false;
    };
  }, [params]);

  function updateFilter(event) {
    const { name, value } = event.target;
    setPage(1);
    setFilters((current) => ({ ...current, [name]: value }));
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
      <AgreementFilters filters={filters} onChange={updateFilter} />
      {error && <div className={styles.alert}>{error}</div>}
      <AgreementsTable agreements={agreements} />
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
