"use client";

import { roleLabel } from '../constants/roles';
import styles from './AgreementsLayout.module.css';

export default function AgreementsTopbar({ user }) {
  return (
    <header className={styles.topbar}>
      <div>
        <p className={styles.eyebrow}>Sesion activa</p>
        <strong>{user?.username}</strong>
      </div>
      <span>{roleLabel(user?.role)}</span>
    </header>
  );
}
