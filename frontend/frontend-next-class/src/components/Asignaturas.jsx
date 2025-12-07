import React, { useState, useEffect } from 'react';
import {
    Plus, Edit, Trash2, ArrowLeft, Save, Presentation,
    FileText, Image as ImageIcon, Percent, Calendar, BookOpen
} from 'lucide-react';
import FeedbackModal from './FeedbackModal';
import api from "../services/axiosConfig";

const defaultTeacher = "https://cdn-icons-png.flaticon.com/512/6833/6833591.png";
import ProfesoraMay from '../assets/Mayra.jpeg';

const Asignaturas = ({ colors }) => {

    const [viewMode, setViewMode] = useState('list');

    const initialFormState = {
        id: null,
        nombre: "",
        profesorFoto: defaultTeacher,
        porcentajes: {
            ser: { valor: "", descripcion: "" },
            saber: { valor: "", descripcion: "" },
            saberHacer: { valor: "", descripcion: "" }
        },
        unidades: [
            { id: 1, porcentaje: "", fechas: "" },
            { id: 2, porcentaje: "", fechas: "" },
            { id: 3, porcentaje: "", fechas: "" },
            { id: 4, porcentaje: "", fechas: "" }
        ],
        notas: ""
    };

    const [formData, setFormData] = useState(initialFormState);

    const [asignaturasList, setAsignaturasList] = useState([]);

    const [modalConfig, setModalConfig] = useState({
        isOpen: false, type: 'success', title: '', message: '', onConfirm: () => { }, onCancel: () => { }
    });

    const closeModal = () => setModalConfig({ ...modalConfig, isOpen: false });

    // ===============================
    // CARGAR DATOS DEL BACKEND
    // ===============================
    useEffect(() => {
        const loadSubjects = async () => {
            try {
                const res = await api.get("/subjects/getAll");

                const formatted = res.data.data.map((s) => ({
                    id: s._id,
                    nombre: s.name,
                    profesorFoto: s.profesorFoto || defaultTeacher,

                    porcentajes: {
                        ser: { valor: s.porcentajes?.ser?.valor || "", descripcion: s.porcentajes?.ser?.descripcion || "" },
                        saber: { valor: s.porcentajes?.saber?.valor || "", descripcion: s.porcentajes?.saber?.descripcion || "" },
                        saberHacer: { valor: s.porcentajes?.saberHacer?.valor || "", descripcion: s.porcentajes?.saberHacer?.descripcion || "" }
                    },

                    unidades: s.unidades?.length
                        ? s.unidades.map((u, idx) => ({
                            id: idx + 1,
                            porcentaje: u.porcentaje || "",
                            fechas: u.fechas || ""
                        }))
                        : [
                            { id: 1, porcentaje: "", fechas: "" },
                            { id: 2, porcentaje: "", fechas: "" },
                            { id: 3, porcentaje: "", fechas: "" },
                            { id: 4, porcentaje: "", fechas: "" }
                        ],

                    notas: s.notas || ""
                }));

                setAsignaturasList(formatted);
            } catch (error) {
                console.error("Error cargando materias:", error);
            }
        };

        loadSubjects();
    }, []);

    // ===============================
    // FUNCIONES AUXILIARES
    // ===============================

    const updateNestedState = (section, subSection, field, value) => {
        setFormData(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [subSection]: {
                    ...prev[section][subSection],
                    [field]: value
                }
            }
        }));
    };

    const updateUnitState = (index, field, value) => {
        const newUnits = [...formData.unidades];
        newUnits[index] = { ...newUnits[index], [field]: value };
        setFormData(prev => ({ ...prev, unidades: newUnits }));
    };

    // ===============================
    // CRUD
    // ===============================

    const handleViewDetails = (item) => {
        setFormData(item);
        setViewMode('preview');
    };

    const handleEditFromPreview = () => {
        setViewMode("form");
    };

    const handleCreate = () => {
        setFormData(initialFormState);
        setViewMode('form');
    };

    const handleSave = async () => {
        if (!formData.nombre.trim()) return;

        const payload = {
            name: formData.nombre,
            teacher: "Pendiente",  // O el que quieras
            profesorFoto: formData.profesorFoto,

            porcentajes: {
                ser: {
                    valor: Number(formData.porcentajes.ser.valor || 0),
                    descripcion: formData.porcentajes.ser.descripcion || ""
                },
                saber: {
                    valor: Number(formData.porcentajes.saber.valor || 0),
                    descripcion: formData.porcentajes.saber.descripcion || ""
                },
                saberHacer: {
                    valor: Number(formData.porcentajes.saberHacer.valor || 0),
                    descripcion: formData.porcentajes.saberHacer.descripcion || ""
                },
            },

            unidades: formData.unidades.map(u => ({
                porcentaje: Number(u.porcentaje || 0),
                fechas: u.fechas || ""
            })),

            notas: formData.notas || "",

            // tu backend exige al menos 1 group
            groups: ["676fc2150b8adce7aac95e9c"]
        };

        try {
            if (!formData.id) {
                await api.post("/subjects/create", payload);
            } else {
                await api.put(`/subjects/update/${formData.id}`, payload);
            }

            setModalConfig({
                isOpen: true,
                type: "success",
                title: formData.id ? "Asignatura Actualizada" : "Asignatura Creada",
                message: `Los datos de ${formData.nombre} fueron guardados correctamente.`,
                onConfirm: () => {
                    closeModal();
                    window.location.reload();
                }
            });

        } catch (error) {
            console.error("ERROR AL GUARDAR ASIGNATURA:", error);
        }
    };


    const handleDeleteRequest = (item, e) => {
        e.stopPropagation();
        setModalConfig({
            isOpen: true,
            type: "danger",
            title: "¿Eliminar Asignatura?",
            message: `Eliminarás "${item.nombre}".`,
            onCancel: closeModal,
            onConfirm: () => confirmDelete(item.id)
        });
    };

    const confirmDelete = async (id) => {
        try {
            await api.delete(`/subjects/delete/${id}`);
            setModalConfig({
                isOpen: true,
                type: "deleteSuccess",
                title: "Eliminada",
                message: "La materia fue eliminada.",
                onConfirm: () => {
                    closeModal();
                    window.location.reload();
                }
            });
        } catch (error) {
            console.error("Error eliminando:", error);
        }
    };

    // ===============================
    // LIST VIEW
    // ===============================

    const ListView = () => (
        <div style={{ animation: "fadeIn 0.3s ease-out" }}>
            <div style={{ marginBottom: "30px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                    <h1 style={{ color: colors.secondary, margin: "0 0 5px 0", fontSize: "1.8rem", fontWeight: "bold" }}>
                        Catálogo de Asignaturas
                    </h1>
                    <p style={{ color: "#888", margin: 0 }}>Gestión de materias y planes de evaluación.</p>
                </div>

                <button
                    onClick={handleCreate}
                    style={{
                        backgroundColor: colors.primary,
                        color: "white",
                        padding: "10px 25px",
                        borderRadius: "50px",
                        border: "none",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        fontWeight: "bold",
                        cursor: "pointer"
                    }}>
                    <Plus size={20} /> Nueva Asignatura
                </button>
            </div>

            <div style={{ backgroundColor: "white", borderRadius: "20px", boxShadow: "0 5px 20px rgba(0,0,0,0.03)" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                        <tr style={{ backgroundColor: "#F8F9FA", color: "#666" }}>
                            <th style={{ padding: 20, textAlign: "left" }}>Nombre</th>
                            <th style={{ padding: 20, textAlign: "right" }}>Acciones</th>
                        </tr>
                    </thead>

                    <tbody>
                        {asignaturasList.map((item) => (
                            <tr key={item.id}
                                onClick={() => handleViewDetails(item)}
                                style={{ cursor: "pointer", borderBottom: "1px solid #eee" }}
                            >
                                <td style={{ padding: 20 }}>
                                    <div style={{ display: "flex", gap: 15, alignItems: "center" }}>
                                        <div style={{ padding: 10, background: "#E0F2F1", borderRadius: 10 }}>
                                            <Presentation size={20} />
                                        </div>
                                        {item.nombre}
                                    </div>
                                </td>

                                <td style={{ padding: 20, textAlign: "right" }}>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleViewDetails(item); handleEditFromPreview(); }}
                                        style={{ marginRight: 10, background: "#E0F7FA", border: "none", padding: 8, borderRadius: 8 }}
                                    >
                                        <Edit size={18} />
                                    </button>

                                    <button
                                        onClick={(e) => handleDeleteRequest(item, e)}
                                        style={{ background: "#FFEBEE", border: "none", padding: 8, borderRadius: 8 }}
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

    // ===============================
    // PREVIEW VIEW (SIN CAMBIOS)
    // ===============================

    const PreviewView = () => {
        const pill = {
            background: colors.secondary,
            color: "white",
            padding: "10px 20px",
            borderRadius: 20,
            marginRight: 10
        };

        return (
            <div style={{ animation: "fadeIn 0.3s ease-out" }}>
                <div style={{ display: "flex", gap: 15, alignItems: "center", marginBottom: 25 }}>
                    <button
                        onClick={() => setViewMode("list")}
                        style={{ width: 40, height: 40, borderRadius: "50%", background: "white", border: "1px solid #eee" }}>
                        <ArrowLeft size={20} />
                    </button>

                    <div>
                        <h2 style={{ margin: 0, color: colors.secondary }}>Vista Previa</h2>
                        <p style={{ margin: 0 }}>{formData.nombre}</p>
                    </div>
                </div>

                <div style={{
                    maxWidth: 500,
                    margin: "0 auto",
                    background: "white",
                    padding: 35,
                    borderRadius: 30,
                    textAlign: "center",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.05)"
                }}>

                    <div style={{ background: "#8D2745", padding: "10px 20px", color: "white", borderRadius: 15, marginBottom: 20 }}>
                        {formData.nombre}
                    </div>

                    <img
                        src={formData.profesorFoto}
                        style={{ width: 120, height: 120, borderRadius: "50%", border: `4px solid ${colors.primary}` }}
                    />

                    <div style={{ marginTop: 20 }}>
                        <span style={pill}>Asesorías</span>
                        <span style={{ ...pill, background: colors.primary }}>Cronograma</span>
                    </div>

                    <h3 style={{ marginTop: 30 }}>Porcentajes</h3>

                    {Object.entries(formData.porcentajes).map(([k, d]) => (
                        d.valor && (
                            <div key={k} style={{ marginBottom: 10 }}>
                                <strong>{k}: {d.valor}%</strong>
                                <p style={{ margin: 0 }}>{d.descripcion}</p>
                            </div>
                        )
                    ))}

                    <h3 style={{ marginTop: 30 }}>Unidades</h3>

                    {formData.unidades.map(u => (
                        (u.porcentaje || u.fechas) && (
                            <div key={u.id} style={{ marginBottom: 10 }}>
                                <strong>Unidad {u.id}</strong>: {u.porcentaje}%
                                <br />
                                <small>{u.fechas}</small>
                            </div>
                        )
                    ))}

                    {formData.notas && (
                        <>
                            <h3>Notas</h3>
                            <p>{formData.notas}</p>
                        </>
                    )}
                </div>
            </div>
        );
    };

    // ===============================
    // FORM VIEW (SIN CAMBIOS DE DISEÑO)
    // ===============================

    const SubjectForm = () => {

        const label = { marginBottom: 8, display: "block", fontWeight: "600" };
        const input = { width: "100%", padding: 12, borderRadius: 10, border: "1px solid #ddd" };
        const card = { background: "white", padding: 25, borderRadius: 20, boxShadow: "0 5px 20px rgba(0,0,0,0.03)" };

        return (
            <div style={{ animation: "fadeIn 0.3s ease-out" }}>

                <div style={{ display: "flex", gap: 15, alignItems: "center", marginBottom: 20 }}>
                    <button
                        onClick={() => setViewMode("list")}
                        style={{ width: 40, height: 40, borderRadius: "50%", border: "1px solid #eee", background: "white" }}>
                        <ArrowLeft size={20} />
                    </button>

                    <div>
                        <h2 style={{ margin: 0 }}>{formData.id ? "Editar Asignatura" : "Nueva Asignatura"}</h2>
                        <p>Configuración completa</p>
                    </div>
                </div>

                <div style={{ display: "grid", gap: 25 }}>

                    <div style={card}>
                        <h3 style={{ color: colors.primary }}>Datos Generales</h3>

                        <label style={label}>Nombre</label>
                        <input style={input} value={formData.nombre}
                            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })} />
                    </div>

                    <div style={card}>
                        <h3 style={{ color: colors.primary }}>Porcentajes</h3>

                        {["ser", "saber", "saberHacer"].map(p => (
                            <div key={p}>
                                <label style={label}>{p}</label>
                                <input
                                    type="number"
                                    style={input}
                                    value={formData.porcentajes[p].valor}
                                    onChange={(e) => updateNestedState("porcentajes", p, "valor", e.target.value)}
                                />
                            </div>
                        ))}
                    </div>

                </div>

                <div style={{ marginTop: 20, display: "flex", justifyContent: "end", gap: 15 }}>
                    <button onClick={() => setViewMode('preview')}
                        style={{ padding: "12px 30px", borderRadius: 30, border: "1px solid #ddd" }}>
                        Cancelar
                    </button>

                    <button
                        onClick={handleSave}
                        style={{ padding: "12px 40px", borderRadius: 30, background: colors.secondary, color: "white", border: "none" }}>
                        <Save size={18} /> Guardar
                    </button>
                </div>
            </div>
        );
    };

    return (
        <>
            {viewMode === "list" && <ListView />}
            {viewMode === "preview" && <PreviewView />}
            {viewMode === "form" && <SubjectForm />}

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

export default Asignaturas;
