"use client";

import { useEffect, useRef, useState } from 'react';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import Select from 'react-select';
import * as Yup from 'yup';
import ConfirmDialog from '@/components/shared/ConfirmDialog';
import { AGREEMENT_STATUSES } from '../constants/statuses';
import { getInstances, getTopics, getZones } from '../services/agreementsApi';
import InstanceMultiSelect from './InstanceMultiSelect';
import TopicSelect from './TopicSelect';
import styles from './AgreementForm.module.css';

const schema = Yup.object({
  date: Yup.string().required('La fecha es obligatoria.'),
  zone: Yup.mixed().required('Selecciona una zona.'),
  instances: Yup.array().min(1, 'Selecciona al menos una instancia.'),
  description: Yup.string().max(5000, 'Máximo 5000 caracteres.').required('Captura la descripción.'),
});

function options(data) {
  const list = Array.isArray(data) ? data : data?.results || [];
  return list.map((item) => ({
    value: item.value || item.code || item.id,
    label: item.name || item.label,
  }));
}

function zoneOptions(data) {
  const list = Array.isArray(data) ? data : data?.results || [];
  return list.map((item) => ({
    value: item.id,
    code: item.code || item.value,
    label: item.name || item.label,
  }));
}

function otherLast(items) {
  return [...items].sort((a, b) => /^otr[oa]$/i.test(a.label) - /^otr[oa]$/i.test(b.label));
}

export default function AgreementOriginalEditForm({ agreement, onSave }) {
  const [editing, setEditing] = useState(false);
  const [zones, setZones] = useState([]);
  const [instances, setInstances] = useState([]);
  const [topics, setTopics] = useState([]);
  const [confirmSave, setConfirmSave] = useState(false);
  const [saving, setSaving] = useState(false);
  const pendingValues = useRef(null);

  useEffect(() => {
    Promise.all([getZones(), getTopics()])
      .then(([zoneData, topicData]) => {
        setZones(zoneOptions(zoneData));
        setTopics(otherLast(options(topicData)));
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!agreement?.zone) return;
    const zone = zones.find((item) => String(item.value) === String(agreement.zone));
    if (!zone?.code) return;
    getInstances(zone.code)
      .then((data) => setInstances(otherLast(options(data))))
      .catch(() => setInstances([]));
  }, [agreement?.zone, zones]);

  async function loadInstances(zone) {
    setInstances([]);
    if (!zone) return;
    try {
      setInstances(otherLast(options(await getInstances(zone))));
    } catch {
      setInstances([]);
    }
  }

  async function confirmEdit() {
    const values = pendingValues.current;
    setConfirmSave(false);
    if (!values) return;

    setSaving(true);
    const saved = await onSave(values);
    setSaving(false);
    pendingValues.current = null;
    if (saved) setEditing(false);
  }

  if (!agreement) return null;

  if (!editing) {
    return (
      <button type="button" className={styles.editButton} onClick={() => setEditing(true)}>
        Editar acuerdo original
      </button>
    );
  }

  return (
    <Formik
      enableReinitialize
      initialValues={{
        date: agreement.date || '',
        committed_date: agreement.committed_date || '',
        zone: agreement.zone || '',
        instances: agreement.instances || [],
        topic: agreement.topic || '',
        responsible: agreement.responsible || '',
        description: agreement.description || '',
        status: agreement.status || 'EN_PROCESO',
      }}
      validationSchema={schema}
      onSubmit={(values, { setSubmitting }) => {
        setSubmitting(false);
        pendingValues.current = values;
        setConfirmSave(true);
      }}
    >
      {({ isSubmitting, values, setFieldValue }) => (
        <Form className={styles.form}>
          <h2>Editar acuerdo original</h2>
          <div className={styles.grid}>
            <div className={styles.formGroup}>
              <label htmlFor="edit-date">Fecha</label>
              <Field id="edit-date" name="date" type="date" />
              <ErrorMessage name="date" component="div" className={styles.error} />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="edit-committed-date">Fecha comprometida</label>
              <Field id="edit-committed-date" name="committed_date" type="date" />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="edit-status">Estatus</label>
              <Field id="edit-status" name="status" as="select">
                {AGREEMENT_STATUSES.map((status) => (
                  <option key={status.value} value={status.value}>{status.label}</option>
                ))}
              </Field>
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="edit-zone">Zona metropolitana</label>
              <Select
                inputId="edit-zone"
                name="zone"
                className={styles.reactSelect}
                classNamePrefix="react-select"
                options={zones}
                value={zones.find((zone) => String(zone.value) === String(values.zone)) || null}
                onChange={(zone) => {
                  setFieldValue('zone', zone?.value || '');
                  setFieldValue('instances', []);
                  loadInstances(zone?.code);
                }}
                placeholder="Selecciona una zona"
                isClearable
              />
              <ErrorMessage name="zone" component="div" className={styles.error} />
            </div>
            <InstanceMultiSelect
              instances={instances}
              value={values.instances}
              onChange={(selected) => setFieldValue('instances', selected)}
            />
            <TopicSelect topics={topics} value={values.topic} onChange={(topic) => setFieldValue('topic', topic)} />
            <div className={styles.formGroup}>
              <label htmlFor="edit-responsible">Responsable o enlace</label>
              <Field id="edit-responsible" name="responsible" />
            </div>
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="edit-description">Descripción</label>
            <Field id="edit-description" name="description" as="textarea" rows="6" maxLength="5000" />
            <span className={styles.counter}>{values.description.length}/5000</span>
            <ErrorMessage name="description" component="div" className={styles.error} />
          </div>
          <div className={styles.formActions}>
            <button type="button" onClick={() => setEditing(false)}>Cancelar</button>
            <button type="submit" disabled={isSubmitting || saving}>
              {saving ? 'Guardando...' : 'Guardar cambios'}
            </button>
          </div>
          <ConfirmDialog
            isOpen={confirmSave}
            title="Editar acuerdo original"
            message="¿Estás seguro de que quieres guardar los cambios del acuerdo original?"
            confirmText="Sí, guardar"
            onCancel={() => setConfirmSave(false)}
            onConfirm={confirmEdit}
          />
        </Form>
      )}
    </Formik>
  );
}
