"use client";

import Select from 'react-select';
import { ErrorMessage } from 'formik';
import styles from './AgreementForm.module.css';

export default function InstanceMultiSelect({ instances, value, onChange }) {
  const selected = instances.filter((instance) => value.includes(instance.value));

  return (
    <div className={styles.formGroup}>
      <label htmlFor="instances">Instancias participantes</label>
      <Select
        inputId="instances"
        name="instances"
        className={styles.reactSelect}
        classNamePrefix="react-select"
        options={instances}
        value={selected}
        onChange={(options) => onChange((options || []).map((option) => option.value))}
        placeholder="Selecciona instancias"
        isMulti
        isDisabled={!instances.length}
      />
      <ErrorMessage name="instances" component="div" className={styles.error} />
    </div>
  );
}
