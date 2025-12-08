import React, { useState } from 'react';
import {
  Home,
  GraduationCap,
  Presentation,
  Calendar,
  Bell,
  LogOut,
  Menu
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// IMPORTACIÓN DE MÓDULOS
import Horarios from './Horarios';
import Clases from './Clases';
import Asignaturas from './Asignaturas';


// IMPORTACIÓN DE IMÁGENES (Asegúrate de que los nombres coincidan exactamente)
import imgGarra from '../assets/garra.png';
import imgLogo from '../assets/Logo.png';
import { left } from '@popperjs/core';

// Placeholder decorativo (opcional, si quieres mantener la garra de fondo transparente)
const garraFondo = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIiBmaWxsPSIjMDA3RThDIj48Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSI0MCIgb3BhY2l0eT0iMC4yIi8+PC9zdmc+";

// --- COMPONENTE INTERNO: DASHBOARD HOME ---
const DashboardHome = ({ colors, styles }) => (
  <div style={{ animation: "fadeIn 0.5s ease-out" }}>
    <div style={{ marginBottom: "30px" }}>
      <h1 style={{ color: colors.secondary, margin: "0 0 5px 0", fontSize: "1.8rem", fontWeight: "bold" }}>
        Panel Principal
      </h1>
      <p style={{ color: "#888", margin: 0 }}>Bienvenido al sistema de administración.</p>
    </div>

    <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", marginBottom: "30px" }}>
      {/* Card 1 */}
      <div style={styles.statCard}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "15px" }}>
          <div style={{ padding: "10px", borderRadius: "10px", backgroundColor: "#E0F7FA", color: colors.secondary }}>
            <GraduationCap size={24} />
          </div>
          <span style={{ background: "#E8F5E9", color: "#2E7D32", padding: "2px 8px", borderRadius: "10px", fontSize: "0.75rem", fontWeight: "bold" }}>+12%</span>
        </div>
        <div style={{ color: "#888", fontSize: "0.85rem", fontWeight: "500" }}>Total Alumnos</div>
        <div style={{ fontSize: "1.8rem", fontWeight: "bold", color: "#333" }}>21</div>
        <div style={{ position: "absolute", top: "-40px", right: "-40px", width: "100px", height: "100px", borderRadius: "50%", background: colors.primary, opacity: 0.1 }} />
      </div>

      {/* Card 2 */}
      <div style={styles.statCard}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "15px" }}>
          <div style={{ padding: "10px", borderRadius: "10px", backgroundColor: "#E0F2F1", color: "#00695C" }}>
            <Presentation size={24} />
          </div>
        </div>
        <div style={{ color: "#888", fontSize: "0.85rem", fontWeight: "500" }}>Maestros Activos</div>
        <div style={{ fontSize: "1.8rem", fontWeight: "bold", color: "#333" }}>7</div>
        <div style={{ position: "absolute", top: "-40px", right: "-40px", width: "100px", height: "100px", borderRadius: "50%", background: colors.primary, opacity: 0.1 }} />
      </div>

      {/* Card 3 */}
      <div style={styles.statCard}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "15px" }}>
          <div style={{ padding: "10px", borderRadius: "10px", backgroundColor: "#FFF3E0", color: "#EF6C00" }}>
            <Bell size={24} />
          </div>
          <span style={{ background: "#FFEBEE", color: "#C62828", padding: "2px 8px", borderRadius: "10px", fontSize: "0.75rem", fontWeight: "bold" }}>!</span>
        </div>
        <div style={{ color: "#888", fontSize: "0.85rem", fontWeight: "500" }}>Notificaciones</div>
        <div style={{ fontSize: "1.8rem", fontWeight: "bold", color: "#333" }}>48</div>
        <div style={{ position: "absolute", top: "-40px", right: "-40px", width: "100px", height: "100px", borderRadius: "50%", background: "#ffababff", opacity: 0.1 }} />
      </div>
    </div>

    <div style={{ backgroundColor: "#F9FAFB", borderRadius: "20px", padding: "25px", border: "1px solid #eee" }}>
      <h3 style={{ margin: "0 0 15px 0", color: "#555", fontSize: "1.1rem" }}>Actividad Reciente</h3>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {[1, 2, 3].map((_, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "15px", backgroundColor: "white", borderRadius: "10px", boxShadow: "0 2px 5px rgba(0,0,0,0.02)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: colors.primary }}></div>
              <span style={{ fontSize: "0.9rem", color: "#555" }}>Nuevo alumno registrado: <strong>Juan Pérez</strong></span>
            </div>
            <span style={{ fontSize: "0.8rem", color: "#999" }}>Hace 2 min</span>
          </div>
        ))}
      </div>
    </div>

  </div>
);

