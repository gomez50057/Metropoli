import React, { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage, useFormikContext } from 'formik';
import getValidationSchema from './validationSchema';
// import FileUploader from './FileUploader';
import MinutaUploader from './MinutaUploader';
import './Formulario.css';
import { comisiones, subcomisiones } from '../../utils/comisiones';

const ZonaEffect = ({ setComisionOptions, setIsEstadoDisabled }) => {
  const { values, setFieldValue } = useFormikContext();

  useEffect(() => {
    if (
      values.zonaMetropolitana === 'ZMPachuca' ||
      values.zonaMetropolitana === 'ZMTula' ||
      values.zonaMetropolitana === 'ZMTulancingo'
    ) {
      setComisionOptions(subcomisiones);
      setFieldValue('estado', 'Hidalgo');
      setIsEstadoDisabled(true);
    } else {
      setComisionOptions(comisiones);
      setFieldValue('estado', '');
      setIsEstadoDisabled(false);
    }
  }, [values.zonaMetropolitana, setFieldValue, setComisionOptions, setIsEstadoDisabled]);

  return null;
};

const FormularioBase = ({ initialValues, onSubmit, files, setFiles, minuta, setMinuta, disableFields = {}, showFields = false, context = 'create' }) => {
  const [comisionOptions, setComisionOptions] = useState(comisiones); // Estado para almacenar las opciones de "Comisión"
  const [isEstadoDisabled, setIsEstadoDisabled] = useState(false);

  const formatPhoneNumber = (value) => {
    const cleanedValue = value.replace(/\D/g, '');
    return cleanedValue.length <= 3
      ? cleanedValue
      : cleanedValue.length <= 6
        ? `${cleanedValue.slice(0, 3)}-${cleanedValue.slice(3)}`
        : `${cleanedValue.slice(0, 3)}-${cleanedValue.slice(3, 6)}-${cleanedValue.slice(6)}`;
  };

  const handlePhoneNumberChange = (e, setFieldValue) => {
    const { value } = e.target;
    const cleanedValue = value.replace(/\D/g, '');
    if (cleanedValue.length <= 10) {
      setFieldValue('telefono', cleanedValue);
      setFieldValue('telefonoFormateado', formatPhoneNumber(cleanedValue));
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={getValidationSchema(context)}
      onSubmit={onSubmit}
    >
      {({ setFieldValue, values }) => (
        <>
          <ZonaEffect setComisionOptions={setComisionOptions} setIsEstadoDisabled={setIsEstadoDisabled} />
          <Form className="formulario-container">
            <h2>Datos Generales</h2>
            <div className="form-row">
              <div className="form-group">
                <label>Fecha:</label>
                <Field name="fecha" type="date" className="input-field" disabled={disableFields.descripcionAcuerdo} />
                <ErrorMessage name="fecha" component="div" className="error-message" />
              </div>

              <div className="form-group">
                <label>Zona Metropolitana:</label>
                <Field name="zonaMetropolitana" as="select" className="input-field" disabled={disableFields.descripcionAcuerdo}>
                  <option value="">Selecciona una Zona metropolitana</option>
                  <option value="ZMPachuca">ZMPachuca</option>
                  <option value="ZMTula">ZMTula</option>
                  <option value="ZMTulancingo">ZMTulancingo</option>
                  <option value="ZMVM">ZMValle de México</option>
                  <option value="no_aplica">No Aplica</option>
                </Field>
                <ErrorMessage name="zonaMetropolitana" component="div" className="error-message" />
              </div>

              <div className="form-group">
                <label>Comisión:</label>
                <Field name="comision" as="select" className="input-field" disabled={disableFields.descripcionAcuerdo}>
                  <option value="">Selecciona una comisión</option>
                  {comisionOptions.map((comision, index) => (
                    <option key={index} value={comision.value}>
                      {comision.label}
                    </option>
                  ))}
                </Field>
                <ErrorMessage name="comision" component="div" className="error-message" />
              </div>

              {showFields && (
                <div className="form-group">
                  <label>Estado:</label>
                  <Field name="estado" as="select" className="input-field" disabled={isEstadoDisabled}>
                    <option value="">Selecciona un estado</option>
                    <option value="EdoMex">Estado de México</option>
                    <option value="CDMX">Ciudad de México</option>
                    <option value="Hidalgo">Hidalgo</option>
                  </Field>
                  <ErrorMessage name="estado" component="div" className="error-message" />
                </div>
              )}
            </div>

            <div className="form-row">
              {showFields && (
                <div className="form-group">
                  <label>Nombre:</label>
                  <Field name="nombre" type="text" className="input-field" placeholder="Julio" />
                  <ErrorMessage name="nombre" component="div" className="error-message" />
                </div>
              )}
              {showFields && (
                <div className="form-group">
                  <label>Apellido Paterno:</label>
                  <Field name="apellidoPaterno" type="text" className="input-field" placeholder="Menchaca" />
                  <ErrorMessage name="apellidoPaterno" component="div" className="error-message" />
                </div>
              )}
              {showFields && (
                <div className="form-group">
                  <label>Apellido Materno:</label>
                  <Field name="apellidoMaterno" type="text" className="input-field" placeholder="Salazar" />
                  <ErrorMessage name="apellidoMaterno" component="div" className="error-message" />
                </div>
              )}
            </div>
            {showFields && (
              <div className="form-group">
                <label>Cargo:</label>
                <Field name="cargo" type="text" className="input-field" placeholder="Agrega el cargo que tienes" />
                <ErrorMessage name="cargo" component="div" className="error-message" />
              </div>
            )}

            <div className="form-row">
              {showFields && (
                <div className="form-group">
                  <label>Teléfono:</label>
                  <Field
                    name="telefono"
                    type="tel"
                    className="input-field"
                    placeholder="771-717-6000"
                    value={values.telefonoFormateado || formatPhoneNumber(values.telefono)}
                    onChange={(e) => handlePhoneNumberChange(e, setFieldValue)}
                  />
                  <ErrorMessage name="telefono" component="div" className="error-message" />
                </div>
              )}
              {showFields && (
                <div className="form-group">
                  <label>Extensión:</label>
                  <Field
                    name="extension"
                    type="text"
                    className="input-field"
                    placeholder="6633"
                    onChange={(e) => {
                      const { value } = e.target;
                      if (/^\d*$/.test(value)) {
                        setFieldValue('extension', value);
                      }
                    }}
                  />
                  <ErrorMessage name="extension" component="div" className="error-message" />
                </div>
              )}
              {showFields && (
                <div className="form-group">
                  <label>Correo Electrónico:</label>
                  <Field name="correo" type="email" className="input-field" placeholder="cg.planeacion@hidalgo.gob.mx" />
                  <ErrorMessage name="correo" component="div" className="error-message" />
                </div>
              )}
            </div>

            <h2>Acuerdo</h2>
            <div className="form-group">
              <label>Descripción del Acuerdo:</label>
              <Field name="descripcionAcuerdo" as="textarea" rows="5" className="input-field" placeholder="Agrega una descripción del acuerdo no mayor a 5000 caracteres" disabled={disableFields.descripcionAcuerdo} />
              <ErrorMessage name="descripcionAcuerdo" component="div" className="error-message" />
            </div>

            {showFields && (
              <div className="form-group">
                <label>Descripción del Avance:</label>
                <Field name="descripcionAvance" as="textarea" rows="5" className="input-field" placeholder="Agrega una descripción del avance no mayor a 5000 caracteres" />
                <ErrorMessage name="descripcionAvance" component="div" className="error-message" />
              </div>
            )}

            <div className="form-group">
              <label>Documentos Anexos(evidencia):</label>
              <p>En esta sección, puedes cargar todos los anexos relacionados con el proyecto, excepto la minuta. Recuerda que solo se permite subir un único archivo y debe ser exclusivamente en formato PDF. Asegúrate de que el archivo contiene toda la información relevante antes de realizar la subida.</p>
              <MinutaUploader minuta={minuta} setMinuta={setMinuta} />
            </div>

            {/* <div className="form-group">
            <label>Documentos Anexos(evidencia):</label>
            <p>En esta sección, puedes cargar todos los anexos relacionados con el proyecto, excepto la minuta. Puedes subir archivos en formato de imágenes, vídeos o cualquier otro tipo de documento. Asegúrate de incluir toda la información adicional que respalde tu proyecto.</p>
            <FileUploader onFilesChange={setFiles} />
            </div> */}
            <button type="submit" className="submit-button">Enviar</button>
          </Form>
        </>
      )}
    </Formik>
  );
};

export default FormularioBase;
