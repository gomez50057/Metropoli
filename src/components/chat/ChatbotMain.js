"use client";

import React, { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import HomeIcon from "@mui/icons-material/Home";
import styles from "./ChatbotMain.module.css";
import ChatbotWelcome from "./ChatbotWelcome";
import ChatForms from "./ChatForms";

const ChatbotMain = () => {
  const [formData, setFormData] = useState({});
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState("menu");
  const [selectedZone, setSelectedZone] = useState("");

  const handleStartChat = () => setIsChatOpen(true);
  const handleCollapseChat = () => setIsChatOpen(false);

  const handleMenuClick = (step, zone = "") => {
    setFormData({});
    setCurrentStep(step);
    if (zone) setSelectedZone(zone);
  };

  const resetToMainMenu = () => {
    setCurrentStep("menu");
    setFormData({ name: "", description: "", municipalities: "" });
    setSelectedZone("");
  };

  const renderMenu = () => (
    <div className={styles.menu}>
      <div className={styles.header}>
        <img src="img/sidebarRecurso.png" alt="Chatbot Logo" className={styles.logo} />
        <div>
          <img src="img/headertxt.png" alt="Metrópoli Hidalgo" className={styles.logotxt} />
          <div className={styles.welcomeText}>
            <p>¡HOLA!<span>¿Cómo puedo ayudarte?</span></p>
          </div>
        </div>
      </div>
      <ul className={styles.options}>
        {/* <li onClick={() => handleMenuClick("proposal")}>
          <div className={styles.icon}>
            <img src="/img/chatBot/proposal.png" alt="Icono" />
          </div>
          <div className={styles.content}>
            <h4>Quiero hacer una propuesta metropolitana</h4>
            <p>Desarrolla una idea pensando en el futuro Metropolitano.</p>
          </div>
        </li> */}
        {/* <li onClick={() => handleMenuClick("zoneInfo")}>
          <div className={styles.icon}>
            <img src="/img/chatBot/zoneInfo.png" alt="Icono" />
          </div>
          <div className={styles.content}>
            <h4>Quiero información acerca de alguna de las zonas metropolitanas</h4>
            <p>Conoce lo más relevante de cada zona Metropolitana.</p>
          </div>
        </li> */}
        <a
          href="/noticias"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.linkItem}
        >
          <li>
            <div className={styles.icon}>
              <img src="/img/chatBot/authorities.png" alt="Icono" />
            </div>
            <div className={styles.content}>
              <h4>Quiero conocer el trabajo de las autoridades en materia metropolitana</h4>
              <p>Descubre cómo las autoridades gestionan y coordinan el desarrollo y bienestar de las zonas metropolitanas.</p>
            </div>
          </li>
        </a>

        <a
          href="/mapa-proyectos"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.linkItem}
        >
          <li>
            <div className={styles.icon}>
              <img src="/img/chatBot/projects.png" alt="Icono" />
            </div>
            <div className={styles.content}>
              <h4>Quiero conocer los proyectos metropolitanos</h4>
              <p>Explora los proyectos metropolitanos a través de un mapa interactivo y conoce su impacto en la región.</p>
            </div>
          </li>
        </a>
        <a
          href="https://bibliotecadigitaluplaph.hidalgo.gob.mx/"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.linkItem}
        >
          <li>
            <div className={styles.icon}>
              <img src="/img/chatBot/planning.png" alt="Icono" />
            </div>
            <div className={styles.content}>
              <h4>Quiero conocer los instrumentos de planeación</h4>
              <p>Accede a la biblioteca digital y descubre herramientas clave para la coordinación metropolitana.</p>
            </div>
          </li>
        </a>
        <li onClick={() => handleMenuClick("cartography")}>
          <div className={styles.icon}>
            <img src="/img/chatBot/cartography.png" alt="Icono" />
          </div>
          <div className={styles.content}>
            <h4>Quiero Explorar la Cartografía de las Zonas Metropolitanas</h4>
            <p>Visualiza el mapa en PDF con las delimitaciones de cada Zona Metropolitana, sus límites territoriales y los municipios que las integran.</p>
          </div>
        </li>
      </ul>
    </div>
  );

  const renderProposalForm = () => (
    <div className={styles.step}>
      <ChatForms handleMenuClick={handleMenuClick} />
    </div>
  );

  const renderZoneInfo = () => (
    <div className={styles.chatbotStep}>
      <p>Claro que sí, ¿Qué Zona Metropolitana te interesa conocer?</p>
      <ul>
        <li onClick={() => handleMenuClick("zoneDetails", setSelectedZone("ZMVM"))}>
          Zona Metropolitana del Valle de México
        </li>
        <li onClick={() => handleMenuClick("zoneDetails", setSelectedZone("ZMPachuca"))}>
          Zona Metropolitana de Pachuca
        </li>
        <li onClick={() => handleMenuClick("zoneDetails", setSelectedZone("ZMTulancingo"))}>
          Zona Metropolitana de Tulancingo
        </li>
        <li onClick={() => handleMenuClick("zoneDetails", setSelectedZone("ZMTula"))}>
          Zona Metropolitana de Tula
        </li>
      </ul>
    </div>
  );

  const renderZoneDetails = () => (
    <div className={styles.chatbotStep}>
      <p>¡Claro! Te comparto la ficha de la zona {selectedZone}:</p>
      <a
        href={`/${selectedZone.toLowerCase()}-ficha.pdf`}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.linkInline}
      >
        Ver Ficha
      </a>
      <button className={styles.iconButtonXl} onClick={resetToMainMenu}><HomeIcon className={styles.iconHeader} />Regresar al menú principal</button>
    </div>
  );

  const renderResponseWithLink = (message, link) => (
    <div className={styles.chatbotStep}>
      <p>{message}</p>
      <a href={link} target="_blank" rel="noopener noreferrer" className={styles.linkInline}>Ver más</a>
      <button className={styles.iconButtonXl} onClick={resetToMainMenu}><HomeIcon className={styles.iconHeader} />Regresar al menú principal</button>
    </div>
  );

  const renderCartography = () => (
    <div className={styles.chatbotStep}>
      <p>Escoge una de las Zonas Metropolitanas para visualizar la cartografía:</p>
      <ul>
        <a
          href="chat/cartografía metropolitana/zmvm-cartografia.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.linkItem}
        >
          <li>Zona Metropolitana del Valle de México</li>
        </a>
        <a
          href="chat/cartografía metropolitana/zmpachuca-cartografia.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.linkItem}
        >
          <li>Zona Metropolitana de Pachuca</li>
        </a>
        <a
          href="chat/cartografía metropolitana/zmtulancingo-cartografia.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.linkItem}
        >
          <li>Zona Metropolitana de Tulancingo</li>
        </a>
        <a
          href="chat/cartografía metropolitana/zmtula-cartografia.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.linkItem}
        >
          <li>Zona Metropolitana de Tula</li>
        </a>
      </ul>
    </div>
  );

  const renderCartographyDetails = () => (
    <div className={styles.chatbotStep}>
      <p>Con gusto, te comparto el siguiente documento donde podrás visualizar toda la cartografía de la zona {selectedZone}:</p>
      <a
        href={`chat/cartografía metropolitana/${selectedZone.toLowerCase()}-cartografia.pdf`}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.linkInline}
      >
        Ver Cartografía
      </a>
      <button className={styles.iconButtonXl} onClick={resetToMainMenu}><HomeIcon className={styles.iconHeader} />Regresar al menú principal</button>

    </div>
  );

  const renderContent = () => {
    switch (currentStep) {
      case "menu":
        return renderMenu();
      case "proposal":
        return renderProposalForm();
      case "proposalThanks":
        return (
          <div className={styles.step}>
            <div>
              <p>¡Gracias por compartir tu propuesta! La tomaremos en cuenta para seguir construyendo juntos un mejor futuro metropolitano. </p>
              <p>Tu participación es clave para construir un futuro más sostenible e innovador para Hidalgo. ¡Sigue contribuyendo</p>
              <p>¡Tu voz es el motor del cambio!</p>
            </div>
            <button className={styles.iconButtonXl} onClick={resetToMainMenu}><HomeIcon className={styles.iconHeader} />Regresar al menú principal</button>
          </div>
        );
      case "zoneInfo":
        return renderZoneInfo();
      case "zoneDetails":
        return renderZoneDetails();
      case "cartography":
        return renderCartography();
      case "cartographyDetails":
        return renderCartographyDetails();
      default:
        return renderMenu();
    }
  };

  return (
    <>
      {!isChatOpen ? (
        <ChatbotWelcome onStartChat={handleStartChat} />
      ) : (
        <div className={styles.container}>
          <div className={styles.containerHeader}>
            <button className={styles.iconButtonXs} onClick={handleCollapseChat}><CloseIcon className={styles.iconHeader} /></button>
            <button className={styles.iconButtonXs} onClick={resetToMainMenu}><HomeIcon className={styles.iconHeader} /></button>
          </div>
          <div className={styles.containerMain}>
            {renderContent()}
          </div>
        </div>
      )}
    </>
  );
};

export default ChatbotMain;
