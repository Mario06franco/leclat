import React, { forwardRef } from 'react';

const PlantillaHistoriaPDF = forwardRef(({ historia }, ref) => {
  const datos = historia;

  return (
    <div ref={ref} style={{ padding: 20, width: '210mm', backgroundColor: 'white', fontSize: 12 }}>
      <h2 style={{ textAlign: 'center' }}>HISTORIA CLÍNICO-ESTÉTICA DEL PACIENTE</h2>

      <h3>DATOS GENERALES</h3>
      <p><strong>Nombre:</strong> {datos.datosGenerales?.nombreCompleto}</p>
      <p><strong>Edad:</strong> {datos.datosGenerales?.edad}</p>
      <p><strong>Fecha de nacimiento:</strong> {datos.datosGenerales?.fechaNacimiento?.slice(0, 10)}</p>
      <p><strong>Ocupación:</strong> {datos.datosGenerales?.ocupacion}</p>
      <p><strong>Teléfono:</strong> {datos.datosGenerales?.telefono}</p>
      <p><strong>Correo:</strong> {datos.datosGenerales?.correo}</p>
      <p><strong>Motivo de la consulta:</strong> {datos.datosGenerales?.motivo || '—'}</p> {/* ← NUEVO CAMPO AGREGADO */}

      <h3>HISTORIAL CLÍNICO</h3>
      <p><strong>Afecciones cutáneas:</strong> {datos.historialClinico?.afeccionesCutaneas?.join(', ') || '—'}</p>
      <p><strong>Enfermedades crónicas:</strong> {datos.historialClinico?.enfermedadesCronicas?.join(', ') || '—'}</p>
      <p><strong>Alergias:</strong> {datos.historialClinico?.alergias?.join(', ') || '—'}</p>
      <p><strong>Medicación actual:</strong> {datos.historialClinico?.medicacionActual || '—'}</p>
      <p><strong>Embarazo/Lactancia:</strong> {datos.historialClinico?.embarazoLactancia?.tipo || '—'}</p>

      <h3>ESTILO DE VIDA Y HÁBITOS</h3>
      <p><strong>Nivel de estrés:</strong> {datos.estiloVidaYHabitos?.nivelEstres}</p>
      <p><strong>Agua diaria:</strong> {datos.estiloVidaYHabitos?.consumoAgua} litros</p>
      <p><strong>Alimentación:</strong> {datos.estiloVidaYHabitos?.alimentacion}</p>
      <p><strong>Horas de sueño:</strong> {datos.estiloVidaYHabitos?.horasSueño}</p>
      <p><strong>Consumo:</strong> 
        {datos.estiloVidaYHabitos?.consumoSustancias?.alcohol ? ' Alcohol,' : ''}
        {datos.estiloVidaYHabitos?.consumoSustancias?.tabaco ? ' Tabaco,' : ''}
        {datos.estiloVidaYHabitos?.consumoSustancias?.cafeina ? ' Cafeína' : ''}
      </p>

      <h3>CUIDADO FACIAL ACTUAL</h3>
      <p><strong>Protector solar:</strong> {datos.cuidadoFacialActual?.protectorSolar}</p>
      <p><strong>Frecuencia limpieza facial:</strong> {datos.cuidadoFacialActual?.frecuenciaLimpiezaFacial}</p>
      <p><strong>Productos actuales:</strong> {datos.cuidadoFacialActual?.productosActuales?.join(', ') || '—'}</p>
      <p><strong>Rutina diaria:</strong> {datos.cuidadoFacialActual?.rutinaDiaria?.join(', ') || '—'}</p>

      <h3>DIAGNÓSTICO FACIAL</h3>
      <p><strong>Tipo de piel:</strong> {datos.diagnosticoFacial?.tipoPiel}</p>
      <p><strong>Observación visual:</strong> {datos.diagnosticoFacial?.observacionVisual?.join(', ') || '—'}</p>
      <p><strong>Observación lámpara de Wood:</strong> {datos.diagnosticoFacial?.observacionLamparaWood?.join(', ') || '—'}</p>
      <p><strong>Observación táctil:</strong> {datos.diagnosticoFacial?.observacionTactil?.join(', ') || '—'}</p>

      <h3>PLAN DE TRATAMIENTO</h3>
      <p><strong>Diagnóstico final:</strong> {datos.planTratamiento?.diagnosticoFinal}</p>
      <p><strong>Tratamiento recomendado:</strong> {datos.planTratamiento?.tratamientoRecomendado}</p>
      <p><strong>Frecuencia sugerida:</strong> {datos.planTratamiento?.frecuenciaSugerida}</p>
      <p><strong>Número de sesiones:</strong> {datos.planTratamiento?.numSesiones}</p>
      <p><strong>Aparatología/Técnicas:</strong> {datos.planTratamiento?.aparatologia?.join(', ') || '—'}</p>

      <div style={{ marginTop: '30px', textAlign: 'center', fontSize: '10px' }}>
        <p>Documento generado el: {new Date().toLocaleDateString()}</p>
      </div>
    </div>
  );
});

export default PlantillaHistoriaPDF;