"use client";
import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Preloader from '@/components/shared/Preloader';
import dashboardStyles from './Dashboard.module.css';

const DashboardCharts = dynamic(() => import('./DashboardCharts'), { loading: () => <Preloader />, ssr: false });
const Formulario = dynamic(() => import('../forms/CreateFormulario'), { loading: () => <Preloader />, ssr: false });
const Acuerdos = dynamic(() => import('../crud-table/coordinador/CRUDTable'), { loading: () => <Preloader />, ssr: false });
const TableResponsable = dynamic(() => import('../crud-table/responsable/TableResponsable'), { loading: () => <Preloader />, ssr: false });
const TableEnlace = dynamic(() => import('../crud-table/enlace/TableEnlace'), { loading: () => <Preloader />, ssr: false });
const Headerdashboard = dynamic(() => import('./HeaderDashboard'), { loading: () => <Preloader />, ssr: false });
const SvgIcon = dynamic(() => import('@/components/shared/SvgIcon'), { loading: () => <Preloader />, ssr: false });
const ConfirmationModal = dynamic(() => import('@/components/shared/LogoutModal'), { loading: () => <Preloader />, ssr: false });
const Minutas = dynamic(() => import('./Minutas'), { loading: () => <Preloader />, ssr: false });


const Dashboard = () => {
  const [activeComponent, setActiveComponent] = useState('');
  const [userRole, setUserRole] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Obtener el rol del usuario desde el almacenamiento local
    const role = localStorage.getItem('userRole');
    setUserRole(role);

    const listItemClass = dashboardStyles["list-item"];
    const activeClass = dashboardStyles.active;
    const toggleClass = dashboardStyles.toggle;
    const sidebarClass = dashboardStyles.sidebar;
    const listItems = document.querySelectorAll(`.${listItemClass}`);
    listItems.forEach((item) => {
      item.addEventListener('click', () => {
        listItems.forEach((li) => li.classList.remove(activeClass));
        item.classList.add(activeClass);
      });
    });

    const toggleBtn = document.querySelector(`.${toggleClass}`);
    const sidebar = document.querySelector(`.${sidebarClass}`);

    sidebar?.classList.add(activeClass);
    toggleBtn?.classList.add(activeClass);

    if (toggleBtn && sidebar) {
      toggleBtn.onclick = () => {
        toggleBtn.classList.toggle(activeClass);
        sidebar.classList.toggle(activeClass);
      };
    }
  }, []);

  const handleMenuClick = (componentName) => {
    setActiveComponent(componentName);
    // Actualizar la clase active para el elemento del menú seleccionado
    const listItems = document.querySelectorAll(`.${dashboardStyles["list-item"]}`);
    listItems.forEach((li) => li.classList.remove(dashboardStyles.active));
    document.querySelector(`[data-component="${componentName}"]`)?.classList.add(dashboardStyles.active);
  };

  const handleLogoutClick = () => {
    setIsModalOpen(true);
  };

  const handleConfirmLogout = () => {
    setIsModalOpen(false);
    window.location.href = '/';
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const renderContent = () => {
    switch (activeComponent) {
      case 'minutas':
        return <Minutas />;
      case 'formulario':
        return <Formulario />;
      case 'acuerdosCoordinador':
        return <Acuerdos />;
      case 'acuerdosResponsable':
        return <TableResponsable />;
      case 'acuerdosEnlace':
        return <TableEnlace />;
      case 'dashboardCharts':
        return <DashboardCharts />;
      default:
        return <h1>DASHBOARD</h1>;
    }
  };

  return (
    <div className={dashboardStyles["dashboard-wrapper"]}>
      <div className={`${dashboardStyles["sidebar"]} ${dashboardStyles["active"]}`}>
        <div className={`${dashboardStyles["toggle"]} ${dashboardStyles["active"]}`}></div>
        <ul className={dashboardStyles["list"]}>
          {userRole === 'coordinador' && (
            <li className={dashboardStyles["list-item"]} data-component="dashboardCharts" onClick={() => handleMenuClick('dashboardCharts')}>
              <b></b>
              <b></b>
              <a href="#" className={dashboardStyles["list-item-link"]}>
                <div className={dashboardStyles["icon"]}>
                  <SvgIcon name="dashboard" />
                </div>
                <span className={dashboardStyles["title"]}>Dashboard</span>
              </a>
            </li>
          )}
          {userRole === 'coordinador' && (
            <li className={dashboardStyles["list-item"]} data-component="minutas" onClick={() => handleMenuClick('minutas')}>
              <b></b>
              <b></b>
              <a href="#" className={dashboardStyles["list-item-link"]}>
                <div className={dashboardStyles["icon"]}>
                  <SvgIcon name="dashboard" />
                </div>
                <span className={dashboardStyles["title"]}>Minutas</span>
              </a>
            </li>
          )}
          {userRole === 'coordinador' && (
            <li className={dashboardStyles["list-item"]} data-component="formulario" onClick={() => handleMenuClick('formulario')}>
              <b></b>
              <b></b>
              <a href="#" className={dashboardStyles["list-item-link"]}>
                <div className={dashboardStyles["icon"]}>
                  <SvgIcon name="formulario" />
                </div>
                <span className={dashboardStyles["title"]}>Formulario</span>
              </a>
            </li>
          )}
          {userRole === 'coordinador' && (
            <li className={dashboardStyles["list-item"]} data-component="acuerdosCoordinador" onClick={() => handleMenuClick('acuerdosCoordinador')}>
              <b></b>
              <b></b>
              <a href="#" className={dashboardStyles["list-item-link"]}>
                <div className={dashboardStyles["icon"]}>
                  <SvgIcon name="acuerdo" />
                </div>
                <span className={dashboardStyles["title"]}>Acuerdos</span>
                <span className={dashboardStyles["sub-title"]}>coordinador</span>
              </a>
            </li>
          )}
          {userRole === 'responsable' && (
            <li
              className={dashboardStyles["list-item"]}
              data-component="acuerdosResponsable"
              onClick={() => handleMenuClick('acuerdosResponsable')}
            >
              <b></b>
              <b></b>
              <a href="#" className={dashboardStyles["list-item-link"]}>
                <div className={dashboardStyles["icon"]}>
                  <SvgIcon name="acuerdo" />
                </div>
                <span className={dashboardStyles["title"]}>Acuerdos</span>
                <span className={dashboardStyles["sub-title"]}>responsable</span>
              </a>
            </li>
          )}
          {userRole === 'enlace' && (
            <li
              className={dashboardStyles["list-item"]}
              data-component="acuerdosEnlace"
              onClick={() => handleMenuClick('acuerdosEnlace')}
            >
              <b></b>
              <b></b>
              <a href="#" className={dashboardStyles["list-item-link"]}>
                <div className={dashboardStyles["icon"]}>
                  <SvgIcon name="acuerdo" />
                </div>
                <span className={dashboardStyles["title"]}>Acuerdos</span>
                <span className={dashboardStyles["sub-title"]}>enlace</span>
              </a>
            </li>
          )}
        </ul>

        <div className={dashboardStyles["sidebar-card"]}>
          <div className={dashboardStyles["sidebarCardImg"]}>
            <img src="/img/sidebarRecurso.png" alt="Icono de Cerrar Sesión" />
          </div>
          <button onClick={handleLogoutClick}>
            <img src="/img/iconos/exit.png" alt="Icono de Cerrar Sesión" className={dashboardStyles["icon"]} />
            Cerrar Sesión
          </button>
        </div>
      </div>

      <div className={dashboardStyles["dashboard-container"]} data-dashboard-container>
        {/* <header className={dashboardStyles["header"]}>
          <input type="text" placeholder="Search..." className={dashboardStyles["search-bar"]} />
        </header> */}
        <Headerdashboard />
        <section className={dashboardStyles["content"]}>
          {renderContent()}
        </section>
      </div>

      <ConfirmationModal isOpen={isModalOpen} onClose={handleCloseModal} onConfirm={handleConfirmLogout} />
    </div>
  );
};

export default Dashboard;
