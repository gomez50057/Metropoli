import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FormularioBase from './FormularioBase';
import AgreementSuccessModal from './AgreementSuccessModal';
import './Formulario.css';

const EditFormulario = ({ projectId, onClose }) => {
  const [files, setFiles] = useState([]);
  const [minuta, setMinuta] = useState(null);
  const [initialValues, setInitialValues] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [estatus, setEstatus] = useState('');
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchAcuerdoData = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/acuerdos/${projectId}/`);
        const acuerdoData = response.data;

        setInitialValues({
          fecha: acuerdoData.fecha || new Date().toISOString().slice(0, 10),
          zonaMetropolitana: acuerdoData.zm || '',
          estado: acuerdoData.estado || '',
          descripcionAcuerdo: acuerdoData.descripcion_acuerdo || '',
          documentos: Array.isArray(acuerdoData.documentos) ? acuerdoData.documentos : [],
          comision: acuerdoData.comision || '',
        });

        setEstatus(acuerdoData.estatus || '');

        setFiles(
          Array.isArray(acuerdoData.documentos)
            ? acuerdoData.documentos.map((doc) => ({
                file: null,
                preview: doc.url,
                progress: 100,
                completed: true,
              }))
            : []
        );

        if (acuerdoData.minuta) {
          setMinuta({
            file: null,
            preview: acuerdoData.minuta,
          });
        }

        setLoading(false);
      } catch (error) {
        console.error('Error al obtener los datos del acuerdo:', error);
        setLoading(false);
      }
    };

    if (projectId) {
      fetchAcuerdoData();
    }
  }, [projectId, apiUrl]);

  const handleSubmit = async (values, { setSubmitting }) => {
    const formData = new FormData();
    formData.append('fecha_creacion', values.fecha);
    formData.append('zm', values.zonaMetropolitana);
    formData.append('comision', values.comision);
    formData.append('descripcion_acuerdo', values.descripcionAcuerdo);
    formData.append('estatus', estatus);

    files.forEach((file, index) => {
      if (file.file) {
        formData.append(`documentos_${index}`, file.file);
      }
    });

    if (minuta && minuta.file) {
      formData.append('minuta', minuta.file);
    }

    try {
      const response = await axios.put(`${apiUrl}/api/acuerdos/${projectId}/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Formulario actualizado:', response.data);
      setModalIsOpen(true);
    } catch (error) {
      console.error('Error al actualizar el formulario:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCloseModal = () => {
    setModalIsOpen(false);
    onClose();
  };

  const handleCreateNewAgreement = () => {
    setModalIsOpen(false);
    onClose();
    setFiles([]);
    setMinuta(null);
    const container = document.querySelector('.dashboard-container');
    if (container) {
      container.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleGoToHome = () => {
    setModalIsOpen(false);
    onClose();
  };

  if (loading) {
    return <div>Cargando datos...</div>;
  }

  return (
    <div className="edit-formulario">
      <div className="form-group">
        <label htmlFor="estatus">Estatus</label>
        <select
          id="estatus"
          name="estatus"
          value={estatus}
          onChange={(e) => setEstatus(e.target.value)}
          className="input-field"
        >
          <option value="">Selecciona un estatus</option>
          <option value="en_proceso">En Proceso</option>
          <option value="sin_avance">Sin Avance</option>
          <option value="atendido">Atendido</option>
          <option value="cancelado">Cancelado</option>
        </select>
      </div>

      <FormularioBase
        initialValues={initialValues}
        onSubmit={handleSubmit}
        files={files}
        setFiles={setFiles}
        minuta={minuta}
        setMinuta={setMinuta}
        context="edit"
        showFields={false}
      />

      <AgreementSuccessModal
        isOpen={modalIsOpen}
        onRequestClose={handleCloseModal}
        onCreateNewAgreement={handleCreateNewAgreement}
        onGoToHome={handleGoToHome}
      />
    </div>
  );
};

export default EditFormulario;
