"use client";

import { useState } from "react";
import { motion, useMotionTemplate, useMotionValue, useSpring } from "framer-motion";
import styles from "./WorkshopResults.module.css";
import itemsByMunicipality from "./itemsByMunicipality";

import { Swiper, SwiperSlide } from "swiper/react";
import {
  Navigation,
  Pagination,
  Autoplay,
  A11y,
  EffectFade,
} from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

const defaultFooterItems = [
  { id: 1, title: "Opiniones ciudadanas", icon: "💬" },
  { id: 2, title: "Ideas para el espacio", icon: "💡" },
  { id: 3, title: "Participación comunitaria", icon: "👥" },
];

const easeExpo = [0.22, 1, 0.36, 1];

const fadeUpAnimation = (isActive, delay = 0) => ({
  opacity: isActive ? 1 : 0,
  y: isActive ? 0 : 24,
  filter: isActive ? "blur(0px)" : "blur(8px)",
  transition: {
    duration: 0.72,
    delay,
    ease: easeExpo,
  },
});

const cardEnterAnimation = (isActive, index) => ({
  opacity: isActive ? 1 : 0,
  y: isActive ? 0 : 34,
  scale: isActive ? 1 : 0.96,
  filter: isActive ? "blur(0px)" : "blur(10px)",
  transition: {
    duration: 0.85,
    delay: isActive ? 0.2 + index * 0.1 : 0,
    ease: easeExpo,
  },
});

const percentageAnimation = (isActive, index) => ({
  opacity: isActive ? 1 : 0,
  scale: isActive ? 1 : 0.72,
  filter: isActive ? "blur(0px)" : "blur(5px)",
  transition: {
    duration: 0.72,
    delay: isActive ? 0.34 + index * 0.1 : 0,
    ease: easeExpo,
  },
});

const footerAnimation = (isActive, index) => ({
  opacity: isActive ? 1 : 0,
  y: isActive ? 0 : 18,
  scale: isActive ? 1 : 0.96,
  transition: {
    duration: 0.62,
    delay: isActive ? 0.56 + index * 0.08 : 0,
    ease: easeExpo,
  },
});

