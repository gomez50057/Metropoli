"use client";

import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import './ProjectMap.css';
import { ZMP_Info, ZMT_Info, ZMTUL_Info, zmvm_InfoGeneral } from './ZM';
import { municipalityIcons, PROJECT_META } from './MunicipalityIcons';

const ProjectMap = () => {
  const mapRef = useRef(null);
  const municipalLayersRef = useRef({});

  // UI state 
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [L, setL] = useState(null);
  const [pdfModalUrl, setPdfModalUrl] = useState(null);

  // Menú contextual del icono (hover/click) 
  const [menu, setMenu] = useState({
    open: false,
    x: 0,
    y: 0,
    projectKey: null,
    iconUrl: null
  });

  // Zonas visibles (si luego necesitas toggles, ya está preparado) 
  const [visibleZones] = useState({
    ZMP: true,
    ZMTula: true,
    ZMTulancingo: true,
    ZMVM: true,
  });

  // Helper: normaliza a filename (p.ej. "/icons/PIMUS.png" -> "PIMUS.png") 
  const projectKeyFromPath = useCallback((p) => (p || '').split('/').pop(), []);

  // Obtiene metadatos legibles del proyecto (nombre, PDF, color, etc.) 
  const getProjectMeta = useCallback(
    (projectKey) => PROJECT_META[projectKey] || null,
    []
  );

  // Abre menú flotante anclado al icono (coordenadas de viewport) 
  const showIconMenu = useCallback((e, iconUrl) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMenu({
      open: true,
      x: rect.left + rect.width / 2,
      y: rect.top,
      projectKey: projectKeyFromPath(iconUrl),
      iconUrl,
    });
  }, [projectKeyFromPath]);

  // Cierra el menú contextual 
  const closeIconMenu = useCallback(() => {
    setMenu((m) => ({ ...m, open: false }));
  }, []);

  // Cierra menú al hacer click fuera 
  useEffect(() => {
    const onDocClick = (ev) => {
      const menuEl = document.getElementById('iconActionMenu');
      if (menu.open && menuEl && !menuEl.contains(ev.target)) {
        closeIconMenu();
      }
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [menu.open, closeIconMenu]);

  // Cierra menú si el usuario hace scroll (evita menú “desanclado”) 
  useEffect(() => {
    const onScroll = () => menu.open && closeIconMenu();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [menu.open, closeIconMenu]);

  // Índice inverso: "archivo.png" -> Set(municipios) (se construye una sola vez) 
  const projectToMunicipalities = useMemo(() => {
    const idx = {};
    Object.entries(municipalityIcons).forEach(([mun, icons]) => {
      icons.forEach((p) => {
        const key = projectKeyFromPath(p);
        if (!idx[key]) idx[key] = new Set();
        idx[key].add(mun);
      });
    });
    return idx;
  }, [projectKeyFromPath]);

  // Estilo base para polígonos 
  const commonStyle = useCallback((fillColor, color, weight = 2) => ({
    fillColor,
    fillOpacity: 0.3,
    color,
    weight,
  }), []);


  // Resalta municipios impactados por un proyecto.
  // colorOverride: si se define, usa ese color (sino verde por defecto).

  const highlightByProject = useCallback((projectKey, colorOverride) => {
    // Resetear estilos a su estado original
    Object.values(municipalLayersRef.current).forEach((layer) => {
      if (layer && layer._defaultStyle) {
        layer.setStyle(layer._defaultStyle);
      }
    });

    // Obtener municipios impactados
    const impacted = projectToMunicipalities[projectKey] || new Set();
    const highlight = colorOverride || '#2ecc71';

    // Aplicar estilo resaltado y recolectar capas afectadas
    const impactedLayers = [];
    impacted.forEach((mun) => {
      const layer = municipalLayersRef.current[mun];
      if (layer) {
        layer.setStyle({
          ...layer._defaultStyle,
          fillColor: highlight,
          color: highlight,
          fillOpacity: 0.5,
          weight: 3,
        });
        layer.bringToFront();
        impactedLayers.push(layer);
      }
    });

    // Zoom a los municipios impactados (si hay al menos uno y el mapa existe)
    if (mapRef.current && impactedLayers.length > 0) {
      try {
        // Construir un FeatureGroup para obtener el bounds combinado
        const group = L.featureGroup(impactedLayers);
        const bounds = group.getBounds();

        // Ajuste suave con padding
        mapRef.current.fitBounds(bounds, {
          padding: [24, 24],
          animate: true,
          duration: 0.6, // Leaflet usa easing por defecto
        });
      } catch (err) {
      }
    }
  }, [projectToMunicipalities]);


  // Carga dinámica de Leaflet solo en cliente 
  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('leaflet').then((module) => {
        setL(module.default);
        import('leaflet/dist/leaflet.css');
      });
    }
  }, []);

  // Inicializa/actualiza el mapa y las capas según visibleZones 
  useEffect(() => {
    if (!L) return;

    // Popups para ZMP/ZMT/ZMTUL 
    const createPopupContentMetropolitanas = (feature) => {
      const {
        POBMUN, POBFEM, POBMAS, Superficie, NO_Zona, NOM_MUN,
        POB_ESTATA, PMDU, NOM_LINK_P, FECH, LINKPMDU, LINKPMD, FECHPMD,
        ATLAS, LINKATLAS, FECHATLAS,
      } = feature.properties;

      const poblacionMunicipal = POBMUN ? POBMUN.toLocaleString() : "No disponible";
      const poblacionFemenina = POBFEM ? POBFEM.toLocaleString() : "No disponible";
      const poblacionMasculina = POBMAS ? POBMAS.toLocaleString() : "No disponible";
      const superficieMunicipal = Superficie ? `${Superficie.toFixed(3)} km²` : "No disponible";
      const poblacionMetropolitana = POB_ESTATA ? POB_ESTATA.toLocaleString() : "No disponible";

      let html = `
        <div class='PopupT'><b>Zona Metropolitana de </b>${NO_Zona || "Desconocida"}</div>
        <b>Municipio:</b> ${NOM_MUN || "Desconocido"}
        <br><b>Población Municipal:</b> ${poblacionMunicipal}
        <br><b>Mujeres:</b> ${poblacionFemenina}
        <br><b>Hombres:</b> ${poblacionMasculina}
        <br><b>Superficie:</b> ${superficieMunicipal}
        <br><b>Población Metropolitana:</b> ${poblacionMetropolitana}
        <div class='PopupSubT'><b>Instrumentos de Planeación </b></div>
      `;
      if (PMDU !== "No existe") {
        html += `<b>PMDU:</b> <a href='${LINKPMDU || "#"}' target='_blank'>${NOM_LINK_P || "Consultar"}</a><b> (${FECH || "N/A"})</b>`;
      } else {
        html += `<b>PMDU:</b> ${PMDU}`;
      }
      html += `<br><b>PMD:</b> <a href='${LINKPMD || "#"}' target='_blank'><b>Consultar</b></a><b> (${FECHPMD || "N/A"})</b>`;
      if (ATLAS !== "No existe") {
        html += `<br><b>Atlas de Riesgos:</b> <a href='${LINKATLAS || "#"}' target='_blank'><b>Consultar</b></a><b> (${FECHATLAS || "N/A"})</b>`;
      } else {
        html += `<br><b>Atlas de Riesgos:</b> ${ATLAS}`;
      }
      return html;
    };

    // Popups para ZMVM 
    const createPopupContentZMVM = (feature) => {
      const {
        POBMUN, POBFEM, POBMAS, Superficie, NOM_ENT, NOM_MUN, POBMETRO,
      } = feature.properties;

      const poblacionMunicipal = POBMUN ? POBMUN.toLocaleString() : "No disponible";
      const poblacionFemenina = POBFEM ? POBFEM.toLocaleString() : "No disponible";
      const poblacionMasculina = POBMAS ? POBMAS.toLocaleString() : "No disponible";
      const superficieMunicipal = Superficie ? `${Superficie.toFixed(3)} km²` : "No disponible";
      const poblacionMetropolitana = POBMETRO ? POBMETRO.toLocaleString() : "No disponible";

      return `
        <div class='PopupT'>${NOM_ENT || "Entidad desconocida"}</div>
        <b>Nombre del Municipio:</b> ${NOM_MUN || "Desconocido"}
        <br><b>Población Municipal:</b> ${poblacionMunicipal}
        <br><b>Mujeres:</b> ${poblacionFemenina}
        <br><b>Hombres:</b> ${poblacionMasculina}
        <br><b>Superficie:</b> ${superficieMunicipal}
        <br><b>Población Metropolitana:</b> ${poblacionMetropolitana}
      `;
    };

    // Reinicia índice de capas por municipio antes de dibujar 
    municipalLayersRef.current = {};

    // Factories de capas GeoJSON 
    const geoJSONMetropolitanas = (data, fillColor, color) => {
      return L.geoJSON(data, {
        style: commonStyle(fillColor, color),
        onEachFeature: (feature, layer) => {
          layer._defaultStyle = commonStyle(fillColor, color);
          layer.bindPopup(createPopupContentMetropolitanas(feature));
          const name = feature?.properties?.NOM_MUN;
          if (name) municipalLayersRef.current[name] = layer;
        }
      }).addTo(mapRef.current);
    };

    const geoJSONZMVM = (data) => {
      return L.geoJSON(data, {
        style: (feature) => {
          const colorMap = {
            "Hidalgo": "#691B31",
            "Estado de México": "#691B31",
            "Ciudad de México": "#691B31",
          };
          const color = colorMap[feature.properties.NOM_ENT] || "orange";
          return commonStyle(color, color, 2.6);
        },
        onEachFeature: (feature, layer) => {
          const ent = feature?.properties?.NOM_ENT;
          const colorMap = {
            "Hidalgo": "#691B31",
            "Estado de México": "#691B31",
            "Ciudad de México": "#691B31",
          };
          const color = colorMap[ent] || "orange";
          layer._defaultStyle = commonStyle(color, color, 2.6);
          layer.bindPopup(createPopupContentZMVM(feature));
          const name = feature?.properties?.NOM_MUN;
          if (name) municipalLayersRef.current[name] = layer;
        }
      }).addTo(mapRef.current);
    };

    // Dibuja las capas según visibilidad 
    const addLayers = () => {
      if (visibleZones.ZMP) geoJSONMetropolitanas(ZMP_Info, '#BC955B', '#BC955B');
      if (visibleZones.ZMTula) geoJSONMetropolitanas(ZMT_Info, '#98989a', '#98989a');
      if (visibleZones.ZMTulancingo) geoJSONMetropolitanas(ZMTUL_Info, '#A02142', '#A02142');
      if (visibleZones.ZMVM) geoJSONZMVM(zmvm_InfoGeneral);
    };

    // Inicializa mapa si no existe; si existe, limpia GeoJSONs y redibuja 
    if (mapRef.current) {
      mapRef.current.eachLayer((layer) => {
        if (layer instanceof L.GeoJSON) {
          mapRef.current.removeLayer(layer);
        }
      });
      addLayers();
    } else {
      mapRef.current = L.map('map', {
        center: [19.6296533, -98.9263916],
        zoom: 9,
        zoomControl: false,
        minZoom: 8,
        maxZoom: 18,
      });

      // Tile de Google (satélite híbrido). Considera HTTPS si sirves tu sitio en HTTPS 
      L.tileLayer('http://{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}', {
        maxZoom: 20,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
      }).addTo(mapRef.current);

      mapRef.current.attributionControl.setPrefix('');
      addLayers();
    }
  }, [L, visibleZones, commonStyle]);

  // Acción del menú (Ver ficha / Impacto) 
  const handleMenuAction = useCallback((action) => {
    if (!menu.projectKey) return;

    const meta = getProjectMeta(menu.projectKey);

    if (action === 'ficha') {
      const pdfUrl = meta?.pdf || menu.iconUrl.replace('.png', '.pdf'); // fallback si no define PDF
      setPdfModalUrl(pdfUrl);
      highlightByProject(menu.projectKey, meta?.color);
    } else if (action === 'impacto') {
      highlightByProject(menu.projectKey, meta?.color);
    }
    closeIconMenu();
  }, [menu.projectKey, menu.iconUrl, getProjectMeta, highlightByProject, closeIconMenu]);

  // Fullscreen nativo del contenedor del mapa 
  const toggleFullScreen = useCallback(() => {
    if (typeof window === 'undefined') return;
    if (!isFullScreen && mapRef.current) {
      mapRef.current.getContainer().requestFullscreen?.();
    } else if (document.fullscreenElement) {
      document.exitFullscreen?.();
    }
    setIsFullScreen((prev) => !prev);
  }, [isFullScreen]);

  return (
    <section className="mapaConte">
      <div id="map">
        <div id="fullscreenButton" onClick={toggleFullScreen}>
          {isFullScreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
        </div>

        <div id="icons">
          <img
            src="/icons/ACT_PDUyOT_ZMP.png"
            alt="ACT_PDUyOT_ZMP"
            title="Actualización del Programa de Desarrollo Urbano y Ordenamiento Territorial de la Zona Metropolitana de Pachuca"
            onMouseEnter={(e) => showIconMenu(e, '/icons/ACT_PDUyOT_ZMP.png')}
            onClick={(e) => showIconMenu(e, '/icons/ACT_PDUyOT_ZMP.png')}
          />
          <img
            src="/icons/ACT_PO_ZMVM.png"
            alt="ACT_PO_ZMVM"
            title="Actualización del Programa de Ordenamiento Zona Metropolitana del Valle de México"
            onMouseEnter={(e) => showIconMenu(e, '/icons/ACT_PO_ZMVM.png')}
            onClick={(e) => showIconMenu(e, '/icons/ACT_PO_ZMVM.png')}
          />
          <img
            src="/icons/CLI_AIFA.png"
            alt="CLI_AIFA"
            title="Corredor Logístico Industrial del AIFA"
            onMouseEnter={(e) => showIconMenu(e, '/icons/CLI_AIFA.png')}
            onClick={(e) => showIconMenu(e, '/icons/CLI_AIFA.png')}
          />
          <img
            src="/icons/PHMVM.png"
            alt="PHMVM"
            title="Plan Hídrico Metropolitano del Valle de México"
            onMouseEnter={(e) => showIconMenu(e, '/icons/PHMVM.png')}
            onClick={(e) => showIconMenu(e, '/icons/PHMVM.png')}
          />
          <img
            src="/icons/PIMUS.png"
            alt="PIMUS"
            title="Planes Integrales de Movilidad Urbana Sustentable"
            onMouseEnter={(e) => showIconMenu(e, '/icons/PIMUS.png')}
            onClick={(e) => showIconMenu(e, '/icons/PIMUS.png')}
          />
          <img
            src="/icons/PMIU_ZMP.png"
            alt="PMIU_ZMP"
            title="Plan Maestro de Imagen Urbana para la Zona Metropolitana de Pachuca"
            onMouseEnter={(e) => showIconMenu(e, '/icons/PMIU_ZMP.png')}
            onClick={(e) => showIconMenu(e, '/icons/PMIU_ZMP.png')}
          />
          <img
            src="/icons/PVB.png"
            alt="PVB"
            title="Programa de Vivienda para el Bienestar"
            onMouseEnter={(e) => showIconMenu(e, '/icons/PVB.png')}
            onClick={(e) => showIconMenu(e, '/icons/PVB.png')}
          />
          <img
            src="/icons/TREN_MEX-QRO.png"
            alt="TREN_MEX-QRO"
            title="Tren México - Querétaro"
            onMouseEnter={(e) => showIconMenu(e, '/icons/TREN_MEX-QRO.png')}
            onClick={(e) => showIconMenu(e, '/icons/TREN_MEX-QRO.png')}
          />
          <img
            src="/icons/TREN_TRAMO_AIFA-PACHUCA.png"
            alt="TREN_TRAMO_AIFA-PACHUCA"
            title="Tren México - Pachuca, Tramo AIFA - Pachuca"
            onMouseEnter={(e) => showIconMenu(e, '/icons/TREN_TRAMO_AIFA-PACHUCA.png')}
            onClick={(e) => showIconMenu(e, '/icons/TREN_TRAMO_AIFA-PACHUCA.png')}
          />
        </div>

        {pdfModalUrl && (
          <div className="modalOverlay" onClick={() => setPdfModalUrl(null)}>
            <div className="modalContent" onClick={(e) => e.stopPropagation()}>
              <button className="closeModal" onClick={() => setPdfModalUrl(null)}>Cerrar</button>
              <iframe src={pdfModalUrl} title="PDF Viewer" width="100%" height="100%"></iframe>
            </div>
          </div>
        )}
      </div>

      {
        menu.open && (
          <div
            id="iconActionMenu"
            className="iconActionMenu"
            style={{ left: `${menu.x}px`, top: `${menu.y}px` }}
          >
            <div className="menuHeader">
              <p>Opciones para:</p>
              <strong>{getProjectMeta(menu.projectKey)?.label || menu.projectKey}</strong>
            </div>

            <div className="menuButtons">
              <button className="menuBtn" onClick={() => handleMenuAction('ficha')}>
                Ver ficha
              </button>
              <button className="menuBtn" onClick={() => handleMenuAction('impacto')}>
                Impacto
              </button>
            </div>
          </div>
        )
      }
    </section>
  );
};

export default ProjectMap;
