"use client";

import { useMemo, useState, useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFade, Navigation, Autoplay, Keyboard, A11y, Parallax } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";

import styles from "@/styles/PMIU_ZMP/MunicipiosPromoSlider.module.css";
import { renderDescription } from "@/utils/blogData";

const ID_ALIASES = {
  "mineral-de-la-reforma": "mineral-reforma",
  "mineral-del-monte": "mineral-monte",
  "pachuca-de-soto": "pachuca",
};

const PARTICIPA_INFO = {
  epazoyucan: {
    responses: 28,
    representativos: ["Ex Convento de San Andrés Apóstol", "Centro de Epazoyucan (Kiosco y canchas)", "Autódromo Moisés Solana"],
    prioritarias: [
      { text: "Aumentar y cuidar áreas verdes", pct: 25 },
      { text: "Restaurar y conservar el patrimonio arquitectónico y cultural", pct: 21.4 },
      { text: "Mejorar la movilidad peatonal y ciclista", pct: 17.9 },
    ],
    seguridad:
      "Seguro(a) - La mayoría de las veces me siento confiado(a) al transitar.",
    mantenimiento:
      "Regular: conservación aceptable, aunque con detalles que requieren atención (pintura desgastada, áreas verdes con poco cuidado, alumbrado irregular).",
    hallazgos:
      "\n* La **ciudadanía percibe condiciones seguras** para transitar por las principales avenidas y espacios públicos, durante el día como en la noche. \n* Se observó una percepción regular respecto al mantenimiento urbano, lo que se sugiere la necesidad de **reforzar las acciones de conservación y mejora** de la infraestructura y los espacios públicos.",
  },

  "mineral-reforma": {
    responses: 107,
    representativos: ["Hacienda Chavarria", "Centro Historico de Pachuquilla", "Ciudad del Conocimiento"],
    prioritarias: [
      { text: "Aumentar y cuidar áreas verdes", pct: 30.8 },
      { text: "Mejorar la movilidad peatonal y ciclista", pct: 29 },
      { text: "Reforzar la seguridad en espacios públicos", pct: 21.5 },
    ],
    seguridad:
      "Neutral - Ni seguro(a) ni inseguro(a); depende mucho de la zona o del momento.",
    mantenimiento:
      "Muy malo: Espacios en deterioro evidente, sin mantenimiento, con basura, mobiliario roto o inexistente.",
    hallazgos:
      "\n* La ciudadanía percibe un **equilibrio** sobre las condiciones de tránsito en las principales avenidas y espacios públicos, durante el día y noche. \n* Se identificó áreas con **oportunidad de mejora en el mantenimiento urbano**, por lo que se propone fortalecer las acciones de conservación y mejora de la infraestructura y los espacios públicos.",
  },

  "mineral-monte": {
    responses: 63,
    representativos: ["Parroquia de Nuestra Señora de la Asunción", "Las Minas", "Plaza Principal y Kiosco"],
    prioritarias: [
      { text: "Restaurar y conservar el patrimonio", pct: 38.1 },
      { text: "Mejorar la señalética y el mobiliario urbano", pct: 15.9 },
      { text: "Reforzar la seguridad en espacios públicos", pct: 15.9 },
    ],
    seguridad:
      "Neutral - Ni seguro(a) ni inseguro(a); depende mucho de la zona o del momento.",
    mantenimiento:
      "Regular: Conservación aceptable, aunque con detalles que requieren atención (pintura gastada, áreas verdes con poco cuidado, alumbrado irregular).",
    hallazgos:
      "\n* La ciudadanía percibe un **equilibrio** sobre las condiciones de tránsito en las principales avenidas y espacios públicos, durante el día y noche. \n* Se observó una percepción regular respecto al mantenimiento urbano, lo que se sugiere la necesidad de **reforzar las acciones de conservación y mejora** de la infraestructura y los espacios públicos.",
  },

  pachuca: {
    responses: 128,
    representativos: ["Reloj Monumental de Pachuca", "Centro histórico", "Plaza Juárez"],
    prioritarias: [
      { text: "Aumentar y cuidar áreas verdes", pct: 25.2 },
      { text: "Mejorar la movilidad peatonal y ciclista", pct: 18.9 },
      { text: "Reforzar la seguridad en espacios públicos", pct: 13.4 },
    ],
    seguridad:
      "Poco seguro(a) - Solo me siento con cierta confianza en algunos horarios, pero en general percibo inseguridad.",
    mantenimiento:
      "Muy malo: Espacios en deterioro evidente, sin mantenimiento, con basura, mobiliario roto o inexistente.",
    hallazgos:
      "\n* La ciudadanía percibe *oportunidades* en mejorar las condiciones de seguridad al transitar por las principales avenidas y espacios públicos, durante el día como en la noche, lo que destaca la importancia de fortalecer entornos urbanos más seguros y confiables. \n* Se identificó áreas con **oportunidad de mejora en el mantenimiento urbano**, por lo que se propone fortalecer las acciones de conservación y mejora de la infraestructura y los espacios públicos.",
  },

  "san-agustin-tlaxiaca": {
    responses: 37,
    representativos: ["Iglesia de San Agustín", "Plaza principal y kiosco", "Presidencia Municipal"],
    prioritarias: [
      { text: "Aumentar y cuidar áreas verdes", pct: 35.1 },
      { text: "Mejorar la señalética y el mobiliario urbano", pct: 18.9 },
      { text: "Reforzar la seguridad en espacios públicos", pct: 18.9 },
    ],
    seguridad:
      "Neutral - Ni seguro(a) ni inseguro(a); depende mucho de la zona o del momento.",
    mantenimiento:
      "Regular: Conservación aceptable, aunque con detalles que requieren atención (pintura gastada, áreas verdes con poco cuidado, alumbrado irregular).",
    hallazgos:
      "\n* La ciudadanía percibe un **equilibrio** sobre las condiciones de tránsito en las principales avenidas y espacios públicos, durante el día y noche. \n* Se observó una percepción regular respecto al mantenimiento urbano, lo que se sugiere la necesidad de **reforzar las acciones de conservación y mejora** de la infraestructura y los espacios públicos.",
  },

  zapotlan: {
    responses: 44,
    representativos: ["Centro de Zapotlán de Juárez", "Iglesia de San Pedro Apóstol", "Presidencia Municipal"],
    prioritarias: [
      { text: "Restaurar y conservar el patrimonio arquitectónico y cultural", pct: 34.1 },
      { text: "Aumentar y cuidar áreas verdes", pct: 27.3 },
      { text: "Reforzar la seguridad en espacios públicos", pct: 15.9 },
    ],
    seguridad:
      "Neutral - Ni seguro(a) ni inseguro(a); depende mucho de la zona o del momento.",
    mantenimiento:
      "Regular: Conservación aceptable, aunque con detalles que requieren atención (pintura gastada, áreas verdes con poco cuidado, alumbrado irregular).",
    hallazgos:
      "\n* La ciudadanía percibe un **equilibrio** sobre las condiciones de tránsito en las principales avenidas y espacios públicos, durante el día y noche. \n* Se observó una percepción regular respecto al mantenimiento urbano, lo que se sugiere la necesidad de **reforzar las acciones de conservación y mejora** de la infraestructura y los espacios públicos.",
  },

  zempoala: {
    responses: 87,
    representativos: ["Acueducto Padre Tembleque", "Parroquia de Todos los Santos", "Cerro el Tecajete"],
    prioritarias: [
      { text: "Restaurar y conservar el patrimonio arquitectónico y cultural", pct: 28.7 },
      { text: "Mejorar la movilidad peatonal y ciclista", pct: 14.9 },
      { text: "Reforzar la seguridad en espacios públicos", pct: 14.9 },
    ],
    seguridad:
      "Seguro(a) - La mayoría de las veces me siento confiado(a) al transitar",
    mantenimiento:
      "Regular: Conservación aceptable, aunque con detalles que requieren atención (pintura desgastada, áreas verdes con poco cuidado, alumbrado irregular).",
    hallazgos:
      "\n* La ciudadanía percibe condiciones seguras** para transitar por las principales avenidas y espacios públicos, durante el día como en la noche. \n* Se observó una percepción regular respecto al mantenimiento urbano, lo que se sugiere la necesidad de **reforzar las acciones de conservación y mejora** de la infraestructura y los espacios públicos.",
  },
};

