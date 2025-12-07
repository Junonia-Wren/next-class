import React, { useState } from "react";
import userServices from "../services/userServices";
import { FaUser, FaIdBadge, FaLock, FaSchool } from "react-icons/fa";
import Logoprincipal from "../assets/Logoprincipal.png";
import garra from "../assets/garra.png";

export default function RegisterForm() {
    const [formData, setFormData] = useState({
        matricula: "",
        name: "",
        password: "",
        area: "",
        nivel: "",
        grupo: "",
    });

    // 🎨 Paleta del Admin Panel
    const colors = {
        primary: "#00B8C8",
        secondary: "#007E8C",
        darkTeal: "#00838F",
        bgLight: "#F5F8FA",
        textDark: "#3333",
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

const handleSubmit = async (e) => {
    e.preventDefault();

    // Solo los campos que tu backend acepta (matricula, name, password)
    const payload = {
        matricula: formData.matricula,
        name: formData.name,
        password: formData.password
    };

    try {
        const response = await userServices.register(payload);
        console.log("Usuario registrado:", response.data);
        alert("Registro exitoso");
    } catch (error) {
        console.error("Error en registro:", error);
        alert("Error al registrar usuario");
    }
};


    return (
        <div
            className="d-flex flex-column align-items-center justify-content-start min-vh-100"
            style={{
                position: "relative",
                backgroundColor: colors.bgLight,
                overflow: "hidden",
                fontFamily: "Poppins, sans-serif",
            }}
        >
            {/* FONDO SUPERIOR */}
            <div
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "75vh",
                    minHeight: "480px",
                    backgroundColor: colors.darkTeal,
                    borderBottomLeftRadius: "60px",
                    borderBottomRightRadius: "60px",
                    zIndex: 1,
                }}
            />

            {/* LOGO PRINCIPAL */}
            <img
                src={Logoprincipal}
                alt="Logo principal"
                style={{
                    position: "relative",
                    zIndex: 2,
                    width: "130px",
                    marginTop: "3rem",
                    filter: "drop-shadow(0 4px 10px rgba(0,0,0,0.25))",
                }}
            />

            {/* TARJETA */}
            <div
                style={{
                    position: "relative",
                    zIndex: 3,
                    backgroundColor: "#fff",
                    width: "90%",
                    maxWidth: "450px",
                    borderRadius: "25px",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
                    padding: "2.5rem 1.8rem",
                    marginTop: "2.5rem",
                }}
            >
                {/* GARrita decorativa */}
                <img
                    src={garra}
                    alt="Mini logo"
                    style={{
                        position: "absolute",
                        top: "-25px",
                        right: "25px",
                        width: "55px",
                        opacity: 0.15,
                    }}
                />

                {/* == CAMPOS == */}
                <InputField
                    icon={<FaIdBadge />}
                    placeholder="Matrícula"
                    name="matricula"
                    value={formData.matricula}
                    onChange={handleChange}
                />

                <InputField
                    icon={<FaUser />}
                    placeholder="Nombre completo"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                />

                <InputField
                    icon={<FaLock />}
                    placeholder="Contraseña"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                />

                {/* SELECTS */}
                <SelectField
                    icon={<FaSchool />}
                    name="area"
                    value={formData.area}
                    onChange={handleChange}
                    options={[
                        { value: "", label: "Seleccione área" },
                        { value: "DSM", label: "DSM" },
                        { value: "EVND", label: "EVND" },
                    ]}
                />

                <SelectField
                    icon={<FaSchool />}
                    name="nivel"
                    value={formData.nivel}
                    onChange={handleChange}
                    options={[
                        { value: "", label: "Seleccione nivel" },
                        { value: "Técnico", label: "Técnico" },
                        { value: "Ingeniería", label: "Ingeniería" },
                    ]}
                />

                <SelectField
                    icon={<FaSchool />}
                    name="grupo"
                    value={formData.grupo}
                    onChange={handleChange}
                    options={[
                        { value: "", label: "Seleccione grupo" },
                        { value: "1A", label: "1A" },
                        { value: "1B", label: "1B" },
                        { value: "2A", label: "2A" },
                        { value: "2B", label: "2B" },
                        { value: "3A", label: "3A" },
                        { value: "3B", label: "3B" },
                        { value: "4A", label: "4A" },
                        { value: "4B", label: "4B" },
                        { value: "5A", label: "5A" },
                        { value: "5B", label: "5B" },
                        { value: "6A", label: "6A" },
                        { value: "6B", label: "6B" },
                        { value: "8A", label: "8A" },
                        { value: "8B", label: "8B" },
                        { value: "9A", label: "9A" },
                        { value: "9B", label: "9B" },
                        { value: "10A", label: "10A" },
                        { value: "10B", label: "10B" },
                    ]}
                />

                {/* BOTÓN REGISTRAR */}
                <div className="text-center mt-4">
                    <button
                        onClick={handleSubmit}
                        className="fw-bold text-white"
                        style={{
                            width: "180px",
                            height: "50px",
                            borderRadius: "25px",
                            backgroundColor: colors.secondary,
                            border: "none",
                            boxShadow: "0 6px 15px rgba(0,0,0,0.25)",
                            fontSize: "1rem",
                            letterSpacing: "0.5px",
                        }}
                        onMouseEnter={(e) => (e.target.style.backgroundColor = colors.primary)}
                        onMouseLeave={(e) => (e.target.style.backgroundColor = colors.secondary)}
                    >
                        Registrar
                    </button>
                </div>
            </div>
        </div>
    );
}

