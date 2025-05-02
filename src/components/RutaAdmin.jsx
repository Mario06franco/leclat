// components/RutaAdmin.jsx
import { Navigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

const RutaAdmin = ({ children }) => {
  const { usuario } = useUser();

  if (!usuario) return null; // aún cargando

  if (usuario.rol === 'admin') {
    return children; // acceso permitido
  }

  return <Navigate to="/" />; // redirige si no es admin
};

export default RutaAdmin;
