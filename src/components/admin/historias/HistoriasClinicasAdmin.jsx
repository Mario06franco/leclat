import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CrearHistoriaClinica from './CrearHistoriaClinica';
import './HistoriasClinicasAdmin.css';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import PlantillaHistoriaPDF from './PlantillaHistoriaPDF';
import { createRoot } from 'react-dom/client';
const backendUrl = import.meta.env.VITE_BACKEND_URL;

const HistoriasClinicasAdmin = () => {
  const [historias, setHistorias] = useState([]);
  const [cedulaInput, setCedulaInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [mensajeError, setMensajeError] = useState('');
  const [modalData, setModalData] = useState(null); // Unificamos los datos del modal

  useEffect(() => {
    fetchHistorias();
  }, []);

  const fetchHistorias = async () => {
    setLoading(true);
    try {
      const response = await axios.get('${backendUrl}/api/historias');
      setHistorias(response.data.data);
    } catch (error) {
      console.error('Error obteniendo historias clínicas:', error);
    }
    setLoading(false);
  };

  const verificarCedula = async () => {
    if (!cedulaInput.trim()) {
      alert('Por favor ingresa una cédula.');
      return;
    }
  
    try {
      // Verificar si el usuario está registrado
      const userResponse = await fetch(`${backendUrl}/api/citas/verificar-usuario?cedula=${cedulaInput}`);
      const userData = await userResponse.json();
  
      if (userResponse.ok && userData.usuarios) {
        // Abrir el modal para crear una nueva historia clínica
        setModalData({
          cedula: userData.usuarios.cedula,
          datosGenerales: {
            nombreCompleto: userData.usuarios.nombre
          },
          modo: 'crear'
        });
        setIsModalVisible(true);
      } else {
        alert('Usuario no registrado.');
      }
    } catch (error) {
      console.error('Error verificando cédula:', error);
      alert('Error al verificar la cédula.');
    }
  };

  const verCompleta = (historia) => {
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.top = '-10000px';
    document.body.appendChild(container);
  
    const root = createRoot(container);
    root.render(<PlantillaHistoriaPDF historia={historia} />);
  
    setTimeout(async () => {
      const canvas = await html2canvas(container);
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`historia_${historia.cedula}.pdf`);
      root.unmount();
      document.body.removeChild(container);
    }, 500);
  };

  const abrirEditar = (historia) => {
    setModalData({
      ...historia,
      modo: 'editar'
    });
    setIsModalVisible(true);
  };

  const cerrarModal = () => {
    setIsModalVisible(false);
    setModalData(null);
    setCedulaInput('');
  };

  function calcularEdad(fechaNacimiento) {
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const m = hoy.getMonth() - nacimiento.getMonth();
    if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }
    return edad;
  }

  return (
    <div className="historias-clinicas-admin">
      <h2>Gestión de Historias Clínicas</h2>

      <div className="toolbar">
        <input
          type="text"
          placeholder="Ingrese cédula"
          value={cedulaInput}
          onChange={(e) => setCedulaInput(e.target.value)}
        />
        <button onClick={verificarCedula}>Buscar Paciente</button>
      </div>

      {mensajeError && <p className="mensaje-error">{mensajeError}</p>}

      {loading ? (
        <p className="loading">Cargando historias clínicas...</p>
      ) : (
        <table className="historias-table">
          <thead>
            <tr>
              <th>Nombre del Paciente</th>
              <th>Cédula</th>
              <th>Fecha de Nacimiento</th>
              <th>Edad</th>
              <th>Diagnóstico Facial</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {historias.length > 0 ? (
              historias.map(historia => (
                <tr key={historia._id}>
                  <td>{historia.datosGenerales?.nombreCompleto || '—'}</td>
                  <td>{historia.cedula || '—'}</td>
                  <td>{historia.datosGenerales?.fechaNacimiento ? historia.datosGenerales.fechaNacimiento.slice(0, 10) : '—'}</td>
                  <td>{historia.datosGenerales?.fechaNacimiento ? calcularEdad(historia.datosGenerales.fechaNacimiento) : '—'}</td>
                  <td>{historia.diagnosticoFacial?.tipoPiel || '—'}</td>
                  <td>
                    <button className="boton-editar" onClick={() => abrirEditar(historia)}>Editar</button>
                    <button className="boton-ver" onClick={() => verCompleta(historia)}>Ver Completa</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">No se encontraron historias clínicas.</td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      {isModalVisible && modalData && (
        <CrearHistoriaClinica
          data={modalData}
          modo={modalData.modo}
          onClose={cerrarModal}
          onGuardado={() => {
            fetchHistorias();
            cerrarModal();
          }}
        />
      )}
    </div>
  );
};

export default HistoriasClinicasAdmin;