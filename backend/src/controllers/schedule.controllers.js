import scheduleDaos from "../daos/schedule.daos.js";
import userDaos from "../daos/user.daos.js";
import groupDaos from "../daos/group.daos.js";

const scheduleControllers = {};

// Obtener todos
scheduleControllers.getAll = async (req, res) => {
    try {
        const data = await scheduleDaos.getAll();
        res.json({ data });
    } catch (error) {
        res.status(500).json({ message: "Error", error });
    }
};

// Obtener uno
scheduleControllers.getOne = async (req, res) => {
    try {
        const schedule = await scheduleDaos.getOne(req.params.schedule_id);
        if (!schedule) return res.status(404).json({ message: "No encontrado" });

        res.json({ data: schedule });
    } catch (error) {
        res.status(500).json({ message: "Error", error });
    }
};

// Insertar
scheduleControllers.insertOne = async (req, res) => {
    try {
        const { group, subject, teacher, day, startTime, endTime } = req.body;

        const conflict = await scheduleDaos.findTimeConflict(group, day, startTime, endTime);

        if (conflict) {
            return res.status(409).json({ message: "Conflicto de horario", conflict });
        }

        const newSchedule = await scheduleDaos.insertOne(req.body);
        res.status(201).json({ message: "Creado", data: newSchedule });

    } catch (error) {
        res.status(500).json({ message: "Error", error });
    }
};

// Actualizar
scheduleControllers.updateOne = async (req, res) => {
    try {
        const updated = await scheduleDaos.updateOne(req.params.schedule_id, req.body);
        if (!updated) return res.status(404).json({ message: "No encontrado" });

        res.json({ message: "Actualizado", data: updated });
    } catch (error) {
        res.status(500).json({ message: "Error", error });
    }
};

// Eliminar
scheduleControllers.deleteOne = async (req, res) => {
    try {
        const deleted = await scheduleDaos.deleteOne(req.params.schedule_id);
        if (!deleted) return res.status(404).json({ message: "No encontrado" });

        res.json({ message: "Eliminado", data: deleted });
    } catch (error) {
        res.status(500).json({ message: "Error", error });
    }
};

scheduleControllers.getByGrupoName = async (req, res) => {
    try {
        const { name } = req.query;

        if (!name) {
            return res.status(400).json({
                message: "Falta el parámetro name (ej: name=5A)"
            });
        }

        // 1. Obtener grupo mediante DAO
        const grupo = await groupDaos.getByName(name);
        if (!grupo) {
            return res.status(404).json({
                message: `El grupo '${name}' no existe`
            });
        }

        // 2. Obtener horarios por ID mediante DAO
        const horarios = await scheduleDaos.getByGroup(grupo._id);

        res.json({
            group: grupo,
            horarios
        });

    } catch (error) {
        res.status(500).json({
            message: "Error al obtener horarios por nombre de grupo",
            error
        });
    }
};

// Obtener horario de un alumno
scheduleControllers.getHorarioAlumno = async (req, res) => {
    try {
        const alumno = await userDaos.getByMatricula(req.params.matricula);
        if (!alumno) return res.status(404).json({ message: "Alumno no encontrado" });

        if (!alumno.group)
            return res.status(400).json({ message: "Este alumno no tiene grupo asignado" });

        const horarios = await scheduleDaos.getByGroup(alumno.group);

        res.json({ grupo: alumno.group, horarios });

    } catch (error) {
        res.status(500).json({ message: "Error", error });
    }
};

export default scheduleControllers;
