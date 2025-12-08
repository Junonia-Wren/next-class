import { User, Group } from "../models/index.models.js";

const userDaos = {};

// Crear usuario
userDaos.create = async (data) => {
    return await User.create(data);
};

// Obtener todos los jefes de grupo
userDaos.getAllGroupLeaders = async () => {
    return await User.find({ role: "group_leader" }).populate("group");
};

// Obtener jefe por nombre del grupo (ej. "5A")
userDaos.getGroupLeaderByGrupo = async (groupName) => {
    const group = await Group.findOne({ name: groupName });
    if (!group) return null;

    return await User.findOne({ group: group._id, role: "group_leader" }).populate("group");
};

// Asignar rol
userDaos.updateRoleByMatricula = async (matricula, role) => {
    return await User.findOneAndUpdate(
        { matricula },
        { role },
        { new: true }
    ).populate("group");
};

// Actualizar datos
userDaos.updateOne = async (matricula, data) => {

    // Si está cambiando el grupo por nombre ("5A")
    if (data.group) {
        const group = await Group.findOne({ name: data.group });
        data.group = group ? group._id : null;
    }

    return await User.findOneAndUpdate(
        { matricula },
        data,
        { new: true }
    ).populate("group");
};

// Buscar usuario
userDaos.getByMatricula = async (matricula) => {
    return await User.findOne({ matricula }).populate("group");
};

// Obtener todos los alumnos por nombre de grupo
userDaos.getStudentsByGrupo = async (groupName) => {
    const group = await Group.findOne({ name: groupName });
    if (!group) return [];

    return await User.find({ group: group._id }).populate("group");
};

export default userDaos;
