import axios from 'axios';
import React, { useState, useEffect } from 'react';
import './citaModal.css';

const CitaModal = ({ citaSeleccionada, onGuardar, onCancelar }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    cedula: '',
    fecha: '',
    hora: '',
    servicio: '',
    limitacion: '',
    estado: 'activa',
  });

  useEffect(() => {
    if (citaSeleccionada) {
      setFormData({
        nombre: citaSeleccionada.nombre || '',
        cedula: citaSeleccionada.cedula || '',
        fecha: citaSeleccionada.fecha ? citaSeleccionada.fecha.split('T')[0] : '',
        hora: citaSeleccionada.hora || '',
        servicio: citaSeleccionada.servicio || '',
        limitacion: citaSeleccionada.limitacion || '',
        estado: citaSeleccionada.estado || 'activa',
      });
    } else {
      setFormData({
        nombre: '',
        cedula: '',
        fecha: '',
        hora: '',
        servicio: '',
        limitacion: '',
        estado: 'activa',
      });
    }
  }, [citaSeleccionada]);

  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      const dataToSend = { ...formData };
      const backendUrl = import.meta.env.VITE_BACKEND_URL;
  
      if (citaSeleccionada && citaSeleccionada._id) {
        // ✅ EDITAR usando el _id generado por MongoDB
        await axios.put(`${backendUrl}/api/citas/${citaSeleccionada._id}`, dataToSend);
        alert('Cita actualizada con éxito');
      } else {
        // ✅ CREAR nueva cita
        await axios.post(`${backendUrl}/api/citas/agendar`, dataToSend);
        alert('Cita creada con éxito');
      }
  
      onGuardar();
      onCancelar();
    } catch (error) {
      console.error('Error guardando cita EN EL FRONT:', error);
      alert(
        'Error al guardar cita EN EL FRONT: ' +
        (error.response?.data?.detalle ||
         error.response?.data?.error ||
         error.message)
      );
    }
  };
  


  return (
    <div className="crear-cita-modal">
      <div className="crear-cita-content">
        <button className="cerrar-btn" onClick={onCancelar}>X</button>
        <h3>{citaSeleccionada ? 'Editar Cita' : 'Crear Cita'}</h3>

        <input
          name="nombre"
          placeholder="Nombre"
          value={formData.nombre}
          onChange={handleChange}
        />
        <input
          name="cedula"
          placeholder="Cédula"
          value={formData.cedula}
          onChange={handleChange}
        />
        <input
          name="fecha"
          type="date"
          value={formData.fecha}
          onChange={handleChange}
        />
        <select
          name="hora"
          value={formData.hora}
          onChange={handleChange}
        >
          <option value="">Selecciona una hora</option>
          <option value="09:00">09:00 AM</option>
          <option value="09:30">09:30 AM</option>
          <option value="10:00">10:00 AM</option>
          <option value="10:30">10:30 AM</option>
          <option value="11:00">11:00 AM</option>
          <option value="11:30">11:30 AM</option>
          <option value="12:00">12:00 PM</option>
          <option value="12:30">12:30 PM</option>
          <option value="13:00">01:00 PM</option>
          <option value="13:30">01:30 PM</option>
          <option value="14:00">02:00 PM</option>
          <option value="14:30">02:30 PM</option>
          <option value="15:00">03:00 PM</option>
          <option value="15:30">03:30 PM</option>
          <option value="16:00">04:00 PM</option>
          <option value="16:30">04:30 PM</option>
          <option value="17:00">05:00 PM</option>
          <option value="17:30">05:30 PM</option>
          <option value="18:00">06:00 PM</option>
        </select>
        <select
          name="servicio"
          value={formData.servicio}
          onChange={handleChange}
        >
          <option value="">Selecciona un servicio</option>
          <option value="Facial">Facial</option>
          <option value="Corporal">Corporal</option>
          <option value="Depilación">Depilación</option>
          <option value="Pareja">Pareja</option>
        </select>
        <textarea
          name="limitacion"
          placeholder="Escribe tu limitación o condición"
          value={formData.limitacion}
          onChange={handleChange}
        />

        <div className="crear-cita-actions">
          <button onClick={handleSubmit}>Guardar y Cerrar</button>
          <button onClick={onCancelar}>Cerrar</button>
        </div>
      </div>
    </div>
  );
};

export default CitaModal;