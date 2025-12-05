import { Task } from "../models/index.models.js";

const taskDaos = {};

taskDaos.getAll = async () => {
    return await Task.find()
        .populate("subject")
        .populate("group")
        .populate("createdBy");
};

taskDaos.getOne = async (task_id) => {
    return await Task.findById(task_id)
        .populate("subject")
        .populate("group")
        .populate("createdBy");
};

taskDaos.insertOne = async (data) => {
    return await Task.create(data);
};

taskDaos.updateOne = async (task_id, data) => {
    return await Task.findByIdAndUpdate(task_id, data, { new: true })
        .populate("subject")
        .populate("group")
        .populate("createdBy");
};

taskDaos.deleteOne = async (task_id) => {
    return await Task.findByIdAndDelete(task_id);
};

taskDaos.getByGroup = async (groupId) => {
    return await Task.find({ group: groupId })
        .populate("subject")
        .populate("createdBy")
        .populate("group");
};

taskDaos.markCompleted = async (task_id) => {
    return await Task.findByIdAndUpdate(
        task_id,
        { completed: true },
        { new: true }
    );
};

export default taskDaos;
