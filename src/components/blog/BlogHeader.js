import { useState, useEffect, useCallback, useMemo } from "react";
import styles from "./BlogHeader.module.css";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
import Link from "next/link";
import { normalizeName, blogPosts } from "../../utils/blogData";

/** Normaliza una ruta para que sea segura en URL (sin doble codificar) */
const safeUrl = (path) => {
  if (!path || typeof path !== "string") return "/img/noticias/fallback.webp";
  try {
    // Si ya viene codificada, decode -> encode la normaliza sin doblecodificar
    return encodeURI(decodeURI(path));
  } catch {
    // Si falló el decodeURI (caracteres inválidos), al menos encode lo mejor posible
    return encodeURI(path);
  }
};

const BlogHeader = () => {
  // Tomamos solo posts con bgPosts:true y mapeamos a {name, date, image}
  const posts = useMemo(
    () =>
      (blogPosts || [])
        .filter((p) => p.bgPosts === true)
        .map((p) => ({
          name: p.name,
          date: p.date,
          image: safeUrl(p.image),
        })),
    []
  );

  if (!posts.length) return null;

  const [activeIndex, setActiveIndex] = useState(0);
  const [animationKey, setAnimationKey] = useState(0);
  const [manualChange, setManualChange] = useState(false);

  useEffect(() => {
    setAnimationKey((k) => k + 1);
  }, [activeIndex]);

  useEffect(() => {
    if (!manualChange) {
      const id = setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % posts.length);
      }, 6000);
      return () => clearInterval(id);
    }
  }, [manualChange, posts.length]);

  const restartAutoAdvance = useCallback(() => setManualChange(false), []);

  const handleNext = () => {
    setManualChange(true);
    setActiveIndex((prev) => (prev + 1) % posts.length);
    restartAutoAdvance();
  };

  const handlePrev = () => {
    setManualChange(true);
    setActiveIndex((prev) => (prev - 1 + posts.length) % posts.length);
    restartAutoAdvance();
  };

  const getNextIndex = (index, offset) => (index + offset) % posts.length;

  const handlePreviewClick = (index) => {
    setManualChange(true);
    setActiveIndex(index);
    restartAutoAdvance();
  };

  const previewCount = Math.min(2, Math.max(0, posts.length - 1));

  return (
    <div
      className={styles.container}
      style={{ backgroundImage: `url(${posts[activeIndex].image})` }}
      aria-label="Encabezado de noticias con carrusel"
    >
      <div className={styles.overlay} />

      <div className={styles.content}>
        <div
          key={`${animationKey}-name`}
          className={`${styles.name} ${styles.textAnimation} ${styles.delay1}`}
        >
          {posts[activeIndex].name}
        </div>

        <div
          key={`${animationKey}-date`}
          className={`${styles.des} ${styles.textAnimation} ${styles.delay2}`}
        >
          {posts[activeIndex].date}
        </div>

        <Link
          href={`/noticias/${normalizeName(posts[activeIndex].name)}`}
          className={`${styles.cta} ${styles.textAnimation} ${styles.delay3}`}
          aria-label={`Leer más sobre ${posts[activeIndex].name}`}
        >
          Leer más
        </Link>
      </div>

      <div className={styles.previewContainer} aria-label="Siguientes slides">
        {Array(previewCount)
          .fill(null)
          .map((_, offset) => {
            const nextIndex = getNextIndex(activeIndex, offset + 1);
            return (
              <button
                key={`${nextIndex}-${posts[nextIndex].name}`}
                type="button"
                className={`${styles.previewItem} ${styles.slideAnimation}`}
                style={{ backgroundImage: `url(${posts[nextIndex].image})` }}
                onClick={() => handlePreviewClick(nextIndex)}
                aria-label={`Ir a: ${posts[nextIndex].name}`}
                title={posts[nextIndex].name}
              />
            );
          })}
      </div>

      <div className={styles.controls}>
        <button
          type="button"
          className={styles.prevButton}
          onClick={handlePrev}
          aria-label="Anterior"
          title="Anterior"
        >
          <ArrowBackIos fontSize="small" />
        </button>
        <button
          type="button"
          className={styles.nextButton}
          onClick={handleNext}
          aria-label="Siguiente"
          title="Siguiente"
        >
          <ArrowForwardIos fontSize="small" />
        </button>
      </div>
    </div>
  );
};

export default BlogHeader;
