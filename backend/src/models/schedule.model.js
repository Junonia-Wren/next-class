import { model, Schema } from "mongoose";

const scheduleSchema = new Schema({
    schedule_id: {
        type: String,
        required: true,
        unique: true
    },
    area: {
        type: String,
        enum: ["DSM", "EVND"],
        required: true
    },
    nivel: {
        type: String,
        enum: ["Técnico", "Ingeniería"],
        required: true
    },
    grupo: {
        type: String,
        required: true
    },
    subject: String,
    teacher: String,
    classroom: String,
    day: {
        type: String,
        enum: ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"]
    },
    startTime: String,
    endTime: String,
    roomImage: String
}, {
    versionKey: false,
    timestamps: true
});

export default model("schedule", scheduleSchema);