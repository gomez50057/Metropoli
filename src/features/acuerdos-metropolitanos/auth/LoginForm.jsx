"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { animate, motion, useMotionValue, useTransform } from "framer-motion";
import { useSession } from "./SessionProvider";
import LoginCredentialsForm from "./LoginCredentialsForm";
import styles from "./Auth.module.css";

const stateNodes = [
  {
    id: "hidalgo",
    label: "HIDALGO",
    subtitle: "Nodo norte",
    description:
      "Punto de enlace para Pachuca, Tulancingo y la conexión hacia la Zona Metropolitana del Valle de México.",
    x: 190,
    y: 70,
  },
  {
    id: "edomex",
    label: "EDOMEX",
    subtitle: "Anillo metropolitano",
    description:
      "Estado de México como eje territorial de conexión entre Hidalgo, CDMX y Morelos dentro de la ZMVM.",
    x: 285,
    y: 270,
  },
  {
    id: "cdmx",
    label: "CDMX",
    subtitle: "Centro funcional",
    description:
      "Nodo urbano central de la Zona Metropolitana del Valle de México.",
    x: 485,
    y: 235,
  },
  {
    id: "morelos",
    label: "MORELOS",
    subtitle: "Extensión sur",
    description:
      "Conexión sur del sistema metropolitano ampliado hacia Morelos.",
    x: 395,
    y: 395,
  },
];

const metroNodes = [
  {
    id: "zmp",
    label: "ZMP",
    shortName: "PACHUCA",
    name: "Zona Metropolitana de Pachuca",
    description:
      "Zona Metropolitana de Pachuca como nodo hidalguense de articulación regional.",
    x: 95,
    y: 150,
  },
  {
    id: "zmt",
    label: "ZMT",
    shortName: "TULANCINGO",
    name: "Zona Metropolitana de Tulancingo",
    description:
      "Zona Metropolitana de Tulancingo como nodo estratégico del oriente de Hidalgo.",
    x: 310,
    y: 140,
  },
  {
    id: "zmvm",
    label: "ZMVM",
    shortName: "VALLE DE MÉXICO",
    name: "Zona Metropolitana del Valle de México",
    description:
      "Sistema metropolitano integrado por Hidalgo, CDMX, Estado de México y Morelos.",
    x: 375,
    y: 292,
  },
];

const communicationLinks = [
  {
    id: "zmp-hidalgo",
    d: "M95 150 C120 112 152 84 190 70",
  },
  {
    id: "zmt-hidalgo",
    d: "M310 140 C275 105 235 78 190 70",
  },
  {
    id: "hidalgo-edomex",
    d: "M190 70 C220 145 248 220 285 270",
  },
  {
    id: "hidalgo-cdmx",
    d: "M190 70 C290 130 390 205 485 235",
  },
  {
    id: "hidalgo-zmvm",
    d: "M190 70 C250 145 315 230 375 292",
  },
  {
    id: "zmp-zmvm",
    d: "M95 150 C175 190 280 245 375 292",
  },
  {
    id: "zmt-zmvm",
    d: "M310 140 C365 185 405 235 375 292",
  },
  {
    id: "zmvm-edomex",
    d: "M375 292 C340 275 310 268 285 270",
  },
  {
    id: "zmvm-cdmx",
    d: "M375 292 C405 260 445 240 485 235",
  },
  {
    id: "edomex-cdmx",
    d: "M285 270 C340 220 420 208 485 235",
  },
  {
    id: "zmvm-morelos",
    d: "M375 292 C420 330 430 372 395 395",
  },
  {
    id: "edomex-morelos",
    d: "M285 270 C330 325 360 372 395 395",
  },
  {
    id: "cdmx-morelos",
    d: "M485 235 C520 305 465 365 395 395",
  },
];

const floatingMetrics = [
  {
    id: "zmp",
    label: "Zona Metropolitana de Pachuca",
    value: "ZMP",
    detail: "Hidalgo",
  },
  {
    id: "zmt",
    label: "Zona Metropolitana de Tulancingo",
    value: "ZMT",
    detail: "Hidalgo",
  },
  {
    id: "zmvm",
    label: "Zona Metropolitana del Valle de México",
    value: "ZMVM",
    detail: "Hidalgo · CDMX · EDOMEX · Morelos",
  },
];

