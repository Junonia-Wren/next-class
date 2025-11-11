import scheduleDaos from "../daos/schedule.daos.js";
import userDaos from "../daos/user.daos.js";

const scheduleControllers = {};

// Obtener todos los horarios
scheduleControllers.getAll = (req, res) => {
    scheduleDaos.getAll()
        .then((schedules) => {
            res.json({ data: schedules });
        })
        .catch((error) => {
            res.status(500).json({
                message: "Ocurrió un error al obtener los horarios",
                error: error
            });
        });
};

// Obtener un horario por ID
scheduleControllers.getOne = (req, res) => {
    scheduleDaos.getOne(req.params.schedule_id)
        .then((schedule) => {
            if (schedule)
                res.json({ data: schedule });
            else
                res.status(404).json({ message: "Horario no encontrado" });
        })
        .catch((error) => {
            res.status(500).json({
                message: "Ocurrió un error al buscar el horario",
                error: error
            });
        });
};

// Insertar un nuevo horario (solo admin)
scheduleControllers.insertOne = async (req, res) => {
    const { area, nivel, grupo, day, startTime, endTime } = req.body;

    try {
        const conflict = await scheduleDaos.findTimeConflict(area, nivel, grupo, day, startTime, endTime);

        if (conflict) {
            return res.status(409).json({
                message: "Conflicto de horario: ya existe un horario que se cruza en ese grupo, día y hora",
                conflict: conflict
            });
        }

        const newSchedule = await scheduleDaos.insertOne(req.body);
        res.status(201).json({
            message: "Horario insertado correctamente",
            data: newSchedule
        });

    } catch (error) {
        res.status(500).json({
            message: "Error al insertar el horario",
            error: error
        });
    }
};

// Actualizar horario por ID (solo admin)
scheduleControllers.updateOne = (req, res) => {
    scheduleDaos.updateOne(req.params.schedule_id, req.body)
        .then((updatedSchedule) => {
            if (updatedSchedule) {
                res.json({
                    message: "Horario actualizado correctamente",
                    data: updatedSchedule
                });
            } else {
                res.status(404).json({ message: "Horario no encontrado" });
            }
        })
        .catch((error) => {
            res.status(400).json({
                message: "Error al actualizar el horario",
                error: error
            });
        });
};

// Eliminar horario por ID (solo admin)
scheduleControllers.deleteOne = (req, res) => {
    scheduleDaos.deleteOne(req.params.schedule_id)
        .then((deletedSchedule) => {
            if (deletedSchedule) {
                res.json({
                    message: "Horario eliminado correctamente",
                    data: deletedSchedule
                });
            } else {
                res.status(404).json({ message: "Horario no encontrado" });
            }
        })
        .catch((error) => {
            res.status(500).json({
                message: "Error al eliminar el horario",
                error: error
            });
        });
};

// Obtener horarios por grupo completo (area, nivel, grupo)
scheduleControllers.getByGrupo = (req, res) => {
    const { area, nivel, grupo } = req.query;

    if (!area || !nivel || !grupo) {
        return res.status(400).json({
            message: "Faltan parámetros: area, nivel y grupo son requeridos"
        });
    }

    scheduleDaos.getByGrupo(area, nivel, grupo)
        .then((schedules) => {
            res.json({ data: schedules });
        })
        .catch((error) => {
            res.status(500).json({
                message: "Error al obtener horarios por grupo",
                error: error
            });
        });
};
//consultar horarios


scheduleControllers.getHorarioAlumno = async (req, res) => {
    const { matricula } = req.params;

    try {
        const alumno = await userDaos.getByMatricula(matricula);
        if (!alumno || alumno.role !== "alumno") {
            return res.status(404).json({ message: "Alumno no encontrado" });
        }

        const { area, nivel, grupo } = alumno;
        const horarios = await scheduleDaos.getByGrupo(area, nivel, grupo);

        res.json({
            message: "Horario del alumno",
            grupo: `${area} ${nivel} ${grupo}`,
            horarios: horarios
        });

    } catch (error) {
        res.status(500).json({ message: "Error al obtener horario", error });
    }
};

export default scheduleControllers;