import axios from 'axios';

// Detectar automáticamente si estamos en desarrollo o producción
const isDevelopment = import.meta.env.VITE_ENVIRONMENT === 'development';

// URL base según el entorno
const API_BASE_URL = isDevelopment 
  ? import.meta.env.VITE_BACKEND_URL // Local en desarrollo
  : import.meta.env.VITE_VERCEL_URL; // Vercel en producción

console.log(`🌐 Environment: ${import.meta.env.VITE_ENVIRONMENT}`);
console.log(`🔗 API Base URL: ${API_BASE_URL}`);

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('userToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    if (isDevelopment) {
      console.log(`🔄 ${config.method?.toUpperCase()} ${config.url}`);
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para responses
api.interceptors.response.use(
  (response) => {
    if (isDevelopment) {
      console.log(`✅ ${response.status} ${response.config.url}`);
    }
    return response;
  },
  (error) => {
    if (isDevelopment) {
      console.error(`❌ ${error.response?.status} ${error.config?.url}`);
    }
    
    if (error.response?.status === 401) {
      localStorage.removeItem('userToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

export default api;