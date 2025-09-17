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
import Relajantes from './components/servicios/Relajantes';

import AgendarCita from './pages/citas/AgendarCita';

import { useUser } from './context/UserContext';

import './App.css';

import AdminLayout from './components/admin/AdminLayout';
import UsuariosAdmin from './components/admin/usuarios/UsuariosAdmin';
import CitasAdmin from './components/admin/CitasAdmin';
import HistoriasAdmin from './components/admin/historias/HistoriasClinicasAdmin';
import ServiciosAdmin from './components/admin/servicios/servicios';
import ResetPassword from './components/password/ResetPassword';

// Importar debug solo en desarrollo
if (import.meta.env.VITE_ENVIRONMENT === 'development') {
  import('./utils/debug.js').then(({ debugEnv, showDebugInfo }) => {
    debugEnv();
    showDebugInfo();
    
    // Hacer funciones disponibles globalmente
    window.debugEnv = debugEnv;
    window.testConnection = testConnection;
    window.testAllUrls = testAllUrls;
  });
}

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
    // Limpiar todos los datos de autenticación
    localStorage.removeItem('user');
    localStorage.removeItem('userToken');
    localStorage.removeItem('authTimestamp');
    
    // Limpiar el estado de usuario
    setUsuario(null);
    
    // Redirigir a la página de inicio
    navigate('/');
    
    console.log('✅ Sesión cerrada correctamente');
    
    // Debug info en desarrollo
    if (import.meta.env.VITE_ENVIRONMENT === 'development') {
      console.log('🔍 Debug: User logged out');
    }
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
      try {
        const userData = JSON.parse(storedUser);
        setUsuario(userData);
        
        // Debug info en desarrollo
        if (import.meta.env.VITE_ENVIRONMENT === 'development') {
          console.log('🔍 Debug: User loaded from localStorage', userData);
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('user');
      }
    }

    const abrirModal = () => setShowAuthModal(true);
    document.addEventListener('abrir-modal-auth', abrirModal);

    // Debug info al cargar la aplicación
    if (import.meta.env.VITE_ENVIRONMENT === 'development') {
      console.log('🚀 Aplicación iniciada');
      console.log('📋 Entorno:', import.meta.env.VITE_ENVIRONMENT);
      console.log('🌐 Backend URL:', import.meta.env.VITE_BACKEND_URL);
      console.log('☁️ Vercel URL:', import.meta.env.VITE_VERCEL_URL);
    }

    return () => {
      document.removeEventListener('abrir-modal-auth', abrirModal);
    };
  }, [setUsuario]);

  // Función para probar conexión manualmente
  const testConnection = async () => {
    if (import.meta.env.VITE_ENVIRONMENT === 'development') {
      const { testConnection: testConn } = await import('./utils/debug.js');
      return testConn();
    }
    return { success: false, message: 'Debug solo disponible en desarrollo' };
  };

  // Función para probar todas las URLs
  const testAllUrls = async () => {
    if (import.meta.env.VITE_ENVIRONMENT === 'development') {
      const { testAllUrls: testUrls } = await import('./utils/debug.js');
      return testUrls();
    }
    return { success: false, message: 'Debug solo disponible en desarrollo' };
  };

  return (
    <div className="app-container">
      {/* Debug Panel solo en desarrollo */}
      {import.meta.env.VITE_ENVIRONMENT === 'development' && (
        <div style={{
          position: 'fixed',
          top: '10px',
          left: '10px',
          background: '#ff4757',
          color: 'white',
          padding: '5px 10px',
          borderRadius: '3px',
          fontSize: '12px',
          zIndex: 9998,
          opacity: 0.9,
          cursor: 'pointer'
        }}
        onClick={() => {
          if (window.debugEnv) window.debugEnv();
          if (window.testConnection) window.testConnection();
        }}
        title="Click para debug"
        >
          🚧 {import.meta.env.VITE_ENVIRONMENT?.toUpperCase()}
        </div>
      )}

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
          <Route path="/servicios/Relajantes" element={<Relajantes />} />
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

          {/* Ruta de debug para desarrollo */}
          {import.meta.env.VITE_ENVIRONMENT === 'development' && (
            <Route path="/debug" element={
              <div style={{ padding: '20px' }}>
                <h2>🛠️ Panel de Debug</h2>
                <button onClick={() => testConnection()}>
                  Probar Conexión
                </button>
                <button onClick={() => testAllUrls()} style={{ marginLeft: '10px' }}>
                  Probar Todas URLs
                </button>
                <pre style={{ background: '#f4f4f4', padding: '10px', marginTop: '10px' }}>
                  {JSON.stringify({
                    environment: import.meta.env.VITE_ENVIRONMENT,
                    backendUrl: import.meta.env.VITE_BACKEND_URL,
                    vercelUrl: import.meta.env.VITE_VERCEL_URL,
                    user: usuario
                  }, null, 2)}
                </pre>
              </div>
            } />
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