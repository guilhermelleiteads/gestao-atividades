import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// JSX descreve a raiz da aplicação; ReactDOM monta a árvore que o React reconcilia nas atualizações.
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);