"use client";

import React, { useEffect, useRef, useState, useMemo, useCallback } from "react";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";
import CloseIcon from "@mui/icons-material/Close";
import styles from "./ProjectMap.module.css";

import { ZMP_Info, ZMT_Info, ZMTUL_Info, zmvm_InfoGeneral } from "./ZM";
import { municipalityIcons, PROJECT_META } from "./MunicipalityIcons";

const ICONS_LIST = [
  { src: "/icons/ACT_PDUyOT_ZMP.png", alt: "ACT_PDUyOT_ZMP" },
  { src: "/icons/ACT_PO_ZMVM.png", alt: "ACT_PO_ZMVM" },
  { src: "/icons/CLI_AIFA.png", alt: "CLI_AIFA" },
  { src: "/icons/PHMVM.png", alt: "PHMVM" },
  { src: "/icons/PIMUS.png", alt: "PIMUS" },
  { src: "/icons/PMIU_ZMP.png", alt: "PMIU_ZMP" },
  { src: "/icons/PVB.png", alt: "PVB" },
  { src: "/icons/TREN_MEX-QRO.png", alt: "TREN_MEX-QRO" },
  { src: "/icons/TREN_TRAMO_AIFA-PACHUCA.png", alt: "TREN_TRAMO_AIFA-PACHUCA" },
];

const fmtCommaInt = (v) => {
  if (v === null || v === undefined || v === "") return "No disponible";
  const cleaned = String(v).trim().replace(/[^\d-]/g, "");
  if (cleaned === "" || cleaned === "-") return "No disponible";
  const sign = cleaned.startsWith("-") ? "-" : "";
  const digits = cleaned.replace("-", "");
  return sign + digits.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const safeKm2 = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? `${n.toFixed(3)} km²` : "No disponible";
};

