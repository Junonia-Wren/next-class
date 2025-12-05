import {User} from "../models/index.models.js";

const userDaos = {};

userDaos.create = async (data) => {
    const newUser = await User.create(data);
    return newUser;
};


// Obtener todos los jefes de grupo
userDaos.getAllGroupLeaders = async () => {
    const leaders = await User.find({ role: "group_leader" });
    return leaders;
};

// Obtener jefe de grupo por grupo, nivel, area
userDaos.getGroupLeaderByGrupo = async (area, nivel, grupo) => {
    const leader = await User.findOne({ group: groupId, role: "group_leader" })
    return leader;
};

// Asignar o eliminar jefe (actualiza el rol)
userDaos.updateRoleByMatricula = async (matricula, role) => {
    const updatedUser = await User.findOneAndUpdate(
        { matricula: matricula },
        { role: role },
        { new: true }
    );
    return updatedUser;
};

// Actualizar datos del jefe (nombre, grupo, carrera, etc.)
userDaos.updateOne = async (matricula, data) => {
    const updatedUser = await User.findOneAndUpdate(
        { matricula: matricula },
        data,
        { new: true }
    );
    return updatedUser;
};

// Buscar usuario por matrícula
userDaos.getByMatricula = async (matricula) => {
    const user = await User.findOne({ matricula: matricula });
    return user;
};

export default userDaos;