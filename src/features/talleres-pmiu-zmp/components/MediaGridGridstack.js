"use client";

import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { GridStack } from "gridstack";
import "gridstack/dist/gridstack.min.css";
import styles from "./MediaGridGridstack.module.css";

// detectores
const isVideo = (url = "") => /\.(mp4|webm|ogg)$/i.test(url);
const isImage = (url = "") => /\.(png|jpe?g|webp|gif|avif)$/i.test(url);

// hash determinístico por id (para elegir preset)
function hashStr(str) {
  let h = 5381;
  for (let i = 0; i < str.length; i++) h = ((h << 5) + h) + str.charCodeAt(i);
  return Math.abs(h);
}

// presets de tamaños (w = columnas, h = filas)
function sizePresets(column) {
  return [
    { w: 3, h: 10, minW: 2, minH: 6 },  // small
    { w: 4, h: 14, minW: 2, minH: 8 },  // medium
    { w: 3, h: 18, minW: 2, minH: 10 }, // tall
    { w: 6, h: 10, minW: 3, minH: 6 },  // wide
    { w: 5, h: 16, minW: 3, minH: 10 }, // large
  ].map(p => ({ ...p, w: Math.min(p.w, column) }));
}

// elige un preset por id (determinístico)
function pickSizeFor(id, column) {
  const presets = sizePresets(column);
  const idx = hashStr(String(id)) % presets.length;
  return presets[idx];
}

// util: debounce
function debounce(fn, ms) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), ms);
  };
}

/* =========================================================
   Lightbox (modal + carousel) — sin dependencias
   - items: [{id, src, kind, alts?}]
   - index: índice inicial
   - onClose: callback para cerrar
   ========================================================= */
function Lightbox({ items, index = 0, onClose }) {
  const [idx, setIdx] = useState(index);
  const overlayRef = useRef(null);
  const touchRef = useRef({ x: 0, y: 0, t: 0 });

  const total = items.length;
  const current = items[idx];

  const goPrev = useCallback(() => setIdx((i) => (i - 1 + total) % total), [total]);
  const goNext = useCallback(() => setIdx((i) => (i + 1) % total), [total]);

  const handleKey = useCallback((e) => {
    if (e.key === "Escape") onClose?.();
    else if (e.key === "ArrowLeft") goPrev();
    else if (e.key === "ArrowRight") goNext();
  }, [goPrev, goNext, onClose]);

  useEffect(() => {
    document.addEventListener("keydown", handleKey);
    document.documentElement.style.overflow = "hidden"; // evitar scroll fondo
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.documentElement.style.overflow = "";
    };
  }, [handleKey]);

  // cerrar por click en backdrop
  const onBackdropClick = (e) => {
    if (e.target === overlayRef.current) onClose?.();
  };

  // Gestos táctiles simples (swipe)
  const onTouchStart = (e) => {
    const t = e.changedTouches?.[0];
    if (!t) return;
    touchRef.current = { x: t.clientX, y: t.clientY, t: Date.now() };
  };
  const onTouchEnd = (e) => {
    const t = e.changedTouches?.[0];
    if (!t) return;
    const dx = t.clientX - touchRef.current.x;
    const dt = Date.now() - touchRef.current.t;
    if (dt < 600 && Math.abs(dx) > 50) {
      if (dx > 0) goPrev();
      else goNext();
    }
  };

  // Preload vecinos (solo imágenes)
  useEffect(() => {
    const preload = (i) => {
      const it = items[(i + total) % total];
      if (it?.kind === "image") {
        const img = new Image();
        img.src = it.src;
      }
    };
    preload(idx + 1);
    preload(idx - 1);
  }, [idx, items, total]);

  return createPortal(
    <div
      className={styles.modalOverlay}
      ref={overlayRef}
      onMouseDown={onBackdropClick}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      role="dialog"
      aria-modal="true"
    >
      <div className={styles.modalContent} onMouseDown={(e) => e.stopPropagation()}>
        {/* Contador */}
        <div className={styles.modalTopBar}>
          <span className={styles.modalCounter}>{idx + 1} / {total}</span>
          <button className={styles.modalClose} onClick={onClose} aria-label="Cerrar">×</button>
        </div>

        {/* Media */}
        <div className={styles.modalMediaWrap}>
          {current?.kind === "image" ? (
            <img className={styles.modalMedia} src={current.src} alt="" />
          ) : (
            <video
              className={styles.modalMedia}
              src={current.src}
              controls
              playsInline
              preload="metadata"
              autoPlay
            />
          )}
        </div>

        {/* Controles */}
        {total > 1 && (
          <>
            <button className={`${styles.navBtn} ${styles.prev}`} onClick={goPrev} aria-label="Anterior">‹</button>
            <button className={`${styles.navBtn} ${styles.next}`} onClick={goNext} aria-label="Siguiente">›</button>
          </>
        )}
      </div>
    </div>,
    document.body
  );
}

