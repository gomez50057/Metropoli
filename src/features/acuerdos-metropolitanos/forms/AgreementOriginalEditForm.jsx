"use client";

import { useEffect, useRef, useState } from 'react';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import Select from 'react-select';
import * as Yup from 'yup';
import ConfirmDialog from '@/components/shared/ConfirmDialog';
import { getInstances, getResponsibles, getTopics, getZones } from '../services/agreementsApi';
import InstanceMultiSelect from './InstanceMultiSelect';
import ResponsibleMultiSelect from './ResponsibleMultiSelect';
import TopicSelect from './TopicSelect';
import styles from './AgreementForm.module.css';

const schema = Yup.object({
  date: Yup.string().required('La fecha es obligatoria.'),
  zone: Yup.mixed().required('Selecciona una zona.'),
  instances: Yup.array().min(1, 'Selecciona al menos una instancia.'),
  responsibles: Yup.array().min(1, 'Selecciona al menos un responsable.'),
  description: Yup.string().max(5000, 'Máximo 5000 caracteres.').required('Captura la descripción.'),
});

const CUSTOM_PREFIX = '__custom__:';

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

function responsibleOptions(data) {
  const list = Array.isArray(data) ? data : data?.results || [];
  return list.map((item) => ({
    value: item.id,
    label: item.name,
    category: item.category,
    categoryLabel: item.category_label,
  }));
}

export default function AgreementOriginalEditForm({ agreement, onSave }) {
  const [editing, setEditing] = useState(false);
  const [zones, setZones] = useState([]);
  const [instances, setInstances] = useState([]);
  const [responsibles, setResponsibles] = useState([]);
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
    Promise.all([getInstances(zone.code), getResponsibles(zone.code)])
      .then(([instanceData, responsibleData]) => {
        setInstances(otherLast(options(instanceData)));
        const selected = responsibleOptions(agreement.responsibles_options || []);
        const available = responsibleOptions(responsibleData);
        setResponsibles([...available, ...selected.filter((item) => !available.some((option) => option.value === item.value))]);
      })
      .catch(() => {
        setInstances([]);
        setResponsibles([]);
      });
  }, [agreement?.zone, zones]);

  async function loadInstances(zone) {
    setInstances([]);
    setResponsibles([]);
    if (!zone) return;
    try {
      const [instanceData, responsibleData] = await Promise.all([
        getInstances(zone),
        getResponsibles(zone),
      ]);
      setInstances(otherLast(options(instanceData)));
      setResponsibles(responsibleOptions(responsibleData));
    } catch {
      setInstances([]);
    }
  }

  async function confirmEdit() {
    const values = pendingValues.current;
    setConfirmSave(false);
    if (!values) return;

    setSaving(true);
    const payload = {
      ...values,
      instances: values.instances.filter((id) => !String(id).startsWith(CUSTOM_PREFIX)),
      responsibles: values.responsibles.filter((id) => !String(id).startsWith(CUSTOM_PREFIX)),
      custom_instances: values.instances.filter((id) => String(id).startsWith(CUSTOM_PREFIX)).map((id) => String(id).slice(CUSTOM_PREFIX.length)),
      custom_responsibles: values.responsibles.filter((id) => String(id).startsWith(CUSTOM_PREFIX)).map((id) => String(id).slice(CUSTOM_PREFIX.length)),
    };
    const saved = await onSave(payload);
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
        responsibles: agreement.responsibles || [],
        topic: agreement.topic || '',
        description: agreement.description || '',
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
              <label htmlFor="edit-committed-date">Fecha de entrega</label>
              <Field id="edit-committed-date" name="committed_date" type="date" />
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
                  setFieldValue('responsibles', []);
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
            <ResponsibleMultiSelect
              responsibles={responsibles}
              value={values.responsibles}
              onChange={(selected) => setFieldValue('responsibles', selected)}
            />
            <TopicSelect topics={topics} value={values.topic} onChange={(topic) => setFieldValue('topic', topic)} />
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
