import React, { useState, useEffect } from "react";
import ClaseActual from "../components/ClaseActual";
import BottomNav from "../components/BottomNav";
import ScheduleService from "../services/scheduleService";
import garra from "../assets/garra.png"; // Asegúrate de tener este asset

export default function DashboardAlumnos() {
    const [scheduleData, setScheduleData] = useState(null); 
    const [diaSeleccionado, setDiaSeleccionado] = useState(getDiaActualKey()); 
    const [alumnoInfo, setAlumnoInfo] = useState({ nombre: "", grupo: "" });
    const [loading, setLoading] = useState(true);

    const [claseEnTiempoReal, setClaseEnTiempoReal] = useState(null); 
    const [claseSeleccionada, setClaseSeleccionada] = useState(null); 
    const [listaInferior, setListaInferior] = useState([]); 

    function getDiaActualKey() {
        const dias = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
        return dias[new Date().getDay()];
    }

    const timeToMinutes = (str) => {
        if(!str) return 0;
        const [h, m] = str.trim().split(":").map(Number);
        return h * 60 + (m || 0);
    };

    const parseJwt = (token) => {
        try { return JSON.parse(atob(token.split('.')[1])); } catch (e) { return null; }
    };

    useEffect(() => {
        const init = async () => {
            try {
                const token = localStorage.getItem("authToken");
                if (!token) return;
                const decoded = parseJwt(token);
                
                const res = await ScheduleService.getHorarioAlumno(decoded?.matricula);
                
                if (res.data) {
                    if (res.data.data && res.data.data.schedule) {
                        setScheduleData(res.data.data.schedule);
                    }
                    setAlumnoInfo({ 
                        nombre: res.data.studentName || "Alumno", 
                        grupo: res.data.groupInfo?.name || "" 
                    });
                }
            } catch (error) {
                console.error("Error al cargar:", error);
            } finally {
                setLoading(false);
            }
        };
        init();
    }, []);

    useEffect(() => {
        if (!scheduleData) return;

        const tick = () => {
            const hoy = getDiaActualKey();
            const clasesHoy = scheduleData[hoy] || [];
            const now = new Date();
            const minActuales = now.getHours() * 60 + now.getMinutes();

            let encontrada = null;
            clasesHoy.forEach((slot) => {
                if(!slot.time) return;
                const [start, end] = slot.time.split("-");
                if (minActuales >= timeToMinutes(start) && minActuales < timeToMinutes(end)) {
                    encontrada = slot;
                }
            });
            setClaseEnTiempoReal(encontrada);

            const clasesDelDiaSeleccionado = scheduleData[diaSeleccionado] || [];
            const soloMateriasReales = clasesDelDiaSeleccionado.filter(slot => slot && slot.subject);

            if (diaSeleccionado === hoy) {
                const futuras = soloMateriasReales.filter(slot => {
                    const [start] = slot.time.split("-");
                    return timeToMinutes(start) > minActuales;
                });
                setListaInferior(futuras);
            } else {
                setListaInferior(soloMateriasReales);
            }
        };

        tick();
        const interval = setInterval(tick, 60000);
        return () => clearInterval(interval);

    }, [scheduleData, diaSeleccionado]);

    let claseAVisualizar = null;
    let tituloTarjeta = "Actual";

    if (claseSeleccionada) {
        claseAVisualizar = claseSeleccionada;
        tituloTarjeta = "Selección";
    } else if (diaSeleccionado === getDiaActualKey()) {
        claseAVisualizar = claseEnTiempoReal;
        tituloTarjeta = "Actual";
    } else {
        tituloTarjeta = "Selección"; 
    }

    const handleDayChange = (day) => {
        setDiaSeleccionado(day);
        setClaseSeleccionada(null);
    };

    if (loading) return <div className="vh-100 d-flex align-items-center justify-content-center text-white" style={{background: "#00B8C8"}}>Cargando...</div>;

    return (
        <div style={{ backgroundColor: "#00B8C8", minHeight: "100vh", position: "relative" }}>
            
            {/* --- FONDO SUPERIOR (HEADER) --- */}
            <div className="pt-4 px-4 pb-5" style={{ background: "linear-gradient(to right, #00B8C8, #00838F)" }}>
                {/* Logo o Garra Decorativa */}
                <img src={garra} alt="Garra" style={{ position: "absolute", top: "10px", right: "20px", width: "60px", opacity: 0.2 }} />
                
                {/* Saludo */}
                <div className="d-flex justify-content-between align-items-end mb-4">
                    <div>
                        <p className="text-white m-0 opacity-75 small">Bienvenido</p>
                        <h2 className="fw-bold text-white m-0">
                            {alumnoInfo.nombre.split(" ")[0]}
                        </h2>
                    </div>
                    <div className="text-white text-end">
                        <p className="m-0 fw-bold" style={{fontSize: "1.2rem"}}>{alumnoInfo.grupo}</p>
                        <p className="m-0 small opacity-75">Tu Grupo</p>
                    </div>
                </div>

                {/* DÍAS DE LA SEMANA (TRANSPARENTES) */}
                <div className="d-flex justify-content-between">
                    {["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"].map((dia) => {
                        const isSelected = diaSeleccionado === dia;
                        return (
                            <button
                                key={dia}
                                onClick={() => handleDayChange(dia)}
                                className="btn border-0 fw-bold d-flex flex-column align-items-center justify-content-center"
                                style={{
                                    width: "40px", 
                                    color: isSelected ? "white" : "rgba(255,255,255,0.5)",
                                    transition: "0.2s",
                                    position: "relative"
                                }}
                            >
                                <span style={{fontSize: "1rem"}}>{dia.substring(0, 3).toUpperCase()}</span>
                                {isSelected && <div style={{width: "6px", height: "6px", background: "white", borderRadius: "50%", marginTop: "4px"}}></div>}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* --- CUERPO BLANCO CURVO (ESTILO WALLET) --- */}
            <div 
                className="bg-white w-100"
                style={{
                    borderTopLeftRadius: "30px",
                    borderTopRightRadius: "30px",
                    minHeight: "calc(100vh - 180px)", // Ocupa el resto
                    marginTop: "-20px", // Efecto overlap
                    padding: "30px 20px 100px 20px", // Padding bottom extra para el nav
                    position: "relative",
                    zIndex: 10
                }}
            >
                {/* TARJETA PRINCIPAL (La que muestra la info) */}
                <div className="mb-5">
                    <ClaseActual materia={claseAVisualizar} titulo={tituloTarjeta} />
                </div>

                {/* LISTA SIGUIENTES (ESTILO NEGRO) */}
                {listaInferior.length > 0 && (
                    <div>
                        <h6 className="fw-bold mb-3 text-secondary ps-1">Siguientes asignaturas</h6>
                        
                        <div className="d-flex flex-column gap-3">
                            {listaInferior.map((clase, idx) => (
                                <div 
                                    key={idx} 
                                    onClick={() => setClaseSeleccionada(clase)} 
                                    className="d-flex align-items-center text-white"
                                    style={{
                                        backgroundColor: "#000", // Fondo negro
                                        borderRadius: "15px",
                                        padding: "15px 20px",
                                        cursor: "pointer",
                                        boxShadow: "0 4px 10px rgba(0,0,0,0.2)"
                                    }}
                                >
                                    {/* Izquierda: Salón */}
                                    <div className="fw-bold text-truncate" style={{width: "40%", paddingRight: "10px"}}>
                                        {clase.classroom}
                                    </div>

                                    {/* Divisor Vertical */}
                                    <div style={{width: "1px", height: "25px", background: "rgba(255,255,255,0.3)"}}></div>

                                    {/* Derecha: Materia */}
                                    <div className="ps-3 text-truncate flex-grow-1">
                                        <div className="fw-bold" style={{fontSize: "0.95rem"}}>{clase.subject?.name}</div>
                                        <div style={{fontSize: "0.75rem", opacity: 0.7}}>{clase.time}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <BottomNav />
        </div>
    );
}