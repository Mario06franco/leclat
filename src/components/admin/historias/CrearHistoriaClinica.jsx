import React, {useEffect ,useState } from 'react';
import './CrearHistoriaClinica.css';



const getInitialFormData = (data) => {
  if (data && data.datosGenerales) {
    return {
      ...data,
      ...data.datosGenerales,
      fechaNacimiento: data.datosGenerales.fechaNacimiento
        ? new Date(data.datosGenerales.fechaNacimiento).toISOString().split('T')[0]
        : '', // Formato YYYY-MM-DD
      ...data.historialClinico,
      ...data.estiloVidaYHabitos,
      ...data.cuidadoFacialActual,
      ...data.diagnosticoFacial,
      ...data.planTratamiento,
    };
  }
  return {
    nombreCompleto: '',
    edad: '',
    fechaNacimiento: '',
    ocupacion: '',
    telefono: '',
    correo: '',
    afeccionesCutaneas: [],
    enfermedadesCronicas: [],
    alergias: '',
    medicacionActual: '',
    tipoEmbarazoLactancia: 'No',
    semanasEmbarazo: '',
    tratamientoMedicoActual: '',
    medicamentosContinuos: 'No',
    detalleMedicamentosContinuos: '',
    cirugiasRecientes: 'No',
    detalleCirugiasRecientes: '',
    nivelEstres: 'Medio',
    aguaDiaria: '',
    alimentacion: 'Balanceada',
    horasSueno: '',
    consumoAlcohol: false,
    consumoTabaco: false,
    consumoCafe: false,
    protectorSolar: 'No',
    frecuenciaLimpieza: 'Nunca',
    productosActuales: '',
    rutinaDiaria: '',
    biotipoCutaneo: 'Normal',
    observacionVisual: [],
    observacionLamparaWood: [],
    observacionTactil: [],
    diagnosticoFacial: '',
    tratamientoRecomendado: '',
    frecuenciaSugerida: '',
    numeroSesiones: '',
    tecnicasAplicadas: ''
  };
};

