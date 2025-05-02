import React, { useState } from 'react';
import './AuthForm.css';
import axios from 'axios';
import { useUser } from '../../context/UserContext'; // Importa el contexto

function AuthForm({ onClose }) {
  const { setUsuario } = useUser(); // Obtiene setUsuario del contexto
  const [isRegister, setIsRegister] = useState(false);
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
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/login`, loginData); // Captura la respuesta correctamente
  
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
      localStorage.setItem('userToken', token);
  
      if (recuerdame) {
        localStorage.setItem('recuerdame', 'true');
      }
  
      alert('✅ Inicio de sesión exitoso');
      onClose();
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      setError(`❌ ${error.response?.data?.message || 'Error en el servidor'}`);
    }
  };

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
            <label>
              <input
                type="checkbox"
                checked={recuerdame}
                onChange={(e) => setRecuerdame(e.target.checked)}
              />
              Recuérdame
            </label>
          )}

          {isRegister && (
            <label>
              <input type="checkbox" required />
              Acepta los <a href="#">Términos y Condiciones</a>
            </label>
          )}

          {error && <p style={{ color: 'pink' }}>{error}</p>}

          <button type="submit">{isRegister ? 'Registrar' : 'Entrar'}</button>
        </form>

        <div className="social-login">
          <p>O ingresa con</p>
          <div className="social-icons">
            <a href="#"><i className="fab fa-facebook-f"></i></a>
            <a href="#"><i className="fab fa-google"></i></a>
            <a href="#"><i className="fab fa-twitter"></i></a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthForm;
