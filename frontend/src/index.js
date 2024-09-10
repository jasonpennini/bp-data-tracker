import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BPContextProvider } from './context/BPContext';
import { AuthContextProvider } from './context/AuthContext';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthContextProvider>
      <BPContextProvider>
        <App />
      </BPContextProvider>
    </AuthContextProvider>
  </React.StrictMode>
);
