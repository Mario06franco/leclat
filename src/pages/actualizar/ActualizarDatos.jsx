import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ActualizarDatos.css';

const ActualizarDatos = () => {
  const [userData, setUserData] = useState({
    nombre: '',
    cedula: '',
    correo: '',
    celular: '',
    password: '' // Nueva contraseña (opcional)
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [showPassword, setShowPassword] = useState(false);

  // ✅ OBTENER TOKEN DESDE EL OBJETO USER
  const getToken = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.token;
  };

  // ✅ OBTENER URL DEL BACKEND DESDE .ENV
  const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

  // ✅ CARGAR DATOS DEL PERFIL
  useEffect(() => {
    const token = getToken();
    
    if (!token) {
      window.location.href = '/login';
      return;
    }

    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/api/auth/perfil`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );

        setUserData(prev => ({
          ...prev,
          nombre: response.data.nombre || '',
          cedula: response.data.cedula || '',
          correo: response.data.correo || '',
          celular: response.data.celular || '',
          password: '' // Mantener password vacío
        }));

      } catch (error) {
        console.error('Error cargando perfil:', error);
        
        if (error.response?.status === 401) {
          setMessage({ text: 'Sesión expirada. Redirigiendo...', type: 'error' });
          localStorage.removeItem('user');
          setTimeout(() => window.location.href = '/login', 2000);
        } else {
          setMessage({ text: 'Error al cargar perfil', type: 'error' });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [API_URL]);

  // ✅ MANEJAR CAMBIOS EN FORMULARIO
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // ✅ VALIDAR FORMULARIO
  const validateForm = () => {
    if (!userData.nombre.trim()) {
      setMessage({ text: 'El nombre es requerido', type: 'error' });
      return false;
    }
    if (!userData.correo.trim()) {
      setMessage({ text: 'El correo es requerido', type: 'error' });
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(userData.correo)) {
      setMessage({ text: 'El correo no es válido', type: 'error' });
      return false;
    }
    if (!userData.celular.trim()) {
      setMessage({ text: 'El celular es requerido', type: 'error' });
      return false;
    }
    return true;
  };

  // ✅ ENVIAR FORMULARIO DE ACTUALIZACIÓN - CORREGIDO
const handleSubmit = async (e) => {
  e.preventDefault();
  if (!validateForm()) {
    return;
  }
  setSaving(true);

  try {
    const token = getToken();
    if (!token) {
      window.location.href = '/login';
      return;
    }

    const updateData = {
      nombre: userData.nombre,
      correo: userData.correo,
      celular: userData.celular,
      password: userData.password
    };

    console.log('📤 Enviando a:', `${API_URL}/api/auth/${userData.cedula}`);
    console.log('📦 Datos:', updateData);

    // ✅ URL CORRECTA
    const response = await axios.put(
      `${API_URL}/api/auth/${userData.cedula}`, // ← ¡ESTA ES LA LÍNEA CLAVE!
      updateData,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('✅ Respuesta:', response.data);

    // ✅ ACTUALIZAR TOKEN SI VIENE EN LA RESPUESTA
    if (response.data.token) {
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const updatedUser = {
    ...currentUser,
    token: response.data.token
  };
  localStorage.setItem('user', JSON.stringify(updatedUser));
  console.log('🔄 Token actualizado en user');
}


    setMessage({ text: response.data.message, type: 'success' });

    // Limpiar campo de contraseña
    setUserData(prev => ({ ...prev, password: '' }));
    setShowPassword(false);

  } catch (error) {
    console.error('❌ Error completo:', error);
    console.error('❌ Response error:', error.response?.data);
    
    setMessage({ 
      text: error.response?.data?.message || 'Error al actualizar datos', 
      type: 'error' 
    });
  } finally {
    setSaving(false);
  }
};

  // ✅ MOSTRAR LOADING
  if (loading) {
    return (
      <div className="actualizar-datos-container">
        <div className="loading-spinner"></div>
        <p>Cargando información...</p>
      </div>
    );
  }

  // ✅ RENDERIZAR FORMULARIO
  return (
    <div className="actualizar-datos-container">
      <div className="form-header">
        <h2>✏️ Actualizar Datos Personales</h2>
        <p>Modifica tu información personal y de contacto</p>
      </div>

      {message.text && (
        <div className={`message ${message.type}`}>
          <span className="message-icon">
            {message.type === 'success' ? '✅' : '⚠️'}
          </span>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="user-form">
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="nombre">Nombre Completo *</label>
            <input
              id="nombre"
              type="text"
              name="nombre"
              value={userData.nombre}
              onChange={handleChange}
              placeholder="Ingresa tu nombre completo"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="cedula">Cédula *</label>
            <input
              id="cedula"
              type="text"
              name="cedula"
              value={userData.cedula}
              disabled
              className="disabled-field"
            />
          </div>

          <div className="form-group">
            <label htmlFor="correo">Correo Electrónico *</label>
            <input
              id="correo"
              type="email"
              name="correo"
              value={userData.correo}
              onChange={handleChange}
              placeholder="ejemplo@correo.com"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="celular">Número de Celular *</label>
            <input
              id="celular"
              type="tel"
              name="celular"
              value={userData.celular}
              onChange={handleChange}
              placeholder="300 123 4567"
              required
            />
          </div>

          <div className="form-group full-width">
            <label htmlFor="password">Nueva Contraseña (Opcional)</label>
            <div className="password-input-container">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                name="password"
                value={userData.password}
                onChange={handleChange}
                placeholder="Dejar vacío para mantener la actual"
                className="password-input"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
            <small className="password-hint">
              Mínimo 6 caracteres. Solo llena este campo si deseas cambiar tu contraseña.
            </small>
          </div>
        </div>

        <div className="form-actions">
          <button 
            type="submit" 
            disabled={saving}
            className="btn-primary"
          >
            {saving ? (
              <>
                <span className="spinner"></span>
                Guardando...
              </>
            ) : (
              '💾 Guardar Cambios'
            )}
          </button>
          
          <button 
            type="button" 
            className="btn-secondary"
            onClick={() => {
              setUserData(prev => ({ ...prev, password: '' }));
              setShowPassword(false);
            }}
          >
            🔄 Limpiar
          </button>
        </div>
      </form>

      
    </div>
  );
};

export default ActualizarDatos;