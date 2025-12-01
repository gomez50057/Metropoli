import React from 'react';
import './AgreementSuccessModal.css';

const AgreementSuccessModal = ({ isOpen, onCreateNewAgreement, onGoToHome }) => {
  if (!isOpen) return null;

  return (
    <div className="overlay">
      <div className="styled-modal">
        <h2>¡Enviado con éxito!</h2>
        <p>¿Qué desea hacer ahora?</p>
        <div className="modal-botton">
          <button onClick={onCreateNewAgreement}>
            Repetir la acción hecha
          </button>
          <button onClick={onGoToHome}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default AgreementSuccessModal;
