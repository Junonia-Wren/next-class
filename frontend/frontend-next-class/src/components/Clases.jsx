import React, { useState } from 'react';
import {
    Plus,
    Search,
    Edit,
    Trash2,
    ArrowLeft,
    Save,
    GraduationCap,
    Book,
    Users
} from 'lucide-react';
import FeedbackModal from './FeedbackModal';

const Clases = ({ colors }) => {
    const [viewMode, setViewMode] = useState('list'); // 'list' o 'form'

    // Estado del formulario
    const [formData, setFormData] = useState({
        id: null,
        nivel: "",
        area: "",
        grupo: ""
    });

    // Estado para el Modal (Reutilizado de Horarios)
    const [modalConfig, setModalConfig] = useState({
        isOpen: false,
        type: 'success',
        title: '',
        message: '',
        onConfirm: () => { },
        onCancel: () => { }
    });

    // Datos de ejemplo
    const [clasesList, setClasesList] = useState([
        { id: 1, nivel: "Ingeniería", area: "Entornos Virtuales", grupo: "10A" },
        { id: 2, nivel: "Ingeniería", area: "Desarrollo de Software", grupo: "9B" },
        { id: 3, nivel: "Ingeniería", area: "Negocios Digitales", grupo: "4A" },
        { id: 4, nivel: "TSU", area: "Mecatrónica", grupo: "2C" },
    ]);

    // --- LÓGICA DEL MODAL ---
    const closeModal = () => setModalConfig({ ...modalConfig, isOpen: false });

    // 1. Guardar (Crear/Editar)
    const handleSave = () => {
        // Validación simple
        if (!formData.nivel || !formData.area || !formData.grupo) return;

        // Aquí iría la lógica de Backend...

        setModalConfig({
            isOpen: true,
            type: 'success',
            title: formData.id ? '¡Actualización Exitosa!' : '¡Creación Exitosa!',
            message: `La clase del grupo ${formData.grupo} ha sido ${formData.id ? 'actualizada' : 'registrada'} correctamente.`,
            onConfirm: () => {
                closeModal();
                setViewMode('list');
            }
        });
    };

    // 2. Solicitar Borrado
    const handleDeleteRequest = (item) => {
        setModalConfig({
            isOpen: true,
            type: 'danger',
            title: '¿Eliminar Clase?',
            message: `Vas a eliminar el grupo ${item.grupo} de ${item.area}. También se borrarán sus horarios asignados.`,
            onCancel: closeModal,
            onConfirm: () => confirmDelete(item)
        });
    };

    // 3. Confirmar Borrado
    const confirmDelete = (item) => {
        // Lógica de Backend para borrar...

        setModalConfig({
            isOpen: true,
            type: 'deleteSuccess',
            title: '¡Borrado Exitoso!',
            message: 'La clase se eliminó correctamente.',
            onConfirm: closeModal
        });
    };

    // --- LÓGICA DE VISTAS ---
    const handleEdit = (item) => {
        setFormData(item);
        setViewMode('form');
    };

    const handleCreate = () => {
        setFormData({ id: null, nivel: "", area: "", grupo: "" });
        setViewMode('form');
    };

    // --- COMPONENTE: FORMULARIO ---
    const ClassForm = () => (
        <div style={{ animation: "fadeIn 0.3s ease-out" }}>
            {/* Encabezado Formulario */}
            <div style={{ display: "flex", alignItems: "center", marginBottom: "25px", gap: "15px" }}>
                <button
                    onClick={() => setViewMode('list')}
                    style={{
                        background: "white", border: "1px solid #eee", borderRadius: "50%", width: "40px", height: "40px",
                        cursor: "pointer", color: "#666", display: "flex", alignItems: "center", justifyContent: "center",
                        boxShadow: "0 2px 5px rgba(0,0,0,0.05)"
                    }}
                >
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h2 style={{ margin: 0, color: colors.secondary, fontSize: "1.6rem", fontWeight: "bold" }}>
                        {formData.id ? "Editar Clase" : "Nueva Clase"}
                    </h2>
                    <p style={{ margin: 0, color: "#888", fontSize: "0.9rem" }}>
                        {formData.id ? `Editando: ${formData.grupo}` : "Registra un nuevo grupo académico."}
                    </p>
                </div>
            </div>

            {/* Tarjeta de Formulario */}
            <div style={{ backgroundColor: "white", padding: "30px", borderRadius: "20px", boxShadow: "0 5px 20px rgba(0,0,0,0.03)" }}>

                {/* Campo: Nivel */}
                <div style={{ marginBottom: "20px" }}>
                    <label style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px", fontWeight: "600", color: "#555" }}>
                        <GraduationCap size={18} color={colors.primary} /> Nivel Académico
                    </label>
                    <select
                        value={formData.nivel}
                        onChange={(e) => setFormData({ ...formData, nivel: e.target.value })}
                        style={{
                            width: "100%", padding: "12px 15px", borderRadius: "10px",
                            border: "1px solid #ddd", backgroundColor: "#F9FAFB",
                            color: "#333", fontSize: "0.95rem", outline: "none"
                        }}
                    >
                        <option value="">-- Selecciona el Nivel --</option>
                        <option value="TSU">TSU (Técnico Superior Universitario)</option>
                        <option value="Ingeniería">Ingeniería</option>
                    </select>
                </div>

                {/* Campo: Área */}
                <div style={{ marginBottom: "20px" }}>
                    <label style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px", fontWeight: "600", color: "#555" }}>
                        <Book size={18} color={colors.primary} /> Área / Carrera
                    </label>
                    <input
                        type="text"
                        placeholder="Ej: Entornos Virtuales y Negocios Digitales"
                        value={formData.area}
                        onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                        style={{
                            width: "100%", padding: "12px 15px", borderRadius: "10px",
                            border: "1px solid #ddd", backgroundColor: "#F9FAFB",
                            color: "#333", fontSize: "0.95rem", outline: "none"
                        }}
                    />
                </div>

                {/* Campo: Grupo */}
                <div style={{ marginBottom: "20px" }}>
                    <label style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px", fontWeight: "600", color: "#555" }}>
                        <Users size={18} color={colors.primary} /> Grupo
                    </label>
                    <input
                        type="text"
                        placeholder="Ej: 10A"
                        value={formData.grupo}
                        onChange={(e) => setFormData({ ...formData, grupo: e.target.value })}
                        style={{
                            width: "100%", padding: "12px 15px", borderRadius: "10px",
                            border: "1px solid #ddd", backgroundColor: "#F9FAFB",
                            color: "#333", fontSize: "0.95rem", outline: "none"
                        }}
                    />
                </div>

            </div>

            {/* Botones de Acción */}
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "15px", marginTop: "30px" }}>
                <button
                    onClick={() => setViewMode('list')}
                    style={{
                        backgroundColor: "transparent", color: "#666", padding: "12px 30px",
                        borderRadius: "30px", border: "1px solid #ddd", fontSize: "0.95rem", fontWeight: "600",
                        cursor: "pointer", transition: "all 0.2s"
                    }}>
                    Cancelar
                </button>
                <button
                    onClick={handleSave}
                    style={{
                        backgroundColor: colors.secondary, color: "white", padding: "12px 40px",
                        borderRadius: "30px", border: "none", fontSize: "0.95rem", fontWeight: "600",
                        cursor: "pointer", display: "flex", alignItems: "center", gap: "8px",
                        boxShadow: "0 4px 15px rgba(0,126,140,0.3)"
                    }}>
                    <Save size={18} /> Guardar Clase
                </button>
            </div>
        </div>
    );

    // --- COMPONENTE: LISTA ---
    const ListView = () => (
        <div style={{ animation: "fadeIn 0.3s ease-out" }}>
            {/* Header Lista */}
            <div style={{ marginBottom: "30px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                    <h1 style={{ color: colors.secondary, margin: "0 0 5px 0", fontSize: "1.8rem", fontWeight: "bold" }}>
                        Gestión de Clases
                    </h1>
                    <p style={{ color: "#888", margin: 0 }}>Administra los grupos y grados académicos.</p>
                </div>
                <button
                    onClick={handleCreate}
                    style={{
                        backgroundColor: colors.primary, color: "white", border: "none",
                        padding: "10px 25px", borderRadius: "50px", cursor: "pointer",
                        display: "flex", alignItems: "center", gap: "8px", fontWeight: "bold",
                        boxShadow: "0 4px 15px rgba(0,184,200,0.3)"
                    }}>
                    <Plus size={20} /> Nueva Clase
                </button>
            </div>

            {/* Buscador */}
            <div style={{ marginBottom: "25px", position: "relative", maxWidth: "500px" }}>
                <Search size={20} style={{ position: "absolute", left: "20px", top: "50%", transform: "translateY(-50%)", color: "#aaa" }} />
                <input
                    type="text"
                    placeholder="Buscar por grupo o carrera..."
                    style={{
                        width: "100%", padding: "15px 15px 15px 50px", borderRadius: "50px",
                        border: "1px solid #eee", backgroundColor: "white", outline: "none", fontSize: "0.95rem",
                        boxShadow: "0 2px 10px rgba(0,0,0,0.02)"
                    }}
                />
            </div>

            {/* Tabla */}
            <div style={{ backgroundColor: "white", borderRadius: "20px", boxShadow: "0 5px 20px rgba(0,0,0,0.03)", overflow: "hidden" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                        <tr style={{ backgroundColor: "#F8F9FA", color: "#666", textAlign: "left", fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                            <th style={{ padding: "20px 25px", fontWeight: "600" }}>Nivel</th>
                            <th style={{ padding: "20px 25px", fontWeight: "600" }}>Área / Carrera</th>
                            <th style={{ padding: "20px 25px", fontWeight: "600" }}>Grupo</th>
                            <th style={{ padding: "20px 25px", fontWeight: "600", textAlign: "right" }}>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {clasesList.map((item) => (
                            <tr key={item.id} style={{ borderBottom: "1px solid #f0f0f0", transition: "background 0.2s" }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#FAFAFA"}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "white"}
                            >
                                <td style={{ padding: "20px 25px", color: "#333", fontWeight: "500" }}>
                                    <span>{item.nivel}</span>
                                </td>
                                <td style={{ padding: "20px 25px", color: "#666" }}>{item.area}</td>
                                <td style={{ padding: "20px 25px", color: colors.secondary, fontWeight: "600", fontSize: "1.1rem" }}>{item.grupo}</td>
                                <td style={{ padding: "20px 25px", textAlign: "right" }}>
                                    <button
                                        onClick={() => handleEdit(item)}
                                        style={{ background: "#E0F7FA", border: "none", cursor: "pointer", color: colors.secondary, padding: "8px", borderRadius: "8px", marginRight: "10px" }}
                                        title="Editar Clase"
                                    >
                                        <Edit size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteRequest(item)}
                                        style={{ background: "#FFEBEE", border: "none", cursor: "pointer", color: "#D32F2F", padding: "8px", borderRadius: "8px" }}
                                        title="Eliminar Clase"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    return (
        <>
            {viewMode === 'list' ? <ListView /> : <ClassForm />}
            <FeedbackModal
                isOpen={modalConfig.isOpen}
                type={modalConfig.type}
                title={modalConfig.title}
                message={modalConfig.message}
                onConfirm={modalConfig.onConfirm}
                onCancel={modalConfig.onCancel}
            />
        </>
    );
};

export default Clases;