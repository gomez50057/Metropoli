import * as Yup from 'yup';

const getValidationSchema = (context) => {
  let schema = {
    fecha: Yup.string().required('La fecha es obligatoria'), // Común para todos
  };

  if (context === 'create' || context === 'edit') {
    schema.zonaMetropolitana = Yup.string().required('La Zona Metropolitana es obligatoria');
    schema.comision = Yup.string().required('El nombre es obligatorio');
    schema.descripcionAcuerdo = Yup.string()
      .max(5000, 'No debe exceder los 5000 caracteres')
      .required('La descripción del acuerdo es obligatoria');
  }

  if (context === 'update') {
    schema.estado = Yup.string().required('El estado es obligatorio');
  }

  if (context === 'update') {
    schema = {
      ...schema,
      nombre: Yup.string().required('El nombre es obligatorio'),
      apellidoPaterno: Yup.string().required('El apellido paterno es obligatorio'),
      apellidoMaterno: Yup.string().required('El apellido materno es obligatorio'),
      cargo: Yup.string().required('El cargo es obligatorio'),
      telefono: Yup.string()
        .matches(/^\d{10}$/, 'El teléfono debe tener exactamente 10 dígitos')
        .required('El teléfono es obligatorio'),
      extension: Yup.string(),
      correo: Yup.string().email('Correo electrónico inválido').required('El correo es obligatorio'),
      descripcionAvance: Yup.string()
        .max(5000, 'No debe exceder los 5000 caracteres')
        .required('La descripción del avance es obligatoria'),
    };
  }

  return Yup.object().shape(schema);
};

export default getValidationSchema;
