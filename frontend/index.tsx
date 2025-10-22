import React from 'react';
import ReactDOM from 'react-dom/client';
// Fix: Use namespace import for 'react-router-dom' to resolve module export errors.
import * as ReactRouterDOM from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from './context/AuthContext';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

// Ensure VITE_GOOGLE_CLIENT_ID is set in your environment variables
const GOOGLE_CLIENT_ID = process.env.VITE_GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com';

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <ReactRouterDOM.HashRouter>
          <App />
        </ReactRouterDOM.HashRouter>
      </AuthProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>
);