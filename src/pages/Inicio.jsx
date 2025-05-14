import React, { useState, useEffect } from 'react';
import '../css/Inicio.css';
import axios from 'axios';
import AgendarCita from './citas/AgendarCita';
import { Link } from 'react-router-dom';

import facial1 from '../img/facial.jpg';
import facial2 from '../img/masaje.jpg';
import facial3 from '../img/depilacion.jpg';
import corporal1 from '../img/masaje.jpg';
import corporal2 from '../img/facial.jpg';
import corporal3 from '../img/depilacion.jpg';
import relajante1 from '../img/depilacion.jpg';
import relajante2 from '../img/facial.jpg';
import relajante3 from '../img/masaje.jpg';
import masaje from '../img/tatita.png';

const Inicio = () => {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [asunto, setAsunto] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [confirmacion, setConfirmacion] = useState('');
  const [error, setError] = useState('');
  const [mostrarCita, setMostrarCita] = useState(false);
  const [usuario, setUsuario] = useState(null);

  // Objeto con arrays de imágenes para cada servicio
  const serviciosImagenes = {
    faciales: [facial1, facial2, facial3],
    corporales: [corporal1, corporal2, corporal3],
    relajantes: [relajante1, relajante2, relajante3]
  };

  // Estado para llevar el índice de la imagen actual para cada servicio
  const [currentImages, setCurrentImages] = useState({
    faciales: 0,
    corporales: 0,
    relajantes: 0
  });

  useEffect(() => {
    // Configurar intervalos para cambiar imágenes
    const intervalos = Object.keys(serviciosImagenes).map(servicio => {
      return setInterval(() => {
        setCurrentImages(prev => ({
          ...prev,
          [servicio]: (prev[servicio] + 1) % serviciosImagenes[servicio].length
        }));
      }, 5000); // Cambia cada 5 segundos
    });

    // Limpiar intervalos al desmontar el componente
    return () => intervalos.forEach(interval => clearInterval(interval));
  }, []);

  const handleEnviar = async (e) => {
    e.preventDefault();
    setConfirmacion('');
    setError('');
  
    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/contacto/enviar`, {
        nombre,
        email,
        asunto,
        mensaje,
      });
  
      setConfirmacion(res.data.mensaje || '✅ ¡Mensaje enviado con éxito!');
      setNombre('');
      setEmail('');
      setAsunto('');
      setMensaje('');
    } catch (err) {
      console.error(err);
      setError('❌ Hubo un error al enviar el mensaje.');
    }
  };
  
  useEffect(() => {
  const obtenerUsuario = () => {
    try {
      // Obtener datos del localStorage
      const userData = localStorage.getItem('user');
      
      if (!userData) {
        console.log('No hay usuario logueado');
        return;
      }

      const usuario = JSON.parse(userData);
      
      // Verificar que el objeto tenga los datos mínimos requeridos
      if (usuario.nombre && usuario.correo) {
        setUsuario({
          nombre: usuario.nombre,
          correo: usuario.correo,
          rol: usuario.rol || 'user' // Valor por defecto
        });
      }
    } catch (err) {
      console.error('Error al parsear datos de usuario:', err);
      // Limpiar datos inválidos
      localStorage.removeItem('user');
    }
  };

  obtenerUsuario();
}, []);

  return (
    <div className="inicio">
      <section className="bienvenida" id="inicio">
        {usuario && usuario.nombre && (
  <div className="nombre-usuario">
    Hola, {usuario.nombre.split(' ')[0]}
  </div>
)}
        <h1>BIENVENIDOS A L'ECLAT</h1>
        <h2>Centro Estético</h2>
        <button className="btn-principal" onClick={() => setMostrarCita(true)}>Agenda tu Cita</button>
        {mostrarCita && <AgendarCita onClose={() => setMostrarCita(false)} />}
      </section>

      <section id="quienes-somos" className="quienes-somos">
        <div className="contenido-quienes">
          <h2 className="titulo-quienes">Cosmetóloga y esteticista profesional</h2>
          <h3 className="subtitulo-quienes">Tatiana Rojas Saldarriaga</h3>
          
          <div className="quienes-layout">
            <div className="texto-lateral">
              <p>Hola, soy Tatiana Rojas, cosmetóloga y esteticista integral con formación profesional y experiencia en el cuidado de la piel y la estética facial. Mi enfoque se basa en ofrecer tratamientos personalizados, seguros y efectivos para potenciar la belleza natural y el bienestar de cada persona.</p>
              
            </div>

            <div className="foto-central">
              <img src={masaje} alt="Masaje relajante" />
            </div>

            <div className="texto-lateral">
              <p>Trabajo de forma independiente y también soy cofundadora de L’éclat Centro Estético, donde colaboro con un equipo profesional para brindar una experiencia completa en estética integral.</p>
              
            </div>
          </div>
        </div>
      </section>

      <section id="tratamientos" className="tratamientos">
        <h2>Servicios</h2>
        <div className="cards">
          <Link to="/servicios/faciales" className="card">
            <img 
              src={serviciosImagenes.faciales[currentImages.faciales]} 
              alt="Tratamiento facial" 
            />
            <p>Tratamientos faciales</p>
          </Link>
          <Link to="/servicios/corporales" className="card">
            <img 
              src={serviciosImagenes.corporales[currentImages.corporales]} 
              alt="Masaje relajante" 
            />
            <p>Tratamientos Corporales</p>
          </Link>
          <Link to="/servicios/relajantes" className="card">
            <img 
              src={serviciosImagenes.relajantes[currentImages.relajantes]} 
              alt="Depilación" 
            />
            <p>Tratamientos Relajantes</p>
          </Link>
        </div>
      </section>

      <section id="contacto" className="contacto">
  <div  className="contacto-container">
    <h2>Contáctanos</h2>
    <form onSubmit={handleEnviar}>
      <input
        type="text"
        placeholder="Nombre"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        required
      />
      <input
        type="email"
        placeholder="Correo electrónico"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Asunto"
        value={asunto}
        onChange={(e) => setAsunto(e.target.value)}
        required
      />
      <textarea
        placeholder="Mensaje"
        value={mensaje}
        onChange={(e) => setMensaje(e.target.value)}
        required
      />
      <button  type="submit">Enviar</button>

      {confirmacion && <p style={{ color: 'green' }}>{confirmacion}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  </div>
</section>
    </div>
  );
};

export default Inicio;