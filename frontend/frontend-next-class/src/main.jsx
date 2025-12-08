import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { registerSW } from 'virtual:pwa-register'

import 'bootstrap/dist/css/bootstrap.min.css'; // Vital para que funcione el diseño (d-flex, etc)
import './index.css' // Tus estilos globales (fuentes, resets)

const updateSW = registerSW({
  onNeedRefresh() {
    if (confirm("Hay una nueva versión disponible. ¿Actualizar?")) {
      updateSW(true);
    }
  },
  onOfflineReady() {
    console.log("App lista para trabajar offline");
  },
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)