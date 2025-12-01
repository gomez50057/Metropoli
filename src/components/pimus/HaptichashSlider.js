"use client";

import { useRef, useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, EffectFade, Keyboard } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/effect-fade";
import { motion, useReducedMotion } from "framer-motion";
import styles from "./HaptichashSlider.module.css";
const BASE_PATH = "/img/PIMUS_ZMP/foros";
import OpinionButton from "@/components/shared/botones/OpinionButton";

const FOLDERS = [
  { slug: "personas-discapacidad", title: "Personas con Discapacidad", count: 3 },
  { slug: "mujeres", title: "Mujeres", count: 3 },
  { slug: "arranque-diagnóstico", title: "Foro de Arranque y Diagnóstico", count: 3 },
  { slug: "general", title: "Población en General", count: 3 },
];

/** Construye slides determinísticos (sin mezclar) */
function buildSlides() {
  const slides = [];
  for (const { slug, title, count } of FOLDERS) {
    for (let i = 1; i <= count; i++) {
      slides.push({
        title,
        description: "Grupo de Enfoque",
        img: `${BASE_PATH}/${slug}/${i}.webp`,
      });
    }
  }
  return slides;
}

/** Fisher–Yates (sobre copia) */
function shuffle(array) {
  const a = array.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function HaptichashSlider() {
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();

  // 1) Server & primer render del cliente: SIN Swiper (montaje “guard”)
  const [mounted, setMounted] = useState(false);

  // 2) Lista determinística para SSR; se mezcla tras mount
  const [slides, setSlides] = useState(() => buildSlides());

  // 3) Estado de índice activo y autoplay solo tras mount
  const [index, setIndex] = useState(1);
  const [activeIdx, setActiveIdx] = useState(0);
  const [autoPlayOpts, setAutoPlayOpts] = useState(false);

  useEffect(() => {
    setMounted(true);
    setSlides((s) => shuffle(s)); // mezcla solo en cliente
    setAutoPlayOpts({ delay: 4000, disableOnInteraction: false });
  }, []);

  const BEZ = [0.22, 1, 0.36, 1];

  // Variantes Framer
  const bgV = {
    inactive: { scale: 1.05 },
    active: {
      scale: 1,
      transition: prefersReducedMotion ? { duration: 0 } : { duration: 1.1, ease: "easeOut" },
    },
  };
  const cardV = {
    inactive: { opacity: 0, y: 24, scale: 1.04 },
    active: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: prefersReducedMotion ? { duration: 0 } : { duration: 0.9, ease: BEZ },
    },
  };
  const titleV = {
    inactive: { opacity: 0, y: 22 },
    active: {
      opacity: 1,
      y: 0,
      transition: prefersReducedMotion ? { duration: 0 } : { duration: 0.6, ease: BEZ, delay: 0.05 },
    },
  };
  const descV = {
    inactive: { opacity: 0, y: 14 },
    active: {
      opacity: 1,
      y: 0,
      transition: prefersReducedMotion ? { duration: 0 } : { duration: 0.55, ease: BEZ, delay: 0.15 },
    },
  };

  if (!mounted) {
    return (
      <div className={styles.wrap}>
        <div className={styles.slider} />
      </div>
    );
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.slider}>
        <button ref={prevRef} className={`${styles.arrow} ${styles.prev}`} aria-label="Anterior">‹</button>
        <button ref={nextRef} className={`${styles.arrow} ${styles.next}`} aria-label="Siguiente">›</button>

        <div className={styles.engagementBadge}>
          <h3 className={styles.tituloBtn}>
            <span className="span-doarado">Participa</span> en la
            <span className="span-doarado">Consulta</span>
          </h3>

          <p className={styles.descriptionBtn}>
            <span>Opinión ciudadana </span>
            Tu opinión es clave para fortalecer el PIMUS.
          </p>

          <OpinionButton
            mode="link"
            href="https://forms.gle/CNPGfARzoP1sy4nZ7"
          />
        </div>

        <Swiper
          modules={[Navigation, Autoplay, EffectFade, Keyboard]}
          effect="fade"
          loop
          speed={900}
          autoplay={autoPlayOpts}
          keyboard={{ enabled: true }}
          onBeforeInit={(swiper) => {
            swiper.params.navigation.prevEl = prevRef.current;
            swiper.params.navigation.nextEl = nextRef.current;
          }}
          onInit={(swiper) => {
            swiper.navigation.init();
            swiper.navigation.update();
            setIndex(swiper.realIndex + 1);
            setActiveIdx(swiper.realIndex);
          }}
          onSlideChange={(swiper) => {
            setIndex(swiper.realIndex + 1);
            setActiveIdx(swiper.realIndex);
          }}
          className={styles.swiper}
        >
          {slides.map((s, i) => {
            const isActive = i === activeIdx;
            return (
              <SwiperSlide key={s.img}>
                <div className={styles.slide}>
                  {/* Fondo con overlay + Ken Burns sutil */}
                  <div className={styles.slideBgImg}>
                    <motion.img
                      src={s.img}
                      alt={`${s.title} - ${s.description}`}
                      loading="lazy"
                      decoding="async"
                      initial={false}
                      variants={bgV}
                      animate={isActive ? "active" : "inactive"}
                    />
                    <span className={styles.overlay} />
                  </div>

                  {/* Tarjeta central animada */}
                  <div className={styles.slideMainImg}>
                    <motion.div
                      className={styles.slideMainImgMotion}
                      initial={false}
                      variants={cardV}
                      animate={isActive ? "active" : "inactive"}
                    >
                      <div className={styles.slideMainImgWrapper}>
                        <img
                          src={s.img}
                          alt={`${s.title} - principal`}
                          loading="lazy"
                          decoding="async"
                        />
                      </div>
                    </motion.div>
                  </div>


                  {/* Copy animado */}
                  <div className={styles.slideCopy}>
                    <motion.div
                      className={styles.slideTitle}
                      initial={false}
                      variants={titleV}
                      animate={isActive ? "active" : "inactive"}
                    >
                      <h1>{s.title}</h1>
                    </motion.div>

                    <motion.div
                      className={styles.slideDescription}
                      initial={false}
                      variants={descV}
                      animate={isActive ? "active" : "inactive"}
                    >
                      <p>{s.description}</p>
                    </motion.div>
                  </div>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </div>
  );
}
