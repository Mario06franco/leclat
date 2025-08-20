import React, { useState } from 'react';
import './AuthForm.css';
import axios from 'axios';
import { useUser } from '../../context/UserContext';

function AuthForm({ onClose }) {
  const { setUsuario } = useUser();
  const [isRegister, setIsRegister] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [nombre, setNombre] = useState('');
  const [cedula, setCedula] = useState('');
  const [correo, setCorreo] = useState('');
  const [celular, setCelular] = useState('');
  const [password, setPassword] = useState('');
  const [identificador, setIdentificador] = useState('');
  const [error, setError] = useState('');
  const [recuerdame, setRecuerdame] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (isRegister) {
        if (!/\S+@\S+\.\S+/.test(correo)) {
          setError('❌ Debes proporcionar un correo electrónico válido');
          return;
        }

        const userData = {
          nombre,
          cedula,
          correo,
          celular,
          password
        };

        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/registrar`, userData);

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
        if (!identificador) {
          setError('❌ Ingresa tu cédula o correo');
          return;
        }

        const loginData = { identificador, password };
        await loginUser(loginData);
      }
    } catch (err) {
      console.error(err);
      setError(`❌ ${err.response?.data?.message || 'Error en el servidor'}`);
    }
  };

  const loginUser = async (loginData) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/login`, loginData);
      
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
      localStorage.removeItem('userToken');

      if (recuerdame) {
        localStorage.setItem('recuerdame', 'true');
      }

      alert('✅ Inicio de sesión exitoso');
      onClose();
      
      window.location.href = '/';
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      setError(`❌ ${error.response?.data?.message || error.message || 'Error en el servidor'}`);
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
      
      // Validación básica
      if (!identifier.trim()) {
        setMessage('❌ Por favor ingresa tu cédula o correo electrónico');
        return;
      }
      
      setIsLoading(true);
      setMessage('');
      
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/auth/forgot-password`,
          { identifier },
          {
            timeout: 10000,
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );
        
        console.log('Respuesta del servidor:', response.data);
        
        // Manejar la respuesta según la estructura del backend
        if (response.data.success) {
          setSuccess(true);
          setMessage('✅ ' + response.data.message);
          
          // Mostrar información de desarrollo si existe
          if (response.data.developmentInfo) {
            console.log('🔗 Enlace de desarrollo:', response.data.developmentInfo.resetUrl);
            setMessage(prev => prev + `\n🔗 Enlace de prueba: ${response.data.developmentInfo.resetUrl}`);
          }
          
          // Cerrar después de 5 segundos solo si fue exitoso
          setTimeout(() => {
            onClose();
          }, 5000);
        } else {
          setMessage('❌ ' + (response.data.message || 'Error al procesar la solicitud'));
        }
        
      } catch (error) {
        console.error('Error completo:', error);
        
        // Manejo detallado de errores
        if (error.response) {
          // El servidor respondió con un código de error
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
          // La solicitud fue hecha pero no hubo respuesta
          setMessage('❌ No se pudo conectar con el servidor. Verifica tu conexión.');
        } else if (error.code === 'ECONNABORTED') {
          setMessage('❌ Tiempo de espera agotado. Intenta nuevamente.');
        } else {
          // Error inesperado
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
          
          <div className="auth-toggle">
            <div className="highlight" style={{ left: '0%' }}></div>
            <span style={{ cursor: 'default' }}>Recuperar Contraseña</span>
            <span style={{ visibility: 'hidden' }}>Placeholder</span>
          </div>

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
                placeholder="Nombres y apellidos"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Cédula"
                value={cedula}
                onChange={(e) => setCedula(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Celular"
                value={celular}
                onChange={(e) => setCelular(e.target.value)}
                required
              />
              <input
                type="email"
                placeholder="Correo"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                required
              />
            </>
          ) : (
            <input
              type="text"
              placeholder="Correo o Cédula"
              value={identificador}
              onChange={(e) => setIdentificador(e.target.value)}
              required
            />
          )}

          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {!isRegister && (
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={recuerdame}
                onChange={(e) => setRecuerdame(e.target.checked)}
              />
              Recuérdame
            </label>
          )}

          {isRegister && (
            <label className="checkbox-label">
              <input type="checkbox" required />
              Acepta los <a href="#">Términos y Condiciones</a>
            </label>
          )}

          {error && <div className="error-message">{error}</div>}

          <button type="submit">{isRegister ? 'Registrar' : 'Entrar'}</button>
        </form>

        {!isRegister && (
          <div className="forgot-password-link">
            <a href="#" onClick={(e) => {
              e.preventDefault();
              setShowForgotPassword(true);
            }}>
              ¿Olvidaste tu contraseña?
            </a>
          </div>
        )}

        
      </div>
    </div>
  );
}

export default AuthForm;