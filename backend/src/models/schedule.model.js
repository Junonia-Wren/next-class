import { model, Schema } from "mongoose";

// Sub-esquema para cada celda (Hora)
const slotSchema = new Schema({
    time: { type: String, required: true }, // "7:00 - 8:00"
    subject: { type: Schema.Types.ObjectId, ref: "Subject", default: null },
    classroom: { type: String, default: "" }
}, { _id: false });

const scheduleSchema = new Schema(
  {
    // Un horario pertenece a un grupo específico
    group: { 
        type: Schema.Types.ObjectId, 
        ref: "Group", 
        required: true,
        unique: true 
    },
    
    // La matriz de la semana
    schedule: {
        Lunes: [slotSchema],
        Martes: [slotSchema],
        Miércoles: [slotSchema],
        Jueves: [slotSchema],
        Viernes: [slotSchema]
    }
  },
  { timestamps: true }
);

export default model("Schedule", scheduleSchema);