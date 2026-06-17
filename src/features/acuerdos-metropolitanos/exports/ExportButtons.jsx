"use client";

import styles from './ExportButtons.module.css';

export default function ExportButtons({ onExport }) {
  return (
    <div className={styles.actions}>
      <button type="button" onClick={() => onExport('csv')}>CSV</button>
      <button type="button" onClick={() => onExport('xlsx')}>XLSX</button>
    </div>
  );
}
