import { model, Schema } from "mongoose";

const subjectSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    teacher: { type: String, required: true, trim: true }, // Nombre del docente

    // CORREGIDO: Usamos el nombre en español para evitar confusiones
    profesorFoto: { 
        type: String, 
        default: "" 
    },

    porcentajes: {
      ser: {
        valor: { type: Number, default: 0 },
        descripcion: { type: String, default: "" }
      },
      saber: {
        valor: { type: Number, default: 0 },
        descripcion: { type: String, default: "" }
      },
      saberHacer: {
        valor: { type: Number, default: 0 },
        descripcion: { type: String, default: "" }
      }
    },

    unidades: [
      {
        id: { type: Number },
        porcentaje: { type: Number, default: 0 },
        fechas: { type: String, default: "" }
      }
    ],

    notas: { type: String, default: "" },
  },
  { timestamps: true }
);

export default model("Subject", subjectSchema);