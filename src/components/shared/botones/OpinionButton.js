"use client";

import { useState } from "react";
import styles from "./OpinionButton.module.css";

export default function OpinionButton({
  mode = "link", // "link" | "modal"
  href = "#",    // usado cuando mode === "link"
  modalTitle = "¿Cómo quieres participar?",
  modalOptions = [
    { label: "Encuesta ciudadana", href: "#" },
    { label: "Encuesta técnica", href: "#" },
  ],
}) {
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    if (mode === "link") {
      if (href && href !== "#") {
        window.open(href, "_blank", "noopener,noreferrer");
      }
    } else if (mode === "modal") {
      setOpen(true);
    }
  };

  const handleClose = () => setOpen(false);

  const handleOptionClick = (optionHref) => {
    if (optionHref && optionHref !== "#") {
      window.open(optionHref, "_blank", "noopener,noreferrer");
    }
    setOpen(false);
  };

  return (
    <div className={styles.btnWrap}>
      {/* <h3 className={styles.tituloBtn}>
        <span className="span-doarado">Participa</span> en la{" "}
        <span className="span-doarado">Consulta</span>
      </h3>

      <p className={styles.descriptionBtn}>
        <span>Opinión ciudadana </span>
        Tu opinión es clave para fortalecer el PMIU. Responde el cuestionario
        del municipio que te interese.
      </p> */}

      {/* BOTÓN PRINCIPAL */}
      <button
        type="button"
        className={styles.opinionBtn}
        onClick={handleClick}
      >
        <div className={styles.outlineGlow}></div>

        {/* Estado “Opinar” */}
        <div className={`${styles.btnState} ${styles.btnStateDefault}`}>
          <div className={styles.btnIcon}>
            {/* Ícono: globo de diálogo */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="1.2em"
              height="1.2em"
              aria-hidden="true"
            >
              <g style={{ filter: "url(#opinarShadow)" }}>
                <rect
                  x="3"
                  y="3"
                  width="18"
                  height="14"
                  rx="3"
                  ry="3"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <path
                  d="M7.5 17 L4 21 L4 17 Z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
                <line
                  x1="7"
                  y1="8.5"
                  x2="17"
                  y2="8.5"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
                <line
                  x1="7"
                  y1="11.5"
                  x2="15"
                  y2="11.5"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
                <line
                  x1="7"
                  y1="14"
                  x2="12.5"
                  y2="14"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </g>
              <defs>
                <filter id="opinarShadow">
                  <feDropShadow
                    floodOpacity="0.6"
                    stdDeviation="0.8"
                    dy="1"
                    dx="0"
                  />
                </filter>
              </defs>
            </svg>
          </div>

          <p>
            <span style={{ "--i": 0 }}>O</span>
            <span style={{ "--i": 1 }}>p</span>
            <span style={{ "--i": 2 }}>i</span>
            <span style={{ "--i": 3 }}>n</span>
            <span style={{ "--i": 4 }}>a</span>
            <span style={{ "--i": 5 }}>r</span>
          </p>
        </div>

        {/* Estado “Crecemos juntos” (hover) */}
        <div className={`${styles.btnState} ${styles.btnStateSent}`}>
          <div className={styles.btnIcon}>
            <svg
              stroke="black"
              strokeWidth="0.5px"
              width="1.2em"
              height="1.2em"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g style={{ filter: "url(#shadow)" }}>
                <path
                  d="M12 22.75C6.07 22.75 1.25 17.93 1.25 12C1.25 6.07 6.07 1.25 12 1.25C17.93 1.25 22.75 6.07 22.75 12C22.75 17.93 17.93 22.75 12 22.75ZM12 2.75C6.9 2.75 2.75 6.9 2.75 12C2.75 17.1 6.9 21.25 12 21.25C17.1 21.25 21.25 17.1 21.25 12C21.25 6.9 17.1 2.75 12 2.75Z"
                  fill="currentColor"
                ></path>
                <path
                  d="M10.5795 15.5801C10.3795 15.5801 10.1895 15.5001 10.0495 15.3601L7.21945 12.5301C6.92945 12.2401 6.92945 11.7601 7.21945 11.4701C7.50945 11.1801 7.98945 11.1801 8.27945 11.4701L10.5795 13.7701L15.7195 8.6301C16.0095 8.3401 16.4895 8.3401 16.7795 8.6301C17.0695 8.9201 17.0695 9.4001 16.7795 9.6901L11.1095 15.3601C10.9695 15.5001 10.7795 15.5801 10.5795 15.5801Z"
                  fill="currentColor"
                ></path>
              </g>
            </svg>
          </div>

          <p>
            <span style={{ "--i": 0 }}>C</span>
            <span style={{ "--i": 1 }}>r</span>
            <span style={{ "--i": 2 }}>e</span>
            <span style={{ "--i": 3 }}>c</span>
            <span style={{ "--i": 4 }}>e</span>
            <span style={{ "--i": 5 }}>m</span>
            <span style={{ "--i": 6 }}>o</span>
            <span style={{ "--i": 7 }}>s</span>
            <span style={{ "--i": 9 }}>j</span>
            <span style={{ "--i": 10 }}>u</span>
            <span style={{ "--i": 11 }}>n</span>
            <span style={{ "--i": 12 }}>t</span>
            <span style={{ "--i": 13 }}>o</span>
            <span style={{ "--i": 14 }}>s</span>
          </p>
        </div>
      </button>

      {/* MODAL SOLO SI mode="modal" */}
      {mode === "modal" && open && (
        <div
          className={styles.modalBackdrop}
          role="dialog"
          aria-modal="true"
          aria-label={modalTitle}
        >
          <div className={styles.modalCard}>
            <div className={styles.modalHeader}>
              <h4 className={styles.modalTitle}>{modalTitle}</h4>
              <button
                type="button"
                className={styles.modalClose}
                aria-label="Cerrar"
                onClick={handleClose}
              >
                ×
              </button>
            </div>

            <div className={styles.modalBody}>
              <div className={styles.modalOptions}>
                {modalOptions.map((opt) => (
                  <button
                    key={opt.label}
                    type="button"
                    className={styles.modalOption}
                    onClick={() => handleOptionClick(opt.href)}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button
                type="button"
                className={styles.modalSecondary}
                onClick={handleClose}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
