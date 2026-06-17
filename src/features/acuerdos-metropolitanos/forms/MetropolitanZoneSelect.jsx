"use client";

import Select from 'react-select';
import { ErrorMessage } from 'formik';
import styles from './AgreementForm.module.css';

export default function MetropolitanZoneSelect({ zones, value, onChange }) {
  const selected = zones.find((zone) => zone.value === value) || null;

  return (
    <div className={styles.formGroup}>
      <label htmlFor="zone">Zona metropolitana</label>
      <Select
        inputId="zone"
        name="zone"
        className={styles.reactSelect}
        classNamePrefix="react-select"
        options={zones}
        value={selected}
        onChange={(option) => onChange(option?.value || '')}
        placeholder="Selecciona una zona"
        isClearable
      />
      <ErrorMessage name="zone" component="div" className={styles.error} />
    </div>
  );
}
