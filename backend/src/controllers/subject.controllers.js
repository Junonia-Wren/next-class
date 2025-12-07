import subjectDaos from "../daos/subject.daos.js";

const subjectControllers = {};

// Crear materia
subjectControllers.create = async (req, res) => {
    try {
        const subject = await subjectDaos.create(req.body);
        res.status(201).json({ message: "Materia creada", data: subject });
    } catch (error) {
        res.status(400).json({ message: "Error al crear materia", error });
    }
};

// Obtener todas
subjectControllers.getAll = async (req, res) => {
    try {
        const data = await subjectDaos.getAll();
        res.json({ data });
    } catch (error) {
        res.status(500).json({ message: "Error", error });
    }
};

// Obtener una
subjectControllers.getOne = async (req, res) => {
    try {
        const subject = await subjectDaos.getOne(req.params.id);
        if (!subject) return res.status(404).json({ message: "Materia no encontrada" });

        res.json({ data: subject });
    } catch (error) {
        res.status(500).json({ message: "Error", error });
    }
};

// Obtener materias por grupo ("5A")
subjectControllers.getByGroupName = async (req, res) => {
    try {
        const data = await subjectDaos.getByGroupName(req.params.groupName);

        if (!data)
            return res.status(404).json({ message: "Grupo no existe o no tiene materias" });

        res.json({ data });
    } catch (error) {
        res.status(500).json({ message: "Error", error });
    }
};

// Actualizar
subjectControllers.updateOne = async (req, res) => {
    try {
        const updated = await subjectDaos.updateOne(req.params.id, req.body);
        res.json({ message: "Materia actualizada", data: updated });
    } catch (error) {
        res.status(400).json({ message: "Error al actualizar", error });
    }
};

// Eliminar
subjectControllers.deleteOne = async (req, res) => {
    try {
        const deleted = await subjectDaos.deleteOne(req.params.id);
        res.json({ message: "Materia eliminada", data: deleted });
    } catch (error) {
        res.status(500).json({ message: "Error", error });
    }
};

export default subjectControllers;
