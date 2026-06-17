"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ConfirmDialog from '@/components/shared/ConfirmDialog';
import { useSession } from '../auth/SessionProvider';
import { canManageAgreements } from '../utils/permissions';
import AgreementsSidebar from './AgreementsSidebar';
import AgreementsTopbar from './AgreementsTopbar';
import styles from './AgreementsLayout.module.css';

const base = '/acuerdos-metropolitanos';

export default function AgreementsShell({ children }) {
  const router = useRouter();
  const { user, logout } = useSession();
  const [confirmLogout, setConfirmLogout] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const canManage = canManageAgreements(user?.role);
  const links = [
    { href: `${base}/dashboard`, label: 'Dashboard' },
    ...(canManage ? [{ href: `${base}/registro`, label: 'Registro' }] : []),
    { href: `${base}/acuerdos`, label: 'Acuerdos' },
    ...(canManage ? [{ href: `${base}/minutas`, label: 'Minutas y actas' }] : []),
    { href: `${base}/antecedentes`, label: 'Antecedentes' },
  ];

  async function handleLogout() {
    await logout();
    router.replace(`${base}/login`);
  }

  return (
    <section className={`${styles.shell} ${sidebarCollapsed ? styles.shellCollapsed : ''}`}>
      <AgreementsSidebar
        links={links}
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed((current) => !current)}
        onLogout={() => setConfirmLogout(true)}
      />
      <div className={styles.content}>
        <AgreementsTopbar user={user} />
        {children}
      </div>
      <ConfirmDialog
        isOpen={confirmLogout}
        title="Cerrar sesión"
        message="¿Estás seguro de que quieres salir?"
        confirmText="Sí, salir"
        danger
        onCancel={() => setConfirmLogout(false)}
        onConfirm={handleLogout}
      />
    </section>
  );
}
