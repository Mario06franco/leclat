import React from 'react';
import { Navigate, Outlet, NavLink } from 'react-router-dom';
import { useUser } from '../../context/UserContext'; // importa tu contexto
import './AdminLayout.css';

const AdminLayout = () => {
  const { usuario } = useUser();

  // Si no hay usuario o no es admin, redirigir al home
  if (!usuario || usuario?.rol !== 'admin') {
    return <Navigate to="/" />;
  }

  return (
    <div className="admin-layout">
      <header className="admin-navbar">
        <h2 className="logo-admin">Panel Admin</h2>
        <nav className="admin-nav">
          <NavLink to="usuarios">Usuarios</NavLink>
          <NavLink to="citas">Citas</NavLink>
          <NavLink to="historias">Historias Clínicas</NavLink>
          <NavLink to="/admin/tratamientos">Tratamientos</NavLink>
          <NavLink to="/admin/servicios">Servicios</NavLink>
          <NavLink to="/admin/productos">Productos</NavLink>
        </nav>
      </header>

      <main className="admin-main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
