import React, { useState, useEffect } from "react";
import userServices from "../services/userServices";
import groupService from "../services/groupService";
import { FaUser, FaIdBadge, FaLock, FaSchool } from "react-icons/fa";
import Logoprincipal from "../assets/Logoprincipal.png";
import garra from "../assets/garra.png";

export default function RegisterForm() {
    const [formData, setFormData] = useState({
        matricula: "",
        name: "",
        password: "",
        grupo: "",
    });

    const [groups, setGroups] = useState([]);

    const colors = {
        primary: "#00B8C8",
        secondary: "#007E8C",
        darkTeal: "#00838F",
        bgLight: "#F5F8FA",
        textDark: "#3333",
    };

    // === Cargar grupos desde backend ===
    useEffect(() => {
        const loadGroups = async () => {
            try {
                const response = await groupService.getAll();
                // La API responde { data: [...] }
                setGroups(response.data.data || []);
            } catch (error) {
                console.error("Error al cargar grupos:", error);
            }
        };

        loadGroups();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(formData.grupo);
        const payload = {
            matricula: formData.matricula,
            name: formData.name,
            password: formData.password,
            group: formData.grupo, // ← ahora sí se envía el grupo elegido
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
            {/* Fondo superior */}
            <div
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "75vh",
                    backgroundColor: colors.darkTeal,
                    borderBottomLeftRadius: "60px",
                    borderBottomRightRadius: "60px",
                    zIndex: 1,
                }}
            />

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

            {/* Tarjeta */}
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
                {/* Garrita decorativa */}
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

                {/* Inputs */}
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

                {/* SOLO SELECT DE GRUPO */}
                <SelectField
                    icon={<FaSchool />}
                    name="grupo"
                    value={formData.grupo}
                    onChange={handleChange}
                    options={[
                        { value: "", label: "Seleccione grupo" },
                        ...groups.map((g) => ({
                            value: g._id,
                            label: g.name,
                        })),
                    ]}
                />

                {/* Botón */}
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
      INPUT FIELD
======================= */
function InputField({ icon, placeholder, type = "text", name, value, onChange }) {
    const colors = { primary: "#00B8C8", textDark: "#333" };

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
                }}
            />
        </div>
    );
}

/* =======================
      SELECT FIELD
======================= */
function SelectField({ icon, name, value, onChange, options }) {
    const colors = { primary: "#00B8C8", textDark: "#555" };

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
                }}
            >
                {options.map((opt, i) => (
                    <option key={i} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
        </div>
    );
}
