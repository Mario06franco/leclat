import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import CrearServicioModal from './CrearServicioModal';
import './servicios.css';
const backendUrl = import.meta.env.VITE_BACKEND_URL;

const Servicios = () => {
  const [servicios, setServicios] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

// En servicios.jsx, actualiza el useEffect:
useEffect(() => {
    const fetchServicios = async () => {
      try {
        const response = await fetch(`${backendUrl}/api/servicios`);
        if (!response.ok) throw new Error('Error al obtener servicios');
        const data = await response.json();
        setServicios(data.data);
      } catch (error) {
        console.error('Error al cargar servicios:', error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchServicios();
  }, []);
  
  // Y en handleCreateServicio:
  const handleCreateServicio = async (nuevoServicio) => {
    try {
      const response = await fetch('/api/servicios', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(nuevoServicio)
      });
      
      if (!response.ok) throw new Error('Error al crear servicio');
      
      const data = await response.json();
      setServicios([...servicios, data.data]);
      setShowModal(false);
    } catch (error) {
      console.error('Error:', error);
      // Mostrar mensaje de error al usuario
    }
  };

  return (
    <div className="admin-panel">
      <div className="panel-header">
        <h2>Gestión de Servicios</h2>
        <button 
          className="btn-crear"
          onClick={() => setShowModal(true)}
        >
          <FaPlus /> Crear Servicio
        </button>
      </div>

      <div className="filtros">
        <button className="filtro-btn active">Todos</button>
        <button className="filtro-btn">Activos</button>
        <button className="filtro-btn">Inactivos</button>
      </div>

      {loading ? (
        <p>Cargando servicios...</p>
      ) : (
        <div className="tabla-container">
          <table className="tabla-servicios">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Precio</th>
                <th>Duración</th>
                <th>Descripción</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
  {servicios.map((servicio) => (
    <tr key={servicio.id_servicio}>
      <td>{servicio.id_servicio}</td>
      <td>{servicio.nombre}</td>
      <td>${servicio.precio.toLocaleString()}</td>
      <td>{servicio.duracion}</td>
      <td className="descripcion-cell">{servicio.descripcion}</td>
      <td>
        <span className={`estado-badge ${servicio.activo ? 'activo' : 'inactivo'}`}>
          {servicio.activo ? 'Activo' : 'Inactivo'}
        </span>
      </td>
      <td>
        <button className="btn-accion editar">
          <FaEdit />
        </button>
        <button className="btn-accion eliminar">
          <FaTrash />
        </button>
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