import { getEnvironmentInfo } from '../config/axios';

/**
 * Sistema de debugging para verificar el entorno y conexiones
 */
export const debugEnv = () => {
  const envInfo = getEnvironmentInfo();
  
  console.group('🚀 Debug - Información de Entorno');
  console.log('🔄 Entorno detectado:', envInfo.environment);
  console.log('📋 Es desarrollo:', envInfo.isDevelopment);
  console.log('🌐 URL Base actual:', envInfo.baseURL);
  console.log('💻 URL Local (dev):', envInfo.backendURL);
  console.log('☁️ URL Vercel (prod):', envInfo.vercelURL);
  console.log('⏰ Hora actual:', new Date().toLocaleTimeString());
  console.groupEnd();
  
  return envInfo;
};

/**
 * Verifica la conexión con el backend
 */
export const testConnection = async () => {
  try {
    console.group('🔍 Test de Conexión al Backend');
    
    const envInfo = debugEnv();
    
    // Intentar hacer una petición simple
    const response = await fetch(`${envInfo.baseURL}/api/health`);
    const data = await response.json();
    
    console.log('✅ Conexión exitosa con el backend');
    console.log('📊 Status:', response.status);
    console.log('📦 Respuesta:', data);
    
    console.groupEnd();
    
    return {
      success: true,
      status: response.status,
      data: data,
      environment: envInfo.environment
    };
  } catch (error) {
    console.error('❌ Error de conexión:', error);
    console.groupEnd();
    
    return {
      success: false,
      error: error.message,
      environment: getEnvironmentInfo().environment
    };
  }
};

/**
 * Verifica todas las URLs configuradas
 */
export const testAllUrls = async () => {
  console.group('🌐 Test de Todas las URLs');
  
  const envInfo = getEnvironmentInfo();
  const results = {};
  
  // Test URL de desarrollo
  try {
    const devResponse = await fetch(`${envInfo.backendURL}/api/health`);
    results.development = {
      success: true,
      status: devResponse.status,
      url: envInfo.backendURL
    };
    console.log('✅ URL Desarrollo:', envInfo.backendURL);
  } catch (error) {
    results.development = {
      success: false,
      error: error.message,
      url: envInfo.backendURL
    };
    console.log('❌ URL Desarrollo:', envInfo.backendURL);
  }
  
  // Test URL de producción
  try {
    const prodResponse = await fetch(`${envInfo.vercelURL}/api/health`);
    results.production = {
      success: true,
      status: prodResponse.status,
      url: envInfo.vercelURL
    };
    console.log('✅ URL Producción:', envInfo.vercelURL);
  } catch (error) {
    results.production = {
      success: false,
      error: error.message,
      url: envInfo.vercelURL
    };
    console.log('❌ URL Producción:', envInfo.vercelURL);
  }
  
  console.log('📊 Resultados:', results);
  console.groupEnd();
  
  return results;
};

/**
 * Muestra un resumen en la interfaz de usuario
 */
export const showDebugInfo = () => {
  const envInfo = getEnvironmentInfo();
  const debugDiv = document.createElement('div');
  
  debugDiv.style.cssText = `
    position: fixed;
    bottom: 10px;
    right: 10px;
    background: ${envInfo.isDevelopment ? '#ff4757' : '#2ed573'};
    color: white;
    padding: 10px;
    border-radius: 5px;
    font-family: monospace;
    font-size: 12px;
    z-index: 9999;
    max-width: 300px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.3);
    cursor: pointer;
  `;
  
  debugDiv.innerHTML = `
    <div><strong>${envInfo.isDevelopment ? '🚧 DEVELOPMENT' : '☁️ PRODUCTION'}</strong></div>
    <div>URL: ${envInfo.baseURL}</div>
    <div>Hora: ${new Date().toLocaleTimeString()}</div>
    <div style="font-size: 10px; margin-top: 5px;">Click para test</div>
  `;
  
  debugDiv.onclick = () => {
    testConnection();
  };
  
  document.body.appendChild(debugDiv);
  
  return debugDiv;
};

// Hacer las funciones disponibles globalmente para debugging
if (import.meta.env.VITE_ENVIRONMENT === 'development') {
  window.debugEnv = debugEnv;
  window.testConnection = testConnection;
  window.testAllUrls = testAllUrls;
  window.showDebugInfo = showDebugInfo;
  
  console.log('🔧 Debug utilities loaded!');
  console.log('Available commands:');
  console.log('  - debugEnv()');
  console.log('  - testConnection()');
  console.log('  - testAllUrls()');
  console.log('  - showDebugInfo()');
}