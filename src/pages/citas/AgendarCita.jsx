import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useUser } from '../../context/UserContext';
import './AgendarCita.css';

const AgendarCita = ({ onClose }) => {
  const { usuario: user } = useUser();
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');
  const [servicio, setServicio] = useState('Facial');
  const [tieneLimitacion, setTieneLimitacion] = useState(false);
  const [limitacionTexto, setLimitacionTexto] = useState('');
  const [horasDisponibles, setHorasDisponibles] = useState([]);
  const [mensaje, setMensaje] = useState('');

  const horas = [
    '09:00', '10:00', '11:00', '12:00',
    '13:00', '14:00', '15:00', '16:00',
    '17:00', '18:00'
  ];

  useEffect(() => {
    const obtenerDisponibilidad = async () => {
      if (fecha) {
        try {
          const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/citas/disponibilidad`, {
            params: { fecha }
          });
          const horasOcupadas = response.data.horasOcupadas || [];
          const disponibles = horas.filter(h => !horasOcupadas.includes(h));
          setHorasDisponibles(disponibles);
        } catch (error) {
          console.error('Error al obtener disponibilidad:', error);
        }
      }
    };
    obtenerDisponibilidad();
  }, [fecha]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!fecha || !hora || !servicio) {
      setMensaje('Selecciona fecha, hora y servicio');
      return;
    }

    try {
      const verificar = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/citas/verificar`, {
        params: { fecha, hora }
      });

      if (verificar.data.existe) {
        setMensaje('❌ Esta hora ya está ocupada');
        return;
      }

      const citaData = {
        nombre: user?.nombre || 'Nombre no proporcionado',
        cedula: user?.cedula || 'Sin cédula',
        fecha: typeof fecha === 'string' ? fecha : fecha.toISOString().split('T')[0],
        hora,
        servicio: typeof servicio === 'string' ? servicio : servicio._id || servicio.nombre,
        limitacion: tieneLimitacion ? limitacionTexto : undefined,
      };

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/citas/agendar`,
        citaData
      );

      setMensaje('✅ Cita agendada con éxito');
      setTimeout(() => onClose(), 2000);
    } catch (error) {
      console.error('Error completo:', error.response?.data || error);
      setMensaje(`❌ ${error.response?.data?.error || 'Error al agendar la cita'}`);
    }
  };

  // Mostrar modal si no hay usuario autenticado
  if (!user) {
    return (
      <div className="modal-auth">
        <div className="modal-content auth-modal">
          <button className="close-button" onClick={onClose}>✕</button>
          <h2>Inicia sesión para continuar</h2>
          <p className="auth-message">Debes iniciar sesión o registrarte para agendar una cita.</p>

          <div className="auth-buttons">
            <button className="btn-principal" onClick={() => {
              onClose();
              document.dispatchEvent(new CustomEvent('abrir-modal-auth'));
            }}>
              Iniciar Sesión
            </button>
            <button className="btn-secundario" onClick={onClose}>
              Cancelar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-cita">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>✕</button>
        <h2>Agendar Cita</h2>
        <form onSubmit={handleSubmit}>
          <label>Fecha:</label>
          <input
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
          />

          <label>Hora:</label>
          <select value={hora} onChange={(e) => setHora(e.target.value)}>
            <option value="">Selecciona una hora</option>
            {horasDisponibles.map((h) => (
              <option key={h} value={h}>{h}</option>
            ))}
          </select>

          <label>Tipo de servicio:</label>
          <select value={servicio} onChange={(e) => setServicio(e.target.value)}>
            <option value="Facial">Facial</option>
            <option value="Corporal">Corporal</option>
            <option value="Depilación">Depilación</option>
            <option value="Pareja">Pareja</option>
          </select>

          <label>
            ¿Tienes alguna limitación o condición a considerar?
            <input
              type="checkbox"
              checked={tieneLimitacion}
              onChange={(e) => setTieneLimitacion(e.target.checked)}
            />
          </label>

          {tieneLimitacion && (
            <textarea
              placeholder="Escribe tu limitación o condición"
              value={limitacionTexto}
              onChange={(e) => setLimitacionTexto(e.target.value)}
            />
          )}

          <button type="submit" className="btn-principal">Pedir Cita</button>
        </form>

        {mensaje && <p className="mensaje">{mensaje}</p>}
      </div>
    </div>
  );
};

export default AgendarCita;
