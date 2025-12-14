import React, { useEffect, useState } from "react";
import AdminService from "../services/adminService";
import GroupService from "../services/groupService";

export default function JefesGrupo({ colors }) {

    const [leaders, setLeaders] = useState([]);
    const [groups, setGroups] = useState([]);

    const [matricula, setMatricula] = useState("");
    const [selectedGroup, setSelectedGroup] = useState("");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // -----------------------------------
    // 1. Cargar líderes de grupo
    // -----------------------------------
    const loadLeaders = async () => {
        try {
            const res = await AdminService.getAllLeaders();
            setLeaders(res.data.data || []);
        } catch (err) {
            setError("Error cargando jefes de grupo");
        }
    };

    // -----------------------------------
    // 2. Cargar grupos para el select
    // -----------------------------------
    const loadGroups = async () => {
        try {
            const res = await GroupService.getAll();
            setGroups(res.data.data || []);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        Promise.all([loadLeaders(), loadGroups()]).then(() => setLoading(false));
    }, []);

    // -----------------------------------
    // 3. Asignar jefe
    // -----------------------------------
    const handleAsignar = async (e) => {
        e.preventDefault();
        if (!matricula || !selectedGroup) return;

        try {
            await AdminService.asignarJefe(matricula, selectedGroup);
            setMatricula("");
            setSelectedGroup("");
            loadLeaders();
        } catch (err) {
            console.log(err);
        }
    };

    // -----------------------------------
    // 4. Eliminar jefe
    // -----------------------------------
    const handleEliminar = async (mat) => {
        if (!confirm("¿Eliminar este jefe de grupo?")) return;

        try {
            await AdminService.deleteJefe(mat);
            loadLeaders();
        } catch (err) {
            console.log(err);
        }
    };


    if (loading) return <p>Cargando...</p>;

    return (
        <div style={{ animation: "fadeIn .4s ease-out" }}>
            <h1 style={{ color: colors.secondary, fontWeight: "bold" }}>Jefes de Grupo</h1>
            <p style={{ color: "#666" }}>Administración de líderes por grupo.</p>

            {/* ------------------------------------------------------------- */}
            {/* FORMULARIO PARA ASIGNAR JEFE */}
            {/* ------------------------------------------------------------- */}
            <div style={{
                background: "white",
                padding: "20px",
                marginTop: "20px",
                borderRadius: "15px",
                boxShadow: "0 3px 10px rgba(0,0,0,0.05)",
                border: "1px solid #eee"
            }}>
                <h2 style={{ marginBottom: "10px", fontSize: "1.2rem" }}>Asignar Nuevo Jefe</h2>

                <form onSubmit={handleAsignar} style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
                    <input
                        type="text"
                        placeholder="Matrícula del alumno"
                        value={matricula}
                        onChange={(e) => setMatricula(e.target.value)}
                        style={{
                            padding: "10px",
                            borderRadius: "10px",
                            border: "1px solid #ccc",
                            flex: "1"
                        }}
                    />

                    <select
                        value={selectedGroup}
                        onChange={(e) => setSelectedGroup(e.target.value)}
                        style={{
                            padding: "10px",
                            borderRadius: "10px",
                            border: "1px solid #ccc",
                            flex: "1",
                            background: "white"
                        }}
                    >
                        <option value="">Seleccionar Grupo</option>
                        {groups.map((g) => (
                            <option key={g._id} value={g._id}>
                                {g.name} · {g.area}
                            </option>
                        ))}
                    </select>

                    <button
                        type="submit"
                        style={{
                            background: colors.primary,
                            color: "white",
                            border: "none",
                            padding: "10px 20px",
                            borderRadius: "10px",
                            cursor: "pointer"
                        }}
                    >
                        Asignar
                    </button>
                </form>
            </div>

            {/* ------------------------------------------------------------- */}
            {/* LISTA DE JEFES EN FORMATO DE TARJETAS */}
            {/* ------------------------------------------------------------- */}
            <div style={{ marginTop: "30px" }}>
                <h2 style={{ marginBottom: "15px" }}>Lista Actual</h2>

                <div style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "20px"
                }}>
                    {leaders.length === 0 && <p>No hay jefes asignados.</p>}

                    {leaders.map((leader) => (
                        <div key={leader.matricula} style={{
                            background: "white",
                            padding: "20px",
                            borderRadius: "15px",
                            width: "260px",
                            border: "1px solid #eee",
                            boxShadow: "0 3px 10px rgba(0,0,0,0.05)"
                        }}>
                            <h3 style={{ margin: "0 0 5px 0", color: colors.secondary }}>
                                {leader.name}
                            </h3>
                            <p style={{ margin: 0, color: "#666" }}>Matrícula: {leader.matricula}</p>
                            <p style={{ margin: 0, color: "#666" }}>
                                Grupo: {leader.group ? leader.group.name : "No asignado"}
                            </p>

                            <button
                                onClick={() => handleEliminar(leader.matricula)}
                                style={{
                                    marginTop: "15px",
                                    background: "#e74c3c",
                                    color: "white",
                                    border: "none",
                                    padding: "8px 15px",
                                    borderRadius: "10px",
                                    cursor: "pointer",
                                    width: "100%"
                                }}
                            >
                                Eliminar
                            </button>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
}
