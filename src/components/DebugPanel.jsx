import React, { useState } from 'react';
import { debugEnv, testConnection, testAllUrls } from '../utils/debug';

const DebugPanel = () => {
  const [connectionTest, setConnectionTest] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleTestConnection = async () => {
    setLoading(true);
    const result = await testConnection();
    setConnectionTest(result);
    setLoading(false);
  };

  const handleTestAllUrls = async () => {
    setLoading(true);
    const results = await testAllUrls();
    setConnectionTest(results);
    setLoading(false);
  };

  const envInfo = debugEnv();

  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      right: '10px',
      background: '#2f3542',
      color: 'white',
      padding: '15px',
      borderRadius: '8px',
      fontFamily: 'monospace',
      fontSize: '12px',
      zIndex: 10000,
      maxWidth: '350px',
      boxShadow: '0 4px 15px rgba(0,0,0,0.3)'
    }}>
      <h3 style={{ margin: '0 0 10px 0' }}>
        {envInfo.isDevelopment ? '🚧 DEVELOPMENT' : '☁️ PRODUCTION'}
      </h3>
      
      <div style={{ marginBottom: '10px' }}>
        <strong>URL Actual:</strong> {envInfo.baseURL}
      </div>
      
      <div style={{ marginBottom: '15px' }}>
        <strong>Entorno:</strong> {envInfo.environment}
      </div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
        <button 
          onClick={handleTestConnection}
          disabled={loading}
          style={{
            padding: '5px 10px',
            background: '#5352ed',
            border: 'none',
            borderRadius: '3px',
            color: 'white',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          Test Conexión
        </button>
        
        <button 
          onClick={handleTestAllUrls}
          disabled={loading}
          style={{
            padding: '5px 10px',
            background: '#3742fa',
            border: 'none',
            borderRadius: '3px',
            color: 'white',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          Test Todas URLs
        </button>
      </div>

      {loading && <div>Testing...</div>}

      {connectionTest && (
        <div style={{ 
          marginTop: '10px', 
          padding: '10px', 
          background: connectionTest.success ? '#2ed573' : '#ff4757',
          borderRadius: '3px'
        }}>
          <strong>Resultado:</strong> {connectionTest.success ? '✅ Éxito' : '❌ Error'}
          <br />
          {connectionTest.error && `Error: ${connectionTest.error}`}
          {connectionTest.status && `Status: ${connectionTest.status}`}
        </div>
      )}

      <button 
        onClick={() => window.location.reload()}
        style={{
          marginTop: '10px',
          padding: '5px 10px',
          background: '#57606f',
          border: 'none',
          borderRadius: '3px',
          color: 'white',
          cursor: 'pointer',
          width: '100%'
        }}
      >
        Recargar
      </button>
    </div>
  );
};

// Solo mostrar en desarrollo
export default import.meta.env.VITE_ENVIRONMENT === 'development' ? DebugPanel : () => null;