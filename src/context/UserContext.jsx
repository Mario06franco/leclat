import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);

  // Verifica el token y carga el usuario desde el backend
  const fetchUsuario = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const res = await axios.get('http://localhost:4000/api/auth/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsuario(res.data.usuario);
    } catch (err) {
      console.error('Token inválido o expirado');
      localStorage.removeItem('token');
      setUsuario(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsuario();
  }, []);

  // Cerrar sesión
  const logout = () => {
    localStorage.removeItem('token');
    setUsuario(null);
    window.location.href = '/'; // redirección forzada
  };

  return (
    <UserContext.Provider value={{ usuario, setUsuario, logout, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
