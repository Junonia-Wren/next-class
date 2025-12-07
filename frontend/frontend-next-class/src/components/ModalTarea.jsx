import React, { useState } from "react";

export default function ModalTarea({ show, onClose, materia }) {
    const [titulo, setTitulo] = useState("");
    const [descripcion, setDescripcion] = useState("");

    if (!show) return null;

    return (
        <div
            className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
            style={{ background: "rgba(0,0,0,0.45)", zIndex: 2000 }}
        >
            <div
                className="bg-white p-4 rounded-4 shadow"
                style={{
                    width: "90%",
                    maxWidth: "450px",
                }}
            >
                <h4 className="fw-bold mb-3" style={{ color: "#007E8C" }}>
                    Nueva tarea – {materia}
                </h4>

                <div className="mb-3">
                    <label className="form-label fw-semibold">Título</label>
                    <input
                        type="text"
                        className="form-control"
                        value={titulo}
                        onChange={(e) => setTitulo(e.target.value)}
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label fw-semibold">Descripción</label>
                    <textarea
                        className="form-control"
                        rows="4"
                        value={descripcion}
                        onChange={(e) => setDescripcion(e.target.value)}
                    ></textarea>
                </div>

                <div className="d-flex justify-content-end gap-2 mt-3">
                    <button className="btn btn-secondary" onClick={onClose}>
                        Cancelar
                    </button>
                    <button className="btn btn-info text-white fw-bold">
                        Guardar
                    </button>
                </div>
            </div>
        </div>
    );
}
