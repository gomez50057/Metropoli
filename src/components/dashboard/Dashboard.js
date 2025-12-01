"use client";
import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Preloader from '../shared/Preloader';
import '../shared/Preloader.css';
import './Dashboard.css';

const DashboardCharts = dynamic(() => import('./DashboardCharts'), { loading: () => <Preloader />, ssr: false });
const Formulario = dynamic(() => import('../forms/CreateFormulario'), { loading: () => <Preloader />, ssr: false });
const Acuerdos = dynamic(() => import('../CRUDTable/coordinador/CRUDTable'), { loading: () => <Preloader />, ssr: false });
const TableResponsable = dynamic(() => import('../CRUDTable/responsable/TableResponsable'), { loading: () => <Preloader />, ssr: false });
const TableEnlace = dynamic(() => import('../CRUDTable/enlace/TableEnlace'), { loading: () => <Preloader />, ssr: false });
const Headerdashboard = dynamic(() => import('./HeaderDashboard'), { loading: () => <Preloader />, ssr: false });
const SvgIcon = dynamic(() => import('../shared/SvgIcon'), { loading: () => <Preloader />, ssr: false });
const ConfirmationModal = dynamic(() => import('../shared/LogoutModal'), { loading: () => <Preloader />, ssr: false });
const Minutas = dynamic(() => import('./Minutas'), { loading: () => <Preloader />, ssr: false });


const Dashboard = () => {
  const [activeComponent, setActiveComponent] = useState('');
  const [userRole, setUserRole] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Obtener el rol del usuario desde el almacenamiento local
    const role = localStorage.getItem('userRole');
    setUserRole(role);

    const listItems = document.querySelectorAll('.list-item');
    listItems.forEach((item) => {
      item.addEventListener('click', () => {
        listItems.forEach((li) => li.classList.remove('active'));
        item.classList.add('active');
      });
    });

    const toggleBtn = document.querySelector('.toggle');
    const sidebar = document.querySelector('.sidebar');

    sidebar.classList.add('active');
    toggleBtn.classList.add('active');

    toggleBtn.onclick = () => {
      toggleBtn.classList.toggle('active');
      sidebar.classList.toggle('active');
    };
  }, []);

  const handleMenuClick = (componentName) => {
    setActiveComponent(componentName);
    // Actualizar la clase active para el elemento del menú seleccionado
    const listItems = document.querySelectorAll('.list-item');
    listItems.forEach((li) => li.classList.remove('active'));
    document.querySelector(`[data-component=${componentName}]`).classList.add('active');
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
    <div className="dashboard-wrapper">
      <div className="sidebar active">
        <div className="toggle active"></div>
        <ul className="list">
          {userRole === 'coordinador' && (
            <li className="list-item" data-component="dashboardCharts" onClick={() => handleMenuClick('dashboardCharts')}>
              <b></b>
              <b></b>
              <a href="#" className="list-item-link">
                <div className="icon">
                  <SvgIcon name="dashboard" />
                </div>
                <span className="title">Dashboard</span>
              </a>
            </li>
          )}
          {userRole === 'coordinador' && (
            <li className="list-item" data-component="minutas" onClick={() => handleMenuClick('minutas')}>
              <b></b>
              <b></b>
              <a href="#" className="list-item-link">
                <div className="icon">
                  <SvgIcon name="dashboard" />
                </div>
                <span className="title">Minutas</span>
              </a>
            </li>
          )}
          {userRole === 'coordinador' && (
            <li className="list-item" data-component="formulario" onClick={() => handleMenuClick('formulario')}>
              <b></b>
              <b></b>
              <a href="#" className="list-item-link">
                <div className="icon">
                  <SvgIcon name="formulario" />
                </div>
                <span className="title">Formulario</span>
              </a>
            </li>
          )}
          {userRole === 'coordinador' && (
            <li className="list-item" data-component="acuerdosCoordinador" onClick={() => handleMenuClick('acuerdosCoordinador')}>
              <b></b>
              <b></b>
              <a href="#" className="list-item-link">
                <div className="icon">
                  <SvgIcon name="acuerdo" />
                </div>
                <span className="title">Acuerdos</span>
                <span className="sub-title">coordinador</span>
              </a>
            </li>
          )}
          {userRole === 'responsable' && (
            <li
              className="list-item"
              data-component="acuerdosResponsable"
              onClick={() => handleMenuClick('acuerdosResponsable')}
            >
              <b></b>
              <b></b>
              <a href="#" className="list-item-link">
                <div className="icon">
                  <SvgIcon name="acuerdo" />
                </div>
                <span className="title">Acuerdos</span>
                <span className="sub-title">responsable</span>
              </a>
            </li>
          )}
          {userRole === 'enlace' && (
            <li
              className="list-item"
              data-component="acuerdosEnlace"
              onClick={() => handleMenuClick('acuerdosEnlace')}
            >
              <b></b>
              <b></b>
              <a href="#" className="list-item-link">
                <div className="icon">
                  <SvgIcon name="acuerdo" />
                </div>
                <span className="title">Acuerdos</span>
                <span className="sub-title">enlace</span>
              </a>
            </li>
          )}
        </ul>

        <div className="sidebar-card">
          <div className="sidebarCardImg">
            <img src="/img/sidebarRecurso.png" alt="Icono de Cerrar Sesión" />
          </div>
          <button onClick={handleLogoutClick}>
            <img src="/img/iconos/exit.png" alt="Icono de Cerrar Sesión" className="icon" />
            Cerrar Sesión
          </button>
        </div>
      </div>

      <div className="dashboard-container">
        {/* <header className="header">
          <input type="text" placeholder="Search..." className="search-bar" />
        </header> */}
        <Headerdashboard />
        <section className="content">
          {renderContent()}
        </section>
      </div>

      <ConfirmationModal isOpen={isModalOpen} onClose={handleCloseModal} onConfirm={handleConfirmLogout} />
    </div>
  );
};

export default Dashboard;
