import React, { useState, useEffect } from 'react';

import {
  Plus, Search, Edit, Trash2, ChevronDown, ArrowLeft, Save, Clock, BookOpen, MapPin
} from 'lucide-react';
import FeedbackModal from './FeedbackModal'; // <--- IMPORTANTE: Importar el modal

import GroupService from "../services/groupService";
import SubjectService from "../services/subjectService";
import AdminService from "../services/adminService";
import ScheduleService from "../services/scheduleService";

// --- DATOS DE EJEMPLO ---
const mockClases = ["10A - Ing. Software", "4B - Diseño", "2A - Mercadotecnia"];
const mockAsignaturas = ["Matemáticas", "Inglés", "Programación", "Base de Datos", "Diseño UI", "Redes"];
const mockSalones = ["101", "102", "Lab 1", "Lab 2", "Auditorio"];
const timeSlots = [
  "7:00 - 8:00", "8:00 - 9:00", "9:00 - 10:00", "10:00 - 11:00",
  "11:00 - 12:00", "12:30 - 13:30", "13:30 - 14:30", "14:30 - 15:30", "15:30 - 16:30", "16:30 - 17:30", "17:30 - 18:30", "18:30 - 19:30"
];
const daysOfWeek = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];

const Horarios = ({ colors }) => {
  const [viewMode, setViewMode] = useState('list');
  const [selectedDay, setSelectedDay] = useState("Lunes");
  const [formData, setFormData] = useState({ clase: "" });

  const [groups, setGroups] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [editingSchedule, setEditingSchedule] = useState(null);

  // estructura para cada bloque horario (subject, teacher, salon)
  const [slotsData, setSlotsData] = useState(
    timeSlots.map(() => ({
      subject: "",
      teacher: "",
      classroom: ""
    }))
  );



  // --- ESTADOS PARA EL MODAL ---
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    type: 'success', // 'success', 'danger', 'deleteSuccess'
    title: '',
    message: '',
    onConfirm: () => { },
    onCancel: () => { } // Solo para confirmación de borrado
  });

  // Función auxiliar para cerrar modal
  const closeModal = () => setModalConfig({ ...modalConfig, isOpen: false });

  const mapDayToEN = {
    "Lunes": "Monday",
    "Martes": "Tuesday",
    "Miércoles": "Wednesday",
    "Jueves": "Thursday",
    "Viernes": "Friday"
  };

  const mapDayToES = {
    Monday: "Lunes",
    Tuesday: "Martes",
    Wednesday: "Miércoles",
    Thursday: "Jueves",
    Friday: "Viernes"
  };

  // 1. Manejar GUARDAR (Crear/Editar)
  const handleSave = async () => {
    try {
      const dayEN = mapDayToEN[selectedDay];

      // Encuentra el bloque usado (solo 1 horario por registro)
      const slotIndex = slotsData.findIndex(
        (s) => s.subject || s.teacher || s.classroom
      );

      if (slotIndex === -1) {
        return setModalConfig({
          isOpen: true,
          type: "danger",
          title: "Campos incompletos",
          message: "Selecciona al menos un horario.",
          onConfirm: closeModal
        });
      }

      const [startTime, endTime] = timeSlots[slotIndex].split(" - ");

      const payload = {
        group: formData.clase,
        subject: slotsData[slotIndex].subject,
        teacher: slotsData[slotIndex].teacher,
        classroom: slotsData[slotIndex].classroom,
        day: dayEN,
        startTime,
        endTime
      };

      if (editingSchedule) {
        await ScheduleService.update(editingSchedule, payload);
      } else {
        await ScheduleService.insert(payload);
      }

      setModalConfig({
        isOpen: true,
        type: "success",
        title: "Horario guardado",
        message: "El horario se guardó correctamente.",
        onConfirm: () => {
          closeModal();
          setEditingSchedule(null);
          loadInitialData();
          setViewMode("list");
        }
      });
    } catch (error) {
      setModalConfig({
        isOpen: true,
        type: "danger",
        title: "Error al guardar",
        message: "Hubo un problema al guardar.",
        onConfirm: closeModal
      });
    }
  };



  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      const resGroups = await GroupService.getAll();
      const resSubjects = await SubjectService.getAll();
      const resTeachers = await AdminService.getTeachers();
      const resSchedules = await ScheduleService.getAll();

      setGroups(resGroups.data.data);
      setSubjects(resSubjects.data.data);
      setTeachers(resTeachers.data.data);
      setSchedules(resSchedules.data.data);

    } catch (error) {
      console.error("Error cargando datos iniciales:", error);
    }
  };

  // 2. Manejar PRE-BORRADO (Preguntar confirmación)
  const handleDeleteRequest = (item) => {
    setModalConfig({
      isOpen: true,
      type: 'danger',
      title: '¿Eliminar Horario?',
      message: `Estás a punto de borrar el horario de ${item.grupo}. Esta acción no se puede deshacer.`,
      onCancel: closeModal,
      onConfirm: () => confirmDelete() // Llamamos a la función que realmente borra
    });
  };



  const handleSlotChange = (index, field, value) => {
    const updated = [...slotsData];
    updated[index][field] = value;
    setSlotsData(updated);
  };


  // 3. Manejar BORRADO CONFIRMADO
  const confirmDelete = () => {
    // Aquí lógica de backend para borrar...

    // Cambiamos el modal a "Borrado Exitoso"
    setModalConfig({
      isOpen: true,
      type: 'deleteSuccess', // Usamos el icono de basura pero estilo éxito
      title: '¡Borrado Exitoso!',
      message: 'Ya se eliminó el horario correctamente.',
      onConfirm: closeModal
    });
  };

  const handleEdit = async (item) => {
    try {
      const res = await ScheduleService.getOne(item._id);
      const data = res.data.data;

      setEditingSchedule(data._id);

      // Grupo asignado
      setFormData({ clase: data.group._id });

      // Convertir día
      setSelectedDay(mapDayToES[data.day]);

      // Convertir horario único al slot correcto
      const updatedSlots = timeSlots.map((slot, index) => {
        const [slotStart, slotEnd] = slot.split(" - ");

        if (slotStart === data.startTime && slotEnd === data.endTime) {
          return {
            subject: data.subject._id,
            teacher: data.teacher._id,
            classroom: data.classroom
          };
        }
        return { subject: "", teacher: "", classroom: "" };
      });

      setSlotsData(updatedSlots);

      setViewMode("form");
    } catch (error) {
      console.error("Error al cargar horario:", error);
    }
  };



  const handleCreate = () => {
    setFormData({ clase: "" });
    setViewMode('form');
  };

  // --- Sub-componente: Formulario ---
  const ScheduleForm = () => (
    <div style={{ animation: "fadeIn 0.3s ease-out" }}>

      {/* ENCABEZADO */}
      <div style={{ display: "flex", alignItems: "center", marginBottom: "25px", gap: "15px" }}>
        <button onClick={() => { setViewMode('list'); setEditingSchedule(null); }}
          style={{ background: "white", border: "1px solid #eee", borderRadius: "50%", width: "40px", height: "40px" }}>
          <ArrowLeft size={20} />
        </button>

        <div>
          <h2 style={{ margin: 0, color: colors.secondary }}>
            {editingSchedule ? "Editar Horario" : "Nuevo Horario"}
          </h2>
        </div>
      </div>

      {/* SELECT GRUPO */}
      <div style={{ background: "white", padding: 20, borderRadius: 15, marginBottom: 20 }}>
        <label>Grupo</label>
        <select
          value={formData.clase}
          onChange={(e) => setFormData({ ...formData, clase: e.target.value })}
        >
          <option value="">Selecciona un grupo</option>
          {groups.map((g) => (
            <option key={g._id} value={g._id}>{g.name}</option>
          ))}
        </select>
      </div>

      {/* DIAS */}
      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        {daysOfWeek.map((d) => (
          <button key={d}
            onClick={() => setSelectedDay(d)}
            style={{
              padding: 10,
              borderRadius: 10,
              background: selectedDay === d ? colors.primary : "white",
              color: selectedDay === d ? "white" : "#888"
            }} >
            {d}
          </button>
        ))}
      </div>

      {/* BLOQUES DE HORARIO */}
      <div style={{ background: "white", padding: 20, borderRadius: 15 }}>

        {timeSlots.map((slot, index) => (
          <div key={index} style={{ display: "grid", gridTemplateColumns: "120px 1fr 1fr 1fr", gap: 10, marginBottom: 15 }}>

            {/* HORA */}
            <div>{slot}</div>

            {/* MATERIA */}
            <select
              value={slotsData[index].subject}
              onChange={(e) => handleSlotChange(index, "subject", e.target.value)}
            >
              <option value="">Materia</option>
              {subjects.map((s) => (
                <option key={s._id} value={s._id}>{s.name}</option>
              ))}
            </select>

            {/* DOCENTE */}
            <select
              value={slotsData[index].teacher}
              onChange={(e) => handleSlotChange(index, "teacher", e.target.value)}
            >
              <option value="">Docente</option>
              {teachers.map((t) => (
                <option key={t._id} value={t._id}>{t.name}</option>
              ))}
            </select>

            {/* SALÓN */}
            <input
              type="text"
              placeholder="Salón"
              value={slotsData[index].classroom}
              onChange={(e) => handleSlotChange(index, "classroom", e.target.value)}
            />
          </div>
        ))}

      </div>

      {/* BOTONES */}
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 15, marginTop: 20 }}>
        <button onClick={() => setViewMode('list')}>Cancelar</button>
        <button onClick={handleSave} style={{ background: colors.secondary, color: "white" }}>
          Guardar
        </button>
      </div>

    </div>
  );


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

      <div style={{ marginBottom: "25px", position: "relative", maxWidth: "500px" }}>
        <Search size={20} style={{ position: "absolute", left: "20px", top: "50%", transform: "translateY(-50%)", color: "#aaa" }} />
        <input type="text" placeholder="Buscar..." style={{ width: "100%", padding: "15px 15px 15px 50px", borderRadius: "50px", border: "1px solid #eee", backgroundColor: "white", outline: "none" }} />
      </div>

      <div style={{ backgroundColor: "white", borderRadius: "20px", boxShadow: "0 5px 20px rgba(0,0,0,0.03)", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: "#F8F9FA", color: "#666", textAlign: "left", fontSize: "0.9rem", textTransform: "uppercase" }}>
              <th style={{ padding: "20px 25px" }}>Nivel</th>
              <th style={{ padding: "20px 25px" }}>Área</th>
              <th style={{ padding: "20px 25px" }}>Grupo</th>
              <th style={{ padding: "20px 25px", textAlign: "right" }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {schedules.map((item) => (
              <tr key={item._id}>
                <td style={{ padding: "20px 25px" }}>{item.group.level}</td>
                <td style={{ padding: "20px 25px" }}>{item.group.area}</td>
                <td style={{ padding: "20px 25px", fontWeight: "600", color: colors.secondary }}>
                  {item.group.name}
                </td>

                <td style={{ padding: "20px 25px", textAlign: "right" }}>
                  <button onClick={() => handleEdit(item)} style={{ marginRight: 10 }}>
                    <Edit size={18} />
                  </button>
                  <button onClick={() => handleDeleteRequest(item)}>
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
      {viewMode === 'list' ? <ListView /> : <ScheduleForm />}

      {/* RENDERIZADO DEL MODAL */}
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