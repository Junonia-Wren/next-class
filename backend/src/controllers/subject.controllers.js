import Subject from '../models/subject.model.js';

const subjectControllers = {};

// --- 1. DE FRONTEND A BACKEND ---
const mapToBackend = (data) => {
    return {
        name: data.nombre,
        teacher: data.teacherName,
        
        // CORRECCIÓN: Guardamos directo en 'profesorFoto' para coincidir con el Modelo
        profesorFoto: data.profesorFoto, 
        
        porcentajes: {
            ser: {
                valor: data.porcentajes?.ser?.valor === "" ? 0 : Number(data.porcentajes?.ser?.valor || 0),
                descripcion: data.porcentajes?.ser?.descripcion || ""
            },
            saber: {
                valor: data.porcentajes?.saber?.valor === "" ? 0 : Number(data.porcentajes?.saber?.valor || 0),
                descripcion: data.porcentajes?.saber?.descripcion || ""
            },
            saberHacer: {
                valor: data.porcentajes?.saberHacer?.valor === "" ? 0 : Number(data.porcentajes?.saberHacer?.valor || 0),
                descripcion: data.porcentajes?.saberHacer?.descripcion || ""
            }
        },
        unidades: data.unidades?.map(u => ({
            id: u.id,
            porcentaje: u.porcentaje === "" ? 0 : Number(u.porcentaje || 0),
            fechas: u.fechas || ""
        })) || [],
        notas: data.notas || ""
    };
};

// --- 2. DE BACKEND A FRONTEND ---
const mapToFrontend = (doc) => {
    if (!doc) return null;
    const data = doc._doc || doc; 

    return {
        id: data._id, 
        nombre: data.name || "Sin Nombre",
        teacherName: data.teacher || "Sin Profesor",
        
        // Leemos directo de 'profesorFoto'
        profesorFoto: data.profesorFoto || "", 
        
        porcentajes: {
            ser: data.porcentajes?.ser || { valor: 0, descripcion: "" },
            saber: data.porcentajes?.saber || { valor: 0, descripcion: "" },
            saberHacer: data.porcentajes?.saberHacer || { valor: 0, descripcion: "" }
        },
        unidades: data.unidades?.map(u => ({
            id: u.id,
            porcentaje: u.porcentaje || 0,
            fechas: u.fechas || ""
        })) || [],
        notas: data.notas || ""
    };
};

// --- CRUD ---

subjectControllers.create = async (req, res) => {
    try {
        const cleanData = mapToBackend(req.body);
        const newSubject = new Subject(cleanData);
        const saved = await newSubject.save();
        res.status(201).json({ message: "Materia creada", data: mapToFrontend(saved) });
    } catch (error) {
        res.status(400).json({ message: "Error al crear materia", error: error.message });
    }
};

subjectControllers.getAll = async (req, res) => {
    try {
        const subjects = await Subject.find(); 
        const formattedData = subjects.map(item => mapToFrontend(item));
        res.json({ data: formattedData });
    } catch (error) {
        res.status(500).json({ message: "Error interno", error: error.message });
    }
};

subjectControllers.getOne = async (req, res) => {
    try {
        const subject = await Subject.findById(req.params.id);
        if (!subject) return res.status(404).json({ message: "No encontrada" });
        res.json({ data: mapToFrontend(subject) });
    } catch (error) {
        res.status(500).json({ message: "Error", error: error.message });
    }
};

subjectControllers.updateOne = async (req, res) => {
    try {
        console.log("Guardando imagen...", req.body.profesorFoto ? "Sí (Base64)" : "No");
        
        const cleanData = mapToBackend(req.body);
        const updated = await Subject.findByIdAndUpdate(req.params.id, cleanData, { new: true });
        
        res.json({ message: "Actualizado", data: mapToFrontend(updated) });
    } catch (error) {
        res.status(400).json({ message: "Error al actualizar", error: error.message });
    }
};

subjectControllers.deleteOne = async (req, res) => {
    try {
        await Subject.findByIdAndDelete(req.params.id);
        res.json({ message: "Eliminado" });
    } catch (error) {
        res.status(500).json({ message: "Error", error: error.message });
    }
};

subjectControllers.getByGroupName = async (req, res) => {
    res.json({ message: "Endpoint pendiente" });
};

export default subjectControllers;