const DEFAULT_PARTICIPA = {
  responses: 0,
  representativos: ["—", "—", "—"],
  prioritarias: [],
  seguridad: "—",
  mantenimiento: "—",
};

function normId(id) {
  return ID_ALIASES[id] ?? id;
}

export default function MunicipiosPromoSlider({ items = [] }) {
  const slides = useMemo(() => {
    return (items || []).map((m, idx) => {
      const id = normId(m.id);
      return {
        ...m,
        _id: id,
        participa: PARTICIPA_INFO[id] || DEFAULT_PARTICIPA,
        reversed: idx % 2 === 1,
      };
    });
  }, [items]);

  const [tip, setTip] = useState(null); // { x, y, text }

  const showTipIfTruncated = useCallback((e, text) => {
    const el = e.currentTarget;
    if (el.scrollWidth <= el.clientWidth) return;

    const rect = el.getBoundingClientRect();
    setTip({
      x: rect.left + rect.width / 2,
      y: rect.bottom + 10,
      text,
    });
  }, []);

  const moveTip = useCallback((e) => {
    setTip((prev) => (prev ? { ...prev, x: e.clientX, y: e.clientY + 14 } : prev));
  }, []);

  const hideTip = useCallback(() => setTip(null), []);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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
              <div className={styles.media} data-swiper-parallax={s.reversed ? "-25%" : "25%"}>
                <img
                  className={styles.mediaImg}
                  src={`/img/PMIU_ZMP/municipios/${s.img}`}
                  alt={`Imagen de ${s.name}`}
                  loading="lazy"
                />
              </div>

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


                <div className={styles.actions}>
                  <p className={styles.descRow}>
                    <span className={styles.boldRow}>{s.participa.responses}</span> respuestas
                  </p>

                  <div className={styles.rowRepresentativos}>
                    <p className={styles.titleRow}>Lugares representativos</p>


                    <p className={styles.descRow}>
                      <span
                        className={styles.item}
                        title={`1. ${s.participa.representativos?.[0] ?? "—"}`}
                        onMouseEnter={(e) => showTipIfTruncated(e, `1. ${s.participa.representativos?.[0] ?? "—"}`)}
                        onMouseMove={moveTip}
                        onMouseLeave={hideTip}
                      >
                        1. {s.participa.representativos?.[0] ?? "—"}
                      </span>
                    </p>


                    <p className={styles.descRowBottom}>
                      <span
                        className={styles.item}
                        title={`2. ${s.participa.representativos?.[1] ?? "—"}`}
                        onMouseEnter={(e) => showTipIfTruncated(e, `2. ${s.participa.representativos?.[1] ?? "—"}`)}
                        onMouseMove={moveTip}
                        onMouseLeave={hideTip}
                      >
                        2. {s.participa.representativos?.[1] ?? "—"}
                      </span>


                      <span
                        className={styles.item}
                        title={`3. ${s.participa.representativos?.[2] ?? "—"}`}
                        onMouseEnter={(e) => showTipIfTruncated(e, `3. ${s.participa.representativos?.[2] ?? "—"}`)}
                        onMouseMove={moveTip}
                        onMouseLeave={hideTip}
                      >
                        3. {s.participa.representativos?.[2] ?? "—"}
                      </span>
                    </p>
                  </div>

                  <div className={styles.row222}>
                    <p className={styles.titleRow}>Acciones prioritarias</p>

                    {(s.participa.prioritarias || []).slice(0, 3).map((a, i) => (
                      <p key={`${s._id}-prio-${i}`} className={styles.descRow}>
                        {a.text}
                        <span> {Number(a.pct).toFixed(1)}%</span>
                      </p>
                    ))}
                    <p className={styles.note}>Los 3 más elegidos </p>
                  </div>

                  {/* <div className={styles.row}>
                    <p className={styles.titleRow}>Seguridad percibida</p>
                    <p className={styles.descRow}>{s.participa.seguridad}</p>
                  </div>

                  <div className={styles.row}>
                    <p className={styles.titleRow}>Mantenimiento urbano</p>
                    <p className={styles.descRow}>{s.participa.mantenimiento}</p>
                  </div> */}

                  <div className={styles.row222}>
                    <p className={styles.titleRow}>Hallazgos Clave</p>

                    <ul className={styles.descriptionList}>
                      {renderDescription(s.participa.hallazgos, styles.descRow)}
                    </ul>
                  </div>
                </div>
                {mounted && tip
                  ? createPortal(
                    <div
                      style={{ left: tip.x, top: tip.y }}
                      role="tooltip"
                    >
                      {tip.text}
                    </div>,
                    document.body
                  )
                  : null}
              </div>
            </article>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
