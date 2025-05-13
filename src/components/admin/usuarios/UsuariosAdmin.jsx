// src/components/usuarios/UsuariosAdmin.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CrearUsuario from './CrearUsuario';
import './UsuariosAdmin.css';


const UsuariosAdmin = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [pageSize, setPageSize] = useState(50);
  const [loading, setLoading] = useState(false);
  const [filtro, setFiltro] = useState('todos');
  const [modalVisible, setModalVisible] = useState(false);
  const [usuarioEditando, setUsuarioEditando] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    cedula: '',
    celular: '',
    correo: '',
    rol: 'usuario',
    estado: true,
    contraseña: ''
  });

  const fetchUsuarios = async () => {
    setLoading(true);
    try {
      let url = `${import.meta.env.VITE_BACKEND_URL}/api/usuarios?pageSize=${pageSize}`;
      if (filtro === 'habilitado') url += '&estado=true';
      if (filtro === 'deshabilitado') url += '&estado=false';

      const response = await axios.get(url);
      setUsuarios(response.data);
    } catch (error) {
      console.error('Error obteniendo usuarios:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsuarios();
  }, [filtro, pageSize]);

  const abrirModal = (usuario = null) => {
    setUsuarioEditando(usuario);
    setFormData(
      usuario || {
        nombre: '',
        cedula: '',
        celular: '',
        correo: '',
        rol: 'usuario',
        estado: true,
        contraseña: ''
      }
    );
    setModalVisible(true);
  };

  const cerrarModal = () => {
    setUsuarioEditando(null);
    setModalVisible(false);
  };

  const handleGuardar = async () => {
    try {
      if (usuarioEditando) {
        await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/usuarios/${usuarioEditando._id}`, formData);
      } else {
        const nuevoUsuario = { ...formData, contraseña: formData.cedula };
        await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/usuarios`, nuevoUsuario);
      }
      fetchUsuarios();
      setModalVisible(false);
      return true;
    } catch (error) {
      console.error('Error guardandadadadado usuario:', error);
      alert('Error al guardar usuario o aca : ' + error.message);
      return false;
    }
  };

  const handleDeshabilitar = async (id) => {
    try {
      await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/usuarios/${id}/deshabilitar`);
      fetchUsuarios();
    } catch (error) {
      console.error('Error deshabilitando usuario:', error);
    }
  };

  const handleHabilitar = async (id) => {
    try {
      await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/usuarios/${id}/habilitar`);
      fetchUsuarios();
    } catch (error) {
      console.error('Error habilitando usuario:', error);
    }
  };

  const usuariosFiltrados = usuarios.filter((usuario) => {
    if (filtro === 'habilitado') return usuario.estado === true;
    if (filtro === 'deshabilitado') return usuario.estado === false;
    return true;
  });

  return (
    <div className="usuarios-admin">
      <h2>Gestión de Usuarios</h2>

      <div className="filtros">
        <button onClick={() => setFiltro('todos')}>Todos</button>
        <button onClick={() => setFiltro('habilitado')}>Habilitados</button>
        <button onClick={() => setFiltro('deshabilitado')}>Deshabilitados</button>
      </div>

      <div className="toolbar">
        <button onClick={() => abrirModal()}>Crear Usuario</button>
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
        <p className="loading">Cargando usuarios...</p>
      ) : (
        <table className="usuarios-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Cédula</th>
              <th>Celular</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuariosFiltrados.length > 0 ? (
              usuariosFiltrados.map((usuario) => (
                <tr key={usuario._id}>
                  <td>{usuario.nombre || '—'}</td>
                  <td>{usuario.cedula || '—'}</td>
                  <td>{usuario.celular || '—'}</td>
                  <td>{usuario.correo || '—'}</td>
                  <td>{usuario.rol || '—'}</td>
                  <td>{usuario.estado ? 'Habilitado' : 'Deshabilitado'}</td>
                  <td>
                    <button onClick={() => abrirModal(usuario)}>Editar</button>
                    {usuario.estado ? (
                      <button onClick={() => handleDeshabilitar(usuario._id)}>Deshabilitar</button>
                    ) : (
                      <button onClick={() => handleHabilitar(usuario._id)}>Habilitar</button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7">No se encontraron usuarios.</td>
              </tr>
            )}
          </tbody>
        </table>
      )}

{modalVisible && (
  <CrearUsuario
    formData={formData}
    setFormData={setFormData}
    onGuardar={handleGuardar}
    onCancelar={cerrarModal}
    usuarioEditando={usuarioEditando}
    fetchUsuarios={fetchUsuarios} // <-- AÑADE ESTO
    setModalVisible={setModalVisible} // <-- Y ESTO
  />
)}
    </div>
  );
};

export default UsuariosAdmin;
