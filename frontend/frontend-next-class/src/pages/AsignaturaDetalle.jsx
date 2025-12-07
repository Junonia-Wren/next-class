import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import BottomNav from "../components/BottomNav";
import ProfesoraMay from "../assets/Mayra.jpeg";

export default function AsignaturaDetalle() {
    const navigate = useNavigate();

    const data = {
        nombre: "Gestión de Proyectos II",
        profesorFoto: ProfesoraMay,
        porcentajes: {
            ser: { valor: 40, descripcion: "Tareas, participación, Actitud y Responsabilidad" },
            saber: { valor: 10, descripcion: "Examen teórico" },
            saberHacer: { valor: 50, descripcion: "Proyecto final integrador" }
        },
        unidades: [
            { porcentaje: 30, fechas: "8 Septiembre al 30 de Octubre" },
            { porcentaje: 70, fechas: "2 Noviembre al 19 de Diciembre" }
        ],
        notas: "Se tendrá en cuenta asistencia mínima del 80% para poder ser evaluado."
    };

    return (
        <div
            className="container-fluid px-3"
            style={{
                backgroundColor: "#F5F7FA",
                minHeight: "100vh",
                paddingBottom: "80px" // evita que el BottomNav tape contenido
            }}
        >

            {/* 🔵 BARRA SUPERIOR TURQUESA COMO EL LISTADO */}
            <div
                className="w-100 p-4 text-center"
                style={{
                    background: "linear-gradient(90deg, #00B8C8, #007E8C)",
                    color: "white",
                    borderRadius: "0 0 20px 20px",
                    marginBottom: "20px"
                }}
            >
                <button
                    onClick={() => navigate("/asignaturas")}
                    className="btn position-absolute"
                    style={{
                        left: "20px",
                        top: "20px",
                        background: "rgba(255,255,255,0.2)",
                        color: "white",
                        borderRadius: "50%",
                        width: "40px",
                        height: "40px"
                    }}
                >
                    <ArrowLeft size={20} />
                </button>

                <h2 className="fw-bold m-0">{data.nombre}</h2>
            </div>

            {/* 📌 CARD PRINCIPAL */}
            <div
                className="mx-auto p-4 shadow-sm"
                style={{
                    background: "white",
                    borderRadius: "25px",
                    maxWidth: "600px"
                }}
            >
                {/* FOTO DOCENTE */}
                <div className="text-center mt-2 mb-3">
                    <img
                        src={data.profesorFoto}
                        alt="Docente"
                        style={{
                            width: "150px",
                            height: "150px",
                            borderRadius: "50%",
                            objectFit: "cover",
                            border: "6px solid #00B8C8",
                            padding: "2px"
                        }}
                    />
                </div>

                {/* PILLS */}
                <div className="d-flex justify-content-center gap-2 mb-4">
                    <span
                        style={{
                            background: "#7C264A",
                            color: "white",
                            padding: "8px 20px",
                            borderRadius: "20px",
                            fontSize: "0.9rem"
                        }}
                    >
                        Asesorías
                    </span>

                    <span
                        style={{
                            background: "#00B8C8",
                            color: "white",
                            padding: "8px 20px",
                            borderRadius: "20px",
                            fontSize: "0.9rem"
                        }}
                    >
                        Cronograma del docente
                    </span>
                </div>

                {/* PORCENTAJES */}
                <h5 className="fw-bold">Porcentajes de evaluación</h5>

                {Object.entries(data.porcentajes).map(([key, item]) => (
                    <div key={key} className="d-flex mt-2 mb-2" style={{ fontSize: "0.9rem" }}>
                        <strong
                            style={{
                                width: "150px",
                                textTransform: "capitalize"
                            }}
                        >
                            {key} – {item.valor}%
                        </strong>

                        <div
                            style={{
                                borderLeft: "4px solid #00B8C8",
                                paddingLeft: "12px"
                            }}
                        >
                            {item.descripcion}
                        </div>
                    </div>
                ))}

                {/* UNIDADES */}
                <h5 className="fw-bold mt-4">Unidades</h5>

                {data.unidades.map((u, i) => (
                    <div key={i} className="d-flex mt-2 mb-2" style={{ fontSize: "0.9rem" }}>
                        <strong style={{ width: "150px" }}>
                            Unidad {i + 1} – {u.porcentaje}%
                        </strong>

                        <div
                            style={{
                                borderLeft: "4px solid #ddd",
                                paddingLeft: "12px"
                            }}
                        >
                            {u.fechas}
                        </div>
                    </div>
                ))}

                {/* NOTAS */}
                <h5 className="fw-bold mt-4">Notas</h5>
                <p style={{ fontSize: "0.9rem" }}>{data.notas}</p>

            </div>

            {/* 🔻 MENÚ INFERIOR */}
            <BottomNav />
        </div>
    );
}
