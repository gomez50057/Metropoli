"use client";

import styles from "@/styles/PMIU_ZMP/RightPanel.module.css";

export default function RightPanel({ participa = {} }) {
  const {
    responses = 0,
    representativos = ["—", "—", "—"],
    prioritarias = [],
  } = participa;

  const topPrioritarias = (prioritarias || []).slice(0, 3);

  const maxPct = Math.max(
    ...topPrioritarias.map((item) => Number(item?.pct) || 0),
    1
  );

  const getFadeStop = (pct) => {
    const value = Number(pct) || 0
    const min = 22
    const max = 78
    const ratio = value / maxPct
    const stop = min + (max - min) * ratio
    return `${stop}%`
  }

  const getRankBadgeClass = (index) => {
    if (index === 1) return styles.rankBadgeWine;
    if (index === 2) return styles.rankBadgeSoft;
    return styles.rankBadgeGold;
  };

  const getBarFillClass = (index) => {
    if (index === 1) return styles.barFillWine;
    if (index === 2) return styles.barFillSoft;
    return styles.barFillGold;
  };

  return (
    <section className={styles.panel}>
      <div className={styles.topBlock}>
        <div className={styles.responsesCard}>
          <span className={styles.responsesNumber}>{responses}</span>
          <span className={styles.responsesLabel}>respuestas</span>
        </div>

        <div className={styles.placesBlock}>
          <h3 className={styles.placesTitle}>Lugares más representativos</h3>

          <div className={styles.placeFeatured}>
            <div className={styles.trophy}>🏆</div>
            <p className={styles.placePrimary}>{representativos[0] ?? "—"}</p>
          </div>

          <ol className={styles.placesList}>
            <li className={styles.placeItem}>{representativos[1] ?? "—"}</li>
            <li className={styles.placeItem}>{representativos[2] ?? "—"}</li>
          </ol>
        </div>
      </div>

      <div className={styles.separator} />

      <div className={styles.actionsBlock}>
        <h3 className={styles.actionsTitle}>Acciones prioritarias</h3>

        <div className={styles.actionsList}>
          {topPrioritarias.map((item, index) => {
            const rank = String(index + 1).padStart(2, "0");

            return (
              <article key={`${item.text}-${index}`} className={styles.actionItem}>
                <div className={`${styles.rankBadge} ${getRankBadgeClass(index)}`}>
                  {rank}
                </div>

                <div className={styles.actionContent}>
                  <div className={styles.actionHeader}>
                    <p className={styles.actionLabel}>{item.text}</p>
                    <span className={styles.actionValue}>
                      {Number(item.pct).toFixed(1)}%
                    </span>
                  </div>
                  <div className={styles.barTrack}>
                    <div
                      className={`${styles.barFill} ${getBarFillClass(index)}`}
                      style={{ "--fade-stop": getFadeStop(item.pct) }}
                    />
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <p className={styles.note}>Los 3 más elegidos por la ciudadanía</p>
      </div>
    </section>
  );
}