import React, { useState, useEffect } from "react";
import ModalTarea from "../components/ModalTarea";
import Calendario from "../components/Calendario"; 
import BottomNav from "../components/BottomNav";
import TaskService from "../services/taskService";
import ScheduleService from "../services/scheduleService";
import garra from "../assets/garra.png";
import { Plus, Trash2, CheckCircle, Circle, Book, Calendar as CalIcon } from "lucide-react";
import { getSocket } from "../services/socket";

export default function TareasPage() {
    const [esJefe, setEsJefe] = useState(false);
    const [materias, setMaterias] = useState([]); 
    const [tareas, setTareas] = useState([]); 
    
    // Estado visual
    const [materiaAbierta, setMateriaAbierta] = useState(null); 
    const [modalOpen, setModalOpen] = useState(false);
    const [materiaParaNuevaTarea, setMateriaParaNuevaTarea] = useState(null);

    const parseJwt = (token) => {
        try { return JSON.parse(atob(token.split('.')[1])); } catch (e) { return null; }
    };

    useEffect(() => {
        const init = async () => {
            try {
                const token = sessionStorage.getItem("authToken");
                if (token) {
                    const payload = parseJwt(token);
                    setEsJefe(payload.role === 'chief' || payload.role === 'admin');
                    
                    if (payload.matricula) {
                        const resHorario = await ScheduleService.getHorarioAlumno(payload.matricula);
                        if(resHorario.data && resHorario.data.data) {
                            const schedule = resHorario.data.data.schedule;
                            const materiasUnicas = extraerMateriasUnicas(schedule);
                            setMaterias(materiasUnicas);
                        }
                    }
                    loadTasks();
                }
            } catch (error) {
                console.error("Error inicializando:", error);
            }
        };
        init();
    }, []);

    useEffect(() => {
        const socket = getSocket();
        if (!socket) return;

        const onTaskUpdated = () => {
            console.log("📌 Tareas actualizadas por WS");
            loadTasks();
        };

        socket.on("task:updated", onTaskUpdated);

        return () => {
            socket.off("task:updated", onTaskUpdated);
        };
        }, []);

    const loadTasks = async () => {
        try {
            const res = await TaskService.getByGrupo();
            setTareas(res.data.data || []);
        } catch (error) {
            console.error("Error cargando tareas", error);
        }
    };

    const extraerMateriasUnicas = (scheduleMatrix) => {
        const map = new Map();
        if(scheduleMatrix) {
            Object.values(scheduleMatrix).forEach(daySlots => {
                daySlots.forEach(slot => {
                    if (slot.subject) map.set(slot.subject._id, slot.subject); 
                });
            });
        }
        return Array.from(map.values());
    };

    // --- CORRECCIÓN AQUÍ ---
    // Agregamos "t.subject &&" para asegurar que la tarea tenga materia antes de leer el ID
    const getTareasPorMateria = (subjectId) => {
        return tareas.filter(t => t.subject && (t.subject._id || t.subject) === subjectId);
    };

    const fechasConTarea = tareas.map(t => t.dueDate);

    const handleDelete = async (id) => {
        if(window.confirm("¿Eliminar esta tarea?")) {
            await TaskService.delete(id);
            loadTasks();
        }
    };

    const handleToggleComplete = async (tarea) => {
        await TaskService.markCompleted(tarea._id, !tarea.completed);
        loadTasks();
    };

    const toggleAcordeon = (subjId) => setMateriaAbierta(materiaAbierta === subjId ? null : subjId);

    const abrirModalCrear = (e, materia) => {
        e.stopPropagation(); 
        setMateriaParaNuevaTarea(materia); 
        setModalOpen(true);
    };

    // Filtro visual
    const materiasVisibles = materias.filter(materia => {
        if (esJefe) return true; 
        const tareasDeEsta = getTareasPorMateria(materia._id);
        return tareasDeEsta.length > 0; 
    });

    return (
        <div style={{ backgroundColor: "#00B8C8", minHeight: "100vh", position: "relative" }}>
            
            <div className="pt-4 px-4 pb-5" style={{ background: "linear-gradient(to right, #00B8C8, #00838F)" }}>
                <img src={garra} alt="garra" style={{ position: "absolute", top: "10px", right: "20px", width: "60px", opacity: 0.2 }} />
                <div className="mb-4 text-white">
                    <p className="m-0 opacity-75 small">Panel de Entregas</p>
                    <h2 className="fw-bold m-0" style={{ fontSize: "1.8rem" }}>Tareas</h2>
                    <p className="m-0 small opacity-90 mt-1">
                        {esJefe ? "Eres Jefe de Grupo" : "Tus pendientes"}
                    </p>
                </div>
            </div>

            <div 
                className="bg-white w-100"
                style={{
                    borderTopLeftRadius: "30px",
                    borderTopRightRadius: "30px",
                    minHeight: "calc(100vh - 140px)", 
                    marginTop: "-30px", 
                    padding: "30px 20px 100px 20px", 
                    position: "relative",
                    zIndex: 10
                }}
            >
                <div className="mb-5">
                    <h6 className="fw-bold text-secondary mb-3 ps-1">
                        {materiasVisibles.length > 0 ? "Asignaturas" : "Sin pendientes"}
                    </h6>

                    {materiasVisibles.length === 0 ? (
                        <div className="text-center py-5 text-muted bg-light rounded-4 border border-dashed">
                            <Book size={40} className="mb-2 opacity-25"/>
                            <p className="m-0">No hay tareas activas.</p>
                        </div>
                    ) : (
                        materiasVisibles.map((materia) => {
                            const tareasDeEsta = getTareasPorMateria(materia._id);
                            const isOpen = materiaAbierta === materia._id;

                            return (
                                <div key={materia._id} className="mb-3">
                                    <div 
                                        onClick={() => toggleAcordeon(materia._id)}
                                        className="d-flex justify-content-between align-items-center p-3 rounded-4 shadow-sm cursor-pointer"
                                        style={{ background: "#083D55", color: "white", transition: "0.2s" }}
                                    >
                                        <div className="d-flex align-items-center gap-3 overflow-hidden">
                                            <div className="bg-white text-dark rounded-circle d-flex align-items-center justify-content-center fw-bold" style={{width:"28px", height:"28px", fontSize:"0.8rem", flexShrink: 0}}>
                                                {tareasDeEsta.length}
                                            </div>
                                            <span className="fw-bold text-truncate">{materia.name}</span>
                                        </div>
                                        
                                        <div className="d-flex align-items-center gap-2">
                                            {esJefe && (
                                                <button 
                                                    onClick={(e) => abrirModalCrear(e, materia)}
                                                    className="btn btn-sm btn-light rounded-circle d-flex align-items-center justify-content-center border-0"
                                                    style={{width: "32px", height: "32px", background: "rgba(255,255,255,0.2)", color: "white"}}
                                                >
                                                    <Plus size={18}/>
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    {isOpen && (
                                        <div className="mt-2 ps-3 fade-in">
                                            {tareasDeEsta.length === 0 ? (
                                                <div className="p-2 text-muted small">No hay tareas creadas.</div>
                                            ) : (
                                                tareasDeEsta.map(tarea => (
                                                    <div key={tarea._id} className={`p-3 mb-2 rounded-3 border-start border-4 ${tarea.completed ? "border-success bg-light opacity-75" : "border-warning bg-white shadow-sm"}`}>
                                                        <div className="d-flex justify-content-between align-items-start">
                                                            <div className="pe-2">
                                                                <h6 className={`fw-bold mb-1 ${tarea.completed ? "text-decoration-line-through text-muted" : "text-dark"}`}>
                                                                    {tarea.title}
                                                                </h6>
                                                                <div className="small text-secondary mb-2" style={{lineHeight: "1.2"}}>{tarea.description}</div>
                                                                
                                                                <div className="d-flex align-items-center gap-1 small text-muted">
                                                                    <CalIcon size={14}/>
                                                                    <span>{new Date(tarea.dueDate).toLocaleDateString('es-MX', { timeZone: 'UTC' })}</span>
                                                                </div>
                                                            </div>
                                                            
                                                            <div>
                                                                {esJefe ? (
                                                                    <button onClick={() => handleDelete(tarea._id)} className="btn btn-sm text-danger p-0"><Trash2 size={20}/></button>
                                                                ) : (
                                                                    <button onClick={() => handleToggleComplete(tarea)} className={`btn btn-sm p-0 ${tarea.completed ? "text-success" : "text-secondary"}`}>
                                                                        {tarea.completed ? <CheckCircle size={22} fill="#d1e7dd"/> : <Circle size={22}/>}
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>

                <div className="rounded-4 bg-white border p-3 shadow-sm">
                    <Calendario taskDates={fechasConTarea} /> 
                </div>

            </div>
            <BottomNav />

            {modalOpen && (
                <ModalTarea
                    isOpen={modalOpen}
                    onClose={() => { setModalOpen(false); loadTasks(); }} 
                    materiaPreseleccionada={materiaParaNuevaTarea} 
                />
            )}
        </div>
    );
}