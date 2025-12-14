import React, { useState, useEffect, useRef } from "react";
import ClaseActual from "../components/ClaseActual";
import BottomNav from "../components/BottomNav";
import ScheduleService from "../services/scheduleService";
import TaskService from "../services/taskService"; 
import garra from "../assets/garra.png";
import { LogOut } from "lucide-react"; 
import { useNavigate } from "react-router-dom"; 
import Logo from '../assets/Logo.png'
import { disconnectSocket, connectSocket} from "../services/socket";

export default function DashboardAlumnos() {
    const navigate = useNavigate();
    const [scheduleData, setScheduleData] = useState(null); 
    const [diaSeleccionado, setDiaSeleccionado] = useState(getDiaActualKey()); 
    const [alumnoInfo, setAlumnoInfo] = useState({ nombre: "", grupo: "" });
    const [loading, setLoading] = useState(true);

    const [claseEnTiempoReal, setClaseEnTiempoReal] = useState(null); 
    const [claseSeleccionada, setClaseSeleccionada] = useState(null); 
    const [listaInferior, setListaInferior] = useState([]); 

    // Control de notificaciones de tareas
    const [tareasCount, setTareasCount] = useState(0); 
    const prevTareasCountRef = useRef(0); 

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

    // Permisos PWA
    useEffect(() => {
        if ("Notification" in window && Notification.permission !== "granted") {
            Notification.requestPermission();
        }
    }, []);

    const sendNotification = (title, body) => {
        if (Notification.permission === "granted") {
            if (navigator.serviceWorker && navigator.serviceWorker.ready) {
                navigator.serviceWorker.ready.then(reg => {
                    reg.showNotification(title, { body, icon: "/icon-192x192.png", vibrate: [200] });
                });
            } else {
                new Notification(title, { body, icon: "/icon-192x192.png" });
            }
        }
    };

    const handleLogout = () => {
        if(window.confirm("¿Cerrar sesión?")) {
            disconnectSocket();
            localStorage.removeItem("authToken");
            navigate("/"); 
        }
    };

    useEffect(() => {
        const init = async () => {
            try {
                const token = localStorage.getItem("authToken");
                if (!token) return navigate("/");
                const decoded = parseJwt(token);
                
                const res = await ScheduleService.getHorarioAlumno(decoded?.matricula);
                if (res.data) {
                    if (res.data.data && res.data.data.schedule) setScheduleData(res.data.data.schedule);
                    setAlumnoInfo({ nombre: res.data.studentName || "Alumno", grupo: res.data.groupInfo?.name || "" });
                }

                const resTareas = await TaskService.getByGrupo();
                if(resTareas.data && resTareas.data.data) {
                    const count = resTareas.data.data.length;
                    setTareasCount(count);
                    prevTareasCountRef.current = count;
                }
            } catch (error) { console.error(error); } finally { setLoading(false); }
        };
        init();
    }, []);

    useEffect(() => {
        if (!scheduleData) return;

        const tick = async () => {
            const hoy = getDiaActualKey();
            const clasesHoy = scheduleData[hoy] || [];
            const now = new Date();
            const minActuales = now.getHours() * 60 + now.getMinutes();

            let encontrada = null;
            clasesHoy.forEach((slot) => {
                if(!slot.time) return;
                const [start, end] = slot.time.split("-");
                const inicioMin = timeToMinutes(start);
                const finMin = timeToMinutes(end);

                if (minActuales >= inicioMin && minActuales < finMin) encontrada = slot;

                // Notificación 10 min antes
                if (inicioMin - minActuales === 10 && slot.subject) {
                    sendNotification("¡Clase en 10 minutos!", `Prepárate: ${slot.subject.name} en ${slot.classroom}`);
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

            // Notificación Nueva Tarea
            try {
                const resTareas = await TaskService.getByGrupo();
                if(resTareas.data && resTareas.data.data) {
                    const currentCount = resTareas.data.data.length;
                    if (currentCount > prevTareasCountRef.current) {
                        sendNotification("¡Nueva Tarea!", "El jefe de grupo ha subido una nueva tarea.");
                        prevTareasCountRef.current = currentCount;
                        setTareasCount(currentCount);
                    }
                }
            } catch (e) {}
        };

        tick();
        const interval = setInterval(tick, 60000); 
        return () => clearInterval(interval);
    }, [scheduleData, diaSeleccionado]);

    useEffect(() => {
        const socket = connectSocket();
        if (!socket) return;

        socket.on("schedule:updated", async (data) => {
            console.log("📅 Horario actualizado:", data);

            sendNotification(
            "Horario actualizado",
            "Tu horario ha sido actualizado por el administrador"
            );

            // 🔄 RECARGAR HORARIO
            const token = localStorage.getItem("authToken");
            const decoded = parseJwt(token);

            const res = await ScheduleService.getHorarioAlumno(decoded.matricula);
            if (res.data?.data?.schedule) {
            setScheduleData(res.data.data.schedule);
            }
        });

        return () => {
            disconnectSocket();
        };
    }, []);

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

    const handleDayChange = (day) => { setDiaSeleccionado(day); setClaseSeleccionada(null); };

    if (loading) return <div className="vh-100 d-flex align-items-center justify-content-center text-white" style={{background: "#00B8C8"}}>Cargando...</div>;

    return (
        <div style={{ backgroundColor: "#00B8C8", minHeight: "100vh", position: "relative" }}>
            <div className="pt-4 px-4 pb-5" style={{ background: "linear-gradient(to right, #00B8C8, #00838F)" }}>
                <img src={garra} alt="Garra" style={{ position: "absolute", top: "10px", right: "20px", width: "60px", opacity: 0.15 }} />
                
                <div className="d-flex align-items-center mb-4" style={{position: "relative", zIndex: 2}}>
                    <button 
                    onClick={handleLogout}
                    className="bg-white rounded-circle shadow-sm border-0 d-flex align-items-center justify-content-center me-3"
                    style={{ width: "36px", height: "36px", cursor: "pointer", flexShrink: 0 }}
                    title="Cerrar Sesión"
                    >
                    <img 
                        src={Logo}
                        alt="logout logo"
                        style={{ width: "36px", height: "36px", objectFit: "contain" }}
                    />
                    </button>
                    <div>
                        <p className="text-white m-0 opacity-75 small" style={{fontSize: "0.8rem", lineHeight: "1"}}>Bienvenido</p>
                        <h2 className="fw-bold text-white m-0" style={{fontSize: "1.4rem", lineHeight: "1.2"}}>{alumnoInfo.nombre.split(" ")[0]}</h2>
                    </div>
                    <div className="ms-auto text-white text-end">
                        <p className="m-0 fw-bold" style={{fontSize: "1.2rem"}}>{alumnoInfo.grupo}</p>
                        <p className="m-0 small opacity-75" style={{fontSize: "0.7rem"}}>Tu Grupo</p>
                    </div>
                </div>

                <div className="d-flex justify-content-between">
                    {["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"].map((dia) => {
                        const isSelected = diaSeleccionado === dia;
                        return (
                            <button key={dia} onClick={() => handleDayChange(dia)} className="btn border-0 fw-bold d-flex flex-column align-items-center justify-content-center" style={{width: "40px", color: isSelected ? "white" : "rgba(255,255,255,0.5)", transition: "0.2s"}}>
                                <span style={{fontSize: "0.9rem"}}>{dia.substring(0, 3).toUpperCase()}</span>
                                {isSelected && <div style={{width: "5px", height: "5px", background: "white", borderRadius: "50%", marginTop: "3px"}}></div>}
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="bg-white w-100" style={{borderTopLeftRadius: "30px", borderTopRightRadius: "30px", minHeight: "calc(100vh - 180px)", marginTop: "-20px", padding: "30px 20px 100px 20px", position: "relative", zIndex: 10}}>
                <div className="mb-5">
                    <ClaseActual materia={claseAVisualizar} titulo={tituloTarjeta} />
                </div>

                {listaInferior.length > 0 && (
                    <div>
                        <h6 className="fw-bold mb-3 text-secondary ps-1">Siguientes asignaturas</h6>
                        <div className="d-flex flex-column gap-3">
                            {listaInferior.map((clase, idx) => (
                                <div key={idx} onClick={() => setClaseSeleccionada(clase)} className="d-flex align-items-center text-white" style={{backgroundColor: "#000", borderRadius: "15px", padding: "15px 20px", cursor: "pointer", boxShadow: "0 4px 10px rgba(0,0,0,0.2)"}}>
                                    <div className="fw-bold text-truncate" style={{width: "40%", paddingRight: "10px"}}>{clase.classroom}</div>
                                    <div style={{width: "1px", height: "25px", background: "rgba(255,255,255,0.3)"}}></div>
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