/* =======================
     COMPONENTE INPUT
======================= */
function InputField({ icon, placeholder, type = "text", name, value, onChange }) {
    const colors = {
        primary: "#00B8C8",
        textDark: "#333",
    };

    return (
        <div style={{ position: "relative", marginBottom: "1.8rem" }}>
            <div
                style={{
                    position: "absolute",
                    top: "50%",
                    left: "0",
                    transform: "translateY(-50%)",
                    color: colors.primary,
                    fontSize: "1.1rem",
                    width: "35px",
                    textAlign: "center",
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
                    width: "100%",
                    border: "none",
                    borderBottom: `2px solid #ccc`,
                    paddingLeft: "45px",
                    backgroundColor: "transparent",
                    fontSize: "1rem",
                    fontWeight: "600",
                    color: colors.textDark,
                    outline: "none",
                    transition: "0.3s ease",
                }}
                onFocus={(e) => (e.target.style.borderBottom = `2px solid ${colors.primary}`)}
                onBlur={(e) => (e.target.style.borderBottom = "2px solid #ccc")}
            />
        </div>
    );
}

/* =======================
     COMPONENTE SELECT
======================= */
function SelectField({ icon, name, value, onChange, options }) {
    const colors = {
        primary: "#00B8C8",
        textDark: "#555",
    };

    return (
        <div style={{ position: "relative", marginBottom: "1.8rem" }}>
            <div
                style={{
                    position: "absolute",
                    top: "50%",
                    left: "0",
                    transform: "translateY(-50%)",
                    color: colors.primary,
                    fontSize: "1.1rem",
                    width: "35px",
                    textAlign: "center",
                }}
            >
                {icon}
            </div>

            <select
                name={name}
                value={value}
                onChange={onChange}
                style={{
                    width: "100%",
                    border: "none",
                    borderBottom: "2px solid #ccc",
                    paddingLeft: "45px",
                    backgroundColor: "transparent",
                    fontSize: "1rem",
                    fontWeight: "600",
                    color: colors.textDark,
                    outline: "none",
                    appearance: "none",
                    transition: "0.3s ease",
                }}
                onFocus={(e) => (e.target.style.borderBottom = `2px solid ${colors.primary}`)}
                onBlur={(e) => (e.target.style.borderBottom = "2px solid #ccc")}
            >
                {options.map((opt, i) => (
                    <option key={i} value={opt.value} style={{ color: "#555" }}>
                        {opt.label}
                    </option>
                ))}
            </select>
        </div>
    );
}