function TiltCard({ item, index, isActive, cardBg, fallbackBg }) {
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const scale = useMotionValue(1);
  const y = useMotionValue(0);
  const glowX = useMotionValue(50);
  const glowY = useMotionValue(50);

  const springRotateX = useSpring(rotateX, { stiffness: 180, damping: 18, mass: 0.7 });
  const springRotateY = useSpring(rotateY, { stiffness: 180, damping: 18, mass: 0.7 });
  const springScale = useSpring(scale, { stiffness: 220, damping: 18, mass: 0.6 });
  const springY = useSpring(y, { stiffness: 220, damping: 18, mass: 0.6 });
  const springGlowX = useSpring(glowX, { stiffness: 180, damping: 18, mass: 0.7 });
  const springGlowY = useSpring(glowY, { stiffness: 180, damping: 18, mass: 0.7 });

  const glowBackground = useMotionTemplate`
    radial-gradient(
      circle at ${springGlowX}% ${springGlowY}%,
      rgba(255, 255, 255, 0.28),
      rgba(255, 255, 255, 0.12) 18%,
      transparent 42%
    )
  `;

  const handleMouseMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width;
    const py = (event.clientY - rect.top) / rect.height;

    const rX = (0.5 - py) * 14;
    const rY = (px - 0.5) * 16;

    rotateX.set(rX);
    rotateY.set(rY);
    scale.set(1.018);
    y.set(-8);

    glowX.set(px * 100);
    glowY.set(py * 100);
  };

  const handleMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
    scale.set(1);
    y.set(0);
    glowX.set(50);
    glowY.set(50);
  };

  return (
    <motion.article
      className={styles.cardWrap}
      animate={cardEnterAnimation(isActive, index)}
    >
      <motion.div
        className={`${styles.card} ${styles[`accent_${item.accent}`]}`}
        style={{
          rotateX: springRotateX,
          rotateY: springRotateY,
          scale: springScale,
          y: springY,
          transformPerspective: 1400,
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div
          className={styles.cardMedia}
          style={{
            backgroundImage: `url(${cardBg || fallbackBg})`,
          }}
        />

        <div className={styles.cardMediaOverlay} />

        <motion.div
          className={styles.cardInteractiveGlow}
          style={{
            backgroundImage: glowBackground,
          }}
        />

        <div className={styles.cardShine} />

        <div className={styles.cardTop}>
          <motion.span
            className={styles.percentage}
            animate={percentageAnimation(isActive, index)}
          >
            {item.percentage}
          </motion.span>
        </div>

        <div className={styles.ribbon}>
          <h3 className={styles.cardTitle}>{item.title}</h3>
        </div>

        <div className={styles.cardBody}>
          <p className={styles.cardDescription}>{item.description}</p>
        </div>
      </motion.div>
    </motion.article>
  );
}

export default function WorkshopResults({
  title = "Resultados del Taller Participativo",
  subtitle = "Mejoramiento urbano del espacio público",
  backgroundImage = "/img/PMIU_ZMP/talleres/default/fondo.webp",
  footerItems = defaultFooterItems,
}) {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className={styles.section}>
      <Swiper
        modules={[Navigation, Pagination, Autoplay, A11y, EffectFade]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        slidesPerView={1}
        spaceBetween={24}
        navigation
        pagination={{ clickable: true }}
        autoplay={{
          delay: 7000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        speed={950}
        grabCursor
        loop={itemsByMunicipality.length > 1}
        className={styles.swiper}
        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
      >
        {itemsByMunicipality.map((municipalityData, municipalityIndex) => {
          const isThree = municipalityData.items.length === 3;
          const isActive = activeIndex === municipalityIndex;
          const municipalityBg =
            municipalityData.backgroundImage || backgroundImage;

          return (
            <SwiperSlide key={municipalityData.id}>
              <div className={styles.slidePanel}>
                <div
                  className={styles.slideBackdrop}
                  style={{
                    backgroundImage: `url(${municipalityBg})`,
                  }}
                />

                <div className={styles.slideBackdropOverlay} />
                <div className={styles.animatedGlow} />
                <div className={styles.animatedGrid} />

                <div className={styles.slideInner}>
                  <header className={styles.header}>
                    <motion.span
                      className={styles.kicker}
                      animate={fadeUpAnimation(isActive, 0.08)}
                    >
                      {municipalityData.municipality}
                    </motion.span>

                    <motion.h2
                      className={styles.title}
                      animate={fadeUpAnimation(isActive, 0.16)}
                    >
                      {title}
                    </motion.h2>

                    <motion.p
                      className={styles.subtitle}
                      animate={fadeUpAnimation(isActive, 0.28)}
                    >
                      {subtitle}
                    </motion.p>

                    <motion.p
                      className={styles.meta}
                      animate={fadeUpAnimation(isActive, 0.4)}
                    >
                      <span>
                        <strong>Fecha:</strong> {municipalityData.date}
                      </span>
                      <span className={styles.metaDivider}>•</span>
                      <span>
                        <strong>Aforo:</strong> {municipalityData.attendance} personas
                      </span>
                    </motion.p>
                  </header>

                  <div
                    className={`${styles.grid} ${isThree ? styles.gridThree : styles.gridFour
                      }`}
                  >
                    {municipalityData.items.map((item, index) => {
                      const cardBg =
                        item.image ||
                        municipalityData.backgroundImage ||
                        backgroundImage;

                      return (
                        <TiltCard
                          key={item.id}
                          item={item}
                          index={index}
                          isActive={isActive}
                          cardBg={cardBg}
                          fallbackBg={municipalityBg}
                        />
                      );
                    })}
                  </div>

                  <div className={styles.footer}>
                    <div className={styles.footerIntro}>
                      <p className={styles.footerTitle}>Creado con:</p>
                    </div>

                    <div className={styles.footerStats}>
                      {footerItems.map((item, index) => (
                        <motion.div
                          key={item.id}
                          className={styles.footerItem}
                          animate={footerAnimation(isActive, index)}
                        >
                          <span className={styles.footerIcon}>{item.icon}</span>
                          <span className={styles.footerLabel}>{item.title}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </section>
  );
}