import React, { useState } from 'react';
import { 
  Plus, Search, Edit, Trash2, ArrowLeft, Save, Presentation, 
  FileText, Image as ImageIcon, Percent, Calendar, BookOpen 
} from 'lucide-react';
import FeedbackModal from './FeedbackModal';

// Placeholder para foto de docente
const defaultTeacher = "https://cdn-icons-png.flaticon.com/512/6833/6833591.png";
import ProfesoraMay from '../assets/Mayra.jpeg';

const Asignaturas = ({ colors }) => {
  // Estados de vista: 'list', 'preview', 'form'
  const [viewMode, setViewMode] = useState('list'); 
  
  // Estado para manejar los datos del formulario
  // Estructura compleja para manejar todos los campos de la imagen
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

  // Estado para el Modal
  const [modalConfig, setModalConfig] = useState({
    isOpen: false, type: 'success', title: '', message: '', onConfirm: () => {}, onCancel: () => {}
  });

  // Datos de ejemplo (Mock Data) con estructura completa
  const [asignaturasList, setAsignaturasList] = useState([
    { 
      id: 1, 
      nombre: "Gestión de Proyectos II",
      profesorFoto: ProfesoraMay, // Ejemplo con foto real
      porcentajes: {
        ser: { valor: 40, descripcion: "Tareas, participación, Actitud y Responsabilidad" },
        saber: { valor: 10, descripcion: "Examen teórico" },
        saberHacer: { valor: 50, descripcion: "Proyecto final integrador" }
      },
      unidades: [
        { id: 1, porcentaje: 30, fechas: "8 Septiembre al 30 de Octubre" },
        { id: 2, porcentaje: 70, fechas: "2 Noviembre al 19 de Diciembre" },
        { id: 3, porcentaje: "", fechas: "" },
        { id: 4, porcentaje: "", fechas: "" }
      ],
      notas: "Se tendrá en cuenta asistencia mínima del 80% para poder ser evaluado."
    },
    { 
      id: 2, 
      nombre: "Desarrollo Móvil Multiplataforma",
      profesorFoto: defaultTeacher,
      porcentajes: { ser: { valor: 30, descripcion: "" }, saber: { valor: 30, descripcion: "" }, saberHacer: { valor: 40, descripcion: "" } },
      unidades: [{ id: 1, porcentaje: 100, fechas: "Todo el cuatrimestre" }, {id:2},{id:3},{id:4}],
      notas: ""
    },
     { 
      id: 3, 
      nombre: "Base de Datos Avanzadas",
      profesorFoto: defaultTeacher,
      porcentajes: { ser: { valor: 20, descripcion: "" }, saber: { valor: 40, descripcion: "" }, saberHacer: { valor: 40, descripcion: "" } },
      unidades: [{ id: 1, porcentaje: 50, fechas: "Parcial 1" }, { id: 2, porcentaje: 50, fechas: "Parcial 2" },{id:3},{id:4}],
      notas: ""
    }
  ]);

  // --- FUNCIONES AUXILIARES ---
  const closeModal = () => setModalConfig({ ...modalConfig, isOpen: false });

  // Función para actualizar estados anidados de forma segura (Porcentajes y Unidades)
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


  // --- MANEJADORES DE ACCIÓN (CRUD) ---

  const handleViewDetails = (item) => {
      setFormData(item); // Cargamos los datos en el estado para la vista previa
      setViewMode('preview');
  };

  const handleEditFromPreview = () => {
      // formData ya tiene los datos cargados desde el preview
      setViewMode('form');
  };

  const handleCreate = () => {
    setFormData(initialFormState); // Reseteamos el formulario
    setViewMode('form');
  };

  const handleSave = () => {
    // Validación simple (solo nombre obligatorio para el ejemplo)
    if (!formData.nombre.trim()) return; 

    // Aquí iría la lógica de Backend...

    setModalConfig({
      isOpen: true,
      type: 'success',
      title: formData.id ? '¡Asignatura Actualizada!' : '¡Asignatura Creada!',
      message: `Los datos de ${formData.nombre} se han guardado correctamente.`,
      onConfirm: () => {
        closeModal();
        setViewMode('list'); // Volver a la lista
      }
    });
  };

  const handleDeleteRequest = (item, e) => {
    e.stopPropagation(); // Evitar que se abra el preview al dar click en borrar
    setModalConfig({
      isOpen: true,
      type: 'danger',
      title: '¿Eliminar Asignatura?',
      message: `Se eliminará la materia "${item.nombre}" y toda su configuración de evaluación.`,
      onCancel: closeModal,
      onConfirm: () => confirmDelete()
    });
  };

  const confirmDelete = () => {
    setModalConfig({
      isOpen: true, type: 'deleteSuccess', title: '¡Borrado Exitoso!', message: 'La asignatura ha sido eliminada.', onConfirm: closeModal
    });
  };


  // ================= VISTA 1: LISTA PRINCIPAL =================
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
              backgroundColor: colors.primary, color: "white", border: "none", 
              padding: "10px 25px", borderRadius: "50px", cursor: "pointer",
              display: "flex", alignItems: "center", gap: "8px", fontWeight: "bold",
              boxShadow: "0 4px 15px rgba(0,184,200,0.3)"
            }}>
              <Plus size={20} /> Nueva Asignatura
            </button>
        </div>

        <div style={{ backgroundColor: "white", borderRadius: "20px", boxShadow: "0 5px 20px rgba(0,0,0,0.03)", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ backgroundColor: "#F8F9FA", color: "#666", textAlign: "left", fontSize: "0.9rem", textTransform: "uppercase" }}>
                <th style={{ padding: "20px 25px", fontWeight: "600" }}>Nombre de Asignatura</th>
                <th style={{ padding: "20px 25px", fontWeight: "600", textAlign: "right" }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {asignaturasList.map((item) => (
                <tr key={item.id} 
                    onClick={() => handleViewDetails(item)} // Click en la fila abre preview
                    style={{ borderBottom: "1px solid #f0f0f0", cursor: "pointer", transition: "background 0.2s" }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#FAFAFA"}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "white"}
                >
                  <td style={{ padding: "20px 25px"}}>
                     <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <div style={{ padding: '10px', backgroundColor: '#E0F2F1', borderRadius: '10px', color: colors.primary }}><Presentation size={20}/></div>
                        {item.nombre}
                     </div>
                  </td>
                  <td style={{ padding: "20px 25px", textAlign: "right" }}>
                    {/* Los botones tienen stopPropagation para no disparar el click de la fila */}
                    <button onClick={(e) => { e.stopPropagation(); handleViewDetails(item); handleEditFromPreview(); }} style={{ background: "#E0F7FA", border: "none", cursor: "pointer", color: colors.secondary, padding: "8px", borderRadius: "8px", marginRight: "10px" }} title="Editar">
                      <Edit size={18} />
                    </button>
                    <button onClick={(e) => handleDeleteRequest(item, e)} style={{ background: "#FFEBEE", border: "none", cursor: "pointer", color: "#D32F2F", padding: "8px", borderRadius: "8px" }} title="Eliminar">
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


  // ================= VISTA 2: PREVIEW (Estilo Móvil) =================
  const PreviewView = () => {
    // Estilos internos para esta vista
    const pillStyle = { backgroundColor: colors.secondary, color: "white", padding: "10px 20px", borderRadius: "20px", fontSize: "0.9rem", display: "inline-block", margin: "5px" };
    const sectionTitleStyle = { color: "#333", fontSize: "1.1rem", fontWeight: "bold", marginTop: "25px", marginBottom: "15px" };

    return (
    <div style={{ animation: "fadeIn 0.3s ease-out" }}>
      {/* Header con botón Atrás y Acciones */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "25px" }}>
         <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
            <button onClick={() => setViewMode('list')} style={{ background: "white", border: "1px solid #eee", borderRadius: "50%", width: "40px", height: "40px", cursor: "pointer", color: "#666", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 5px rgba(0,0,0,0.05)" }}>
            <ArrowLeft size={20} />
            </button>
            <div>
                <h2 style={{ margin: 0, color: colors.secondary, fontSize: "1.6rem", fontWeight: "bold" }}>Vista Previa</h2>
                <p style={{ margin: 0, color: "#888", fontSize: "0.9rem" }}>Selección: {formData.nombre}</p>
            </div>
         </div>
         <div style={{ display: "flex", gap: "10px" }}>
            <button onClick={handleEditFromPreview} style={{ background: colors.secondary, border: "none", cursor: "pointer", color: "white", padding: "10px", borderRadius: "50%", boxShadow: "0 4px 10px rgba(0,0,0,0.1)" }} title="Editar"><Edit size={20} /></button>
            <button onClick={(e) => handleDeleteRequest(formData, e)} style={{ background: "#D32F2F", border: "none", cursor: "pointer", color: "white", padding: "10px", borderRadius: "50%", boxShadow: "0 4px 10px rgba(0,0,0,0.1)" }} title="Eliminar"><Trash2 size={20} /></button>
         </div>
      </div>

      {/* Contenedor "Móvil" Centrado */}
      <div style={{ maxWidth: "500px", margin: "0 auto", backgroundColor: "white", borderRadius: "30px", padding: "40px 30px", boxShadow: "0 10px 30px rgba(0,0,0,0.05)", textAlign: "center", border: "1px solid #f0f0f0" }}>
          
          {/* Título Asignatura */}
          <div style={{ backgroundColor: "#8D2745", color: "white", padding: "12px 25px", borderRadius: "15px", display: "inline-block", fontSize: "1.1rem", fontWeight: "bold", marginBottom: "30px", boxShadow: "0 4px 15px rgba(141, 39, 69, 0.3)" }}>
            {formData.nombre}
          </div>

          {/* Foto Docente */}
          <div style={{ marginBottom: "25px" }}>
              <img src={formData.profesorFoto} alt="Docente" style={{ width: "120px", height: "120px", borderRadius: "50%", objectFit: "cover", border: `4px solid ${colors.primary}`, padding: "3px" }} />
          </div>

          {/* Botones Asesorías/Cronograma (Visuales) */}
          <div style={{ marginBottom: "30px" }}>
              <span style={pillStyle}>Asesorías</span>
              <span style={{ ...pillStyle, backgroundColor: colors.primary }}>Cronograma del docente</span>
          </div>

          {/* Sección: Porcentajes */}
          <div style={{ textAlign: "left" }}>
              <h3 style={sectionTitleStyle}>Porcentajes de evaluación</h3>
              {Object.entries(formData.porcentajes).map(([key, data]) => (
                 data.valor && (
                    <div key={key} style={{ display: "flex", marginBottom: "15px", alignItems: "flex-start" }}>
                        <div style={{ flex: "0 0 120px", fontWeight: "bold", color: "#555", textTransform: "capitalize" }}>
                            {key.replace(/([A-Z])/g, ' $1').trim()} - {data.valor}%
                        </div>
                        <div style={{ color: "#777", fontSize: "0.95rem", borderLeft: `3px solid ${colors.primary}`, paddingLeft: "15px" }}>
                            {data.descripcion || "Sin descripción"}
                        </div>
                    </div>
                 )
              ))}
          </div>

           {/* Sección: Unidades */}
           <div style={{ textAlign: "left", marginTop: "30px" }}>
              <h3 style={sectionTitleStyle}>Unidades</h3>
              {formData.unidades.map((unit, index) => (
                 (unit.porcentaje || unit.fechas) && (
                    <div key={unit.id} style={{ display: "flex", marginBottom: "10px", fontSize: "0.95rem" }}>
                        <div style={{ flex: "0 0 120px", fontWeight: "600", color: "#555" }}>
                            Unidad {index + 1} - {unit.porcentaje ? `${unit.porcentaje}%` : 'N/A'}
                        </div>
                        <div style={{ color: "#777", borderLeft: "3px solid #ddd", paddingLeft: "15px" }}>
                            {unit.fechas || "Fechas no definidas"}
                        </div>
                    </div>
                 )
              ))}
          </div>

           {/* Sección: Notas */}
           {formData.notas && (
            <div style={{ textAlign: "left", marginTop: "30px", backgroundColor: "#F9FAFB", padding: "20px", borderRadius: "15px" }}>
                <h3 style={{ ...sectionTitleStyle, marginTop: 0 }}>Notas</h3>
                <p style={{ color: "#666", lineHeight: "1.6", margin: 0 }}>{formData.notas}</p>
            </div>
           )}

      </div>
    </div>
    );
  };


  // ================= VISTA 3: FORMULARIO (Create/Edit) =================
  const SubjectForm = () => {
    // Estilos para inputs del formulario
    const labelStyle = { display: "block", marginBottom: "8px", fontWeight: "600", color: "#555", fontSize: "0.9rem" };
    const inputStyle = { width: "100%", padding: "12px 15px", borderRadius: "10px", border: "1px solid #ddd", backgroundColor: "#F9FAFB", color: "#333", fontSize: "0.95rem", outline: "none" };
    const cardStyle = { backgroundColor: "white", padding: "30px", borderRadius: "20px", boxShadow: "0 5px 20px rgba(0,0,0,0.03)", marginBottom: "25px" };

    return (
    <div style={{ animation: "fadeIn 0.3s ease-out", paddingBottom: "50px" }}>
      {/* Encabezado Formulario */}
      <div style={{ display: "flex", alignItems: "center", marginBottom: "25px", gap: "15px" }}>
         <button onClick={() => setViewMode('list')} style={{ background: "white", border: "1px solid #eee", borderRadius: "50%", width: "40px", height: "40px", cursor: "pointer", color: "#666", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 5px rgba(0,0,0,0.05)" }}>
           <ArrowLeft size={20} />
         </button>
         <div>
           <h2 style={{ margin: 0, color: colors.secondary, fontSize: "1.6rem", fontWeight: "bold" }}>
             {formData.id ? "Editar Asignatura" : "Nueva Asignatura"}
           </h2>
           <p style={{ margin: 0, color: "#888", fontSize: "0.9rem" }}>Configuración completa de la materia.</p>
         </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "25px" }}>
        
        {/* --- TARJETA 1: Datos Básicos e Imágenes --- */}
        <div style={cardStyle}>
            <h3 style={{ color: colors.primary, marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" }}><Presentation size={20}/> Datos Generales</h3>
            
            {/* Nombre */}
            <div style={{ marginBottom: "25px" }}>
                <label style={labelStyle}>Nombre de la Asignatura</label>
                <input type="text" placeholder="Ej: Gestión de Proyectos II" value={formData.nombre} onChange={(e) => setFormData({...formData, nombre: e.target.value})} style={inputStyle} />
            </div>

            {/* Botones de Imágenes (Placeholders) */}
            <div style={{ marginBottom: "10px" }}>
                <label style={labelStyle}>Imágenes y Documentos Asociados</label>
                <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", marginTop: "15px" }}>
                    {/* Botón Foto Perfil */}
                    <div style={{ textAlign: "center" }}>
                        <button style={{ width: "70px", height: "70px", borderRadius: "20px", backgroundColor: colors.primary, border: "none", color: "white", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", position: "relative", marginBottom: "8px", boxShadow: "0 4px 10px rgba(0,184,200,0.3)" }}>
                            <ImageIcon size={28} />
                            <div style={{ position: "absolute", top: "-5px", right: "-5px", backgroundColor: "white", borderRadius: "50%", padding: "2px" }}><div style={{ backgroundColor: "#4CAF50", borderRadius: "50%", width: "16px", height: "16px", border: "2px solid white" }}></div></div>
                        </button>
                        <span style={{ fontSize: "0.8rem", color: "#666", fontWeight: "500" }}>Perfil</span>
                    </div>
                     {/* Botón Asesorías */}
                    <div style={{ textAlign: "center" }}>
                        <button style={{ width: "70px", height: "70px", borderRadius: "20px", backgroundColor: "#333", border: "none", color: "white", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", position: "relative", marginBottom: "8px" }}>
                            <BookOpen size={28} />
                             <div style={{ position: "absolute", top: "-5px", right: "-5px", backgroundColor: "white", borderRadius: "50%", padding: "2px" }}><div style={{ backgroundColor: "#4CAF50", borderRadius: "50%", width: "16px", height: "16px", border: "2px solid white" }}></div></div>
                        </button>
                         <span style={{ fontSize: "0.8rem", color: "#666", fontWeight: "500" }}>Asesorías</span>
                    </div>
                     {/* Botón Cronograma */}
                    <div style={{ textAlign: "center" }}>
                        <button style={{ width: "70px", height: "70px", borderRadius: "20px", backgroundColor: "#333", border: "none", color: "white", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", position: "relative", marginBottom: "8px" }}>
                            <Calendar size={28} />
                             <div style={{ position: "absolute", top: "-5px", right: "-5px", backgroundColor: "white", borderRadius: "50%", padding: "2px" }}><div style={{ backgroundColor: "#4CAF50", borderRadius: "50%", width: "16px", height: "16px", border: "2px solid white" }}></div></div>
                        </button>
                        <span style={{ fontSize: "0.8rem", color: "#666", fontWeight: "500" }}>Cronograma</span>
                    </div>
                </div>
                 <p style={{ fontSize: "0.8rem", color: "#999", marginTop: "10px" }}>* Funcionalidad de carga de imágenes en desarrollo.</p>
            </div>
        </div>

        {/* --- TARJETA 2: Porcentajes --- */}
        <div style={cardStyle}>
            <h3 style={{ color: colors.primary, marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" }}><Percent size={20}/> Configuración de Evaluación</h3>
            <div style={{ display: "grid", gridTemplateColumns: "100px 1fr", gap: "15px", alignItems: "end", marginBottom: "10px" }}>
                <label style={labelStyle}>Porcentaje</label>
                <label style={labelStyle}>Descripción</label>
            </div>
            {['ser', 'saber', 'saberHacer'].map((item) => (
                 <div key={item} style={{ display: "grid", gridTemplateColumns: "100px 1fr", gap: "15px", marginBottom: "15px" }}>
                    <div>
                         <label style={{...labelStyle, fontSize: "0.8rem", marginBottom: "5px", textTransform: "capitalize"}}>{item.replace(/([A-Z])/g, ' $1').trim()}</label>
                         <input type="number" placeholder="%" value={formData.porcentajes[item].valor} onChange={(e) => updateNestedState('porcentajes', item, 'valor', e.target.value)} style={inputStyle} min="0" max="100" />
                    </div>
                    <div>
                        <label style={{...labelStyle, fontSize: "0.8rem", marginBottom: "5px", visibility: "hidden"}}>Desc</label>
                        <input type="text" placeholder={`Descripción para ${item}...`} value={formData.porcentajes[item].descripcion} onChange={(e) => updateNestedState('porcentajes', item, 'descripcion', e.target.value)} style={inputStyle} />
                    </div>
                 </div>
            ))}
        </div>

         {/* --- TARJETA 3: Unidades y Notas --- */}
        <div style={cardStyle}>
            <h3 style={{ color: colors.primary, marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" }}><FileText size={20}/> Unidades y Notas</h3>
             <div style={{ display: "grid", gridTemplateColumns: "60px 100px 1fr", gap: "15px", marginBottom: "10px" }}>
                <label style={labelStyle}>Unidad</label>
                <label style={labelStyle}>Valor %</label>
                <label style={labelStyle}>Rango de Fechas</label>
            </div>
            {formData.unidades.map((unit, index) => (
                 <div key={index} style={{ display: "grid", gridTemplateColumns: "60px 100px 1fr", gap: "15px", marginBottom: "15px", alignItems: "center" }}>
                     <div style={{ fontWeight: "bold", color: "#777", textAlign: "center" }}>#{index + 1}</div>
                     <input type="number" placeholder="%" value={unit.porcentaje} onChange={(e) => updateUnitState(index, 'porcentaje', e.target.value)} style={inputStyle} min="0" max="100" />
                     <input type="text" placeholder="Ej: 8 Sept - 30 Oct" value={unit.fechas} onChange={(e) => updateUnitState(index, 'fechas', e.target.value)} style={inputStyle} />
                 </div>
            ))}

            <div style={{ marginTop: "30px" }}>
                 <label style={labelStyle}>Notas Adicionales</label>
                 <textarea placeholder="Escribe aquí condiciones especiales, requisitos de asistencia, etc." value={formData.notas} onChange={(e) => setFormData({...formData, notas: e.target.value})} style={{ ...inputStyle, height: "100px", resize: "vertical", fontFamily: "inherit" }} />
            </div>
        </div>

      </div>

      {/* Botones de Acción */}
      <div style={{ display: "flex", justifyContent: "flex-end", gap: "15px", marginTop: "30px" }}>
          <button onClick={() => setViewMode('preview')} style={{ backgroundColor: "transparent", color: "#666", padding: "12px 30px", borderRadius: "30px", border: "1px solid #ddd", fontSize: "0.95rem", fontWeight: "600", cursor: "pointer", transition: "all 0.2s" }}>
             Cancelar
          </button>
          <button onClick={handleSave} style={{ backgroundColor: colors.secondary, color: "white", padding: "12px 40px", borderRadius: "30px", border: "none", fontSize: "0.95rem", fontWeight: "600", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", boxShadow: "0 4px 15px rgba(0,126,140,0.3)" }}>
             <Save size={18} /> Guardar Asignatura
          </button>
      </div>
    </div>
    );
  };


  // ================= RENDER PRINCIPAL =================
  return (
    <>
      {viewMode === 'list' && <ListView />}
      {viewMode === 'preview' && <PreviewView />}
      {viewMode === 'form' && <SubjectForm />}
      
      <FeedbackModal 
        isOpen={modalConfig.isOpen} type={modalConfig.type} title={modalConfig.title} message={modalConfig.message} onConfirm={modalConfig.onConfirm} onCancel={modalConfig.onCancel}
      />
    </>
  );
};

export default Asignaturas;