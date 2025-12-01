"use client";

import { useState, useMemo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Keyboard, A11y } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";

import styles from "./Slider.module.css";

const GOAL_IMAGES = [
  {
    id: "img1",
    src: "/img/PIMUS_ZMP/goals/meta-1.png",
    alt: "Sistema de transporte público articulado",
  },
  {
    id: "img2",
    src: "/img/PIMUS_ZMP/goals/meta-2.png",
    alt: "Red de movilidad metropolitana",
  },
  {
    id: "img3",
    src: "/img/PIMUS_ZMP/goals/meta-3.png",
    alt: "Gestión del tránsito y seguridad vial",
  },
  {
    id: "img4",
    src: "/img/PIMUS_ZMP/goals/meta-4.png",
    alt: "Gobernanza metropolitana y participación ciudadana",
  },
  {
    id: "img5",
    src: "/img/PIMUS_ZMP/goals/meta-5.png",
    alt: "Participación ciudadana en movilidad",
  },
];

const SLIDES = [
  {
    id: "goal-1",
    imageId: "img1",
    title: <><p>Objetivo 01.</p> Mejorar la Eficiencia del Transporte Público</>,
    description:
      "Reorganizar rutas, optimizar frecuencias y fomentar la interconexión entre los distintos sistemas de transporte, reduciendo tiempos de traslado y costos, y ofreciendo un servicio digno, moderno y confiable.",
  },
  {
    id: "goal-2",
    imageId: "img2",
    title: <><p>Objetivo 02.</p> Ordenar el Crecimiento Urbano y la Conectividad Metropolitana</>,
    description:
      "Integrar la planeación del transporte con la ordenación del territorio para fortalecer la relación entre los municipios de la ZMP, garantizando accesibilidad equitativa a equipamientos, servicios y oportunidades de empleo.",
  },
  {
    id: "goal-3",
    imageId: "img3",
    title: <><p>Objetivo 03.</p> Reducir la Congestión Vial y los Impactos Negativos del Transporte</>,
    description:
      "Implementar estrategias de gestión del tránsito que minimicen la saturación vehicular y mejoren la seguridad vial en las principales vialidades urbanas y metropolitanas.",
  },
  {
    id: "goal-4",
    imageId: "img4",
    title: <><p>Objetivo 04.</p> Incrementar la Seguridad Vial y la Educación en Movilidad</>,
    description:
      "Desarrollar infraestructura segura y campañas de cultura vial orientadas a prevenir accidentes y fomentar el respeto entre todas las personas usuarias de la vía pública.",
  },
  {
    id: "goal-5",
    imageId: "img5",
    title: <><p>Objetivo 05.</p> Fortalecer la Gobernanza Metropolitana y la Participación Ciudadana</>,
    description:
      "Promover la coordinación entre los tres órdenes de gobierno, las instituciones de planeación y la sociedad civil, asegurando que las decisiones en materia de movilidad sean transparentes, participativas y sostenibles a largo plazo.",
  },
];

export default function Slider() {
  const [activeIndex, setActiveIndex] = useState(0);

  const activeImageId = useMemo(
    () => SLIDES[activeIndex]?.imageId ?? GOAL_IMAGES[0].id,
    [activeIndex]
  );

  return (
    <>
      <section className={styles.wrapper} aria-labelledby="pimus-goals-title">
        <div className={styles.content}>
          <div className={styles.bgShape}>
            <img
              src="/img/PIMUS_ZMP/logo-pimus-zmp-light.png"
              alt="Logotipo del PIMUS de la Zona Metropolitana de Pachuca"
            />
          </div>

          <div className={styles.imagePanel}>
            {GOAL_IMAGES.map((img) => {
              const isActive = img.id === activeImageId;
              return (
                <div
                  key={img.id}
                  className={`${styles.imageItem} ${
                    isActive ? styles.imageItemActive : ""
                  }`}
                >
                  <img src={img.src} alt={img.alt} />
                </div>
              );
            })}
          </div>

          <div className={styles.slider}>
            <button
              className={`${styles.navPrev} js-swiper-prev`}
              type="button"
              aria-label="Meta anterior"
            >
              <span className={styles.icon}>
                <svg className={styles.icon}>
                  <use xlinkHref="#icon-arrow-left" />
                </svg>
              </span>
            </button>

            <button
              className={`${styles.navNext} js-swiper-next`}
              type="button"
              aria-label="Meta siguiente"
            >
              <span className={styles.icon}>
                <svg className={styles.icon}>
                  <use xlinkHref="#icon-arrow-right" />
                </svg>
              </span>
            </button>

            <Swiper
              modules={[Navigation, Keyboard, A11y]}
              slidesPerView={1}
              effect="slide"
              loop
              keyboard={{ enabled: true }}
              navigation={{
                nextEl: ".js-swiper-next",
                prevEl: ".js-swiper-prev",
              }}
              onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
              className={styles.sliderWrapper}
            >
              {SLIDES.map((slide) => (
                <SwiperSlide key={slide.id} className={styles.slide}>
                  <div className={styles.slideCard}>
                    <div className={styles.slideContent}>
                      <h2
                        id={slide.id === "goal-1" ? "pimus-goals-title" : undefined}
                        className={styles.goalTitle}
                      >
                        {slide.title}
                      </h2>
                      <p className={styles.goalDescription}>{slide.description}</p>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </section>

      {/* Sprites de flechas */}
      <svg hidden aria-hidden="true">
        <symbol id="icon-arrow-left" viewBox="0 0 32 32">
          <path d="M0.704 17.696l9.856 9.856c0.896 0.896 2.432 0.896 3.328 0s0.896-2.432 0-3.328l-5.792-5.856h21.568c1.312 0 2.368-1.056 2.368-2.368s-1.056-2.368-2.368-2.368h-21.568l5.824-5.824c0.896-0.896 0.896-2.432 0-3.328-0.48-0.48-1.088-0.704-1.696-0.704s-1.216 0.224-1.696 0.704l-9.824 9.824c-0.448 0.448-0.704 1.056-0.704 1.696s0.224 1.248 0.704 1.696z" />
        </symbol>
        <symbol id="icon-arrow-right" viewBox="0 0 32 32">
          <path d="M31.296 14.336l-9.888-9.888c-0.896-0.896-2.432-0.896-3.328 0s-0.896 2.432 0 3.328l5.824 5.856h-21.536c-1.312 0-2.368 1.056-2.368 2.368s1.056 2.368 2.368 2.368h21.568l-5.856 5.824c-0.896 0.896-0.896 2.432 0 3.328 0.48 0.48 1.088 0.704 1.696 0.704s1.216-0.224 1.696-0.704l9.824-9.824c0.448-0.448 0.704-1.056 0.704-1.696s-0.224-1.248-0.704-1.664z" />
        </symbol>
      </svg>
    </>
  );
}
