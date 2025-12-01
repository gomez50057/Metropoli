"use client";

import { useMemo } from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFade, Navigation, Autoplay, Keyboard, A11y, Parallax } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";

import styles from "@/styles/PMIU_ZMP/MunicipiosPromoSlider.module.css";

/* ==================== Aliases y catálogos ==================== */
const ID_ALIASES = {
  "mineral-de-la-reforma": "mineral-reforma",
  "mineral-del-monte": "mineral-monte",
  "pachuca-de-soto": "pachuca",
};

const OPINION_LINKS = {
  epazoyucan: { encuesta: "https://docs.google.com/forms/d/e/1FAIpQLSfsi8OzJO7icEa6-UDdgaYCv8TH5jNoVh1U6_h6-yiPQINYFA/viewform" },
  "mineral-reforma": { encuesta: "https://docs.google.com/forms/d/e/1FAIpQLSdIEqGlVbpePoHKob1AQ9g7iXWZbUuN67qtBkfNBgis9KHgIw/viewform" },
  "mineral-monte": { encuesta: "https://docs.google.com/forms/d/e/1FAIpQLSfUqAs2r1UwAI39vNeS54njpT-RSr3uR7sIlUwgFUJH0HsvBA/viewform" },
  pachuca: { encuesta: "https://docs.google.com/forms/d/e/1FAIpQLSfTGVpEXcBZOV3p58hZn1jW5LIDt96xa6dTctgp9wV5Dm_8IQ/viewform" },
  "san-agustin-tlaxiaca": { encuesta: "https://docs.google.com/forms/d/e/1FAIpQLSd-1dzfiBDMP4CG4sTuL4Ha1nwV94XV-ydNwo40_lGG3oX72g/viewform" },
  zapotlan: { encuesta: "https://docs.google.com/forms/d/e/1FAIpQLSd5RWDiQTvh_g0YHQ2H8JPdnJnkGDzrc217nnsw8KAwkCkLEA/viewform" },
  zempoala: { encuesta: "https://docs.google.com/forms/d/e/1FAIpQLSeyfSsxnareGC6Koyf4Y1_zp1ZfYHOksziL9c4Mlu_s7ttmPg/viewform" },
};

const PARTICIPA_INFO = {
  epazoyucan: { fecha: "26-Septiembre-2025", hora: "04:00 pm", lugar: "Auditorio Municipal de Epazoyucan" },
  "mineral-reforma": { fecha: "30-Septiembre-2025", hora: "10:00 am", lugar: "Centro Mineralense de las Artes (CEMARTH)" },
  "mineral-monte": { fecha: "25-Septiembre-2025", hora: "04:00 pm", lugar: "Auditorio CBIS" },
  pachuca: { fecha: "01-Octubre-2025", hora: "10:00 am", lugar: "Consejo Coordinador Empresarial" },
  "san-agustin-tlaxiaca": { fecha: "26-Septiembre-2025", hora: "10:00 am", lugar: "Rancho La Purísima" },
  zapotlan: { fecha: "01-Octubre-2025", hora: "04:00 pm", lugar: "Auditorio Ejidal de Centro San Pedro Huaquilpan" },
  zempoala: { fecha: "30-Septiembre-2025", hora: "04:00 pm", lugar: "Salón Victoria" },
};

const ZONA_KEY = "selectedTaller_PMIU_ZMP";

/* ==================== Utils ==================== */
function normId(id) {
  return ID_ALIASES[id] ?? id;
}

function handleVisitImages(zoneKey) {
  try {
    localStorage.setItem(ZONA_KEY, zoneKey);
  } catch {
    // no-op: evita romper SSR/privacidad
  }
}

