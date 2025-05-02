import React from 'react';
import './QuienesSomos.css';
import centroImg from '../../img/sala.jpg'; 
import prof1 from '../../img/tati.jpg';
import prof2 from '../../img/esme.jpg';

const QuienesSomos = () => {
  return (
    
    <div className="quienes-container">
    
      <section className="intro-container">
  <div className="intro-content">
    <div className="intro-text-container">
      <h2 className="intro-title">Acerca de Nosotros</h2>
      <p className="intro-text">
        Centro de estética y belleza dotado con la más alta tecnología y personal capacitado, productos europeos de mucha trayectoria y respaldo. 
      </p>
      <p className="intro-text">
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Magnam exercitationem quia quos? Explicabo, nostrum. Eum nisi mollitia reprehenderit totam, unde ut assumenda, aliquam, voluptatibus odit illum aperiam eos modi nihil.
      </p>
      
    </div>
    <div className="intro-image-container">
      <img src={centroImg} alt="Centro Estético Bioestetic Spa" className="centro-img" />
      <div className="intro-footer">
        <p>Leclat se fundó el 01 de Marzo de 2024 con más experiencia, clientes felices y experiencias individuales.</p>
      </div>
    </div>

    
  </div>
</section>

<section className="profesionales-section">
  <div className="profesionales-container">
    <h2 className="profesionales-title">Nuestras Profesionales</h2>
    <div className="profesionales-grid">
      <div className="profesional-card">
        <div className="card-image-container">
          <img src={prof1} alt="Tatiana Rojas Saldarriga" className="profesional-img" />
          <div className="card-overlay"></div>
        </div>
        <div className="card-content">
          <h3>Tatiana Rojas Saldarriga</h3>
          <p className="especialidad">Especialista en tratamientos faciales</p>
          <p className="experiencia">+2 años de experiencia en estética y bienestar</p>
        </div>
      </div>
      
      <div className="profesional-card">
        <div className="card-image-container">
          <img src={prof2} alt="Esmeralda Vera" className="profesional-img" />
          <div className="card-overlay"></div>
        </div>
        <div className="card-content">
          <h3>Esmeralda Vera</h3>
          <p className="especialidad">Experta en terapias corporales</p>
          <p className="experiencia">Técnicas de rejuvenecimiento no invasivo</p>
        </div>
      </div>
    </div>
  </div>
</section>

<section className="mision-vision-intereses">
  <div className="mv-container">
    <div className="mv-column">
      <div className="mision-box">
        <div className="mv-icon">🎯</div>
        <h2>Misión</h2>
        <div className="divider"></div>
        <p>
          Brindar servicios estéticos personalizados de alta calidad que promuevan el bienestar físico y emocional de nuestros clientes, mediante el uso de técnicas modernas y la atención profesional de nuestro equipo.
        </p>
      </div>
      
      <div className="vision-box">
        <div className="mv-icon">👁️</div>
        <h2>Visión</h2>
        <div className="divider"></div>
        <p>
          Ser reconocidos como el centro estético líder en Colombia por nuestra excelencia en el servicio, innovación constante y compromiso con la salud y belleza de nuestros clientes.
        </p>
      </div>
    </div>
    
    <div className="intereses-column">
      <div className="intereses-box">
        <div className="mv-icon">❤️</div>
        <h2>Nuestros Intereses</h2>
        <div className="divider"></div>
        <ul className="intereses-list">
          <li className="interes-item">
            <span className="item-icon">✓</span>
            <span>Bienestar integral de nuestros clientes</span>
          </li>
          <li className="interes-item">
            <span className="item-icon">✓</span>
            <span>Innovación constante en tratamientos estéticos</span>
          </li>
          <li className="interes-item">
            <span className="item-icon">✓</span>
            <span>Formación continua de nuestro equipo profesional</span>
          </li>
          <li className="interes-item">
            <span className="item-icon">✓</span>
            <span>Uso de productos de la más alta calidad</span>
          </li>
          <li className="interes-item">
            <span className="item-icon">✓</span>
            <span>Personalización de cada tratamiento</span>
          </li>
          <li className="interes-item">
            <span className="item-icon">✓</span>
            <span>Sostenibilidad y responsabilidad ambiental</span>
          </li>
          <li className="interes-item">
            <span className="item-icon">✓</span>
            <span>Sostenibilidad y responsabilidad ambiental</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</section>
    </div>
  );
};

export default QuienesSomos;
