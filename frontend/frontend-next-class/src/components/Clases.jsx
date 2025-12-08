import React, { useState, useEffect } from "react";
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
} from "lucide-react";

import groupService from "../services/groupService";
import FeedbackModal from "./FeedbackModal";
import GrupoDetalle from "./GrupoDetalle";

const Clases = ({ colors }) => {

    const [viewMode, setViewMode] = useState("list");

    const [formData, setFormData] = useState({
        id: null,
        nivel: "",
        area: "",
        grupo: ""
    });

    const [modalConfig, setModalConfig] = useState({
        isOpen: false,
        type: "success",
        title: "",
        message: "",
        onConfirm: () => { },
        onCancel: () => { }
    });


    const [selectedGroup, setSelectedGroup] = useState(null);


    // 👇 LISTA REAL DESDE BACKEND
    const [clasesList, setClasesList] = useState([]);

    // ============================
    // 🔵 Cargar grupos al iniciar
    // ============================
    const loadGroups = async () => {
        try {
            const res = await groupService.getAll();
            const data = res.data.data;

            // Adaptamos al formato del frontend
            const formatted = data.map((g) => ({
                id: g._id,
                nivel: g.level,
                area: g.area,
                grupo: g.name
            }));

            setClasesList(formatted);

        } catch (error) {
            console.error("Error al cargar grupos:", error);
        }
    };

    useEffect(() => {
        loadGroups();
    }, []);

    // ============================
    // 🔵 Crear / Editar (Guardar)
    // ============================
    const handleSave = async () => {
        if (!formData.nivel || !formData.area || !formData.grupo) return;

        const payload = {
            name: formData.grupo,
            area: formData.area,
            level: formData.nivel
        };

        try {
            let response;

            if (formData.id) {
                // EDITAR
                response = await groupService.update(formData.id, payload);

                setModalConfig({
                    isOpen: true,
                    type: "success",
                    title: "¡Grupo Actualizado!",
                    message: `El grupo ${formData.grupo} fue actualizado.`,
                    onConfirm: () => {
                        setModalConfig({ ...modalConfig, isOpen: false });
                        setViewMode("list");
                        loadGroups();
                    }
                });

            } else {
                // CREAR
                response = await groupService.create(payload);

                setModalConfig({
                    isOpen: true,
                    type: "success",
                    title: "¡Grupo Creado!",
                    message: `El grupo ${formData.grupo} fue registrado correctamente.`,
                    onConfirm: () => {
                        setModalConfig({ ...modalConfig, isOpen: false });
                        setViewMode("list");
                        loadGroups();
                    }
                });
            }

        } catch (error) {
            console.error("Error al guardar:", error);

            setModalConfig({
                isOpen: true,
                type: "danger",
                title: "Error",
                message: "No se pudo guardar el grupo.",
                onConfirm: () => setModalConfig({ ...modalConfig, isOpen: false })
            });
        }
    };

    // ============================
    // 🔵 Solicitar eliminación
    // ============================
    const handleDeleteRequest = (item) => {
        setModalConfig({
            isOpen: true,
            type: "danger",
            title: "¿Eliminar grupo?",
            message: `Estás a punto de eliminar el grupo ${item.grupo}.`,
            onConfirm: () => confirmDelete(item),
            onCancel: () =>
                setModalConfig({ ...modalConfig, isOpen: false })
        });
    };

    // ============================
    // 🔵 Confirmar eliminación real
    // ============================
    const confirmDelete = async (item) => {
        try {
            await groupService.delete(item.id);

            setModalConfig({
                isOpen: true,
                type: "deleteSuccess",
                title: "Eliminado",
                message: "El grupo fue eliminado exitosamente.",
                onConfirm: () => {
                    setModalConfig({ ...modalConfig, isOpen: false });
                    loadGroups();
                }
            });

        } catch (error) {
            console.error("Error al eliminar:", error);
        }
    };

    const handleEdit = (item) => {
        setFormData(item);
        setViewMode("form");
    };

    const handleCreate = () => {
        setFormData({
            id: null,
            nivel: "",
            area: "",
            grupo: ""
        });
        setViewMode("form");
    };

    // FORMULARIO
    const ClassForm = () => (
        <div>

            {/* HEADER */}
            <div style={{ display: "flex", gap: "15px", marginBottom: "25px" }}>
                <button
                    onClick={() => setViewMode("list")}
                    style={{
                        background: "white",
                        border: "1px solid #eee",
                        borderRadius: "50%",
                        width: "40px",
                        height: "40px",
                        cursor: "pointer"
                    }}
                >
                    <ArrowLeft size={20} />
                </button>

                <div>
                    <h2 style={{ margin: 0, color: colors.secondary }}>
                        {formData.id ? "Editar Clase" : "Nueva Clase"}
                    </h2>
                    <p style={{ margin: 0, color: "#777" }}>
                        {formData.id ? `Editando: ${formData.grupo}` : "Registrar un nuevo grupo académico"}
                    </p>
                </div>
            </div>

            {/* TARJETA */}
            <div style={{ background: "white", padding: 30, borderRadius: 20 }}>

                {/* NIVEL */}
                <div style={{ marginBottom: 20 }}>
                    <label style={{ fontWeight: 600 }}>
                        <GraduationCap size={18} color={colors.primary} /> Nivel Académico
                    </label>
                    <select
                        value={formData.nivel}
                        onChange={(e) => setFormData({ ...formData, nivel: e.target.value })}
                        style={{
                            width: "100%",
                            padding: 12,
                            borderRadius: 10,
                            border: "1px solid #ddd"
                        }}
                    >
                        <option value="">Selecciona...</option>
                        <option value="Technical">TSU</option>
                        <option value="Engineering">Ingeniería</option>
                    </select>
                </div>

                {/* AREA */}
                <div style={{ marginBottom: 20 }}>
                    <label style={{ fontWeight: 600 }}>
                        <Book size={18} color={colors.primary} /> Área / Carrera
                    </label>

                    <select
                        value={formData.area}
                        onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                        style={{
                            width: "100%",
                            padding: 12,
                            borderRadius: 10,
                            border: "1px solid #ddd",
                            background: "#F9FAFB",
                            color: "#333"
                        }}
                    >
                        <option value="">Selecciona área...</option>
                        <option value="DSM">DSM</option>
                        <option value="EVND">EVND</option>
                    </select>
                </div>

                {/* GRUPO */}
                <div style={{ marginBottom: 20 }}>
                    <label style={{ fontWeight: 600 }}>
                        <Users size={18} color={colors.primary} /> Grupo
                    </label>
                    <input
                        type="text"
                        placeholder="Ej: 10A"
                        value={formData.grupo}
                        onChange={(e) => setFormData({ ...formData, grupo: e.target.value })}
                        style={{
                            width: "100%",
                            padding: 12,
                            borderRadius: 10,
                            border: "1px solid #ddd"
                        }}
                    />
                </div>

            </div>

            {/* BOTONES */}
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 30, gap: 15 }}>
                <button
                    onClick={() => setViewMode("list")}
                    style={{
                        padding: "12px 25px",
                        borderRadius: 30,
                        border: "1px solid #ddd"
                    }}
                >
                    Cancelar
                </button>

                <button
                    onClick={handleSave}
                    style={{
                        padding: "12px 35px",
                        borderRadius: 30,
                        background: colors.secondary,
                        color: "white",
                        border: "none"
                    }}
                >
                    <Save size={18} /> Guardar
                </button>
            </div>

        </div>
    );

    // LISTA
    const ListView = () => (
        <div>

            {/* HEADER */}
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 30 }}>
                <div>
                    <h1 style={{ color: colors.secondary }}>Gestión de Clases</h1>
                    <p style={{ color: "#777" }}>Administra los grupos académicos.</p>
                </div>

                <button
                    onClick={handleCreate}
                    style={{
                        background: colors.primary,
                        color: "white",
                        padding: "10px 25px",
                        borderRadius: 40,
                        border: "none"
                    }}
                >
                    <Plus size={20} /> Nuevo
                </button>
            </div>

            {/* TABLA */}
            <div style={{
                background: "white",
                borderRadius: 20,
                padding: 10
            }}>
                <table style={{ width: "100%" }}>
                    <thead>
                        <tr style={{ background: "#F4F4F4" }}>
                            <th style={{ padding: 15 }}>Nivel</th>
                            <th style={{ padding: 15 }}>Área</th>
                            <th style={{ padding: 15 }}>Grupo</th>
                            <th style={{ padding: 15, textAlign: "right" }}>Acciones</th>
                        </tr>
                    </thead>

                    <tbody>
                        {clasesList.map((item) => (
                            <tr
                                key={item.id}
                                onClick={() => setSelectedGroup(item.grupo)}
                                style={{
                                    borderBottom: "1px solid #eee",
                                    cursor: "pointer",
                                    transition: "background 0.2s",
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#F5F7F8")}
                                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "white")}
                            >
                                <td style={{ padding: 15 }}>{item.nivel}</td>
                                <td style={{ padding: 15 }}>{item.area}</td>
                                <td style={{ padding: 15, fontWeight: "bold", color: colors.secondary }}>
                                    {item.grupo}
                                </td>

                                <td style={{ padding: 15, textAlign: "right" }}>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation(); // ← evita abrir GrupoDetalle cuando editas
                                            handleEdit(item);
                                        }}
                                        style={{
                                            background: "#E0F7FA",
                                            border: "none",
                                            padding: 8,
                                            borderRadius: 8,
                                            marginRight: 10,
                                        }}
                                    >
                                        <Edit size={18} />
                                    </button>

                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation(); // ← evita abrir GrupoDetalle cuando borras
                                            handleDeleteRequest(item);
                                        }}
                                        style={{
                                            background: "#FFEBEE",
                                            border: "none",
                                            padding: 8,
                                            borderRadius: 8,
                                        }}
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
            {!selectedGroup ? (
                viewMode === "list" ? <ListView /> : <ClassForm />
            ) : (
                <GrupoDetalle
                    colors={colors}
                    grupo={selectedGroup}
                    onBack={() => setSelectedGroup(null)}
                />
            )}

            <FeedbackModal {...modalConfig} />
        </>
    );
};

export default Clases;
