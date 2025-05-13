import React, { useState, useRef } from 'react';
import axios from 'axios';
import './servicios1.css';


const CrearServicioModal = ({ show, onClose, onCreate }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    precio: '',
    descripcion: '',
    indicaciones: '',
    frecuencia_recomendada: '',
    duracion: '',
    contraindicaciones: '',
    categoria: 'facial'
  });
  
  const [imagen, setImagen] = useState(null);
  const [preview, setPreview] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);

  const categorias = [
    { value: 'facial', label: 'Facial' },
    { value: 'corporal', label: 'Corporal' },
    { value: 'relajante', label: 'Relajante' },
    { value: 'otros', label: 'Otros' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Limpiar error cuando se modifica el campo
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validar tamaño de imagen (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, imagen: 'La imagen no debe exceder 5MB' }));
        return;
      }
      
      // Validar tipo de imagen
      if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
        setErrors(prev => ({ ...prev, imagen: 'Solo se permiten imágenes JPEG, JPG o PNG' }));
        return;
      }

      setImagen(file);
      setErrors(prev => ({ ...prev, imagen: '' }));
      
      // Crear vista previa
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.nombre.trim()) newErrors.nombre = 'El nombre es requerido';
    if (!formData.precio) newErrors.precio = 'El precio es requerido';
    if (isNaN(formData.precio) || formData.precio <= 0) newErrors.precio = 'Precio inválido';
    if (!formData.duracion.trim()) newErrors.duracion = 'La duración es requerida';
    if (!formData.descripcion.trim()) newErrors.descripcion = 'La descripción es requerida';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Validar el formulario
    if (!validateForm()) return;
  
    setIsLoading(true);
  
    try {
      // Subir la imagen si existe
      let imagenUrl = '';
      if (imagen) {
        const formDataImg = new FormData();
        formDataImg.append('imagen', imagen);
  
        const uploadResponse = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/upload`, formDataImg, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        imagenUrl = uploadResponse.data.url;
      }
  
      // Crear el servicio con los datos
      const servicioData = {
        ...formData,
        precio: Number(formData.precio),
        imagen: imagenUrl,
        activo: true // Por defecto, el servicio estará activo
      };
  
      // Enviar los datos al backend
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/servicios`, servicioData);
  
      // Llamar a la función onCreate para actualizar la lista de servicios
      onCreate(response.data.data);
  
      // Cerrar el modal
      onClose();
    } catch (error) {
      console.error('Error al crear servicio:', error);
      setErrors(prev => ({ ...prev, general: 'Error al crear el servicio. Por favor intente nuevamente.' }));
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
          <button 
            className="modal-close-servicio" 
            onClick={onClose}
            disabled={isLoading}
          >
            ×
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="modal-body-servicio">
          {errors.general && (
            <div className="error-message-general">
              {errors.general}
            </div>
          )}

          <div className="form-row-servicio">
            <div className="form-group-servicio">
              <label className="required-field">Nombre del Servicio</label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                className={errors.nombre ? 'has-error' : ''}
              />
              {errors.nombre && <span className="error-message">{errors.nombre}</span>}
            </div>

            <div className="form-group-servicio">
              <label>Categoría</label>
              <select
                name="categoria"
                value={formData.categoria}
                onChange={handleChange}
              >
                {categorias.map(cat => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
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
                placeholder="Ej: 60 min"
                className={errors.duracion ? 'has-error' : ''}
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
            />
            
            <div className="image-upload-container">
              {preview ? (
                <div className="image-preview">
                  <img src={preview} alt="Vista previa" />
                  <button 
                    type="button" 
                    className="btn-cambiar-imagen"
                    onClick={triggerFileInput}
                  >
                    Cambiar Imagen
                  </button>
                </div>
              ) : (
                <div 
                  className="upload-placeholder"
                  onClick={triggerFileInput}
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
                placeholder="Ej: Cada 3 semanas"
              />
            </div>

            <div className="form-group-servicio">
              <label>Contraindicaciones</label>
              <input
                type="text"
                name="contraindicaciones"
                value={formData.contraindicaciones}
                onChange={handleChange}
                placeholder="Ej: No aplicar en pieles sensibles"
              />
            </div>
          </div>

          <div className="modal-footer-servicio">
            <button 
              type="button" 
              className="btn-cancelar-servicio"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className="btn-guardar-servicio"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="spinner"></span>
                  Guardando...
                </>
              ) : 'Guardar Servicio'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CrearServicioModal;