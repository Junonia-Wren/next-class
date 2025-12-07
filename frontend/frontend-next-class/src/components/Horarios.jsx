import React, { useState, useEffect } from 'react';
import {
    Plus, Search, Edit, Trash2, ChevronDown, ArrowLeft, Save, Clock, BookOpen, MapPin
} from 'lucide-react';

import FeedbackModal from './FeedbackModal';

import GroupService from "../services/groupService";
import SubjectService from "../services/subjectService";
import ScheduleService from "../services/scheduleService";

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

export default function Horarios({ colors }) {

    const [viewMode, setViewMode] = useState("list");

    const [formData, setFormData] = useState({
        clase: "",
        subject: "",
        teacher: "",
        startTime: "",
        endTime: "",
        room: ""
    });

    const [selectedDay, setSelectedDay] = useState("Monday");

    const [groups, setGroups] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [schedules, setSchedules] = useState([]);

    const [currentItem, setCurrentItem] = useState(null);

    const [modalConfig, setModalConfig] = useState({
        isOpen: false,
        type: "success",
        title: "",
        message: "",
        onConfirm: () => {},
        onCancel: () => {}
    });

    const closeModal = () => setModalConfig((prev) => ({ ...prev, isOpen: false }));

    // Cargar datos reales
    const loadGroups = async () => {
        const res = await GroupService.getAll();
        setGroups(res.data.data || []);
    };

    const loadSubjects = async () => {
        const res = await SubjectService.getAll();
        setSubjects(res.data.data || []);
    };

    const loadSchedules = async () => {
        const res = await ScheduleService.getAll();
        setSchedules(res.data.data || []);
    };

    useEffect(() => {
        loadGroups();
        loadSubjects();
        loadSchedules();
    }, []);

    // Al escoger asignatura, automáticamente asignamos maestro
    const onSubjectChange = (subjectId) => {
        const subject = subjects.find(s => s._id === subjectId);

        setFormData({
            ...formData,
            subject: subjectId,
            teacher: subject ? subject.teacher : ""
        });
    };

    // CREAR HORARIO
    const handleSave = async () => {
        try {
            const payload = {
                group: formData.clase,
                subject: formData.subject,
                teacher: formData.teacher, 
                day: selectedDay,
                startTime: formData.startTime,
                endTime: formData.endTime,
                classroom: formData.room
            };

            await ScheduleService.insert(payload);
            await loadSchedules();

            setModalConfig({
                isOpen: true,
                type: "success",
                title: "¡Horario creado!",
                message: "El horario se registró correctamente.",
                onConfirm: () => {
                    closeModal();
                    setViewMode("list");
                }
            });

        } catch (err) {
            console.log(err);
        }
    };

    // ELIMINAR HORARIO
    const handleDeleteRequest = (item) => {
        setCurrentItem(item);
        setModalConfig({
            isOpen: true,
            type: "danger",
            title: "¿Eliminar horario?",
            message: `Estás a punto de borrar el horario del grupo ${item.group.name}.`,
            onCancel: closeModal,
            onConfirm: () => confirmDelete()
        });
    };

    const confirmDelete = async () => {
        try {
            await ScheduleService.delete(currentItem._id);
            await loadSchedules();

            setModalConfig({
                isOpen: true,
                type: 'deleteSuccess',
                title: 'Horario eliminado',
                message: 'El horario fue eliminado correctamente.',
                onConfirm: closeModal
            });
        } catch (err) {
            console.log(err);
        }
    };

    // FORMULARIO
    const ScheduleForm = () => (
        <div style={{ animation: "fadeIn .3s ease-out" }}>

            {/* HEADER FORM */}
            <div style={{ display:"flex", alignItems:"center", marginBottom:"25px", gap:"15px" }}>
                <button
                    onClick={() => setViewMode("list")}
                    style={{
                        background:"white", border:"1px solid #eee",
                        borderRadius:"50%", width:"40px", height:"40px",
                        cursor:"pointer", display:"flex",
                        alignItems:"center", justifyContent:"center"
                    }}>
                    <ArrowLeft size={20}/>
                </button>

                <div>
                    <h2 style={{ margin:0, color:colors.secondary, fontSize:"1.6rem", fontWeight:"bold" }}>
                        Nuevo Horario
                    </h2>
                </div>
            </div>

            {/* SELECT GRUPO */}
            <div style={{
                background:"white", padding:"20px",
                borderRadius:"20px", boxShadow:"0 5px 15px rgba(0,0,0,0.03)"
            }}>
                <label style={{ fontWeight:"600", color:"#555" }}>Selecciona el Grupo</label>
                <div style={{ position:"relative", maxWidth:"400px" }}>
                    <select
                        value={formData.clase}
                        onChange={(e) => setFormData({ ...formData, clase: e.target.value })}
                        style={{
                            width:"100%", padding:"12px 20px", marginTop:"10px",
                            borderRadius:"12px", border:"1px solid #ddd",
                            background:"#F9FAFB", fontWeight:"500"
                        }}>
                        <option value="">-- Seleccionar Grupo --</option>
                        {groups.map((g) => (
                            <option key={g._id} value={g._id}>
                                {g.name} · {g.area}
                            </option>
                        ))}
                    </select>
                    <ChevronDown size={18} style={{ position:"absolute", right:"15px", top:"50%", transform:"translateY(-50%)" }}/>
                </div>
            </div>

            {/* SELECT ASIGNATURA (Y MAESTRO AUTOMÁTICO) */}
            <div style={{
                marginTop:"20px", background:"white", padding:"20px",
                borderRadius:"20px", boxShadow:"0 5px 15px rgba(0,0,0,0.03)"
            }}>
                <label style={{ fontWeight:"600", color:"#555" }}>Selecciona la Asignatura</label>
                <div style={{ position:"relative", maxWidth:"400px" }}>
                    <select
                        value={formData.subject}
                        onChange={(e) => onSubjectChange(e.target.value)}
                        style={{
                            width:"100%", padding:"12px 20px", marginTop:"10px",
                            borderRadius:"12px", border:"1px solid #ddd",
                            background:"#F9FAFB", fontWeight:"500"
                        }}>
                        <option value="">-- Seleccionar Asignatura --</option>
                        {subjects.map((s) => (
                            <option key={s._id} value={s._id}>
                                {s.name} — {s.teacher}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* DÍA Y HORAS */}
            <div style={{
                marginTop:"20px", background:"white", padding:"20px",
                borderRadius:"20px", boxShadow:"0 5px 15px rgba(0,0,0,0.03)"
            }}>
                <h3 style={{ marginBottom:"10px", color:colors.secondary }}>Día y Horario</h3>

                <select
                    value={selectedDay}
                    onChange={(e) => setSelectedDay(e.target.value)}
                    style={{ padding:"10px", borderRadius:"10px", border:"1px solid #ddd", marginBottom:"10px" }}>
                    {daysOfWeek.map((day) => (
                        <option key={day} value={day}>{day}</option>
                    ))}
                </select>

                <div style={{ display:"flex", gap:"20px", marginTop:"10px" }}>
                    <input
                        type="time"
                        value={formData.startTime}
                        onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                        style={{ padding:"10px", borderRadius:"10px", border:"1px solid #ddd" }}
                    />

                    <input
                        type="time"
                        value={formData.endTime}
                        onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                        style={{ padding:"10px", borderRadius:"10px", border:"1px solid #ddd" }}
                    />
                </div>

                <input
                    type="text"
                    placeholder="Salón"
                    value={formData.room}
                    onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                    style={{ marginTop:"10px", padding:"10px", borderRadius:"10px", border:"1px solid #ddd", width:"100%" }}
                />
            </div>

            {/* BOTÓN GUARDAR */}
            <div style={{ display:"flex", justifyContent:"flex-end", marginTop:"25px" }}>
                <button
                    onClick={handleSave}
                    style={{
                        backgroundColor: colors.secondary,
                        color:"white",
                        padding:"12px 40px",
                        borderRadius:"30px",
                        border:"none",
                        cursor:"pointer",
                        fontWeight:"600"
                    }}>
                    <Save size={18}/> Guardar Horario
                </button>
            </div>
        </div>
    );

    // LISTA DE HORARIOS
    const ListView = () => (
        <div style={{ animation:"fadeIn .3s ease-out" }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'30px' }}>
                <div>
                    <h1 style={{ color:colors.secondary, fontSize:"1.8rem", fontWeight:"bold" }}>Gestión de Horarios</h1>
                    <p style={{ color:"#888" }}>Administra clases asignadas a cada grupo.</p>
                </div>

                <button
                    onClick={() => setViewMode("form")}
                    style={{
                        backgroundColor:colors.primary,
                        color:"white",
                        padding:"10px 25px",
                        borderRadius:"50px",
                        border:"none",
                        display:"flex",
                        alignItems:"center",
                        gap:"8px",
                        fontWeight:"bold",
                        cursor:"pointer"
                    }}>
                    <Plus size={20}/> Nuevo Horario
                </button>
            </div>

            {/* TABLA */}
            <div style={{
                background:"white",
                borderRadius:"20px",
                boxShadow:"0 5px 20px rgba(0,0,0,0.03)",
                overflow:"hidden"
            }}>
                <table style={{ width:"100%", borderCollapse:"collapse" }}>
                    <thead>
                        <tr style={{ background:"#F8F9FA", textAlign:"left", color:"#666" }}>
                            <th style={{ padding:"20px" }}>Nivel</th>
                            <th style={{ padding:"20px" }}>Área</th>
                            <th style={{ padding:"20px" }}>Grupo</th>
                            <th style={{ padding:"20px" }}>Materia</th>
                            <th style={{ padding:"20px" }}>Maestro</th>
                            <th style={{ padding:"20px" }}>Día</th>
                            <th style={{ padding:"20px" }}>Inicio</th>
                            <th style={{ padding:"20px" }}>Fin</th>
                            <th style={{ padding:"20px", textAlign:"right" }}>Acciones</th>
                        </tr>
                    </thead>

                    <tbody>
                        {schedules.map((item) => (
                            <tr key={item._id} style={{ borderBottom:"1px solid #eee" }}>
                                <td style={{ padding:"20px" }}>{item.group.level}</td>
                                <td style={{ padding:"20px" }}>{item.group.area}</td>
                                <td style={{ padding:"20px", fontWeight:"bold", color:colors.secondary }}>{item.group.name}</td>
                                <td style={{ padding:"20px" }}>{item.subject.name}</td>
                                <td style={{ padding:"20px" }}>{item.subject.teacher}</td>
                                <td style={{ padding:"20px" }}>{item.day}</td>
                                <td style={{ padding:"20px" }}>{item.startTime}</td>
                                <td style={{ padding:"20px" }}>{item.endTime}</td>

                                <td style={{ padding:"20px", textAlign:"right" }}>
                                    <button
                                        onClick={() => setViewMode("form")}
                                        style={{ background:"#E0F7FA", border:"none", padding:"8px", borderRadius:"8px", marginRight:"10px", cursor:"pointer" }}>
                                        <Edit size={18}/>
                                    </button>

                                    <button
                                        onClick={() => handleDeleteRequest(item)}
                                        style={{ background:"#FFEBEE", border:"none", padding:"8px", borderRadius:"8px", cursor:"pointer", color:"#D32F2F" }}>
                                        <Trash2 size={18}/>
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
            {viewMode === "list" ? <ListView/> : <ScheduleForm/>}

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
}