const footerIcons = [
  {
    label: "Desarrollo urbano",
    icon: (
      <svg viewBox="0 0 32 32" aria-hidden="true">
        <path d="M6 27V13h6V7h8v10h6v10" />
        <path d="M9 27v-3M9 20v-3M15 27v-3M15 20v-3M15 14v-3M20 27v-3M20 20v-3M24 27v-3" />
        <path d="M4 27h24" />
      </svg>
    ),
  },
  {
    label: "Sustentabilidad",
    icon: (
      <svg viewBox="0 0 32 32" aria-hidden="true">
        <path d="M25 7C14 7 8 12 8 21c0 3 2 5 5 5 8 0 12-9 12-19Z" />
        <path d="M8 25c4-7 9-10 15-13" />
      </svg>
    ),
  },
  {
    label: "Participación",
    icon: (
      <svg viewBox="0 0 32 32" aria-hidden="true">
        <path d="M12 15a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
        <path d="M22 15a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" />
        <path d="M5 26c.6-5 3.2-8 7-8s6.4 3 7 8" />
        <path d="M17 22c1-2.7 2.8-4 5-4 3.2 0 5.2 2.6 5.7 7" />
      </svg>
    ),
  },
  {
    label: "Seguridad",
    icon: (
      <svg viewBox="0 0 32 32" aria-hidden="true">
        <path d="M16 4 26 8v7c0 7-4 11-10 13C10 26 6 22 6 15V8l10-4Z" />
        <path d="m12 16 3 3 6-7" />
      </svg>
    ),
  },
  {
    label: "Agua",
    icon: (
      <svg viewBox="0 0 32 32" aria-hidden="true">
        <path d="M16 4s8 9 8 16a8 8 0 0 1-16 0C8 13 16 4 16 4Z" />
        <path d="M12 21c.8 2.2 2.2 3.3 4.5 3.3" />
      </svg>
    ),
  },
  {
    label: "Medio ambiente",
    icon: (
      <svg viewBox="0 0 32 32" aria-hidden="true">
        <path d="M16 27V13" />
        <path d="M10 18c-4 0-6-3-6-6 4-1 8 0 10 5" />
        <path d="M22 18c4 0 6-3 6-6-4-1-8 0-10 5" />
        <path d="M16 13c-2-4-1-7 0-9 3 2 4 5 2 9" />
      </svg>
    ),
  },
];

