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

// Obtener uno por ID
groupDaos.getOne = async (id) => {
    return await Group.findById(id);
};

// Buscar por nombre ("5A")
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

export default groupDaos;
