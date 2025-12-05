import { Subject, Group } from "../models/index.models.js";

const subjectDaos = {};

// Crear materia
subjectDaos.create = async (data) => {
    return await Subject.create(data);
};

// Obtener todas
subjectDaos.getAll = async () => {
    return await Subject.find().populate("groups");
};

// Obtener una
subjectDaos.getOne = async (id) => {
    return await Subject.findById(id).populate("groups");
};

// Actualizar
subjectDaos.updateOne = async (id, data) => {
    return await Subject.findByIdAndUpdate(id, data, { new: true }).populate("groups");
};

// Eliminar
subjectDaos.deleteOne = async (id) => {
    return await Subject.findByIdAndDelete(id);
};

// Obtener materias por nombre de grupo ("5A")
subjectDaos.getByGroupName = async (groupName) => {
    const group = await Group.findOne({ name: groupName });
    if (!group) return null;

    return await Subject.find({ groups: group._id }).populate("groups");
};

export default subjectDaos;
