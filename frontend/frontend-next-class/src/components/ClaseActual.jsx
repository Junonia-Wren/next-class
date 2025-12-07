// components/ClaseActual.jsx
import React from "react";
import hallway from "../assets/hallway.png";

export default function ClaseActual({ materia }) {
    return (
        <>
            <h5 className="fw-bold mb-3" style={{ color: "#007E8C" }}>
                Clase Actual
            </h5>

            {/* Nombre de la clase */}
            <div className="d-flex justify-content-between align-items-start mb-3">
                <h3 className="fw-bold">{materia.nombre}</h3>
                <p className="fw-semibold text-secondary m-0">
                    {materia.hora}
                </p>
            </div>

            {/* 📌 Imagen BIEN colocada */}
{/* Imagen limpia y elegante */}
<div
    className="w-100 d-flex justify-content-center"
    style={{ marginTop: "15px" }}
>
    <img
        src={hallway}
        alt="hallway"
        style={{
            width: "90%",            // ✔ tamaño controlado
            maxWidth: "600px",       // ✔ no crece demasiado en pantallas grandes
            borderRadius: "20px",    // ✔ bordes bonitos
            objectFit: "cover",      // ✔ no se deforma
            objectPosition: "center",
            display: "block",
            boxShadow: "0 4px 14px rgba(0,0,0,0.1)", // ✔ estilo Admin
        }}
    />
</div>


            {/* Etiquetas */}
            <div className="d-flex flex-wrap gap-3 mt-3">

                <span
                    className="text-white px-3 py-2 rounded-3 fw-bold"
                    style={{ background: "#8C274C", fontSize: "14px" }}
                >
                    {materia.salon}
                </span>

                <span
                    className="text-white px-3 py-2 rounded-3 fw-bold"
                    style={{ background: "#2DA683", fontSize: "14px" }}
                >
                    {materia.tipo}
                </span>

            </div>
        </>
    );
}
