import React, { useState, useEffect } from "react";
import userServices from "../services/userServices";
import groupService from "../services/groupService";
import { useNavigate, Link } from "react-router-dom"; // Link para "Ya tengo cuenta"
import { FaUser, FaIdBadge, FaLock, FaSchool } from "react-icons/fa";
import { ArrowLeft } from "lucide-react"; // Icono de flecha
import Logoprincipal from "../assets/Logoprincipal.png";
import garra from "../assets/garra.png";

export default function RegisterForm() {
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        matricula: "",
        name: "",
        password: "",
        area: "",
        nivel: "",
        grupo: "",
    });

    const [areaOptions, setAreaOptions] = useState([]);

    // Cargar áreas
    useEffect(() => {
        const fetchAreas = async () => {
            try {
                const res = await groupService.getAreas();
                const areasData = res.data.data || [];
                const options = areasData.map(area => ({ value: area, label: area }));
                if (options.length > 0) setAreaOptions([{ value: "", label: "Seleccione área" }, ...options]);
                else setAreaOptions([{ value: "", label: "No hay áreas registradas" }]);
            } catch (error) {
                setAreaOptions([{ value: "", label: "Escribe tu área manualmente" }]);
            }
        };
        fetchAreas();
    }, []);

    const colors = {
        primary: "#00B8C8",
        secondary: "#007E8C",
        darkTeal: "#00838F",
        bgLight: "#F5F8FA",
        textDark: "#333",
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.nivel || !formData.area || !formData.grupo) return alert("Por favor selecciona todos los datos de tu grupo.");
        if (!formData.matricula || !formData.name || !formData.password) return alert("Por favor completa tus datos personales.");

        const payload = { ...formData }; // Copia directa porque los nombres coinciden

        try {
            await userServices.register(payload);
            alert("¡Registro exitoso! Inicia sesión.");
            navigate("/"); 
        } catch (error) {
            console.error("Error:", error);
            alert(error.response?.data?.message || "Error al registrar.");
        }
    };

    return (
        <div className="d-flex flex-column align-items-center justify-content-start min-vh-100"
            style={{ position: "relative", backgroundColor: colors.bgLight, overflow: "hidden", fontFamily: "Poppins, sans-serif" }}
        >
            {/* FONDO */}
            <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "60vh", minHeight: "400px", backgroundColor: colors.darkTeal, borderBottomLeftRadius: "60px", borderBottomRightRadius: "60px", zIndex: 1 }} />

            {/* LOGO */}
            <img src={Logoprincipal} alt="Logo" style={{ position: "relative", zIndex: 2, width: "120px", marginTop: "2rem", filter: "drop-shadow(0 4px 10px rgba(0,0,0,0.25))" }} />

            {/* TARJETA */}
            <div style={{ position: "relative", zIndex: 3, backgroundColor: "#fff", width: "90%", maxWidth: "450px", borderRadius: "25px", boxShadow: "0 10px 30px rgba(0,0,0,0.15)", padding: "2rem 1.8rem", marginTop: "1.5rem", marginBottom: "3rem" }}>
                
                {/* BOTÓN ATRÁS (Flotante en la tarjeta) */}
                <button 
                    onClick={() => navigate("/")} 
                    style={{ position: "absolute", top: "20px", left: "20px", background: "none", border: "none", cursor: "pointer", color: "#666" }}
                >
                    <ArrowLeft size={24} />
                </button>

                {/* Decoración */}
                <img src={garra} alt="Garra" style={{ position: "absolute", top: "-25px", right: "25px", width: "55px", opacity: 0.15 }} />

                {/* ENCABEZADO */}
                <h2 style={{ textAlign: "center", color: colors.secondary, fontWeight: "bold", marginTop: "10px", marginBottom: "25px" }}>
                    Crear Cuenta
                </h2>

                {/* FORMULARIO */}
                <InputField icon={<FaIdBadge />} placeholder="Matrícula" name="matricula" value={formData.matricula} onChange={handleChange} />
                <InputField icon={<FaUser />} placeholder="Nombre completo" name="name" value={formData.name} onChange={handleChange} />
                <InputField icon={<FaLock />} placeholder="Contraseña" type="password" name="password" value={formData.password} onChange={handleChange} />

                <SelectField
                    icon={<FaSchool />}
                    name="area"
                    value={formData.area}
                    onChange={handleChange}
                    options={areaOptions.length > 0 ? areaOptions : [{ value: "", label: "Cargando áreas..." }]}
                />

                <div className="row g-2"> {/* Fila para poner nivel y grupo juntos si quieres ahorrar espacio, o dejarlos separados */}
                    <div className="col-12">
                         <SelectField
                            icon={<FaSchool />}
                            name="nivel"
                            value={formData.nivel}
                            onChange={handleChange}
                            options={[
                                { value: "", label: "Nivel Académico" },
                                { value: "Técnico", label: "Técnico (TSU)" },
                                { value: "Ingeniería", label: "Ingeniería" },
                                { value: "Licenciatura", label: "Licenciatura" },
                            ]}
                        />
                    </div>
                    <div className="col-12">
                        <SelectField
                            icon={<FaSchool />}
                            name="grupo"
                            value={formData.grupo}
                            onChange={handleChange}
                            options={[
                                { value: "", label: "Grupo" },
                                { value: "1A", label: "1A" }, { value: "1B", label: "1B" },
                                { value: "2A", label: "2A" }, { value: "2B", label: "2B" },
                                { value: "3A", label: "3A" }, { value: "3B", label: "3B" },
                                { value: "4A", label: "4A" }, { value: "4B", label: "4B" },
                                { value: "5A", label: "5A" }, { value: "5B", label: "5B" },
                                { value: "6A", label: "6A" }, { value: "6B", label: "6B" },
                                { value: "7A", label: "7A" }, { value: "7B", label: "7B" },
                                { value: "8A", label: "8A" }, { value: "8B", label: "8B" },
                                { value: "9A", label: "9A" }, { value: "9B", label: "9B" },
                                { value: "10A", label: "10A" }, { value: "10B", label: "10B" },
                            ]}
                        />
                    </div>
                </div>

                <div className="text-center mt-4">
                    <button onClick={handleSubmit} className="fw-bold text-white"
                        style={{ width: "100%", height: "50px", borderRadius: "25px", backgroundColor: colors.secondary, border: "none", boxShadow: "0 6px 15px rgba(0,0,0,0.25)", fontSize: "1rem", letterSpacing: "0.5px", cursor: "pointer", transition: "0.3s" }}
                        onMouseEnter={(e) => (e.target.style.backgroundColor = colors.primary)}
                        onMouseLeave={(e) => (e.target.style.backgroundColor = colors.secondary)}
                    >
                        Registrarse
                    </button>
                    
                    <div className="mt-3">
                        <span style={{color: "#666", fontSize: "0.9rem"}}>¿Ya tienes cuenta? </span>
                        <Link to="/" style={{color: colors.primary, fontWeight: "bold", textDecoration: "none"}}>Inicia Sesión</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