// --- COMPONENTE PRINCIPAL (Layout Base) ---
export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");
  const navigate = useNavigate();

  // CONFIGURACIÓN DE COLORES
  const colors = {
    primary: "#00B8C8",
    secondary: "#007E8C",
    darkTeal: "#00838F",
    bgLight: "#F5F8FA",
    textDark: "#333333",
    sidebarGradient: "linear-gradient(to bottom, #00838F, #006064)"
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };

  const menuItems = [
    { id: "dashboard", name: "Dashboard", icon: <Home size={20} /> },
    { id: "horarios", name: "Horarios", icon: <Calendar size={20} /> },
    { id: "clases", name: "Clases", icon: <GraduationCap size={20} /> },
    { id: "asignaturas", name: "Asignaturas", icon: <Presentation size={20} /> },

  ];

  // ESTILOS
  const styles = {
    container: {
      display: "flex", minHeight: "100vh", fontFamily: "'Poppins', sans-serif",
      backgroundColor: colors.bgLight, overflow: "hidden"
    },
    sidebar: {
      width: sidebarOpen ? "260px" : "80px", background: colors.sidebarGradient,
      transition: "width 0.3s ease-in-out", display: "flex", flexDirection: "column",
      position: "relative", boxShadow: "4px 0 15px rgba(0,0,0,0.1)", zIndex: 50, flexShrink: 0
    },
    sidebarHeader: {
      // Ajuste para permitir logo + texto verticalmente
      minHeight: "120px", padding: "20px 0",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      borderBottom: "1px solid rgba(255,255,255,0.1)"
    },
    menuBtn: (active) => ({
      display: "flex", alignItems: "center", width: "100%", padding: "15px 20px",
      background: active ? "rgba(255,255,255,0.1)" : "transparent",
      color: active ? "white" : "#B2DFDB", border: "none", cursor: "pointer",
      position: "relative", transition: "all 0.2s", textAlign: "left", marginBottom: "5px",
      fontSize: "1rem", textDecoration: "none"
    }),
    activeIndicator: {
      position: "absolute", right: 0, top: "10%", height: "80%", width: "4px",
      backgroundColor: colors.primary, borderTopLeftRadius: "4px", borderBottomLeftRadius: "4px"
    },
    mainWrapper: {
      flex: 1, display: "flex", flexDirection: "column", height: "100vh", position: "relative"
    },
    header: {
      height: "80px", backgroundColor: colors.bgLight, display: "flex", alignItems: "center",
      justifyContent: "space-between", padding: "0 30px", flexShrink: 0
    },
    contentArea: {
      flex: 1, backgroundColor: "white", borderTopLeftRadius: "60px",
      boxShadow: "inset 5px 5px 20px rgba(0,0,0,0.03)", padding: "40px",
      position: "relative", overflowY: "auto"
    },
    statCard: {
      backgroundColor: "white", borderRadius: "20px", padding: "25px",
      boxShadow: "0 10px 25px rgba(0,0,0,0.05)", border: "1px solid #f0f0f0",
      position: "relative", overflow: "hidden", flex: "1 1 300px", minWidth: "250px"
    }
  };

  // Renderizado dinámico
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <DashboardHome colors={colors} styles={styles} />;
      case 'horarios': return <Horarios colors={colors} />;
      case 'clases': return <Clases colors={colors} />;
      case 'asignaturas': return <Asignaturas colors={colors} />;
      case 'jefes': return <JefesGrupo colors={colors} />;

      default: return <DashboardHome colors={colors} styles={styles} />;
    }
  };

  return (
    <div style={styles.container}>
      {/* SIDEBAR */}
      <aside style={styles.sidebar}>
        <div style={styles.sidebarHeader}>
          {/* LOGO PRINCIPAL: Se ajusta el tamaño si la barra está cerrada */}
          <img
            src={imgLogo}
            alt="Logo"
            style={{
              width: sidebarOpen ? "80px" : "45px",
              height: "auto",
              marginBottom: "10px",
              transition: "all 0.3s"
            }}
          />

          {sidebarOpen ? (
            <div style={{ color: "white", fontSize: "1.5rem", fontWeight: "bold", letterSpacing: "1px" }}>NEXTCLASS</div>
          ) : (
            <div style={{ color: "white", fontSize: "1.2rem", fontWeight: "bold" }}>NC</div>
          )}

        </div>

        <nav style={{ marginTop: "2rem", padding: "0 10px", display: "flex", flexDirection: "column" }}>
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={styles.menuBtn(activeTab === item.id)}
              onMouseEnter={(e) => { if (activeTab !== item.id) { e.currentTarget.style.color = "white"; e.currentTarget.style.background = "rgba(255,255,255,0.05)"; } }}
              onMouseLeave={(e) => { if (activeTab !== item.id) { e.currentTarget.style.color = "#B2DFDB"; e.currentTarget.style.background = "transparent"; } }}
            >
              <div style={{ minWidth: "25px", display: "flex", justifyContent: "center" }}>{item.icon}</div>
              <div style={{ marginLeft: "15px", opacity: sidebarOpen ? 1 : 0, width: sidebarOpen ? "auto" : 0, overflow: "hidden", whiteSpace: "nowrap", transition: "opacity 0.2s", fontWeight: "500" }}>
                {item.name}
              </div>
              {activeTab === item.id && <div style={styles.activeIndicator} />}
            </button>
          ))}
        </nav>

        <div style={{ marginTop: "auto", padding: "20px" }}>
          <button
            onClick={handleLogout}
            style={styles.menuBtn(false)}
            onMouseEnter={(e) => { e.currentTarget.style.color = "white"; e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)" }}
            onMouseLeave={(e) => { e.currentTarget.style.color = "#B2DFDB"; e.currentTarget.style.background = "transparent"; }}
          >
            <div style={{ minWidth: "25px", display: "flex", justifyContent: "center", transform: "translateX(-10px)" }}>
              <LogOut size={20} />
            </div>
            <div style={{ marginLeft: "15px", opacity: sidebarOpen ? 1 : 0, width: sidebarOpen ? "auto" : 0, overflow: "hidden", whiteSpace: "nowrap", transition: "opacity 0.2s", fontWeight: "500" }}>
              Cerrar Sesión
            </div>
          </button>
        </div>
      </aside>

      {/* CONTENIDO */}
      <div style={styles.mainWrapper}>
        <header style={styles.header}>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background: "none", border: "none", cursor: "pointer", color: "#666", padding: "5px" }}>
            <Menu size={24} />
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>

            <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
              <img src={imgGarra} alt="Notificaciones" style={{ width: "28px", height: "auto", opacity: 0.8 }} />
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "15px", borderLeft: "1px solid #ddd", paddingLeft: "20px" }}>
              <div style={{ textAlign: "right", display: window.innerWidth < 768 ? "none" : "block" }}>
                <p style={{ margin: 0, fontSize: "0.9rem", fontWeight: "bold", color: "#444" }}>Admin Usuario</p>
                <p style={{ margin: 0, fontSize: "0.75rem", color: "#888" }}>Administrador</p>
              </div>
              <div style={{ width: "40px", height: "40px", borderRadius: "50%", backgroundColor: colors.secondary, color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", boxShadow: "0 2px 5px rgba(0,0,0,0.1)" }}>A</div>
            </div>
          </div>
        </header>

        <main style={styles.contentArea}>
          <img src={garraFondo} alt="Decorativo" style={{ position: "absolute", top: "0", right: "30px", width: "100px", opacity: 0.1, pointerEvents: "none", transform: "translateY(-20%)" }} />
          {renderContent()}
        </main>
      </div>
    </div>
  );
}