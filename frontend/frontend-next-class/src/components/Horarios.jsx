import React, { useState, useEffect } from 'react';
import { 
  Plus, Search, Edit, Trash2, ChevronDown, ArrowLeft, Save, Clock, BookOpen, MapPin 
} from 'lucide-react';
import FeedbackModal from './FeedBackModal'; 

// Importamos TODOS los servicios necesarios
import ScheduleService from '../services/scheduleService';
import GroupService from '../services/groupService';
import SubjectService from '../services/subjectService';

// --- CONSTANTES ---
const timeSlots = [
  "7:00 - 8:00", "8:00 - 9:00", "9:00 - 10:00", "10:00 - 11:00", 
  "11:00 - 12:00", "12:30 - 13:30", "13:30 - 14:30", "14:30 - 15:30", 
  "15:30 - 16:30", "16:30 - 17:30", "17:30 - 18:30", "18:30 - 19:30" 
];
const daysOfWeek = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];
const mockSalones = ["101", "102", "Lab 1", "Lab 2", "Auditorio", "Virtual"];

const Horarios = ({ colors = { primary: "#00B8C8", secondary: "#007E8C" } }) => {
  const [viewMode, setViewMode] = useState('list'); 
  const [selectedDay, setSelectedDay] = useState("Lunes");
  
  // --- ESTADOS DE DATOS ---
  const [schedulesList, setSchedulesList] = useState([]); // Lista de horarios creados
  const [groupsList, setGroupsList] = useState([]);       // Catálogo de grupos (BD)
  const [subjectsList, setSubjectsList] = useState([]);   // Catálogo de materias (BD)

  // --- ESTADO DEL FORMULARIO (COMPLEJO) ---
  // Guardamos el ID del horario (si es edición) y el ID del grupo seleccionado
  const [formMeta, setFormMeta] = useState({ scheduleId: null, groupId: "" });
  
  // Matriz de Horario: { Lunes: [ { time, subject, classroom }... ], Martes: ... }
  const [scheduleMatrix, setScheduleMatrix] = useState({});

  // Config Modal
  const [modalConfig, setModalConfig] = useState({
    isOpen: false, type: 'success', title: '', message: '', onConfirm: () => {}, onCancel: () => {}
  });

  // --- 1. CARGA INICIAL DE CATÁLOGOS ---
  useEffect(() => {
    loadCatalogs();
    loadSchedules();
  }, []);

  const loadCatalogs = async () => {
    try {
        const [groupsRes, subjectsRes] = await Promise.all([
            GroupService.getAll(),
            SubjectService.getAll()
        ]);
        setGroupsList(groupsRes.data.data || []);
        setSubjectsList(subjectsRes.data.data || []); // Ojo: Verifica si subjectService devuelve .data o .data.data
    } catch (error) {
        console.error("Error cargando catálogos", error);
    }
  };

  const loadSchedules = async () => {
      try {
          const res = await ScheduleService.getAll();
          setSchedulesList(res.data.data || []);
      } catch (error) {
          console.error("Error cargando horarios", error);
      }
  };

  // --- 2. INICIALIZAR MATRIZ VACÍA ---
  const getEmptyMatrix = () => {
      const matrix = {};
      daysOfWeek.forEach(day => {
          matrix[day] = timeSlots.map(time => ({
              time,
              subject: "", // ID de la materia
              classroom: "" // Nombre del salón
          }));
      });
      return matrix;
  };

  // --- HELPERS ---
  const closeModal = () => setModalConfig({ ...modalConfig, isOpen: false });

  // --- MANEJADORES DE VISTA ---
  const handleCreate = () => {
      setFormMeta({ scheduleId: null, groupId: "" });
      setScheduleMatrix(getEmptyMatrix());
      setViewMode('form');
  };

  const handleEdit = (item) => {
      // item es el objeto schedule completo que viene del getAll (con populate)
      setFormMeta({ scheduleId: item._id, groupId: item.group._id });
      
      // Reconstruimos la matriz con los datos existentes
      const newMatrix = getEmptyMatrix();
      
      // Mapeamos lo que viene de la BD a la estructura visual
      daysOfWeek.forEach(day => {
          if (item.schedule && item.schedule[day]) {
              item.schedule[day].forEach(slot => {
                  // Buscamos el índice correspondiente a la hora
                  const index = newMatrix[day].findIndex(s => s.time === slot.time);
                  if (index !== -1) {
                      newMatrix[day][index] = {
                          time: slot.time,
                          subject: slot.subject ? slot.subject._id : "", // Guardamos solo el ID
                          classroom: slot.classroom || ""
                      };
                  }
              });
          }
      });

      setScheduleMatrix(newMatrix);
      setViewMode('form');
  };

  // --- MANEJO DE CAMBIOS EN LA MATRIZ (INPUTS) ---
  const handleSlotChange = (day, index, field, value) => {
      setScheduleMatrix(prev => {
          const daySlots = [...prev[day]];
          daySlots[index] = { ...daySlots[index], [field]: value };
          return { ...prev, [day]: daySlots };
      });
  };

  // --- 3. GUARDAR (INSERT / UPDATE) ---
  const handleSave = async () => {
      if (!formMeta.groupId) return alert("Debes seleccionar un Grupo.");

      // Limpiamos la matriz para enviar al backend
      // Convertimos los strings vacíos de subject a null para que no falle el ObjectId
      const cleanSchedule = {};
      daysOfWeek.forEach(day => {
          cleanSchedule[day] = scheduleMatrix[day].map(slot => ({
              time: slot.time,
              subject: slot.subject === "" ? null : slot.subject,
              classroom: slot.classroom
          }));
      });

      const payload = {
          group: formMeta.groupId,
          schedule: cleanSchedule
      };

      try {
          if (formMeta.scheduleId) {
              // UPDATE
              await ScheduleService.update(formMeta.scheduleId, payload);
              setModalConfig({
                  isOpen: true, type: 'success', title: '¡Actualizado!',
                  message: 'Horario modificado correctamente.',
                  onConfirm: () => { closeModal(); loadSchedules(); setViewMode('list'); }
              });
          } else {
              // INSERT
              await ScheduleService.create(payload);
              setModalConfig({
                  isOpen: true, type: 'success', title: '¡Creado!',
                  message: 'Horario asignado correctamente.',
                  onConfirm: () => { closeModal(); loadSchedules(); setViewMode('list'); }
              });
          }
      } catch (error) {
          console.error(error);
          alert(error.response?.data?.message || "Error al guardar horario.");
      }
  };

  // --- 4. BORRAR ---
  const handleDeleteRequest = (item) => {
    setModalConfig({
      isOpen: true, type: 'danger', title: '¿Eliminar Horario?',
      message: `Se eliminará el horario del grupo ${item.group?.name || 'seleccionado'}.`,
      onCancel: closeModal,
      onConfirm: async () => {
          try {
              await ScheduleService.delete(item._id);
              setModalConfig({
                  isOpen: true, type: 'deleteSuccess', title: '¡Eliminado!',
                  message: 'Horario eliminado.',
                  onConfirm: () => { closeModal(); loadSchedules(); }
              });
          } catch (error) {
              alert("Error al eliminar");
          }
      }
    });
  };

  // ================= VISTAS =================

  const ListView = () => (
    <div style={{ animation: "fadeIn 0.3s ease-out" }}>
        <div style={{ marginBottom: "30px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <h1 style={{ color: colors.secondary, margin: "0 0 5px 0", fontSize: "1.8rem", fontWeight: "bold" }}>Gestión de Horarios</h1>
              <p style={{ color: "#888", margin: 0 }}>Administra y asigna clases a los grupos.</p>
            </div>
            <button onClick={handleCreate} style={{ backgroundColor: colors.primary, color: "white", border: "none", padding: "10px 25px", borderRadius: "50px", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", fontWeight: "bold", boxShadow: "0 4px 15px rgba(0,184,200,0.3)" }}>
              <Plus size={20} /> Nuevo Horario
            </button>
        </div>

        <div style={{ backgroundColor: "white", borderRadius: "20px", boxShadow: "0 5px 20px rgba(0,0,0,0.03)", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ backgroundColor: "#F8F9FA", color: "#666", textAlign: "left", fontSize: "0.9rem", textTransform: "uppercase" }}>
                <th style={{ padding: "20px 25px" }}>Grupo</th>
                <th style={{ padding: "20px 25px" }}>Nivel</th>
                <th style={{ padding: "20px 25px" }}>Área</th>
                <th style={{ padding: "20px 25px", textAlign: "right" }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {schedulesList.length === 0 ? (
                  <tr><td colSpan="4" style={{padding:"30px", textAlign:"center", color:"#999"}}>No hay horarios creados.</td></tr>
              ) : (
                  schedulesList.map((item) => (
                    <tr key={item._id} style={{ borderBottom: "1px solid #f0f0f0" }}>
                      <td style={{ padding: "20px 25px", color: colors.secondary, fontWeight: "600", fontSize: "1.1rem" }}>
                          {item.group?.name || "Sin Grupo"}
                      </td>
                      <td style={{ padding: "20px 25px", color: "#333" }}>{item.group?.level}</td>
                      <td style={{ padding: "20px 25px", color: "#666" }}>{item.group?.area}</td>
                      <td style={{ padding: "20px 25px", textAlign: "right" }}>
                        <button onClick={() => handleEdit(item)} style={{ background: "#E0F7FA", border: "none", cursor: "pointer", color: colors.secondary, padding: "8px", borderRadius: "8px", marginRight: "10px" }} title="Editar">
                          <Edit size={18} />
                        </button>
                        <button onClick={() => handleDeleteRequest(item)} style={{ background: "#FFEBEE", border: "none", cursor: "pointer", color: "#D32F2F", padding: "8px", borderRadius: "8px" }} title="Eliminar">
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
              )}
            </tbody>
          </table>
        </div>
    </div>
  );

  const ScheduleForm = () => (
    <div style={{ animation: "fadeIn 0.3s ease-out" }}>
      <div style={{ display: "flex", alignItems: "center", marginBottom: "25px", gap: "15px" }}>
         <button onClick={() => setViewMode('list')} style={{ background: "white", border: "1px solid #eee", borderRadius: "50%", width: "40px", height: "40px", cursor: "pointer", color: "#666", display: "flex", alignItems: "center", justifyContent: "center" }}>
           <ArrowLeft size={20} />
         </button>
         <div>
           <h2 style={{ margin: 0, color: colors.secondary, fontSize: "1.6rem", fontWeight: "bold" }}>
             {formMeta.scheduleId ? "Editar Horario" : "Nuevo Horario"}
           </h2>
           <p style={{ margin: 0, color: "#888", fontSize: "0.9rem" }}>Gestión de bloques horarios.</p>
         </div>
      </div>

      <div style={{ backgroundColor: "white", padding: "20px", borderRadius: "20px", boxShadow: "0 5px 15px rgba(0,0,0,0.03)", marginBottom: "20px" }}>
         <label style={{ display: "block", marginBottom: "10px", fontWeight: "600", color: "#555" }}>Selecciona el Grupo</label>
         <div style={{ position: "relative", maxWidth: "400px" }}>
            <select 
                value={formMeta.groupId} 
                onChange={(e) => setFormMeta({...formMeta, groupId: e.target.value})} 
                disabled={!!formMeta.scheduleId} // No se puede cambiar el grupo al editar
                style={{ width: "100%", appearance: "none", backgroundColor: "#F9FAFB", border: "1px solid #ddd", color: "#333", padding: "12px 20px", borderRadius: "12px", fontSize: "1rem", outline: "none", cursor: "pointer", fontWeight: "500" }}
            >
              <option value="">-- Seleccionar Grupo --</option>
              {groupsList.map((g) => (
                  <option key={g.id} value={g.id}>{g.nivel} - {g.grupo} ({g.area})</option>
              ))}
            </select>
            <ChevronDown size={18} color="#666" style={{ position: "absolute", right: "15px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
         </div>
      </div>

      {/* SELECTOR DE DÍAS */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px", overflowX: "auto", paddingBottom: "5px" }}>
         {daysOfWeek.map((day) => (
           <button key={day} onClick={() => setSelectedDay(day)} style={{ flex: 1, padding: "12px", borderRadius: "12px", border: "none", backgroundColor: selectedDay === day ? colors.primary : "white", color: selectedDay === day ? "white" : "#666", fontSize: "0.95rem", fontWeight: "600", cursor: "pointer", transition: "all 0.2s", boxShadow: selectedDay === day ? "0 4px 12px rgba(0,184,200,0.4)" : "0 2px 5px rgba(0,0,0,0.02)", minWidth: "100px" }}>{day}</button>
         ))}
      </div>

      {/* MATRIZ DE HORAS (Filtrada por día seleccionado) */}
      <div style={{ backgroundColor: "white", borderRadius: "20px", padding: "25px", boxShadow: "0 5px 20px rgba(0,0,0,0.03)" }}>
         <div style={{ display: "grid", gridTemplateColumns: "100px 1fr 1fr", gap: "20px", marginBottom: "15px", borderBottom: "1px solid #eee", paddingBottom: "10px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "5px", color: colors.secondary, fontWeight: "600" }}><Clock size={16} /> <span style={{fontSize: "0.9rem"}}>Hora</span></div>
            <div style={{ display: "flex", alignItems: "center", gap: "5px", color: colors.secondary, fontWeight: "600" }}><BookOpen size={16} /> <span style={{fontSize: "0.9rem"}}>Asignatura</span></div>
            <div style={{ display: "flex", alignItems: "center", gap: "5px", color: colors.secondary, fontWeight: "600" }}><MapPin size={16} /> <span style={{fontSize: "0.9rem"}}>Salón</span></div>
         </div>
         
         <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            {scheduleMatrix[selectedDay] && scheduleMatrix[selectedDay].map((slot, index) => (
              <div key={index} style={{ display: "grid", gridTemplateColumns: "100px 1fr 1fr", gap: "20px", alignItems: "center" }}>
                 <div style={{ fontSize: "0.85rem", color: "#888", fontWeight: "600", backgroundColor: "#F5F8FA", padding: "8px", borderRadius: "8px", textAlign: "center" }}>{slot.time.replace(" ", "")}</div>
                 
                 {/* SELECTOR DE ASIGNATURA */}
                 <div style={{ position: "relative" }}>
                    <select 
                        value={slot.subject} 
                        onChange={(e) => handleSlotChange(selectedDay, index, 'subject', e.target.value)}
                        style={{ width: "100%", appearance: "none", backgroundColor: "white", border: `1px solid ${colors.primary}`, color: "#444", padding: "10px 15px", borderRadius: "10px", fontSize: "0.9rem", outline: "none", cursor: "pointer" }}
                    >
                       <option value="">-- Libre --</option>
                       {subjectsList.map((subj) => (
                           <option key={subj.id} value={subj.id}>{subj.nombre} - {subj.teacherName}</option>
                       ))}
                    </select>
                 </div>

                 {/* SELECTOR DE SALÓN */}
                 <div style={{ position: "relative" }}>
                    <select 
                        value={slot.classroom}
                        onChange={(e) => handleSlotChange(selectedDay, index, 'classroom', e.target.value)}
                        style={{ width: "100%", appearance: "none", backgroundColor: "white", border: "1px solid #8D2745", color: "#444", padding: "10px 15px", borderRadius: "10px", fontSize: "0.9rem", outline: "none", cursor: "pointer" }}
                    >
                       <option value="">-- S --</option>
                       {mockSalones.map((s, i) => <option key={i} value={s}>{s}</option>)}
                    </select>
                 </div>
              </div>
            ))}
         </div>
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end", gap: "15px", marginTop: "30px", paddingBottom: "20px" }}>
          <button onClick={() => setViewMode('list')} style={{ backgroundColor: "transparent", color: "#666", padding: "12px 30px", borderRadius: "30px", border: "1px solid #ddd", fontSize: "0.95rem", fontWeight: "600", cursor: "pointer" }}>Cancelar</button>
          
          <button onClick={handleSave} style={{ backgroundColor: colors.secondary, color: "white", padding: "12px 40px", borderRadius: "30px", border: "none", fontSize: "0.95rem", fontWeight: "600", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", boxShadow: "0 4px 15px rgba(0,126,140,0.3)" }}>
             <Save size={18} /> Guardar Horario
          </button>
      </div>
    </div>
  );

  return (
    <>
      {viewMode === 'list' ? <ListView /> : <ScheduleForm />}
      
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

export default Horarios;