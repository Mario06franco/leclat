// Servicios.jsx
import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import axios from 'axios';
import CrearServicioModal from './CrearServicioModal';
import './servicios.css';

const Servicios = () => {
  const [servicios, setServicios] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchServicios = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/servicios`);
        if (response.data.success && Array.isArray(response.data.data)) {
          setServicios(response.data.data);
        } else if (Array.isArray(response.data)) {
          setServicios(response.data);
        } else {
          throw new Error('Formato de respuesta inválido');
        }
      } catch (error) {
        setError(error.response?.data?.message || error.message || 'Error al cargar servicios');
      } finally {
        setLoading(false);
      }
    };

    fetchServicios();
  }, []);

  const handleCreateServicio = (servicioCreado) => {
  setServicios(prev => [...prev, servicioCreado]);
  setShowModal(false);
  setError(null);
};

  

  return (
    <div className="admin-panel">
      <div className="panel-header">
        <h2>Gestión de Servicios</h2>
        <button className="btn-crear" onClick={() => setShowModal(true)}>
          <FaPlus /> Crear Servicio
        </button>
      </div>

      {error && (
        <div className="error-banner">
          <p>❌ {error}</p>
          <button onClick={() => setError(null)}>×</button>
        </div>
      )}

      <div className="filtros">
        <button className="filtro-btn active">Todos</button>
        <button className="filtro-btn">Activos</button>
        <button className="filtro-btn">Inactivos</button>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Cargando servicios...</p>
        </div>
      ) : (
        <div className="tabla-container">
          <table className="tabla-servicios">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Precio</th>
                <th>Duración</th>
                <th>Categoría</th>
                <th>Descripción</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {servicios.map((servicio) => (
                <tr key={servicio._id || servicio.id_servicio}>
                  <td>{servicio.id_servicio}</td>
                  <td>{servicio.nombre}</td>
                  <td>${servicio.precio?.toLocaleString() || '0'}</td>
                  <td>{servicio.duracion}</td>
                  <td>
                    <span className={`categoria-badge ${servicio.categoria}`}>
                      {servicio.categoria}
                    </span>
                  </td>
                  <td className="descripcion-cell">
                    {servicio.descripcion?.substring(0, 50)}...
                  </td>
                  <td>
                    <span className={`estado-badge ${servicio.activo ? 'activo' : 'inactivo'}`}>
                      {servicio.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td>
                    <button className="btn-accion editar"><FaEdit /></button>
                    <button className="btn-accion eliminar"><FaTrash /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <CrearServicioModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onCreate={handleCreateServicio}
      />
    </div>
  );
};

export default Servicios;
