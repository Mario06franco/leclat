import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import './index.css';

import Navbar from './components/Navbar';
import Footer from './components/footer';
import AuthForm from './components/authForm/AuthForm';
import SidebarMenu from './components/sidebar/SidebarMenu';

import Inicio from './pages/Inicio';
import QuienesSomos from './components/somos/QuienesSomos';
import Servicios from './components/servicios/Servicios';
import HistoriaClinica from './pages/historia/HistoriaClinica';
import ActualizarDatos from './pages/actualizar/ActualizarDatos';
import Tratamientos from './pages/tratamientos/Tratamientos';

import Faciales from './components/servicios/Faciales';
import Corporales from './components/servicios/Corporales';
import Capilares from './components/servicios/Capilares';
import Sueroterapia from './components/servicios/Sueroterapia';

import AgendarCita from './pages/citas/AgendarCita';

import { useUser } from './context/UserContext';

import './App.css';

import AdminLayout from './components/admin/AdminLayout';
import UsuariosAdmin from './components/admin/usuarios/UsuariosAdmin';
import CitasAdmin from './components/admin/CitasAdmin';
import HistoriasAdmin from './components/admin/historias/HistoriasClinicasAdmin';
import ServiciosAdmin from './components/admin/servicios/servicios';
import ResetPassword from './components/password/ResetPassword';

function App() {
  const { usuario, setUsuario } = useUser();
  const navigate = useNavigate();

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [mostrarModalCita, setMostrarModalCita] = useState(false);

  const handleLoginClick = () => {
    setShowAuthModal(true);
  };

  const handleCloseModal = () => {
    setShowAuthModal(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('userToken');
    setUsuario(null);
    console.log('✅ Sesión cerrada');
  };

  const handleAbrirModalCita = () => {
    setMostrarModalCita(true);
  };

  const handleCerrarCita = () => {
    setMostrarModalCita(false);
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUsuario(JSON.parse(storedUser));
    }
  }, [setUsuario]);

  return (
    <div className="app-container">
      {usuario && (
        <SidebarMenu
          onLogout={handleLogout}
          onAgendarCita={handleAbrirModalCita}
          usuario={usuario}
        />
      )}

      <Navbar
        user={usuario}
        onLoginClick={handleLoginClick}
        onLogout={handleLogout}
      />

      <div className="main-content" style={{ marginLeft: usuario ? '60px' : '0' }}>
        <Routes>
          {/* Rutas públicas */}
          <Route path="/" element={<Inicio />} />
          <Route path="/QuienesSomos" element={<QuienesSomos />} />
          <Route path="/servicios" element={<Servicios />} />
          <Route path="/historia-clinica" element={<HistoriaClinica />} />
          <Route path="/actualizar-datos" element={<ActualizarDatos />} />
          <Route path="/tratamientos" element={<Tratamientos />} />
          <Route path="/servicios/faciales" element={<Faciales />} />
          <Route path="/servicios/corporales" element={<Corporales />} />
          <Route path="/servicios/capilares" element={<Capilares />} />
          <Route path="/servicios/sueroterapia" element={<Sueroterapia />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          {/* Rutas de administración */}
          {usuario?.rol === 'admin' && (
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<UsuariosAdmin />} />
              <Route path="usuarios" element={<UsuariosAdmin />} />
              <Route path="citas" element={<CitasAdmin />} />
              <Route path="historias" element={<HistoriasAdmin />} />
              <Route path="servicios" element={<ServiciosAdmin />} />
            </Route>
          )}
        </Routes>

        <Footer />
      </div>

      {showAuthModal && <AuthForm onClose={handleCloseModal} />}
      {mostrarModalCita && <AgendarCita onClose={handleCerrarCita} />}
    </div>
  );
}

export default App;
