"use client";

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import styles from './StatusMessage.module.css';

export default function StatusMessage({ message, seconds = 7, onDismiss }) {
  const [mounted, setMounted] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [timeLeft, setTimeLeft] = useState(seconds);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    setTimeLeft(seconds);
    setLeaving(false);
  }, [message, seconds]);

  function dismiss() {
    setLeaving(true);
    setTimeout(onDismiss, 220);
  }

  useEffect(() => {
    if (!message) return undefined;
    const timer = setInterval(() => {
      setTimeLeft((current) => {
        if (current <= 1) {
          clearInterval(timer);
          dismiss();
          return 0;
        }
        return current - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [message]);

  if (!mounted || !message) return null;

  return createPortal(
    <div className={`${styles.message} ${leaving ? styles.leaving : ''}`} role="status" aria-live="polite">
      <span>{message}</span>
      <span className={styles.counter}>{timeLeft}s</span>
      <button type="button" className={styles.close} onClick={dismiss} aria-label="Cerrar mensaje">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M6 6l12 12M18 6L6 18" />
        </svg>
      </button>
      <span className={styles.progress} style={{ transform: `scaleX(${timeLeft / seconds})` }} />
    </div>,
    document.body
  );
}
