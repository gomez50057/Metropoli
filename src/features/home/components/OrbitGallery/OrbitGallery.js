"use client";

import { useEffect, useMemo, useState } from "react";
import styles from "./OrbitGallery.module.css";

export default function OrbitGallery({
  images = [],
  orbitCount = 5,
  intervalMs = 3500,
  title = "Galería",
}) {
  const safeImages = Array.isArray(images) ? images.filter(Boolean) : [];
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    setActiveIndex(0);
  }, [safeImages.length]);

  useEffect(() => {
    if (safeImages.length <= 1) return;
    const id = setInterval(() => {
      setActiveIndex((i) => (i + 1) % safeImages.length);
    }, intervalMs);
    return () => clearInterval(id);
  }, [safeImages.length, intervalMs]);

  const activeSrc = safeImages[activeIndex];

  const orbitImages = useMemo(() => {
    if (!safeImages.length) return [];
    const rest = safeImages.filter((_, idx) => idx !== activeIndex);
    return rest.slice(0, Math.min(orbitCount, rest.length));
  }, [safeImages, activeIndex, orbitCount]);

  if (!safeImages.length) return null;

  return (
    <div className={styles.wrap} aria-label={title}>
      <div className={styles.stage}>
        <div className={styles.bgGlow} aria-hidden="true" />
        <div className={styles.ringOuter} aria-hidden="true" />
        <div className={styles.ringInner} aria-hidden="true" />

        {/* Centro grande */}
        <div className={styles.center}>
          <div className={styles.centerFrame}>
            <img key={activeIndex} className={styles.centerImg} src={activeSrc} alt="Imagen principal" />
          </div>
          <div className={styles.centerShine} aria-hidden="true" />
        </div>

        {/* Miniaturas orbitando */}
        {orbitImages.map((src, i) => (
          <button
            key={`${src}-${i}`}
            type="button"
            className={styles.orbitItem}
            style={{ ["--i"]: i, ["--n"]: orbitImages.length || 1 }}
            onClick={() => {
              const idx = safeImages.findIndex((x) => x === src);
              if (idx >= 0) setActiveIndex(idx);
            }}
            aria-label={`Seleccionar imagen ${i + 1}`}
          >
            <span className={styles.orbitBorder} aria-hidden="true" />
            <img className={styles.orbitImg} src={src} alt={`Miniatura ${i + 1}`} />
          </button>
        ))}
      </div>

      {/* Etiqueta inferior sutil */}
      <div className={styles.caption}>
        <span className={styles.badge}>Enfoque</span>
        <span className={styles.captionText}>Cambia automáticamente o toca una miniatura</span>
      </div>
    </div>
  );
}