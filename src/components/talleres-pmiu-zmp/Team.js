"use client";

import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import dynamic from "next/dynamic";
import styles from "./TeamGridInteractive.module.css";

// Importa SOLO el componente Responsive (sin WidthProvider)
const ResponsiveGridLayout = dynamic(
  () =>
    import("react-grid-layout").then((mod) => {
      const R =
        // named export (ESM)
        mod?.Responsive
        // propiedad del default (CJS envuelto)
        ?? mod?.default?.Responsive;

      if (!R) {
        // ayuda a depurar si persiste el problema
        console.error("react-grid-layout: Responsive no encontrado. Módulo:", mod);
        throw new Error("react-grid-layout: Responsive no encontrado");
      }
      return R;
    }),
  { ssr: false }
);

/** Hook para medir ancho del contenedor */
function useContainerWidth() {
  const ref = useRef(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const w = entry.contentRect?.width ?? el.clientWidth ?? 0;
        if (w && w !== width) setWidth(w);
      }
    });
    ro.observe(el);
    return () => ro.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return [ref, width];
}

export default function TeamGridInteractive({
  teamName,
  teamSubName,
  teamMembers = [],
  teamKey,
  rowHeight = 32,
  margin = [12, 12],
  allowDrag = true,
  allowResize = true,
  preventCollision = true,
  breakpoints = { lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 },
  cols = { lg: 12, md: 10, sm: 8, xs: 6, xxs: 4 },
}) {
  const storageKey = `team-grid:${teamKey || teamName || "default"}`;

  // === Ancho del contenedor (reemplaza WidthProvider) ===
  const [containerRef, width] = useContainerWidth();

  // Layout base por breakpoint
  const baseLayouts = useMemo(() => {
    const makeLayout = (colsCount) => {
      const w = 3; // col units
      const h = 4; // row units
      const ipr = Math.max(1, Math.floor(colsCount / w));
      return teamMembers.map((m, i) => {
        const x = (i % ipr) * w;
        const y = Math.floor(i / ipr) * h;
        return {
          i: String(m.id ?? i),
          x,
          y,
          w,
          h,
          minW: 2,
          minH: 3,
          maxW: colsCount,
        };
      });
    };
    return {
      lg: makeLayout(cols.lg),
      md: makeLayout(cols.md),
      sm: makeLayout(cols.sm),
      xs: makeLayout(cols.xs),
      xxs: makeLayout(cols.xxs),
    };
  }, [teamMembers, cols]);

  const [layouts, setLayouts] = useState(baseLayouts);

  // Cargar/sincronizar con localStorage
  useEffect(() => {
    try {
      const saved = typeof window !== "undefined" && window.localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        const merged = {};
        for (const bp of Object.keys(cols)) {
          const base = baseLayouts[bp] || [];
          const map = new Map((parsed[bp] || []).map((l) => [l.i, l]));
          merged[bp] = base.map((b) => map.get(b.i) || b);
        }
        setLayouts(merged);
      }
    } catch {
      // ignora parse errors
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey]);

  const handleLayoutChange = useCallback(
    (_current, allLayouts) => {
      setLayouts(allLayouts);
      try {
        if (typeof window !== "undefined") {
          window.localStorage.setItem(storageKey, JSON.stringify(allLayouts));
        }
      } catch {}
    },
    [storageKey]
  );

  const handleReset = useCallback(() => {
    setLayouts(baseLayouts);
    try {
      if (typeof window !== "undefined") {
        window.localStorage.removeItem(storageKey);
      }
    } catch {}
  }, [baseLayouts, storageKey]);

  return (
    <section className={styles.wrap} ref={containerRef}>
      {(teamName || teamSubName) && (
        <header className={styles.header}>
          <div className={styles.titles}>
            {teamName && <h2 className={styles.title}>{teamName}</h2>}
            {teamSubName && <h3 className={styles.subtitle}>{teamSubName}</h3>}
          </div>
          <div className={styles.actions}>
            <span className={styles.hint}>
              Arrastra desde la banda superior (☰) • Redimensiona con la esquina
            </span>
            <button className={styles.resetBtn} onClick={handleReset} type="button">
              Reset
            </button>
          </div>
        </header>
      )}

      {/* Evita render hasta tener ancho (WidthProvider reemplazado) */}
      {width > 0 && (
        <ResponsiveGridLayout
          className={styles.rgl}
          layouts={layouts}
          breakpoints={breakpoints}
          cols={cols}
          rowHeight={rowHeight}
          margin={margin}
          containerPadding={[0, 0]}
          isDraggable={allowDrag}
          isResizable={allowResize}
          onLayoutChange={handleLayoutChange}
          preventCollision={preventCollision}
          compactType={null}
          useCSSTransforms
          measureBeforeMount={false}
          draggableHandle={`.${styles.dragHandle}`}
          width={width} // <- clave: pasamos el ancho del contenedor
        >
          {teamMembers.map((member, idx) => {
            const key = String(member.id ?? idx);
            return (
              <div key={key} className={styles.card} aria-label={`member-${key}`}>
                <div className={styles.dragHandle} title="Arrastra para mover">☰</div>
                <figure className={styles.figure}>
                  <img
                    src={member.image}
                    alt=""
                    className={styles.image}
                    loading="lazy"
                    decoding="async"
                  />
                </figure>
              </div>
            );
          })}
        </ResponsiveGridLayout>
      )}
    </section>
  );
}
