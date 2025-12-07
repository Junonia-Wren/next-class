import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import BottomNav from "../components/BottomNav";

const materias = [
    "Gestión de Proyectos II",
    "Integradora",
    "Negociación Empresarial",
    "Inteligencia de Negocios",
    "Inglés"
];

export default function AsignaturasPage() {

    const navigate = useNavigate();

    return (
        <div className="container-fluid py-4"
            style={{ backgroundColor: "#F5F7FA", minHeight: "100vh" }}
        >
            {/* ENCABEZADO */}
            <div
                className="p-4 rounded-4 shadow-sm mb-4"
                style={{
                    background: "linear-gradient(90deg,#00B8C8,#007E8C)",
                    color: "white",
                }}
            >
                <h2 className="fw-bold text-center">Asignaturas</h2>
            </div>

            {/* LISTA */}
            <div className="container mb-5">
                {materias.map((mat) => (
                    <button
                        key={mat}
                        className="btn w-100 py-3 mb-3 fw-bold shadow-sm"
                        style={{
                            background: "#8C274C",
                            color: "white",
                            borderRadius: "12px",
                            fontSize: "17px"
                        }}
                        onClick={() => navigate(`/asignaturas/${encodeURIComponent(mat)}`)}
                    >
                        {mat}
                    </button>
                ))}
            </div>

            <BottomNav />
        </div>
    );
}
