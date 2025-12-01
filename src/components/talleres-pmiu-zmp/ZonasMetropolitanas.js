"use client";

import React, { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import styles from "./ZonasMetropolitanas.module.css";

// Declaras tus zonas con clave + etiqueta y el import dinámico del componente
const ZONAS = [
  { key: "pachuca", label: "Pachuca de Soto", loader: () => import("./ZMP/pachuca") },
  { key: "epazoyucan", label: "Epazoyucan", loader: () => import("./ZMP/epazoyucan") },
  { key: "mineral-reforma", label: "Mineral de la Reforma", loader: () => import("./ZMP/mineral-reforma") },
  { key: "mineral-monte", label: "Mineral del Monte", loader: () => import("./ZMP/mineral-monte") },
  { key: "san-agustin-tlaxiaca", label: "San Agustín Tlaxiaca", loader: () => import("./ZMP/san-agustin-tlaxiaca") },
  { key: "zapotlan", label: "Zapotlán de Juárez", loader: () => import("./ZMP/zapotlan") },
  { key: "zempoala", label: "Zempoala", loader: () => import("./ZMP/zempoala") },
];

// Utilidad para leer zona guardada
const getZonaFromLocalStorage = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("selectedTaller_PMIU_ZMP") || "pachuca";
  }
  return "pachuca";
};

export default function ZonasMetropolitanas() {
  const [zonaSeleccionada, setZonaSeleccionada] = useState("pachuca");
  const [fade, setFade] = useState("fade-in");

  // Carga inicial
  useEffect(() => {
    setZonaSeleccionada(getZonaFromLocalStorage());
  }, []);

  // Dinámico del componente según zona (code splitting)
  const ZonaComponent = useMemo(() => {
    const def = ZONAS.find((z) => z.key === zonaSeleccionada);
    if (!def) return null;
    return dynamic(def.loader, {
      loading: () => <div className={styles.loading}>Cargando…</div>,
      ssr: false,
    });
  }, [zonaSeleccionada]);

  const handleZonaChange = (zonaKey) => {
    if (zonaKey === zonaSeleccionada) return;
    setFade("fade-out");
    // espera la salida y cambia
    setTimeout(() => {
      setZonaSeleccionada(zonaKey);
      localStorage.setItem("selectedTaller_PMIU_ZMP", zonaKey);
      setFade("fade-in");
    }, 250); // sync con tu animación CSS
  };

  return (
    <div className={styles.zonasContainer}>
      {/* Selector de Zonas (auto-generado) */}
      <div className={styles.selector}>
        {ZONAS.map((z) => (
          <button
            key={z.key}
            className={zonaSeleccionada === z.key ? styles.active : ""}
            onClick={() => handleZonaChange(z.key)}
            type="button"
          >
            {z.label}
          </button>
        ))}
      </div>

      {/* Contenido con fade */}
      <div className={`${styles.zonaContent} ${styles[fade]}`}>
        {ZonaComponent ? (
          <ZonaComponent />
        ) : (
          <div className={styles.placeholder}>
            Aún no hay contenido para <strong>{zonaSeleccionada}</strong>.
          </div>
        )}
      </div>
    </div>
  );
}
