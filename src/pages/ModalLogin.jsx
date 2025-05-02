import React from 'react'
import '../css/ModalLogin.css'

const ModalLogin = ({ onClose }) => {
  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h2>Iniciar sesión</h2>
        <input type="text" placeholder="Correo electrónico" />
        <input type="password" placeholder="Contraseña" />
        <div className="modal-buttons">
          <button onClick={onClose}>Cerrar</button>
          <button>Ingresar</button>
        </div>
      </div>
    </div>
  )
}

export default ModalLogin
