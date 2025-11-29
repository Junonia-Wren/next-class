import taskDaos from "../daos/task.daos.js";
import userDaos from "../daos/user.daos.js";

const taskControllers = {};

// Obtener todas las tareas
taskControllers.getAll = (req, res) => {
    taskDaos.getAll()
        .then((tasks) => {
            res.json({ data: tasks });
        })
        .catch((error) => {
            res.status(500).json({
                message: "Ocurrió un error al obtener las tareas",
                error: error
            });
        });
};

// Obtener una tarea por ID
taskControllers.getOne = (req, res) => {
    taskDaos.getOne(req.params.task_id)
        .then((task) => {
            if (task)
                res.json({ data: task });
            else
                res.status(404).json({ message: "Tarea no encontrada" });
        })
        .catch((error) => {
            res.status(500).json({
                message: "Ocurrió un error al buscar la tarea",
                error: error
            });
        });
};

// Insertar una nueva tarea (solo jefe de grupo)
taskControllers.insertOne = async (req, res) => {
    try {
        // Buscar al jefe por matrícula que viene en el token
        const jefe = await userDaos.getByMatricula(req.user.matricula);

        if (!jefe || jefe.role !== "jefe_grupo") {
            return res.status(403).json({ message: "No autorizado" });
        }

        const newTask = await taskDaos.insertOne({
            ...req.body,
            grupo: jefe.grupo,          //  se asigna automáticamente
            createdBy: jefe.matricula   // guardamos la matrícula como referencia
        });

        res.status(201).json({
            message: "Tarea creada correctamente",
            data: newTask
        });

    } catch (error) {
        console.error("Error al insertar tarea:", error);
        res.status(500).json({
            message: "Error al insertar la tarea",
            error: error.message
        });
    }
};

// Actualizar tarea por ID (solo jefe de grupo)
taskControllers.updateOne = (req, res) => {
    taskDaos.updateOne(req.params.task_id, req.body)
        .then((updatedTask) => {
            if (updatedTask) {
                res.json({
                    message: "Tarea actualizada correctamente",
                    data: updatedTask
                });
            } else {
                res.status(404).json({ message: "Tarea no encontrada" });
            }
        })
        .catch((error) => {
            res.status(400).json({
                message: "Error al actualizar la tarea",
                error: error
            });
        });
};

// Eliminar tarea por ID (solo jefe de grupo)
taskControllers.deleteOne = (req, res) => {
    taskDaos.deleteOne(req.params.task_id)
        .then((deletedTask) => {
            if (deletedTask) {
                res.json({
                    message: "Tarea eliminada correctamente",
                    data: deletedTask
                });
            } else {
                res.status(404).json({ message: "Tarea no encontrada" });
            }
        })
        .catch((error) => {
            res.status(500).json({
                message: "Error al eliminar la tarea",
                error: error
            });
        });
};

// Obtener tareas por grupo (para alumnos y jefe)
taskControllers.getByGrupo = (req, res) => {
    const { grupo } = req.query;

    if (!grupo) {
        return res.status(400).json({
            message: "Falta parámetro: grupo es requerido"
        });
    }

    taskDaos.getByGrupo(grupo)
        .then((tasks) => {
            res.json({ data: tasks });
        })
        .catch((error) => {
            res.status(500).json({
                message: "Error al obtener tareas por grupo",
                error: error
            });
        });
};

// Marcar tarea como completada (alumno)
taskControllers.markCompleted = (req, res) => {
    taskDaos.markCompleted(req.params.task_id)
        .then((task) => {
            if (task) {
                res.json({
                    message: "Tarea marcada como completada",
                    data: task
                });
            } else {
                res.status(404).json({ message: "Tarea no encontrada" });
            }
        })
        .catch((error) => {
            res.status(500).json({
                message: "Error al marcar tarea como completada",
                error: error
            });
        });
};

export default taskControllers;