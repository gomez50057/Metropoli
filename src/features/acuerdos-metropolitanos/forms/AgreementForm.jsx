"use client";

import { useEffect, useRef, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import ConfirmDialog from '@/components/shared/ConfirmDialog';
import StatusMessage from '@/components/shared/StatusMessage';
import { createAgreement, getInstances, getResponsibles, getTopics, getZones } from '../services/agreementsApi';
import { AGREEMENT_DOCUMENT_ACCEPT, AGREEMENT_DOCUMENT_EXTENSIONS, AGREEMENT_DOCUMENT_RULE_TEXT, UPLOAD_ACCEPT, UPLOAD_EXTENSIONS, UPLOAD_MAX_BYTES, UPLOAD_RULE_TEXT, isAgreementDocumentAllowed, isUploadAllowed } from '../utils/fileHelpers';
import EvidenceUpload from './EvidenceUpload';
import InstanceMultiSelect from './InstanceMultiSelect';
import MetropolitanZoneSelect from './MetropolitanZoneSelect';
import ResponsibleMultiSelect from './ResponsibleMultiSelect';
import TopicSelect from './TopicSelect';
import styles from './AgreementForm.module.css';

const fallbackZones = [
  { value: 'ZMP', label: 'Zona Metropolitana de Pachuca' },
  { value: 'ZMT', label: 'Zona Metropolitana de Tulancingo' },
  { value: 'ZMVM', label: 'Zona Metropolitana del Valle de México' },
];

const CUSTOM_PREFIX = '__custom__:';

const schema = Yup.object({
  date: Yup.string().required('La fecha es obligatoria.'),
  zone: Yup.string().required('Selecciona una zona.'),
  instances: Yup.array().min(1, 'Selecciona al menos una instancia.'),
  responsibles: Yup.array().min(1, 'Selecciona al menos un responsable.'),
  description: Yup.string().max(5000, 'Máximo 5000 caracteres.').required('Captura la descripción.'),
  document: Yup.mixed()
    .nullable()
    .test('file', AGREEMENT_DOCUMENT_RULE_TEXT, isAgreementDocumentAllowed),
  other_files: Yup.array().test('files', UPLOAD_RULE_TEXT, (files) => (files || []).every(isUploadAllowed)),
});

function normalizeOptions(data) {
  const list = Array.isArray(data) ? data : data?.results || [];
  return list.map((item) => ({
    value: item.value || item.code || item.id,
    label: item.name || item.label,
  }));
}

function otherLast(options) {
  return [...options].sort((a, b) => (a.label === 'Otro') - (b.label === 'Otro'));
}

function normalizeResponsibles(data) {
  const list = Array.isArray(data) ? data : data?.results || [];
  return list.map((item) => ({
    value: item.id,
    label: item.name,
    category: item.category,
    categoryLabel: item.category_label,
  }));
}

export default function AgreementForm() {
  const [zones, setZones] = useState(fallbackZones);
  const [instances, setInstances] = useState([]);
  const [responsibles, setResponsibles] = useState([]);
  const [topics, setTopics] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [confirmSave, setConfirmSave] = useState(false);
  const [uploadResetKey, setUploadResetKey] = useState(0);
  const pendingSubmit = useRef(null);

  useEffect(() => {
    getZones().then((data) => setZones(normalizeOptions(data))).catch(() => {});
    getTopics().then((data) => setTopics(normalizeOptions(data))).catch(() => {});
  }, []);

  async function loadInstances(zone) {
    setInstances([]);
    setResponsibles([]);
    if (!zone) {
      return;
    }

    try {
      const [instanceData, responsibleData] = await Promise.all([
        getInstances(zone),
        getResponsibles(zone),
      ]);
      setInstances(otherLast(normalizeOptions(instanceData)));
      setResponsibles(normalizeResponsibles(responsibleData));
    } catch {
      setInstances([]);
    }
  }

  async function saveAgreement(values, resetForm) {
    setError('');
    setMessage('');
    setSaving(true);

    const formData = new FormData();
    formData.append('date', values.date);
    if (values.committed_date) formData.append('committed_date', values.committed_date);
    formData.append('zone', values.zone);
    formData.append('topic', values.topic);
    formData.append('description', values.description);
    values.instances.forEach((id) => {
      if (String(id).startsWith(CUSTOM_PREFIX)) formData.append('custom_instances', String(id).slice(CUSTOM_PREFIX.length));
      else formData.append('instances', id);
    });
    values.responsibles.forEach((id) => {
      if (String(id).startsWith(CUSTOM_PREFIX)) formData.append('custom_responsibles', String(id).slice(CUSTOM_PREFIX.length));
      else formData.append('responsibles', id);
    });
    if (values.document) formData.append('document', values.document);
    values.other_files.forEach((file) => formData.append('other_files', file));

    try {
      await createAgreement(formData);
      resetForm();
      setUploadResetKey((key) => key + 1);
      setMessage('Acuerdo registrado correctamente.');
    } catch {
      setError('No se pudo registrar el acuerdo.');
    } finally {
      setSaving(false);
      pendingSubmit.current = null;
    }
  }

  function handleSubmit(values, { resetForm, setSubmitting }) {
    setSubmitting(false);
    pendingSubmit.current = { values, resetForm };
    setConfirmSave(true);
  }

  function confirmSaveAgreement() {
    const pending = pendingSubmit.current;
    setConfirmSave(false);
    if (pending) saveAgreement(pending.values, pending.resetForm);
  }

  return (
    <section className={styles.page}>
      <StatusMessage message={message} onDismiss={() => setMessage('')} />
      <div className={styles.heading}>
        <h1>Registro de acuerdo</h1>
        <p>Captura del acuerdo original y su documento de acuerdo.</p>
      </div>
      <Formik
        initialValues={{
          date: '',
          committed_date: '',
          zone: '',
          instances: [],
          responsibles: [],
          topic: '',
          description: '',
          document: null,
          other_files: [],
        }}
        validationSchema={schema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, values, setFieldValue }) => (
          <Form className={styles.form}>
            <div className={styles.grid}>
              <div className={styles.formGroup}>
                <label htmlFor="date">Fecha</label>
                <Field id="date" name="date" type="date" />
                <ErrorMessage name="date" component="div" className={styles.error} />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="committed_date">Fecha de entrega</label>
                <Field id="committed_date" name="committed_date" type="date" />
              </div>
              <MetropolitanZoneSelect
                zones={zones}
                value={values.zone}
                onChange={(value) => {
                  setFieldValue('zone', value);
                  setFieldValue('instances', []);
                  setFieldValue('responsibles', []);
                  loadInstances(value);
                }}
              />
              <InstanceMultiSelect instances={instances} value={values.instances} onChange={(selected) => setFieldValue('instances', selected)} />
              <ResponsibleMultiSelect responsibles={responsibles} value={values.responsibles} onChange={(selected) => setFieldValue('responsibles', selected)} />
              <TopicSelect topics={topics} value={values.topic} onChange={(value) => setFieldValue('topic', value)} />
              <div className={styles.documentUpload}>
                <EvidenceUpload
                  id="document"
                  label="Documento de acuerdo"
                  multiple={false}
                  accept={AGREEMENT_DOCUMENT_ACCEPT}
                  acceptedExtensions={AGREEMENT_DOCUMENT_EXTENSIONS}
                  maxSize={UPLOAD_MAX_BYTES}
                  noticeText={AGREEMENT_DOCUMENT_RULE_TEXT}
                  clearKey={uploadResetKey}
                  onChange={(file) => setFieldValue('document', file)}
                />
                <ErrorMessage name="document" component="div" className={styles.error} />
              </div>
              <div className={styles.documentUpload}>
                <EvidenceUpload
                  id="other_files"
                  label="Otros archivos"
                  multiple
                  accept={UPLOAD_ACCEPT}
                  acceptedExtensions={UPLOAD_EXTENSIONS}
                  maxSize={UPLOAD_MAX_BYTES}
                  noticeText={UPLOAD_RULE_TEXT}
                  clearKey={uploadResetKey}
                  onChange={(files) => setFieldValue('other_files', files || [])}
                />
                <ErrorMessage name="other_files" component="div" className={styles.error} />
              </div>
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="description">Descripción</label>
              <Field id="description" name="description" as="textarea" rows="7" maxLength="5000" />
              <span className={styles.counter}>{values.description.length}/5000</span>
              <ErrorMessage name="description" component="div" className={styles.error} />
            </div>
            {error && <div className={styles.error} role="alert">{error}</div>}
            <button type="submit" disabled={isSubmitting || saving}>
              {isSubmitting || saving ? 'Guardando...' : 'Guardar acuerdo'}
            </button>
            <ConfirmDialog
              isOpen={confirmSave}
              title="Guardar acuerdo"
              message="¿Estás seguro de que quieres guardar este acuerdo?"
              confirmText="Sí, guardar"
              onCancel={() => setConfirmSave(false)}
              onConfirm={confirmSaveAgreement}
            />
          </Form>
        )}
      </Formik>
    </section>
  );
}
