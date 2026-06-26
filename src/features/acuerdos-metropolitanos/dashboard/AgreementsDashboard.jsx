"use client";

import { useEffect, useState } from 'react';
import { useSession } from '../auth/SessionProvider';
import { getDashboardByInstance, getDashboardByZone, getDashboardSummary } from '../services/dashboardApi';
import DashboardCards from './DashboardCards';
import InstanceDynamicPanel from './InstanceDynamicPanel';
import InstanceRanking from './InstanceRanking';
import StatusSummary from './StatusSummary';
import styles from './AgreementsDashboard.module.css';

const ADMIN_ROLES = new Set(['CONTROL_TOTAL', 'ADMINISTRADOR']);

function asArray(value) {
  if (Array.isArray(value)) return value;
  return value?.results || [];
}

export default function AgreementsDashboard() {
  const { user } = useSession();
  const [summary, setSummary] = useState(null);
  const [byInstance, setByInstance] = useState([]);
  const [byZone, setByZone] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    async function loadDashboard() {
      try {
        const [summaryData, instanceData, zoneData] = await Promise.all([
          getDashboardSummary(),
          getDashboardByInstance(),
          getDashboardByZone(),
        ]);

        if (active) {
          setSummary(summaryData);
          setByInstance(asArray(instanceData));
          setByZone(asArray(zoneData));
        }
      } catch {
        if (active) setError('No se pudo cargar el dashboard.');
      }
    }

    loadDashboard();

    return () => {
      active = false;
    };
  }, []);

  return (
    <section className={styles.page}>
      <div className={styles.heading}>
        <h1>Dashboard de acuerdos</h1>
        <p>Indicadores de seguimiento metropolitano.</p>
      </div>
      {error && <div className={styles.alert}>{error}</div>}
      <DashboardCards summary={summary} showPendingValidation={ADMIN_ROLES.has(user?.role)} />
      <div className={styles.columns}>
        <InstanceRanking items={summary?.top_instances || byInstance} />
        {!ADMIN_ROLES.has(user?.role) && <StatusSummary summary={summary} />}
        {user?.role !== 'INSTANCIA' && (
          <section className={styles.panel}>
            <h2>Por zona</h2>
            <ul>
              {byZone.map((item) => (
                <li key={item.id || item.name}>
                  <span>{item.name || item.zone}</span>
                  <strong>{item.total}</strong>
                </li>
              ))}
              {!byZone.length && <li><span>Sin datos</span><strong>0</strong></li>}
            </ul>
          </section>
        )}
        <InstanceDynamicPanel updates={summary?.latest_updates || []} />
      </div>
    </section>
  );
}
