"use client";

import { useEffect, useMemo, useState } from 'react';
import { useSession } from '../auth/SessionProvider';
import ExportButtons from '../exports/ExportButtons';
import { exportAgreements, getAgreements } from '../services/agreementsApi';
import { canExportAgreements } from '../utils/permissions';
import AgreementFilters from './AgreementFilters';
import AgreementsTable from './AgreementsTable';
import styles from './AgreementsList.module.css';

function normalizeList(data) {
  return Array.isArray(data) ? data : data?.results || [];
}

export default function AgreementsList() {
  const { user } = useSession();
  const [agreements, setAgreements] = useState([]);
  const [filters, setFilters] = useState({ search: '', status: '', year: '', committed_date: '', semaphore: '' });
  const [error, setError] = useState('');
  const canExport = canExportAgreements(user?.role);

  const params = useMemo(() => {
    const clean = {};
    Object.entries(filters).forEach(([key, value]) => {
      if (value) clean[key] = value;
    });
    return clean;
  }, [filters]);

  useEffect(() => {
    let active = true;

    getAgreements(params)
      .then((data) => {
        if (active) setAgreements(normalizeList(data));
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
    </section>
  );
}
