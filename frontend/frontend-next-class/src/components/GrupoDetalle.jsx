import React, { useEffect, useState } from "react";
import adminService from "../services/adminService";
import { ArrowLeft, Crown, Trash2 } from "lucide-react";

const GrupoDetalle = ({ grupo, colors, onBack }) => {
    const [students, setStudents] = useState([]);
    const [leader, setLeader] = useState(null);

    // cargar datos
    const loadData = async () => {
        try {
            // Cargar alumnos
            const resStudents = await adminService.getStudents(grupo);
            setStudents(resStudents.data.data);

            // Cargar líder
            let leaderData = null;

            try {
                const resLeader = await adminService.getLeader(grupo);
                leaderData = resLeader.data.data;
            } catch (err) {
                if (err.response?.status === 404) {
                    leaderData = null; // No hay líder
                } else {
                    console.error("Error al obtener líder:", err);
                }
            }

            setLeader(leaderData);

        } catch (error) {
            console.error("Error al cargar datos del grupo", error);
        }
    };


    useEffect(() => {
        loadData();
    }, [grupo]);


    // Asignar jefe
    const assignLeader = async (matricula) => {
        try {
            await adminService.setLeader(matricula);
            loadData();
        } catch (e) {
            console.error("Error al asignar líder", e);
        }
    };

    // Quitar jefe
    const removeLeader = async () => {
        if (!leader) return;
        try {
            await adminService.deleteLeader(leader.matricula);
            loadData();
        } catch (e) {
            console.error("Error al eliminar jefe", e);
        }
    };


    return (
        <div>

            {/* HEADER */}
            <div style={{ display: "flex", alignItems: "center", marginBottom: 20 }}>
                <button
                    onClick={onBack}
                    style={{
                        background: "white",
                        border: "1px solid #eee",
                        borderRadius: "50%",
                        width: "40px",
                        height: "40px",
                        cursor: "pointer"
                    }}
                >
                    <ArrowLeft size={20} />
                </button>

                <h2 style={{ marginLeft: 15, color: colors.secondary }}>
                    Grupo {grupo}
                </h2>
            </div>

            {/* JEFE DE GRUPO */}
            <div style={{ padding: 20, borderRadius: 15, background: "white", marginBottom: 20 }}>
                <h3 style={{ color: colors.primary, marginBottom: 10 }}>
                    Jefe de Grupo
                </h3>

                {leader ? (
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontWeight: 600 }}>
                            {leader.name} ({leader.matricula})
                        </span>

                        <button
                            onClick={removeLeader}
                            style={{
                                background: "#FFEBEE",
                                border: "none",
                                padding: 8,
                                borderRadius: 8
                            }}
                        >
                            <Trash2 size={18} color="#D32F2F" />
                        </button>
                    </div>
                ) : (
                    <p style={{ color: "#777" }}>No hay jefe asignado</p>
                )}
            </div>

            {/* LISTA DE ALUMNOS */}
            <div style={{ padding: 20, borderRadius: 15, background: "white" }}>
                <h3 style={{ color: colors.secondary, marginBottom: 15 }}>Alumnos</h3>

                {students.map((s) => (
                    <div key={s._id} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #eee" }}>
                        <div>
                            <strong>{s.name}</strong>
                            <p style={{ margin: 0, color: "#777" }}>{s.matricula}</p>
                        </div>

                        <div>
                            {leader && leader.matricula === s.matricula ? (
                                <Crown size={24} color={colors.primary} />
                            ) : (
                                <button
                                    onClick={() => assignLeader(s.matricula)}
                                    style={{
                                        background: colors.primary,
                                        border: "none",
                                        padding: "8px 15px",
                                        borderRadius: 20,
                                        color: "white",
                                        fontWeight: 600
                                    }}
                                >
                                    Hacer Jefe
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

        </div>
    );
};

export default GrupoDetalle;