export default function MediaGridGridstack({
  title = "Media Grid",
  subtitle = "Arrastra y redimensiona (fluido)",
  items = [], // string[] | {id?, src, alts?}
  gridKey = "media-gridstack",
  column = 12,          // columnas base
  cellHeight = 10,      // px por fila (más pequeño -> masonry más fino)
  margin = 8,           // gap entre cards
}) {
  // normaliza
  const media = useMemo(() => {
    const list = items.map((it, i) => {
      const src = typeof it === "string" ? it : it.src;
      const id = typeof it === "object" && it?.id != null ? String(it.id) : String(i);
      const kind = isVideo(src) ? "video" : isImage(src) ? "image" : "unknown";
      const alts = Array.isArray(it?.alts) ? it.alts.filter(Boolean) : undefined;
      return { id, src, kind, alts };
    });
    return list.filter(m => m.kind === "image" || m.kind === "video");
  }, [items]);

  const containerRef = useRef(null);
  const [grid, setGrid] = useState(null);
  const ioRef = useRef(null);
  const mountedRef = useRef(false);

  // --- estado lightbox
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // evitar “click” tras drag
  const draggingRef = useRef(false);
  const dragTimerRef = useRef(null);

  // === Persistencia de layout
  const loadLayout = () => {
    try {
      const raw = localStorage.getItem(`gridstack:${gridKey}`);
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  };
  const _saveLayout = (g) => {
    try {
      const layout = [];
      g.engine.nodes.forEach(n => {
        layout.push({ id: n.el.dataset.id, x: n.x, y: n.y, w: n.w, h: n.h });
      });
      localStorage.setItem(`gridstack:${gridKey}`, JSON.stringify(layout));
    } catch { /* noop */ }
  };
  const saveLayout = useMemo(() => debounce(_saveLayout, 150), []); // evita spam

  // === Inicialización
  useEffect(() => {
    if (!containerRef.current) return;

    const g = GridStack.init({
      column,
      cellHeight: `${cellHeight}px`,
      margin: `${margin}px`,
      float: true,
      animate: false,
      dragIn: false,
      disableOneColumnMode: false,
      resizable: { handles: 'se, s, e' },
    }, containerRef.current);

    setGrid(g);

    const onDragStart = (_e, el) => {
      el?.classList?.add(styles.dragging);
      draggingRef.current = true;
      clearTimeout(dragTimerRef.current);
    };
    const onDragStop  = (_e, el) => {
      el?.classList?.remove(styles.dragging);
      // pequeño “cooldown” para evitar click inmediato
      clearTimeout(dragTimerRef.current);
      dragTimerRef.current = setTimeout(() => { draggingRef.current = false; }, 120);
    };
    g.on('dragstart', onDragStart);
    g.on('dragstop', onDragStop);

    const saved = loadLayout();
    const mapInit = new Map(media.map(m => [m.id, m]));

    // Batch add para rendimiento
    g.batchUpdate();
    const frag = document.createDocumentFragment();

    if (saved && saved.length) {
      saved.forEach(n => {
        const m = mapInit.get(n.id);
        if (!m) return;
        const el = createItemEl(m);
        el.setAttribute('gs-x', String(n.x));
        el.setAttribute('gs-y', String(n.y));
        el.setAttribute('gs-w', String(n.w));
        el.setAttribute('gs-h', String(n.h));
        if (n.minW) el.setAttribute('gs-min-w', String(n.minW));
        if (n.minH) el.setAttribute('gs-min-h', String(n.minH));
        frag.appendChild(el);
      });
    } else {
      media.forEach((m, i) => {
        const { w, h, minW, minH } = pickSizeFor(m.id, column);
        const el = createItemEl(m, i);
        el.setAttribute('gs-w', String(w));
        el.setAttribute('gs-h', String(h));
        el.setAttribute('gs-auto-position', 'true');
        if (minW) el.setAttribute('gs-min-w', String(minW));
        if (minH) el.setAttribute('gs-min-h', String(minH));
        frag.appendChild(el);
      });
    }

    containerRef.current.appendChild(frag);
    containerRef.current.querySelectorAll(".grid-stack-item").forEach(el => g.makeWidget(el));

    g.compact();
    _saveLayout(g);
    g.commit();
    g.setAnimation(true);

    // IO para revelar y lazy-src
    ioRef.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const card = entry.target;
        if (entry.isIntersecting) {
          card.classList.add(styles.reveal);
          const img = card.querySelector("img[data-src]");
          if (img && !img.src) img.src = img.dataset.src;
          ioRef.current?.unobserve(card);
        }
      });
    }, { root: null, threshold: 0.05 });

    containerRef.current
      .querySelectorAll(`.${styles.card}`)
      .forEach((el) => ioRef.current.observe(el));

    mountedRef.current = true;

    const save = () => saveLayout(g);
    g.on('change', save);
    g.on('resizestop', save);
    g.on('dragstop', save);

    return () => {
      try { g.off('change', save); g.off('resizestop', save); g.off('dragstop', save); } catch {}
      try { g.off('dragstart', onDragStart); g.off('dragstop', onDragStop); } catch {}
      try { g.destroy(false); } catch {}
      try { ioRef.current?.disconnect(); } catch {}
      clearTimeout(dragTimerRef.current);
      setGrid(null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [column, cellHeight, margin]);

  // === Sincronizar cuando cambian los items
  useEffect(() => {
    if (!grid || !containerRef.current) return;

    const existingIds = new Set(
      Array.from(containerRef.current.querySelectorAll('[data-id]')).map(el => el.dataset.id)
    );
    const incomingIds = new Set(media.map(m => m.id));

    grid.batchUpdate();

    // Quitar faltantes
    existingIds.forEach(id => {
      if (!incomingIds.has(id)) {
        const el = containerRef.current.querySelector(`[data-id="${id}"]`);
        if (el) grid.removeWidget(el);
      }
    });

    // Agregar nuevos
    const frag = document.createDocumentFragment();
    media.forEach((m, i) => {
      if (!existingIds.has(m.id)) {
        const el = createItemEl(m, i);
        const { w, h, minW, minH } = pickSizeFor(m.id, column);
        el.setAttribute('gs-w', String(w));
        el.setAttribute('gs-h', String(h));
        el.setAttribute('gs-auto-position', 'true');
        if (minW) el.setAttribute('gs-min-w', String(minW));
        if (minH) el.setAttribute('gs-min-h', String(minH));
        frag.appendChild(el);
      }
    });
    if (frag.childNodes.length) {
      containerRef.current.appendChild(frag);
      containerRef.current.querySelectorAll(".grid-stack-item:not(.ui-draggable)")
        .forEach(el => grid.makeWidget(el));
      grid.compact();
    }

    grid.commit();
    saveLayout(grid);

    if (mountedRef.current) {
      containerRef.current
        .querySelectorAll(`.${styles.card}:not(.${styles.reveal})`)
        .forEach((el) => {
          el.getBoundingClientRect();
          el.classList.add(styles.reveal);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [media, grid]);

  // ===== Fábrica de card (con fallbacks + srcset cuando aplica) =====
  const openLightboxAt = useCallback((id) => {
    if (draggingRef.current) return; // ignorar clicks tras drag
    const i = media.findIndex(m => m.id === id);
    if (i >= 0) { setLightboxIndex(i); setLightboxOpen(true); }
  }, [media]);

  const createItemEl = (m, index = 0) => {
    const el = document.createElement('div');
    el.className = `grid-stack-item ${styles.card}`;
    el.setAttribute('data-id', m.id);
    el.style.setProperty('--pin-delay', `${Math.min(index * 12, 120)}ms`);

    const content = document.createElement('div');
    content.className = `grid-stack-item-content ${styles.content}`;
    content.setAttribute('role', 'button');
    content.setAttribute('tabindex', '0');
    content.addEventListener('click', () => openLightboxAt(m.id));
    content.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLightboxAt(m.id); }
    });

    if (m.kind === 'image') {
      const fig = document.createElement('figure');
      fig.className = styles.figure;

      const img = document.createElement('img');
      img.alt = "";
      img.loading = "lazy";
      img.decoding = "async";
      img.className = styles.media;
      img.setAttribute('data-src', m.src);

      if (Array.isArray(m.alts) && m.alts.length) {
        const candidates = [m.src, ...m.alts].filter(Boolean);
        const srcset = candidates.map(u => `${u} 1x`).join(", ");
        img.setAttribute("srcset", srcset);
        img.setAttribute("sizes", "100vw");
        img.dataset.altSrcs = JSON.stringify(m.alts);
        img.onerror = function onErr() {
          try {
            const arr = JSON.parse(this.dataset.altSrcs || "[]");
            if (!Array.isArray(arr) || arr.length === 0) return;
            const next = arr.shift();
            this.dataset.altSrcs = JSON.stringify(arr);
            this.onerror = onErr;
            this.src = next;
          } catch {}
        };
      }

      fig.appendChild(img);
      content.appendChild(fig);
    } else {
      const fig = document.createElement('figure');
      fig.className = `${styles.figure} ${styles.videoFigure}`;
      const vid = document.createElement('video');
      vid.src = m.src;
      vid.controls = true;
      vid.playsInline = true;
      vid.preload = "metadata";
      vid.className = styles.media;
      fig.appendChild(vid);
      content.appendChild(fig);
    }

    const glow = document.createElement('div');
    glow.className = styles.glow;
    content.appendChild(glow);

    el.appendChild(content);
    return el;
  };

  return (
    <section className={styles.wrap}>
      {(title || subtitle) && (
        <header className={styles.header}>
          <div>
            {title && <h2 className={styles.title}>{title}</h2>}
            {subtitle && <h3 className={styles.subtitle}>{subtitle}</h3>}
          </div>
        </header>
      )}
      <div className={`grid-stack ${styles.grid}`} ref={containerRef} />

      {lightboxOpen && (
        <Lightbox
          items={media}
          index={lightboxIndex}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </section>
  );
}
