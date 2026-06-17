import React, { useState } from 'react';
import CloseIcon from "@mui/icons-material/Close";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import styles from './ChatbotWelcome.module.css';

const ChatbotWelcome = ({ onStartChat }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleToggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <>
      {!isCollapsed ? (
        <div className={styles.chatbotWelcome}>
          <div className={styles.header}>
            <button className={styles.iconButtonXs} onClick={handleToggleCollapse}><CloseIcon className={styles.iconHeader} /></button>
          </div>
          <div className={styles.content}>
            <img src="img/headertxt.png" alt="Metrópoli Hidalgo" className={styles.logotxt} />
            <img src="img/sidebarRecurso.png" alt="Chatbot Logo" className={styles.logo} />
            <h1 className={styles.title}>¡Hola!, Bienvenid@ al</h1>
            <h2 className={styles.subtitle}>Chatbot de <span>Metrópoli Hidalgo</span></h2>
            <p className={styles.description}>Un asistente Metropolitano</p>
          </div>
          <button className={styles.startButton} onClick={onStartChat}>
            Iniciar Chat
            <span className={styles.arrowIcon}>
              <ArrowForwardIosIcon fontSize="small" />
            </span>
          </button>
        </div>
      ) : (
        <img
          src="img/sidebarRecurso.png"
          alt="Chatbot Logo"
          className={styles.logoCollapsed}
          onClick={handleToggleCollapse}
        />
      )}
    </>
  );
};

export default ChatbotWelcome;
