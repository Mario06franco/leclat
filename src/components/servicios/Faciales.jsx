import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ServicioDetalle.css';

const Faciales = () => {
  const [servicios, setServicios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchServicios = async () => {
      try {
        const response = await axios.get('/api/servicios', {
          params: {
            categoria: 'facial',
            activo: true
          }
        });
        
        console.log('Respuesta de la API:', response.data);
        
        let serviciosData = [];
        
        if (Array.isArray(response.data)) {
          serviciosData = response.data;
        } else if (response.data && Array.isArray(response.data.data)) {
          serviciosData = response.data.data;
        } else if (response.data && response.data.success && Array.isArray(response.data.result)) {
          serviciosData = response.data.result;
        } else {
          throw new Error('Formato de respuesta no reconocido');
        }
        
        serviciosData = serviciosData.filter(servicio => servicio.activo !== false);
        
        setServicios(serviciosData);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Error al cargar servicios');
        setServicios([]);
      } finally {
        setLoading(false);
      }
    };
  
    fetchServicios();
  }, []);

  // Función para construir la URL completa de la imagen
  const getImageUrl = (imagePath) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    
    if (!imagePath) return '/img/servicio-default.jpg';
    
    // Si la imagen ya es una URL completa
    if (imagePath.startsWith('http') || imagePath.startsWith('https') || imagePath.startsWith('data:')) {
      return imagePath;
    }
    
    // Si es una ruta relativa, asumimos que está en /uploads/
    return `${backendUrl}${imagePath}`;
  };

  if (loading) {
    return (
      <section className="servicios-loading">
        <div className="spinner"></div>
        <p>Cargando tratamientos faciales...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="servicios-error">
        <p>{error}</p>
        <button onClick={() => window.location.reload()} className="btn-reintentar">
          Reintentar
        </button>
      </section>
    );
  }

  if (!Array.isArray(servicios) || servicios.length === 0) {
    return (
      <section className="servicios-vacio">
        <p>Actualmente no hay tratamientos faciales disponibles.</p>
        <p>Por favor consulta nuevamente más tarde.</p>
      </section>
    );
  }

  return (
    <section className="tratamientos-faciales">
      <div className="servicio-header">
        <h1>Tratamientos Faciales</h1>
        <p className="servicio-intro">
          Nuestros tratamientos faciales están diseñados para rejuvenecer, hidratar y limpiar profundamente la piel.
          Utilizamos tecnología avanzada y productos de alta gama para obtener resultados visibles desde la primera sesión.
        </p>
      </div>

      <div className="servicios-grid">
        {servicios.map((servicio) => (
          <div key={servicio._id} className="servicio-card">
            <div className="servicio-imagen-container">
              <img 
                src={getImageUrl(servicio.imagen)} 
                alt={servicio.nombre} 
                className="servicio-imagen"
                onError={(e) => {
                  e.target.onerror = null; 
                  e.target.src = '/img/servicio-default.jpg';
                }}
              />
              <div className="servicio-precio-tag">
                ${servicio.precio.toLocaleString()}
              </div>
            </div>
            
            <div className="servicio-info">
              <h2 className="servicio-nombre">{servicio.nombre}</h2>
              
              <div className="servicio-meta">
                <span className="servicio-duracion">
                  <i className="icono-reloj"></i> {servicio.duracion} minutos
                </span>
                <span className="servicio-frecuencia">
                  <i className="icono-calendario"></i> {servicio.frecuencia_recomendada || 'Consulta frecuencia'}
                </span>
              </div>
              
              <div className="servicio-descripcion">
                <h3>Descripción del tratamiento</h3>
                <p>{servicio.descripcion}</p>
              </div>
              
              <div className="servicio-detalles">
                <div className="detalle-item">
                  <h4><i className="icono-info"></i> Indicaciones</h4>
                  <p>{servicio.indicaciones || 'Ninguna indicación especial'}</p>
                </div>
                
                <div className="detalle-item">
                  <h4><i className="icono-alerta"></i> Contraindicaciones</h4>
                  <p>{servicio.contraindicaciones || 'Ninguna contraindicación importante'}</p>
                </div>
              </div>
              
              <button className="btn-reservar">
                <i className="icono-calendario"></i> Reservar ahora
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Faciales;