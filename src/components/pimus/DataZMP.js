import Image from "next/image";
import styles from "./DataZMP.module.css";

const defaultItems = [
  {
    id: "topLeft",
    src: "/img/PIMUS_ZMP/kpis/img-1.png",
    alt: "Imagen superior izquierda",
  },
  {
    id: "topRight",
    src: "/img/PIMUS_ZMP/kpis/img-2.png",
    alt: "Imagen superior derecha",
  },
  {
    id: "middleLeft",
    src: "/img/PIMUS_ZMP/kpis/img-3.png",
    alt: "Imagen media izquierda",
  },
  {
    id: "middleRight",
    src: "/img/PIMUS_ZMP/kpis/img-4.png",
    alt: "Imagen media derecha",
  },
  {
    id: "bottom",
    src: "/img/PIMUS_ZMP/kpis/img-5.png",
    alt: "Imagen inferior",
  },
];

function Tile({ item, className = "", priority = false, sizes }) {
  return (
    <article className={`${styles.card} ${className}`}>
      <Image
        src={item.src}
        alt={item.alt}
        width={1600}
        height={900}
        priority={priority}
        className={styles.image}
        sizes={sizes}
      />
    </article>
  );
}

export default function DataZMP({ items = defaultItems, className = "" }) {
  const map = {
    topLeft: items.find((item) => item.id === "topLeft") || defaultItems[0],
    topRight: items.find((item) => item.id === "topRight") || defaultItems[1],
    middleLeft:
      items.find((item) => item.id === "middleLeft") || defaultItems[2],
    middleRight:
      items.find((item) => item.id === "middleRight") || defaultItems[3],
    bottom: items.find((item) => item.id === "bottom") || defaultItems[4],
  };

  return (
    <section className={`${styles.section} ${className}`}>
      <div className={styles.grid}>
        <div className={styles.leftColumn}>
          <Tile
            item={map.topLeft}
            className={styles.topLeft}
            priority
            sizes="(max-width: 767px) 100vw, 50vw"
          />

          <Tile
            item={map.middleLeft}
            className={styles.middleLeft}
            sizes="(max-width: 767px) 100vw, 50vw"
          />
        </div>

        <div className={styles.rightColumn}>
          <Tile
            item={map.topRight}
            className={styles.topRight}
            priority
            sizes="(max-width: 767px) 100vw, 50vw"
          />

          <Tile
            item={map.middleRight}
            className={styles.middleRight}
            sizes="(max-width: 767px) 100vw, 50vw"
          />
        </div>

        <Tile
          item={map.bottom}
          className={styles.bottom}
          sizes="100vw"
        />
      </div>
    </section>
  );
}
