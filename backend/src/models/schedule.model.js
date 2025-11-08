import { model, Schema } from "mongoose";

const scheduleSchema = new Schema({

    schedule_id:{
    type: String,
    required: true,
    unique: true
},
    subject: String,//Materia
    teacher: String,
    classroom: String,//salon
    day: String,
    startTime: String,
    endTime: String,
    roomImage: String
},
{
    versionKey:false,
    timestamps:true
});

export default model("schedule", scheduleSchema);