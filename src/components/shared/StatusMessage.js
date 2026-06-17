"use client";

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import styles from './StatusMessage.module.css';

export default function StatusMessage({ message, onDismiss }) {
  const [mounted, setMounted] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!message) return undefined;
    setLeaving(false);
    const leaveTimer = setTimeout(() => setLeaving(true), 3500);
    const dismissTimer = setTimeout(onDismiss, 3900);
    return () => {
      clearTimeout(leaveTimer);
      clearTimeout(dismissTimer);
    };
  }, [message, onDismiss]);

  if (!mounted || !message) return null;

  return createPortal(
    <div className={`${styles.message} ${leaving ? styles.leaving : ''}`} role="status" aria-live="polite">
      <CheckCircleOutlineIcon />
      <span>{message}</span>
    </div>,
    document.body
  );
}
