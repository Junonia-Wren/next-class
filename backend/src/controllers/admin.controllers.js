import userDaos from "../daos/user.daos.js";
// Importamos Modelos DIRECTOS para las métricas (más rápido y seguro)
import User from "../models/user.model.js";
import Subject from "../models/subject.model.js";
import Activity from "../models/activity.model.js";

const adminControllers = {};

// =========================================================
// NUEVO: DATOS DEL DASHBOARD (Métricas y Actividad)
// =========================================================
// --- DATOS DEL DASHBOARD (Métricas y Actividad) ---
adminControllers.getDashboardData = async (req, res) => {
    try {
        // 1. CARD 1: Total Alumnos
        // CORRECCIÓN: Contamos a todos los que NO sean admin (Students + Chiefs)
        const totalAlumnos = await User.countDocuments({ role: { $ne: "admin" } });

        // 2. CARD 2: Total Asignaturas
        const totalAsignaturas = await Subject.countDocuments();

        // 3. CARD 3: Notificaciones (Total de actividades registradas)
        const totalNotificaciones = await Activity.countDocuments();

        // 4. LISTA DE ACTIVIDAD (Últimos 5 eventos)
        const recentActivity = await Activity.find()
            .sort({ createdAt: -1 }) // Del más nuevo al más viejo
            .limit(5);

        res.json({
            data: {
                stats: {
                    alumnos: totalAlumnos,
                    asignaturas: totalAsignaturas,
                    notificaciones: totalNotificaciones
                },
                activity: recentActivity
            }
        });

    } catch (error) {
        console.error("Error en Dashboard Admin:", error);
        res.status(500).json({ message: "Error al obtener datos del dashboard" });
    }
};


// =========================================================
// TUS FUNCIONES ANTIGUAS (GESTIÓN DE JEFES)
// =========================================================

// Obtener todos los jefes de grupo
adminControllers.getAllGroupLeaders = (req, res) => {
    userDaos.getAllGroupLeaders()
        .then((leaders) => {
            res.json({ data: leaders });
        })
        .catch((error) => {
            res.json({ message: "Ocurrió un error", error: error });
        });
};

// Obtener jefe de grupo por grupo
adminControllers.getGroupLeaderByGrupo = (req, res) => {
    userDaos.getGroupLeaderByGrupo(req.params.grupo)
        .then((leader) => {
            if (leader != null)
                res.json({ data: leader });
            else
                res.status(404).json({ data: { message: "No hay jefe en ese grupo" } });
        })
        .catch((error) => {
            res.json({ message: "Ocurrió un error", error: error });
        });
};

// Asignar jefe de grupo
adminControllers.asignarJefeGrupo = (req, res) => {
    const { matricula, grupo } = req.body;

    userDaos.getGroupLeaderByGrupo(grupo)
        .then((existingLeader) => {
            if (existingLeader) {
                res.status(400).json({
                    message: `Ya existe un jefe de grupo en ${grupo}`,
                    jefe: existingLeader
                });
            } else {
                userDaos.updateRoleByMatricula(matricula, "group_leader") // OJO: Tu DAO usa "group_leader", asegúrate de que sea consistente
                    .then((updatedUser) => {
                        if (updatedUser) {
                            res.status(200).json({
                                message: "Jefe de grupo asignado correctamente",
                                data: updatedUser
                            });
                        } else {
                            res.status(404).json({
                                message: "Usuario no encontrado"
                            });
                        }
                    })
                    .catch((error) => {
                        res.status(500).json({
                            message: "Error al asignar jefe de grupo",
                            error: error
                        });
                    });
            }
        })
        .catch((error) => {
            res.status(500).json({
                message: "Error al verificar jefe existente",
                error: error
            });
        });
};

// Actualizar jefe de grupo
adminControllers.updateJefeGrupo = (req, res) => {
    userDaos.updateOne(req.params.matricula, req.body)
        .then((updatedUser) => {
            if (updatedUser) {
                res.json({
                    message: "Jefe de grupo actualizado",
                    data: updatedUser
                });
            } else {
                res.status(404).json({
                    message: "Usuario no encontrado"
                });
            }
        })
        .catch((error) => {
            res.status(500).json({
                message: "Ocurrió un error al actualizar",
                error: error
            });
        });
};

// Eliminar jefe de grupo (cambiar rol a "alumno")
adminControllers.deleteJefeGrupo = (req, res) => {
    userDaos.updateRoleByMatricula(req.params.matricula, "alumno")
        .then((updatedUser) => {
            if (updatedUser) {
                res.json({
                    message: "Jefe de grupo eliminado",
                    data: updatedUser
                });
            } else {
                res.status(404).json({
                    message: "Usuario no encontrado"
                });
            }
        })
        .catch((error) => {
            res.status(500).json({
                message: "Ocurrió un error al eliminar jefe",
                error: error
            });
        });
};

export default adminControllers;