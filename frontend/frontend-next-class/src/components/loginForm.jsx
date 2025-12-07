import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaLock } from "react-icons/fa";
import api from "../services/axiosConfig.js";

import Logoprincipal from "../assets/Logoprincipal.png";
import garra from "../assets/garra.png";

function LoginForm() {
    const [formData, setFormData] = useState({
        matricula: "",
        password: ""
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const navigate = useNavigate();

    // 🎨 Colores basados 100% en el panel Admin
    const colors = {
        primary: "#00B8C8",
        secondary: "#007E8C",
        darkTeal: "#00838F",
        textDark: "#333",
        bgLight: "#F5F8FA",
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

   const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
        const res = await api.post("/auth/login", formData);

        localStorage.setItem("authToken", res.data.token);

        if (res.data.role === "admin") {
            return navigate("/panelControlAdmin");
        }

        navigate("/dashboardAlumnos");

    } catch (err) {
        setError("Matrícula o contraseña incorrecta");
    }
};


    return (
        <div
            className="d-flex flex-column align-items-center min-vh-100"
            style={{
                background: `linear-gradient(to bottom, ${colors.darkTeal} 50%, ${colors.bgLight} 50%)`,
                overflow: "hidden",
                position: "relative",
                fontFamily: "Poppins, sans-serif",
            }}
        >
            {/* SECCIÓN SUPERIOR */}
            <div
                style={{
                    textAlign: "center",
                    color: "white",
                    paddingTop: "3rem",
                    paddingBottom: "2rem",
                }}
            >
                <img
                    src={Logoprincipal}
                    alt="Logo"
                    style={{
                        width: "150px",
                        filter: "drop-shadow(0 0 14px rgba(255,255,255,0.5))",
                        marginBottom: "0.5rem",
                    }}
                />
                <h2 style={{ fontWeight: "700", marginBottom: "0.3rem", letterSpacing: "1px" }}>
                    NEXTCLASS
                </h2>
                <p style={{ fontSize: "1.2rem", opacity: 0.9 }}>Bienvenido</p>
            </div>

            {/* TARJETA INFERIOR */}
            <div
                style={{
                    backgroundColor: colors.bgLight,
                    borderTopLeftRadius: "60px",
                    borderTopRightRadius: "60px",
                    width: "100%",
                    maxWidth: "400px",
                    flex: 1,
                    padding: "2.5rem 1.5rem",
                    boxShadow: "0 -8px 25px rgba(0,0,0,0.1)",
                    position: "relative",
                }}
            >
                <img
                    src={garra}
                    alt="Decorativo"
                    style={{
                        position: "absolute",
                        top: "0",
                        right: "25px",
                        width: "70px",
                        transform: "translateY(-35%)",
                        opacity: 0.15,
                    }}
                />

                <h3
                    style={{
                        color: colors.secondary,
                        fontWeight: "700",
                        marginBottom: "1.8rem",
                        textAlign: "left",
                        fontSize: "1.4rem",
                    }}
                >
                    Login
                </h3>

                {/* MENSAJES */}
                {error && <div className="alert alert-danger">{error}</div>}
                {success && <div className="alert alert-success">{success}</div>}

                <form onSubmit={handleSubmit}>
                    {/* INPUT MATRÍCULA */}
                    <div style={{ position: "relative", marginBottom: "1.2rem" }}>
                        
                        <div
                            style={{
                                position: "absolute",
                                top: "50%",
                                left: "10px",
                                transform: "translateY(-50%)",
                                width: "45px",
                                height: "45px",
                                borderRadius: "50%",
                                backgroundColor: colors.primary,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
                            }}
                        >
                            <FaUser color="white" size={18} />
                        </div>

                        <input
                            type="text"
                            placeholder="Matrícula"
                            name="matricula"
                            value={formData.matricula}
                            onChange={handleChange}
                            style={{
                                width: "100%",
                                height: "55px",
                                borderRadius: "15px",
                                border: "1px solid #ddd",
                                paddingLeft: "65px",
                                backgroundColor: "white",
                                fontSize: "1rem",
                                fontWeight: "500",
                                color: colors.textDark,
                                boxShadow: "0 3px 10px rgba(0,0,0,0.08)",
                            }}
                        />
                    </div>

                    {/* INPUT CONTRASEÑA */}
                    <div style={{ position: "relative", marginBottom: "1.2rem" }}>

                        <div
                            style={{
                                position: "absolute",
                                top: "50%",
                                left: "10px",
                                transform: "translateY(-50%)",
                                width: "45px",
                                height: "45px",
                                borderRadius: "50%",
                                backgroundColor: colors.secondary,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
                            }}
                        >
                            <FaLock color="white" size={17} />
                        </div>

                        <input
                            type="password"
                            placeholder="Contraseña"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            style={{
                                width: "100%",
                                height: "55px",
                                borderRadius: "15px",
                                border: "1px solid #ddd",
                                paddingLeft: "65px",
                                backgroundColor: "white",
                                fontSize: "1rem",
                                fontWeight: "500",
                                color: colors.textDark,
                                boxShadow: "0 3px 10px rgba(0,0,0,0.08)",
                            }}
                        />
                    </div>

                    {/* ENLACE RECUPERAR */}
                    <div className="text-end" style={{ marginBottom: "1.5rem" }}>
                        <Link
                            to="/forgot-password"
                            style={{
                                color: colors.primary,
                                fontWeight: "600",
                                textDecoration: "none",
                                fontSize: "0.9rem",
                            }}
                        >
                            ¿Olvidaste tu contraseña?
                        </Link>
                    </div>

                    {/* BOTÓN LOGIN */}
                    <div className="text-center">
                        <button
                            type="submit"
                            className="fw-bold text-white"
                            style={{
                                width: "140px",
                                height: "45px",
                                borderRadius: "25px",
                                backgroundColor: colors.secondary,
                                border: "none",
                                boxShadow: "0 6px 14px rgba(0,0,0,0.2)",
                                fontSize: "1rem",
                                letterSpacing: "0.5px",
                                marginBottom: "1rem",
                            }}
                        >
                            Iniciar sesión
                        </button>

                        <br />

                        {/* BOTÓN SIGN UP */}
                        <Link
                            to="/register"
                            className="fw-bold d-inline-block text-center"
                            style={{
                                width: "140px",
                                height: "45px",
                                lineHeight: "45px",
                                borderRadius: "25px",
                                backgroundColor: "#fff",
                                color: colors.textDark,
                                boxShadow: "0 6px 14px rgba(0,0,0,0.2)",
                                textDecoration: "none",
                                fontWeight: "600",
                            }}
                        >
                            Sign Up
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default LoginForm;
