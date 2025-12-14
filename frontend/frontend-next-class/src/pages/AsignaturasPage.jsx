import React, { useState, useEffect } from "react";
import BottomNav from "../components/BottomNav";
import ScheduleService from "../services/scheduleService";
import garra from "../assets/garra.png";
import { getSocket } from "../services/socket";
import { ArrowLeft, BookOpen, User, Percent, FileText, Calendar } from "lucide-react";

// Placeholder por si no hay foto
const defaultTeacher = "https://cdn-icons-png.flaticon.com/512/6833/6833591.png";

export default function AsignaturasPage() {
    const [materias, setMaterias] = useState([]); 
    const [loading, setLoading] = useState(true);
    const [materiaSeleccionada, setMateriaSeleccionada] = useState(null); 

    // Helper Token
    const parseJwt = (token) => {
        try { return JSON.parse(atob(token.split('.')[1])); } catch (e) { return null; }
    };

    // --- CARGA ---
    useEffect(() => {
        const init = async () => {
            try {
                const token = localStorage.getItem("authToken");
                if (token) {
                    const payload = parseJwt(token);
                    if (payload.matricula) {
                        const res = await ScheduleService.getHorarioAlumno(payload.matricula);
                        
                        if(res.data && res.data.data && res.data.data.schedule) {
                            const schedule = res.data.data.schedule;
                            const materiasUnicas = extraerMateriasUnicas(schedule);
                            setMaterias(materiasUnicas);
                        }
                    }
                }
            } catch (error) {
                console.error("Error cargando asignaturas", error);
            } finally {
                setLoading(false);
            }
        };
        init();
    }, []);

    useEffect(() => {
        const socket = getSocket();
        if (!socket) return;

        const onScheduleUpdated = async (data) => {
            console.log("📅 Horario actualizado:",data);
            try {
            const token = localStorage.getItem("authToken");
            const payload = parseJwt(token);
            const res = await ScheduleService.getHorarioAlumno(payload.matricula);

            if (res.data?.data?.schedule) {
                const materiasUnicas = extraerMateriasUnicas(res.data.data.schedule);
                setMaterias(materiasUnicas);
            }
            } catch (e) {
            console.error("Error recargando asignaturas", e);
            }
        };

        socket.on("schedule:updated", onScheduleUpdated);

        return () => {
            socket.off("schedule:updated", onScheduleUpdated);
        };
        }, []);


    const extraerMateriasUnicas = (scheduleMatrix) => {
        const map = new Map();
        Object.values(scheduleMatrix).forEach(daySlots => {
            daySlots.forEach(slot => {
                if (slot.subject) {
                    map.set(slot.subject._id, slot.subject); 
                }
            });
        });
        return Array.from(map.values());
    };

    // Estilos
    const sectionTitleStyle = { color: "#333", fontSize: "1.1rem", fontWeight: "bold", marginTop: "25px", marginBottom: "15px" };
    const pillStyle = { backgroundColor: "#007E8C", color: "white", padding: "10px 20px", borderRadius: "20px", fontSize: "0.8rem", display: "inline-block", margin: "5px", fontWeight: "600" };

    if (loading) return <div className="vh-100 d-flex align-items-center justify-content-center text-white" style={{background: "#00B8C8"}}>Cargando...</div>;

    return (
        <div style={{ backgroundColor: "#00B8C8", minHeight: "100vh", position: "relative" }}>
            
            {/* --- HEADER --- */}
            <div className="pt-4 px-4 pb-5" style={{ background: "linear-gradient(to right, #00B8C8, #00838F)" }}>
                <img src={garra} alt="garra" style={{ position: "absolute", top: "10px", right: "20px", width: "60px", opacity: 0.2 }} />
                
                <div className="mb-4 text-white d-flex align-items-center gap-3">
                    {materiaSeleccionada && (
                        <button 
                            onClick={() => setMateriaSeleccionada(null)}
                            className="btn btn-sm btn-light rounded-circle d-flex align-items-center justify-content-center border-0"
                            style={{width: "40px", height: "40px", color: "#00B8C8"}}
                        >
                            <ArrowLeft size={22}/>
                        </button>
                    )}
                    
                    <div>
                        <p className="m-0 opacity-75 small">Asignatura</p>
                        <h2 className="fw-bold m-0" style={{ fontSize: "1.8rem" }}>
                            {materiaSeleccionada ? "Detalles" : "Mis Asignaturas"}
                        </h2>
                    </div>
                </div>
            </div>

            {/* --- CUERPO BLANCO --- */}
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
                {/* VISTA 1: LISTA */}
                {!materiaSeleccionada ? (
                    <div className="fade-in">
                        {materias.length === 0 ? (
                            <div className="text-center py-5 text-muted">
                                <BookOpen size={40} className="mb-2 opacity-25"/>
                                <p>No tienes asignaturas cargadas.</p>
                            </div>
                        ) : (
                            <div className="d-flex flex-column gap-3">
                                {materias.map((materia) => (
                                    <div 
                                        key={materia._id}
                                        onClick={() => setMateriaSeleccionada(materia)}
                                        className="p-4 rounded-4 shadow-sm text-white cursor-pointer position-relative overflow-hidden"
                                        style={{ 
                                            background: "#8C274C", 
                                            transition: "transform 0.1s"
                                        }}
                                        onMouseDown={e => e.currentTarget.style.transform = "scale(0.98)"}
                                        onMouseUp={e => e.currentTarget.style.transform = "scale(1)"}
                                    >
                                        <div className="d-flex justify-content-between align-items-center position-relative" style={{zIndex: 2}}>
                                            <div>
                                                <h5 className="fw-bold m-0 text-truncate" style={{maxWidth: "250px"}}>
                                                    {materia.name}
                                                </h5>
                                                {/* CORREGIDO: materia.teacher en lugar de teacherName */}
                                                <p className="m-0 small opacity-75 d-flex align-items-center gap-1">
                                                    <User size={14}/> {materia.teacher || "Sin Asignar"}
                                                </p>
                                            </div>
                                            <div className="bg-white rounded-circle d-flex align-items-center justify-content-center" style={{width: "40px", height: "40px", color: "#8C274C"}}>
                                                <ArrowLeft size={20} style={{transform: "rotate(180deg)"}}/>
                                            </div>
                                        </div>
                                        <div style={{position: "absolute", right: "-10px", bottom: "-20px", opacity: 0.1}}>
                                            <BookOpen size={100} color="white"/>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ) : (
                    /* VISTA 2: DETALLE */
                    <div className="fade-in text-center">
                        
                        <div className="d-inline-block px-4 py-2 rounded-pill fw-bold text-white mb-4 shadow-sm" style={{backgroundColor: "#8C274C"}}>
                            {materiaSeleccionada.name}
                        </div>

                        <div className="mb-4 position-relative d-inline-block">
                            <div className="rounded-circle p-1" style={{border: "3px solid #00B8C8"}}>
                                <img 
                                    src={materiaSeleccionada.profesorFoto || defaultTeacher} 
                                    alt="Docente" 
                                    style={{width: "120px", height: "120px", borderRadius: "50%", objectFit: "cover"}}
                                />
                            </div>
                            {/* CORREGIDO: teacher en lugar de teacherName */}
                            <h5 className="mt-3 fw-bold text-dark">{materiaSeleccionada.teacher}</h5>
                            <p className="text-muted small">Docente</p>
                        </div>

                        <div className="mb-4 d-flex justify-content-center flex-wrap">
                            <span style={{...pillStyle, background: "#8C274C"}}>Asesorías</span>
                            <span style={pillStyle}>Cronograma</span>
                        </div>

                        <hr className="opacity-10 my-4"/>

                        <div className="text-start">
                            <h3 style={sectionTitleStyle} className="d-flex align-items-center gap-2">
                                <Percent size={20} color="#007E8C"/> Evaluación
                            </h3>
                            {Object.entries(materiaSeleccionada.porcentajes || {}).map(([key, data]) => (
                                (data.valor || data.descripcion) ? (
                                    <div key={key} className="d-flex align-items-start mb-3 bg-light p-3 rounded-3">
                                        <div className="fw-bold me-3 text-uppercase" style={{color: "#555", minWidth: "80px"}}>
                                            {key} <span style={{color: "#00B8C8"}}>{data.valor}%</span>
                                        </div>
                                        <div className="small text-muted border-start ps-3 border-2">
                                            {data.descripcion || "Sin descripción"}
                                        </div>
                                    </div>
                                ) : null
                            ))}
                        </div>

                        <div className="text-start mt-4">
                            <h3 style={sectionTitleStyle} className="d-flex align-items-center gap-2">
                                <FileText size={20} color="#007E8C"/> Unidades
                            </h3>
                            {materiaSeleccionada.unidades?.map((unit, index) => (
                                (unit.fechas || unit.porcentaje !== "") ? (
                                    <div key={index} className="d-flex align-items-center mb-2 p-2 border-bottom">
                                        <div className="fw-bold me-3 text-nowrap" style={{color: "#555"}}>
                                            Unidad {index + 1}
                                        </div>
                                        {unit.porcentaje > 0 && (
                                            <span className="badge bg-secondary me-2">{unit.porcentaje}%</span>
                                        )}
                                        <div className="small text-muted text-truncate">
                                            <Calendar size={12} className="me-1"/>
                                            {unit.fechas || "Fechas pendientes"}
                                        </div>
                                    </div>
                                ) : null
                            ))}
                        </div>

                        {materiaSeleccionada.notas && (
                            <div className="text-start mt-4 bg-light p-3 rounded-4">
                                <h6 className="fw-bold mb-2 text-dark">Notas Importantes</h6>
                                <p className="small text-muted m-0" style={{lineHeight: "1.6"}}>
                                    {materiaSeleccionada.notas}
                                </p>
                            </div>
                        )}

                    </div>
                )}
            </div>

            <BottomNav />
        </div>
    );
}