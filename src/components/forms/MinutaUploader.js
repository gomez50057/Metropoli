import React, { useState, useEffect } from 'react';
import Dropzone from 'react-dropzone';

const MinutaUploader = ({ minuta, setMinuta }) => {
  const [progress, setProgress] = useState(0); // Estado para el progreso
  const [uploading, setUploading] = useState(false); // Estado para saber si está subiendo

  const handleDrop = (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      const newFile = acceptedFiles[0];
      setMinuta({
        file: newFile,
        preview: URL.createObjectURL(newFile),
      });
      setUploading(true); // Iniciar la simulación de carga
    }
  };

  // Simulación de progreso de subida
  useEffect(() => {
    if (uploading) {
      const interval = setInterval(() => {
        setProgress((prevProgress) => {
          if (prevProgress >= 100) {
            clearInterval(interval);
            setUploading(false); // Terminar la simulación de subida
            return 100;
          }
          return prevProgress + 10; // Incrementar el progreso un 10% cada vez
        });
      }, 200); // Cada 200ms incrementa el progreso
    }
  }, [uploading]);

  const handleRemoveFile = () => {
    setMinuta(null);
    setProgress(0); // Resetear el progreso
  };

  return (
    <Dropzone
      onDrop={handleDrop}
      accept={{ 'application/pdf': ['.pdf'] }}  // Solo aceptar archivos PDF
      maxFiles={1}  // Solo un archivo permitido
    >
      {({ getRootProps, getInputProps }) => (
        <div {...getRootProps()} className="dropzone">
          <input {...getInputProps()} />
          {minuta ? (
            <div className="file-preview">
              <p>{minuta.file ? minuta.file.name : "Minuta existente"}</p>
              {uploading ? (
                <div className="progress-bar">
                  <div className="progress" style={{ width: `${progress}%` }}></div>
                  <p>{progress}%</p>
                </div>
              ) : (
                <div className="file-details">
                  <button type="button" onClick={() => handleRemoveFile(fileObj.file)}>
                    Eliminar
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="dropzone-txt">
              <img src="/img/iconos/dropzone.png" alt="Subir archivo PDF" className="upload-icon" />
              <p>Arrastra y suelta el <span className="highlight">archivo PDF</span></p>
              <p>o <span className="highlight">busca un archivo</span> en tu computadora</p>
            </div>
          )}
        </div>
      )}
    </Dropzone>
  );
};

export default MinutaUploader;
