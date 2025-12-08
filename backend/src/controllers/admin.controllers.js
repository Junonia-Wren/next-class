import userDaos from "../daos/user.daos.js";
import { User } from "../models/index.models.js";

const adminControllers = {};

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
                userDaos.updateRoleByMatricula(matricula, "group_leader")
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

// Obtener todos los alumnos de un grupo
adminControllers.getStudentsByGrupo = (req, res) => {
    userDaos.getStudentsByGrupo(req.params.grupo)
        .then((students) => {
            res.json({ data: students });
        })
        .catch((error) => {
            res.status(500).json({
                message: "Error al obtener alumnos del grupo",
                error
            });
        });
};

adminControllers.setLeader = async (req, res) => {
    const { matricula } = req.params;

    try {
        console.log("Si llego");
        // 1. Buscar usuario por matrícula
        const user = await User.findOne({ matricula }).populate("group");
        console.log("Si llego");
        if (!user)
            return res.status(404).json({ message: "Usuario no encontrado" });

        if (!user.group)
            return res.status(400).json({
                message: "El usuario no pertenece a ningún grupo"
            });

        const groupId = user.group._id;

        // 2. Buscar si ya existe líder del mismo grupo
        const currentLeader = await User.findOne({
            group: groupId,
            role: "group_leader"
        });
        console.log("Si llego");
        // 3. Si ya existe líder → bajarlo a student
        if (currentLeader) {
            await User.findOneAndUpdate(
                { matricula: currentLeader.matricula },
                { role: "student" }
            );
        }

        // 4. Promover nuevo líder
        const updated = await User.findOneAndUpdate(
            { matricula },
            { role: "group_leader" },
            { new: true }
        ).populate("group");

        res.json({
            message: "Nuevo jefe de grupo asignado",
            data: updated
        });

    } catch (error) {
        res.status(500).json({
            message: "Error interno al asignar líder",
            error:error.message
        });
    }
};

adminControllers.getTeachers = async (req, res) => {
    try {
        const teachers = await User.find({ role: "teacher" })
            .select("_id name matricula");

        res.json({ data: teachers });
    } catch (error) {
        res.status(500).json({ message: "Error al obtener profesores", error });
    }
};


export default adminControllers;