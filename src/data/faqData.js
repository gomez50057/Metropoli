import { AttachFile, Assignment } from '@mui/icons-material';

export const categories = [
  { name: 'Formulario', icon: <Assignment />, id: 'Formulario' },
  { name: 'Archivos Adjuntos', icon: <AttachFile />, id: 'ArchivosAdjuntos' },
];

export const questions = {
  ArchivosAdjuntos: [
    { 
      question: '¿Qué tipo de archivos puedo adjuntar?', 
      answer: 'Puedes adjuntar archivos en formato PDF, XLSX, JPEG, DWG, MP4 y KML. Asegúrate de que el tamaño total de los archivos no exceda los 250 MB por envío.' 
    },
    { 
      question: '¿Qué debo hacer si mis archivos exceden el límite de 250 MB?', 
      answer: 'Si tus archivos exceden este límite, intenta reducir el tamaño de tus archivos para que cumplan con las restricciones.' 
    },
  ],
  
  Formulario: [
    { 
      question: '¿Qué hago si no tengo un correo institucional?', 
      answer: 'Si no tienes un correo institucional, puedes proporcionar tu correo personal. Sin embargo, es preferible usar el institucional si lo tienes disponible.' 
    },
    { 
      question: '¿Es obligatorio adjuntar documentos complementarios?', 
      answer: 'No es obligatorio, pero es recomendable adjuntar los documentos necesarios, para respaldar mejor la propuesta.' 
    },
    { 
      question: '¿Cómo describo mi proyecto correctamente?', 
      answer: 'Describe de manera clara el propósito del proyecto, el problema que aborda y los beneficios que proporcionará. Asegúrate de incluir solo los detalles más importantes para no exceder el límite de caracteres.' 
    },
    { 
      question: '¿Cómo calculo el número de beneficiarios de mi proyecto?', 
      answer: 'El número de beneficiarios debe estimarse con base en datos o proyecciones realistas. Considera a todas las personas que recibirán beneficios directos o indirectos del proyecto.' 
    },
  ],
};