// --- COMPONENTES AUXILIARES ---

function InputField({ icon, placeholder, type = "text", name, value, onChange }) {
    const colors = { primary: "#00B8C8", textDark: "#333" };
    return (
        <div style={{ position: "relative", marginBottom: "1.2rem" }}>
            <div style={{ position: "absolute", top: "50%", left: "0", transform: "translateY(-50%)", color: colors.primary, fontSize: "1.1rem", width: "35px", textAlign: "center" }}>{icon}</div>
            <input type={type} placeholder={placeholder} name={name} value={value} onChange={onChange} style={{ width: "100%", border: "none", borderBottom: `2px solid #ccc`, paddingLeft: "45px", backgroundColor: "transparent", fontSize: "0.95rem", fontWeight: "600", color: colors.textDark, outline: "none", transition: "0.3s ease", height: "40px" }} onFocus={(e) => (e.target.style.borderBottom = `2px solid ${colors.primary}`)} onBlur={(e) => (e.target.style.borderBottom = "2px solid #ccc")} />
        </div>
    );
}

function SelectField({ icon, name, value, onChange, options }) {
    const colors = { primary: "#00B8C8", textDark: "#555" };
    return (
        <div style={{ position: "relative", marginBottom: "1.2rem" }}>
            <div style={{ position: "absolute", top: "50%", left: "0", transform: "translateY(-50%)", color: colors.primary, fontSize: "1.1rem", width: "35px", textAlign: "center" }}>{icon}</div>
            <select name={name} value={value} onChange={onChange} style={{ width: "100%", border: "none", borderBottom: "2px solid #ccc", paddingLeft: "45px", backgroundColor: "transparent", fontSize: "0.95rem", fontWeight: "600", color: colors.textDark, outline: "none", appearance: "none", transition: "0.3s ease", cursor: "pointer", height: "40px" }} onFocus={(e) => (e.target.style.borderBottom = `2px solid ${colors.primary}`)} onBlur={(e) => (e.target.style.borderBottom = "2px solid #ccc")}>
                {options.map((opt, i) => <option key={i} value={opt.value}>{opt.label}</option>)}
            </select>
        </div>
    );
}