const ProjectMap = () => {
  // Leaflet map instance
  const mapRef = useRef(null);
  const municipalLayersRef = useRef({});

  const [L, setL] = useState(null);

  // UI
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [pdfModalUrl, setPdfModalUrl] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeProjectKey, setActiveProjectKey] = useState(null);
  const [layersReady, setLayersReady] = useState(false);

  // constante (no state): evita deps raras
  const visibleZones = useMemo(
    () => ({ ZMP: true, ZMTula: true, ZMTulancingo: true, ZMVM: true }),
    []
  );

  const projectKeyFromPath = useCallback((p) => (p || "").split("/").pop(), []);
  const getProjectMeta = useCallback((projectKey) => PROJECT_META[projectKey] || null, []);

  // precompute: src -> projectKey
  const icons = useMemo(() => {
    return ICONS_LIST.map((it) => ({
      ...it,
      projectKey: projectKeyFromPath(it.src),
    }));
  }, [projectKeyFromPath]);

  const projectToMunicipalities = useMemo(() => {
    const idx = {};
    Object.entries(municipalityIcons).forEach(([mun, iconsArr]) => {
      iconsArr.forEach((p) => {
        const key = projectKeyFromPath(p);
        if (!idx[key]) idx[key] = new Set();
        idx[key].add(mun);
      });
    });
    return idx;
  }, [projectKeyFromPath]);

  const commonStyle = useCallback(
    (fillColor, color, weight = 2) => ({
      fillColor,
      fillOpacity: 0.3,
      color,
      weight,
    }),
    []
  );

  const resetHighlight = useCallback(() => {
    Object.values(municipalLayersRef.current).forEach((layer) => {
      if (layer && layer._defaultStyle) layer.setStyle(layer._defaultStyle);
    });
  }, []);

  const highlightByProject = useCallback(
    (projectKey, colorOverride) => {
      if (!L || !mapRef.current) return;

      resetHighlight();

      const impacted = projectToMunicipalities[projectKey] || new Set();
      const highlight = colorOverride || "#2ecc71";

      const impactedLayers = [];
      impacted.forEach((mun) => {
        const layer = municipalLayersRef.current[mun];
        if (!layer) return;

        layer.setStyle({
          ...layer._defaultStyle,
          fillColor: highlight,
          color: highlight,
          fillOpacity: 0.5,
          weight: 3,
        });
        layer.bringToFront();
        impactedLayers.push(layer);
      });

      if (impactedLayers.length > 0) {
        try {
          const group = L.featureGroup(impactedLayers);
          mapRef.current.fitBounds(group.getBounds(), {
            padding: [24, 24],
            animate: true,
            duration: 0.6,
          });
        } catch {}
      }
    },
    [L, projectToMunicipalities, resetHighlight]
  );

  // dynamic import Leaflet (client only)
  useEffect(() => {
    if (typeof window === "undefined") return;
    let mounted = true;

    import("leaflet").then((module) => {
      if (!mounted) return;
      setL(module.default);
      import("leaflet/dist/leaflet.css");
    });

    return () => {
      mounted = false;
    };
  }, []);

  // cleanup map on unmount (evita fugas en Next route changes)
  useEffect(() => {
    return () => {
      try {
        if (mapRef.current) {
          mapRef.current.remove();
          mapRef.current = null;
        }
      } catch {}
    };
  }, []);

  // init / update map
  useEffect(() => {
    if (!L) return;

    setLayersReady(false);

    const createPopupContentMetropolitanas = (feature) => {
      const {
        POBMUN,
        POBFEM,
        POBMAS,
        Superficie,
        NO_Zona,
        NOM_MUN,
        POB_ESTATA,
        PMDU,
        NOM_LINK_P,
        FECH,
        LINKPMDU,
        LINKPMD,
        FECHPMD,
        ATLAS,
        LINKATLAS,
        FECHATLAS,
      } = feature.properties;

      let popupContent = `
        <div class='PopupT'><b>Zona Metropolitana de </b>${NO_Zona || "Desconocida"}</div>
        <b>Municipio:</b> ${NOM_MUN || "Desconocido"}
        <br><b>Población Municipal:</b> ${fmtCommaInt(POBMUN)}
        <br><b>Mujeres:</b> ${fmtCommaInt(POBFEM)}
        <br><b>Hombres:</b> ${fmtCommaInt(POBMAS)}
        <br><b>Superficie:</b> ${safeKm2(Superficie)}
        <br><b>Población Metropolitana:</b> ${fmtCommaInt(POB_ESTATA)}
        <div class='PopupSubT'><b>Instrumentos de Planeación</b></div>
      `;

      if (PMDU !== "No existe") {
        popupContent += `<b>PMDU:</b> <a href='${LINKPMDU || "#"}' target='_blank'>${NOM_LINK_P || "Consultar"}</a><b> (${FECH || "N/A"})</b>`;
      } else {
        popupContent += `<b>PMDU:</b> ${PMDU}`;
      }

      popupContent += `<br><b>PMD:</b> <a href='${LINKPMD || "#"}' target='_blank'><b>Consultar</b></a><b> (${FECHPMD || "N/A"})</b>`;

      if (ATLAS !== "No existe") {
        popupContent += `<br><b>Atlas de Riesgos:</b> <a href='${LINKATLAS || "#"}' target='_blank'><b>Consultar</b></a><b> (${FECHATLAS || "N/A"})</b>`;
      } else {
        popupContent += `<br><b>Atlas de Riesgos:</b> ${ATLAS}`;
      }

      return popupContent;
    };

    const createPopupContentZMVM = (feature) => {
      const { POBMUN, POBFEM, POBMAS, Superficie, NOM_ENT, NOM_MUN, POBMETRO } =
        feature.properties;

      return `
        <div class='PopupT'>${NOM_ENT || "Entidad desconocida"}</div>
        <b>Nombre del Municipio:</b> ${NOM_MUN || "Desconocido"}
        <br><b>Población Municipal:</b> ${fmtCommaInt(POBMUN)}
        <br><b>Mujeres:</b> ${fmtCommaInt(POBFEM)}
        <br><b>Hombres:</b> ${fmtCommaInt(POBMAS)}
        <br><b>Superficie:</b> ${safeKm2(Superficie)}
        <br><b>Población Metropolitana:</b> ${fmtCommaInt(POBMETRO)}
      `;
    };

    municipalLayersRef.current = {};

    const geoJSONMetropolitanas = (data, fillColor, color) =>
      L.geoJSON(data, {
        style: commonStyle(fillColor, color),
        onEachFeature: (feature, layer) => {
          layer._defaultStyle = commonStyle(fillColor, color);
          layer.bindPopup(createPopupContentMetropolitanas(feature));
          const name = feature?.properties?.NOM_MUN;
          if (name) municipalLayersRef.current[name] = layer;
        },
      }).addTo(mapRef.current);

    const geoJSONZMVM = (data) =>
      L.geoJSON(data, {
        style: (feature) => {
          const colorMap = {
            Hidalgo: "#691B31",
            "Estado de México": "#691B31",
            "Ciudad de México": "#691B31",
            Morelos: "#691B31",
          };
          const c = colorMap[feature.properties.NOM_ENT] || "orange";
          return commonStyle(c, c, 2.6);
        },
        onEachFeature: (feature, layer) => {
          const ent = feature?.properties?.NOM_ENT;
          const colorMap = {
            Hidalgo: "#691B31",
            "Estado de México": "#691B31",
            "Ciudad de México": "#691B31",
            Morelos: "#691B31",
          };
          const c = colorMap[ent] || "orange";
          layer._defaultStyle = commonStyle(c, c, 2.6);
          layer.bindPopup(createPopupContentZMVM(feature));
          const name = feature?.properties?.NOM_MUN;
          if (name) municipalLayersRef.current[name] = layer;
        },
      }).addTo(mapRef.current);

    const addLayers = () => {
      if (visibleZones.ZMP) geoJSONMetropolitanas(ZMP_Info, "#BC955B", "#BC955B");
      if (visibleZones.ZMTula) geoJSONMetropolitanas(ZMT_Info, "#98989a", "#98989a");
      if (visibleZones.ZMTulancingo) geoJSONMetropolitanas(ZMTUL_Info, "#A02142", "#A02142");
      if (visibleZones.ZMVM) geoJSONZMVM(zmvm_InfoGeneral);
    };

    if (mapRef.current) {
      // limpia GeoJSON layers
      mapRef.current.eachLayer((layer) => {
        if (layer instanceof L.GeoJSON) mapRef.current.removeLayer(layer);
      });
      addLayers();
      setLayersReady(true);
    } else {
      // ⚠️ importante: el contenedor debe existir: #leafletMap
      mapRef.current = L.map("leafletMap", {
        center: [19.6296533, -98.9263916],
        zoom: 9,
        zoomControl: false,
        minZoom: 8,
        maxZoom: 18,
      });

      L.tileLayer("https://{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}", {
        maxZoom: 20,
        subdomains: ["mt0", "mt1", "mt2", "mt3"],
      }).addTo(mapRef.current);

      mapRef.current.attributionControl.setPrefix("");
      addLayers();
      setLayersReady(true);
    }
  }, [L, visibleZones, commonStyle]);

  const activeMeta = useMemo(() => {
    if (!activeProjectKey) return null;
    return getProjectMeta(activeProjectKey);
  }, [activeProjectKey, getProjectMeta]);

  const impactedList = useMemo(() => {
    if (!activeProjectKey) return [];
    const set = projectToMunicipalities[activeProjectKey] || new Set();
    return Array.from(set).sort((a, b) => a.localeCompare(b, "es"));
  }, [activeProjectKey, projectToMunicipalities]);

  const openProject = useCallback(
    (projectKey) => {
      setActiveProjectKey(projectKey);
      setDrawerOpen(true);
      // opcional: prehighlight suave al abrir
      const meta = getProjectMeta(projectKey);
      if (layersReady) highlightByProject(projectKey, meta?.color);
    },
    [getProjectMeta, highlightByProject, layersReady]
  );

  const closeDrawer = useCallback(() => {
    setDrawerOpen(false);
  }, []);

  // ESC para cerrar drawer / modal
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        if (pdfModalUrl) setPdfModalUrl(null);
        if (drawerOpen) setDrawerOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [drawerOpen, pdfModalUrl]);

  const toggleFullScreen = useCallback(() => {
    if (typeof window === "undefined") return;
    if (!isFullScreen && mapRef.current) {
      mapRef.current.getContainer().requestFullscreen?.();
    } else if (document.fullscreenElement) {
      document.exitFullscreen?.();
    }
    setIsFullScreen((prev) => !prev);
  }, [isFullScreen]);

  const handleViewFicha = useCallback(() => {
    if (!activeProjectKey) return;
    const meta = getProjectMeta(activeProjectKey);
    const pdfUrl = meta?.pdf || `/icons/${activeProjectKey}`.replace(".png", ".pdf");
    setPdfModalUrl(pdfUrl);
  }, [activeProjectKey, getProjectMeta]);

  const handleImpacto = useCallback(() => {
    if (!activeProjectKey) return;
    const meta = getProjectMeta(activeProjectKey);
    highlightByProject(activeProjectKey, meta?.color);
  }, [activeProjectKey, getProjectMeta, highlightByProject]);

  const handleClear = useCallback(() => {
    resetHighlight();
  }, [resetHighlight]);

  return (
    <section className={styles.mapaConte}>
      <div className={styles.mapShell}>
        {/* Canvas Leaflet separado (más fiable) */}
        <div id="leafletMap" className={styles.mapCanvas} />

        {/* Top controls */}
        <button
          type="button"
          className={styles.fullscreenButton}
          onClick={toggleFullScreen}
          aria-label="Pantalla completa"
        >
          {isFullScreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
        </button>

        {/* Dock de proyectos */}
        <aside className={styles.dock} aria-label="Proyectos metropolitanos">
          <div className={styles.dockHeader}>
            <span className={styles.dockTitle}>Proyectos</span>
            <span className={styles.dockHint}>clic para ver opciones</span>
          </div>

          <div className={styles.dockList}>
            {icons.map((it) => {
              const meta = getProjectMeta(it.projectKey);
              const isActive = it.projectKey === activeProjectKey && drawerOpen;

              return (
                <button
                  key={it.src}
                  type="button"
                  className={`${styles.dockBtn} ${isActive ? styles.dockBtnActive : ""}`}
                  onClick={() => openProject(it.projectKey)}
                  aria-label={meta?.label || it.alt}
                >
                  <img src={it.src} alt={it.alt} className={styles.iconImg} />
                  <span className={styles.tooltip}>{meta?.label || it.alt}</span>
                </button>
              );
            })}
          </div>
        </aside>

        {/* Drawer (panel fijo, no se sale del viewport) */}
        <div
          className={`${styles.drawer} ${drawerOpen ? styles.drawerOpen : ""}`}
          role="dialog"
          aria-modal="false"
          aria-label="Detalle de proyecto"
        >
          <div className={styles.drawerHeader}>
            <div className={styles.drawerHeading}>
              <div className={styles.drawerKicker}>Opciones para</div>
              <div className={styles.drawerTitle}>
                {activeMeta?.label || (activeProjectKey ? activeProjectKey.replace(".png", "") : "Selecciona un proyecto")}
              </div>
            </div>

            <button type="button" className={styles.drawerClose} onClick={closeDrawer} aria-label="Cerrar panel">
              <CloseIcon fontSize="small" />
            </button>
          </div>

          <div className={styles.drawerBody}>
            {activeMeta?.description && (
              <p className={styles.drawerDesc}>{activeMeta.description}</p>
            )}

            <div className={styles.drawerStats}>
              <span className={styles.chip}>
                Municipios impactados: <strong>{impactedList.length}</strong>
              </span>
              {!layersReady && <span className={styles.chipMuted}>Cargando capas…</span>}
            </div>

            <div className={styles.drawerActions}>
              <button
                type="button"
                className={styles.btnPrimary}
                onClick={handleViewFicha}
                disabled={!activeProjectKey}
              >
                Ver ficha
              </button>

              <button
                type="button"
                className={styles.btnSecondary}
                onClick={handleImpacto}
                disabled={!activeProjectKey || !layersReady}
              >
                Impacto
              </button>

              <button
                type="button"
                className={styles.btnGhost}
                onClick={handleClear}
                disabled={!layersReady}
              >
                Limpiar
              </button>
            </div>

            {impactedList.length > 0 && (
              <div className={styles.drawerListWrap}>
                <div className={styles.drawerListTitle}>Municipios</div>
                <ul className={styles.drawerList}>
                  {impactedList.map((m) => (
                    <li key={m}>{m}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Modal PDF */}
        {pdfModalUrl && (
          <div className={styles.modalOverlay} onClick={() => setPdfModalUrl(null)}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
              <button type="button" className={styles.closeModal} onClick={() => setPdfModalUrl(null)}>
                Cerrar
              </button>
              <iframe src={pdfModalUrl} title="PDF Viewer" width="100%" height="100%" />
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProjectMap;