import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Servicios.css';
import { FaTimes, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

// Importaciones de imágenes
import caraImg from '../../img/facial.jpg';
import cuerpoImg from '../../img/masaje.jpg';
import cabelloImg from '../../img/depilacion.jpg';

import proc1 from '../../img/resultado2.jpeg';
import proc2 from '../../img/resultado1.jpeg';
import proc3 from '../../img/resultado3.jpeg';

const Servicios = () => {
  // Componente Galería de Resultados
  const GaleriaResultados = ({ fotos }) => {
    const [paginaActual, setPaginaActual] = useState(1);
    const [fotoSeleccionada, setFotoSeleccionada] = useState(null);
    const [fotoIndex, setFotoIndex] = useState(0);
    
    // Configuración de la galería
    const fotosPorPagina = 8;
    const totalPaginas = Math.ceil(fotos.length / fotosPorPagina);
    const fotosPagina = fotos.slice(
      (paginaActual - 1) * fotosPorPagina,
      paginaActual * fotosPorPagina
    );
  
    // Manejar paginación
    const cambiarPagina = (nuevaPagina) => {
      setPaginaActual(nuevaPagina);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
  
    // Abrir lightbox
    const abrirLightbox = (index) => {
      const indiceGlobal = (paginaActual - 1) * fotosPorPagina + index;
      setFotoSeleccionada(fotos[indiceGlobal]);
      setFotoIndex(indiceGlobal);
      document.body.style.overflow = 'hidden';
    };
  
    // Cerrar lightbox
    const cerrarLightbox = () => {
      setFotoSeleccionada(null);
      document.body.style.overflow = 'auto';
    };
  
    // Navegar entre fotos en el lightbox
    const cambiarFoto = (direccion) => {
      let nuevoIndex;
      if (direccion === 'anterior') {
        nuevoIndex = (fotoIndex - 1 + fotos.length) % fotos.length;
      } else {
        nuevoIndex = (fotoIndex + 1) % fotos.length;
      }
      setFotoIndex(nuevoIndex);
      setFotoSeleccionada(fotos[nuevoIndex]);
    };

    return (
      <section className="galeria-resultados">
        <div className="container">
          <h1 className="titulo-galeria">Resultados de Nuestros Procedimientos</h1>
          
          <div className="grid-galeria">
            {fotosPagina.map((foto, index) => (
              <div 
                key={index} 
                className="item-galeria"
                onClick={() => abrirLightbox(index)}
              >
                <img 
                  src={foto} 
                  alt={`Resultado ${index + 1}`} 
                  loading="lazy"
                />
                <div className="overlay">
                  <span>Ver Detalle</span>
                </div>
              </div>
            ))}
          </div>

          {totalPaginas > 1 && (
            <div className="paginacion">
              <button 
                onClick={() => cambiarPagina(paginaActual - 1)} 
                disabled={paginaActual === 1}
              >
                Anterior
              </button>
              
              {Array.from({ length: totalPaginas }, (_, i) => i + 1).map(num => (
                <button
                  key={num}
                  onClick={() => cambiarPagina(num)}
                  className={paginaActual === num ? 'active' : ''}
                >
                  {num}
                </button>
              ))}
              
              <button 
                onClick={() => cambiarPagina(paginaActual + 1)} 
                disabled={paginaActual === totalPaginas}
              >
                Siguiente
              </button>
            </div>
          )}
        </div>

        {/* Lightbox */}
        {fotoSeleccionada && (
          <div className="lightbox">
            <button style={{color:"white"}} className="btn-cerrar" onClick={cerrarLightbox}>
              <FaTimes />
            </button>
            
            <button 
              className="btn-navegacion anterior" 
              onClick={() => cambiarFoto('anterior')}
            >
              <FaChevronLeft />
            </button>
            
            <div className="contenido-lightbox">
              <img 
                src={fotoSeleccionada} 
                alt="Resultado ampliado" 
              />
            </div>
            
            <button 
              className="btn-navegacion siguiente" 
              onClick={() => cambiarFoto('siguiente')}
            >
              <FaChevronRight />
            </button>
          </div>
        )}
      </section>
    );
  };

  return (
    <div className="servicios-container">
      <section>
        <h1 className="titulo-servicios">Nuestros Servicios</h1>
        <p className="descripcion-servicios">
          En Leclat, ofrecemos una amplia gama de servicios estéticos diseñados para realzar tu belleza natural y cuidar de tu bienestar integral. Nuestro equipo profesional se especializa en tratamientos faciales, corporales y relajantes, todos ellos pensados para brindar resultados visibles y duraderos. 
        </p>

        <div className="categorias">
          <Link to="/servicios/faciales" className="categoria">
            <img src={caraImg} alt="Faciales" />
            <h2>Faciales</h2>
          </Link>
          <Link to="/servicios/corporales" className="categoria">
            <img src={cuerpoImg} alt="Corporales" />
            <h2>Corporales</h2>
          </Link>
          <Link to="/servicios/Relajantes" className="categoria">
            <img src={cabelloImg} alt="Relajantes" />
            <h2>Relajantes</h2>
          </Link>
        </div>
      </section>

      {/* Galería de resultados */}
      <GaleriaResultados fotos={[proc1, proc2, proc3, proc1, proc2, proc3, proc1, proc2, proc3, proc1]} />
    </div>
  );
};

export default Servicios;