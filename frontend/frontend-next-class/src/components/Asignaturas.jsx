import React, { useState, useEffect } from 'react';
import { 
  Plus, Edit, Trash2, ArrowLeft, Save, Presentation, 
  FileText, Image as ImageIcon, Percent, Calendar, BookOpen 
} from 'lucide-react';
import FeedbackModal from './FeedBackModal'; 
import SubjectService from '../services/subjectService'; 

// Placeholder para foto
const defaultTeacher = "https://cdn-icons-png.flaticon.com/512/6833/6833591.png";

const Asignaturas = ({ colors = { primary: "#00B8C8", secondary: "#007E8C" } }) => {
  const [viewMode, setViewMode] = useState('list'); 
  
  // Estado inicial
  const initialFormState = {
      id: null,
      nombre: "",
      teacherName: "",
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
    isOpen: false, type: 'success', title: '', message: '', onConfirm: () => {}, onCancel: () => {}
  });

  // --- CARGAR DATOS ---
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
        const res = await SubjectService.getAll();
        // Soportamos si viene en res.data o res.data.data
        const data = res.data?.data || res.data || [];
        setAsignaturasList(data);
    } catch (error) {
        console.error("Error cargando asignaturas:", error);
    }
  };

  // --- HELPERS ---
  const closeModal = () => setModalConfig({ ...modalConfig, isOpen: false });

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

  // --- ACCIONES ---
  const handleCreate = () => {
    setFormData(initialFormState);
    setViewMode('form');
  };

  const handleViewDetails = (item) => {
      setFormData(item);
      setViewMode('preview');
  };

  const handleEditFromPreview = () => setViewMode('form');

  const handleSave = async () => {
    if (!formData.nombre.trim()) return alert("Nombre obligatorio");
    if (!formData.teacherName.trim()) return alert("Profesor obligatorio");

    try {
        if (formData.id) {
            await SubjectService.update(formData.id, formData);
            setModalConfig({
                isOpen: true, type: 'success', title: '¡Actualizado!',
                message: `Asignatura actualizada.`,
                onConfirm: () => { closeModal(); loadData(); setViewMode('list'); }
            });
        } else {
            const { id, ...dataToSend } = formData;
            await SubjectService.create(dataToSend);
            setModalConfig({
                isOpen: true, type: 'success', title: '¡Creado!',
                message: `Asignatura creada.`,
                onConfirm: () => { closeModal(); loadData(); setViewMode('list'); }
            });
        }
    } catch (error) {
        console.error(error);
        alert("Error al guardar.");
    }
  };

  const handleDeleteRequest = (item, e) => {
    if(e) e.stopPropagation();
    setModalConfig({
      isOpen: true, type: 'danger', title: '¿Eliminar?',
      message: `Se eliminará "${item.nombre}".`,
      onCancel: closeModal,
      onConfirm: async () => {
        await SubjectService.delete(item.id);
        setModalConfig({
            isOpen: true, type: 'deleteSuccess', title: '¡Eliminado!',
            message: 'Eliminado correctamente.', 
            onConfirm: () => { closeModal(); loadData(); setViewMode('list'); }
        });
      }
    });
  };

  // ESTILOS
  const labelStyle = { display: "block", marginBottom: "8px", fontWeight: "600", color: "#555", fontSize: "0.9rem" };
  const inputStyle = { width: "100%", padding: "12px 15px", borderRadius: "10px", border: "1px solid #ddd", backgroundColor: "#F9FAFB", color: "#333", fontSize: "0.95rem", outline: "none" };
  const cardStyle = { backgroundColor: "white", padding: "30px", borderRadius: "20px", boxShadow: "0 5px 20px rgba(0,0,0,0.03)", marginBottom: "25px" };
  const pillStyle = { backgroundColor: colors.secondary, color: "white", padding: "10px 20px", borderRadius: "20px", fontSize: "0.9rem", display: "inline-block", margin: "5px" };
  const sectionTitleStyle = { color: "#333", fontSize: "1.1rem", fontWeight: "bold", marginTop: "25px", marginBottom: "15px" };

  return (
    <>
      {/* --- VISTA LISTA --- */}
      {viewMode === 'list' && (
        <div style={{ animation: "fadeIn 0.3s ease-out" }}>
            <div style={{ marginBottom: "30px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                    <h1 style={{ color: colors.secondary, margin: "0 0 5px 0", fontSize: "1.8rem", fontWeight: "bold" }}>Asignaturas</h1>
                    <p style={{ color: "#888", margin: 0 }}>Gestión de asignaturas.</p>
                </div>
                <button onClick={handleCreate} style={{ backgroundColor: colors.primary, color: "white", padding: "10px 25px", borderRadius: "50px", border: "none", fontWeight: "bold", cursor: "pointer", display: "flex", gap: "8px", alignItems: "center" }}>
                    <Plus size={20} /> Nueva Asignatura
                </button>
            </div>
            <div style={{ backgroundColor: "white", borderRadius: "20px", boxShadow: "0 5px 20px rgba(0,0,0,0.03)", overflow: "hidden" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                        <tr style={{ backgroundColor: "#F8F9FA", color: "#666", textAlign: "left" }}>
                            <th style={{ padding: "20px 25px" }}>Asignatura</th>
                            <th style={{ padding: "20px 25px", textAlign: "right" }}>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {asignaturasList.length === 0 ? (
                            <tr><td colSpan="2" style={{ padding: "30px", textAlign: "center", color: "#999" }}>Sin datos.</td></tr>
                        ) : (
                            asignaturasList.map((item) => (
                                <tr key={item.id} onClick={() => handleViewDetails(item)} style={{ borderBottom: "1px solid #f0f0f0", cursor: "pointer" }}>
                                    <td style={{ padding: "20px 25px" }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                            <div style={{ padding: '10px', backgroundColor: '#E0F2F1', borderRadius: '10px', color: colors.primary }}><Presentation size={20}/></div>
                                            <div>
                                                <div style={{ fontWeight: 'bold' }}>{item.nombre}</div>
                                                <div style={{ fontSize: '0.8rem', color: '#888' }}>{item.teacherName}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ padding: "20px 25px", textAlign: "right" }}>
                                        <button onClick={(e) => { e.stopPropagation(); handleViewDetails(item); handleEditFromPreview(); }} style={{ marginRight: "10px", border: "none", background: "#E0F7FA", padding: "8px", borderRadius: "8px", color: colors.secondary, cursor: "pointer" }}><Edit size={18}/></button>
                                        <button onClick={(e) => handleDeleteRequest(item, e)} style={{ border: "none", background: "#FFEBEE", padding: "8px", borderRadius: "8px", color: "#D32F2F", cursor: "pointer" }}><Trash2 size={18}/></button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
      )}

      {/* --- VISTA PREVIEW --- */}
      {viewMode === 'preview' && (
        <div style={{ animation: "fadeIn 0.3s ease-out" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "25px" }}>
                <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
                    <button onClick={() => setViewMode('list')} style={{ background: "white", border: "1px solid #eee", borderRadius: "50%", width: "40px", height: "40px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><ArrowLeft size={20}/></button>
                    <h2 style={{ margin: 0, color: colors.secondary, fontSize: "1.6rem", fontWeight: "bold" }}>Vista Previa</h2>
                </div>
                <div style={{ display: "flex", gap: "10px" }}>
                    <button onClick={handleEditFromPreview} style={{ background: colors.secondary, border: "none", color: "white", padding: "10px", borderRadius: "50%", cursor: "pointer" }}><Edit size={20}/></button>
                    <button onClick={(e) => handleDeleteRequest(formData, e)} style={{ background: "#D32F2F", border: "none", color: "white", padding: "10px", borderRadius: "50%", cursor: "pointer" }}><Trash2 size={20}/></button>
                </div>
            </div>

            <div style={{ maxWidth: "500px", margin: "0 auto", backgroundColor: "white", borderRadius: "30px", padding: "40px 30px", textAlign: "center", boxShadow: "0 10px 30px rgba(0,0,0,0.05)", border: "1px solid #f0f0f0" }}>
                <div style={{ backgroundColor: "#8D2745", color: "white", padding: "12px 25px", borderRadius: "15px", display: "inline-block", fontSize: "1.1rem", fontWeight: "bold", marginBottom: "30px" }}>{formData.nombre}</div>
                <div style={{ marginBottom: "25px" }}>
                    <img src={formData.profesorFoto || defaultTeacher} alt="Docente" style={{ width: "120px", height: "120px", borderRadius: "50%", objectFit: "cover", border: `4px solid ${colors.primary}`, padding: "3px" }} />
                    <h5 style={{ marginTop: "10px", color: "#666" }}>{formData.teacherName}</h5>
                </div>
                <div style={{ marginBottom: "30px" }}><span style={pillStyle}>Asesorías</span><span style={{ ...pillStyle, backgroundColor: colors.primary }}>Cronograma</span></div>

                <div style={{ textAlign: "left" }}>
                    <h3 style={sectionTitleStyle}>Evaluación</h3>
                    {Object.entries(formData.porcentajes || {}).map(([key, data]) => (
                        // Corregido: Mostrar si tiene valor O descripción
                        (data.valor || data.descripcion) ? (
                            <div key={key} style={{ display: "flex", marginBottom: "15px", alignItems: "flex-start" }}>
                                <div style={{ flex: "0 0 120px", fontWeight: "bold", color: "#555", textTransform: "capitalize" }}>{key}: {data.valor}%</div>
                                <div style={{ color: "#777", fontSize: "0.95rem", borderLeft: `3px solid ${colors.primary}`, paddingLeft: "15px" }}>{data.descripcion}</div>
                            </div>
                        ) : null
                    ))}
                </div>

                <div style={{ textAlign: "left", marginTop: "30px" }}>
                    <h3 style={sectionTitleStyle}>Unidades</h3>
                    {formData.unidades?.map((unit, index) => (
                        // Corregido: Mostrar si tiene fecha O porcentaje (aunque sea 0)
                        (unit.fechas || unit.porcentaje !== "") ? (
                            <div key={index} style={{ display: "flex", marginBottom: "10px", fontSize: "0.95rem" }}>
                                <div style={{ flex: "0 0 120px", fontWeight: "600", color: "#555" }}>Unidad {index + 1} - {unit.porcentaje}%</div>
                                <div style={{ color: "#777", borderLeft: "3px solid #ddd", paddingLeft: "15px" }}>{unit.fechas || "Sin fecha"}</div>
                            </div>
                        ) : null
                    ))}
                </div>

                {/* Corregido: Mostrar notas si existen */}
                {formData.notas ? (
                    <div style={{ textAlign: "left", marginTop: "30px", backgroundColor: "#F9FAFB", padding: "20px", borderRadius: "15px" }}>
                        <h3 style={{ ...sectionTitleStyle, marginTop: 0 }}>Notas</h3>
                        <p style={{ color: "#666", lineHeight: "1.6", margin: 0 }}>{formData.notas}</p>
                    </div>
                ) : null}
            </div>
        </div>
      )}

      {/* --- VISTA FORMULARIO --- */}
      {viewMode === 'form' && (
        <div style={{ animation: "fadeIn 0.3s ease-out", paddingBottom: "50px" }}>
            <div style={{ display: "flex", alignItems: "center", marginBottom: "25px", gap: "15px" }}>
                <button onClick={() => setViewMode('list')} style={{ background: "white", border: "1px solid #eee", borderRadius: "50%", width: "40px", height: "40px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><ArrowLeft size={20}/></button>
                <h2 style={{ margin: 0, color: colors.secondary, fontSize: "1.6rem", fontWeight: "bold" }}>{formData.id ? "Editar" : "Nueva"}</h2>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "25px" }}>
                <div style={cardStyle}>
                    <h3 style={{ color: colors.primary, marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" }}><Presentation size={20}/> Datos Generales</h3>
                    <div style={{ marginBottom: "25px" }}><label style={labelStyle}>Materia</label><input type="text" value={formData.nombre} onChange={(e) => setFormData({...formData, nombre: e.target.value})} style={inputStyle} placeholder="Ej: Matemáticas" /></div>
                    <div style={{ marginBottom: "25px" }}><label style={labelStyle}>Docente</label><input type="text" value={formData.teacherName} onChange={(e) => setFormData({...formData, teacherName: e.target.value})} style={inputStyle} placeholder="Ej: Ing. Juan" /></div>
                </div>

                <div style={cardStyle}>
                    <h3 style={{ color: colors.primary, marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" }}><Percent size={20}/> Evaluación</h3>
                    <div style={{ display: "grid", gridTemplateColumns: "100px 1fr", gap: "15px", marginBottom: "10px" }}><label style={labelStyle}>%</label><label style={labelStyle}>Descripción</label></div>
                    {['ser', 'saber', 'saberHacer'].map((item) => (
                        <div key={item} style={{ display: "grid", gridTemplateColumns: "100px 1fr", gap: "15px", marginBottom: "15px" }}>
                            <div><label style={{textTransform:"capitalize", fontSize:"0.8rem", marginBottom:"5px"}}>{item}</label><input type="number" value={formData.porcentajes[item].valor} onChange={(e) => updateNestedState('porcentajes', item, 'valor', e.target.value)} style={inputStyle} /></div>
                            <div><label style={{visibility:"hidden"}}>Desc</label><input type="text" value={formData.porcentajes[item].descripcion} onChange={(e) => updateNestedState('porcentajes', item, 'descripcion', e.target.value)} style={inputStyle} /></div>
                        </div>
                    ))}
                </div>

                <div style={cardStyle}>
                    <h3 style={{ color: colors.primary, marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" }}><FileText size={20}/> Unidades</h3>
                    {formData.unidades.map((unit, index) => (
                        <div key={index} style={{ display: "grid", gridTemplateColumns: "60px 100px 1fr", gap: "15px", marginBottom: "15px", alignItems: "center" }}>
                            <div style={{ fontWeight: "bold", color: "#777", textAlign: "center" }}>#{index + 1}</div>
                            <input type="number" placeholder="%" value={unit.porcentaje} onChange={(e) => updateUnitState(index, 'porcentaje', e.target.value)} style={inputStyle} />
                            <input type="text" placeholder="Fechas" value={unit.fechas} onChange={(e) => updateUnitState(index, 'fechas', e.target.value)} style={inputStyle} />
                        </div>
                    ))}
                    <div style={{ marginTop: "30px" }}><label style={labelStyle}>Notas</label><textarea value={formData.notas} onChange={(e) => setFormData({...formData, notas: e.target.value})} style={{ ...inputStyle, height: "100px" }} /></div>
                </div>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "15px", marginTop: "30px" }}>
                <button onClick={() => setViewMode('list')} style={{ backgroundColor: "transparent", color: "#666", padding: "12px 30px", borderRadius: "30px", border: "1px solid #ddd", fontWeight: "600", cursor: "pointer" }}>Cancelar</button>
                <button onClick={handleSave} style={{ backgroundColor: colors.secondary, color: "white", padding: "12px 40px", borderRadius: "30px", border: "none", fontWeight: "600", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}><Save size={18} /> Guardar</button>
            </div>
        </div>
      )}

      <FeedbackModal isOpen={modalConfig.isOpen} {...modalConfig} />
    </>
  );
};

export default Asignaturas;