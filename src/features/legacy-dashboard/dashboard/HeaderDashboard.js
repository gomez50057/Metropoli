import React, { useEffect, useState, useRef } from 'react';
import { externalAssetUrl } from '@/config/api';
import headerDashboardStyles from './HeaderDashboard.module.css';
import UserOptionsModal from '@/components/shared/UserOptionsModal'; // Asegúrate de ajustar la ruta correcta

const HeaderDashboard = () => {
  const [userName, setUserName] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);  // Estado para controlar la apertura del modal
  const [anchorElement, setAnchorElement] = useState(null);  // Elemento ancla para el modal

  const userCircleRef = useRef(null);  // Ref para el círculo del usuario

  useEffect(() => {
    // Obtener el nombre del usuario desde el localStorage
    const storedUserName = localStorage.getItem('userName');
    if (storedUserName) {
      setUserName(storedUserName);
    }
  }, []);

  const handleCircleClick = () => {
    setIsModalOpen(true);  // Abre el modal
    setAnchorElement(userCircleRef.current);  // Establece el elemento ancla
  };

  const closeModal = () => {
    setIsModalOpen(false);  // Cierra el modal
  };

  return (
    <header className={headerDashboardStyles["header-dashboard"]}>
      {/* <div className="header-left">
        <input type="text" placeholder="Search..." className={headerDashboardStyles["search-bar"]} />
      </div> */}

      <div className={headerDashboardStyles["header-right"]}>
        <div className={headerDashboardStyles["welcome-container"]}>
          <p className={headerDashboardStyles["welcome-text"]}>Hola! <span>{userName}</span></p>
          <div className={headerDashboardStyles["Navbar_circulo"]} ref={userCircleRef} onClick={handleCircleClick}>
            <img src={externalAssetUrl('/img_banco/estrella.webp')} alt="img_representativa" />
          </div>
        </div>
        <div className={headerDashboardStyles["Navbar_circulo"]}>
          <img src={externalAssetUrl('/img_banco/alerta.png')} alt="img_representativa" />
        </div>
      </div>

      {/* Renderiza el modal cuando esté abierto */}
      <UserOptionsModal
        isOpen={isModalOpen}
        onClose={closeModal}
        anchorElement={anchorElement}
        username={userName}
      />
    </header>
  );
};

export default HeaderDashboard;
