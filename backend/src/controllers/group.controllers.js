import groupDaos from "../daos/group.daos.js";

const groupControllers = {};

// Crear grupo
groupControllers.create = async (req, res) => {
    try {
        const group = await groupDaos.create(req.body);
        res.status(201).json({ message: "Grupo creado", data: group });
    } catch (error) {
        res.status(400).json({ message: "Error al crear grupo", error });
    }
};

// Obtener todos
groupControllers.getAll = async (req, res) => {
    try {
        const groups = await groupDaos.getAll();
        res.json({ data: groups });
    } catch (error) {
        res.status(500).json({ message: "Error", error });
    }
};

// Obtener por ID
groupControllers.getOne = async (req, res) => {
    try {
        const group = await groupDaos.getOne(req.params.id);
        if (!group) return res.status(404).json({ message: "Grupo no encontrado" });

        res.json({ data: group });
    } catch (error) {
        res.status(500).json({ message: "Error", error });
    }
};

// Buscar por nombre ("5A")
groupControllers.getByName = async (req, res) => {
    try {
        const group = await groupDaos.getByName(req.params.name);
        if (!group) return res.status(404).json({ message: "Grupo no encontrado" });

        res.json({ data: group });
    } catch (error) {
        res.status(500).json({ message: "Error", error });
    }
};

// Actualizar
groupControllers.updateOne = async (req, res) => {
    try {
        const updated = await groupDaos.updateOne(req.params.id, req.body);
        res.json({ message: "Grupo actualizado", data: updated });
    } catch (error) {
        res.status(400).json({ message: "Error al actualizar", error });
    }
};

// Eliminar
groupControllers.deleteOne = async (req, res) => {
    try {
        const deleted = await groupDaos.deleteOne(req.params.id);
        res.json({ message: "Grupo eliminado", data: deleted });
    } catch (error) {
        res.status(500).json({ message: "Error", error });
    }
};

export default groupControllers;
