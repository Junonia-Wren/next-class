import React from "react";
import icon from "../assets/Logo.png";

export default function HorarioHeader({ diaSeleccionado, setDiaSeleccionado }) {
    const dias = ["Lun", "Mar", "Mier", "Jue", "Vie"];

    return (
        <div
            className="p-4 rounded-3 shadow-sm"
            style={{
                background: "linear-gradient(90deg,#00B8C8,#007E8C)",
                color: "white",
                position: "relative",
            }}
        >
            {/* ====== CONTENEDOR SUPERIOR ====== */}
            <div
                className="d-flex justify-content-between align-items-center flex-wrap"
                style={{ rowGap: "10px" }}
            >
                {/* TÍTULO */}
                <h3
                    className="fw-bold m-0"
                    style={{
                        fontSize: "1.6rem",
                        flex: "1 1 auto",
                        minWidth: "200px",
                    }}
                >
                    Dashboard Alumno
                </h3>

                {/* LOGO RESPONSIVO */}
                <div
                    className="d-flex justify-content-end"
                    style={{ flex: "0 0 auto", minWidth: "60px" }}
                >
                    <img
                        src={icon}
                        alt="logo"
                        style={{
                            width: "60px",
                            height: "60px",
                            objectFit: "contain",
                            filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))",
                        }}
                    />
                </div>
            </div>

            {/* SUBTÍTULO */}
            <p className="mt-1 mb-3 opacity-75">Horario del día</p>

            {/* ====== BOTONES DE DÍAS (RESPONSIVOS) ====== */}
            <div
                className="d-flex gap-2 flex-wrap"
                style={{ rowGap: "8px" }}
            >
                {dias.map((d) => (
                    <button
                        key={d}
                        onClick={() => setDiaSeleccionado(d)}
                        className="btn fw-semibold"
                        style={{
                            padding: "8px 14px",
                            background:
                                diaSeleccionado === d
                                    ? "white"
                                    : "rgba(255,255,255,0.25)",
                            color:
                                diaSeleccionado === d
                                    ? "#007E8C"
                                    : "white",
                            borderRadius: "10px",
                            border: "none",
                            flex: "1 1 70px", // ✔ RESPONSIVO
                        }}
                    >
                        {d}
                    </button>
                ))}
            </div>
        </div>
    );
}
