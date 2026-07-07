"use client";

import ResponsibleMultiSelect from '../forms/ResponsibleMultiSelect';
import styles from './BackgroundLinks.module.css';

export default function BackgroundLinkForm({ form, onChange, onSubmit, responsibles, editing, onCancel }) {
  return (
    <form className={styles.form} onSubmit={onSubmit}>
      <input name="title" value={form.title} onChange={onChange} placeholder="Título" required />
      <input name="description" value={form.description} onChange={onChange} placeholder="Descripción" required />
      <input name="file" onChange={onChange} type="file" accept=".pdf,application/pdf" required />
      <ResponsibleMultiSelect
        responsibles={responsibles}
        value={form.responsibles}
        onChange={(selected) => onChange({ target: { name: 'responsibles', value: selected } })}
        allowCustom={false}
        showError={false}
      />
      <button type="submit">{editing ? 'Modificar' : 'Agregar'}</button>
      {editing && <button type="button" onClick={onCancel}>Cancelar</button>}
    </form>
  );
}
