import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// LOGIN / REGISTRO
import Login from "./pages/login";
import RegisterForm from "./components/registerForm";

// ADMIN (NO SE TOCAN)
import PantallaPrincipalAdmin from "./components/panelControlAdminComponent";

// ALUMNO (ESTO SÍ LO USAMOS)
import DashboardAlumnos from "./pages/dashboardAlumnos";
import TareasPage from "./pages/Tareaspage.jsx";
import AsignaturasPage from "./pages/AsignaturasPage.jsx";
import AsignaturaDetalle from "./pages/AsignaturaDetalle.jsx";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <Router>
      <Routes>

        {/* AUTENTICACIÓN */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<RegisterForm />} />

        {/* ADMIN (FUNCIONAN COMO YA ESTABAN) */}
        <Route path="/panelControlAdmin" element={<PantallaPrincipalAdmin />} />

        {/* ALUMNO */}
        <Route path="/dashboardAlumnos" element={<DashboardAlumnos />} />
        <Route path="/tareas" element={<TareasPage />} />
        <Route path="/asignaturas" element={<AsignaturasPage />} />
        <Route path="/asignaturas/:id" element={<AsignaturaDetalle />} />
        <Route path="*" element={<NotFound />} />

      </Routes>
    </Router>
  );
}

export default App;
