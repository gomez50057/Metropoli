"use client";

import MediaGridInteractive from "@/components/talleres-pmiu-zmp/MediaGridGridstack";
import { useMediaFromNumberSets } from "@/utils/useMediaFromNumberSets";

export default function Pagina() {
  // ejemplo: cada extensión con su propia lista
  const sets = {
    // png: [1, 2, 5, 9],
    // jpeg: [1],
    // jpg: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    webp: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    // mp4: [6, 10, 11],
  };

  // archivos no numéricos por extensión
  const filesByExt = {
    // jpg: ["portada_A", "portada_B"], // quedarán al final
  };

  const { items } = useMediaFromNumberSets({
    basePath: "/img/talleres-pmiu-zmp/pachuca",
    sets,
    filesByExt,
    pad: 1, // cuantos dígitos a la izquierda (1 = 1,2,3... 2 = 01,02,03... 3 = 001,002,003...)
    mergeOrder: ["webp", "jpg", "jpeg", "png", "mp4"], // si el mismo número existe en varias, elige png primero, etc.
  });

  return (
    <MediaGridInteractive
      title="Pachuca – Taller"
      items={items}
      gridKey="pachuca-mixed"
      column={14}
      cellHeight={10}
      margin={10}
    />
  );
}
