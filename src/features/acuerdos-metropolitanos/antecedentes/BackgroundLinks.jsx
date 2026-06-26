"use client";

import { useEffect, useState } from 'react';
import ConfirmDialog from '@/components/shared/ConfirmDialog';
import { useSession } from '../auth/SessionProvider';
import { createBackground, deleteBackground, getBackgrounds, openBackground, updateBackground } from '../services/backgroundsApi';
import { getResponsibles } from '../services/agreementsApi';
import { isAdministrator } from '../utils/permissions';
import BackgroundLinkForm from './BackgroundLinkForm';
import styles from './BackgroundLinks.module.css';

function asArray(data) {
  return Array.isArray(data) ? data : data?.results || [];
}

export default function BackgroundLinks() {
  const { user } = useSession();
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', file: null, responsibles: [] });
  const [formKey, setFormKey] = useState(0);
  const [editing, setEditing] = useState(null);
  const [responsibles, setResponsibles] = useState([]);
  const [error, setError] = useState('');
  const [pendingDelete, setPendingDelete] = useState(null);
  const canManage = isAdministrator(user?.role);

  useEffect(() => {
    getBackgrounds().then((data) => setItems(asArray(data))).catch(() => {
      setError('No se pudieron cargar los antecedentes.');
    });
  }, []);

  useEffect(() => {
    if (canManage) getResponsibles().then(setResponsibles).catch(() => {});
  }, [canManage]);

  function updateForm(event) {
    const { name, value, files } = event.target;
    if (name === 'responsibles') {
      setForm((current) => ({ ...current, responsibles: value }));
      return;
    }
    if (name === 'file') {
      setForm((current) => ({ ...current, file: files?.[0] || null }));
      return;
    }
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function submitForm(event) {
    event.preventDefault();
    setError('');
    if (!form.responsibles.length) {
      setError('Selecciona al menos un responsable.');
      return;
    }

    try {
      if (editing) {
        const updated = await updateBackground(editing.id, form);
        setItems((current) => current.map((item) => (item.id === updated.id ? updated : item)));
      } else {
        const created = await createBackground(form);
        setItems((current) => [created, ...current]);
      }
      resetForm();
    } catch {
      setError('No se pudo guardar el antecedente.');
    }
  }

  function resetForm() {
    setForm({ title: '', description: '', file: null, responsibles: [] });
    setEditing(null);
    setFormKey((key) => key + 1);
  }

  function editItem(item) {
    setEditing(item);
    setForm({
      title: item.title || '',
      description: item.description || '',
      file: null,
      responsibles: item.responsibles || [],
    });
    setFormKey((key) => key + 1);
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
        <BackgroundLinkForm
          key={formKey}
          form={form}
          responsibles={responsibles}
          onChange={updateForm}
          onSubmit={submitForm}
          editing={Boolean(editing)}
          onCancel={resetForm}
        />
      )}
      <div className={styles.list}>
        {items.map((item) => (
          <article className={styles.item} key={item.id}>
            <div>
              <h2>{item.title}</h2>
              <p>{item.description}</p>
              <button type="button" className={styles.linkButton} onClick={() => openBackground(item)}>Abrir documento</button>
            </div>
            {canManage && (
              <div className={styles.actions}>
                <button type="button" onClick={() => editItem(item)}>Editar</button>
                <button type="button" onClick={() => setPendingDelete(item)}>Eliminar</button>
              </div>
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
