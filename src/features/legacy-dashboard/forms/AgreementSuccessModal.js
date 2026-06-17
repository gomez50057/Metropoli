import React from 'react';
import agreementSuccessModalStyles from './AgreementSuccessModal.module.css';

const AgreementSuccessModal = ({ isOpen, onCreateNewAgreement, onGoToHome }) => {
  if (!isOpen) return null;

  return (
    <div className={agreementSuccessModalStyles["overlay"]}>
      <div className={agreementSuccessModalStyles["styled-modal"]}>
        <h2>¡Acuerdo enviado con éxito!</h2>
        <p>Su acuerdo ha sido enviado correctamente. Puede validar el resultado de la validación en &quot;Acuerdos&quot;</p>
        <p>¿Qué desea hacer ahora?</p>
        <div className={agreementSuccessModalStyles["modal-botton"]}>
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
