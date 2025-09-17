import axios from 'axios';

// Detectar el entorno automáticamente
const isDevelopment = import.meta.env.VITE_ENVIRONMENT === 'development';

// URL base según el entorno
const API_BASE_URL = isDevelopment 
  ? import.meta.env.VITE_BACKEND_URL // Local en desarrollo
  : import.meta.env.VITE_VERCEL_URL; // Vercel en producción

// Mostrar información de conexión solo en desarrollo
if (isDevelopment) {
  console.log('🌐 Configuración de Axios:');
  console.log(`   Entorno: ${import.meta.env.VITE_ENVIRONMENT}`);
  console.log(`   URL Base: ${API_BASE_URL}`);
  console.log(`   Local: ${import.meta.env.VITE_BACKEND_URL}`);
  console.log(`   Producción: ${import.meta.env.VITE_VERCEL_URL}`);
}

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000, // 15 segundos de timeout
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para requests
api.interceptors.request.use(
  (config) => {
    // Agregar token de autenticación si existe
    const token = localStorage.getItem('userToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Logs solo en desarrollo
    if (isDevelopment) {
      console.log(`🔄 ${config.method?.toUpperCase()} ${config.url}`);
      if (config.data) {
        console.log('📦 Payload:', config.data);
      }
    }
    
    return config;
  },
  (error) => {
    if (isDevelopment) {
      console.error('❌ Error en request:', error);
    }
    return Promise.reject(error);
  }
);

// Interceptor para responses
api.interceptors.response.use(
  (response) => {
    // Logs solo en desarrollo
    if (isDevelopment) {
      console.log(`✅ ${response.status} ${response.config.url}`);
    }
    return response;
  },
  (error) => {
    // Manejo de errores
    if (isDevelopment) {
      console.error(`❌ Error ${error.response?.status} en: ${error.config?.url}`);
      console.error('📋 Detalles:', error.response?.data);
    }
    
    // Manejar errores específicos
    if (error.response?.status === 401) {
      // Token expirado o inválido
      localStorage.removeItem('userToken');
      localStorage.removeItem('user');
      
      // Redirigir al login solo si estamos en una ruta protegida
      if (!window.location.pathname.includes('/auth')) {
        window.location.href = '/login';
      }
    }
    
    // Para errores de conexión
    if (error.code === 'ECONNABORTED') {
      console.error('⏰ Timeout de la solicitud');
    }
    
    if (!error.response) {
      console.error('🌐 Error de red - Verifica tu conexión');
    }
    
    return Promise.reject(error);
  }
);

// Función para verificar la conexión
export const checkConnection = async () => {
  try {
    const response = await api.get('/api/health');
    return {
      connected: true,
      status: response.status,
      data: response.data
    };
  } catch (error) {
    return {
      connected: false,
      error: error.message,
      status: error.response?.status
    };
  }
};

// Función para obtener la URL base actual (útil para debugging)
export const getBaseURL = () => API_BASE_URL;

// Función para obtener información del entorno
export const getEnvironmentInfo = () => ({
  isDevelopment,
  baseURL: API_BASE_URL,
  environment: import.meta.env.VITE_ENVIRONMENT,
  backendURL: import.meta.env.VITE_BACKEND_URL,
  vercelURL: import.meta.env.VITE_VERCEL_URL
});

export default api;