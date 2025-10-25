import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom'; // Keep using HashRouter as in your code
import App from './App'; // Assuming App.tsx is in the same root folder
import { AuthProvider } from './context/AuthContext'; // Assuming context folder is in the root
import './index.css'; // Assuming index.css is in the same root folder
// This package needs to be installed if you intend to use it.
// Run: npm install @react-oauth/google
import { GoogleOAuthProvider } from '@react-oauth/google';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

// Access environment variable - using process.env as fallback for non-Vite environments
const GOOGLE_CLIENT_ID = import.meta.env?.VITE_GOOGLE_CLIENT_ID || process.env.VITE_GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID_FALLBACK';

if (!GOOGLE_CLIENT_ID || GOOGLE_CLIENT_ID === 'YOUR_GOOGLE_CLIENT_ID_FALLBACK') {
    console.warn('Warning: VITE_GOOGLE_CLIENT_ID is not set in your .env file. Google OAuth Provider might not function correctly.');
}


const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    {/* GoogleOAuthProvider might still be needed if you use other Google APIs */}
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      {/* AuthProvider handles backend login state */}
      <AuthProvider>
        {/* HashRouter wraps your App */}
        <HashRouter>
          <App />
        </HashRouter>
      </AuthProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>
);