/* ==================== Componente ==================== */
export default function MunicipiosPromoSlider({ items = [] }) {
  const slides = useMemo(() => {
    return (items || []).map((m, idx) => {
      const id = normId(m.id);
      return {
        ...m,
        _id: id,
        encuesta: OPINION_LINKS[id]?.encuesta || null,
        participa: PARTICIPA_INFO[id] || null,
        reversed: idx % 2 === 1, // alterna layout L/R
      };
    });
  }, [items]);

  return (
    <section className={styles.wrap} aria-label="Carrusel promocional de municipios">
      <div className={styles.contentTitule}>
        <p className={styles.tituleBack}>¿Cómo fue?</p>
        <p className={styles.titleFrond}>¿Cómo fue?</p>
      </div>

      <button className={`${styles.navBtn} ${styles.prev}`} aria-label="Anterior" />
      <button className={`${styles.navBtn} ${styles.next}`} aria-label="Siguiente" />

      <Swiper
        className={styles.swiper}
        modules={[EffectFade, Navigation, Autoplay, Keyboard, A11y, Parallax]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        speed={650}
        loop
        autoplay={{ delay: 7000, disableOnInteraction: false }}
        navigation={{ nextEl: `.${styles.next}`, prevEl: `.${styles.prev}` }}
        keyboard={{ enabled: true }}
        a11y={{ enabled: true }}
        parallax
      >
        {slides.map((s) => (
          <SwiperSlide key={s._id} className={styles.slide}>
            <article className={`${styles.card} ${s.reversed ? styles.reverse : ""}`} aria-label={s.name}>
              {/* Media */}
              <div className={styles.media} data-swiper-parallax={s.reversed ? "-25%" : "25%"}>
                <img
                  className={styles.mediaImg}
                  src={`/img/PMIU_ZMP/municipios/${s.img}`}
                  alt={`Imagen de ${s.name}`}
                  loading="lazy"
                />
              </div>

              {/* Content */}
              <div
                className={`${styles.content} ${s.reversed ? styles.contentRight : styles.contentLeft}`}
                data-swiper-parallax={s.reversed ? "25%" : "-25%"}
              >
                <div className={styles.kicker}>
                  <span className="span-vino">PMIU ZMP</span> · {s.name}
                </div>

                <h3 className={styles.title}>
                  <span className="span-vino">Así</span> se<span className="span-vino">Vivió</span> el{" "}
                  <span className="span-doarado">Taller</span>
                </h3>
                <p className={styles.desc}>Gracias por su participación.</p>

                {/* Datos del taller */}
                <div className={styles.actions}>
                  {s.participa ? (
                    <div className={styles.meta} aria-label="Datos del taller">
                      <div>
                        <strong>Fecha:</strong> {s.participa.fecha}
                      </div>
                      <div>
                        <strong>Hora:</strong> {s.participa.hora}
                      </div>
                      <div>
                        <strong>Lugar:</strong> {s.participa.lugar}
                      </div>
                    </div>
                  ) : (
                    <div className={styles.metaMuted}>
                      Próximamente fecha y sede del taller para {s.name}.
                    </div>
                  )}
                </div>

                {/* Enlace solicitado que guarda la zona y navega */}
                {/* <p className={styles.visitText}>
                  <Link
                    href="/talleres-pmiu-zmp"
                    onClick={() => handleVisitImages(s._id)}
                    className={styles.ctaAlt ?? styles.cta}
                    aria-label={`Ver imágenes del taller de ${s.name}`}
                  >
                    Conoce como se vivió el taller en {s.name}
                  </Link>
                </p> */}

                {/* Opinión ciudadana */}
                <h3 className={styles.title}>
                  <span className="span-doarado">Opinión</span> ciudadana
                </h3>
                <p className={styles.desc}>
                  Tu opinión es clave para fortalecer el PMIU. Responde el cuestionario de {s.name}.
                </p>

                {s.encuesta ? (
                  <a
                    href={s.encuesta}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.cta}
                    aria-label={`Responder encuesta ciudadana de ${s.name}`}
                  >
                    <span>Responder encuesta</span>
                    <svg width="15px" height="10px" viewBox="0 0 13 10" aria-hidden="true">
                      <path d="M1,5 L11,5"></path>
                      <polyline points="8 1 12 5 8 9"></polyline>
                    </svg>
                  </a>
                ) : (
                  <button className={`${styles.cta} ${styles.ctaDisabled}`} disabled>
                    Próximamente
                  </button>
                )}
              </div>
            </article>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
