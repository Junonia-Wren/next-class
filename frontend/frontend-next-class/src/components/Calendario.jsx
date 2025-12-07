import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Calendario() {
    const fechaActual = new Date();
    const [mes, setMes] = useState(fechaActual.getMonth());
    const [year, setYear] = useState(fechaActual.getFullYear());

    const meses = [
        "ENERO", "FEBRERO", "MARZO", "ABRIL", "MAYO", "JUNIO",
        "JULIO", "AGOSTO", "SEPTIEMBRE", "OCTUBRE",
        "NOVIEMBRE", "DICIEMBRE"
    ];

    const cambiarMes = (dir) => {
        let nuevoMes = mes + dir;

        if (nuevoMes === 12) return (setMes(0), setYear(year + 1));
        if (nuevoMes === -1) return (setMes(11), setYear(year - 1));

        setMes(nuevoMes);
    };

    const primerDia = new Date(year, mes, 1).getDay();
    const totalDias = new Date(year, mes + 1, 0).getDate();

    const dias = [];
    for (let i = 0; i < primerDia; i++) dias.push("");
    for (let i = 1; i <= totalDias; i++) dias.push(i);

    return (
        <div className="mt-4 p-4 bg-white rounded-4 shadow-sm text-center">

            {/* TÍTULO CENTRADO */}
            <h3
                className="fw-bold mb-3"
                style={{
                    color: "#00838F",
                    letterSpacing: "1px"
                }}
            >
                {meses[mes]}
            </h3>

            {/* FLECHAS */}
            <div className="d-flex justify-content-between align-items-center mb-3 px-4">
                <button
                    className="btn btn-light shadow-sm rounded-circle p-2"
                    onClick={() => cambiarMes(-1)}
                >
                    <ChevronLeft size={22} color="#00838F" />
                </button>

                <span className="fw-semibold" style={{ color: "#00838F" }}>
                    {year}
                </span>

                <button
                    className="btn btn-light shadow-sm rounded-circle p-2"
                    onClick={() => cambiarMes(1)}
                >
                    <ChevronRight size={22} color="#00838F" />
                </button>
            </div>

            {/* TABLA DEL CALENDARIO */}
            <table className="table text-center m-0" style={{ borderCollapse: "separate" }}>
                <thead>
                    <tr className="fw-semibold">
                        <th style={{ color: "#8C2750" }}>Dom</th>
                        <th>Lun</th>
                        <th>Mar</th>
                        <th>Mie</th>
                        <th>Jue</th>
                        <th>Vie</th>
                        <th>Sab</th>
                    </tr>
                </thead>

                <tbody>
                    {Array.from({ length: Math.ceil(dias.length / 7) }).map((_, fila) => (
                        <tr key={fila}>
                            {dias.slice(fila * 7, fila * 7 + 7).map((d, i) => {
                                const isToday =
                                    d === fechaActual.getDate() &&
                                    mes === fechaActual.getMonth() &&
                                    year === fechaActual.getFullYear();

                                return (
                                    <td
                                        key={i}
                                        style={{
                                            padding: "8px 0",
                                            color: isToday ? "#00838F" : "#000",
                                            fontWeight: isToday ? "bold" : "normal",
                                            background: isToday ? "#00B8C822" : "transparent",
                                            borderRadius: isToday ? "6px" : "none",
                                        }}
                                    >
                                        {d}
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
