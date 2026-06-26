"use client";

import { useState } from 'react';
import Select from 'react-select';
import { ErrorMessage } from 'formik';
import styles from './AgreementForm.module.css';

const CATEGORY_ORDER = ['MUNICIPIO', 'ESTADO', 'DEPENDENCIA', 'ORGANISMO', 'INSTANCIA'];
const CUSTOM_PREFIX = '__custom__:';
const OTHER_VALUE = '__other__';
const OTHER_OPTION = { value: OTHER_VALUE, label: 'Otro' };

function customLabel(input) {
  const text = input.trim().replace(/^otro\s*:\s*/i, '');
  return text ? `Otro: ${text}` : '';
}

export default function ResponsibleMultiSelect({ responsibles, value, onChange, allowCustom = true, showError = true }) {
  const [customText, setCustomText] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const uniqueResponsibles = [...new Map(responsibles.map((item) => [item.label.trim().toLocaleLowerCase('es-MX'), item])).values()]
    .filter((item) => !/^otr[oa]$/i.test(item.label.trim()));
  const selected = (value || []).map((item) => {
    const found = uniqueResponsibles.find((option) => String(option.value) === String(item));
    if (found) return found;
    if (String(item).startsWith(CUSTOM_PREFIX)) {
      return { value: item, label: String(item).slice(CUSTOM_PREFIX.length) };
    }
    return null;
  }).filter(Boolean);
  const grouped = CATEGORY_ORDER.map((category) => {
    const options = uniqueResponsibles.filter((item) => item.category === category);
    return options.length ? { label: options[0].categoryLabel, options } : null;
  }).filter(Boolean);
  const options = allowCustom ? [...grouped, { label: 'Personalizado', options: [OTHER_OPTION] }] : grouped;

  function addCustomOption() {
    const label = customLabel(customText);
    if (!label) return;
    onChange([...new Set([...(value || []), `${CUSTOM_PREFIX}${label}`])]);
    setCustomText('');
    setShowCustomInput(false);
  }

  return (
    <div className={styles.formGroup}>
      <label htmlFor="responsibles">Responsables</label>
      <Select
        inputId="responsibles"
        name="responsibles"
        className={styles.reactSelect}
        classNamePrefix="react-select"
        options={options}
        value={selected}
        onChange={(items) => {
          const values = (items || []).map((option) => option.value);
          setShowCustomInput(values.includes(OTHER_VALUE));
          onChange([...new Set(values.filter((item) => item !== OTHER_VALUE))]);
        }}
        placeholder="Selecciona responsables"
        isMulti
      />
      {showCustomInput && (
        <div className={styles.customOptionRow}>
          <input
            type="text"
            value={customText}
            onChange={(event) => setCustomText(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                addCustomOption();
              }
            }}
            placeholder="Nombre del responsable"
          />
          <button type="button" onClick={addCustomOption}>Agregar</button>
        </div>
      )}
      {showError && <ErrorMessage name="responsibles" component="div" className={styles.error} />}
    </div>
  );
}
