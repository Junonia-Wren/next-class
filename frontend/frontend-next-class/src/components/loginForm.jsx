import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaLock } from "react-icons/fa";
import userServices from "../services/userServices";
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
    const colorPrincipal = "#00B8C8";

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
            const response = await userServices.login(formData);
            console.log("Respuesta del servidor:", response.data);

            setSuccess("Inicio de sesión exitoso");

            if (response.data.token) {
                localStorage.setItem("token", response.data.token);
            }

            navigate("/dashboard");
        } catch (err) {
            console.log(err);
            setError("Matrícula o contraseña incorrecta");
        }
    };

    return (
        <div
            className="d-flex flex-column align-items-center min-vh-100"
            style={{
                background: "linear-gradient(to bottom, #00838F 50%, #F5F8FA 50%)",
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
                <h2 style={{ fontWeight: "700", marginBottom: "0.3rem" }}>NEXTCLASS</h2>
                <p style={{ fontSize: "1.2rem", opacity: 0.9 }}>Bienvenido</p>
            </div>

            {/* TARJETA INFERIOR */}
            <div
                style={{
                    backgroundColor: "#F5F8FA",
                    borderTopLeftRadius: "60px",
                    borderTopRightRadius: "60px",
                    width: "100%",
                    maxWidth: "400px",
                    flex: 1,
                    padding: "2.5rem 1.5rem",
                    boxShadow: "0 -5px 15px rgba(0,0,0,0.15)",
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
                        opacity: 0.8,
                    }}
                />

                <h3
                    style={{
                        color: "#007E8C",
                        fontWeight: "700",
                        marginBottom: "1.8rem",
                        textAlign: "left",
                    }}
                >
                    Login
                </h3>

                {/* MENSAJES */}
                {error && (
                    <div className="alert alert-danger">{error}</div>
                )}
                {success && (
                    <div className="alert alert-success">{success}</div>
                )}

                <form onSubmit={handleSubmit}>
                    {/* INPUT MATRÍCULA */}
                    <div style={{ position: "relative", marginBottom: "1.2rem" }}>
                        <div
                            style={{
                                position: "absolute",
                                top: "50%",
                                left: "0",
                                transform: "translateY(-50%)",
                                width: "58px",
                                height: "58px",
                                borderRadius: "50%",
                                backgroundColor: "#fff",
                                border: "1px solid #ccc",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                boxShadow: "0 2px 5px rgba(0,0,0,0.15)",
                                transition: "all 0.3s ease",
                                zIndex: 2,
                            }}
                        >
                            <FaUser color={colorPrincipal} size={20} />
                        </div>

                        <input
                            type="text"
                            placeholder="Matrícula"
                            name="matricula"
                            value={formData.matricula}
                            onChange={handleChange}
                            style={{
                                width: "100%",
                                height: "58px",
                                borderRadius: "50px",
                                border: "1px solid #ccc",
                                paddingLeft: "75px",
                                backgroundColor: "#fff",
                                boxShadow: "0 3px 6px rgba(0,0,0,0.1)",
                                fontSize: "1rem",
                                fontWeight: "600",
                                color: "#555",
                                outline: "none",
                            }}
                        />
                    </div>

                    {/* INPUT CONTRASEÑA */}
                    <div style={{ position: "relative", marginBottom: "1rem" }}>
                        <div
                            style={{
                                position: "absolute",
                                top: "50%",
                                left: "0",
                                transform: "translateY(-50%)",
                                width: "58px",
                                height: "58px",
                                borderRadius: "50%",
                                backgroundColor: "#fff",
                                border: "1px solid #ccc",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                boxShadow: "0 2px 5px rgba(0,0,0,0.15)",
                                transition: "all 0.3s ease",
                                zIndex: 2,
                            }}
                        >
                            <FaLock color={colorPrincipal} size={20} />
                        </div>

                        <input
                            type="password"
                            placeholder="Contraseña"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            style={{
                                width: "100%",
                                height: "58px",
                                borderRadius: "50px",
                                border: "1px solid #ccc",
                                paddingLeft: "75px",
                                backgroundColor: "#fff",
                                boxShadow: "0 3px 6px rgba(0,0,0,0.1)",
                                fontSize: "1rem",
                                fontWeight: "600",
                                color: "#555",
                                outline: "none",
                            }}
                        />
                    </div>

                    {/* ENLACE RECUPERAR */}
                    <div className="text-end" style={{ marginBottom: "1.5rem" }}>
                        <Link
                            to="/forgot-password"
                            className="btn btn-link p-0"
                            style={{
                                textDecoration: "none",
                                color: colorPrincipal,
                                fontSize: "0.9rem",
                                fontWeight: "500",
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
                                width: "130px",
                                height: "42px",
                                borderRadius: "25px",
                                backgroundColor: "#007E8C",
                                border: "none",
                                boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
                                marginBottom: "1rem",
                            }}
                        >
                            Iniciar sesión
                        </button>

                        <br />

                        {/* BOTÓN REGISTRO */}
                        <Link
                            to="/register"
                            className="fw-bold d-inline-block text-center"
                            style={{
                                width: "130px",
                                height: "42px",
                                lineHeight: "42px",
                                borderRadius: "25px",
                                backgroundColor: "#fff",
                                color: "#000",
                                border: "none",
                                boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
                                textDecoration: "none",
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
