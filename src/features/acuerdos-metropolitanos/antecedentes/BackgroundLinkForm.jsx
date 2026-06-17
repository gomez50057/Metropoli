"use client";

import styles from './BackgroundLinks.module.css';

export default function BackgroundLinkForm({ form, onChange, onSubmit }) {
  return (
    <form className={styles.form} onSubmit={onSubmit}>
      <input name="title" value={form.title} onChange={onChange} placeholder="Titulo" required />
      <input name="url" value={form.url} onChange={onChange} placeholder="URL" type="url" required />
      <input name="description" value={form.description} onChange={onChange} placeholder="Descripcion" />
      <button type="submit">Agregar</button>
    </form>
  );
}
