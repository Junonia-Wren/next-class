import { error } from "console";
import scheduleDaos from "../daos/schedule.daos.js";

const scheduleControllers = {};

scheduleControllers.getAll = (req, res) => {
    scheduleDaos.getAll()
        .then((schedules) => {
            res.json({
                data: schedules
            })
        })
        .catch((error) => {
            res.json({
                message: "An ocurrierd a error",
                error: error
            })
        });

};


scheduleControllers.getOne = (req, res) => {
    scheduleDaos.getOne(req.params.schedule_id)
        .then((schedule) => {
            if (schedule != null)
                res.json({ data: schedule });
            else
                res.status(404).json({
                    data: { message: "Schedule not found." }
                });
        })
        .catch((error) => {
            res.json({
                message: "An ocurrierd a error",
                error: error
            });
        })


};

scheduleControllers.insertOne = (req, res) => {
    scheduleDaos.insertOne(req.body)
    .then((newSchedule)=>{
        res.status(201).json({
            message: "Schedule insert",
            data: newSchedule
        });
    })
    .catch((error)=>{
        res.status(404).json({
            message: "An ocurrierd an error",
            error: error
        })
    });

};

scheduleControllers.updateOne = (req, res)=>{
    scheduleDaos.updateOne(req.params.schedule_id, req.body)
    .then((updateSchedule)=>{
        if(updateSchedule){
            res.json({
                message : "Schedule Actualizado",
                data: updateSchedule
            });
        } else {
            res.status(404).json({
                message: "Schedule not found",
                error: error
            })
        }
    })
    .catch((error)=>{
        res.status(404).json({
            message: "Ah ocurrido un error",
            error: error
        })
    })
};

scheduleControllers.deleteOne =(req, res)=>{
    scheduleDaos.deleteOne(req.params.schedule_id)
    .then((deleteSchedule)=>{
        if(deleteSchedule){
            res.json({
                message: "Schedule deleted",
                data: deleteSchedule
            });
        } else {
            res.status(404).json({
                message: "Schedule not found",
                error: error
            });
        }
    })

    .catch((error)=>{
        res.json({
            message: "Ah ocurrido un error",
            error: error
        });
    });
};

export default scheduleControllers;