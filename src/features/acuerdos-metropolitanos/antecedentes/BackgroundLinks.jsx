"use client";

import { useEffect, useState } from 'react';
import ConfirmDialog from '@/components/shared/ConfirmDialog';
import StatusMessage from '@/components/shared/StatusMessage';
import { useSession } from '../auth/SessionProvider';
import { createBackground, deleteBackground, getBackgrounds, openBackground, updateBackground } from '../services/backgroundsApi';
import { getResponsibles } from '../services/agreementsApi';
import { canManageAgreements } from '../utils/permissions';
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
  const [success, setSuccess] = useState('');
  const [pendingSave, setPendingSave] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);
  const canManage = canManageAgreements(user?.role);

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
    setError('');
    setSuccess('');
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

  function validateForm() {
    if (!form.title.trim() || !form.description.trim() || !form.file || !form.responsibles.length) {
      return 'Todos los campos son obligatorios.';
    }
    return '';
  }

  function submitForm(event) {
    event.preventDefault();
    setError('');
    setSuccess('');
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }
    setPendingSave(editing ? 'edit' : 'add');
  }

  async function saveItem() {
    if (!pendingSave) return;
    setError('');
    setSuccess('');
    try {
      if (pendingSave === 'edit') {
        const updated = await updateBackground(editing.id, form);
        setItems((current) => current.map((item) => (item.id === updated.id ? updated : item)));
        setSuccess('Antecedente modificado con éxito.');
      } else {
        const created = await createBackground(form);
        setItems((current) => [created, ...current]);
        setSuccess('Antecedente agregado con éxito.');
      }
      resetForm();
    } catch {
      setError('No se pudo guardar el antecedente.');
      setPendingSave(null);
    }
  }

  function resetForm() {
    setForm({ title: '', description: '', file: null, responsibles: [] });
    setEditing(null);
    setPendingSave(null);
    setFormKey((key) => key + 1);
  }

  function editItem(item) {
    setError('');
    setSuccess('');
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
    setError('');
    setSuccess('');
    try {
      await deleteBackground(pendingDelete.id);
      setItems((current) => current.filter((item) => item.id !== pendingDelete.id));
      setPendingDelete(null);
      setSuccess('Antecedente eliminado con éxito.');
    } catch {
      setError('No se pudo eliminar el antecedente.');
    }
  }

  return (
    <section className={styles.page}>
      <div className={styles.heading}>
        <h1>Antecedentes</h1>
        <p>Documentos y ligas de referencia del módulo.</p>
      </div>
      {error && <div className={styles.alert}>{error}</div>}
      <StatusMessage message={success} onDismiss={() => setSuccess('')} />
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
        isOpen={Boolean(pendingSave)}
        title={pendingSave === 'edit' ? 'Modificar antecedente' : 'Agregar antecedente'}
        message={pendingSave === 'edit' ? '¿Estás seguro de que quieres guardar los cambios?' : '¿Estás seguro de que quieres agregar este antecedente?'}
        confirmText={pendingSave === 'edit' ? 'Sí, modificar' : 'Sí, agregar'}
        onCancel={() => setPendingSave(null)}
        onConfirm={saveItem}
      />
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
