// ConfirmationModal.js
import React from 'react';
import logoutModalStyles from './LogoutModal.module.css'; // Archivo CSS para el estilo del modal

const deleteCookie = (name) => {
  document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Lax; Secure`;
};

const handleLogout = () => {
  // Borra todas las cookies relacionadas con la sesión
  deleteCookie('authToken');
  deleteCookie('userRole');
  deleteCookie('userName');
  deleteCookie('userState');
  deleteCookie('userCommission');
  
  // Redirige a la página de inicio de sesión o a la página principal
  window.location.href = '/login';
};

const LogoutModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className={logoutModalStyles["confirmation-modal"]}>
      <div className={logoutModalStyles["modal-content"]}>
        <h2>Estás a punto de cerrar sesión</h2>
        <p>¿Estás seguro de que deseas salir?</p>
        <div className={logoutModalStyles["modal-buttons"]}>
          <button onClick={() => { onConfirm(); handleLogout(); }} className={logoutModalStyles["confirm-button"]}>Sí, cerrar sesión</button>
          <button onClick={onClose} className={logoutModalStyles["cancel-button"]}>No</button>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal;
