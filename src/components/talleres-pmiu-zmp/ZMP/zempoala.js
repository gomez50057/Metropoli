"use client";

import MediaGridInteractive from "@/components/talleres-pmiu-zmp/MediaGridGridstack";
import { useMediaFromNumberSets } from "@/utils/useMediaFromNumberSets";

export default function Pagina() {
  // ejemplo: cada extensión con su propia lista
  const sets = {
    // png: [1, 2, 5, 9],
    // jpeg: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    // jpg: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    webp: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
    mp4: [1, 2, 3, 4, 5, 6, 7, 8, 9],
  };

  // archivos no numéricos por extensión
  const filesByExt = {
    // jpg: ["portada_A", "portada_B"], // quedarán al final
  };

  const { items } = useMediaFromNumberSets({
    basePath: "/img/talleres-pmiu-zmp/zempoala",
    sets,
    filesByExt,
    pad: 1, // cuantos dígitos a la izquierda (1 = 1,2,3... 2 = 01,02,03... 3 = 001,002,003...)
    mergeOrder: ["webp", "jpg", "jpeg", "png", "mp4"], // si el mismo número existe en varias, elige png primero, etc.
  });

  return (
    <MediaGridInteractive
      title="zempoala – Taller"
      items={items}
      gridKey="zempoala-mixed"
      column={14}
      cellHeight={10}
      margin={10}
    />
  );
}
