import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import './styles/index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#1a1a1a',
              color: '#f0f0f0',
              border: '1px solid #2a2a2a',
              borderRadius: '8px',
              fontSize: '14px'
            },
            success: {
              iconTheme: { primary: '#22c55e', secondary: '#0d0d0d' }
            },
            error: {
              style: {
                background: '#1a1a1a',
                color: '#f87171',
                border: '1px solid #2a2a2a'
              }
            }
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);