const CrearHistoriaClinica = ({ data = {}, onClose, onGuardado }) => {
  const [formData, setFormData] = useState(getInitialFormData(data));
  const [expandedSection, setExpandedSection] = useState('datosGenerales');

  useEffect(() => {
    setFormData(getInitialFormData(data));
  }, [data]);

  // Cambia el nombre de handleChange a handleInputChange o actualiza las referencias
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleCheckboxChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: formData[name]?.includes(value)
        ? formData[name].filter((item) => item !== value)
        : [...(formData[name] || []), value],
    });
  };

  const handleAccordionToggle = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const handleSubmit = async () => {
    try {
      const dataToSend = {
        cedula: formData.cedula,
        datosGenerales: {
          nombreCompleto: formData.nombreCompleto,
          edad: Number(formData.edad),
          fechaNacimiento: formData.fechaNacimiento,
          ocupacion: formData.ocupacion,
          telefono: formData.telefono,
          correo: formData.correo,
        },
        historialClinico: {
          afeccionesCutaneas: formData.afeccionesCutaneas || [],
          enfermedadesCronicas: formData.enfermedadesCronicas || [],
          alergias: typeof formData.alergias === 'string'
            ? formData.alergias.split(',').map(a => a.trim())
            : [],
          medicacionActual: formData.medicacionActual || '',
          embarazoLactancia: {
            tipo: formData.tipoEmbarazoLactancia || 'No',
            semanasEmbarazo: formData.semanasEmbarazo || null,
          },
          tratamientoMedicoActual: formData.tratamientoMedicoActual || '',
          medicamentosContinuos: formData.medicamentosContinuos === 'Sí' && formData.detalleMedicamentosContinuos
            ? [formData.detalleMedicamentosContinuos]
            : [],
          cirugiasRecientes: formData.cirugiasRecientes === 'Sí' && formData.detalleCirugiasRecientes
            ? [formData.detalleCirugiasRecientes]
            : [],
        },
        estiloVidaYHabitos: {
          nivelEstres: formData.nivelEstres || 'Medio',
          consumoAgua: Number(formData.aguaDiaria) || 0,
          alimentacion: formData.alimentacion || 'Balanceada',
          horasSueño: Number(formData.horasSueno) || 7,
          consumoSustancias: {
            alcohol: !!formData.consumoAlcohol,
            tabaco: !!formData.consumoTabaco,
            cafeina: !!formData.consumoCafe,
          }
        },
        cuidadoFacialActual: {
          protectorSolar: formData.protectorSolar || 'No',
          frecuenciaLimpiezaFacial: formData.frecuenciaLimpieza || 'Nunca',
          productosActuales: formData.productosActuales || [],
          rutinaDiaria: formData.rutinaDiaria || [],
        },
        diagnosticoFacial: {
          tipoPiel: formData.biotipoCutaneo || 'Normal',
          observacionVisual: formData.observacionVisual || [],
          observacionLamparaWood: formData.observacionLamparaWood || [],
          observacionTactil: formData.observacionTactil || [],
        },
        planTratamiento: {
          diagnosticoFinal: typeof formData.diagnosticoFacial === 'string'
            ? formData.diagnosticoFacial
            : JSON.stringify(formData.diagnosticoFacial || ''),
          tratamientoRecomendado: formData.tratamientoRecomendado || '',
          frecuenciaSugerida: Number(formData.frecuenciaSugerida) || 1,
          numSesiones: Number(formData.numeroSesiones) || 1,
          aparatologia: (formData.tecnicasAplicadas || '').split('\n').filter(Boolean),
        }
      };
  
      // Eliminar campos vacíos
      Object.keys(dataToSend).forEach(key => {
        if (!dataToSend[key] || (Array.isArray(dataToSend[key]) && dataToSend[key].length === 0)) {
          delete dataToSend[key];
        }
      });
  
      const url = formData._id
        ? `${import.meta.env.VITE_BACKEND_URL}/api/historias/${formData._id}`
        : '${backendUrl}/api/historias';
      const method = formData._id ? 'PUT' : 'POST';
  
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(dataToSend),
      });
      
      console.log('Raw response:', response);
      
      const result = await response.text(); // Cambia a .text() temporalmente para inspeccionar la respuesta
      console.log('Response body:', result);
      
      if (!response.ok) {
        throw new Error(result || 'Error al guardar la historia clínica');
      }
  
      alert(result.message || (formData._id ? 'Historia clínica actualizada con éxito' : 'Historia clínica creada con éxito'));
  
      if (onGuardado) onGuardado();
      if (onClose) onClose();
    } catch (error) {
      console.error('Error al guardar:', error);
      alert(error.message || 'Error al guardar la historia clínica');
    }
  };

  const calcularEdad = (fechaNacimiento) => {
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }
    return edad;
  };

  // Asegúrate de que todos los inputs usen handleInputChange en lugar de handleChange
  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2>FICHA CLÍNICO-ESTÉTICA DEL PACIENTE</h2>
          <button className="close-btn" onClick={onClose}>X</button>
        </div>
        <div className="form-container">
          <div className="accordion">
            {/* DATOS GENERALES */}
            <div className={`accordion-item ${expandedSection === 'datosGenerales' ? 'active' : ''}`}>
              <button
                className="accordion-header"
                onClick={() => handleAccordionToggle('datosGenerales')}
              >
                DATOS GENERALES
              </button>
              <div className="accordion-body">
                <label>Nombre completo</label>
                <input
                  type="text"
                  name="nombreCompleto"
                  value={formData.nombreCompleto || ''}
                  onChange={handleInputChange} //Cambiado a handleInputChange 
                />
                <label>Edad</label>
                <input
                  type="text"
                  name="edad"
                  value={formData.edad || ''}
                  onChange={handleInputChange}
                />
                <label>Fecha de nacimiento</label>
                <input
                  type="date"
                  name="fechaNacimiento"
                  value={formData.fechaNacimiento || ''}
                  onChange={handleInputChange}
                />
                <label>Ocupación</label>
                <input
                  type="text"
                  name="ocupacion"
                  value={formData.ocupacion || ''}
                  onChange={handleInputChange}
                />
                <label>Teléfono</label>
                <input
                  type="text"
                  name="telefono"
                  value={formData.telefono || ''}
                  onChange={handleInputChange}
                />
                <label>Correo electrónico</label>
                <input
                  type="email"
                  name="correo"
                  value={formData.correo || ''}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            {/* HISTORIAL CLÍNICO */}
            <div className={`accordion-item ${expandedSection === 'historialClinico' ? 'active' : ''}`}>
              <button
                className="accordion-header"
                onClick={() => handleAccordionToggle('historialClinico')}
              >
                HISTORIAL CLÍNICO
              </button>
              <div className="accordion-body">
                <label>Afecciones cutáneas diagnosticadas</label>
                <div>
                  <input
                    type="checkbox"
                    name="afeccionesCutaneas"
                    value="Acné"
                    onChange={handleCheckboxChange}
                  /> Acné
                  <input
                    type="checkbox"
                    name="afeccionesCutaneas"
                    value="Rosácea"
                    onChange={handleCheckboxChange}
                  /> Rosácea
                  <input
                    type="checkbox"
                    name="afeccionesCutaneas"
                    value="Dermatitis atópica"
                    onChange={handleCheckboxChange}
                  /> Dermatitis atópica
                  <input
                    type="checkbox"
                    name="afeccionesCutaneas"
                    value="Dermatitis seborreica"
                    onChange={handleCheckboxChange}
                  /> Dermatitis seborreica
                  <input
                    type="checkbox"
                    name="afeccionesCutaneas"
                    value="Melasma"
                    onChange={handleCheckboxChange}
                  /> Melasma
                  <input
                    type="checkbox"
                    name="afeccionesCutaneas"
                    value="Psoriasis"
                    onChange={handleCheckboxChange}
                  /> Psoriasis
                  <input
                    type="checkbox"
                    name="afeccionesCutaneas"
                    value="Urticaria"
                    onChange={handleCheckboxChange}
                  /> Urticaria
                  <input
                    type="checkbox"
                    name="afeccionesCutaneas"
                    value="Hiperpigmentación postinflamatoria"
                    onChange={handleCheckboxChange}
                  /> Hiperpigmentación postinflamatoria
                  <input
                    type="checkbox"
                    name="afeccionesCutaneas"
                    value="Piel sensible/reactiva"
                    onChange={handleCheckboxChange}
                  /> Piel sensible/reactiva
                  <input
                    type="checkbox"
                    name="afeccionesCutaneas"
                    value="otra"
                    onChange={handleCheckboxChange}
                  /> otra
                  {/* Add more conditions as per the list */}
                </div>
                <label>Enfermedades crónicas</label>
                <div>
                  <input
                    type="checkbox"
                    name="enfermedadesCronicas"
                    value="Hipotiroidismo"
                    onChange={handleCheckboxChange}
                  /> Hipotiroidismo
                  <input
                    type="checkbox"
                    name="enfermedadesCronicas"
                    value="Diabetes"
                    onChange={handleCheckboxChange}
                  /> Diabetes
                  <input
                    type="checkbox"
                    name="enfermedadesCronicas"
                    value="Hipertensión"
                    onChange={handleCheckboxChange}
                  /> Hipertensión
                  <input
                    type="checkbox"
                    name="enfermedadesCronicas"
                    value="Asma"
                    onChange={handleCheckboxChange}
                  /> Asma
                  <input
                    type="checkbox"
                    name="enfermedadesCronicas"
                    value="Lupus"
                    onChange={handleCheckboxChange}
                  /> Lupus
                  <input
                    type="checkbox"
                    name="enfermedadesCronicas"
                    value="Enfermedades autoinmunes"
                    onChange={handleCheckboxChange}
                  /> Enfermedades autoinmunes
                  <input
                    type="checkbox"
                    name="enfermedadesCronicas"
                    value="Otra:"
                    onChange={handleCheckboxChange}
                  /> Otra
                  {/* Add more conditions as per the list */}
                </div>
                <label>Alergias </label>
                <input
                  type="text"
                  name="alergias"
                  value={formData.alergias || ''}
                  onChange={handleInputChange}
                />
                <label>Medicación actual</label>
                <input
                  type="text"
                  name="medicacionActual"
                  value={formData.medicacionActual || ''}
                  onChange={handleInputChange}
                />
                {/* Embarazo/Lactancia */}
                <div className="form-group">
                  <label htmlFor="tipoEmbarazoLactancia">Estado (Embarazo/Lactancia):</label>
                  <select
                    id="tipoEmbarazoLactancia"
                    name="tipoEmbarazoLactancia"
                    value={formData.tipoEmbarazoLactancia || 'No'}
                    onChange={handleInputChange}
                  >
                    <option value="No">No</option>
                    <option value="Embarazo">Embarazo</option>
                    <option value="Lactancia">Lactancia</option>
                  </select>
                </div>

                {formData.tipoEmbarazoLactancia === 'Embarazo' && (
                  <div className="form-group">
                    <label htmlFor="semanasEmbarazo">Semanas de Embarazo:</label>
                    <input
                      type="number"
                      id="semanasEmbarazo"
                      name="semanasEmbarazo"
                      value={formData.semanasEmbarazo || ''}
                      onChange={handleInputChange}
                      min="1"
                      placeholder="Ingrese las semanas"
                    />
                  </div>
                )}

                {/* Tratamiento médico actual */}
                <div className="form-group">
                  <label>¿Está bajo tratamiento médico actual?</label>
                  <div>
                    <input
                      type="radio"
                      name="tratamientoMedicoActual"
                      value="No"
                      checked={formData.tratamientoMedicoActual === 'No'}
                      onChange={handleInputChange}
                    /> No
                    <input
                      type="radio"
                      name="tratamientoMedicoActual"
                      value="Sí"
                      checked={formData.tratamientoMedicoActual === 'Sí'}
                      onChange={handleInputChange}
                    /> Sí
                  </div>
                  {formData.tratamientoMedicoActual === 'Sí' && (
                    <input
                      type="text"
                      name="detalleTratamientoMedicoActual"
                      value={formData.detalleTratamientoMedicoActual || ''}
                      onChange={handleInputChange}
                      placeholder="¿Cuál?"
                    />
                  )}
                </div>

                {/* Medicamentos de uso continuo */}
                <div className="form-group">
                  <label>¿Usa medicamentos de forma continua?</label>
                  <div>
                    <input
                      type="radio"
                      name="medicamentosContinuos"
                      value="No"
                      checked={formData.medicamentosContinuos === 'No'}
                      onChange={handleInputChange}
                    /> No
                    <input
                      type="radio"
                      name="medicamentosContinuos"
                      value="Sí"
                      checked={formData.medicamentosContinuos === 'Sí'}
                      onChange={handleInputChange}
                    /> Sí
                  </div>
                  {formData.medicamentosContinuos === 'Sí' && (
                    <input
                      type="text"
                      name="detalleMedicamentosContinuos"
                      value={formData.detalleMedicamentosContinuos || ''}
                      onChange={handleInputChange}
                      placeholder="¿Cuál(es)?"
                    />
                  )}
                </div>

                {/* Cirugías recientes o tratamientos estéticos previos */}
                <div className="form-group">
                  <label>¿Tiene cirugías recientes o tratamientos estéticos previos?</label>
                  <div>
                    <input
                      type="radio"
                      name="cirugiasRecientes"
                      value="No"
                      checked={formData.cirugiasRecientes === 'No'}
                      onChange={handleInputChange}
                    /> No
                    <input
                      type="radio"
                      name="cirugiasRecientes"
                      value="Sí"
                      checked={formData.cirugiasRecientes === 'Sí'}
                      onChange={handleInputChange}
                    /> Sí
                  </div>
                  {formData.cirugiasRecientes === 'Sí' && (
                    <input
                      type="text"
                      name="detalleCirugiasRecientes"
                      value={formData.detalleCirugiasRecientes || ''}
                      onChange={handleInputChange}
                      placeholder="¿Cuáles?"
                    />
                  )}
                </div>
                
              </div>
            </div>

            {/* ESTILO DE VIDA Y HÁBITOS */}
            <div className={`accordion-item ${expandedSection === 'estiloDeVida' ? 'active' : ''}`}>
              <button
                className="accordion-header"
                onClick={() => handleAccordionToggle('estiloDeVida')}
              >
                ESTILO DE VIDA Y HÁBITOS
              </button>
              <div className="accordion-body">
                <label>Nivel de estrés</label>
                <select
                  name="nivelEstres"
                  value={formData.nivelEstres || ''}
                  onChange={handleInputChange}
                >
                  <option value="Bajo">Bajo</option>
                  <option value="Medio">Medio</option>
                  <option value="Alto">Alto</option>
                </select>
                <label>Consumo de agua diario</label>
                <input
                  type="number"
                  name="aguaDiaria"
                  value={formData.aguaDiaria || ''}
                  onChange={handleInputChange}
                />
                <label>Alimentación</label>
                <select
                  name="alimentacion"
                  value={formData.alimentacion || ''}
                  onChange={handleInputChange}
                >
                  <option value="Balanceada">Balanceada</option>
                  <option value="Desordenada">Desordenada</option>
                  <option value="Rica en grasas">Rica en grasas</option>
                </select>
                <label>Horas de sueño</label>
                <input
                  type="number"
                  name="horasSueno"
                  value={formData.horasSueno || ''}
                  onChange={handleInputChange}
                />
                <label>Consumo de:</label>
                <div>
                  <input
                    type="checkbox"
                    name="consumoAlcohol"
                    onChange={handleCheckboxChange}
                  /> Alcohol
                  <input
                    type="checkbox"
                    name="consumoTabaco"
                    onChange={handleCheckboxChange}
                  /> Tabaco
                  <input
                    type="checkbox"
                    name="consumoCafe"
                    onChange={handleCheckboxChange}
                  /> Cafeína
                </div>
              </div>
            </div>

            {/* CUIDADO FACIAL ACTUAL */}
            <div className={`accordion-item ${expandedSection === 'cuidadoFacial' ? 'active' : ''}`}>
              <button
                className="accordion-header"
                onClick={() => handleAccordionToggle('cuidadoFacial')}
              >
                CUIDADO FACIAL ACTUAL
              </button>
              <div className="accordion-body">
                <label>¿Utiliza protector solar?</label>
                <div>
                  <input
                    type="radio"
                    name="protectorSolar"
                    value="Si"
                    onChange={handleInputChange}
                  /> Si
                  <input
                    type="radio"
                    name="protectorSolar"
                    value="No"
                    onChange={handleInputChange}
                  /> No
                  <input
                    type="radio"
                    name="protectorSolar"
                    value="A veces"
                    onChange={handleInputChange}
                  /> A veces
                </div>
                <label>Frecuencia de limpieza facial</label>
                <select
                  name="frecuenciaLimpieza"
                  value={formData.frecuenciaLimpieza || ''}
                  onChange={handleInputChange}
                >
                  <option value="Mensual">Mensual</option>
                  <option value="Trimestral">Trimestral</option>
                  <option value="Nunca">Nunca</option>
                </select>
                <label>Productos actuales</label>
                <textarea
                  name="productosActuales"
                  value={formData.productosActuales || '' }
                  onChange={handleInputChange}
                />

                <label>Rutina diaria</label>
                <textarea
                  name="rutinaDiaria"
                  value={formData.rutinaDiaria || ''}
                  onChange={handleInputChange}
                />

              </div>
            </div>

            {/* DIAGNÓSTICO FACIAL */}
            <div className={`accordion-item ${expandedSection === 'diagnosticoFacial' ? 'active' : ''}`}>
              <button
                className="accordion-header"
                onClick={() => handleAccordionToggle('diagnosticoFacial')}
              >
                DIAGNÓSTICO FACIAL
              </button>
              <div className="accordion-body">
                <label>Foto tipo (Escala de Fitzpatrick)</label>
                <div>
                  <input
                    type="radio"
                    name="fotoTipo"
                    value="I"
                    onChange={handleInputChange}
                  /> I
                  <input
                    type="radio"
                    name="fotoTipo"
                    value="II"
                    onChange={handleInputChange}
                  /> II
                  <input
                    type="radio"
                    name="fotoTipo"
                    value="III"
                    onChange={handleInputChange}
                  /> III
                  <input
                    type="radio"
                    name="fotoTipo"
                    value="IV"
                    onChange={handleInputChange}
                  /> IV
                  <input
                    type="radio"
                    name="fotoTipo"
                    value="V"
                    onChange={handleInputChange}
                  /> V
                  <input
                    type="radio"
                    name="fotoTipo"
                    value="VI"
                    onChange={handleInputChange}
                  /> VI
                  {/* Add more options */}
                </div>
                <label>Biotipo cutáneo</label>
                <div>
                  <input
                    type="radio"
                    name="biotipoCutaneo"
                    value="Normal"
                    onChange={handleInputChange}
                  /> Normal
                  <input
                    type="radio"
                    name="biotipoCutaneo"
                    value="Grasa"
                    onChange={handleInputChange}
                  /> Grasa
                  <input
                    type="radio"
                    name="biotipoCutaneo"
                    value="Seca"
                    onChange={handleInputChange}
                  /> Seca
                  <input
                    type="radio"
                    name="biotipoCutaneo"
                    value="Mixta"
                    onChange={handleInputChange}
                  /> Mixta
                  <input
                    type="radio"
                    name="biotipoCutaneo"
                    value="Sensible/Reactiva"
                    onChange={handleInputChange}
                  /> Sensible/Reactiva
                  {/* Add more options */}
                </div>
                <label>Observación visual (luz blanca)</label>
                <div>
                  <input
                    type="checkbox"
                    name="observacionVisual"
                    value="Manchas"
                    onChange={handleCheckboxChange}
                  /> Manchas
                  <input
                    type="checkbox"
                    name="observacionVisual"
                    value="Deshidratación"
                    onChange={handleCheckboxChange}
                  /> Deshidratación
                  <input
                    type="checkbox"
                    name="observacionVisual"
                    value="Flacidez"
                    onChange={handleCheckboxChange}
                  /> Flacidez
                  <input
                    type="checkbox"
                    name="observacionVisual"
                    value="Poros dilatados"
                    onChange={handleCheckboxChange}
                  /> Poros dilatados
                  <input
                    type="checkbox"
                    name="observacionVisual"
                    value="Comedones"
                    onChange={handleCheckboxChange}
                  /> Comedones
                  <input
                    type="checkbox"
                    name="observacionVisual"
                    value="Enrojecimiento"
                    onChange={handleCheckboxChange}
                  /> Enrojecimiento
                  <input
                    type="checkbox"
                    name="observacionVisual"
                    value="Textura irregular"
                    onChange={handleCheckboxChange}
                  /> Textura irregular
                  <input
                    type="checkbox"
                    name="observacionVisual"
                    value="Arrugas finas"
                    onChange={handleCheckboxChange}
                  /> Arrugas finas
                  {/* Add more options */}
                </div>
                <label>Observación con lámpara de Wood</label>
                <div>
                  {/* Add options for observations */}
                </div>
              </div>
            </div>

            {/* VALORACIÓN FINAL Y PLAN DE TRATAMIENTO */}
            <div className={`accordion-item ${expandedSection === 'valoracionFinal' ? 'active' : ''}`}>
              <button
                className="accordion-header"
                onClick={() => handleAccordionToggle('valoracionFinal')}
              >
                VALORACIÓN FINAL Y PLAN DE TRATAMIENTO
              </button>
              <div className="accordion-body">
                <label>Diagnóstico facial</label>
                <textarea
                  name="diagnosticoFacial"
                  value={formData.diagnosticoFacial || ''}
                  onChange={handleInputChange}
                />
                <label>Tratamiento recomendado</label>
                <textarea
                  name="tratamientoRecomendado"
                  value={formData.tratamientoRecomendado || ''}
                  onChange={handleInputChange}
                />
                <label>Frecuencia sugerida</label>
                <input
                  type="text"
                  name="frecuenciaSugerida"
                  value={formData.frecuenciaSugerida || ''}
                  onChange={handleInputChange}
                />
                <label>Número de sesiones</label>
                <input
                  type="number"
                  name="numeroSesiones"
                  value={formData.numeroSesiones || ''}
                  onChange={handleInputChange}
                />
                <label>Aparatología o Técnicas aplicadas</label>
                <textarea
                  name="tecnicasAplicadas"
                  value={formData.tecnicasAplicadas || ''}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button onClick={handleSubmit}>Guardar y Cerrar</button>
            <button onClick={onClose}>Cancelar</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrearHistoriaClinica;
