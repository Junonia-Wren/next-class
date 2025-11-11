import Schedule from "../models/schedule.model.js";

const scheduleDaos = {};

// Obtener todos los horarios
scheduleDaos.getAll = async () => {
    const schedules = await Schedule.find();
    return schedules;
};

// Obtener un horario por ID personalizado
scheduleDaos.getOne = async (schedule_id) => {
    const schedule = await Schedule.findOne({ schedule_id: schedule_id });
    return schedule;
};

// Insertar nuevo horario
scheduleDaos.insertOne = async (data) => {
    const newSchedule = await Schedule.create(data);
    return newSchedule;
};

scheduleDaos.findTimeConflict = async (area, nivel, grupo, day, startTime, endTime) => {
    const conflict = await Schedule.findOne({
        area,
        nivel,
        grupo,
        day,
        $or: [
            { startTime: { $lt: endTime }, endTime: { $gt: startTime } }
        ]
    });
    return conflict;
};

// Actualizar horario por ID
scheduleDaos.updateOne = async (schedule_id, data) => {
    const scheduleUpdate = await Schedule.findOneAndUpdate(
        { schedule_id: schedule_id },
        data,
        { new: true }
    );
    return scheduleUpdate;
};

// Eliminar horario por ID
scheduleDaos.deleteOne = async (schedule_id) => {
    const scheduleDelete = await Schedule.findOneAndDelete({ schedule_id: schedule_id });
    return scheduleDelete;
};

// Obtener horarios por grupo completo (area, nivel, grupo)
scheduleDaos.getByGrupo = async (area, nivel, grupo) => {
    const schedules = await Schedule.find({ area, nivel, grupo });
    return schedules;
};

export default scheduleDaos;