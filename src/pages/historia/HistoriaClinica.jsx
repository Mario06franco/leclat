import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './HistoriaClinica.css';

function HistoriaClinica() {
  const [historias, setHistorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [debugInfo, setDebugInfo] = useState('');
  const [selectedHistoria, setSelectedHistoria] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('userToken');
        const user = JSON.parse(localStorage.getItem('user'));
        
        console.log('🔍 DEBUG - Usuario desde localStorage:', user);
        console.log('🔍 DEBUG - Cédula del usuario:', user?.cedula);
        console.log('🔍 DEBUG - Token:', token ? 'Presente' : 'Faltante');

        if (!user || !user.cedula) {
          setError('No se pudo obtener la información del usuario');
          setLoading(false);
          return;
        }

        // PRIMERO: Obtener TODAS las historias para debug
        console.log('🔍 Obteniendo todas las historias para debug...');
        const allResponse = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/historias`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        console.log('🔍 TODAS las historias:', allResponse.data);
        
        if (allResponse.data && allResponse.data.data) {
          const todasHistorias = allResponse.data.data;
          console.log('🔍 Total de historias en BD:', todasHistorias.length);
          
          // Mostrar información de debug
          const debugData = todasHistorias.map(h => ({
            id: h._id,
            cedula: h.cedula,
            tipoCedula: typeof h.cedula,
            nombre: h.datosGenerales?.nombreCompleto
          }));
          
          console.log('🔍 Detalles de historias:', debugData);
          setDebugInfo(`Total historias: ${todasHistorias.length}. Cédulas encontradas: ${debugData.map(d => d.cedula).join(', ')}`);

          // Filtrar por cédula del usuario
          const userHistorias = todasHistorias.filter(
            historia => historia.cedula && historia.cedula.toString() === user.cedula.toString()
          );

          console.log('🔍 Historias filtradas para usuario:', userHistorias);
          setHistorias(userHistorias);

          if (userHistorias.length === 0) {
            setError(`No se encontraron historias para cédula: ${user.cedula}. Historiass en BD tienen cédulas: ${debugData.map(d => d.cedula).join(', ')}`);
          }
        }
        
        setLoading(false);

      } catch (error) {
        console.error('❌ Error completo:', error);
        
        if (error.response?.status === 401) {
          setError('No autorizado. Por favor inicie sesión nuevamente');
        } else {
          setError('Error al cargar las historias clínicas. Por favor intente más tarde.');
        }
        
        setLoading(false);
      }
    };

    fetchData();
  }, []);


  const handleVerDetalles = (historia) => {
    setSelectedHistoria(historia);
    setShowModal(true);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('es-ES');
  };

  if (loading) {
    return (
      <div style={{ marginLeft: '80px', padding: '20px' }}>
        <h2>📝 Historia Clínica</h2>
        <div className="loading">
          <div className="spinner"></div>
          <p>Cargando historias clínicas...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ marginLeft: '80px', padding: '20px' }}>
      <h2>📝 Mis Historias Clínicas</h2>
      
      {error && !historias.length && (
        <div className="error-message">
          <p>{error}</p>
        </div>
      )}

      {historias.length === 0 ? (
        <div className="no-histories">
          <p>No se encontraron historias clínicas para su cuenta.</p>
        </div>
      ) : (
        <div className="historias-list">
          <h3>Total de historias: {historias.length}</h3>
          <table className="historias-table">
            <thead>
              <tr>
                <th>Fecha de Creación</th>
                <th>Nombre del Paciente</th>
                <th>Cédula</th>
                
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {historias.map((historia) => (
                <tr key={historia._id}>
                  <td>{formatDate(historia.createdAt)}</td>
                  <td>{historia.datosGenerales?.nombreCompleto || 'N/A'}</td>
                  <td>{historia.cedula}</td>
                  
                  <td>
                    <button 
                      className="btn-ver"
                      onClick={() => handleVerDetalles(historia)}
                    >
                      Ver Detalles
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal para ver detalles */}
      {showModal && selectedHistoria && (
        <div className="modal-overlay">
          <div className="modal-container large">
            <div className="modal-header">
              <h3>Detalles de Historia Clínica - {formatDate(selectedHistoria.createdAt)}</h3>
              <button className="close-btn" onClick={() => setShowModal(false)}>X</button>
            </div>
            <div className="modal-body">
              <div className="historia-details">
                <h4>Datos Generales</h4>
                <p><strong>Nombre:</strong> {selectedHistoria.datosGenerales?.nombreCompleto || 'N/A'}</p>
                <p><strong>Edad:</strong> {selectedHistoria.datosGenerales?.edad || 'N/A'}</p>
                <p><strong>Fecha Nacimiento:</strong> {selectedHistoria.datosGenerales?.fechaNacimiento || 'N/A'}</p>
                <p><strong>Ocupación:</strong> {selectedHistoria.datosGenerales?.ocupacion || 'N/A'}</p>
                <p><strong>Teléfono:</strong> {selectedHistoria.datosGenerales?.telefono || 'N/A'}</p>
                <p><strong>Email:</strong> {selectedHistoria.datosGenerales?.correo || 'N/A'}</p>

                <h4>Historial Clínico</h4>
                <p><strong>Afecciones cutáneas:</strong> {selectedHistoria.historialClinico?.afeccionesCutaneas?.join(', ') || 'Ninguna'}</p>
                <p><strong>Enfermedades crónicas:</strong> {selectedHistoria.historialClinico?.enfermedadesCronicas?.join(', ') || 'Ninguna'}</p>
                <p><strong>Alergias:</strong> {selectedHistoria.historialClinico?.alergias?.join(', ') || 'Ninguna'}</p>
                <p><strong>Medicación actual:</strong> {selectedHistoria.historialClinico?.medicacionActual || 'Ninguna'}</p>

                <h4>Diagnóstico Facial</h4>
                <p><strong>Tipo de piel:</strong> {selectedHistoria.diagnosticoFacial?.tipoPiel || 'N/A'}</p>
                <p><strong>Observaciones visuales:</strong> {selectedHistoria.diagnosticoFacial?.observacionVisual?.join(', ') || 'Ninguna'}</p>

                <h4>Plan de Tratamiento</h4>
                <p><strong>Diagnóstico final:</strong> {selectedHistoria.planTratamiento?.diagnosticoFinal || 'N/A'}</p>
                <p><strong>Tratamiento recomendado:</strong> {selectedHistoria.planTratamiento?.tratamientoRecomendado || 'N/A'}</p>
                <p><strong>Sesiones:</strong> {selectedHistoria.planTratamiento?.numSesiones || 'N/A'}</p>
                <p><strong>Frecuencia:</strong> {selectedHistoria.planTratamiento?.frecuenciaSugerida || 'N/A'}</p>
                <p><strong>Técnicas aplicadas:</strong> {selectedHistoria.planTratamiento?.aparatologia?.join(', ') || 'Ninguna'}</p>
              </div>
            </div>
            <div className="modal-footer">
              <button onClick={() => setShowModal(false)}>Cerrar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default HistoriaClinica;