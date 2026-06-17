"use client";

import { useEffect, useRef, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import ConfirmDialog from '@/components/shared/ConfirmDialog';
import { createAgreement, getInstances, getTopics, getZones } from '../services/agreementsApi';
import { INITIAL_PDF_MAX_BYTES, isInitialPdf } from '../utils/fileHelpers';
import EvidenceUpload from './EvidenceUpload';
import InstanceMultiSelect from './InstanceMultiSelect';
import MetropolitanZoneSelect from './MetropolitanZoneSelect';
import TopicSelect from './TopicSelect';
import styles from './AgreementForm.module.css';

const fallbackZones = [
  { value: 'ZMP', label: 'Zona Metropolitana de Pachuca' },
  { value: 'ZMT', label: 'Zona Metropolitana de Tulancingo' },
  { value: 'ZMVM', label: 'Zona Metropolitana del Valle de Mexico' },
];

const schema = Yup.object({
  date: Yup.string().required('La fecha es obligatoria.'),
  zone: Yup.string().required('Selecciona una zona.'),
  instances: Yup.array().min(1, 'Selecciona al menos una instancia.'),
  description: Yup.string().max(5000, 'Maximo 5000 caracteres.').required('Captura la descripcion.'),
  document: Yup.mixed()
    .nullable()
    .test('pdf', 'El documento inicial debe ser PDF y no superar 25 MB.', isInitialPdf),
});

function normalizeOptions(data) {
  const list = Array.isArray(data) ? data : data?.results || [];
  return list.map((item) => ({
    value: item.value || item.code || item.id,
    label: item.name || item.label,
  }));
}

export default function AgreementForm() {
  const [zones, setZones] = useState(fallbackZones);
  const [instances, setInstances] = useState([]);
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
    if (!zone) {
      return;
    }

    try {
      setInstances(normalizeOptions(await getInstances(zone)));
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
    formData.append('zone', values.zone);
    formData.append('topic', values.topic);
    formData.append('responsible', values.responsible);
    formData.append('description', values.description);
    values.instances.forEach((id) => formData.append('instances', id));
    if (values.document) formData.append('document', values.document);

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
      <div className={styles.heading}>
        <h1>Registro de acuerdo</h1>
        <p>Captura del acuerdo original y su documento inicial.</p>
      </div>
      <Formik
        initialValues={{
          date: '',
          zone: '',
          instances: [],
          topic: '',
          responsible: '',
          description: '',
          document: null,
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
              <MetropolitanZoneSelect
                zones={zones}
                value={values.zone}
                onChange={(value) => {
                  setFieldValue('zone', value);
                  setFieldValue('instances', []);
                  loadInstances(value);
                }}
              />
              <InstanceMultiSelect instances={instances} value={values.instances} onChange={(selected) => setFieldValue('instances', selected)} />
              <TopicSelect topics={topics} value={values.topic} onChange={(value) => setFieldValue('topic', value)} />
              <div className={styles.formGroup}>
                <label htmlFor="responsible">Responsable o enlace</label>
                <Field id="responsible" name="responsible" />
              </div>
              <div className={styles.documentUpload}>
                <EvidenceUpload
                  id="document"
                  label="Documento inicial PDF"
                  multiple={false}
                  accept="application/pdf,.pdf"
                  acceptedExtensions={['pdf']}
                  maxSize={INITIAL_PDF_MAX_BYTES}
                  clearKey={uploadResetKey}
                  onChange={(file) => setFieldValue('document', file)}
                />
                <ErrorMessage name="document" component="div" className={styles.error} />
              </div>
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="description">Descripcion</label>
              <Field id="description" name="description" as="textarea" rows="7" maxLength="5000" />
              <span className={styles.counter}>{values.description.length}/5000</span>
              <ErrorMessage name="description" component="div" className={styles.error} />
            </div>
            {message && <div className={styles.success}>{message}</div>}
            {error && <div className={styles.error} role="alert">{error}</div>}
            <button type="submit" disabled={isSubmitting || saving}>
              {isSubmitting || saving ? 'Guardando...' : 'Guardar acuerdo'}
            </button>
            <ConfirmDialog
              isOpen={confirmSave}
              title="Guardar acuerdo"
              message="Estas seguro de que quieres guardar este acuerdo?"
              confirmText="Si, guardar"
              onCancel={() => setConfirmSave(false)}
              onConfirm={confirmSaveAgreement}
            />
          </Form>
        )}
      </Formik>
    </section>
  );
}
