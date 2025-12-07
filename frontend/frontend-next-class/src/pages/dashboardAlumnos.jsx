import React, { useState } from "react";
import HorarioHeader from "../components/HorarioHeader";
import ClaseActual from "../components/ClaseActual";
import ListaAsignaturas from "../components/ListaAsignaturas";
import BottomNav from "../components/BottomNav";

export default function DashboardAlumnos() {

    const [diaSeleccionado, setDiaSeleccionado] = useState("Lun");

    const horario = {
        Lun: {
            nombre: "Docencia I",
            hora: "2:30 - 4:30",
            salon: "Laboratorio Idiomas",
            tipo: "Inglés",
            siguientes: ["Laboratorio 1 — Programación Web Progresiva"]
        },
        Mar: {
            nombre: "Matemáticas",
            hora: "8:00 - 10:00",
            salon: "Edificio B",
            tipo: "Clase regular",
            siguientes: ["Cálculo — Aula 3"]
        },
    };

    const materia = horario[diaSeleccionado];

    return (
        <>
        {/* CONTENIDO PRINCIPAL */}
        <div
            className="container-fluid py-4"
            style={{ backgroundColor: "#F5F7FA", minHeight: "100vh" }}
        >
            <div className="container">

                {/* ENCABEZADO */}
                <div
                    className="p-4 mb-4 rounded-4 shadow-sm"
                    style={{
                        background: "linear-gradient(90deg,#00B8C8,#007E8C)",
                        color: "white",
                    }}
                >
                    <h2 className="fw-bold">Dashboard Alumno</h2>
                    <p className="m-0">Horario del día</p>

                    <div className="d-flex flex-wrap gap-2 mt-3">
                        {["Lun", "Mar", "Mier", "Jue", "Vie"].map((dia) => (
                            <button
                                key={dia}
                                onClick={() => setDiaSeleccionado(dia)}
                                className={`btn ${
                                    diaSeleccionado === dia ? "btn-light" : "btn-outline-light"
                                }`}
                                style={{
                                    borderRadius: "20px",
                                    fontWeight: 600,
                                }}
                            >
                                {dia}
                            </button>
                        ))}
                    </div>
                </div>

                {/* CLASE ACTUAL */}
                <div className="rounded-4 shadow-sm bg-white p-4 mb-4">
                    <ClaseActual materia={materia} />
                </div>

                {/* SIGUIENTES ASIGNATURAS */}
                <div className="rounded-4 shadow-sm bg-white p-4 mb-5">
                    <ListaAsignaturas asignaturas={materia.siguientes} />
                </div>

            </div>
        </div>

        {/* BOTTOM NAV FIJO */}
        <BottomNav />
        </>
    );
}
