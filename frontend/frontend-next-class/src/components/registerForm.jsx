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

    const colorPrincipal = "#00B8C8";

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Datos del formulario", formData);
        const response = await userServices.register(formData);
        console.log(response);
    };

    return (
        <div
            className="d-flex flex-column align-items-center justify-content-start min-vh-100"
            style={{
                position: "relative",
                backgroundColor: "#f5f8fa",
                overflow: "hidden",
                fontFamily: "Poppins, sans-serif",
            }}
        >
            {/* Fondo azul */}
            <div
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "75vh",
                    minHeight: "480px",
                    backgroundColor: colorPrincipal,
                    borderBottomLeftRadius: "60px",
                    borderBottomRightRadius: "60px",
                    zIndex: 1,
                }}
            ></div>

            {/* Logo */}
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

            {/* Tarjeta principal */}
            <div
                style={{
                    position: "relative",
                    zIndex: 3,
                    backgroundColor: "#fff",
                    width: "90%",
                    maxWidth: "450px",
                    borderRadius: "25px",
                    boxShadow: "0 10px 25px rgba(0,0,0,0.25)",
                    padding: "2.5rem 1.8rem",
                    marginTop: "2.5rem",
                }}
            >
                {/* Mini logo flotante */}
                <img
                    src={garra}
                    alt="Mini logo"
                    style={{
                        position: "absolute",
                        top: "-25px",
                        right: "25px",
                        width: "55px",
                        filter: "drop-shadow(0 3px 6px rgba(0,0,0,0.3))",
                    }}
                />

                {/* === CAMPOS === */}

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

                {/* SELECT Área */}
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

                {/* SELECT Nivel */}
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

                {/* SELECT Grupo */}
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

                {/* BOTÓN Registrar */}
                <div className="text-center mt-4">
                    <button
                        onClick={handleSubmit}
                        className="fw-bold text-white"
                        style={{
                            width: "180px",
                            height: "50px",
                            borderRadius: "10px",
                            backgroundColor: "#007E8C",
                            border: "none",
                            boxShadow: "0 5px 15px rgba(0,0,0,0.3)",
                            transition: "0.3s ease",
                            fontSize: "1rem",
                        }}
                        onMouseEnter={(e) => (e.target.style.backgroundColor = "#009AA8")}
                        onMouseLeave={(e) => (e.target.style.backgroundColor = "#007E8C")}
                    >
                        Registrar
                    </button>
                </div>
            </div>
        </div>
    );
}

/* === COMPONENTE INPUT === */
function InputField({ icon, placeholder, type = "text", name, value, onChange }) {
    const colorPrincipal = "#00B8C8";

    return (
        <div style={{ position: "relative", marginBottom: "1.8rem" }}>
            <div
                style={{
                    position: "absolute",
                    top: "50%",
                    left: "0",
                    transform: "translateY(-50%)",
                    color: "#777",
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
                    borderBottom: "2px solid #ccc",
                    paddingLeft: "45px",
                    backgroundColor: "transparent",
                    fontSize: "1rem",
                    fontWeight: "600",
                    color: "#555",
                    outline: "none",
                    transition: "border-color 0.3s ease",
                }}
                onFocus={(e) => (e.target.style.borderBottom = `2px solid ${colorPrincipal}`)}
                onBlur={(e) => (e.target.style.borderBottom = "2px solid #ccc")}
            />
        </div>
    );
}

/* === COMPONENTE SELECT === */
function SelectField({ icon, name, value, onChange, options }) {
    const colorPrincipal = "#00B8C8";

    return (
        <div style={{ position: "relative", marginBottom: "1.8rem" }}>
            <div
                style={{
                    position: "absolute",
                    top: "50%",
                    left: "0",
                    transform: "translateY(-50%)",
                    color: "#777",
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
                    color: "#555",
                    outline: "none",
                    appearance: "none",
                }}
                onFocus={(e) => (e.target.style.borderBottom = `2px solid ${colorPrincipal}`)}
                onBlur={(e) => (e.target.style.borderBottom = "2px solid #ccc")}
            >
                {options.map((opt, i) => (
                    <option key={i} value={opt.value} style={{ color: "#333" }}>
                        {opt.label}
                    </option>
                ))}
            </select>
        </div>
    );
}
