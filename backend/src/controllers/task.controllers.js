import taskDaos from "../daos/task.daos.js";
import Group from "../models/group.model.js";
import Activity from "../models/activity.model.js";
import User from "../models/user.model.js"; // <--- IMPORTANTE: Necesitamos el modelo de usuario

const taskControllers = {};

// --- CONSULTAS ---

taskControllers.getAll = async (req, res) => {
    try {
        const tasks = await taskDaos.getAll();
        res.json({ data: tasks });
    } catch (error) {
        res.status(500).json({ message: "Error al obtener tareas", error: error.message });
    }
};

taskControllers.getOne = async (req, res) => {
    try {
        const task = await taskDaos.getOne(req.params.task_id);
        if (!task) return res.status(404).json({ message: "Tarea no encontrada" });
        res.json({ data: task });
    } catch (error) {
        res.status(500).json({ message: "Error", error: error.message });
    }
};

taskControllers.getByGrupo = async (req, res) => {
    try {
        const userId = req.user?.uid; 
        if (!userId) return res.status(400).json({ message: "Usuario no identificado" });

        const group = await Group.findOne({ students: userId });
        if (!group) return res.json({ data: [] });

        const tasks = await taskDaos.getByGroupId(group._id);
        res.json({ data: tasks });

    } catch (error) {
        res.status(500).json({ message: "Error cargando tareas", error: error.message });
    }
};

// --- ACCIONES ---

taskControllers.markCompleted = async (req, res) => {
    try {
        const { task_id } = req.params;
        const { completed } = req.body;
        
        const updated = await taskDaos.update(task_id, { completed });
        res.json({ message: "Estado actualizado", data: updated });
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar", error: error.message });
    }
};

// CREAR TAREA + REGISTRO DE ACTIVIDAD CON NOMBRE
taskControllers.insertOne = async (req, res) => {
    try {
        const { title, description, dueDate, subject } = req.body;
        const userId = req.user.uid;

        // 1. Buscar al Usuario para obtener su nombre
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

        // 2. Buscar el Grupo
        const group = await Group.findOne({ students: userId });
        if (!group) return res.status(400).json({ message: "No tienes grupo asignado" });

        const newTaskData = {
            title,
            description,
            dueDate,
            subject,
            group: group._id,
            createdBy: userId
        };

        // 3. Crear la Tarea
        const newTask = await taskDaos.create(newTaskData);

        // 4. Registrar Actividad (Ahora con el nombre del usuario)
        await Activity.create({
            type: 'TAREA',
            message: `Tarea creada: "${title}" por: ${user.name}` // <--- AQUÍ ESTÁ EL CAMBIO
        });

        res.status(201).json({ message: "Tarea creada", data: newTask });

    } catch (error) {
        console.error("Error creating task:", error);
        res.status(500).json({ message: "Error al crear tarea", error: error.message });
    }
};

taskControllers.updateOne = async (req, res) => {
    try {
        const updated = await taskDaos.update(req.params.task_id, req.body);
        res.json({ message: "Tarea actualizada", data: updated });
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar", error: error.message });
    }
};

taskControllers.deleteOne = async (req, res) => {
    try {
        await taskDaos.delete(req.params.task_id);
        res.json({ message: "Tarea eliminada" });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar", error: error.message });
    }
};

export default taskControllers;