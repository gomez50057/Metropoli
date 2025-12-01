"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./VerticalLoop.module.css";
import CtaButton from "@/components/shared/botones/CtaButton";

// Normaliza rutas (soporta espacios/acentos o ya-encoded)
const safeUrl = (path) => {
  if (!path || typeof path !== "string") return "/img/noticias/fallback.webp";
  try {
    return encodeURI(decodeURI(path));
  } catch {
    return encodeURI(path);
  }
};

const COLS = [
  [
    "/img/PIMUS_ZMP/hero/A1.jpg",
    "/img/PIMUS_ZMP/hero/A2.jpg",
    "/img/PIMUS_ZMP/hero/A3.jpg",
  ],
  [
    "/img/PIMUS_ZMP/hero/B1.jpg",
    "/img/PIMUS_ZMP/hero/B2.jpg",
    "/img/PIMUS_ZMP/hero/B3.jpg",
  ],
  [
    "/img/PIMUS_ZMP/hero/C1.jpeg",
    "/img/PIMUS_ZMP/hero/C2.jpg",
    "/img/PIMUS_ZMP/hero/C3.jpg",
  ],
];

export default function VerticalLoopContained({
  columns = COLS,
  fullscreen = true,
  title = "PIMUS",
  subtitle = "de la Zona Metropolitana de Pachuca",
  pinPercent = 20,        // Distancia del pin en % del viewport (antes 320)
  speedDivisor = 1000,    // Sensibilidad del loop (menor = más rápido)
  minTimeScale = 0.5,     // Límite inferior de velocidad
  maxTimeScale = 3.5,     // Límite superior de velocidad
}) {
  const rootRef = useRef(null);
  const frameRef = useRef(null);
  const colRefs = useRef([]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const prefersReduce =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    if (prefersReduce) return;

    const ctx = gsap.context(() => {
      let tweens = [];
      let pinST = null;
      let master = null;
      const trackByCol = new WeakMap();

      const killAll = () => {
        tweens.forEach((t) => t.kill());
        tweens = [];
        if (pinST) pinST.kill();
        ScrollTrigger.getAll().forEach((st) => st.kill());
        if (master) master.kill();
        master = null;
      };

      const waitImages = (container) => {
        const imgs = Array.from(container.querySelectorAll("img"));
        if (!imgs.length) return Promise.resolve();
        return Promise.all(
          imgs.map(
            (im) =>
              im.complete
                ? Promise.resolve()
                : new Promise((res) => {
                  im.addEventListener("load", res, { once: true });
                  im.addEventListener("error", res, { once: true });
                })
          )
        );
      };

      // Altura exacta de UN set (la mitad, porque duplicamos el array)
      const getTrackHeight = (colEl) => {
        const items = Array.from(colEl.querySelectorAll(`.${styles.image}`));
        const half = items.slice(0, Math.floor(items.length / 2));
        return half.reduce((sum, el) => sum + el.offsetHeight, 0) || 1;
      };

      const initPin = () => {
        pinST = ScrollTrigger.create({
          trigger: frameRef.current,
          start: "top top",
          end: `+=${pinPercent}%`,
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
          onUpdate(self) {
            const v = self.getVelocity();
            const speed = gsap.utils.clamp(
              minTimeScale,
              maxTimeScale,
              1 + v / speedDivisor
            );
            if (master) master.timeScale(speed);
          },
        });
      };

      const initLoops = () => {
        const cols = colRefs.current.filter(Boolean);
        if (!cols.length) return;

        // Calcula y cachea track por columna
        cols.forEach((col) => trackByCol.set(col, getTrackHeight(col)));

        // Limpia master previo y crea uno nuevo que mueva TODAS las columnas
        if (master) master.kill();

        master = gsap.to(cols, {
          // Mueve cada columna exactamente el alto de UN set
          y: (i, col) => `-=${trackByCol.get(col)}`,
          duration: 20,
          ease: "none",
          repeat: -1,
          modifiers: {
            y: (y, col) => {
              const track = trackByCol.get(col) || 1;
              return ((parseFloat(y) % -track) + "px");
            },
          },
        });

        tweens.push(master);
      };

      const initAll = async () => {
        killAll();
        await waitImages(frameRef.current); // alturas reales
        initPin();
        initLoops();
        ScrollTrigger.refresh();
      };

      initAll();

      let resizeTO = null;
      const onResize = () => {
        clearTimeout(resizeTO);
        resizeTO = setTimeout(() => initAll(), 150);
      };
      window.addEventListener("resize", onResize);

      return () => {
        window.removeEventListener("resize", onResize);
        killAll();
      };
    }, rootRef);

    return () => ctx.revert();
  }, [columns, pinPercent, speedDivisor, minTimeScale, maxTimeScale]);

  return (
    <div ref={rootRef} className={styles.wrapper}>
      <div
        ref={frameRef}
        className={`${styles.frame} ${fullscreen ? styles.fullscreen : ""}`}
      >
        <h1 className={styles.title}>
          {title}
          <span>{subtitle}</span>
        </h1>

        <div className={styles.ctaWrapper}>
          <CtaButton
            primaryTop="Participación"
            primaryBottom="Ciudadana"
            hoverText="¡Participa!"
            href="https://forms.gle/CNPGfARzoP1sy4nZ7"
            openInNewTab={true}
            prefetch={true}
            title="Participación Ciudadana"
            ariaLabel="Ir a Participación Ciudadana en nueva pestaña"
          />
        </div>

        <div className={styles.gallery}>
          {columns.map((col, ci) => (
            <div
              key={ci}
              className={styles.col}
              ref={(el) => (colRefs.current[ci] = el)}
            >
              {[...col, ...col].map((src, i) => (
                <div key={`${ci}-${i}`} className={styles.image}>
                  <img
                    src={safeUrl(src)}
                    alt={`col-${ci}-${i}`}
                    loading={ci === 1 && i < 2 ? "eager" : "lazy"}
                    decoding="async"
                    fetchPriority={ci === 1 && i < 2 ? "high" : "auto"}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
