import Task from "../models/task.model.js";

const taskDaos = {};

// Obtener todas (Admin)
taskDaos.getAll = async () => {
    return await Task.find()
        .populate('subject', 'name')
        .populate('group', 'name');
};

// Obtener una
taskDaos.getOne = async (id) => {
    return await Task.findById(id).populate('subject', 'name');
};

// Obtener tareas por ID de Grupo (La más importante)
taskDaos.getByGroupId = async (groupId) => {
    return await Task.find({ group: groupId })
        .populate('subject', 'name')
        .sort({ dueDate: 1 }); // Ordenadas por fecha
};

// Crear
taskDaos.create = async (data) => {
    return await Task.create(data);
};

// Actualizar
taskDaos.update = async (id, data) => {
    return await Task.findByIdAndUpdate(id, data, { new: true });
};

// Eliminar
taskDaos.delete = async (id) => {
    return await Task.findByIdAndDelete(id);
};

export default taskDaos;