export default function LoginForm() {
  const router = useRouter();
  const { status } = useSession();
  const [hoveredZone, setHoveredZone] = useState("zmvm");

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const mapX = useTransform(mouseX, [-1, 1], [-18, 18]);
  const mapY = useTransform(mouseY, [-1, 1], [-12, 12]);
  const hudX = useTransform(mouseX, [-1, 1], [18, -18]);
  const hudY = useTransform(mouseY, [-1, 1], [10, -10]);
  const footerX = useTransform(mouseX, [-1, 1], [-8, 8]);

  const activeItem =
    metroNodes.find((item) => item.id === hoveredZone) ||
    stateNodes.find((item) => item.id === hoveredZone) ||
    metroNodes.find((item) => item.id === "zmvm");

  function handleVisualMouseMove(event) {
    const rect = event.currentTarget.getBoundingClientRect();
    const nextX = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
    const nextY = ((event.clientY - rect.top) / rect.height - 0.5) * 2;

    animate(mouseX, nextX, { duration: 0.35, ease: "easeOut" });
    animate(mouseY, nextY, { duration: 0.35, ease: "easeOut" });
  }

  function handleVisualMouseLeave() {
    animate(mouseX, 0, { duration: 0.7, ease: "easeOut" });
    animate(mouseY, 0, { duration: 0.7, ease: "easeOut" });
    setHoveredZone("zmvm");
  }

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/acuerdos-metropolitanos/dashboard");
    }
  }, [router, status]);

  return (
    <section className={styles.loginPage}>
      <div className={styles.loginShell}>
        <motion.aside
          className={styles.visualSide}
          onMouseMove={handleVisualMouseMove}
          onMouseLeave={handleVisualMouseLeave}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.85, ease: "easeOut" }}
        >
          <div className={styles.scanGrid} aria-hidden="true" />
          <div className={styles.energyBeam} aria-hidden="true" />

          <motion.div
            className={styles.orbitalGlow}
            style={{ x: hudX, y: hudY }}
            aria-hidden="true"
          />

          <motion.div
            className={styles.mapLayer}
            style={{ x: mapX, y: mapY }}
            aria-label="Red metropolitana de comunicación entre Hidalgo, CDMX, EDOMEX y Morelos"
            initial={{ opacity: 0, scale: 0.94, y: 18 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <svg viewBox="0 0 620 460" role="img">
              <defs>
                <filter id="metroGlow" x="-45%" y="-45%" width="190%" height="190%">
                  <feGaussianBlur stdDeviation="3.4" result="blur" />
                  <feColorMatrix
                    in="blur"
                    type="matrix"
                    values="
                      1 0 0 0 0.92
                      0 1 0 0 0.18
                      0 0 1 0 0.45
                      0 0 0 1 0"
                  />
                  <feMerge>
                    <feMergeNode />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>

                <filter id="goldGlow" x="-45%" y="-45%" width="190%" height="190%">
                  <feGaussianBlur stdDeviation="2.5" result="blur" />
                  <feColorMatrix
                    in="blur"
                    type="matrix"
                    values="
                      1 0 0 0 1
                      0 1 0 0 0.72
                      0 0 1 0 0.28
                      0 0 0 1 0"
                  />
                  <feMerge>
                    <feMergeNode />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>

                <linearGradient id="connectionStroke" x1="0%" x2="100%" y1="0%" y2="100%">
                  <stop offset="0%" stopColor="#dec9a3" />
                  <stop offset="46%" stopColor="#bc955b" />
                  <stop offset="100%" stopColor="#ec467f" />
                </linearGradient>
              </defs>

              <g className={styles.communicationBackbone}>
                {communicationLinks.map((link, index) => (
                  <motion.path
                    key={`back-${link.id}`}
                    d={link.d}
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{
                      duration: 1.3,
                      delay: 0.25 + index * 0.07,
                      ease: "easeInOut",
                    }}
                  />
                ))}
              </g>

              <g className={styles.communicationLinks}>
                {communicationLinks.map((link, index) => (
                  <motion.path
                    key={link.id}
                    d={link.d}
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{
                      duration: 1.55,
                      delay: 0.45 + index * 0.08,
                      ease: "easeInOut",
                    }}
                  />
                ))}
              </g>

              <g className={styles.dataFlows}>
                {communicationLinks.map((link, index) => (
                  <motion.path
                    key={`flow-${link.id}`}
                    d={link.d}
                    initial={{ strokeDashoffset: 120 }}
                    animate={{ strokeDashoffset: 0 }}
                    transition={{
                      duration: 2.3,
                      repeat: Infinity,
                      ease: "linear",
                      delay: index * 0.16,
                    }}
                  />
                ))}
              </g>

              {stateNodes.map((node, index) => (
                <motion.g
                  key={node.id}
                  className={styles.stateNode}
                  data-active={hoveredZone === node.id}
                  onMouseEnter={() => setHoveredZone(node.id)}
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    duration: 0.45,
                    delay: 0.9 + index * 0.12,
                    ease: "backOut",
                  }}
                  whileHover={{ scale: 1.06 }}
                >
                  <circle className={styles.stateHalo} cx={node.x} cy={node.y} r="29" />
                  <circle className={styles.stateCore} cx={node.x} cy={node.y} r="9" />

                  <text
                    className={styles.stateLabel}
                    x={node.x}
                    y={node.y - 42}
                    textAnchor="middle"
                  >
                    {node.label}
                  </text>

                  <text
                    className={styles.stateSubLabel}
                    x={node.x}
                    y={node.y - 27}
                    textAnchor="middle"
                  >
                    {node.subtitle}
                  </text>
                </motion.g>
              ))}

              {metroNodes.map((node, index) => (
                <motion.g
                  key={node.id}
                  className={styles.metroNode}
                  data-active={hoveredZone === node.id}
                  onMouseEnter={() => setHoveredZone(node.id)}
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    duration: 0.5,
                    delay: 1.2 + index * 0.15,
                    ease: "backOut",
                  }}
                  whileHover={{ scale: 1.08 }}
                >
                  <motion.circle
                    className={styles.metroHalo}
                    cx={node.x}
                    cy={node.y}
                    r="21"
                    animate={{
                      scale: [1, 1.45, 1],
                      opacity: [0.35, 0.05, 0.35],
                    }}
                    transition={{
                      duration: 2.3,
                      repeat: Infinity,
                      delay: index * 0.35,
                      ease: "easeInOut",
                    }}
                  />

                  <circle className={styles.metroCore} cx={node.x} cy={node.y} r="12" />

                  <text
                    className={styles.metroLabel}
                    x={node.x}
                    y={node.y + 39}
                    textAnchor="middle"
                  >
                    {node.label}
                  </text>

                  <text
                    className={styles.metroName}
                    x={node.x}
                    y={node.y + 54}
                    textAnchor="middle"
                  >
                    {node.shortName}
                  </text>
                </motion.g>
              ))}

              <motion.g
                className={styles.signalHub}
                animate={{ rotate: 360 }}
                transition={{
                  duration: 14,
                  repeat: Infinity,
                  ease: "linear",
                }}
              >
                <circle cx="375" cy="292" r="42" />
                <path d="M375 250V266" />
                <path d="M375 318V334" />
                <path d="M333 292H349" />
                <path d="M401 292H417" />
              </motion.g>
            </svg>
          </motion.div>

          <motion.div className={styles.hudRing} style={{ x: hudX, y: hudY }} aria-hidden="true">
            <span />
            <span />
            <span />
          </motion.div>

          <motion.div
            className={styles.metricRail}
            initial={{ opacity: 0, x: 22 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.75, delay: 0.85, ease: [0.16, 1, 0.3, 1] }}
          >
            {floatingMetrics.map((item, index) => (
              <motion.button
                type="button"
                key={item.id}
                className={`${styles.metricCard} ${hoveredZone === item.id ? styles.metricCardActive : ""
                  }`}
                onMouseEnter={() => setHoveredZone(item.id)}
                onFocus={() => setHoveredZone(item.id)}
                initial={{ opacity: 0, x: 18, scale: 0.96 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                transition={{
                  duration: 0.55,
                  delay: 1 + index * 0.12,
                  ease: [0.16, 1, 0.3, 1],
                }}
                whileHover={{ x: -6, scale: 1.025 }}
                whileTap={{ scale: 0.98 }}
              >
                <strong>{item.value}</strong>
                <span>{item.label}</span>
                <small>{item.detail}</small>
              </motion.button>
            ))}
          </motion.div>

          <motion.div
            className={styles.routePanel}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 1.05, ease: [0.16, 1, 0.3, 1] }}
          >
            <strong>{activeItem?.name || activeItem?.label}</strong>
            <p>{activeItem?.description}</p>
          </motion.div>

          <motion.div
            className={styles.visualFooter}
            style={{ x: footerX }}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 1.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <p>
              CONECTAMOS REGIONES
              <br />
              CONSTRUIMOS FUTURO
            </p>

            <div className={styles.visualLine} />

            <div className={styles.footerIcons}>
              {footerIcons.map((item, index) => (
                <motion.span
                  key={item.label}
                  title={item.label}
                  aria-label={item.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.35 + index * 0.08, duration: 0.35 }}
                  whileHover={{ y: -5, scale: 1.12 }}
                >
                  {item.icon}
                </motion.span>
              ))}
            </div>
          </motion.div>
        </motion.aside>

        <div className={styles.loginContent}>
          <div className={styles.loginPanel}>
            <img className={styles.logo} src="/img/headertxt.png" alt="Metrópoli Hidalgo" />

            <div className={styles.titleDivider} />

            <h1>Acuerdos metropolitanos</h1>

            <div className={styles.formPanel}>
              <LoginCredentialsForm />
            </div>

            <img
              className={styles.skyline}
              src="/img/acuerdos-skyline.png"
              alt=""
              aria-hidden="true"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
