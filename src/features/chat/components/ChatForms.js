import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import Select from "react-select";
import * as Yup from "yup";
import axios from "axios";
import { apiOriginUrl } from "@/config/api";
import { municipiosDeHidalgo } from "@/data/utils";
import formularioStyles from "@/features/chat/components/Formulario.module.css";

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .required("El nombre del proyecto es obligatorio.")
    .max(100, "El nombre no puede superar los 100 caracteres."),
  description: Yup.string()
    .required("La descripción es obligatoria.")
    .max(500, "La descripción no puede superar los 500 caracteres."),
  municipalities: Yup.array()
    .of(
      Yup.object().shape({
        label: Yup.string().required(),
        value: Yup.string().required(),
      })
    )
    .min(1, "Debe seleccionar al menos un municipio."),
});

// Convertimos la lista de municipios al formato esperado por `react-select`
const municipalityOptions = municipiosDeHidalgo.map((municipio) => ({
  label: municipio,
  value: municipio,
}));

const API_URL = apiOriginUrl("/chat-forms/create/");

const ChatForms = ({ handleMenuClick }) => (
  <div>
    <p>¡Perfecto! Por favor responde las siguientes preguntas:</p>
    <Formik
      initialValues={{
        name: "",
        description: "",
        municipalities: [],
      }}
      validationSchema={validationSchema}
      onSubmit={async (values, { setSubmitting, resetForm }) => {
        setSubmitting(true);

        // Formatear los municipios para que se guarden correctamente en el backend
        const formattedValues = {
          ...values,
          municipalities: values.municipalities.map((m) => m.value),
        };

        try {
          // Enviar los datos al backend
          const response = await axios.post(API_URL, formattedValues);
          console.log("Formulario enviado con éxito:", response.data);

          // Llamar al manejador de navegación
          handleMenuClick("proposalThanks");

          // Reiniciar el formulario
          resetForm();
        } catch (error) {
          console.error("Error al enviar el formulario:", error);
        } finally {
          setSubmitting(false);
        }
      }}
    >
      {({ isSubmitting, setFieldValue, values }) => (
        <Form className={formularioStyles["formulario-container"]}>
          <div className={formularioStyles["form-group"]}>
            <label htmlFor="name">¿Cómo se llama tu proyecto?</label>
            <Field
              id="name"
              name="name"
              type="text"
              className={formularioStyles["input-field"]}
              placeholder="Escribe el nombre de tu proyecto"
            />
            <ErrorMessage name="name" component="div" className={formularioStyles["error-message"]} />
          </div>

          <div className={formularioStyles["form-group"]}>
            <label htmlFor="description">¿En qué consiste? (Máximo 500 caracteres)</label>
            <Field
              id="description"
              name="description"
              as="textarea"
              className={formularioStyles["input-field"]}
              placeholder="Describe tu proyecto"
              maxLength="500"
            />
            <ErrorMessage name="description" component="div" className={formularioStyles["error-message"]} />
          </div>

          <div className={formularioStyles["form-group"]}>
            <label htmlFor="municipalities">¿Cuáles municipios comprende?</label>
            <Select
              options={municipalityOptions}
              isMulti
              name="municipalities"
              className={formularioStyles["react-select-container"]}
              classNamePrefix="react-select"
              placeholder="Selecciona uno o más municipios"
              onChange={(selectedOptions) => setFieldValue("municipalities", selectedOptions)}
              value={values.municipalities}
            />
            <ErrorMessage name="municipalities" component="div" className={formularioStyles["error-message"]} />
          </div>

          <button type="submit" className={formularioStyles["submit-button"]} disabled={isSubmitting}>
            {isSubmitting ? "Enviando..." : "Enviar"}
          </button>
        </Form>
      )}
    </Formik>
  </div>
);

export default ChatForms;
