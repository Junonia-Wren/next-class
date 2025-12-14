import { model, Schema } from "mongoose";

const activitySchema = new Schema(
  {
    type: { 
        type: String, 
        enum: ['REGISTRO', 'TAREA', 'CLASE'], 
        required: true 
    },
    message: { 
        type: String, 
        required: true 
    }
  },
  { timestamps: true } // Esto guarda automáticamente la fecha (createdAt)
);

export default model("Activity", activitySchema);