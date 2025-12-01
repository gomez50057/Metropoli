"use client";

import MediaGridInteractive from "@/components/talleres-pmiu-zmp/MediaGridGridstack";
import { useMediaFromNumberSets } from "@/utils/useMediaFromNumberSets";

export default function Pagina() {
  // ejemplo: cada extensión con su propia lista
  const sets = {
    // png: [1, 2, 5, 9],
    // jpg: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
    // jpeg: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50],
    webp: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66],
    mp4: [1, 2, 3, 4, 5, 6, 7, 8, 9],
  };

  // archivos no numéricos por extensión
  const filesByExt = {
    // jpg: ["portada_A", "portada_B"], // quedarán al final
  };

  const { items } = useMediaFromNumberSets({
    basePath: "/img/talleres-pmiu-zmp/mineral-monte",
    sets,
    filesByExt,
    // pad: { png: 2, jpg: 2, webp: 2, mp4: 2 },
    pad: 1, // cuantos dígitos a la izquierda (1 = 1,2,3... 2 = 01,02,03... 3 = 001,002,003...)
    mergeOrder: ["webp", "jpg", "jpeg", "png", "mp4"], // si el mismo número existe en varias, elige png primero, etc.
  });

  return (
    <MediaGridInteractive
      title="Mineral del Monte – Taller"
      items={items}
      gridKey="mineral-monte-mixed"
      column={14}
      cellHeight={10}
      margin={10}
    />
  );
}
