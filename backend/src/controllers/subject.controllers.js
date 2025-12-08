// IMPORTANTE: Importamos el Modelo directamente para evitar errores en el DAO
import Subject from '../models/subject.model.js';

const subjectControllers = {};

// --- 1. DE FRONTEND A BACKEND (Limpieza de entrada) ---
const mapToBackend = (data) => {
    // Protección contra undefined
    const p = data.porcentajes || {};
    const u = data.unidades || [];

    return {
        name: data.nombre,
        teacher: data.teacherName, 
        teacherImage: data.profesorFoto,
        
        // Mapeo seguro: Si es "" (vacío), guardamos 0.
        porcentajes: {
            ser: {
                valor: p.ser?.valor === "" ? 0 : Number(p.ser?.valor || 0),
                descripcion: p.ser?.descripcion || ""
            },
            saber: {
                valor: p.saber?.valor === "" ? 0 : Number(p.saber?.valor || 0),
                descripcion: p.saber?.descripcion || ""
            },
            saberHacer: {
                valor: p.saberHacer?.valor === "" ? 0 : Number(p.saberHacer?.valor || 0),
                descripcion: p.saberHacer?.descripcion || ""
            }
        },

        unidades: u.map(item => ({
            id: item.id,
            porcentaje: item.porcentaje === "" ? 0 : Number(item.porcentaje || 0),
            fechas: item.fechas || ""
        })),

        notas: data.notas || ""
    };
};

// --- 2. DE BACKEND A FRONTEND (Limpieza de salida) ---
const mapToFrontend = (doc) => {
    if (!doc) return null;
    // Aseguramos acceso a los datos sea un documento Mongoose u objeto plano
    const data = doc._doc || doc; 

    // Protección extrema: Si un campo no existe en BD, ponemos default para que React no falle
    const p = data.porcentajes || {};
    const u = data.unidades || [];

    return {
        id: data._id, 
        nombre: data.name || "Sin Nombre",
        teacherName: data.teacher || "Sin Profesor",
        profesorFoto: data.profesorFoto || "", // URL o vacío
        
        porcentajes: {
            ser: { 
                valor: p.ser?.valor || 0, 
                descripcion: p.ser?.descripcion || "" 
            },
            saber: { 
                valor: p.saber?.valor || 0, 
                descripcion: p.saber?.descripcion || "" 
            },
            saberHacer: { 
                valor: p.saberHacer?.valor || 0, 
                descripcion: p.saberHacer?.descripcion || "" 
            }
        },
        
        // Mapeamos las unidades asegurando que siempre existan
        unidades: u.length > 0 ? u.map(item => ({
            id: item.id || Math.random(), // Fallback ID
            porcentaje: item.porcentaje || 0,
            fechas: item.fechas || ""
        })) : [ // Si no hay unidades en BD, devolvemos estructura vacía para el form
            { id: 1, porcentaje: "", fechas: "" },
            { id: 2, porcentaje: "", fechas: "" },
            { id: 3, porcentaje: "", fechas: "" },
            { id: 4, porcentaje: "", fechas: "" }
        ],
        
        notas: data.notas || ""
    };
};


// --- CRUD ---

subjectControllers.create = async (req, res) => {
    try {
        console.log("Recibiendo datos:", req.body); // Log para depurar
        const cleanData = mapToBackend(req.body);
        
        const newSubject = new Subject(cleanData);
        const saved = await newSubject.save();

        res.status(201).json({ message: "Materia creada", data: mapToFrontend(saved) });
    } catch (error) {
        console.error("Error create:", error);
        res.status(400).json({ message: "Error al crear materia", error: error.message });
    }
};

subjectControllers.getAll = async (req, res) => {
    try {
        const subjects = await Subject.find(); // Usamos Model directo
        const formattedData = subjects.map(item => mapToFrontend(item));
        res.json({ data: formattedData });
    } catch (error) {
        console.error("Error getAll:", error);
        res.status(500).json({ message: "Error interno", error: error.message });
    }
};

subjectControllers.getOne = async (req, res) => {
    try {
        const subject = await Subject.findById(req.params.id);
        if (!subject) return res.status(404).json({ message: "Materia no encontrada" });
        res.json({ data: mapToFrontend(subject) });
    } catch (error) {
        res.status(500).json({ message: "Error", error: error.message });
    }
};

subjectControllers.updateOne = async (req, res) => {
    try {
        const cleanData = mapToBackend(req.body);
        const updated = await Subject.findByIdAndUpdate(req.params.id, cleanData, { new: true });
        res.json({ message: "Materia actualizada", data: mapToFrontend(updated) });
    } catch (error) {
        res.status(400).json({ message: "Error al actualizar", error: error.message });
    }
};

subjectControllers.deleteOne = async (req, res) => {
    try {
        await Subject.findByIdAndDelete(req.params.id);
        res.json({ message: "Materia eliminada" });
    } catch (error) {
        res.status(500).json({ message: "Error", error: error.message });
    }
};

subjectControllers.getByGroupName = async (req, res) => {
    // Si tienes lógica compleja aquí, mantenla, pero usa mapToFrontend al responder
    res.json({ message: "Endpoint pendiente de refactorizar" });
};

export default subjectControllers;