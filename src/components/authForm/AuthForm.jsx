import React, { useState } from 'react';
import './AuthForm.css';
import api from '../../config/axios';
import { useUser } from '../../context/UserContext';

function AuthForm({ onClose }) {
  const { setUsuario } = useUser();
  const [isRegister, setIsRegister] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    cedula: '',
    correo: '',
    celular: '',
    password: '',
    identificador: ''
  });
  const [error, setError] = useState('');
  const [recuerdame, setRecuerdame] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isRegister) {
        // Validación de email
        if (!/\S+@\S+\.\S+/.test(formData.correo)) {
          setError('❌ Debes proporcionar un correo electrónico válido');
          setLoading(false);
          return;
        }

        const userData = {
          nombre: formData.nombre,
          cedula: formData.cedula,
          correo: formData.correo,
          celular: formData.celular,
          password: formData.password
        };

        const response = await api.post('/api/auth/registrar', userData);
        const data = response.data;

        const usuario = {
          nombre: data.nombre,
          correo: data.correo,
          cedula: data.cedula,
          rol: data.rol,
          token: data.token
        };

        setUsuario(usuario);
        localStorage.setItem('user', JSON.stringify(usuario));
        localStorage.setItem('userToken', data.token);

        alert('✅ Registro exitoso');
        onClose();
      } else {
        if (!formData.identificador) {
          setError('❌ Ingresa tu cédula o correo');
          setLoading(false);
          return;
        }

        const loginData = {
          identificador: formData.identificador,
          password: formData.password
        };

        const response = await api.post('/api/auth/login', loginData);
        
        if (!response.data.user || !response.data.token) {
          throw new Error('Estructura de respuesta inválida');
        }

        const { user, token } = response.data;

        const usuario = {
          nombre: user.nombre,
          correo: user.correo,
          cedula: user.cedula,
          rol: user.rol,
          token
        };

        setUsuario(usuario);
        localStorage.setItem('user', JSON.stringify(usuario));

        if (recuerdame) {
          localStorage.setItem('recuerdame', 'true');
        } else {
          localStorage.removeItem('recuerdame');
        }

        alert('✅ Inicio de sesión exitoso');
        onClose();
        
        window.location.href = '/';
      }
    } catch (err) {
      console.error('Auth error:', err);
      setError(`❌ ${err.response?.data?.message || err.message || 'Error en el servidor'}`);
    } finally {
      setLoading(false);
    }
  };

  // Componente de recuperación de contraseña
  const ForgotPassword = ({ onBackToLogin, onClose }) => {
    const [identifier, setIdentifier] = useState('');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
      e.preventDefault();
      
      if (!identifier.trim()) {
        setMessage('❌ Por favor ingresa tu cédula o correo electrónico');
        return;
      }
      
      setIsLoading(true);
      setMessage('');
      
      try {
        const response = await api.post('/api/auth/forgot-password', { identifier });
        
        console.log('Respuesta del servidor:', response.data);
        
        if (response.data.success) {
          setSuccess(true);
          setMessage('✅ ' + response.data.message);
          
          if (response.data.developmentInfo) {
            console.log('🔗 Enlace de desarrollo:', response.data.developmentInfo.resetUrl);
          }
          
          setTimeout(() => {
            onClose();
          }, 5000);
        } else {
          setMessage('❌ ' + (response.data.message || 'Error al procesar la solicitud'));
        }
        
      } catch (error) {
        console.error('Error completo:', error);
        
        if (error.response) {
          if (error.response.status === 400) {
            setMessage('❌ ' + (error.response.data.message || 'Datos inválidos'));
          } else if (error.response.status === 500) {
            setMessage('❌ Error interno del servidor. Intenta más tarde.');
          } else if (error.response.data?.message) {
            setMessage('❌ ' + error.response.data.message);
          } else {
            setMessage('❌ Error del servidor: ' + error.response.status);
          }
        } else if (error.request) {
          setMessage('❌ No se pudo conectar con el servidor. Verifica tu conexión.');
        } else if (error.code === 'ECONNABORTED') {
          setMessage('❌ Tiempo de espera agotado. Intenta nuevamente.');
        } else {
          setMessage('❌ Error inesperado. Intenta nuevamente.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    return (
      <div className="modal-auth">
        <div className="auth-container">
          <button className="btn-close" onClick={onBackToLogin}>✕</button>
          
          <form className="form" onSubmit={handleSubmit}>
            <h2>Recuperar Contraseña</h2>
            <p>Ingresa tu cédula o correo electrónico para restablecer tu contraseña.</p>

            <input
              type="text"
              placeholder="Cédula o correo electrónico"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
              disabled={isLoading}
            />

            {message && (
              <div className={`message ${success ? 'success' : 'error'}`} 
                   style={{ whiteSpace: 'pre-line', margin: '15px 0' }}>
                {message}
              </div>
            )}

            <button type="submit" disabled={isLoading}>
              {isLoading ? 'Enviando...' : 'Enviar enlace de recuperación'}
            </button>
          </form>

          <button className="back-button" onClick={onBackToLogin} disabled={isLoading}>
            Volver al login
          </button>
        </div>
      </div>
    );
  };

  if (showForgotPassword) {
    return (
      <ForgotPassword 
        onBackToLogin={() => setShowForgotPassword(false)}
        onClose={onClose}
      />
    );
  }

  return (
    <div className="modal-auth">
      <div className="auth-container">
        <button className="btn-close" onClick={onClose}>✕</button>

        <div className="auth-toggle">
          <div className="highlight" style={{ left: isRegister ? '50%' : '0%' }}></div>
          <span onClick={() => setIsRegister(false)}>Ingresar</span>
          <span onClick={() => setIsRegister(true)}>Registrar</span>
        </div>

        <form className="form" onSubmit={handleSubmit}>
          <h2>{isRegister ? 'Registrar' : 'Ingresar'}</h2>

          {isRegister ? (
            <>
              <input
                type="text"
                name="nombre"
                placeholder="Nombres y apellidos"
                value={formData.nombre}
                onChange={handleInputChange}
                required
                disabled={loading}
              />
              <input
                type="text"
                name="cedula"
                placeholder="Cédula"
                value={formData.cedula}
                onChange={handleInputChange}
                required
                disabled={loading}
              />
              <input
                type="text"
                name="celular"
                placeholder="Celular"
                value={formData.celular}
                onChange={handleInputChange}
                required
                disabled={loading}
              />
              <input
                type="email"
                name="correo"
                placeholder="Correo"
                value={formData.correo}
                onChange={handleInputChange}
                required
                disabled={loading}
              />
            </>
          ) : (
            <input
              type="text"
              name="identificador"
              placeholder="Correo o Cédula"
              value={formData.identificador}
              onChange={handleInputChange}
              required
              disabled={loading}
            />
          )}

          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            value={formData.password}
            onChange={handleInputChange}
            required
            disabled={loading}
          />

          {!isRegister && (
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={recuerdame}
                onChange={(e) => setRecuerdame(e.target.checked)}
                disabled={loading}
              />
              Recuérdame
            </label>
          )}

          {isRegister && (
            <label className="checkbox-label">
              <input 
                type="checkbox" 
                required 
                disabled={loading}
              />
              Acepta los <a href="#">Términos y Condiciones</a>
            </label>
          )}

          {error && <div className="error-message">{error}</div>}

          <button type="submit" disabled={loading}>
            {loading ? 'Procesando...' : (isRegister ? 'Registrar' : 'Entrar')}
          </button>
        </form>

        {!isRegister && (
          <div className="forgot-password-link">
            <a 
              href="#" 
              onClick={(e) => {
                e.preventDefault();
                setShowForgotPassword(true);
              }}
              style={loading ? { pointerEvents: 'none', opacity: 0.5 } : {}}
            >
              ¿Olvidaste tu contraseña?
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

export default AuthForm;