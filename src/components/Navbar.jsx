import React from 'react';
import { Link } from 'react-router-dom';
import '../css/Navbar.css';
import logo from '../img/leclat1.png';

function Navbar({ user, onLoginClick, onLogout }) {
  return (
    <header className="header">
      <div className="navbar">
        <Link to="/" className="logo">
          <img src={logo} alt="Leclat Logo" />
        </Link>
        <nav>
          <ul className="nav-links">
            <li><Link to="/">Inicio</Link></li>
            <li><Link to="/QuienesSomos">Nosotros</Link></li>
            <li><Link to="/servicios">Servicios</Link></li>
            <li>
              {user ? (
                <button onClick={onLogout}>Cerrar sesión</button>
              ) : (
                <button className="btn-login" onClick={onLoginClick}>Iniciar sesión</button>
              )}
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
