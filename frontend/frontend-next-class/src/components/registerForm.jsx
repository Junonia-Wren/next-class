import React, { useState, useEffect } from "react";
import userServices from "../services/userServices";
import groupService from "../services/groupService"; // Importamos el servicio de grupos
import { useNavigate } from "react-router-dom"; // Para redirigir al login
import { FaUser, FaIdBadge, FaLock, FaSchool } from "react-icons/fa";
import Logoprincipal from "../assets/Logoprincipal.png";
import garra from "../assets/garra.png";

export default function RegisterForm() {
    const navigate = useNavigate(); // Hook de navegación
    
    // Estado del formulario
    const [formData, setFormData] = useState({
        matricula: "",
        name: "",
        password: "",
        area: "",
        nivel: "",
        grupo: "",
    });

    // Estado para las opciones de Área (Dinámicas desde Backend)
    const [areaOptions, setAreaOptions] = useState([]);

    // Cargar áreas al iniciar el componente
    useEffect(() => {
        const fetchAreas = async () => {
            try {
                // Obtenemos las áreas únicas que el Admin ya registró en las clases
                const res = await groupService.getAreas();
                const areasData = res.data.data || [];
                
                // Convertimos el array de strings a objetos { value, label }
                const options = areasData.map(area => ({
                    value: area,
                    label: area
                }));
                
                // Si hay datos, los ponemos; si no, dejamos opción default
                if (options.length > 0) {
                    setAreaOptions([{ value: "", label: "Seleccione área" }, ...options]);
                } else {
                    setAreaOptions([{ value: "", label: "No hay áreas registradas" }]);
                }
            } catch (error) {
                console.error("Error cargando áreas", error);
                // Fallback en caso de error
                setAreaOptions([{ value: "", label: "Escribe tu área manualmente" }]);
            }
        };
        fetchAreas();
    }, []);

    // 🎨 Paleta de colores
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

        // 1. Validación de campos obligatorios
        if (!formData.nivel || !formData.area || !formData.grupo) {
            return alert("Por favor selecciona todos los datos de tu grupo (Nivel, Área y Grupo).");
        }
        if (!formData.matricula || !formData.name || !formData.password) {
            return alert("Por favor completa tus datos personales.");
        }

        // 2. Preparar el payload
        const payload = {
            matricula: formData.matricula,
            name: formData.name,
            password: formData.password,
            // Datos vitales para la auto-asignación de grupo:
            nivel: formData.nivel,
            area: formData.area,
            grupo: formData.grupo
        };

        try {
            // 3. Enviar al backend
            const response = await userServices.register(payload);
            console.log("Registro exitoso:", response.data);
            
            alert("¡Registro exitoso! Ahora inicia sesión con tus credenciales.");
            
            // 4. Redirigir al Login
            navigate("/"); 

        } catch (error) {
            console.error("Error en registro:", error);
            // Mostrar el mensaje específico del backend si existe (ej: "Matrícula duplicada")
            const errorMsg = error.response?.data?.message || "Ocurrió un error al intentar registrarte.";
            alert(errorMsg);
        }
    };

    return (
        <div className="d-flex flex-column align-items-center justify-content-start min-vh-100"
            style={{ position: "relative", backgroundColor: colors.bgLight, overflow: "hidden", fontFamily: "Poppins, sans-serif" }}
        >
            {/* FONDO SUPERIOR */}
            <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "75vh", minHeight: "480px", backgroundColor: colors.darkTeal, borderBottomLeftRadius: "60px", borderBottomRightRadius: "60px", zIndex: 1 }} />

            {/* LOGO */}
            <img src={Logoprincipal} alt="Logo" style={{ position: "relative", zIndex: 2, width: "130px", marginTop: "3rem", filter: "drop-shadow(0 4px 10px rgba(0,0,0,0.25))" }} />

            {/* TARJETA FORMULARIO */}
            <div style={{ position: "relative", zIndex: 3, backgroundColor: "#fff", width: "90%", maxWidth: "450px", borderRadius: "25px", boxShadow: "0 10px 30px rgba(0,0,0,0.15)", padding: "2.5rem 1.8rem", marginTop: "2.5rem", marginBottom: "3rem" }}>
                
                {/* Decoración */}
                <img src={garra} alt="Garra" style={{ position: "absolute", top: "-25px", right: "25px", width: "55px", opacity: 0.15 }} />

                {/* == CAMPOS PERSONALES == */}
                <InputField icon={<FaIdBadge />} placeholder="Matrícula" name="matricula" value={formData.matricula} onChange={handleChange} />
                <InputField icon={<FaUser />} placeholder="Nombre completo" name="name" value={formData.name} onChange={handleChange} />
                <InputField icon={<FaLock />} placeholder="Contraseña" type="password" name="password" value={formData.password} onChange={handleChange} />

                {/* == SELECTORES DE GRUPO == */}
                
                {/* 1. SELECT DE ÁREA (Dinámico) */}
                <SelectField
                    icon={<FaSchool />}
                    name="area"
                    value={formData.area}
                    onChange={handleChange}
                    // Si no hay opciones cargadas, muestra un loading o fallback
                    options={areaOptions.length > 0 ? areaOptions : [{ value: "", label: "Cargando áreas..." }]}
                />
                {/* Mensaje de ayuda si no hay áreas */}
                {areaOptions.length <= 1 && (
                    <p style={{textAlign:"center", fontSize:"0.8rem", color:"#999", marginTop: "-15px", marginBottom: "15px"}}>
                        * Si tu carrera no aparece, contacta a un administrador.
                    </p>
                )}

                {/* 2. SELECT DE NIVEL (Estático) */}
                <SelectField
                    icon={<FaSchool />}
                    name="nivel"
                    value={formData.nivel}
                    onChange={handleChange}
                    options={[
                        { value: "", label: "Seleccione nivel" },
                        { value: "Técnico", label: "Técnico (TSU)" },
                        { value: "Ingeniería", label: "Ingeniería" },
                        { value: "Licenciatura", label: "Licenciatura" },
                    ]}
                />

                {/* 3. SELECT DE GRUPO (Estático) */}
                <SelectField
                    icon={<FaSchool />}
                    name="grupo"
                    value={formData.grupo}
                    onChange={handleChange}
                    options={[
                        { value: "", label: "Seleccione grupo" },
                        // Lista completa de grupos posibles
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

                {/* BOTÓN REGISTRAR */}
                <div className="text-center mt-4">
                    <button onClick={handleSubmit} className="fw-bold text-white"
                        style={{ width: "180px", height: "50px", borderRadius: "25px", backgroundColor: colors.secondary, border: "none", boxShadow: "0 6px 15px rgba(0,0,0,0.25)", fontSize: "1rem", letterSpacing: "0.5px", cursor: "pointer", transition: "0.3s" }}
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

// --- COMPONENTES AUXILIARES (Estilos) ---

function InputField({ icon, placeholder, type = "text", name, value, onChange }) {
    const colors = { primary: "#00B8C8", textDark: "#333" };
    return (
        <div style={{ position: "relative", marginBottom: "1.8rem" }}>
            <div style={{ position: "absolute", top: "50%", left: "0", transform: "translateY(-50%)", color: colors.primary, fontSize: "1.1rem", width: "35px", textAlign: "center" }}>{icon}</div>
            <input type={type} placeholder={placeholder} name={name} value={value} onChange={onChange} style={{ width: "100%", border: "none", borderBottom: `2px solid #ccc`, paddingLeft: "45px", backgroundColor: "transparent", fontSize: "1rem", fontWeight: "600", color: colors.textDark, outline: "none", transition: "0.3s ease" }} onFocus={(e) => (e.target.style.borderBottom = `2px solid ${colors.primary}`)} onBlur={(e) => (e.target.style.borderBottom = "2px solid #ccc")} />
        </div>
    );
}

function SelectField({ icon, name, value, onChange, options }) {
    const colors = { primary: "#00B8C8", textDark: "#555" };
    return (
        <div style={{ position: "relative", marginBottom: "1.8rem" }}>
            <div style={{ position: "absolute", top: "50%", left: "0", transform: "translateY(-50%)", color: colors.primary, fontSize: "1.1rem", width: "35px", textAlign: "center" }}>{icon}</div>
            <select name={name} value={value} onChange={onChange} style={{ width: "100%", border: "none", borderBottom: "2px solid #ccc", paddingLeft: "45px", backgroundColor: "transparent", fontSize: "1rem", fontWeight: "600", color: colors.textDark, outline: "none", appearance: "none", transition: "0.3s ease", cursor: "pointer" }} onFocus={(e) => (e.target.style.borderBottom = `2px solid ${colors.primary}`)} onBlur={(e) => (e.target.style.borderBottom = "2px solid #ccc")}>
                {options.map((opt, i) => <option key={i} value={opt.value}>{opt.label}</option>)}
            </select>
        </div>
    );
}