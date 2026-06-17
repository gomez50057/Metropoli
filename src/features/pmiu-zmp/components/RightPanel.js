"use client";

import { motion } from "framer-motion";
import styles from "@/features/pmiu-zmp/styles/RightPanel.module.css";

const panelVariants = {
  hidden: {
    opacity: 0,
    y: 22,
    filter: "blur(10px)",
  },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.65,
      ease: [0.22, 1, 0.36, 1],
      staggerChildren: 0.08,
      delayChildren: 0.08,
    },
  },
};

const blockVariants = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const softItemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      delay: 0.08 + i * 0.06,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

const actionItemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      delay: 0.18 + i * 0.08,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

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
    const value = Number(pct) || 0;
    const min = 22;
    const max = 78;
    const ratio = value / maxPct;
    const stop = min + (max - min) * ratio;
    return `${stop}%`;
  };

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
    <motion.section
      className={styles.panel}
      variants={panelVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: false, amount: 0.3 }}
    >
      <motion.div className={styles.topBlock} variants={blockVariants}>
        <motion.div className={styles.responsesCard} variants={blockVariants}>
          <motion.span
            className={styles.responsesNumber}
            initial={{ opacity: 0, scale: 0.85, y: 8 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: false, amount: 0.5 }}
            transition={{ duration: 0.5, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
          >
            {responses}
          </motion.span>

          <motion.span
            className={styles.responsesLabel}
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.5 }}
            transition={{ duration: 0.4, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            respuestas
          </motion.span>
        </motion.div>

        <motion.div className={styles.placesBlock} variants={blockVariants}>
          <motion.h3 className={styles.placesTitle} variants={softItemVariants} custom={0}>
            Lugares más representativos
          </motion.h3>

          <motion.div
            className={styles.placeFeatured}
            variants={softItemVariants}
            custom={1}
          >
            <motion.div
              className={styles.trophy}
              initial={{ opacity: 0, scale: 0.7, rotate: -10 }}
              whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
              viewport={{ once: false, amount: 0.5 }}
              transition={{ duration: 0.45, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
            >
              🏆
            </motion.div>

            <motion.p
              className={styles.placePrimary}
              initial={{ opacity: 0, x: 10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, amount: 0.5 }}
              transition={{ duration: 0.45, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
            >
              {representativos[0] ?? "—"}
            </motion.p>
          </motion.div>

          <motion.ol className={styles.placesList}>
            <motion.li
              className={styles.placeItem}
              variants={softItemVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: false, amount: 0.5 }}
              custom={2}
            >
              {representativos[1] ?? "—"}
            </motion.li>

            <motion.li
              className={styles.placeItem}
              variants={softItemVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: false, amount: 0.5 }}
              custom={3}
            >
              {representativos[2] ?? "—"}
            </motion.li>
          </motion.ol>
        </motion.div>
      </motion.div>

      <motion.div
        className={styles.separator}
        initial={{ opacity: 0, scaleX: 0.8 }}
        whileInView={{ opacity: 1, scaleX: 1 }}
        viewport={{ once: false, amount: 0.5 }}
        transition={{ duration: 0.5, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
        style={{ transformOrigin: "left center" }}
      />

      <motion.div className={styles.actionsBlock} variants={blockVariants}>
        <motion.h3 className={styles.actionsTitle} variants={softItemVariants} custom={0}>
          Acciones prioritarias
        </motion.h3>

        <div className={styles.actionsList}>
          {topPrioritarias.map((item, index) => {
            const rank = String(index + 1).padStart(2, "0");

            return (
              <motion.article
                key={`${item.text}-${index}`}
                className={styles.actionItem}
                variants={actionItemVariants}
                initial="hidden"
                whileInView="show"
                viewport={{ once: false, amount: 0.35 }}
                custom={index}
              >
                <motion.div
                  className={`${styles.rankBadge} ${getRankBadgeClass(index)}`}
                  initial={{ opacity: 0, scale: 0.85, y: 8 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  viewport={{ once: false, amount: 0.5 }}
                  transition={{
                    duration: 0.42,
                    delay: 0.24 + index * 0.08,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  {rank}
                </motion.div>

                <div className={styles.actionContent}>
                  <div className={styles.actionHeader}>
                    <motion.p
                      className={styles.actionLabel}
                      initial={{ opacity: 0, x: 8 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: false, amount: 0.5 }}
                      transition={{
                        duration: 0.4,
                        delay: 0.28 + index * 0.08,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                    >
                      {item.text}
                    </motion.p>

                    <motion.span
                      className={styles.actionValue}
                      initial={{ opacity: 0, y: 8 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: false, amount: 0.5 }}
                      transition={{
                        duration: 0.4,
                        delay: 0.32 + index * 0.08,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                    >
                      {Number(item.pct).toFixed(1)}%
                    </motion.span>
                  </div>

                  <div className={styles.barTrack}>
                    <motion.div
                      className={`${styles.barFill} ${getBarFillClass(index)}`}
                      style={{
                        "--fade-stop": getFadeStop(item.pct),
                        transformOrigin: "left center",
                      }}
                      initial={{ scaleX: 0, opacity: 0 }}
                      whileInView={{ scaleX: 1, opacity: 1 }}
                      viewport={{ once: false, amount: 0.5 }}
                      transition={{
                        duration: 0.7,
                        delay: 0.36 + index * 0.08,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                    />
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>

        <motion.p
          className={styles.note}
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.5 }}
          transition={{ duration: 0.4, delay: 0.52, ease: [0.22, 1, 0.36, 1] }}
        >
          Los 3 más elegidos por la ciudadanía
        </motion.p>
      </motion.div>
    </motion.section>
  );
}