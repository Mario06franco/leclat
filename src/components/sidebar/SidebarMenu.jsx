import React from 'react';
import { Link } from 'react-router-dom';
import './SidebarMenu.css';
import {
  FiFolder,
  FiEdit,
  FiUser,
  FiCalendar,
  FiLogOut,
  FiShield}
  from 'react-icons/fi';

function SidebarMenu({ onLogout, onAgendarCita, usuario }) {
  return (
    <div className="sidebar">
      <Link to="/historia-clinica" className="sidebar-icon" title="Historia Clínica">
        <FiFolder />
      </Link>

      <Link to="/actualizar-datos" className="sidebar-icon" title="Actualizar Datos">
        <FiEdit />
      </Link>

      <Link to="/tratamientos" className="sidebar-icon" title="Tratamientos">
        <FiUser />
      </Link>

      <button className="sidebar-icon" color='transparent' onClick={onAgendarCita} title="Agendar Cita">
        <FiCalendar />
      </button>

      <button className="sidebar-icon logout" onClick={onLogout}  title="Cerrar sesión">
        <FiLogOut />
      </button>

      {/* Mostrar ícono de Admin solo si el usuario tiene rol 'admin' */}
      {usuario?.rol === 'admin' && (
        <Link to="../Admin" className="sidebar-icon" title="Administrador">
          <FiShield />
        </Link>
      )}
    </div>
  );
}

export default SidebarMenu;
