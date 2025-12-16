"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import styles from "@/styles/ActuPozmvm/TalleresCenterSlider.module.css";

function useMediaQuery(query) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia(query);

    const onChange = () => setMatches(mq.matches);
    onChange();

    if (mq.addEventListener) mq.addEventListener("change", onChange);
    else mq.addListener(onChange);

    return () => {
      if (mq.removeEventListener) mq.removeEventListener("change", onChange);
      else mq.removeListener(onChange);
    };
  }, [query]);

  return matches;
}

export default function TalleresCenterSlider({
  items = [
    {
      name: "Segundo Taller de Planeación Participativa para la Elaboración del Programa de Ordenación de la Zona Metropolitana del Valle de México (POZMVM) - Tizayuca",
      date: "28 de octubre, 2025",
      image: "/img/noticias/ZMVM/taller-PPEPOZMVM/2do Taller de Planeación Participativa Tizayuca.jpg",
      link: "/noticias/segundo-taller-de-planeacion-participativa-para-la-elaboracion-del-programa-de-ordenacion-de-la-zona-metropolitana-del-valle-de-mexico-pozmvm---tizayuca",
    },
    {
      name: "Segundo Taller de Planeación Participativa para la Elaboración del Programa de Ordenación de la Zona Metropolitana del Valle de México (POZMVM) - Tlaxcoapan",
      date: "23 de octubre, 2025",
      image: "/img/noticias/ZMVM/taller-PPEPOZMVM/2do Taller de Planeación Participativa Tlaxcoapan.jpg",
      link: "/noticias/segundo-taller-de-planeacion-participativa-para-la-elaboracion-del-programa-de-ordenacion-de-la-zona-metropolitana-del-valle-de-mexico-pozmvm---tlaxcoapan",
    },
    {
      name: "Primer Taller de Planeación Participativa para la Elaboración del Programa de Ordenación de la Zona Metropolitana del Valle de México (POZMVM) - Tula de Allende",
      date: "25 de julio, 2025",
      image: "/img/noticias/ZMVM/taller-PPEPOZMVM/1er Taller de Planeación Participativa Tula de Allende.jpg",
      link: "/noticias/primer-taller-de-planeacion-participativa-para-la-elaboracion-del-programa-de-ordenacion-de-la-zona-metropolitana-del-valle-de-mexico-pozmvm---tula-de-allende",
    },
    {
      name: "Primer Taller de Planeación Participativa para la Elaboración del Programa de Ordenación de la Zona Metropolitana del Valle de México (POZMVM) - Atitalaquia",
      date: "24 de julio, 2025",
      image: "/img/noticias/ZMVM/taller-PPEPOZMVM/1er Taller de Planeación Participativa Atitalaquia.jpg",
      link: "/noticias/primer-taller-de-planeacion-participativa-para-la-elaboracion-del-programa-de-ordenacion-de-la-zona-metropolitana-del-valle-de-mexico-pozmvm---atitalaquia",
    },
  ],
}) {
  const wrapRef = useRef(null);
  const trackRef = useRef(null);
  const touchRef = useRef({ sx: 0, sy: 0 });

  const data = useMemo(() => items ?? [], [items]);

  const isMobile = useMediaQuery("(max-width: 767px)");
  const reduceMotion = useMediaQuery("(prefers-reduced-motion: reduce)");

  const [current, setCurrent] = useState(0);

  const clampIndex = useCallback(
    (i) => Math.max(0, Math.min(i, data.length - 1)),
    [data.length]
  );

  const center = useCallback(
    (i) => {
      const wrap = wrapRef.current;
      const track = trackRef.current;
      if (!wrap || !track) return;

      const cards = Array.from(track.children);
      const card = cards[i];
      if (!card) return;

      const axis = isMobile ? "top" : "left";
      const size = isMobile ? "clientHeight" : "clientWidth";
      const start = isMobile ? card.offsetTop : card.offsetLeft;

      wrap.scrollTo({
        [axis]: start - (wrap[size] / 2 - card[size] / 2),
        behavior: reduceMotion ? "auto" : "smooth",
      });
    },
    [isMobile, reduceMotion]
  );

  const activate = useCallback(
    (i, scroll = true) => {
      const nextIndex = clampIndex(i);
      setCurrent((prev) => (prev === nextIndex ? prev : nextIndex));
      if (scroll) requestAnimationFrame(() => center(nextIndex));
    },
    [clampIndex, center]
  );

  const go = useCallback((step) => activate(current + step, true), [activate, current]);

  useEffect(() => {
    if (!data.length) return;
    setCurrent((prev) => clampIndex(prev));
    requestAnimationFrame(() => center(clampIndex(current)));
  }, [data.length, isMobile]);

  useEffect(() => {
    if (!data.length) return;

    const onKeyDown = (e) => {
      if (["ArrowRight", "ArrowDown"].includes(e.key)) go(1);
      if (["ArrowLeft", "ArrowUp"].includes(e.key)) go(-1);
    };

    window.addEventListener("keydown", onKeyDown, { passive: true });
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [data.length, go]);

  if (!data.length) return null;

  return (
    <section className={styles.section} aria-roledescription="carousel">
      <div className={styles.head}>
        <div className={styles.contentTitule}>
          <p className={styles.tituleBack}>¿Cómo fue?</p>
          <p className={styles.titleFrond}>¿Cómo fue?</p>
        </div>

        <h3 className={styles.title}>
          <span className="span-vino">Así</span> se<span className="span-vino">vivieron </span> los{" "}
          <span className="span-doarado">Taller</span> en{" "}
          <span className="span-doarado">Hidalgo</span>
        </h3>

        <div className={styles.controls}>
          <button
            type="button"
            className={styles.navBtn}
            onClick={() => go(-1)}
            disabled={current === 0}
            aria-label="Anterior"
          >
            ‹
          </button>
          <button
            type="button"
            className={styles.navBtn}
            onClick={() => go(1)}
            disabled={current === data.length - 1}
            aria-label="Siguiente"
          >
            ›
          </button>
        </div>
      </div>

      <div className={styles.slider} ref={wrapRef}>
        <div
          className={styles.track}
          ref={trackRef}
          onTouchStart={(e) => {
            touchRef.current.sx = e.touches[0].clientX;
            touchRef.current.sy = e.touches[0].clientY;
          }}
          onTouchEnd={(e) => {
            const dx = e.changedTouches[0].clientX - touchRef.current.sx;
            const dy = e.changedTouches[0].clientY - touchRef.current.sy;

            const trigger = isMobile ? Math.abs(dy) > 60 : Math.abs(dx) > 60;
            if (!trigger) return;

            const val = isMobile ? dy : dx;
            go(val > 0 ? -1 : 1);
          }}
        >
          {data.map((item, idx) => {
            const isActive = idx === current;
            const shortTitle = item.name?.split(" - ").pop() || item.name;

            return (
              <article
                key={item.link ?? `${item.name}-${idx}`}
                className={styles.card}
                data-active={isActive ? "true" : undefined}
                role="button"
                tabIndex={0}
                aria-label={`Abrir ${shortTitle}`}
                onClick={() => activate(idx, true)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    activate(idx, true);
                  }
                }}
                onMouseEnter={() => {
                  if (
                    typeof window !== "undefined" &&
                    window.matchMedia("(hover:hover)").matches
                  ) {
                    activate(idx, true);
                  }
                }}
              >
                <img className={styles.bg} src={item.image} alt="" aria-hidden="true" />

                <div className={styles.content}>
                  <img className={styles.thumb} src={item.image} alt={item.name} loading="lazy" />

                  <div className={styles.text}>
                    <h3 className={styles.cardTitle}>{shortTitle}</h3>

                    <p className={styles.desc}>{item.name}</p>
                    <p className={styles.desc}>{item.date}</p>

                    <Link className={styles.btn} href={item.link} target="_blank" rel="noopener noreferrer" prefetch={false}>
                      Ver detalles
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      <div className={styles.dots} aria-label="Indicadores">
        {data.map((_, i) => (
          <button
            key={i}
            type="button"
            className={`${styles.dot} ${i === current ? styles.dotActive : ""}`}
            onClick={() => activate(i, true)}
            aria-label={`Ir a elemento ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
