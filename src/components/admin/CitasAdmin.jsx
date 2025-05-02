import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './CitasAdmin.css';
import CrearCita from './citaModal'; // Este es tu modal

const CitasAdmin = () => {
  const [citas, setCitas] = useState([]);
  const [pageSize, setPageSize] = useState(50);
  const [loading, setLoading] = useState(false);
  const [filtro, setFiltro] = useState('todas');
  const [modalVisible, setModalVisible] = useState(false);
  const [citaEditando, setCitaEditando] = useState(null);
  const [cedulaInput, setCedulaInput] = useState('');

  const fetchCitas = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token'); // 👈 O sessionStorage si lo guardaste allí
      let url = `http://localhost:5000/api/citas`;
      if (filtro !== 'todas') {
        url += `?estado=${filtro}`;
      }
  
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`, // 👈 Aquí agregamos el token
        },
      });
  
      setCitas(response.data);
    } catch (error) {
      console.error('Error obteniendo citas:', error);
      alert('Error al obtener citas: ' + (error.response?.data?.message || error.message));
    }
    setLoading(false);
  };
  

  useEffect(() => {
    fetchCitas();
  }, [filtro, pageSize]);

  const abrirModal = (cita = null) => {
    console.log('Cita seleccionada para editar:', cita); // Depuración
    setCitaEditando(cita);
    setModalVisible(true);
  };

  const cerrarModal = () => {
    setCitaEditando(null);
    setModalVisible(false);
  };

  const verificarCedula = async () => {
    if (!cedulaInput.trim()) {
      alert('Por favor ingresa una cédula.');
      return;
    }
  
    try {
      const response = await fetch(
        `http://localhost:5000/api/citas/verificar-usuario?cedula=${cedulaInput}`
      );
      const data = await response.json();
  
      if (response.ok && data.usuarios) {
        setCitaEditando({
          nombre: data.usuarios.nombre,
          cedula: data.usuarios.cedula,
        });
        setModalVisible(true);
      } else {
        alert('Usuario no registrado.');
      }
    } catch (error) {
      console.error('Error verificando cédula:', error);
      alert('Usuario no registrado.');
    }
  };

  const handleCancelar = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/citas/${id}/cancelar`);
      fetchCitas();
    } catch (error) {
      console.error('Error cancelando cita:', error);
    }
  };
  
  

  const handleGuardar = () => {
    fetchCitas();               // Actualiza la lista
    setCedulaInput('');         // Limpia el buscador
    setModalVisible(false);     // Cierra modal
    setCitaEditando(null);      // Limpia estado
  };

  const handleActivar = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/citas/${id}/activar`);
      fetchCitas();
    } catch (error) {
      console.error('Error activando cita:', error);
      alert('Error al activar la cita.');
    }
  };
  
  
  
  return (
    <div className="usuarios-admin">
      <h2>Gestión de Citas</h2>

      <div className="filtros">
        <button onClick={() => setFiltro('todas')}>Todas</button>
        <button onClick={() => setFiltro('activa')}>Activas</button>
        <button onClick={() => setFiltro('cancelada')}>Canceladas</button>
      </div>

      <div className="toolbar">
      <input
    type="text"
    placeholder="Cédula"
    value={cedulaInput}
    onChange={(e) => setCedulaInput(e.target.value)}
    className="cedula-input"
  />
  <button onClick={verificarCedula}>Crear Cita</button>
        <div className="page-size-selector">
          Ver:
          <select onChange={(e) => setPageSize(Number(e.target.value))} value={pageSize}>
            <option value={50}>50</option>
            <option value={100}>100</option>
            <option value={200}>200</option>
          </select>
        </div>
      </div>

      {loading ? (
        <p className="loading">Cargando citas...</p>
      ) : (
        <table className="usuarios-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Cédula</th>
              <th>Servicio</th>
              <th>Fecha</th>
              <th>Hora</th>
              <th>Estado</th>
              <th>Limitación</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {citas.length > 0 ? (
              citas.map((cita) => (
                <tr key={cita._id}>
                  <td>{cita.nombre || '—'}</td>
                  <td>{cita.cedula || '—'}</td>
                  <td>{cita.servicio || '—'}</td>
                  <td>{cita.fecha || '—'}</td>
                  <td>{cita.hora || '—'}</td>
                  <td>{cita.estado || '—'}</td>
                  <td>{cita.limitacion || '—'}</td>
                  <td>
                    <button onClick={() => abrirModal(cita)}>Editar</button>
                    
                    {cita.estado === 'activa' && (
                      <button onClick={() => handleCancelar(cita._id)}>Cancelar</button>
                    )}

                    {cita.estado === 'cancelada' && (
                      <button onClick={() => handleActivar(cita._id)}>Activar</button>
                    )}  
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8">No se encontraron citas.</td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      {modalVisible && (
        <CrearCita
          citaSeleccionada={citaEditando} // Pasa la cita seleccionada
          onGuardar={handleGuardar} // Maneja guardar o editar
          onCancelar={cerrarModal} // Cierra el modal
        />
      )}
    </div>
  );
};

export default CitasAdmin;