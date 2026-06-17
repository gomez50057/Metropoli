"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from './SessionProvider';
import styles from './Auth.module.css';

export default function ProtectedRoute({ children, roles }) {
  const router = useRouter();
  const { status, user } = useSession();
  const allowed = !roles || roles.includes(user?.role);

  useEffect(() => {
    if (status === 'anonymous') {
      router.replace('/acuerdos-metropolitanos/login');
    }
  }, [router, status]);

  if (status === 'loading') {
    return <div className={styles.state}>Cargando sesion...</div>;
  }

  if (status === 'anonymous') {
    return null;
  }

  if (!allowed) {
    return <div className={styles.state}>No tienes permiso para ver esta seccion.</div>;
  }

  return children;
}
