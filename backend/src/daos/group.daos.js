import { Group } from "../models/index.models.js";

const groupDaos = {};

// Crear grupo
groupDaos.create = async (data) => {
    return await Group.create(data);
};

// Obtener todos
groupDaos.getAll = async () => {
    return await Group.find();
};

groupDaos.getUniqueAreas = async () => {
    // "distinct" busca todos los valores únicos del campo "area"
    return await Group.distinct("area");
};

// Obtener uno por ID (Simple, para editar datos del grupo)
groupDaos.getOne = async (id) => {
    return await Group.findById(id);
};

// --- NUEVO: Obtener uno con Alumnos (Para la lista de asistencia) ---
groupDaos.getOneWithStudents = async (id) => {
    return await Group.findById(id)
        .populate('students', 'matricula name role email'); // Trae datos reales del usuario
};

// Buscar por nombre
groupDaos.getByName = async (name) => {
    return await Group.findOne({ name });
};

// Actualizar
groupDaos.updateOne = async (id, data) => {
    return await Group.findByIdAndUpdate(id, data, { new: true });
};

// Eliminar
groupDaos.deleteOne = async (id) => {
    return await Group.findByIdAndDelete(id);
};

// --- NUEVOS: Operaciones de Alumnos (Sin usar Model directo en controller) ---
groupDaos.removeStudent = async (groupId, userId) => {
    return await Group.findByIdAndUpdate(groupId, {
        $pull: { students: userId }
    }, { new: true });
};

export default groupDaos;