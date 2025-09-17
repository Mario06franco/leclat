import React from 'react';
import '../css/Footer.css'; // Asegúrate de tener este archivo con los estilos
import { Link } from 'react-router-dom';


const Footer = () => {
  return (
    <footer className="footer-bg">
      <div className="container">
        <div className="footer-row">
          <div className="footer-col">
            <h6 className="footer-heading">Información</h6>
            <ul className="footer-link">
              <li><Link to="/">Inicio</Link></li>
              <li><Link to="/QuienesSomos">Quiénes Somos</Link></li>
              <li><Link to="/servicios">Servicios</Link></li>
              <li><a href="#">Productos</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h6 className="footer-heading">Recursos</h6>
            <ul className="footer-link">
              <li><a href="#">Blog</a></li>
              <li><a href="#">Guías de cuidado</a></li>
              <li><a href="#">Términos y condiciones</a></li>
              <li><a href="#">Preguntas frecuentes</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h6 className="footer-heading">Ayuda</h6>
            <ul className="footer-link">
              <li><a href="#">Iniciar Sesión</a></li>
              <li><a href="#">Registrarse</a></li>
              <li><a href="#">Política de privacidad</a></li>
              <li><a href="#">Soporte</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h6 className="footer-heading">Ubícanos</h6>
            
            
            <div className="map-container mt-3">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3975.7167357854164!2d-75.69416242596262!3d4.818623840625964!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e38874a109cfb0d%3A0x5c6dd8647c5083ea!2sCra.%202%20%2316-39%2C%20Pereira%2C%20Risaralda!5e0!3m2!1ses!2sco!4v1744168530381!5m2!1ses!2sco"
                width="100%"
                height="120"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Mapa Leclat"
              ></iframe>
            </div>
            <div className="footer-socials">
              <a href=""><i className="fab fa-facebook-f facebook"></i></a>
              <a href="https://www.instagram.com/leclat.centroestetico/" target="_blank" rel="noopener noreferrer"><i className="fab fa-instagram instagram"></i></a>
              <a href="https://wa.link/u1a4f4"><i className="fab fa-whatsapp whatsapp"></i></a>
              <a href="#"><i className="fab fa-tiktok tiktok"></i></a>
            </div>
          </div>    
        </div> 
      </div>
      <div className="footer-copy">
        <p>2025 © Leclat, Todos los derechos reservados</p>
      </div>
    </footer>
  );
};

export default Footer;
