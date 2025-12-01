"use client";

import { useMemo } from "react";

/**
 * Construye items mezclando extensiones con numeración separada
 * y (opcional) genera rutas alternativas (fallback) por cada número.
 *
 * @param {string} basePath             - ej: "/img/talleres-pmiu-zmp/pachuca"
 * @param {object} sets                 - numeración por extensión (números)
 *   ej: { png:[1,3,7], jpg:[2], webp:[4,8], mp4:[5,6] }
 * @param {object} filesByExt           - opcional: nombres directos por extensión (no numéricos)
 *   ej: { jpg:["portada_A","portada_B"] } -> generará .../portada_A.jpg
 * @param {number|object} pad           - pad global o por extensión. ej: 2 ó { png:2, mp4:3 }
 * @param {string[]} mergeOrder         - prioridad cuando coincide el mismo número en varias extensiones
 *   (el primero gana como src principal; el resto quedan como alts si buildAlternates = true)
 * @param {boolean} buildAlternates     - si true, agrega m.alts (fallbacks) en el orden de mergeOrder
 * @returns {{items: Array<{id:string, src:string, alts?:string[]}>}}
 */
export function useMediaFromNumberSets({
  basePath,
  sets = {},                 // { png:[1,5], jpg:[2], ... }
  filesByExt = {},           // { jpg:["fileA","fileB"], ... } (opcional)
  pad = 1,                   
  mergeOrder = ["webp", "jpg", "jpeg", "png", "mp4"], // prioridad con webp+jpeg
  buildAlternates = true,    // generar rutas alternativas por número
}) {
  const items = useMemo(() => {
    const IMAGE_EXTS = new Set(["png", "jpg", "jpeg", "webp", "gif", "avif"]);
    const VIDEO_EXTS = new Set(["mp4", "webm", "ogg"]);

    const getPadFor = (ext) => {
      if (typeof pad === "number") return pad;
      if (pad && typeof pad === "object") {
        // hereda de jpg cuando pidan jpeg y no haya valor
        if (ext === "jpeg" && typeof pad.jpg === "number") return pad.jpg;
        return pad?.[ext] ?? 2;
      }
      return 2;
    };

    // 1) Recolecta candidate sources por número: num -> { ext: src }
    const byNumber = new Map();
    for (const ext of Object.keys(sets)) {
      const nums = sets[ext] || [];
      const e = ext.toLowerCase();
      const isImg = IMAGE_EXTS.has(e);
      const isVid = VIDEO_EXTS.has(e);
      if (!isImg && !isVid) continue;

      const p = getPadFor(e);
      nums.forEach((n) => {
        const nn = String(n).padStart(p, "0");
        const src = `${basePath}/${nn}.${e}`;
        if (!byNumber.has(n)) byNumber.set(n, {});
        byNumber.get(n)[e] = src;
      });
    }

    // 2) Dedup por número usando mergeOrder; opcionalmente arma alts
    const deduped = [];
    // Orden numérico estable
    const numericKeys = Array.from(byNumber.keys()).sort((a, b) => Number(a) - Number(b));

    numericKeys.forEach((num) => {
      const pool = byNumber.get(num); // { ext: src }
      // ganador por prioridad
      let winnerExt = null;
      for (const e of mergeOrder) {
        if (pool[e]) { winnerExt = e; break; }
      }
      if (!winnerExt) return; // sin fuentes válidas

      // id estable (mantiene extensión para no romper estados guardados actuales)
      // Si prefieres id solo por número, usa: const id = String(num).padStart(getPadFor(winnerExt), "0");
      const id = `${String(num).padStart(getPadFor(winnerExt), "0")}.${winnerExt}`;
      const src = pool[winnerExt];

      const out = { id, src };

      if (buildAlternates) {
        const alts = [];
        for (const e of mergeOrder) {
          if (e !== winnerExt && pool[e]) alts.push(pool[e]);
        }
        if (alts.length) out.alts = alts;
      }

      deduped.push(out);
    });

    // 3) Archivos por nombre (no numéricos) -> al final, sin alternates
    for (const ext of Object.keys(filesByExt)) {
      const e = ext.toLowerCase();
      const isImg = IMAGE_EXTS.has(e);
      const isVid = VIDEO_EXTS.has(e);
      if (!isImg && !isVid) continue;

      const names = filesByExt[ext] || [];
      names.forEach((name, idx) => {
        deduped.push({
          id: `${name}.${e}#${idx}`,
          src: `${basePath}/${name}.${e}`,
        });
      });
    }

    return deduped;
  }, [basePath, sets, filesByExt, pad, mergeOrder, buildAlternates]);

  return { items };
}
