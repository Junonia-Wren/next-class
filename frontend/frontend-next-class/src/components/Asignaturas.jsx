import React, { useState, useEffect, useRef } from 'react';
import { 
  Plus, Edit, Trash2, ArrowLeft, Save, Presentation, 
  FileText, Image as ImageIcon, Percent, Calendar, BookOpen, Upload, Search 
} from 'lucide-react';
import FeedbackModal from './FeedBackModal'; 
import SubjectService from '../services/subjectService'; 

// Placeholder por defecto
const defaultTeacher = "https://cdn-icons-png.flaticon.com/512/6833/6833591.png";

const Asignaturas = ({ colors = { primary: "#00B8C8", secondary: "#007E8C" } }) => {
  const [viewMode, setViewMode] = useState('list'); // 'list', 'preview', 'form'
  
  // Referencia para el input de archivo oculto
  const fileInputRef = useRef(null);

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
  const [searchTerm, setSearchTerm] = useState(""); // Estado para el buscador

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
        const data = res.data?.data || res.data || [];
        setAsignaturasList(data);
    } catch (error) {
        console.error("Error al cargar:", error);
    }
  };

  // --- LÓGICA DE IMAGEN (BASE64) ---
  const handleImageUpload = (e) => {
      const file = e.target.files[0];
      if (file) {
          if (file.size > 2 * 1024 * 1024) {
              return alert("La imagen es muy pesada. Máximo 2MB.");
          }
          const reader = new FileReader();
          reader.onloadend = () => {
              setFormData(prev => ({ ...prev, profesorFoto: reader.result }));
          };
          reader.readAsDataURL(file);
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

  // Filtrado de búsqueda
  const filteredList = asignaturasList.filter(item => 
      item.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.teacherName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // --- NAVEGACIÓN Y VISTAS ---
  const handleCreate = () => { setFormData(initialFormState); setViewMode('form'); };
  const handleViewDetails = (item) => { setFormData(item); setViewMode('preview'); };
  const handleEdit = (item) => { setFormData(item); setViewMode('form'); };
  const handleEditFromPreview = () => setViewMode('form');

  // --- CRUD ---
  const handleSave = async () => {
    if (!formData.nombre.trim()) return alert("Nombre obligatorio");
    if (!formData.teacherName.trim()) return alert("Docente obligatorio");

    try {
        if (formData.id) {
            await SubjectService.update(formData.id, formData);
        } else {
            const { id, ...data } = formData;
            await SubjectService.create(data);
        }
        setModalConfig({ 
            isOpen: true, type: 'success', title: '¡Guardado!', 
            message: 'Operación exitosa.', 
            onConfirm: () => { closeModal(); loadData(); setViewMode('list'); } 
        });
    } catch (error) {
        console.error(error);
        alert("Error al guardar.");
    }
  };

  const handleDelete = (item) => {
      setModalConfig({
          isOpen: true, type: 'danger', title: '¿Eliminar?', message: `Se borrará ${item.nombre}`,
          onCancel: () => closeModal(),
          onConfirm: async () => {
              try {
                  await SubjectService.delete(item.id || formData.id);
                  closeModal();
                  loadData();
                  setViewMode('list'); 
              } catch (e) { alert("Error al borrar"); }
          }
      });
  };

  // ESTILOS (Idénticos a Clases.jsx)
  const labelStyle = { display: "block", marginBottom: "8px", fontWeight: "600", color: "#555", fontSize: "0.9rem" };
  const inputStyle = { width: "100%", padding: "12px 15px", borderRadius: "10px", border: "1px solid #ddd", backgroundColor: "#F9FAFB", color: "#333", fontSize: "0.95rem", outline: "none" };
  const cardStyle = { backgroundColor: "white", padding: "30px", borderRadius: "20px", boxShadow: "0 5px 20px rgba(0,0,0,0.03)", marginBottom: "25px" };
  const pillStyle = { backgroundColor: colors.secondary, color: "white", padding: "10px 20px", borderRadius: "20px", fontSize: "0.9rem", display: "inline-block", margin: "5px" };
  const sectionTitleStyle = { color: "#333", fontSize: "1.1rem", fontWeight: "bold", marginTop: "25px", marginBottom: "15px" };

  return (
    <>
      {/* ================= VISTA LISTA (DISEÑO UNIFICADO) ================= */}
      {viewMode === 'list' && (
        <div style={{animation: "fadeIn 0.3s"}}>
            
            {/* 1. HEADER */}
            <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"30px"}}>
                <div>
                    <h1 style={{color: colors.secondary, margin: "0 0 5px 0", fontSize: "1.8rem", fontWeight: "bold"}}>Catálogo de Asignaturas</h1>
                    <p style={{color: "#888", margin: 0}}>Gestión de materias y planes de evaluación.</p>
                </div>
                <button onClick={handleCreate} style={{background: colors.primary, color:"white", border:"none", padding:"10px 25px", borderRadius:"50px", cursor:"pointer", display:"flex", alignItems:"center", gap:"8px", fontWeight:"bold", boxShadow: "0 4px 15px rgba(0,184,200,0.3)"}}>
                    <Plus size={20}/> Nueva Asignatura
                </button>
            </div>

            {/* 2. BUSCADOR (Igual que Clases.jsx) */}
            <div style={{ marginBottom: "25px", position: "relative", maxWidth: "500px" }}>
                <Search size={20} style={{ position: "absolute", left: "20px", top: "50%", transform: "translateY(-50%)", color: "#aaa" }} />
                <input 
                    type="text" 
                    placeholder="Buscar asignatura..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ width: "100%", padding: "15px 15px 15px 50px", borderRadius: "50px", border: "1px solid #eee", backgroundColor: "white", outline: "none", fontSize: "0.95rem", boxShadow: "0 2px 10px rgba(0,0,0,0.02)" }} 
                />
            </div>

            {/* 3. TABLA */}
            <div style={{background:"white", borderRadius:"20px", overflow:"hidden", boxShadow:"0 5px 20px rgba(0,0,0,0.03)"}}>
                <table style={{width:"100%", borderCollapse:"collapse"}}>
                    <thead>
                        <tr style={{background:"#F8F9FA", color: "#666", textAlign:"left", fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "0.5px"}}>
                            <th style={{padding:"20px 25px", fontWeight: "600"}}>Asignatura / Docente</th>
                            <th style={{padding:"20px 25px", fontWeight: "600", textAlign:"right"}}>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredList.length === 0 ? (
                            <tr><td colSpan="2" style={{padding:"40px", textAlign:"center", color:"#999"}}>No se encontraron asignaturas.</td></tr>
                        ) : (
                            filteredList.map(item => (
                                <tr 
                                    key={item.id} 
                                    onClick={() => handleViewDetails(item)} 
                                    style={{borderBottom:"1px solid #f0f0f0", cursor: "pointer", transition: "background 0.2s"}} 
                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#FAFAFA"} 
                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "white"}
                                >
                                    <td style={{padding:"20px 25px"}}>
                                        <div style={{display:"flex", alignItems:"center", gap:"15px"}}>
                                            <div style={{padding: '10px', backgroundColor: '#E0F2F1', borderRadius: '10px', color: colors.primary}}>
                                                <Presentation size={20}/>
                                            </div>
                                            <div>
                                                <div style={{fontWeight:"bold", fontSize: "1.05rem", color: "#333"}}>{item.nombre}</div>
                                                <div style={{fontSize:"0.9rem", color:"#777"}}>{item.teacherName}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{padding:"20px 25px", textAlign:"right"}}>
                                        <button onClick={(e) => { e.stopPropagation(); handleEdit(item); }} style={{marginRight:"10px", border:"none", background:"#E0F7FA", padding:"8px", borderRadius:"8px", cursor:"pointer", color: colors.secondary}} title="Editar">
                                            <Edit size={18}/>
                                        </button>
                                        <button onClick={(e) => { e.stopPropagation(); handleDelete(item); }} style={{border:"none", background:"#FFEBEE", padding:"8px", borderRadius:"8px", cursor:"pointer", color: "#D32F2F"}} title="Eliminar">
                                            <Trash2 size={18}/>
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

      {/* ================= VISTA PREVIEW ================= */}
      {viewMode === 'preview' && (
        <div style={{ animation: "fadeIn 0.3s ease-out" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "25px" }}>
                <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
                    <button onClick={() => setViewMode('list')} style={{ background: "white", border: "1px solid #eee", borderRadius: "50%", width: "40px", height: "40px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><ArrowLeft size={20}/></button>
                    <h2 style={{ margin: 0, color: colors.secondary, fontSize: "1.6rem", fontWeight: "bold" }}>Vista Previa</h2>
                </div>
                <div style={{ display: "flex", gap: "10px" }}>
                    <button onClick={handleEditFromPreview} style={{ background: colors.secondary, border: "none", color: "white", padding: "10px", borderRadius: "50%", cursor: "pointer" }}><Edit size={20}/></button>
                    <button onClick={() => handleDelete(formData)} style={{ background: "#D32F2F", border: "none", color: "white", padding: "10px", borderRadius: "50%", cursor: "pointer" }}><Trash2 size={20}/></button>
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
                        (unit.fechas || unit.porcentaje !== "") ? (
                            <div key={index} style={{ display: "flex", marginBottom: "10px", fontSize: "0.95rem" }}>
                                <div style={{ flex: "0 0 120px", fontWeight: "600", color: "#555" }}>Unidad {index + 1} - {unit.porcentaje}%</div>
                                <div style={{ color: "#777", borderLeft: "3px solid #ddd", paddingLeft: "15px" }}>{unit.fechas || "Sin fecha"}</div>
                            </div>
                        ) : null
                    ))}
                </div>

                {formData.notas ? (
                    <div style={{ textAlign: "left", marginTop: "30px", backgroundColor: "#F9FAFB", padding: "20px", borderRadius: "15px" }}>
                        <h3 style={{ ...sectionTitleStyle, marginTop: 0 }}>Notas</h3>
                        <p style={{ color: "#666", lineHeight: "1.6", margin: 0 }}>{formData.notas}</p>
                    </div>
                ) : null}
            </div>
        </div>
      )}

      {/* ================= VISTA FORMULARIO ================= */}
      {viewMode === 'form' && (
        <div style={{animation: "fadeIn 0.3s"}}>
            <div style={{display:"flex", alignItems:"center", marginBottom:"20px", gap:"10px"}}>
                <button onClick={() => setViewMode('list')} style={{border:"1px solid #ddd", background:"white", borderRadius:"50%", width:"35px", height:"35px", cursor:"pointer"}}><ArrowLeft size={18}/></button>
                <h2 style={{margin:0, color: colors.secondary}}>{formData.id ? "Editar" : "Nueva"} Asignatura</h2>
            </div>
            <div style={{display: "grid", gridTemplateColumns: "1fr", gap: "25px"}}>
                <div style={{background:"white", padding:"30px", borderRadius:"20px", boxShadow:"0 4px 15px rgba(0,0,0,0.05)"}}>
                    <h3 style={{ color: colors.primary, marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" }}><Presentation size={20}/> Datos Generales</h3>
                    <div style={{marginBottom:"20px"}}>
                        <label style={labelStyle}>Materia</label>
                        <input type="text" value={formData.nombre} onChange={e => setFormData({...formData, nombre: e.target.value})} style={inputStyle} />
                    </div>
                    <div style={{marginBottom:"20px"}}>
                        <label style={labelStyle}>Docente</label>
                        <input type="text" value={formData.teacherName} onChange={e => setFormData({...formData, teacherName: e.target.value})} style={inputStyle} />
                    </div>
                    <div style={{marginBottom:"10px"}}>
                        <label style={labelStyle}>Foto de Perfil</label>
                        <div style={{ display: "flex", gap: "20px", alignItems: "center", marginTop: "10px" }}>
                            <div style={{ textAlign: "center" }}>
                                <input type="file" ref={fileInputRef} style={{ display: "none" }} accept="image/*" onChange={handleImageUpload} />
                                <button onClick={() => fileInputRef.current.click()} style={{ width: "70px", height: "70px", borderRadius: "20px", backgroundColor: colors.primary, border: "none", color: "white", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 4px 10px rgba(0,184,200,0.3)" }}>
                                    <Upload size={28} />
                                </button>
                                <span style={{ fontSize: "0.8rem", color: "#666", fontWeight: "500" }}>Subir</span>
                            </div>
                            <div>
                                <img src={formData.profesorFoto || defaultTeacher} alt="Preview" style={{ width: "70px", height: "70px", borderRadius: "50%", objectFit: "cover", border: "2px solid #ddd" }} />
                            </div>
                        </div>
                    </div>
                </div>

                <div style={cardStyle}>
                    <h3 style={{ color: colors.primary, marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" }}><Percent size={20}/> Evaluación</h3>
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

            <div style={{marginTop:"30px", textAlign:"right"}}>
                <button onClick={handleSave} style={{background: colors.secondary, color:"white", border:"none", padding:"12px 30px", borderRadius:"30px", fontWeight:"bold", cursor:"pointer", display:"inline-flex", gap:"10px", alignItems:"center"}}>
                    <Save size={18}/> Guardar
                </button>
            </div>
        </div>
      )}
      <FeedbackModal isOpen={modalConfig.isOpen} {...modalConfig} />
    </>
  );
};

export default Asignaturas;