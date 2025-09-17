import axios from 'axios';

// Detecta si estás en desarrollo
const isDevelopment = import.meta.env.MODE === "development";

// Define la URL base de la API (prioriza variable de entorno)
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

// Función para exponer la info del entorno
export const getEnvironmentInfo = () => ({
  isDevelopment,
  baseURL: API_BASE_URL,
  environment: import.meta.env.VITE_ENVIRONMENT || (isDevelopment ? "development" : "production"),
  backendURL: import.meta.env.VITE_BACKEND_URL,
  vercelURL: import.meta.env.VITE_VERCEL_URL
});

// Instancia de Axios
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true // útil si trabajas con cookies/sesiones
});

// Interceptor opcional para debug
api.interceptors.request.use(
  (config) => {
    console.log(`🌍 [${import.meta.env.VITE_ENVIRONMENT || "unknown"}] Request →`, config.baseURL + config.url);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
