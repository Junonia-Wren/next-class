import React, { useState } from "react";
import ModalTarea from "../components/ModalTarea";
import Calendario from "../components/Calendario";
import BottomNav from "../components/BottomNav";
import garra from "../assets/garra.png";

export default function TareasPage() {

    // TEMPORAL: después se sustituye por el rol real del usuario
    const esJefe = true;

    const materiasMock = [
        "Gestión de Proyectos II",
        "Integradora",
        "Programación de Aplicaciones Web"
    ];

    const [modalOpen, setModalOpen] = useState(false);
    const [materiaSeleccionada, setMateriaSeleccionada] = useState(null);

    return (
        <div
            className="container-fluid py-4"
            style={{ backgroundColor: "#F5F7FA", minHeight: "100vh" }}
        >

            <div className="container">

                {/* ===========================
                    HEADER ESTILO ADMIN
                ============================ */}
                <div
                    className="p-4 rounded-4 shadow-sm mb-4 position-relative"
                    style={{
                        background: "linear-gradient(90deg,#00B8C8,#007E8C)",
                        color: "white",
                    }}
                >
                    <h2 className="fw-bold">Tareas Pendientes</h2>

                    <img
                        src={garra}
                        alt="garra"
                        style={{
                            position: "absolute",
                            right: "20px",
                            top: "10px",
                            width: "70px",
                            opacity: 0.9,
                        }}
                    />
                </div>

                {/* ===========================
                    LISTA DE MATERIAS
                ============================ */}
                <div className="rounded-4 bg-white shadow-sm p-4 mb-4">

                    {materiasMock.map((materia) => (
                        <div
                            key={materia}
                            className="d-flex justify-content-between align-items-center p-3 mb-3 rounded-3 shadow-sm"
                            style={{
                                background: "#000",
                                color: "white",
                                cursor: esJefe ? "pointer" : "default",
                            }}
                            onClick={() => {
                                if (esJefe) {
                                    setMateriaSeleccionada(materia);
                                    setModalOpen(true);
                                }
                            }}
                        >
                            <strong>{materia}</strong>
                            <span style={{ fontSize: "1.2rem" }}>▾</span>
                        </div>
                    ))}

                </div>

                {/* ===========================
                    CALENDARIO
                ============================ */}
                <div className="rounded-4 bg-white shadow-sm p-4 mb-5">
                    <Calendario />
                </div>

            </div>

            {/* ===========================
                BOTTOM NAV
            ============================ */}
            <BottomNav />

            {/* ===========================
                MODAL PARA AGREGAR TAREA
            ============================ */}
            <ModalTarea
                show={modalOpen}
                onClose={() => setModalOpen(false)}
                materia={materiaSeleccionada}
            />

        </div>
    );
}
