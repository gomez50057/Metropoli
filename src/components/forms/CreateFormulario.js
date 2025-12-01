import React, { useState } from 'react';
import axios from 'axios';
import FormularioBase from './FormularioBase';
import AgreementSuccessModal from './AgreementSuccessModal';
import './Formulario.css';

const CreateFormulario = () => {
  const [files, setFiles] = useState([]);  // Para documentos
  const [minuta, setMinuta] = useState(null);  // Para la minuta
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const formData = new FormData();
    formData.append('fecha_creacion', values.fecha);
    formData.append('zm', values.zonaMetropolitana);
    formData.append('comision', values.comision);
    formData.append('descripcion_acuerdo', values.descripcionAcuerdo);   

    // Adjuntar archivos de documentos
    if (files.length > 0) {
      files.forEach((file, index) => {
        formData.append('documentos', file.file);  // Adjuntar como 'documentos'
      });
    } 
    // else {
    //   console.warn('No se han subido documentos.');
    // }

    // Adjuntar archivo de minuta si está presente
    if (minuta) {
      formData.append('minuta', minuta.file);  // Agregar el archivo de la minuta
    } else {
      console.warn('No se ha subido la minuta.');
    }
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    try {
      const response = await axios.post(`${apiUrl}/api/acuerdos/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Formulario enviado:', response.data);

      // Limpiar el formulario y el estado de archivos después del envío exitoso
      setFiles([]);  // Limpiar archivos
      setMinuta(null);  // Limpiar minuta
      resetForm();  // Limpiar el formulario

      // Abre el modal de éxito
      setModalIsOpen(true);
    } catch (error) {
      console.error('Error al enviar el formulario:', error);
      console.log('Error details:', error.response?.data);
    } finally {
      setSubmitting(false);  // Permitir que el usuario envíe el formulario nuevamente
    }
  };

  const handleCloseModal = () => {
    setModalIsOpen(false);
  };

  const handleCreateNewAgreement = () => {
    setModalIsOpen(false);
    setFiles([]);  // Limpiar archivos
    setMinuta(null);  // Limpiar minuta
    const container = document.querySelector('.dashboard-container');
    if (container) {
      container.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleGoToHome = () => {
    setModalIsOpen(false);
  };

  return (
    <div className="create-formulario">
      <FormularioBase
        initialValues={{
          fecha: '',
          descripcionAcuerdo: '',
          minuta: '',
          zonaMetropolitana: '',
          comision: ''
        }}
        onSubmit={handleSubmit}
        files={files}
        setFiles={setFiles}
        minuta={minuta}
        setMinuta={setMinuta}
        context="create"
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

export default CreateFormulario;
