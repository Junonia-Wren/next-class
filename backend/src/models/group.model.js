import { model, Schema } from "mongoose";

const groupSchema = new Schema(
  {
    level: { type: String, required: true },
    area: { type: String, required: true },
    // CORRECCIÓN: Quitamos 'unique: true'
    // El nombre "10A" puede repetirse si es de diferente área
    name: { 
        type: String, 
        required: true, 
        trim: true,
        uppercase: true 
    },

    students: [{ 
        type: Schema.Types.ObjectId, 
        ref: "User" 
    }]
  },
  { timestamps: true }
);

// Índice compuesto: Esto asegura que NO se repita "Ingeniería + Software + 10A",
// pero SÍ permite "Ingeniería + Negocios + 10A".
groupSchema.index({ level: 1, area: 1, name: 1 }, { unique: true });

export default model("Group", groupSchema);