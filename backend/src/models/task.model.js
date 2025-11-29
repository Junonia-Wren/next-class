import { model, Schema } from "mongoose";

const taskSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String },
    dueDate: { type: Date, required: true },
    subject: {
        type: String,
        enum: [
            "Gestión de Proyectos II",
            "Integradora",
            "Programación de Aplicaciones Web",
            "Otro"
        ],
        required: true
    },
    grupo: {
        type: String,
        enum: [
            "1A", "1B", "2A", "2B", "3A", "3B", "4A", "4B",
            "5A", "5B", "6A", "6B", "8A", "8B", "9A", "9B", "10A", "10B","B"
        ],
        required: true
    },
    createdBy: {
        type: Schema.Types.String,
        ref: "User",
        required: true
    },
    completed: { type: Boolean, default: false }
}, { timestamps: true });

export default model("Task", taskSchema);