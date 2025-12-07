import React, { useState } from "react";
import { ChevronDown, ChevronUp, Plus } from "lucide-react";

export default function ListaAsignaturas({ asignaturas, onAddTask, esJefe = false }) {
    const [abierto, setAbierto] = useState(null);

    const abrir = (index) => {
        setAbierto(abierto === index ? null : index);
    };

    return (
        <div>
            <h5 className="fw-bold mb-3" style={{ color: "#00838F" }}>
                Siguientes asignaturas
            </h5>

            {asignaturas.map((asig, index) => (
                <div key={index} className="mb-3">
                    {/* Botón principal del acordeón */}
                    <button
                        className="w-100 d-flex justify-content-between align-items-center 
                        bg-dark text-white px-3 py-2 rounded-3"
                        onClick={() => abrir(index)}
                        style={{ fontWeight: 600 }}
                    >
                        {asig}
                        {abierto === index ? <ChevronUp /> : <ChevronDown />}
                    </button>

                    {/* Contenido desplegado */}
                    {abierto === index && (
                        <div
                            className="bg-white shadow-sm rounded-3 p-3 mt-2"
                            style={{ border: "1px solid #eee" }}
                        >
                            <p className="m-0 text-secondary">
                                Aquí se mostrarán las tareas, información y detalles de esta asignatura.
                            </p>

                            {esJefe && (
                                <div className="text-end mt-3">
                                    <button
                                        className="btn btn-info text-white fw-bold px-3 d-flex align-items-center gap-2"
                                        onClick={() => onAddTask(asig)}
                                    >
                                        <Plus size={18} /> Agregar tarea
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
