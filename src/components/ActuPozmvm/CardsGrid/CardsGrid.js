"use client";

import { LazyMotion, domAnimation, m, MotionConfig, useReducedMotion } from "framer-motion";
import styles from "./CardsGrid.module.css";

export default function CardsGrid({ title, items = [] }) {
  const prefersReduced = useReducedMotion();

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08, when: "beforeChildren" } },
  };

  const card = {
    hidden: { opacity: 0, y: 12, scale: 0.98 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: "spring", stiffness: 70, damping: 16 },
    },
  };

  const iconFx = {
    hidden: { opacity: 0, scale: 0.85, rotate: -6 },
    show: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: { type: "spring", stiffness: 240, damping: 16, delay: 0.02 },
    },
  };

  const hoverFx = prefersReduced ? {} : { y: -2, scale: 1.02, transition: { type: "spring", stiffness: 240, damping: 18 } };

  return (
    <LazyMotion features={domAnimation}>
      <MotionConfig reducedMotion="user">
        <section className={styles.section}>
          {title && (
            <m.h2
              className={styles.titule}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
            >
              {title}
            </m.h2>
          )}

          <m.div
            className={styles.cards}
            role="list"
            aria-label={title || "Lista"}
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.25 }}
          >
            {items.map((it, idx) => (
              <m.article
                key={idx}
                className={styles.card}
                role="listitem"
                tabIndex={0}
                variants={card}
                whileHover={hoverFx}
                whileFocus={hoverFx}
                aria-label={typeof it.text === "string" ? it.text : `Tarjeta ${idx + 1}`}
              >
                <m.div className={styles.icon} aria-hidden="true" variants={iconFx}>
                  {it.icon ?? "•"}
                </m.div>
                <div className={styles.text}>{it.text}</div>
              </m.article>
            ))}
          </m.div>
        </section>
      </MotionConfig>
    </LazyMotion>
  );
}
