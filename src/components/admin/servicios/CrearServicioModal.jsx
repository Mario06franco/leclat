import React, { useState, useRef, useEffect } from 'react';
import './servicios1.css';
import axios from 'axios';

const CrearServicioModal = ({ show, onClose, onCreate }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    precio: '',
    descripcion: '',
    indicaciones: '',
    frecuencia_recomendada: '',
    duracion: '',
    contraindicaciones: '',
    categoria: ''
  });

  const [imagen, setImagen] = useState(null);
  const [preview, setPreview] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);

  const categorias = [
    { value: 'facial', label: 'facial' },
    { value: 'corporal', label: 'corporal' },
    { value: 'relajante', label: 'relajante' },
    { value: 'otros', label: 'otros' }
  ];

  // ✅ Resetea todo al abrir
  useEffect(() => {
    if (show) {
      setFormData({
        nombre: '',
        precio: '',
        descripcion: '',
        indicaciones: '',
        frecuencia_recomendada: '',
        duracion: '',
        contraindicaciones: '',
        categoria: ''
      });
      setImagen(null);
      setPreview('');
      setErrors({});
    }
  }, [show]);

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, imagen: 'La imagen no debe exceder 5MB' }));
        return;
      }

      if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
        setErrors(prev => ({ ...prev, imagen: 'Solo se permiten imágenes JPEG, JPG o PNG' }));
        return;
      }

      setImagen(file);
      setErrors(prev => ({ ...prev, imagen: '' }));

      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.nombre.trim()) newErrors.nombre = 'El nombre es requerido';
    if (!formData.precio) newErrors.precio = 'El precio es requerido';
    if (isNaN(formData.precio) || formData.precio <= 0) newErrors.precio = 'Precio inválido';
    if (!formData.duracion.trim()) newErrors.duracion = 'La duración es requerida';
    if (!formData.descripcion.trim()) newErrors.descripcion = 'La descripción es requerida';
    if (!formData.categoria) newErrors.categoria = 'La categoría es requerida';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  if (!validateForm()) return;
  setIsLoading(true);

  try {
    const servicioData = {
      nombre: formData.nombre.trim(),
      precio: Number(formData.precio),
      descripcion: formData.descripcion.trim(),
      duracion: formData.duracion.trim(),
      categoria: formData.categoria, // ✅ Asegúrate que esto no sea null/undefined
      indicaciones: formData.indicaciones.trim() || 'Por definir',
      frecuencia_recomendada: formData.frecuencia_recomendada.trim() || 'Por definir',
      contraindicaciones: formData.contraindicaciones.trim() || 'Ninguna',
      imagen: 'https://via.placeholder.com/300x200?text=Servicio+Image',
      activo: true
    };

    console.log('📤 Enviando al backend:', servicioData);
    console.log('Categoría enviada:', servicioData.categoria); // ✅ Debug específico

    const response = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/api/servicios`,
      servicioData,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 15000
      }
    );

    console.log('✅ Respuesta del backend:', response.data); // ✅ Ver respuesta

    const servicioCreado = response.data.data || response.data;

    if (onCreate) {
      onCreate(servicioCreado);
    }

    onClose();
    
  } catch (error) {
    console.error('❌ Error completo:', error.response?.data || error); // ✅ Error detallado
    let errorMessage = 'Error al crear el servicio';
    if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error.message) {
      errorMessage = error.message;
    }
    setErrors(prev => ({ ...prev, general: errorMessage }));
  } finally {
    setIsLoading(false);
  }
};

  if (!show) return null;

  return (
    <div className="modal-overlay-servicio">
      <div className="modal-container-servicio">
        <div className="modal-header-servicio">
          <h3>Crear Nuevo Servicio</h3>
          <button className="modal-close-servicio" onClick={onClose} disabled={isLoading}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body-servicio">
          {errors.general && <div className="error-message-general">⚠️ {errors.general}</div>}

          <div className="form-row-servicio">
            <div className="form-group-servicio">
              <label className="required-field">Nombre del Servicio</label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                className={errors.nombre ? 'has-error' : ''}
                placeholder="Ej: Limpieza Facial Profunda"
                disabled={isLoading}
              />
              {errors.nombre && <span className="error-message">{errors.nombre}</span>}
            </div>

            <div className="form-group-servicio">
              <label className="required-field">Categoría</label>
              <select
                name="categoria"
                value={formData.categoria}
                onChange={handleChange}
                className={errors.categoria ? 'has-error' : ''}
                disabled={isLoading}
              >
                <option value="">Selecciona una categoría</option>
                {categorias.map(cat => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
              {errors.categoria && <span className="error-message">{errors.categoria}</span>}
            </div>
          </div>

          <div className="form-row-servicio">
            <div className="form-group-servicio">
              <label className="required-field">Precio ($)</label>
              <input
                type="number"
                name="precio"
                value={formData.precio}
                onChange={handleChange}
                className={errors.precio ? 'has-error' : ''}
                min="0"
                step="1000"
                placeholder="50000"
                disabled={isLoading}
              />
              {errors.precio && <span className="error-message">{errors.precio}</span>}
            </div>

            <div className="form-group-servicio">
              <label className="required-field">Duración</label>
              <input
                type="text"
                name="duracion"
                value={formData.duracion}
                onChange={handleChange}
                placeholder="60 min"
                className={errors.duracion ? 'has-error' : ''}
                disabled={isLoading}
              />
              {errors.duracion && <span className="error-message">{errors.duracion}</span>}
            </div>
          </div>

          <div className="form-group-servicio">
            <label>Imagen del Servicio</label>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              accept="image/jpeg, image/png, image/jpg"
              style={{ display: 'none' }}
              disabled={isLoading}
            />

            <div className="image-upload-container">
              {preview ? (
                <div className="image-preview">
                  <img src={preview} alt="Vista previa" />
                  <button
                    type="button"
                    className="btn-cambiar-imagen"
                    onClick={triggerFileInput}
                    disabled={isLoading}
                  >
                    Cambiar Imagen
                  </button>
                </div>
              ) : (
                <div
                  className="upload-placeholder"
                  onClick={triggerFileInput}
                  style={{
                    cursor: isLoading ? 'not-allowed' : 'pointer',
                    opacity: isLoading ? 0.6 : 1
                  }}
                >
                  <span>+ Seleccionar Imagen</span>
                  <p>Formatos: JPG, PNG (Max. 5MB)</p>
                </div>
              )}
              {errors.imagen && <span className="error-message">{errors.imagen}</span>}
            </div>
          </div>

          <div className="form-group-servicio">
            <label className="required-field">Descripción</label>
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              className={errors.descripcion ? 'has-error' : ''}
              placeholder="Describe el servicio en detalle..."
              rows="3"
              disabled={isLoading}
            />
            {errors.descripcion && <span className="error-message">{errors.descripcion}</span>}
          </div>

          <div className="form-group-servicio">
            <label>Indicaciones</label>
            <textarea
              name="indicaciones"
              value={formData.indicaciones}
              onChange={handleChange}
              placeholder="Instrucciones para el cliente antes del servicio"
              rows="2"
              disabled={isLoading}
            />
          </div>

          <div className="form-row-servicio">
            <div className="form-group-servicio">
              <label>Frecuencia Recomendada</label>
              <input
                type="text"
                name="frecuencia_recomendada"
                value={formData.frecuencia_recomendada}
                onChange={handleChange}
                placeholder="Cada 3 semanas"
                disabled={isLoading}
              />
            </div>

            <div className="form-group-servicio">
              <label>Contraindicaciones</label>
              <input
                type="text"
                name="contraindicaciones"
                value={formData.contraindicaciones}
                onChange={handleChange}
                placeholder="No aplicar en pieles sensibles"
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="modal-footer-servicio">
            <button type="button" className="btn-cancelar-servicio" onClick={onClose} disabled={isLoading}>
              Cancelar
            </button>
            <button type="submit" className="btn-guardar-servicio" disabled={isLoading}>
              {isLoading ? (<><span className="spinner"></span> Guardando...</>) : 'Guardar Servicio'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CrearServicioModal;
