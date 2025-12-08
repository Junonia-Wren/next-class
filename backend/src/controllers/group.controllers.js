import groupDaos from "../daos/group.daos.js";
// Solo importamos User para el cambio de rol (que es ajeno al grupo en sí)
import User from "../models/user.model.js"; 

const groupControllers = {};

// --- TRADUCTOR (Backend -> Frontend) ---
const mapToFrontend = (doc) => {
    if (!doc) return null;
    const g = doc._doc || doc;
    return {
        id: g._id,
        nivel: g.level,
        area: g.area,
        grupo: g.name,
        studentCount: g.students?.length || 0,
        students: g.students || [] 
    };
};

// --- CRUD ---

groupControllers.create = async (req, res) => {
    try {
        const dataToSave = {
            level: req.body.nivel,
            area: req.body.area,
            name: req.body.grupo
        };
        const group = await groupDaos.create(dataToSave);
        res.status(201).json({ message: "Grupo creado", data: mapToFrontend(group) });
    } catch (error) {
        res.status(400).json({ message: "Error", error: error.message });
    }
};

groupControllers.getAll = async (req, res) => {
    try {
        const groups = await groupDaos.getAll();
        const data = groups.map(g => mapToFrontend(g));
        res.json({ data });
    } catch (error) {
        res.status(500).json({ message: "Error", error: error.message });
    }
};

// Esta función es para editar los datos de cabecera (Nombre, Area)
groupControllers.getOne = async (req, res) => {
    try {
        const group = await groupDaos.getOne(req.params.id);
        if (!group) return res.status(404).json({ message: "No encontrado" });
        res.json({ data: mapToFrontend(group) });
    } catch (error) {
        res.status(500).json({ message: "Error", error: error.message });
    }
};

// --- FUNCIONES ESPECIALES ---

// 1. Obtener lista de asistencia (Con Alumnos)
groupControllers.getOneWithStudents = async (req, res) => {
    try {
        // Usamos la nueva función del DAO
        const group = await groupDaos.getOneWithStudents(req.params.id);
        if (!group) return res.status(404).json({ message: "No encontrado" });
        res.json({ data: mapToFrontend(group) });
    } catch (error) {
        res.status(500).json({ message: "Error", error: error.message });
    }
};

// 2. Cambiar Rol (Jefe de Grupo)
// ... imports ...

// 2. Cambiar Rol (Jefe de Grupo)
groupControllers.toggleStudentRole = async (req, res) => {
    try {
        const { userId } = req.body;
        console.log("Intentando cambiar rol al ID:", userId); // <--- DEBUG

        if (!userId) {
            return res.status(400).json({ message: "Falta el userId" });
        }

        const user = await User.findById(userId);
        if(!user) {
            console.log("Usuario no encontrado en BD");
            return res.status(404).json({message: "Usuario no encontrado"});
        }

        // Toggle: Si es chief -> student, si es student -> chief
        const oldRole = user.role;
        user.role = user.role === 'chief' ? 'student' : 'chief';
        
        await user.save(); // <--- Aquí suele fallar si el ENUM no permite 'chief'

        console.log(`Rol actualizado: ${oldRole} -> ${user.role}`);
        res.json({ message: "Rol actualizado", newRole: user.role });

    } catch (error) {
        console.error("Error CRÍTICO al cambiar rol:", error); // <--- Esto saldrá en tu terminal
        res.status(500).json({ message: "Error interno", error: error.message });
    }
};

// ... resto del archivo ...

// 3. Eliminar alumno del grupo
groupControllers.removeStudent = async (req, res) => {
    try {
        const { groupId, userId } = req.body;
        await groupDaos.removeStudent(groupId, userId);
        res.json({ message: "Alumno removido" });
    } catch (error) {
        res.status(500).json({ message: "Error", error: error.message });
    }
};

// Básicos restantes...
groupControllers.updateOne = async (req, res) => {
    try {
        // Mapeo manual para asegurar que los datos pasen
        const dataToUpdate = {};
        
        // Si el frontend manda 'nivel', lo guardamos como 'level'
        if (req.body.nivel) dataToUpdate.level = req.body.nivel;
        
        // Si el frontend manda 'area', lo guardamos como 'area'
        if (req.body.area) dataToUpdate.area = req.body.area;
        
        // OJO: Si el frontend manda 'grupo', lo guardamos como 'name' en la BD
        if (req.body.grupo) dataToUpdate.name = req.body.grupo;

        const updated = await groupDaos.updateOne(req.params.id, dataToUpdate);
        res.json({ message: "Grupo actualizado", data: mapToFrontend(updated) });
    } catch (error) {
        res.status(400).json({ message: "Error al actualizar", error: error.message });
    }
};

groupControllers.deleteOne = async (req, res) => { 
    await groupDaos.deleteOne(req.params.id);
    res.json({ message: "Eliminado" });
};
groupControllers.getByName = async (req, res) => { /* Tu lógica existente... */ };

// NUEVO: Obtener áreas únicas para el select del Registro (Público)
groupControllers.getUniqueAreas = async (req, res) => {
    try {
        // Llamamos al DAO
        const areas = await groupDaos.getUniqueAreas();
        
        // Filtramos nulos y ordenamos alfabéticamente
        const cleanAreas = areas.filter(a => a).sort();
        
        res.json({ data: cleanAreas });
    } catch (error) {
        console.error("Error en getUniqueAreas:", error);
        res.status(500).json({ message: "Error cargando áreas", error: error.message });
    }
};

export default groupControllers;