"use client";

import React from "react";
import styles from "./Modal.module.css";

export default function Modal({ isOpen = false, onClose = () => { }, booksData = null, children = null }) {
  if (!isOpen || !booksData) return null;

  const {
    types = [],
    name = "",
    // año,
    descriptionBook = "",
    pdfSrc = "",
  } = booksData || {};

  const categories = Array.isArray(types) ? types.filter(Boolean).join(", ") : "";

  return (
    <div className={styles.overlay} onClick={onClose} role="dialog" aria-modal="true">
      <div className={styles.content} onClick={(e) => e.stopPropagation()}>
        <button
          className={styles.closeButton}
          onClick={onClose}
          type="button"
          aria-label="Cerrar modal"
        >
          ×
        </button>

        {name ? <h2 className={styles.title}>{name}</h2> : null}
        {descriptionBook ? <p className={styles.description}>{descriptionBook}</p> : null}
        {categories ? <p className={styles.category}>Categoría: {categories}</p> : null}
        {/* {año ? <p className={styles.year}>Año de Publicación: {año}</p> : null} */}

        <div className={styles.actions}>
          <a
            href={pdfSrc || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.cta}
            aria-disabled={!pdfSrc}
            onClick={(e) => {
              if (!pdfSrc) e.preventDefault();
            }}
          >
            <span>Visualizar</span>
          </a>
        </div>

        <div className={styles.actions}>
          <a
            href={pdfSrc || "#"}
            download
            className={styles.cta}
            aria-disabled={!pdfSrc}
            onClick={(e) => {
              if (!pdfSrc) e.preventDefault();
            }}
          >
            <span>Descargar PDF</span>
            <svg width="13" height="10" viewBox="0 0 13 10" aria-hidden="true" focusable="false">
              <path d="M1,5 L11,5" />
              <polyline points="8 1 12 5 8 9" />
            </svg>
          </a>
        </div>

        {children}
      </div>
    </div>
  );
}
