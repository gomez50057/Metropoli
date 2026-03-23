"use client";

import { useMemo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  EffectFade,
  Navigation,
  Autoplay,
  Keyboard,
  A11y,
  Parallax,
} from "swiper/modules";

import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";

import styles from "@/styles/PMIU_ZMP/MunicipiosPromoSlider.module.css";
import RightPanel from "@/components/PMIU_ZMP/RightPanel";

/*  */
/* aliases de ids */
/*  */

const ID_ALIASES = {
  "mineral-de-la-reforma": "mineral-reforma",
  "mineral-del-monte": "mineral-monte",
  "pachuca-de-soto": "pachuca",
};

/*  */
/* datos de participación */
/*  */

const PARTICIPA_INFO = {
  epazoyucan: {
    responses: 28,
    representativos: [
      "Ex Convento de San Andrés Apóstol",
      "Centro de Epazoyucan (Kiosco y canchas)",
      "Autódromo Moisés Solana",
    ],
    prioritarias: [
      { text: "Aumentar y cuidar áreas verdes", pct: 25 },
      { text: "Restaurar y conservar el patrimonio arquitectónico y cultural", pct: 21.4 },
      { text: "Mejorar la movilidad peatonal y ciclista", pct: 17.9 },
    ],
  },

  "mineral-reforma": {
    responses: 107,
    representativos: [
      "Hacienda Chavarría",
      "Centro Histórico de Pachuquilla",
      "Ciudad del Conocimiento",
    ],
    prioritarias: [
      { text: "Aumentar y cuidar áreas verdes", pct: 30.8 },
      { text: "Mejorar la movilidad peatonal y ciclista", pct: 29 },
      { text: "Reforzar la seguridad en espacios públicos", pct: 21.5 },
    ],
  },

  "mineral-monte": {
    responses: 63,
    representativos: [
      "Parroquia de Nuestra Señora de la Asunción",
      "Las Minas",
      "Plaza Principal y Kiosco",
    ],
    prioritarias: [
      { text: "Restaurar y conservar el patrimonio", pct: 38.1 },
      { text: "Mejorar la señalética y el mobiliario urbano", pct: 15.9 },
      { text: "Reforzar la seguridad en espacios públicos", pct: 15.9 },
    ],
  },

  pachuca: {
    responses: 128,
    representativos: [
      "Reloj Monumental de Pachuca",
      "Centro histórico",
      "Plaza Juárez",
    ],
    prioritarias: [
      { text: "Aumentar y cuidar áreas verdes", pct: 25.2 },
      { text: "Mejorar la movilidad peatonal y ciclista", pct: 18.9 },
      { text: "Reforzar la seguridad en espacios públicos", pct: 13.4 },
    ],
  },

  "san-agustin-tlaxiaca": {
    responses: 37,
    representativos: [
      "Iglesia de San Agustín",
      "Plaza principal y kiosco",
      "Presidencia Municipal",
    ],
    prioritarias: [
      { text: "Aumentar y cuidar áreas verdes", pct: 35.1 },
      { text: "Mejorar la señalética y el mobiliario urbano", pct: 18.9 },
      { text: "Reforzar la seguridad en espacios públicos", pct: 18.9 },
    ],
  },

  zapotlan: {
    responses: 44,
    representativos: [
      "Centro de Zapotlán de Juárez",
      "Iglesia de San Pedro Apóstol",
      "Presidencia Municipal",
    ],
    prioritarias: [
      { text: "Restaurar y conservar el patrimonio arquitectónico y cultural", pct: 34.1 },
      { text: "Aumentar y cuidar áreas verdes", pct: 27.3 },
      { text: "Reforzar la seguridad en espacios públicos", pct: 15.9 },
    ],
  },

  zempoala: {
    responses: 87,
    representativos: [
      "Acueducto Padre Tembleque",
      "Parroquia de Todos los Santos",
      "Cerro el Tecajete",
    ],
    prioritarias: [
      { text: "Restaurar y conservar el patrimonio arquitectónico y cultural", pct: 28.7 },
      { text: "Mejorar la movilidad peatonal y ciclista", pct: 14.9 },
      { text: "Reforzar la seguridad en espacios públicos", pct: 14.9 },
    ],
  },
};

/*  */
/* datos por defecto */
/*  */

const DEFAULT_PARTICIPA = {
  responses: 0,
  representativos: ["—", "—", "—"],
  prioritarias: [],
};

function normalizeId(id = "") {
  return ID_ALIASES[id] ?? id;
}

function buildSlides(items = []) {
  return items.map((item, index) => {
    const normalizedId = normalizeId(item.id);

    return {
      ...item,
      _id: normalizedId,
      participa: PARTICIPA_INFO[normalizedId] ?? DEFAULT_PARTICIPA,
      reversed: index % 2 === 1,
    };
  });
}

export default function MunicipiosPromoSlider({ items = [] }) {
  const slides = useMemo(() => buildSlides(items), [items]);

  if (!slides.length) return null;

  return (
    <section className={styles.wrap} aria-label="Carrusel promocional de municipios">
      <div className={styles.contentTitule}>
        <p className={styles.tituleBack}>¿Cómo fue?</p>
        <p className={styles.titleFrond}>¿Cómo fue?</p>
      </div>

      <button
        type="button"
        className={`${styles.navBtn} ${styles.prev}`}
        aria-label="Anterior"
      />

      <button
        type="button"
        className={`${styles.navBtn} ${styles.next}`}
        aria-label="Siguiente"
      />

      <Swiper
        className={styles.swiper}
        modules={[EffectFade, Navigation, Autoplay, Keyboard, A11y, Parallax]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        speed={650}
        loop
        autoplay={{ delay: 7000, disableOnInteraction: false }}
        navigation={{
          nextEl: `.${styles.next}`,
          prevEl: `.${styles.prev}`,
        }}
        keyboard={{ enabled: true }}
        a11y={{ enabled: true }}
        parallax
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide._id} className={styles.slide}>
            <article
              className={`${styles.card} ${slide.reversed ? styles.reverse : ""}`}
              aria-label={slide.name}
              style={{
                backgroundImage: "url(/img/PMIU_ZMP/fondo.png)",
              }}
            >
              <div
                className={styles.media}
                data-swiper-parallax={slide.reversed ? "-25%" : "25%"}
              >
                <img
                  className={styles.mediaImg}
                  src={`/img/PMIU_ZMP/municipios/${slide.img}`}
                  alt={`Imagen de ${slide.name}`}
                  loading="lazy"
                />
              </div>

              <div
                className={`${styles.content} ${
                  slide.reversed ? styles.contentRight : styles.contentLeft
                }`}
                data-swiper-parallax={slide.reversed ? "25%" : "-25%"}
              >
                <div className={styles.kicker}>
                  <span className="span-vino">PMIU ZMP</span> · {slide.name}
                </div>

                <h3 className={styles.title}>
                  Lo que nos <span className="span-vino">dijo</span> la{" "}
                  <span className="span-vino">ciudadanía</span> en la{" "}
                  <span className="span-doarado">consulta digital</span>
                </h3>

                <p className={styles.desc}>
                  La consulta digital reunió{" "}
                  <span className={styles.boldRow}>{slide.participa.responses}</span>{" "}
                  participaciones ciudadanas sobre identidad urbana y acciones
                  prioritarias para el municipio.
                </p>

                <div className={styles.actions}>
                  <RightPanel participa={slide.participa} />
                </div>
              </div>
            </article>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}