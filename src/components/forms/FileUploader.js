import React, { useState, useEffect } from 'react';
import Dropzone from 'react-dropzone';

const FileUploader = ({ onFilesChange }) => {
  const [files, setFiles] = useState([]);

  const handleDrop = (acceptedFiles) => {
    const newFiles = acceptedFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      progress: 0,
      completed: false,
    }));

    setFiles((prevFiles) => {
      const updatedFiles = [...prevFiles, ...newFiles];
      // Llamada al prop para notificar al componente padre
      onFilesChange(updatedFiles); // Esto actualiza el estado del padre fuera del renderizado
      return updatedFiles;
    });

    // Simulación de progreso
    newFiles.forEach((newFile, index) => {
      const interval = setInterval(() => {
        setFiles((prevFiles) => {
          const updatedFiles = [...prevFiles];
          const currentFileIndex = prevFiles.length - newFiles.length + index;
          const currentFile = updatedFiles[currentFileIndex];

          if (currentFile.progress >= 100) {
            clearInterval(interval);
            currentFile.completed = true;
          } else {
            currentFile.progress += 10;
          }

          return updatedFiles;
        });
      }, 200); // Aumenta el progreso cada 200ms
    });
  };

  const handleRemoveFile = (fileToRemove) => {
    setFiles((prevFiles) => {
      const updatedFiles = prevFiles.filter((fileObj) => fileObj.file !== fileToRemove);
      onFilesChange(updatedFiles); // Notificar al padre del cambio
      return updatedFiles;
    });
  };

  // Limpieza de URLs de previsualización para evitar fugas de memoria
  useEffect(() => {
    return () => {
      files.forEach((fileObj) => URL.revokeObjectURL(fileObj.preview));
    };
  }, [files]);

  return (
    <Dropzone onDrop={handleDrop}>
      {({ getRootProps, getInputProps }) => (
        <div {...getRootProps()} className="dropzone">
          <input {...getInputProps()} />
          {files.length === 0 && (
            <div className="dropzone-txt">
              <img src="/img/iconos/dropzone.png" alt="Icono de archivo" />
              <p>Arrastra y suelta <span className="highlight">imágenes, vídeos o cualquier archivo</span></p>
              <p>o <span className="highlight">buscar archivos</span> en su computadora</p>
            </div>
          )}
          <div className="file-preview">
            {files.map((fileObj, index) => (
              <div key={index} className="file-preview-item">
                <img src={fileObj.preview} alt={`Documento ${index + 1}`} />
                {fileObj.completed ? (
                  <>
                    <div className="checkmark-circle">
                      <svg viewBox="0 0 52 52" className="checkmark">
                        <circle cx="26" cy="26" r="25" fill="none" />
                        <path d="M14 27l8 8 16-16" fill="none" />
                      </svg>
                    </div>
                    <div className="file-details">
                      <p>{fileObj.file.name}</p>
                      <button type="button" onClick={() => handleRemoveFile(fileObj.file)}>
                        Eliminar
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="progress-bar">
                    <div className="progress" style={{ width: `${fileObj.progress}%` }}></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </Dropzone>
  );
};

export default FileUploader;
