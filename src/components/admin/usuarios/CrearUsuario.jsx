import React, { useState } from 'react';
import axios from 'axios';
import './CrearUsuario.css';

const CrearUsuario = ({ formData, setFormData, onGuardar, onCancelar, usuarioEditando, fetchUsuarios, setModalVisible }) => {
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGuardar = async () => {
    setError('');
    setMensaje('');

    try {
      const { nombre, cedula, celular, correo, rol } = formData;

      if (!nombre || !cedula || !correo || !rol) {
        setError('❌ Todos los campos son obligatorios');
        return;
      }

      if (!/\S+@\S+\.\S+/.test(correo)) {
        setError('❌ Correo electrónico no válido');
        return;
      }

      const userData = {
        nombre,
        cedula,
        celular,
        correo,
        rol,
        password: cedula,
        estado: true,
      };

      if (usuarioEditando) {
        const response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/auth/usuarios/${usuarioEditando._id}`, userData);
        setMensaje('✅ Usuario actualizado correctamente');
      } else {
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/registrar`, userData);
        setMensaje('✅ Usuario creado correctamente');
      }

      fetchUsuarios();
      setTimeout(() => {
        setModalVisible(false);
        setMensaje('');
      }, 1000);

    } catch (error) {
      console.error('Error guardando usuario:', error);
      setError(`❌ ${error.response?.data?.message || 'Error al guardar usuario'}`);
    }
  };

  return (
    <div className="crear-usuario-modal">
      <div className="crear-usuario-content">
        <button className="cerrar-btn" onClick={onCancelar}>X</button>
        <h3>{usuarioEditando ? 'Editar Usuario' : 'Crear Usuario'}</h3>

        <input name="nombre" placeholder="Nombre" value={formData.nombre} onChange={handleChange} />
        <input name="cedula" placeholder="Cédula" value={formData.cedula} onChange={handleChange} />
        <input name="celular" placeholder="Celular" value={formData.celular} onChange={handleChange} />
        <input name="correo" placeholder="Correo" value={formData.correo} onChange={handleChange} />

        <select name="rol" value={formData.rol} onChange={handleChange}>
          <option value="">Seleccione un rol</option>
          <option value="usuario">Usuario</option>
          <option value="colaboradora">Colaboradora</option>
          <option value="admin">Admin</option>
        </select>

        {error && <p className="mensaje-error">{error}</p>}
        {mensaje && <p className="mensaje-exito">{mensaje}</p>}

        <div className="crear-usuario-actions">
          <button onClick={handleGuardar}>Guardar y Cerrar</button>
          <button onClick={onCancelar}>Cancelar</button>
        </div>
      </div>
    </div>
  );
};

export default CrearUsuario;
