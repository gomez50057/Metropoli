import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FormularioBase from './FormularioBase';
import AgreementSuccessModal from './AgreementSuccessModal';
import './Formulario.css';

const UpdateFormulario = ({ projectId, onClose }) => {
  const [files, setFiles] = useState([]);
  const [initialValues, setInitialValues] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAcuerdoData = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/acuerdos/${projectId}/`);
        const acuerdoData = response.data;

        setInitialValues({
          fecha: new Date().toISOString().slice(0, 10),  // Fecha de la nueva actualización
          estado: acuerdoData.estado || '',
          zonaMetropolitana: acuerdoData.zm || '',
          comision: acuerdoData.comision || '',
          nombre: '',          
          apellidoPaterno: '',
          apellidoMaterno: '',
          cargo: '',
          telefono: '',
          extension: '',
          correo: '',
          descripcionAcuerdo: acuerdoData.descripcion_acuerdo || '',
          descripcionAvance: '',
          documentos: [],
        });

        setFiles([]);  // Limpiamos los archivos anteriores para comenzar con la nueva actualización

        setLoading(false);
      } catch (error) {
        console.error('Error al obtener los datos del acuerdo:', error);
        setLoading(false);
      }
    };

    if (projectId) {
      fetchAcuerdoData();
    }
  }, [projectId]);

  const handleSubmit = async (values, { setSubmitting }) => {
    const formData = new FormData();
    formData.append('acuerdo', projectId);  // Asociamos la actualización con el acuerdo original
    formData.append('fecha_actualizacion', values.fecha);
    formData.append('descripcion_avance', values.descripcionAvance);
    formData.append('nombre', values.nombre);
    formData.append('apellido_paterno', values.apellidoPaterno);
    formData.append('apellido_materno', values.apellidoMaterno);
    formData.append('cargo', values.cargo);
    formData.append('telefono', values.telefono);
    formData.append('extension', values.extension);
    formData.append('correo', values.correo);
    formData.append('zm', values.zonaMetropolitana);
    formData.append('estado', values.estado);
    formData.append('comision', values.comision);

    // Incluir archivos nuevos si se subieron
    files.forEach((file, index) => {
      if (file.file) {
        formData.append(`documentos_${index}`, file.file);
      }
    });
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    try {
      const response = await axios.post(`${apiUrl}/api/actualizaciones/`, formData, {  // Endpoint para crear una nueva actualización
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log('Actualización creada:', response.data);
      setModalIsOpen(true); // Abre el modal al crear la actualización con éxito
    } catch (error) {
      console.error('Error al crear la actualización:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCloseModal = () => {
    setModalIsOpen(false);
    onClose(); // Lógica para cerrar el modal o redirigir si es necesario
  };

  const handleCreateNewAgreement = () => {
    setModalIsOpen(false);
    setFiles([]);
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
    <div className="update-formulario">
      <FormularioBase
        initialValues={initialValues}
        onSubmit={handleSubmit}
        files={files}
        setFiles={setFiles}
        disableFields={{ descripcionAcuerdo: true }} // Deshabilitar el campo 
        context="update"
        showFields={true} // Mostrar el campo 
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

export default UpdateFormulario;
