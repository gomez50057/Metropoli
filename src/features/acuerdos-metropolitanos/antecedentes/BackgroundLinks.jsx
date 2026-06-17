"use client";

import { useEffect, useState } from 'react';
import ConfirmDialog from '@/components/shared/ConfirmDialog';
import { useSession } from '../auth/SessionProvider';
import { createBackground, deleteBackground, getBackgrounds } from '../services/backgroundsApi';
import { canManageAgreements } from '../utils/permissions';
import BackgroundLinkForm from './BackgroundLinkForm';
import styles from './BackgroundLinks.module.css';

function asArray(data) {
  return Array.isArray(data) ? data : data?.results || [];
}

export default function BackgroundLinks() {
  const { user } = useSession();
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ title: '', url: '', description: '' });
  const [error, setError] = useState('');
  const [pendingDelete, setPendingDelete] = useState(null);
  const canManage = canManageAgreements(user?.role);

  useEffect(() => {
    getBackgrounds().then((data) => setItems(asArray(data))).catch(() => {
      setError('No se pudieron cargar los antecedentes.');
    });
  }, []);

  function updateForm(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function submitForm(event) {
    event.preventDefault();
    setError('');

    try {
      const created = await createBackground(form);
      setItems((current) => [created, ...current]);
      setForm({ title: '', url: '', description: '' });
    } catch {
      setError('No se pudo guardar el antecedente.');
    }
  }

  async function removeItem() {
    if (!pendingDelete) return;
    await deleteBackground(pendingDelete.id);
    setItems((current) => current.filter((item) => item.id !== pendingDelete.id));
    setPendingDelete(null);
  }

  return (
    <section className={styles.page}>
      <div className={styles.heading}>
        <h1>Antecedentes</h1>
        <p>Documentos y ligas de referencia del módulo.</p>
      </div>
      {error && <div className={styles.alert}>{error}</div>}
      {canManage && (
        <BackgroundLinkForm form={form} onChange={updateForm} onSubmit={submitForm} />
      )}
      <div className={styles.list}>
        {items.map((item) => (
          <article className={styles.item} key={item.id}>
            <div>
              <h2>{item.title}</h2>
              <p>{item.description}</p>
              <a href={item.url} target="_blank" rel="noreferrer">Abrir documento</a>
            </div>
            {canManage && (
              <button type="button" onClick={() => setPendingDelete(item)}>Eliminar</button>
            )}
          </article>
        ))}
        {!items.length && <div className={styles.empty}>Sin antecedentes registrados.</div>}
      </div>
      <ConfirmDialog
        isOpen={Boolean(pendingDelete)}
        title="Eliminar antecedente"
        message={`¿Estás seguro de que quieres eliminar "${pendingDelete?.title || 'este antecedente'}"?`}
        confirmText="Sí, eliminar"
        danger
        onCancel={() => setPendingDelete(null)}
        onConfirm={removeItem}
      />
    </section>
  );
}
