import taskDaos from "../daos/task.daos.js";
import userDaos from "../daos/user.daos.js";
import groupDaos from "../daos/group.daos.js";

const taskControllers = {};

// Obtener todas
taskControllers.getAll = async (req, res) => {
    try {
        const tasks = await taskDaos.getAll();
        res.json({ data: tasks });
    } catch (error) {
        res.status(500).json({ message: "Error al obtener tareas", error });
    }
};

// Obtener una
taskControllers.getOne = async (req, res) => {
    try {
        const task = await taskDaos.getOne(req.params.task_id);
        if (!task) return res.status(404).json({ message: "Tarea no encontrada" });

        res.json({ data: task });
    } catch (error) {
        res.status(500).json({ message: "Error", error });
    }
};

// Insertar (solo jefe de grupo)
taskControllers.insertOne = async (req, res) => {
    try {
        const jefe = await userDaos.getByMatricula(req.user.matricula);

        if (!jefe || jefe.role !== "group_leader") {
            return res.status(403).json({ message: "No autorizado" });
        }

        const newTask = await taskDaos.insertOne({
            ...req.body,
            group: jefe.group,      // ← ahora sí correcto
            createdBy: jefe._id     // ← ID real del usuario
        });

        res.status(201).json({ message: "Tarea creada", data: newTask });

    } catch (error) {
        res.status(500).json({ message: "Error al insertar tarea", error });
    }
};

// Actualizar
taskControllers.updateOne = async (req, res) => {
    try {
        const updated = await taskDaos.updateOne(req.params.task_id, req.body);
        if (!updated) return res.status(404).json({ message: "Tarea no encontrada" });

        res.json({ message: "Tarea actualizada", data: updated });
    } catch (error) {
        res.status(500).json({ message: "Error", error });
    }
};

// Eliminar
taskControllers.deleteOne = async (req, res) => {
    try {
        const deleted = await taskDaos.deleteOne(req.params.task_id);
        if (!deleted) return res.status(404).json({ message: "Tarea no encontrada" });

        res.json({ message: "Tarea eliminada", data: deleted });
    } catch (error) {
        res.status(500).json({ message: "Error", error });
    }
};

// Obtener tareas por nombre de grupo (ej. 5A)
taskControllers.getByGrupo = async (req, res) => {
    try {
        const { grupo } = req.query;

        if (!grupo) {
            return res.status(400).json({ message: "Falta parámetro grupo" });
        }

        const group = await groupDaos.getByName(grupo);
        if (!group) {
            return res.status(404).json({ message: "Grupo no existe" });
        }

        const tasks = await taskDaos.getByGroup(group._id);
        res.json({ group, tasks });

    } catch (error) {
        res.status(500).json({ message: "Error", error });
    }
};

// Marcar como completada (solo student)
taskControllers.markCompleted = async (req, res) => {
    try {
        if (req.user.role !== "student") {
            return res.status(403).json({ message: "Solo alumnos pueden completar tareas" });
        }

        const updated = await taskDaos.markCompleted(req.params.task_id);

        if (!updated)
            return res.status(404).json({ message: "Tarea no encontrada" });

        res.json({ message: "Tarea completada", data: updated });

    } catch (error) {
        res.status(500).json({ message: "Error", error });
    }
};

export default taskControllers;
