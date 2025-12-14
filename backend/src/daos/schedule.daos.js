import { Schedule } from "../models/index.models.js";

const scheduleDaos = {};

scheduleDaos.getAll = async () => {
    return await Schedule.find()
        .populate("group")
        .populate("subject")
        .populate("teacher");
};

scheduleDaos.getOne = async (id) => {
    return await Schedule.findById(id)
        .populate("group")
        .populate("subject")
        .populate("teacher");
};

scheduleDaos.insertOne = async (data) => {
    return await Schedule.create(data);
};

// Detecta conflicto de horario real
scheduleDaos.findTimeConflict = async (groupId, day, start, end) => {
    return await Schedule.findOne({
        group: groupId,
        day,
        $or: [
            { startTime: { $lt: end }, endTime: { $gt: start } }
        ]
    });
};

scheduleDaos.updateOne = async (id, data) => {
    return await Schedule.findByIdAndUpdate(id, data, { new: true });
};

scheduleDaos.deleteOne = async (id) => {
    return await Schedule.findByIdAndDelete(id);
};

scheduleDaos.getByGroup = async (groupId) => {
    return await Schedule.find({ group: groupId })
        .populate("subject")
        .populate("teacher")
        .populate("group");
};

export default scheduleDaos;
