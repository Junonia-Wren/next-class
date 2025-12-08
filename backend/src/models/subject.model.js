import { model, Schema } from "mongoose";

const subjectSchema = new Schema(
  {
    // === DATOS PRINCIPALES ===
    name: { 
        type: String, 
        required: true, 
        trim: true 
    },

    teacher: { 
        type: String, 
        required: true, 
        trim: true 
    },

    // === DATOS DE PERFIL VISUAL ===
    profesorFoto: { 
        type: String, 
        default: "" 
    },

    // === CRITERIOS DE EVALUACIÓN (NUMÉRICOS) ===
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

    // === UNIDADES ===
    unidades: [
      {
        id: { type: Number }, // Guardamos el ID visual (1, 2, 3...)
        porcentaje: { type: Number, default: 0 },
        fechas: { type: String, default: "" }
      }
    ],

    // === EXTRAS ===
    notas: { 
        type: String, 
        default: "" 
    }
    
    // Se eliminó 'groups' como solicitaste.
  },
  { timestamps: true }
);

export default model("Subject", subjectSchema);