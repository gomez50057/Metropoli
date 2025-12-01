"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Flip } from "gsap/Flip";
import styles from "@/styles/ActuPozmvm/Hero.module.css";

// Imágenes por defecto: /img/pozmvm/hero-01.webp ... hero-12.webp
const DEFAULT_BG_IMAGES = Array.from({ length: 12 }, (_, i) =>
  `/img/pozmvm/hero-${String(i + 1).padStart(2, "0")}.webp`
);

export default function FlipHero({
  startDelay = 1,
  // hold largo para el estado especial "focus"
  finalHold = 3.5,
  otherHold = 1.5,
  // ciclo base; si letters === "POZMVM" le inyectamos "focus"
  cycle = ["final", "plain", "columns", "grid"],
  letters = "POZMVM",
  complement = "Programa de Ordenación de la Zona Metropolitana del Valle de México",
  posters = DEFAULT_BG_IMAGES,

}) {
  const containerRef = useRef(null);
  const layoutIdxRef = useRef(0);
  const delayedRef = useRef(null);
  const cycleRef = useRef([]);

  const [bgIndex, setBgIndex] = useState(0);

  const chars = Array.from(letters || "");
  const palette = [styles.F, styles.l, styles.i, styles.p];

  // ---- Carrusel de imágenes de fondo ----
  useEffect(() => {
    const images =
      Array.isArray(posters) && posters.length > 0
        ? posters
        : DEFAULT_BG_IMAGES;

    if (images.length <= 1) return; 

    const interval = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % images.length);
    }, 8000); // cada 8s cambia

    return () => clearInterval(interval);
  }, [posters]);

  // ---- Animación Flip de letras / layouts ----
  useEffect(() => {
    gsap.registerPlugin(Flip);

    const container = containerRef.current;
    if (!container) return;

    // ciclo base
    const baseCycle =
      Array.isArray(cycle) && cycle.length
        ? cycle
        : ["final", "plain", "columns", "grid"];

    let effectiveCycle = baseCycle;

    // Solo para el hero de POZMVM insertamos "focus"
    if (letters === "POZMVM" && !baseCycle.includes("focus")) {
      const idxFinal = baseCycle.indexOf("final");
      if (idxFinal >= 0) {
        // final → focus → resto
        effectiveCycle = [
          ...baseCycle.slice(0, idxFinal + 1),
          "focus",
          ...baseCycle.slice(idxFinal + 1),
        ];
      } else {
        effectiveCycle = [...baseCycle, "focus"];
      }
    }

    cycleRef.current = effectiveCycle;
    layoutIdxRef.current = 0;

    // limpiar clases previas
    const allLayouts = ["final", "plain", "columns", "grid", "focus"];
    allLayouts.forEach((name) => {
      const cls = styles[name];
      if (cls) container.classList.remove(cls);
    });

    // layout inicial
    const firstLayout = cycleRef.current[layoutIdxRef.current];
    if (styles[firstLayout]) {
      container.classList.add(styles[firstLayout]);
    }

    const updateMetrics = () => {
      const n = Math.max(1, letters.length);
      void n; 
    };

    const ro = new ResizeObserver(updateMetrics);
    ro.observe(container);
    updateMetrics();

    const nextState = () => {
      const currentCycle = cycleRef.current;
      if (!currentCycle.length) return;

      const state = Flip.getState("[data-flip]", {
        props: "color,backgroundColor",
        simple: true,
      });

      const curName = currentCycle[layoutIdxRef.current];
      if (styles[curName]) {
        container.classList.remove(styles[curName]);
      }

      layoutIdxRef.current =
        (layoutIdxRef.current + 1) % currentCycle.length;

      const nextName = currentCycle[layoutIdxRef.current];
      if (styles[nextName]) {
        container.classList.add(styles[nextName]);
      }

      updateMetrics();

      const anim = Flip.from(state, {
        absolute: true,
        stagger: 0.07,
        duration: 0.7,
        ease: "power2.inOut",
        spin: nextName === "final",
        simple: true,
        onEnter: (els, tl) =>
          gsap.fromTo(
            els,
            { opacity: 0 },
            { opacity: 1, delay: tl.duration() - 0.1 }
          ),
        onLeave: (els) => gsap.to(els, { opacity: 0 }),
      });

      // hold extra SOLO en "focus"
      const hold = nextName === "focus" ? finalHold : otherHold;
      delayedRef.current = gsap.delayedCall(hold, nextState);

      return anim;
    };

    delayedRef.current = gsap.delayedCall(startDelay, nextState);

    return () => {
      if (delayedRef.current) delayedRef.current.kill();
      gsap.killTweensOf("[data-flip]");
      ro.disconnect();

      const all = ["final", "plain", "columns", "grid", "focus"];
      all.forEach((name) => {
        const cls = styles[name];
        if (cls) container.classList.remove(cls);
      });
    };
  }, [startDelay, finalHold, otherHold, cycle, letters]);

  const images =
    Array.isArray(posters) && posters.length > 0
      ? posters
      : DEFAULT_BG_IMAGES;

  return (
    <section className={styles.wrap}>
      {/* Fondo con carrusel de imágenes */}
      <div className={styles.bg} aria-hidden="true">
        <div className={styles.bgSlideshow}>
          {images.map((src, i) => (
            <div
              key={src}
              className={`${styles.bgSlide} ${i === bgIndex ? styles.bgSlideActive : ""
                }`}
              style={{ backgroundImage: `url(${src})` }}
            />
          ))}
        </div>
        <div className={styles.bgOverlay} />
      </div>

      {/* Contenido animado (GSAP Flip) */}
      <div
        ref={containerRef}
        className={`${styles.container} ${styles.final}`}
      >
        <div className={styles.gsap} data-flip>
          Actualización
        </div>
        <div className={styles.for} data-flip>
          del
        </div>

        {chars.map((ch, idx) => (
          <div
            key={`${ch}-${idx}`}
            className={`${styles.letter} ${palette[idx % palette.length]
              }`}
            data-flip
          >
            {ch}
          </div>
        ))}

        {letters === "POZMVM" && (
          <p className={styles.complement} data-flip>
            {complement}
          </p>
        )}
      </div>
    </section>
  );
}
