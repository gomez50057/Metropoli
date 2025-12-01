"use client";

import { useEffect, useRef, useState } from "react";
import styles from "@/styles/PMIU_ZMP/MunicipiosSwapy.module.css";
import { MUNICIPIOS as items } from "@/utils/municipios";

export default function MunicipiosSwapy() {
  const fieldRef = useRef(null);
  const imgBasePath = "/img/PMIU_ZMP/municipios/";
  const [positions, setPositions] = useState([]);

  // Presets base (% del contenedor)
  const desktopPreset = [
    { top: 14, left: 22 },
    { top: 10, left: 60 },
    { top: 36, left: 12 },
    { top: 42, left: 52 },
    { top: 70, left: 28 },
    { top: 68, left: 70 },
    { top: 24, left: 82 },
  ];
  const tabletPreset = [
    { top: 12, left: 18 },
    { top: 18, left: 60 },
    { top: 40, left: 12 },
    { top: 46, left: 48 },
    { top: 70, left: 30 },
    { top: 68, left: 74 },
    { top: 26, left: 84 },
  ];
  const mobilePreset = [
    { top: 12, left: 22 },
    { top: 24, left: 70 },
    { top: 40, left: 10 },
    { top: 54, left: 54 },
    { top: 72, left: 28 },
    { top: 76, left: 80 },
    { top: 28, left: 86 },
  ];

  const pickPreset = () => {
    if (typeof window === "undefined") return desktopPreset;
    const w = window.innerWidth;
    if (w <= 560) return mobilePreset;
    if (w <= 900) return tabletPreset;
    return desktopPreset;
  };

  const jitterize = (base) => {
    const jitter = () => (Math.random() - 0.5) * 6; // +/-3%
    return base.map((p) => ({
      top: Math.max(6, Math.min(92, p.top + jitter())),
      left: Math.max(6, Math.min(92, p.left + jitter())),
    }));
  };

  // Resolución de colisiones en px, luego mapea a %
  function resolveCollisions(posPercent, fieldEl, count) {
    if (!fieldEl) return posPercent.slice(0, count);

    const rect = fieldEl.getBoundingClientRect();
    const cs = getComputedStyle(fieldEl);
    const sizePx = parseFloat(cs.getPropertyValue("--size")) || 84;
    const gapPx = 10;

    let pts = posPercent.slice(0, count).map((p) => ({
      x: (p.left / 100) * rect.width,
      y: (p.top / 100) * rect.height,
    }));

    const minDist = sizePx + gapPx;
    const minDist2 = minDist * minDist;
    const maxIter = 140;
    const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
    const pad = sizePx / 2 + 2;

    for (let it = 0; it < maxIter; it++) {
      let moved = false;
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[j].x - pts[i].x;
          const dy = pts[j].y - pts[i].y;
          const d2 = dx * dx + dy * dy;
          if (d2 < minDist2) {
            const d = Math.sqrt(d2) || 0.001;
            const nx = dx / d, ny = dy / d;
            const overlap = (minDist - d) / 2;
            pts[i].x = clamp(pts[i].x - nx * overlap, pad, rect.width - pad);
            pts[i].y = clamp(pts[i].y - ny * overlap, pad, rect.height - pad);
            pts[j].x = clamp(pts[j].x + nx * overlap, pad, rect.width - pad);
            pts[j].y = clamp(pts[j].y + ny * overlap, pad, rect.height - pad);
            moved = true;
          }
        }
      }
      if (!moved) break;
    }

    return pts.map((p) => ({
      left: (p.x / rect.width) * 100,
      top: (p.y / rect.height) * 100,
    }));
  }

  const recompute = () => {
    const base = pickPreset();
    const jitter = jitterize(base);

    // Si hay más ítems que el preset, reusa posiciones con más jitter
    const want = items.length;
    const tiled = Array.from({ length: want }, (_, i) => jitter[i % jitter.length]);
    const jitter2 = jitterize(tiled); // un poco más de variación

    const resolved = resolveCollisions(jitter2, fieldRef.current, want);
    setPositions(resolved);
  };

  useEffect(() => {
    recompute();
    const onResize = () => recompute();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items.length]);

  const handleClick = (anchor) => {
    if (typeof window !== "undefined") {
      window.location.hash = anchor?.startsWith("#") ? anchor.slice(1) : anchor;
    }
  };

  return (
    <div className={styles.wrap}>
      <div className={styles.field} ref={fieldRef}>
        {items.map((m, idx) => {
          const pos = positions[idx] ?? { top: 50, left: 50 };
          return (
            <div
              key={m.id ?? idx}
              className={styles.slot}
              style={{ top: `${pos.top}%`, left: `${pos.left}%` }}
            >
              <button
                type="button"
                className={styles.item}
                data-title={m.name}
                onClick={() => handleClick(m.anchor)}
              >
                <img
                  src={`${imgBasePath}${m.img}`}
                  alt={m.name}
                  className={styles.avatar}
                  loading="lazy"
                />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
