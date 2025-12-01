import React, { useEffect, useState, useRef } from 'react';
import './HeaderDashboard.css';
import UserOptionsModal from '../shared/UserOptionsModal'; // Asegúrate de ajustar la ruta correcta

const imgBasePath = "https://bibliotecadigitaluplaph.hidalgo.gob.mx/img_banco/";

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
    <header className="header-dashboard">
      {/* <div className="header-left">
        <input type="text" placeholder="Search..." className="search-bar" />
      </div> */}

      <div className="header-right">
        <div className="welcome-container">
          <p className="welcome-text">Hola! <span>{userName}</span></p>
          <div className="Navbar_circulo" ref={userCircleRef} onClick={handleCircleClick}>
            <img src={`${imgBasePath}estrella.webp`} alt="img_representativa" />
          </div>
        </div>
        <div className="Navbar_circulo">
          <img src={`${imgBasePath}alerta.png`} alt="img_representativa" />
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
