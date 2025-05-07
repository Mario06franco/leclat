import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { UserProvider } from './context/UserContext'
console.log('ENV Variables:', import.meta.env) // ← Ver TODAS las variables
console.log('Backend URL:', import.meta.env.VITE_BACKEND_URL) // ← Ver específicamente tu URL

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <UserProvider>
        <App />
      </UserProvider>
    </BrowserRouter>
  </StrictMode>
)
