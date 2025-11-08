import Schedule from "../models/schedule.model.js";

const scheduleDaos = {};

scheduleDaos.getAll = async ()=>{
    const schedules = await Schedule.find();
    return schedules;
}

scheduleDaos.getOne = async (schedule_id)=>{
    const schedule = await Schedule.findOne({schedule_id:schedule_id});
    return schedule;
}

scheduleDaos.insertOne = async (data)=>{
    const newSchedule = await Schedule.create(data);
    return newSchedule;
}

scheduleDaos.updateOne = async (schedule_id,data)=>{
    const scheduleUpdate = await Schedule.findOneAndUpdate({schedule_id:schedule_id}, data);
    return scheduleUpdate;
}

scheduleDaos.deleteOne = async (schedule_id)=>{
    const scheduleDelete = await Schedule.findOneAndDelete({schedule_id: schedule_id});
    return scheduleDelete;
}

export default scheduleDaos;