import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../authForm/AuthForm.css';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [validToken, setValidToken] = useState(false);
  const [tokenInfo, setTokenInfo] = useState(null);
  const { token } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    // Verificar si el token es válido
    const checkToken = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/auth/validate-token/${token}`
        );
        
        if (response.data.valid) {
          setValidToken(true);
        } else {
          setMessage('El enlace de recuperación es inválido o ha expirado.');
        }
      } catch (error) {
        console.error('Error validando token:', error);
        setMessage('Error al validar el enlace. Intenta nuevamente.');
      }
    };

    if (token) {
      checkToken();
    } else {
      setMessage('No se proporcionó un token válido.');
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setMessage('Las contraseñas no coinciden');
      return;
    }
    
    if (password.length < 6) {
      setMessage('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    
    setIsLoading(true);
    setMessage('');
    
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/reset-password/${token}`,
        { password }
      );
      
      setMessage('✅ Contraseña restablecida correctamente. Redirigiendo...');
      
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error) {
      console.error('Error restableciendo contraseña:', error);
      
      if (error.response?.data?.message) {
        setMessage('❌ ' + error.response.data.message);
      } else {
        setMessage('❌ Error al restablecer la contraseña');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!validToken && message) {
    return (
      <div className="modal-auth" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <div className="auth-container">
          <h2>Enlace inválido</h2>
          <div className="error-message">{message}</div>
          <button className="back-button" onClick={() => navigate('/')}>
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-auth" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <div className="auth-container">
        <div className="auth-toggle">
          <div className="highlight" style={{ left: '0%' }}></div>
          <span style={{ cursor: 'default' }}>Restablecer Contraseña</span>
          <span style={{ visibility: 'hidden' }}>Placeholder</span>
        </div>

        <form className="form" onSubmit={handleSubmit}>
          <h2>Nueva Contraseña</h2>
          <p>Ingresa tu nueva contraseña</p>

          <input
            type="password"
            placeholder="Nueva contraseña (mínimo 6 caracteres)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength="6"
            disabled={isLoading}
          />

          <input
            type="password"
            placeholder="Confirmar contraseña"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength="6"
            disabled={isLoading}
          />

          {message && (
            <div className={message.includes('✅') ? 'success-message' : 'error-message'}>
              {message}
            </div>
          )}

          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Restableciendo...' : 'Restablecer contraseña'}
          </button>
        </form>

        <button className="back-button" onClick={() => navigate('/login')} disabled={isLoading}>
          Volver al login
        </button>
      </div>
    </div>
  );
};

export default ResetPassword;