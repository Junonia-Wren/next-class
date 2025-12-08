import React from "react";
import { Clock } from "lucide-react";
import { getSalonImage } from "../utils/salonImages"; 

export default function ClaseActual({ materia, titulo }) {
    
    // CASO 1: SIN ACTIVIDAD
    if (!materia || !materia.subject) {
        return (
            <div className="text-center py-5">
                <div style={{opacity: 0.2, marginBottom: "15px"}}>
                    <Clock size={60} color="#007E8C" />
                </div>
                <h3 className="fw-bold" style={{color: "#007E8C", fontSize: "1.3rem"}}>¡Todo libre!</h3>
                <p className="text-muted m-0 small">No hay clases programadas.</p>
            </div>
        );
    }

    const { subject, classroom, time } = materia;
    const imagenSalon = getSalonImage(classroom); 

    return (
        <div style={{padding: "5px"}}>
            {/* ENCABEZADO: Título y Hora */}
            <div className="d-flex justify-content-between align-items-start mb-2">
                <div>
                    <h5 className="fw-bold m-0" style={{ color: "#007E8C", fontSize: "1rem" }}>
                        {titulo}
                    </h5>
                    {/* Nombre de la materia (Tamaño ajustado) */}
                    <h1 className="fw-bold m-0" style={{color: "#222", fontSize: "1.5rem", lineHeight: "1.2", marginTop: "5px"}}>
                        {subject.name}
                    </h1>
                </div>
                
                <div className="text-end">
                    <p className="fw-bold m-0" style={{fontSize: "0.75rem", color: "#888"}}>Hora</p>
                    <p className="fw-bold m-0" style={{fontSize: "1rem", color: "#333"}}>{time}</p>
                </div>
            </div>

            {/* IMAGEN DEL SALÓN */}
            <div className="w-100 my-3" style={{position: "relative", borderRadius: "15px", overflow: "hidden", boxShadow: "0 8px 20px rgba(0,0,0,0.1)"}}>
                <img
                    src={imagenSalon}
                    alt={classroom}
                    style={{
                        width: "100%",
                        height: "180px", // Un poco más compacto
                        objectFit: "cover",
                        objectPosition: "center",
                        display: "block"
                    }}
                />
            </div>

            {/* BOTONES DE INFORMACIÓN (PILLS) */}
            <div className="d-flex gap-3">
                
                {/* Pill Salón (Vino) */}
                <div className="flex-fill rounded-4 p-2 d-flex flex-column justify-content-center text-white text-center"
                     style={{backgroundColor: "#8C274C", minHeight: "70px", boxShadow: "0 4px 12px rgba(140, 39, 76, 0.3)"}}>
                    <span style={{fontSize: "0.75rem", opacity: 0.9, marginBottom: "0px", fontWeight: "500"}}>Salón</span>
                    <span style={{fontSize: "1.1rem", fontWeight: "700", lineHeight: "1.1"}}>
                        {classroom || "N/A"}
                    </span>
                </div>

                {/* Pill Asignatura (Verde) - CORREGIDO */}
                <div className="flex-fill rounded-4 p-2 d-flex flex-column justify-content-center text-white text-center"
                     style={{backgroundColor: "#2DA683", minHeight: "70px", boxShadow: "0 4px 12px rgba(45, 166, 131, 0.3)"}}>
                    <span style={{fontSize: "0.75rem", opacity: 0.9, marginBottom: "0px", fontWeight: "500"}}>Asignatura</span>
                    <span style={{fontSize: "1rem", fontWeight: "700", lineHeight: "1.1", wordBreak: "break-word"}}>
                        {subject.name} 
                    </span>
                </div>

            </div>
        </div>
    );
}