import Schedule from "../models/schedule.model.js";
import Group from "../models/group.model.js";
import User from "../models/user.model.js";

const scheduleControllers = {};

// ==========================================
// 1. RUTAS LIBRES (CONSULTA)
// ==========================================

// Obtener todos los horarios
scheduleControllers.getAll = async (req, res) => {
    try {
        const schedules = await Schedule.find()
            .populate('group', 'name level area') // Ver info del grupo
            .populate('schedule.Lunes.subject')   // Ver nombres de materias
            .populate('schedule.Martes.subject')
            .populate('schedule.Miércoles.subject')
            .populate('schedule.Jueves.subject')
            .populate('schedule.Viernes.subject');
            
        res.json({ data: schedules });
    } catch (error) {
        res.status(500).json({ message: "Error al obtener horarios", error: error.message });
    }
};

// Obtener uno por ID del Horario (_id)
scheduleControllers.getOne = async (req, res) => {
    try {
        const { schedule_id } = req.params;
        const schedule = await Schedule.findById(schedule_id)
            .populate('group')
            .populate('schedule.Lunes.subject'); // (Agrega los demás días si es necesario)
            
        if (!schedule) return res.status(404).json({ message: "Horario no encontrado" });
        
        res.json({ data: schedule });
    } catch (error) {
        res.status(500).json({ message: "Error", error: error.message });
    }
};

// Obtener por Nombre de Grupo (query param ?name=10A)
scheduleControllers.getByGrupoName = async (req, res) => {
    try {
        const { name } = req.query; // Se recibe por ?name=...
        if (!name) return res.status(400).json({ message: "Falta el nombre del grupo" });

        // 1. Buscamos el grupo primero
        const group = await Group.findOne({ name: name }); // Ajusta si buscas por '10A' exacto
        if (!group) return res.status(404).json({ message: "Grupo no existe" });

        // 2. Buscamos el horario de ese grupo
        const schedule = await Schedule.findOne({ group: group._id })
            .populate('schedule.Lunes.subject'); // Populate necesario

        if (!schedule) return res.status(404).json({ message: "Este grupo no tiene horario asignado" });

        res.json({ data: schedule });
    } catch (error) {
        res.status(500).json({ message: "Error", error: error.message });
    }
};

// ★ LÓGICA CLAVE: Obtener horario del alumno logueado (por matrícula)
scheduleControllers.getHorarioAlumno = async (req, res) => {
    try {
        const { matricula } = req.params;

        // 1. Buscar al alumno
        const user = await User.findOne({ matricula });
        if (!user) return res.status(404).json({ message: "Alumno no encontrado" });

        // 2. Buscar grupo
        const group = await Group.findOne({ students: user._id });
        if (!group) return res.status(404).json({ message: "No estás asignado a ningún grupo" });

        // 3. Buscar horario
        const schedule = await Schedule.findOne({ group: group._id })
            .populate('schedule.Lunes.subject')
            .populate('schedule.Martes.subject')
            .populate('schedule.Miércoles.subject')
            .populate('schedule.Jueves.subject')
            .populate('schedule.Viernes.subject');

        // Aunque no tenga horario, devolvemos info del alumno y grupo
        // Agregamos 'studentName' a la respuesta
        res.json({ 
            data: schedule, 
            groupInfo: group,
            studentName: user.name // <--- ESTO ES LO NUEVO
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al cargar tu horario", error: error.message });
    }
};


// ==========================================
// 2. RUTAS PROTEGIDAS (ADMIN)
// ==========================================

// Insertar Nuevo Horario
scheduleControllers.insertOne = async (req, res) => {
    try {
        const { group, schedule } = req.body; // Recibe ID del grupo y la matriz

        // Verificar si ya existe para no duplicar
        const existing = await Schedule.findOne({ group });
        if (existing) return res.status(400).json({ message: "Este grupo ya tiene un horario. Usa actualizar." });

        const newSchedule = new Schedule({ group, schedule });
        await newSchedule.save();

        res.status(201).json({ message: "Horario creado exitosamente", data: newSchedule });
    } catch (error) {
        res.status(400).json({ message: "Error al crear horario", error: error.message });
    }
};

// Actualizar Horario
scheduleControllers.updateOne = async (req, res) => {
    try {
        const { schedule_id } = req.params;
        const { schedule } = req.body; // Solo actualizamos la matriz de días

        const updated = await Schedule.findByIdAndUpdate(
            schedule_id, 
            { schedule }, 
            { new: true }
        );

        if (!updated) return res.status(404).json({ message: "Horario no encontrado" });

        res.json({ message: "Horario actualizado", data: updated });
    } catch (error) {
        res.status(400).json({ message: "Error al actualizar", error: error.message });
    }
};

// Eliminar Horario
scheduleControllers.deleteOne = async (req, res) => {
    try {
        const { schedule_id } = req.params;
        await Schedule.findByIdAndDelete(schedule_id);
        res.json({ message: "Horario eliminado" });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar", error: error.message });
    }
};

export default scheduleControllers;