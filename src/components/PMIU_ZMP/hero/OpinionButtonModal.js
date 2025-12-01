"use client";

import { useMemo, useState } from "react";
import styles from "@/styles/PMIU_ZMP/hero/OpinionButtonModal.module.css";

/** (Opcional) mover a "@/utils/opinion_links.js" */
export const OPINION_LINKS = {
  epazoyucan: { encuesta: "https://docs.google.com/forms/d/e/1FAIpQLSfsi8OzJO7icEa6-UDdgaYCv8TH5jNoVh1U6_h6-yiPQINYFA/viewform" },
  "mineral-reforma": { encuesta: "https://docs.google.com/forms/d/e/1FAIpQLSdIEqGlVbpePoHKob1AQ9g7iXWZbUuN67qtBkfNBgis9KHgIw/viewform" },
  "mineral-monte": { encuesta: "https://docs.google.com/forms/d/e/1FAIpQLSfUqAs2r1UwAI39vNeS54njpT-RSr3uR7sIlUwgFUJH0HsvBA/viewform" },
  pachuca: { encuesta: "https://docs.google.com/forms/d/e/1FAIpQLSfTGVpEXcBZOV3p58hZn1jW5LIDt96xa6dTctgp9wV5Dm_8IQ/viewform" },
  "san-agustin-tlaxiaca": { encuesta: "https://docs.google.com/forms/d/e/1FAIpQLSd-1dzfiBDMP4CG4sTuL4Ha1nwV94XV-ydNwo40_lGG3oX72g/viewform" },
  zapotlan: { encuesta: "https://docs.google.com/forms/d/e/1FAIpQLSd5RWDiQTvh_g0YHQ2H8JPdnJnkGDzrc217nnsw8KAwkCkLEA/viewform" },
  zempoala: { encuesta: "https://docs.google.com/forms/d/e/1FAIpQLSeyfSsxnareGC6Koyf4Y1_zp1ZfYHOksziL9c4Mlu_s7ttmPg/viewform" },
};

function toLabel(slug) {
  return slug
    .split("-")
    .map(s => (s ? s[0].toUpperCase() + s.slice(1) : s))
    .join(" ")
    .replace("Agustin", "Agustín");
}

export default function OpinionButtonModal({
  links = OPINION_LINKS,
  question = "¿Qué municipio te interesa?",
  onOpen,
  onClose,
}) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState("");

  const options = useMemo(
    () => Object.keys(links || {}).map(k => ({ slug: k, label: toLabel(k) })),
    [links]
  );

  function openSurvey(slug, e) {
    e?.stopPropagation();
    const href = links[slug]?.encuesta;
    if (href) window.open(href, "_blank", "noopener,noreferrer");
  }

  function handleOpen() { setOpen(true); onOpen?.(); }
  function handleClose() { setOpen(false); onClose?.(); }
  function handleConfirm() {
    if (!selected) return;
    const href = links[selected]?.encuesta;
    if (href) {
      window.open(href, "_blank", "noopener,noreferrer");
      handleClose();
    }
  }
  return (
    <div className={styles.btnWrap}>
      <h3 className={styles.tituloBtn}><span className="span-doarado">Participa</span> en la <span className="span-doarado">Consulta </span> </h3>
      <p className={styles.descriptionBtn}><span>Opinión ciudadana </span>Tu opinión es clave para fortalecer el PMIU. Responde el cuestionario del municipio que te interese.</p>

      <button type="button" className={styles.opinionBtn} onClick={handleOpen}>
        <div className={styles.outlineGlow}></div>
        <div className={`${styles.btnState} ${styles.btnStateDefault}`}>
          <div className={styles.btnIcon}>
            {/* Ícono: Opinar (globo de diálogo + líneas) */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="1.2em"
              height="1.2em"
              aria-hidden="true"
            >
              <g style={{ filter: "url(#opinarShadow)" }}>
                {/* Globo (borde redondeado) */}
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
                {/* Cola del globo */}
                <path
                  d="M7.5 17 L4 21 L4 17 Z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
                {/* Líneas de “texto” */}
                <line x1="7" y1="8.5" x2="17" y2="8.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                <line x1="7" y1="11.5" x2="15" y2="11.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                <line x1="7" y1="14" x2="12.5" y2="14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </g>
              <defs>
                <filter id="opinarShadow">
                  <feDropShadow floodOpacity="0.6" stdDeviation="0.8" dy="1" dx="0" />
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

        <div className={`${styles.btnState} ${styles.btnStateSent}`}>
          <div className={styles.btnIcon}>
            {/* Check */}
            <svg stroke="black" strokeWidth="0.5px" width="1.2em" height="1.2em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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
            {/* espacio intencional sin span para aplicar nth-child(8) a la "s" */}
            <span style={{ "--i": 9 }}>j</span>
            <span style={{ "--i": 10 }}>u</span>
            <span style={{ "--i": 11 }}>n</span>
            <span style={{ "--i": 12 }}>t</span>
            <span style={{ "--i": 13 }}>o</span>
            <span style={{ "--i": 14 }}>s</span>
          </p>
        </div>
      </button>

      {/* Modal */}
      {open && (
        <div className={styles.modalBackdrop} role="dialog" aria-modal="true" aria-label="Elegir municipio">
          <div className={styles.modalCard}>
            <div className={styles.modalHeader}>
              <h4 className={styles.modalTitle}>{question}</h4>
              <button type="button" className={styles.modalClose} aria-label="Cerrar" onClick={handleClose}>
                ×
              </button>
            </div>

            <div className={styles.modalBody}>
              <div className={styles.modalOptions}>
                {options.map(opt => (
                  <label key={opt.slug} className={styles.modalOption}>
                    <input
                      type="radio"
                      name="municipio"
                      value={opt.slug}
                      checked={selected === opt.slug}
                      onChange={() => setSelected(opt.slug)}
                    />
                    <a
                      href={links[opt.slug]?.encuesta}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.optionLink}
                      onClick={(e) => e.stopPropagation()}
                      aria-label={`Abrir encuesta de ${opt.label}`}
                      title={`Abrir encuesta de ${opt.label}`}
                    >
                      {opt.label}
                    </a>
                  </label>
                ))}
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button type="button" className={styles.modalSecondary} onClick={handleClose}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
