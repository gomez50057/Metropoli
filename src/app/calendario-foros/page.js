"use client";

import styles from "./PdfEmbedPage.module.css";
import Navbar from '@/components/shared/Navbar';

export default function PdfEmbedPage() {
  const pdfSrc = "/docs/Calendario.pdf#view=FitH&zoom=page-width";

  return (
    <>
      <Navbar />
      <div className={styles.pageWrapper}>
        <div className={styles.iframeContainer}>
          <iframe
            className={styles.iframe}
            src={pdfSrc}
            title="Documento PDF"
            allowFullScreen
          />
        </div>

        <a className={styles.fallbackLink} href={pdfSrc} target="_blank" rel="noopener noreferrer">
          Abrir/descargar PDF en una pestaña nueva
        </a>
      </div>
    </>
  );
}
