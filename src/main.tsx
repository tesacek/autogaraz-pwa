// src/main.tsx
// Entry point aplikace
// Zde se React aplikace připojuje k DOM elementu #root (viz index.html)
//
// StrictMode – React v dev módu spouští render dvakrát pro detekci
// vedlejších efektů. V produkci funguje normálně.

// @ts-ignore
import React from 'react'
// @ts-ignore
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Připojení React aplikace k DOM
// document.getElementById('root') nikdy není null (je v index.html)
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
