"use client";

import React, { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation'; // Hook para obtener la ruta actual
import styles from './Navbar.module.css';

const LOGOS = [
  { src: "/img/escudos/Coordinaci%C3%B3n.webp", alt: "Logo de Coordinación" },
  { src: "/img/headertxt.webp", alt: "Logo de Metropoli Hidalgo" },
];

const NAV_ITEMS = [
  { label: "Inicio", href: "/" },

  {
    label: "Zonas Metropolitanas",
    children: [
      {
        label: "Pachuca",
        href: "/zm-pachuca",
        children: [
          { label: "PIMUS", href: "/pimus" },
          { label: "Imagen Urbana ZMP", href: "/pmiu-zmp" },
        ],
      },
      {
        label: "Tulancingo",
        href: "/zm-tulanciongo",
        // Submenú oculto temporalmente.
        /* children: [
          {
            label: "Se está creando la historia",
            href: "/buenas-practicas-metropolitanas",
          },
        ], */
      },
      {
        label: "Valle de México",
        href: "/zmvm",
        children: [{ label: "POZMVM", href: "/actualizacion-pozmvm" }],
      },
    ],
  },
  { label: "Noticias", href: "/noticias" },
  { label: "Acceder", href: "/acuerdos-metropolitanos" },
];

/**
 * Navbar: Componente principal que representa la barra de navegación.
 */
const Navbar = () => {
  const [isVisible, setIsVisible] = useState(true); // Controla la visibilidad del navbar en scroll
  const [menuOpen, setMenuOpen] = useState(false); // Controla el estado del menú en mobile
  const [openMenus, setOpenMenus] = useState({});
  const lastScrollPos = useRef(0); // Referencia para guardar el último scroll
  const navRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const pathname = usePathname(); // Hook para detectar cambios de ruta

  /**
   * Hook: Controla la visibilidad de la navbar en base al scroll del usuario.
   */
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.pageYOffset;
      setIsVisible(currentScrollPos < lastScrollPos.current || currentScrollPos < 10);
      lastScrollPos.current = currentScrollPos;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /**
   * Hook: Cierra el menú y el submenu al cambiar de página.
   */
  useEffect(() => {
    setMenuOpen(false);
    setOpenMenus({});
  }, [pathname]);

  useEffect(() => {
    const closeMenus = (event) => {
      if (event.type === "keydown" && event.key !== "Escape") return;
      if (event.type === "pointerdown" &&
        (navRef.current?.contains(event.target) || mobileMenuRef.current?.contains(event.target))) return;
      setMenuOpen(false);
      setOpenMenus({});
    };
    document.addEventListener("pointerdown", closeMenus);
    document.addEventListener("keydown", closeMenus);
    return () => {
      document.removeEventListener("pointerdown", closeMenus);
      document.removeEventListener("keydown", closeMenus);
    };
  }, []);

  /**
   * toggleMenu: Alterna el menú principal en mobile.
   */
  const toggleMenu = useCallback(() => setMenuOpen(prev => !prev), []);

  /**
   * toggleSubmenu: Alterna el submenu en mobile.
   */
  const toggleSubmenu = useCallback((path) => {
    setOpenMenus((current) => ({ ...current, [path]: !current[path] }));
  }, []);

  /**
   * handleLinkClick: Cierra el menú y submenu en mobile después de hacer clic en un enlace.
   */
  const handleLinkClick = () => {
    setMenuOpen(false);
    setOpenMenus({});
  };

  /**
   * renderNavItems: Renderiza el menú de navegación para desktop y mobile.
   * @param {boolean} isMobile - Determina si el renderizado es para mobile o desktop.
   */
  const renderNavItems = (items, isMobile = false, parentPath = "") => (
    <ul
      id={parentPath ? `navbar-${isMobile ? "mobile" : "desktop"}-${parentPath}` : undefined}
      className={parentPath ? styles.dropdownMenu : isMobile ? styles.navbarOpcMobile : styles.navbarOpcDesktop}
    >
      {items.map((item, index) => {
        const path = parentPath ? `${parentPath}-${index}` : `${index}`;
        const hasChildren = item.children?.length > 0;

        return (
          <li
            key={item.label}
            className={`${hasChildren ? styles.dropdown : ""} ${openMenus[path] ? styles.dropdownOpen : ""}`}
          >
            {hasChildren ? (
              <>
                <div className={styles.dropdownRow}>
                  {item.href && (
                    <Link href={item.href} onClick={handleLinkClick}>
                      {item.label}
                    </Link>
                  )}
                  <button
                    type="button"
                    className={`${styles.dropdownToggle} ${item.href ? styles.submenuToggle : ""}`}
                    onClick={() => toggleSubmenu(path)}
                    aria-expanded={Boolean(openMenus[path])}
                    aria-controls={`navbar-${isMobile ? "mobile" : "desktop"}-${path}`}
                    aria-label={item.href ? `Opciones de ${item.label}` : undefined}
                  >
                    {!item.href && item.label}
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </button>
                </div>
                {renderNavItems(item.children, isMobile, path)}
              </>
            ) : (
              <Link
                href={item.href}
                onClick={handleLinkClick}
                target={item.external ? "_blank" : "_self"}
                rel={item.external ? "noopener noreferrer" : undefined}
              >
                {item.label}
              </Link>
            )}
          </li>
        );
      })}
    </ul>
  );

  return (
    <>
      {/* Navbar principal */}
      <nav
        ref={navRef}
        aria-label="Navegación principal"
        className={`${styles.Navbar} 
          ${isVisible || menuOpen ? styles.active : styles.hidden}
          ${lastScrollPos.current > 100 ? styles.scrolled : ''}
        `}
      >
        <div className={styles.NavbarList}>
          {/* Logos de la navbar */}
          <div className={styles.NavbarImg}>
            {LOGOS.map((logo, index) => (
              <img key={index} src={logo.src} alt={logo.alt} />
            ))}
          </div>

          {/* Menú de navegación */}
          <div className={styles.NavbarInicio}>
            {/* Botón hamburguesa visible solo en mobile */}
            <button
              type="button"
              className={styles.NavbarCirculo}
              onClick={toggleMenu}
              aria-expanded={menuOpen}
              aria-controls="navbar-mobile-menu"
              aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
            >
              <img src="/img/estrella.webp" alt="" />
            </button>
            {/* Menú horizontal para desktop */}
            {renderNavItems(NAV_ITEMS)}
          </div>
        </div>
      </nav>

      {/* Menú desplegable para mobile */}
      <div
        ref={mobileMenuRef}
        id="navbar-mobile-menu"
        inert={!menuOpen}
        className={`${styles.NavbarMenuContainer} ${menuOpen ? styles.menuOpen : ''}`}
      >
        {renderNavItems(NAV_ITEMS, true)}
      </div>
    </>
  );
};

export default Navbar;
