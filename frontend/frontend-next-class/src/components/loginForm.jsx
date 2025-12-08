import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaLock } from "react-icons/fa";
import api from "../services/axiosConfig.js";

import Logoprincipal from "../assets/Logoprincipal.png";
import garra from "../assets/garra.png";

function LoginForm() {
    const [formData, setFormData] = useState({ matricula: "", password: "" });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [isError, setIsError] = useState(false);

    const navigate = useNavigate();

    const colors = {
        primary: "#00B8C8",
        secondary: "#007E8C",
        darkTeal: "#00838F",
        textDark: "#333",
        bgLight: "#F5F8FA",
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setIsError(false);

        try {
            const res = await api.post("/auth/login", formData);
            localStorage.setItem("authToken", res.data.token);

            if (res.data.role === "admin") {
                return navigate("/panelControlAdmin");
            }
            navigate("/dashboardAlumnos");

        } catch (err) {
            setError("Credenciales incorrectas");
            setIsError(true);
            setFormData(prev => ({ ...prev, password: "" }));
        }
    };

    return (
        <div
            className="d-flex flex-column align-items-center"
            style={{
                minHeight: "100vh",
                background: colors.bgLight,
                position: "relative",
                fontFamily: "Poppins, sans-serif",
                paddingBottom: "20px",
                overflowY: "auto" // Permite scroll si hace falta
            }}
        >
            {/* FONDO SUPERIOR (HEADER) */}
            <div
                style={{
                    position: "absolute",
                    top: 0, left: 0, width: "100%",
                    height: "50vh", // Reducido para subir visualmente el corte
                    backgroundColor: colors.darkTeal,
                    borderBottomLeftRadius: "50px",
                    borderBottomRightRadius: "50px",
                    zIndex: 0
                }}
            />

            {/* CONTENIDO (Z-INDEX SUPERIOR) */}
            <div style={{ zIndex: 1, width: "100%", display: "flex", flexDirection: "column", alignItems: "center", paddingTop: "2rem" }}>
                
                {/* LOGO - MÁS ARRIBA */}
                <div style={{ textAlign: "center", color: "white", marginBottom: "1.5rem" }}>
                    <img
                        src={Logoprincipal}
                        alt="Logo"
                        style={{
                            width: "120px", // Un poco más pequeño para ahorrar espacio
                            filter: "drop-shadow(0 4px 10px rgba(0,0,0,0.3))",
                            marginBottom: "5px"
                        }}
                    />
                    <h2 style={{ fontWeight: "800", letterSpacing: "1px", margin: 0, fontSize: "1.5rem", textShadow: "0 2px 4px rgba(0,0,0,0.2)" }}>
                        NEXTCLASS
                    </h2>
                    <p style={{ fontSize: "1rem", opacity: 0.9, margin: 0 }}>Bienvenido</p>
                </div>

                {/* TARJETA FORMULARIO - SUBIDA */}
                <div
                    style={{
                        backgroundColor: "#fff",
                        width: "90%",
                        maxWidth: "400px",
                        borderRadius: "25px",
                        boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                        padding: "2rem",
                        position: "relative",
                        marginBottom: "2rem"
                    }}
                >
                    <img
                        src={garra}
                        alt="Decorativo"
                        style={{
                            position: "absolute",
                            top: "-25px", right: "15px",
                            width: "50px", opacity: 0.15,
                            transform: "rotate(15deg)"
                        }}
                    />

                    <h3 style={{ color: colors.secondary, fontWeight: "700", marginBottom: "1.5rem", fontSize: "1.4rem", textAlign: "center" }}>
                        Iniciar Sesión
                    </h3>

                    {error && <div className="alert alert-danger text-center p-2 mb-3" style={{fontSize: "0.85rem"}}>{error}</div>}

                    <form onSubmit={handleSubmit}>
                        <InputField 
                            icon={<FaUser size={16} color="white"/>}
                            type="text"
                            placeholder="Matrícula"
                            name="matricula"
                            value={formData.matricula}
                            onChange={handleChange}
                            error={isError}
                            color={colors.primary}
                        />

                        <InputField 
                            icon={<FaLock size={16} color="white"/>}
                            type="password"
                            placeholder="Contraseña"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            error={isError}
                            color={colors.secondary}
                        />
                        
                        <div className="d-grid gap-3">
                            <button
                                type="submit"
                                className="btn text-white fw-bold py-2 rounded-pill shadow-sm"
                                style={{ backgroundColor: colors.secondary, border: "none", fontSize: "1rem" }}
                            >
                                Entrar
                            </button>

                            <Link
                                to="/register"
                                className="btn fw-bold py-2 rounded-pill shadow-sm"
                                style={{ backgroundColor: "white", color: colors.textDark, border: "1px solid #eee", fontSize: "0.9rem" }}
                            >
                                Crear Cuenta
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

// COMPONENTE INPUT COMPACTO
function InputField({ icon, type, placeholder, name, value, onChange, error, color }) {
    return (
        <div style={{ position: "relative", marginBottom: "1.2rem" }}>
            <div
                style={{
                    position: "absolute", top: "50%", left: "10px", transform: "translateY(-50%)",
                    width: "38px", height: "38px", borderRadius: "50%",
                    backgroundColor: color,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    boxShadow: "0 2px 5px rgba(0,0,0,0.1)", zIndex: 2
                }}
            >
                {icon}
            </div>

            <input
                type={type}
                placeholder={placeholder}
                name={name}
                value={value}
                onChange={onChange}
                style={{
                    width: "100%", height: "50px", // Altura reducida
                    borderRadius: "15px",
                    border: error ? "2px solid #ff6b6b" : "1px solid #e0e0e0",
                    paddingLeft: "60px",
                    backgroundColor: error ? "#fff5f5" : "#fff",
                    fontSize: "0.95rem", fontWeight: "500", color: "#333",
                    outline: "none", transition: "0.3s"
                }}
                onFocus={(e) => e.target.style.borderColor = color}
                onBlur={(e) => e.target.style.borderColor = error ? "#ff6b6b" : "#e0e0e0"}
            />
        </div>
    );
}

export default LoginForm;