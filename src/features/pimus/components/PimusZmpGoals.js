"use client";

import React, { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./PimusZmpGoals.module.css";

gsap.registerPlugin(ScrollTrigger);

const IMG_BASE = "/img/PIMUS_ZMP/goals/";

const GOAL_SLIDES = [
  {
    id: "goal-1",
    img: "meta-1.png",
    alt: "Sistema de transporte público articulado",
    title: "Mejorar la eficiencia del transporte público",
    description:
      "Reorganizar rutas, optimizar frecuencias y fomentar la interconexión entre los distintos sistemas de transporte, reduciendo tiempos de traslado y costos, y ofreciendo un servicio digno, moderno y confiable.",
  },
  {
    id: "goal-2",
    img: "meta-2.png",
    alt: "Red de movilidad metropolitana",
    title: "Ordenar el crecimiento urbano y la conectividad metropolitana",
    description:
      "Integrar la planeación del transporte con la ordenación del territorio para fortalecer la relación entre los municipios de la ZMP, garantizando accesibilidad equitativa a equipamientos, servicios y oportunidades de empleo.",
  },
  {
    id: "goal-3",
    img: "meta-3.png",
    alt: "Gestión del tránsito y seguridad vial",
    title: "Reducir la congestión vial y los impactos negativos del transporte",
    description:
      "Implementar estrategias de gestión del tránsito que minimicen la saturación vehicular y mejoren la seguridad vial en las principales vialidades urbanas y metropolitanas.",
  },
  {
    id: "goal-4",
    img: "meta-4.png",
    alt: "Seguridad vial y cultura de movilidad",
    title: "Incrementar la seguridad vial y la educación en movilidad",
    description:
      "Desarrollar infraestructura segura y campañas de cultura vial orientadas a prevenir accidentes y fomentar el respeto entre todas las personas usuarias de la vía pública.",
  },
  {
    id: "goal-5",
    img: "meta-5.png",
    alt: "Participación ciudadana en movilidad",
    title: "Fortalecer la gobernanza metropolitana y la participación ciudadana",
    description:
      "Promover la coordinación entre los tres órdenes de gobierno, las instituciones de planeación y la sociedad civil, asegurando que las decisiones en materia de movilidad sean transparentes, participativas y sostenibles a largo plazo.",
  },
];

export default function PimusZmpGoals() {
  const sectionRef = useRef(null);

  useLayoutEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray(`.${styles.cardWrapper}`);

      if (!cards.length) return;

      // Estado inicial extra por si acaso
      gsap.set(cards, {
        opacity: 0,
        y: 26,
        filter: "blur(3px)",
      });

      gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          end: "top 20%",
          once: true,
        },
      }).to(cards, {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 0.7,
        ease: "power3.out",
        stagger: 0.12,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className={styles.wrapper}>
      <section
        ref={sectionRef}
        className={styles.section}
        aria-labelledby="pimus-goals-title"
      >
        <h2 id="pimus-goals-title" className={styles.sectionTitle}>
          <span className="span-doarado">Objetivos</span> del <span className="span-doarado">PIMUS</span> de la <span className="span-vino">Zona Metropolitana de Pachuca</span>
        </h2>

        <p className={styles.sectionDesc}>
          Cinco objetivos estratégicos para transformar la movilidad de la ZMP
          con un enfoque seguro, eficiente y sustentable.
        </p>

        <div className={styles.cardsGrid}>
          {GOAL_SLIDES.map((goal, index) => {
            const num = String(index + 1).padStart(2, "0");

            return (
              <article
                key={goal.id}
                className={styles.cardWrapper}
              >
                <div className={styles.cardCircle}>{index + 1}</div>

                <div className={styles.card}>
                  <div className={styles.cardContent}>
                    <h3 className={styles.cardTitle}>
                      <span className={styles.cardObjective}>
                        Objetivo {num}.
                      </span>{" "}
                      {goal.title}
                    </h3>
                    <p className={styles.cardDesc}>{goal.description}</p>
                  </div>

                  <figure className={styles.cardFigure}>
                    <img
                      className={styles.cardImg}
                      src={`${IMG_BASE}${goal.img}`}
                      alt={goal.alt}
                    />
                  </figure>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
