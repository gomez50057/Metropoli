"use client";

import React, { useEffect, useRef, useState } from 'react';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import './InteractiveMap.css';
import { ZMP_Info, ZMT_Info, ZMTUL_Info, zmvm_InfoGeneral } from './ZM';
import { getTituloZona, getPreposicion } from '@/utils/home';

const InteractiveMap = () => {
    const mapRef = useRef(null);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [L, setL] = useState(null); // Estado para Leaflet
    const [zonaSeleccionada, setZonaSeleccionada] = useState('ZMP'); // Zona Metropolitana seleccionada (por defecto ZMP)

    useEffect(() => {
        // Importar Leaflet solo en el cliente
        if (typeof window !== 'undefined') {
            import('leaflet').then((module) => {
                setL(module.default);
                import('leaflet/dist/leaflet.css');
            });
        }
    }, []);

    // Escuchar el evento "zonaChanged" para actualizar la zona seleccionada
    useEffect(() => {
        const handleZonaChange = () => {
            const newZona = localStorage.getItem('selectedZonaMetropolitana') || 'ZMP'; // Obtener la nueva zona seleccionada
            setZonaSeleccionada(newZona); // Actualizar el estado
        };

        // Agregar el evento listener
        window.addEventListener('zonaChanged', handleZonaChange);

        // Limpiar el evento listener cuando se desmonte el componente
        return () => {
            window.removeEventListener('zonaChanged', handleZonaChange);
        };
    }, []);

    useEffect(() => {
        if (!L || !zonaSeleccionada) return; // Si Leaflet o la zona no está cargada, no hagas nada

        const commonStyle = (fillColor, color, weight = 2) => ({
            fillColor,
            fillOpacity: 0.7,
            color,
            weight,
        });

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

            const poblacionMunicipal = POBMUN ? POBMUN.toLocaleString() : "No disponible";
            const poblacionFemenina = POBFEM ? POBFEM.toLocaleString() : "No disponible";
            const poblacionMasculina = POBMAS ? POBMAS.toLocaleString() : "No disponible";
            const superficieMunicipal = Superficie ? `${Superficie.toFixed(3)} km²` : "No disponible";
            const poblacionMetropolitana = POB_ESTATA ? POB_ESTATA.toLocaleString() : "No disponible";

            let popupContent = `
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
            const {
                POBMUN,
                POBFEM,
                POBMAS,
                Superficie,
                NOM_ENT,
                NOM_MUN,
                POBMETRO,
            } = feature.properties;

            const poblacionMunicipal = POBMUN ? POBMUN.toLocaleString() : "No disponible";
            const poblacionFemenina = POBFEM ? POBFEM.toLocaleString() : "No disponible";
            const poblacionMasculina = POBMAS ? POBMAS.toLocaleString() : "No disponible";
            const superficieMunicipal = Superficie ? `${Superficie.toFixed(3)} km²` : "No disponible";
            const poblacionMetropolitana = POBMETRO ? POBMETRO.toLocaleString() : "No disponible";

            let popupContent = `
                <div class='PopupT'>${NOM_ENT || "Entidad desconocida"}</div>
                <b>Nombre del Municipio:</b> ${NOM_MUN || "Desconocido"}
                <br><b>Población Municipal:</b> ${poblacionMunicipal}
                <br><b>Mujeres:</b> ${poblacionFemenina}
                <br><b>Hombres:</b> ${poblacionMasculina}
                <br><b>Superficie:</b> ${superficieMunicipal}
                <br><b>Población Metropolitana:</b> ${poblacionMetropolitana}
            `;

            return popupContent;
        };

        const geoJSONMetropolitanas = (data, fillColor, color) => {
            if (!L) return;
            return L.geoJSON(data, {
                style: commonStyle(fillColor, color),
                onEachFeature: (feature, layer) => {
                    layer.bindPopup(createPopupContentMetropolitanas(feature));
                }
            }).addTo(mapRef.current);
        };

        const geoJSONZMVM = (data) => {
            if (!L) return;
            return L.geoJSON(data, {
                style: (feature) => {
                    const colorMap = {
                        "Hidalgo": "#BC955B",
                        "Estado de México": "#691B31",
                        "Ciudad de México": "#3a9680"
                    };
                    const color = colorMap[feature.properties.NOM_ENT] || "orange";
                    return commonStyle(color, color, 2.6);
                },
                onEachFeature: (feature, layer) => {
                    layer.bindPopup(createPopupContentZMVM(feature));
                }
            }).addTo(mapRef.current);
        };

        // Inicializar el mapa solo si Leaflet está cargado
        if (L) {
            mapRef.current = L.map('map', {
                center: [19.6296533, -98.9263916],
                zoom: 9,
                zoomControl: false,
                minZoom: 8,
                maxZoom: 18
            });

            L.tileLayer('http://{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}', {
                maxZoom: 20,
                subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
            }).addTo(mapRef.current);

            mapRef.current.attributionControl.setPrefix('');

            // Condicional para agregar la capa correcta según la zona metropolitana seleccionada
            if (zonaSeleccionada === 'ZMP') {
                geoJSONMetropolitanas(ZMP_Info, '#DEC9A3', '#DEC9A3');
            } else if (zonaSeleccionada === 'ZMTula') {
                geoJSONMetropolitanas(ZMT_Info, '#98989a', '#98989a');
            } else if (zonaSeleccionada === 'ZMTulancingo') {
                geoJSONMetropolitanas(ZMTUL_Info, '#A02142', '#A02142');
            } else if (zonaSeleccionada === 'ZMVM') {
                geoJSONZMVM(zmvm_InfoGeneral);
            }

            setTimeout(() => mapRef.current.invalidateSize(), 300);
        }

        // Limpiar el mapa al desmontar el componente
        return () => {
            if (mapRef.current) {
                mapRef.current.remove();
            }
        };
    }, [L, zonaSeleccionada]); // El efecto depende de Leaflet y la zona seleccionada

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
        setTimeout(() => mapRef.current?.invalidateSize(), 300);
    };

    const toggleFullScreen = () => {
        if (typeof window !== 'undefined') {
            if (!isFullScreen && mapRef.current) {
                mapRef.current.getContainer().requestFullscreen();
            } else if (document.fullscreenElement) {
                document.exitFullscreen();
            }
            setIsFullScreen((prevState) => !prevState);
        }
    };

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const handleFullScreenChange = () => {
                if (!document.fullscreenElement) {
                    setIsFullScreen(false);
                }
            };

            document.addEventListener('fullscreenchange', handleFullScreenChange);
            return () => {
                document.removeEventListener('fullscreenchange', handleFullScreenChange);
            };
        }
    }, []);

    return (
        <section className="mapaConte">
            <div id='map'>
                {/* <button
                    id="toggleSidebar"
                    onClick={toggleSidebar}
                    className={isSidebarOpen ? 'open' : ''}
                >
                    {isSidebarOpen ? 'Cerrar' : 'Abrir panel de información'}
                </button> */}

                <div id="fullscreenButton" onClick={toggleFullScreen}>
                    {isFullScreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
                </div>

                {/* <div id="sidebar" className={isSidebarOpen ? 'open' : ''}>
                    <p className="sidebar-title">Proyectos</p>
                </div> */}
            </div>
            <div className="mapaTxt">
                <h2><span>Explora</span> la <span className="span-doarado">Zona Metropolitana</span> en el <span>Mapa</span> Interactivo</h2>
                <p>Descubre sobre la Zona Metropolitana {getPreposicion(zonaSeleccionada)} {getTituloZona(zonaSeleccionada)}. Haz clic en cada zona para ver datos detallados de los municipios y sus características. ¡Explora ahora!</p>
            </div>
        </section>
    );
};

export default InteractiveMap;
