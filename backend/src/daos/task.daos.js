import {Task} from "../models/index.models.js";
const taskDaos = {};

// Obtener todas las tareas
taskDaos.getAll = async () => {
    const tasks = await Task.find();
    return tasks;
};

// Obtener una tarea por ID
taskDaos.getOne = async (task_id) => {
    const task = await Task.findOne({ _id: task_id });
    return task;
};

// Insertar nueva tarea (el grupo se inyecta desde el jefe)
taskDaos.insertOne = async (data) => {
    const newTask = await Task.create(data);
    return newTask;
};

// Actualizar tarea por ID
taskDaos.updateOne = async (task_id, data) => {
    const taskUpdate = await Task.findOneAndUpdate(
        { _id: task_id },
        data,
        { new: true }
    );
    return taskUpdate;
};

// Eliminar tarea por ID
taskDaos.deleteOne = async (task_id) => {
    const taskDelete = await Task.findOneAndDelete({ _id: task_id });
    return taskDelete;
};

// Obtener tareas por grupo (para que alumnos/jefes consulten solo las suyas)
taskDaos.getByGrupo = async (grupo) => {
    const tasks = await Task.find({ grupo });
    return tasks;
};

// Marcar tarea como completada
taskDaos.markCompleted = async (task_id) => {
    const task = await Task.findOneAndUpdate(
        { _id: task_id },
        { completed: true },
        { new: true }
    );
    return task;
};

export default taskDaos;