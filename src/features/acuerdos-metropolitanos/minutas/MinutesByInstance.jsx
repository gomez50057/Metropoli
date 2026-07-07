"use client";

import { useEffect, useMemo, useState } from 'react';
import ConfirmDialog from '@/components/shared/ConfirmDialog';
import StatusMessage from '@/components/shared/StatusMessage';
import { useSession } from '../auth/SessionProvider';
import { getInstances, getZones } from '../services/agreementsApi';
import { createMinute, deleteMinute, getMinutes, openMinute, updateMinute } from '../services/minutesApi';
import { canManageAgreements } from '../utils/permissions';
import MinutesAccordion from './MinutesAccordion';
import MinutesFilters from './MinutesFilters';
import styles from './MinutesByInstance.module.css';

const emptyForm = {
  title: '',
  description: '',
  document_type: 'Minuta',
  date: '',
  zone: '',
  instance: '',
  file: null,
};

function asArray(data) {
  return Array.isArray(data) ? data : data?.results || [];
}

function groupByInstance(minutes) {
  return minutes.reduce((groups, minute) => {
    const key = minute.instance_name || minute.instance_code || 'Sin responsable';
    groups[key] = [...(groups[key] || []), minute];
    return groups;
  }, {});
}

export default function MinutesByInstance() {
  const { user } = useSession();
  const canManage = canManageAgreements(user?.role);
  const [minutes, setMinutes] = useState([]);
  const [zones, setZones] = useState([]);
  const [formInstances, setFormInstances] = useState([]);
  const [zone, setZone] = useState('');
  const [instance, setInstance] = useState('');
  const [search, setSearch] = useState('');
  const [form, setForm] = useState(emptyForm);
  const [formKey, setFormKey] = useState(0);
  const [editing, setEditing] = useState(null);
  const [pendingSave, setPendingSave] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    let active = true;
    Promise.all([
      getMinutes(),
      canManage ? getZones() : Promise.resolve([]),
    ])
      .then(([minuteData, zoneData]) => {
        if (!active) return;
        setMinutes(asArray(minuteData));
        setZones(asArray(zoneData));
      })
      .catch(() => {
        if (active) setError('No se pudieron cargar las minutas.');
      });
    return () => {
      active = false;
    };
  }, [canManage]);

  useEffect(() => {
    if (!canManage || !form.zone) {
      setFormInstances([]);
      return;
    }
    const selectedZone = zones.find((item) => String(item.id) === String(form.zone));
    if (!selectedZone?.code) return;
    getInstances(selectedZone.code)
      .then((data) => setFormInstances(asArray(data)))
      .catch(() => setFormInstances([]));
  }, [canManage, form.zone, zones]);

  const visibleMinutes = useMemo(() => {
    const base = canManage && zone ? minutes.filter((minute) => minute.zone_code === zone) : minutes;
    const needle = search.trim().toLowerCase();
    if (canManage && !zone) return [];
    return base.filter((minute) => {
      const matchesInstance = !instance || minute.instance_code === instance || minute.instance_name === instance;
      const matchesSearch = !needle || `${minute.document_type} ${minute.name} ${minute.display_name} ${minute.instance_name}`.toLowerCase().includes(needle);
      return matchesInstance && matchesSearch;
    });
  }, [canManage, instance, minutes, search, zone]);

  const instanceCodes = useMemo(() => {
    return [...new Set(minutes.filter((minute) => !zone || minute.zone_code === zone).map((minute) => minute.instance_code || minute.instance_name).filter(Boolean))].sort();
  }, [minutes, zone]);

  const grouped = Object.entries(groupByInstance(visibleMinutes)).sort(([a], [b]) => a.localeCompare(b));
  const selectedFormZone = zones.find((item) => String(item.id) === String(form.zone));
  const instanceLabel = selectedFormZone?.code === 'ZMVM' ? 'Comisión' : 'Subcomisión';

  function updateForm(event) {
    const { name, value, files } = event.target;
    setError('');
    setSuccess('');
    if (name === 'file') {
      setForm((current) => ({ ...current, file: files?.[0] || null }));
      return;
    }
    if (name === 'zone') {
      setForm((current) => ({ ...current, zone: value, instance: '' }));
      return;
    }
    setForm((current) => ({ ...current, [name]: value }));
  }

  function resetForm() {
    setForm(emptyForm);
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
      document_type: item.document_type || 'Minuta',
      date: item.date || '',
      zone: item.zone || '',
      instance: item.instance || '',
      file: null,
    });
    setFormKey((key) => key + 1);
  }

  function validateForm() {
    if (!form.title.trim() || !form.description.trim() || !form.document_type || !form.date || !form.zone || !form.instance || !form.file) {
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
        const updated = await updateMinute(editing.id, form);
        setMinutes((current) => current.map((item) => (item.id === updated.id ? updated : item)));
        setSuccess('Minuta o acta modificada con éxito.');
      } else {
        const created = await createMinute(form);
        setMinutes((current) => [created, ...current]);
        setSuccess('Minuta o acta agregada con éxito.');
      }
      resetForm();
    } catch {
      setError('No se pudo guardar la minuta o acta.');
      setPendingSave(null);
    }
  }

  async function removeItem() {
    if (!pendingDelete) return;
    setError('');
    setSuccess('');
    try {
      await deleteMinute(pendingDelete.id);
      setMinutes((current) => current.filter((item) => item.id !== pendingDelete.id));
      setPendingDelete(null);
      setSuccess('Minuta o acta eliminada con éxito.');
    } catch {
      setError('No se pudo eliminar la minuta o acta.');
    }
  }

  return (
    <section className={styles.page}>
      <div className={styles.heading}>
        <div>
          <h1>Minutas y actas por comisión</h1>
          <p>Consulta de documentos publicados por comisión metropolitana.</p>
        </div>
      </div>
      {canManage && (
        <>
          <form key={formKey} className={styles.form} onSubmit={submitForm}>
            <input name="title" value={form.title} onChange={updateForm} placeholder="Título" required />
            <input name="description" value={form.description} onChange={updateForm} placeholder="Descripción" required />
            <select name="document_type" value={form.document_type} onChange={updateForm} required>
              <option value="Minuta">Minuta</option>
              <option value="Acta">Acta</option>
              <option value="Acuerdo">Acuerdo</option>
            </select>
            <input name="date" value={form.date} onChange={updateForm} type="date" required />
            <select name="zone" value={form.zone} onChange={updateForm} required>
              <option value="">Zona metropolitana</option>
              {zones.map((item) => (
                <option key={item.id || item.code} value={item.id}>{item.name}</option>
              ))}
            </select>
            <select name="instance" value={form.instance} onChange={updateForm} required disabled={!form.zone}>
              <option value="">{instanceLabel}</option>
              {formInstances.map((item) => (
                <option key={item.id || item.value} value={item.id || item.value}>{item.name || item.label}</option>
              ))}
            </select>
            <input name="file" onChange={updateForm} type="file" accept=".pdf,application/pdf" required />
            <button type="submit">{editing ? 'Modificar' : 'Agregar'}</button>
            {editing && <button type="button" onClick={resetForm}>Cancelar</button>}
          </form>
          <MinutesFilters
            zone={zone}
            zones={zones}
            onZoneChange={(nextZone) => {
              setZone(nextZone);
              setInstance('');
              setSearch('');
            }}
            value={instance}
            instances={instanceCodes}
            onChange={setInstance}
            search={search}
            onSearch={setSearch}
          />
        </>
      )}
      {error && <div className={styles.alert}>{error}</div>}
      <StatusMessage message={success} onDismiss={() => setSuccess('')} />
      <div className={styles.grid}>
        {grouped.map(([title, items], index) => (
          <MinutesAccordion
            key={title}
            title={title}
            items={items}
            defaultOpen={index === 0}
            canManage={canManage}
            onOpen={openMinute}
            onEdit={editItem}
            onDelete={setPendingDelete}
          />
        ))}
        {canManage && !zone && <div className={styles.empty}>Selecciona una zona metropolitana para consultar minutas.</div>}
        {!visibleMinutes.length && (!canManage || zone) && <div className={styles.empty}>Sin minutas para mostrar.</div>}
      </div>
      <ConfirmDialog
        isOpen={Boolean(pendingSave)}
        title={pendingSave === 'edit' ? 'Modificar minuta o acta' : 'Agregar minuta o acta'}
        message={pendingSave === 'edit' ? '¿Estás seguro de que quieres guardar los cambios?' : '¿Estás seguro de que quieres agregar esta minuta o acta?'}
        confirmText={pendingSave === 'edit' ? 'Sí, modificar' : 'Sí, agregar'}
        onCancel={() => setPendingSave(null)}
        onConfirm={saveItem}
      />
      <ConfirmDialog
        isOpen={Boolean(pendingDelete)}
        title="Eliminar minuta o acta"
        message={`¿Estás seguro de que quieres eliminar "${pendingDelete?.display_name || 'este documento'}"?`}
        confirmText="Sí, eliminar"
        danger
        onCancel={() => setPendingDelete(null)}
        onConfirm={removeItem}
      />
    </section>
  );
}
