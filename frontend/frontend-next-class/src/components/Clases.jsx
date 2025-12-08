import React, { useState, useEffect } from 'react';
import {
    Plus, Search, Edit, Trash2, ArrowLeft, Save,
    GraduationCap, Book, Users, User, Crown, UserMinus, X
} from 'lucide-react';
import FeedbackModal from './FeedBackModal';
import GroupService from '../services/groupService';

const Clases = ({ colors = { primary: "#00B8C8", secondary: "#007E8C" } }) => {
    // Vistas: 'list', 'form', 'students'
    const [viewMode, setViewMode] = useState('list');

    // Estado Formulario GRUPO
    const [formData, setFormData] = useState({
        id: null,
        nivel: "",
        area: "",
        grupo: ""
    });

    // Estado Formulario EDICIÓN DE ALUMNO (Modal pequeño)
    const [editingStudent, setEditingStudent] = useState(null); // Alumno siendo editado
    const [studentForm, setStudentForm] = useState({ name: "", matricula: "" });

    // Listas de datos
    const [clasesList, setClasesList] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState(null); // Grupo seleccionado
    const [studentsList, setStudentsList] = useState([]); // Alumnos de ese grupo

    // Modal Config
    const [modalConfig, setModalConfig] = useState({
        isOpen: false, type: 'success', title: '', message: '', onConfirm: () => { }, onCancel: () => { }
    });

    // --- CARGA INICIAL ---
    useEffect(() => {
        loadGroups();
    }, []);

    const loadGroups = async () => {
        try {
            const res = await GroupService.getAll();
            setClasesList(res.data.data || []);
        } catch (error) {
            console.error("Error cargando grupos", error);
        }
    };

    // --- HELPERS ---
    const closeModal = () => setModalConfig({ ...modalConfig, isOpen: false });

    // --- ACCIONES DE GRUPO (CLASE) ---

    const handleCreate = () => {
        setFormData({ id: null, nivel: "", area: "", grupo: "" });
        setViewMode('form');
    };

    const handleEditGroup = (item) => {
        // Cargar datos en el formulario para editar
        setFormData({
            id: item.id,
            nivel: item.nivel,
            area: item.area,
            grupo: item.grupo
        });
        setViewMode('form');
    };

    const handleSaveGroup = async () => {
        if (!formData.nivel || !formData.area || !formData.grupo) return alert("Todos los campos son obligatorios");

        try {
            if (formData.id) {
                // === ACTUALIZAR CLASE ===
                await GroupService.update(formData.id, formData);
                setModalConfig({
                    isOpen: true, type: 'success', title: '¡Actualizado!',
                    message: `Clase ${formData.grupo} actualizada.`,
                    onConfirm: () => { closeModal(); loadGroups(); setViewMode('list'); }
                });
            } else {
                // === CREAR CLASE ===
                await GroupService.create(formData);
                setModalConfig({
                    isOpen: true, type: 'success', title: '¡Creado!',
                    message: `Clase ${formData.grupo} creada exitosamente.`,
                    onConfirm: () => { closeModal(); loadGroups(); setViewMode('list'); }
                });
            }
        } catch (error) {
            console.error(error);
            alert("Error al guardar grupo.");
        }
    };

    const handleDeleteGroupRequest = (item, e) => {
        e.stopPropagation();
        setModalConfig({
            isOpen: true, type: 'danger', title: '¿Eliminar Clase?',
            message: `Se eliminará el grupo ${item.grupo} y toda su información.`,
            onCancel: closeModal,
            onConfirm: async () => {
                try {
                    await GroupService.delete(item.id);
                    closeModal();
                    loadGroups();
                } catch (error) { alert("Error al eliminar"); }
            }
        });
    };

    // --- ACCIONES DE ALUMNOS (DENTRO DE LA CLASE) ---

    const handleViewStudents = async (group) => {
        try {
            setSelectedGroup(group);
            const res = await GroupService.getOneWithStudents(group.id);
            if (res.data && res.data.data) {
                setStudentsList(res.data.data.students);
            }
            setViewMode('students');
        } catch (error) {
            console.error("Error cargando alumnos", error);
        }
    };

    const handleToggleRole = async (student) => {
        try {
            await GroupService.toggleRole(student._id);
            // Actualizar localmente la UI sin recargar todo
            setStudentsList(prev => prev.map(s => 
                s._id === student._id ? { ...s, role: s.role === 'chief' ? 'student' : 'chief' } : s
            ));
        } catch (error) {
            alert("Error al cambiar rol");
        }
    };

    const handleRemoveStudentRequest = (student) => {
        setModalConfig({
            isOpen: true, type: 'danger', title: '¿Quitar Alumno?',
            message: `Vas a sacar a ${student.name} de este grupo.`,
            onCancel: closeModal,
            onConfirm: async () => {
                try {
                    await GroupService.removeStudent(selectedGroup.id, student._id);
                    setStudentsList(prev => prev.filter(s => s._id !== student._id));
                    closeModal();
                } catch (error) { alert("Error al eliminar alumno"); }
            }
        });
    };

    // --- EDICIÓN DE DATOS DEL ALUMNO (NUEVO) ---
    // Esto es "extra" porque normalmente se edita en Usuarios, pero lo agregamos aquí para cumplir tu requerimiento.
    // NOTA: Necesitas tener un endpoint User Update para que esto funcione realmente en BD. 
    // Por ahora simularemos la interfaz.
    const openEditStudent = (student) => {
        setEditingStudent(student);
        setStudentForm({ name: student.name, matricula: student.matricula });
    };

    const saveStudentEdit = async () => {
        // Aquí llamarías a UserService.update(editingStudent._id, studentForm)
        // Como no tengo ese servicio a la mano, solo actualizaré el estado local visualmente
        // para que veas que la interfaz funciona.
        
        // TODO: Descomentar cuando tengas UserService
        // await UserService.update(editingStudent._id, studentForm); 
        
        setStudentsList(prev => prev.map(s => 
            s._id === editingStudent._id ? { ...s, ...studentForm } : s
        ));
        setEditingStudent(null); // Cerrar modal de edición
    };


    // ESTILOS COMUNES
    const labelStyle = { display: "block", fontWeight: "600", marginBottom: "8px", color: "#555" };
    const inputStyle = { width: "100%", padding: "12px", borderRadius: "10px", border: "1px solid #ddd", background: "#F9FAFB" };

    return (
        <>
            {/* ================= VISTA LISTA DE CLASES ================= */}
            {viewMode === 'list' && (
                <div style={{ animation: "fadeIn 0.3s ease-out" }}>
                    <div style={{ marginBottom: "30px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div>
                            <h1 style={{ color: colors.secondary, fontSize: "1.8rem", fontWeight: "bold" }}>Gestión de Clases</h1>
                            <p style={{ color: "#888" }}>Selecciona un grupo para ver sus alumnos.</p>
                        </div>
                        <button onClick={handleCreate} style={{ backgroundColor: colors.primary, color: "white", border: "none", padding: "10px 25px", borderRadius: "50px", cursor: "pointer", display: "flex", gap: "8px", fontWeight: "bold" }}>
                            <Plus size={20} /> Nueva Clase
                        </button>
                    </div>

                    <div style={{ backgroundColor: "white", borderRadius: "20px", boxShadow: "0 5px 20px rgba(0,0,0,0.03)", overflow: "hidden" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse" }}>
                            <thead>
                                <tr style={{ backgroundColor: "#F8F9FA", color: "#666", textAlign: "left", textTransform: "uppercase", fontSize: "0.9rem" }}>
                                    <th style={{ padding: "20px" }}>Grupo</th>
                                    <th style={{ padding: "20px" }}>Nivel / Área</th>
                                    <th style={{ padding: "20px" }}>Alumnos</th>
                                    <th style={{ padding: "20px", textAlign: "right" }}>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {clasesList.map((item) => (
                                    <tr 
                                        key={item.id} 
                                        onClick={() => handleViewStudents(item)}
                                        style={{ borderBottom: "1px solid #f0f0f0", cursor: "pointer", transition: "0.2s" }}
                                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#FAFAFA"}
                                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "white"}
                                    >
                                        <td style={{ padding: "20px", fontWeight: "bold", color: colors.secondary, fontSize: "1.2rem" }}>{item.grupo}</td>
                                        <td style={{ padding: "20px" }}>
                                            <div style={{fontWeight:"600", color:"#444"}}>{item.nivel}</div>
                                            <div style={{fontSize:"0.9rem", color:"#888"}}>{item.area}</div>
                                        </td>
                                        <td style={{ padding: "20px", color: "#666" }}>
                                            <div style={{display:"flex", alignItems:"center", gap:"5px"}}><Users size={16}/> {item.studentCount || 0}</div>
                                        </td>
                                        <td style={{ padding: "20px", textAlign: "right" }}>
                                            {/* BOTÓN EDITAR GRUPO */}
                                            <button onClick={(e) => { e.stopPropagation(); handleEditGroup(item); }} style={{ background: "#E0F7FA", border: "none", color: colors.secondary, padding: "8px", borderRadius: "8px", cursor: "pointer", marginRight: "10px" }}>
                                                <Edit size={18} />
                                            </button>
                                            {/* BOTÓN ELIMINAR GRUPO */}
                                            <button onClick={(e) => handleDeleteGroupRequest(item, e)} style={{ background: "#FFEBEE", border: "none", color: "#D32F2F", padding: "8px", borderRadius: "8px", cursor: "pointer" }}>
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* ================= VISTA FORMULARIO CLASE (Crear/Editar) ================= */}
            {viewMode === 'form' && (
                <div style={{ animation: "fadeIn 0.3s ease-out", maxWidth: "600px", margin: "0 auto" }}>
                    <div style={{ display: "flex", alignItems: "center", marginBottom: "25px", gap: "15px" }}>
                        <button onClick={() => setViewMode('list')} style={{ background: "white", border: "1px solid #eee", borderRadius: "50%", width: "40px", height: "40px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <ArrowLeft size={20} color="#666"/>
                        </button>
                        <h2 style={{ margin: 0, color: colors.secondary, fontWeight: "bold" }}>{formData.id ? "Editar Clase" : "Nueva Clase"}</h2>
                    </div>
                    
                    <div style={{ backgroundColor: "white", padding: "30px", borderRadius: "20px", boxShadow: "0 5px 20px rgba(0,0,0,0.03)" }}>
                        <div style={{marginBottom:"20px"}}>
                            <label style={labelStyle}>Nivel</label>
                            <select value={formData.nivel} onChange={e => setFormData({...formData, nivel: e.target.value})} style={inputStyle}>
                                <option value="">Selecciona Nivel</option>
                                <option value="TSU">TSU</option>
                                <option value="Ingeniería">Ingeniería</option>
                                <option value="Licenciatura">Licenciatura</option>
                            </select>
                        </div>
                        <div style={{marginBottom:"20px"}}>
                            <label style={labelStyle}>Área / Carrera</label>
                            <input type="text" placeholder="Ej: Entornos Virtuales" value={formData.area} onChange={e => setFormData({...formData, area: e.target.value})} style={inputStyle} />
                        </div>
                        <div style={{marginBottom:"20px"}}>
                            <label style={labelStyle}>Grupo</label>
                            <input type="text" placeholder="Ej: 10A" value={formData.grupo} onChange={e => setFormData({...formData, grupo: e.target.value})} style={inputStyle} />
                        </div>

                        <button onClick={handleSaveGroup} style={{ width: "100%", backgroundColor: colors.secondary, color: "white", padding: "12px", borderRadius: "10px", border: "none", fontWeight: "bold", cursor: "pointer", display:"flex", justifyContent:"center", gap:"10px" }}>
                            <Save size={18}/> Guardar Clase
                        </button>
                    </div>
                </div>
            )}

            {/* ================= VISTA ALUMNOS (Dentro de la clase) ================= */}
            {viewMode === 'students' && (
                <div style={{ animation: "fadeIn 0.3s ease-out" }}>
                    <div style={{ display: "flex", alignItems: "center", marginBottom: "25px", gap: "15px" }}>
                        <button onClick={() => setViewMode('list')} style={{ background: "white", border: "1px solid #eee", borderRadius: "50%", width: "40px", height: "40px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <ArrowLeft size={20} color="#666" />
                        </button>
                        <div>
                            <h2 style={{ margin: 0, color: colors.secondary, fontSize: "1.6rem", fontWeight: "bold" }}>Grupo {selectedGroup?.grupo}</h2>
                            <p style={{ margin: 0, color: "#888" }}>{selectedGroup?.nivel} - {selectedGroup?.area}</p>
                        </div>
                    </div>

                    <div style={{ backgroundColor: "white", borderRadius: "20px", boxShadow: "0 5px 20px rgba(0,0,0,0.03)", padding: "20px" }}>
                        <h3 style={{marginBottom:"20px", color: "#444", fontSize:"1.1rem"}}>Lista de Alumnos</h3>
                        <table style={{ width: "100%", borderCollapse: "collapse" }}>
                            <thead>
                                <tr style={{ borderBottom: "2px solid #f0f0f0", color: "#888", textAlign: "left" }}>
                                    <th style={{ padding: "15px" }}>Matrícula</th>
                                    <th style={{ padding: "15px" }}>Nombre</th>
                                    <th style={{ padding: "15px" }}>Rol</th>
                                    <th style={{ padding: "15px", textAlign: "right" }}>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {studentsList.length === 0 ? (
                                    <tr><td colSpan="4" style={{padding:"30px", textAlign:"center", color:"#999"}}>No hay alumnos inscritos.</td></tr>
                                ) : (
                                    studentsList.map((student) => (
                                        <tr key={student._id} style={{ borderBottom: "1px solid #eee" }}>
                                            <td style={{ padding: "15px", fontWeight: "bold" }}>{student.matricula}</td>
                                            <td style={{ padding: "15px" }}>
                                                <div style={{display:"flex", alignItems:"center", gap:"10px"}}>
                                                    <div style={{width:"35px", height:"35px", borderRadius:"50%", background: "#eee", display:"flex", alignItems:"center", justifyContent:"center"}}><User size={18} color="#666"/></div>
                                                    {student.name}
                                                </div>
                                            </td>
                                            <td style={{ padding: "15px" }}>
                                                {student.role === 'chief' ? 
                                                    <span style={{background:"#FFEB3B", color:"#F57F17", padding:"5px 10px", borderRadius:"15px", fontSize:"0.8rem", fontWeight:"bold", display:"inline-flex", alignItems:"center", gap:"5px"}}><Crown size={14}/> Jefe</span> 
                                                    : 
                                                    <span style={{color:"#888", fontSize:"0.9rem"}}>Alumno</span>
                                                }
                                            </td>
                                            <td style={{ padding: "15px", textAlign: "right" }}>
                                                {/* CAMBIAR ROL */}
                                                <button onClick={() => handleToggleRole(student)} title="Cambiar Rol" style={{ marginRight: "10px", border: "none", background: student.role === 'chief' ? "#FFF3E0" : "#E8F5E9", padding: "8px", borderRadius: "8px", cursor: "pointer", color: student.role === 'chief' ? "#F57C00" : "#2E7D32" }}>
                                                    <Crown size={18} />
                                                </button>
                                                {/* EDITAR DATOS ALUMNO */}
                                                <button onClick={() => openEditStudent(student)} title="Editar Datos" style={{ marginRight: "10px", border: "none", background: "#E0F7FA", padding: "8px", borderRadius: "8px", cursor: "pointer", color: colors.secondary }}>
                                                    <Edit size={18} />
                                                </button>
                                                {/* SACAR ALUMNO */}
                                                <button onClick={() => handleRemoveStudentRequest(student)} title="Sacar del grupo" style={{ border: "none", background: "#FFEBEE", padding: "8px", borderRadius: "8px", color: "#D32F2F", cursor: "pointer" }}>
                                                    <UserMinus size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* MODAL EDICIÓN RÁPIDA DE ALUMNO (OVERLAY) */}
            {editingStudent && (
                <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 }}>
                    <div style={{ background: "white", padding: "30px", borderRadius: "20px", width: "400px", position: "relative" }}>
                        <button onClick={() => setEditingStudent(null)} style={{ position: "absolute", top: "15px", right: "15px", background: "none", border: "none", cursor: "pointer" }}><X size={20}/></button>
                        <h3 style={{ marginTop: 0, color: colors.secondary }}>Editar Alumno</h3>
                        <div style={{marginBottom: "15px"}}>
                            <label style={labelStyle}>Nombre</label>
                            <input type="text" value={studentForm.name} onChange={e => setStudentForm({...studentForm, name: e.target.value})} style={inputStyle} />
                        </div>
                        <div style={{marginBottom: "20px"}}>
                            <label style={labelStyle}>Matrícula</label>
                            <input type="text" value={studentForm.matricula} onChange={e => setStudentForm({...studentForm, matricula: e.target.value})} style={inputStyle} />
                        </div>
                        <button onClick={saveStudentEdit} style={{ width: "100%", background: colors.secondary, color: "white", padding: "10px", border: "none", borderRadius: "10px", fontWeight: "bold", cursor: "pointer" }}>Guardar Cambios</button>
                    </div>
                </div>
            )}

            <FeedbackModal isOpen={modalConfig.isOpen} {...modalConfig} />
        </>
    );
};

export default Clases;