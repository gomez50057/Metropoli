"use client";

import Select from 'react-select';
import styles from './AgreementForm.module.css';

export default function TopicSelect({ topics, value, onChange }) {
  const selected = topics.find((topic) => topic.value === value) || null;

  return (
    <div className={styles.formGroup}>
      <label htmlFor="topic">Tema</label>
      <Select
        inputId="topic"
        name="topic"
        className={styles.reactSelect}
        classNamePrefix="react-select"
        options={topics}
        value={selected}
        onChange={(option) => onChange(option?.value || '')}
        placeholder="Sin tema"
        isClearable
      />
    </div>
  );
}
