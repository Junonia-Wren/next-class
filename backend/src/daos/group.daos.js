import { Group } from "../models/index.models.js";

const groupDaos = {};

// Buscar grupo por nombre (ej. "5A")
groupDaos.getByName = async (name) => {
    return await Group.findOne({ name });
};

export default groupDaos;
