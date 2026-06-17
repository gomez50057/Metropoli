"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined';
import ListAltOutlinedIcon from '@mui/icons-material/ListAltOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import MenuOpenOutlinedIcon from '@mui/icons-material/MenuOpenOutlined';
import NoteAddOutlinedIcon from '@mui/icons-material/NoteAddOutlined';
import styles from './AgreementsLayout.module.css';

function getIcon(href) {
  if (href.endsWith('/dashboard')) return <DashboardOutlinedIcon fontSize="small" />;
  if (href.endsWith('/registro')) return <NoteAddOutlinedIcon fontSize="small" />;
  if (href.endsWith('/acuerdos')) return <ListAltOutlinedIcon fontSize="small" />;
  if (href.endsWith('/minutas')) return <DescriptionOutlinedIcon fontSize="small" />;
  return <FolderOutlinedIcon fontSize="small" />;
}

export default function AgreementsSidebar({ links, collapsed, onToggle, onLogout }) {
  const pathname = usePathname();

  return (
    <aside className={`${styles.sidebar} ${collapsed ? styles.sidebarCollapsed : ''}`}>
      <button type="button" className={styles.sidebarToggle} onClick={onToggle} aria-label={collapsed ? 'Expandir menu' : 'Contraer menu'}>
        <MenuOpenOutlinedIcon fontSize="small" />
      </button>
      <div className={styles.sidebarTitle}>
        <p className={styles.eyebrow}>Metropoli</p>
        <h2>Acuerdos</h2>
      </div>
      <nav className={styles.nav} aria-label="Modulo de acuerdos">
        {links.map((link) => (
          <Link key={link.href} href={link.href} className={pathname === link.href ? styles.active : ''} title={link.label}>
            {getIcon(link.href)}
            <span>{link.label}</span>
          </Link>
        ))}
      </nav>
      <button type="button" className={styles.logout} onClick={onLogout} title="Cerrar sesion">
        <LogoutOutlinedIcon fontSize="small" />
        <span>Cerrar sesion</span>
      </button>
    </aside>
  );
}
